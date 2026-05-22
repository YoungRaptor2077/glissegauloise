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
            await resend.emails.send({
              from: "GlisseGauloisse <noreply@glissegauloisse.com>",
              to: profile.email,
              subject: `Votre devis GlisseGauloisse - ${quote.total?.toFixed(2)} EUR`,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f5f5f0; padding: 40px; border-radius: 16px;">
                  <h1 style="color: #00ff88; font-size: 24px; margin-bottom: 20px;">Votre devis est pret</h1>
                  <p>Bonjour ${profile.full_name || ""},</p>
                  <p>Votre devis d'un montant de <strong>${quote.total?.toFixed(2)} EUR</strong> est disponible.</p>
                  <p>Vous pouvez regler en ligne en cliquant sur le bouton ci-dessous :</p>
                  <p style="margin: 30px 0;">
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
