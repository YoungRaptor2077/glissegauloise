import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

function isAdminAuthenticated(request: NextRequest): boolean {
  const cookie = request.cookies.get("admin_session");
  return cookie?.value === "authenticated";
}

export async function POST(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { quoteId } = body;

    if (!quoteId) {
      return NextResponse.json({ error: "ID du devis manquant" }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Get the quote details
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: quote } = await (supabase.from("quotes") as any)
      .select("*")
      .eq("id", quoteId)
      .single();

    if (!quote) {
      return NextResponse.json({ error: "Devis introuvable" }, { status: 404 });
    }

    // Generate Stripe payment link
    const Stripe = (await import("stripe")).default;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-12-18.acacia" as any });

    const totalCents = Math.round((quote.total || 0) * 100);

    if (totalCents <= 0) {
      // Just update status without payment link
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from("quotes") as any)
        .update({ status: "sent" })
        .eq("id", quoteId);

      return NextResponse.json({ success: true, paymentUrl: null });
    }

    // Create a one-time price
    const price = await stripe.prices.create({
      unit_amount: totalCents,
      currency: "eur",
      product_data: {
        name: `Devis GlisseGauloisse #${quoteId.substring(0, 8).toUpperCase()}`,
      },
    });

    // Create payment link with allow_promotion_codes so loyalty discounts work
    const paymentLink = await stripe.paymentLinks.create({
      line_items: [{ price: price.id, quantity: 1 }],
      allow_promotion_codes: true,
      payment_method_types: ["card", "klarna"],
      metadata: {
        quote_id: quoteId,
        user_id: quote.user_id || "",
        type: "quote",
      },
      after_completion: {
        type: "redirect",
        redirect: { url: `https://glissegauloisse.com/checkout/success?type=quote&id=${quoteId}` },
      },
    });

    // Update quote status and store payment URL
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("quotes") as any)
      .update({ status: "sent", payment_url: paymentLink.url })
      .eq("id", quoteId);

    // Send email to client with payment link
    if (quote.user_id) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: profile } = await (supabase.from("profiles") as any)
        .select("email, full_name")
        .eq("id", quote.user_id)
        .single();

      if (profile?.email) {
        try {
          const { Resend } = await import("resend");
          const resend = new Resend(process.env.RESEND_API_KEY);
          if (resend) {
            // Build line items HTML
            const lineItems = quote.line_items || [];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const lineItemsHtml = lineItems.map((item: any) =>
              `<tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #2a2a2a; color: #f5f5f0;">${item.description || "Article"}${item.note ? `<br/><span style="font-size: 11px; color: #aaa; font-style: italic;">${item.note}</span>` : ""}${item.link ? `<br/><a href="${item.link}" target="_blank" rel="noopener noreferrer" style="display: inline-block; margin-top: 4px; padding: 2px 8px; background: rgba(0,255,136,0.1); color: #00ff88; font-size: 12px; border-radius: 4px; text-decoration: none;">Voir la piece</a><div style="margin-top: 6px; padding: 10px 12px; background: #1a1a1a; border-left: 3px solid #00ff88; border-radius: 6px; font-size: 13px; color: #ccc; line-height: 1.7;"><strong style="color: #f5f5f0; font-size: 13px;">Lors de votre commande, vous avez 2 options :</strong><br/>1. <span style="color: #f5f5f0;">Livraison chez vous</span> - Vous recevez la piece et vous nous la ramenez a l'atelier<br/>2. <span style="color: #f5f5f0;">Livraison directe a l'atelier</span> - Faites livrer au nom de GlisseGauloisse, 49 Route de Margency, 95600 Eaubonne</div>` : ""}</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #2a2a2a; color: #ccc; text-align: center;">${item.quantity || 1}</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #2a2a2a; color: #ccc; text-align: right;">${(item.unitPrice || 0).toFixed(2)} EUR</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #2a2a2a; color: #f5f5f0; text-align: right; font-weight: bold;">${((item.quantity || 1) * (item.unitPrice || 0)).toFixed(2)} EUR</td>
              </tr>`
            ).join("");

            const laborCost = quote.labor_cost || 0;
            const notesText = quote.notes ? `<p style="color: #aaa; font-size: 13px; margin-top: 16px;"><em>Notes : ${quote.notes}</em></p>` : "";

            await resend.emails.send({
              from: "GlisseGauloisse <noreply@glissegauloisse.com>",
              to: profile.email,
              subject: `Votre devis GlisseGauloisse - ${quote.total?.toFixed(2)} EUR`,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f5f5f0; padding: 40px; border-radius: 16px;">
                  <h1 style="color: #00ff88; font-size: 24px; margin-bottom: 20px;">Votre devis est pret</h1>
                  <p>Bonjour ${profile.full_name || ""},</p>
                  <p>Votre devis de <strong style="color: #00ff88;">${quote.total?.toFixed(2)} EUR</strong> est pret. Vous pouvez le regler en ligne :</p>

                  <p style="margin: 24px 0; text-align: center;">
                    <a href="${paymentLink.url}" style="display: inline-block; background: #00ff88; color: #0a0a0a; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 18px;">Payer maintenant</a>
                  </p>

                  <p style="color: #888; font-size: 13px; text-align: center; margin-bottom: 30px;">Paiement securise par Stripe. Possibilite de payer en 3 fois.</p>

                  <hr style="border: none; border-top: 1px solid #2a2a2a; margin: 20px 0;" />

                  <p style="color: #aaa; font-size: 14px;">Voici le detail de votre devis :</p>

                  <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
                    <thead>
                      <tr style="border-bottom: 2px solid #333;">
                        <th style="padding: 8px 0; text-align: left; color: #888;">Description</th>
                        <th style="padding: 8px 0; text-align: center; color: #888;">Qte</th>
                        <th style="padding: 8px 0; text-align: right; color: #888;">Prix unit.</th>
                        <th style="padding: 8px 0; text-align: right; color: #888;">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${lineItemsHtml}
                    </tbody>
                  </table>

                  <div style="background: #1a1a1a; padding: 16px; border-radius: 8px; margin: 20px 0;">
                    ${laborCost > 0 ? `<div style="display: flex; justify-content: space-between; margin-bottom: 8px;"><span style="color: #ccc;">Main d'oeuvre</span><span style="color: #f5f5f0;">${laborCost.toFixed(2)} EUR</span></div>` : ""}
                    <div style="display: flex; justify-content: space-between; padding-top: 8px; border-top: 1px solid #333;"><span style="color: #00ff88; font-weight: bold; font-size: 16px;">TOTAL</span><span style="color: #00ff88; font-weight: bold; font-size: 16px;">${quote.total?.toFixed(2)} EUR</span></div>
                  </div>

                  ${notesText}

                  <p style="margin-top: 24px;">Vous pouvez regler en ligne en cliquant sur le bouton ci-dessous :</p>
                  <p style="margin: 30px 0; text-align: center;">
                    <a href="${paymentLink.url}" style="display: inline-block; background: #00ff88; color: #0a0a0a; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">Payer maintenant</a>
                  </p>
                  <p style="color: #888; font-size: 13px;">Paiement securise par Stripe. Possibilite de payer en 3 fois.</p>
                  <hr style="border: none; border-top: 1px solid #2a2a2a; margin: 30px 0;" />
                  <p style="color: #888; font-size: 12px;">GlisseGauloisse - 49 Route de Margency, 95600 Eaubonne<br/>07 86 75 79 63</p>
                </div>
              `,
            });
          }
        } catch (emailErr) {
          console.error("Email send error for quote:", emailErr);
          // Non-blocking - quote is still sent even if email fails
        }
      }
    }

    return NextResponse.json({ success: true, paymentUrl: paymentLink.url });
  } catch (error) {
    console.error("Quote send error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
