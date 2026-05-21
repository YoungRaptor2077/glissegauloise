import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, repairId, clientEmail, clientName, description } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Montant invalide" }, { status: 400 });
    }

    const stripe = getStripe();

    // Create a one-time price
    const price = await stripe.prices.create({
      unit_amount: Math.round(amount * 100),
      currency: "eur",
      product_data: {
        name: description || `Acompte reparation GlisseGauloisse`,
      },
    });

    // Create a payment link
    const paymentLink = await stripe.paymentLinks.create({
      line_items: [{ price: price.id, quantity: 1 }],
      metadata: {
        repair_id: repairId || "",
        client_email: clientEmail || "",
        client_name: clientName || "",
        type: "deposit",
      },
      after_completion: {
        type: "redirect",
        redirect: { url: "https://glissegauloisse.com/checkout/success?type=deposit" },
      },
    });

    return NextResponse.json({
      success: true,
      url: paymentLink.url,
      amount,
    });
  } catch (error) {
    console.error("Payment link error:", error);
    return NextResponse.json({ error: "Erreur lors de la creation du lien" }, { status: 500 });
  }
}
