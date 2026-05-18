import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { products } from "@/lib/data/products";

interface CartItemPayload {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, customerEmail, shippingAddress } = body as {
      items: CartItemPayload[];
      customerEmail?: string;
      shippingAddress?: {
        name: string;
        address: string;
        city: string;
        postalCode: string;
        country: string;
      };
    };

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Le panier est vide" },
        { status: 400 }
      );
    }

    // Validate prices server-side from the product catalog
    const lineItems = items.map((item) => {
      const catalogProduct = products.find((p) => p.id === item.id);
      const verifiedPrice = catalogProduct ? catalogProduct.price : item.price;

      return {
        price_data: {
          currency: "eur",
          product_data: {
            name: catalogProduct ? catalogProduct.name : item.name,
            ...(item.image && { images: [item.image] }),
          },
          unit_amount: Math.round(verifiedPrice * 100),
        },
        quantity: item.quantity,
      };
    });

    const origin = request.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
      ...(customerEmail && { customer_email: customerEmail }),
      metadata: {
        items: JSON.stringify(
          items.map((i) => ({ id: i.id, qty: i.quantity }))
        ),
        ...(shippingAddress && {
          shipping_name: shippingAddress.name,
          shipping_address: shippingAddress.address,
          shipping_city: shippingAddress.city,
          shipping_postal: shippingAddress.postalCode,
          shipping_country: shippingAddress.country,
        }),
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 590, currency: "eur" },
            display_name: "Livraison standard",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 3 },
              maximum: { unit: "business_day", value: 5 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 990, currency: "eur" },
            display_name: "Livraison express",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 1 },
              maximum: { unit: "business_day", value: 2 },
            },
          },
        },
      ],
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la creation de la session de paiement" },
      { status: 500 }
    );
  }
}
