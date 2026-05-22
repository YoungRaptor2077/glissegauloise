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

    return NextResponse.json({ success: true, paymentUrl: paymentLink.url });
  } catch (error) {
    console.error("Quote send error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
