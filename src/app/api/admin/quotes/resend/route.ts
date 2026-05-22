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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: quote } = await (supabase.from("quotes") as any)
      .select("*")
      .eq("id", quoteId)
      .single();

    if (!quote) {
      return NextResponse.json({ error: "Devis introuvable" }, { status: 404 });
    }

    if (!quote.payment_url) {
      return NextResponse.json({ error: "Pas de lien de paiement" }, { status: 400 });
    }

    // Get client info
    if (!quote.user_id) {
      return NextResponse.json({ error: "Pas de client associe" }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profile } = await (supabase.from("profiles") as any)
      .select("email, full_name")
      .eq("id", quote.user_id)
      .single();

    if (!profile?.email) {
      return NextResponse.json({ error: "Email du client introuvable" }, { status: 400 });
    }

    // Resend email
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      
      await resend.emails.send({
        from: "GlisseGauloisse <noreply@glissegauloisse.com>",
        to: profile.email,
        subject: `Rappel - Votre devis GlisseGauloisse - ${quote.total?.toFixed(2)} EUR`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f5f5f0; padding: 40px; border-radius: 16px;">
            <h1 style="color: #00ff88; font-size: 24px; margin-bottom: 20px;">Rappel : votre devis</h1>
            <p>Bonjour ${profile.full_name || ""},</p>
            <p>Votre devis d'un montant de <strong>${quote.total?.toFixed(2)} EUR</strong> est toujours en attente de paiement.</p>
            <p>Cliquez ci-dessous pour regler :</p>
            <p style="margin: 30px 0;">
              <a href="${quote.payment_url}" style="display: inline-block; background: #00ff88; color: #0a0a0a; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">Payer maintenant</a>
            </p>
            <p style="color: #888; font-size: 13px;">Paiement securise par Stripe. Possibilite de payer en 3 fois sans frais.</p>
            <hr style="border: none; border-top: 1px solid #2a2a2a; margin: 30px 0;" />
            <p style="color: #888; font-size: 12px;">GlisseGauloisse - 49 Route de Margency, 95600 Eaubonne<br/>07 86 75 79 63</p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error("Email resend error:", emailErr);
      return NextResponse.json({ error: "Erreur envoi email" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Quote resend error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
