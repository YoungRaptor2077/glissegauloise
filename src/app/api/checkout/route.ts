import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/service";

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

    const supabase = createServiceClient();

    // Validate prices server-side from Supabase products table
    const lineItems = [];
    for (const item of items) {
      const { data: catalogProduct } = await supabase
        .from("products")
        .select("id, name, price, is_active, stock")
        .eq("id", item.id)
        .single() as { data: { id: string; name: string; price: number; is_active: boolean; stock: number } | null };

      if (!catalogProduct) {
        return NextResponse.json(
          { error: `Produit inconnu: ${item.id}` },
          { status: 400 }
        );
      }

      if (!catalogProduct.is_active) {
        return NextResponse.json(
          { error: `Produit indisponible: ${catalogProduct.name}` },
          { status: 400 }
        );
      }

      if (catalogProduct.stock < item.quantity) {
        return NextResponse.json(
          { error: `Stock insuffisant pour: ${catalogProduct.name}` },
          { status: 400 }
        );
      }

      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: catalogProduct.name,
            ...(item.image && { images: [item.image] }),
          },
          unit_amount: Math.round(catalogProduct.price * 100),
        },
        quantity: item.quantity,
      });
    }

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
            fixed_amount: { amount: 0, currency: "eur" },
            display_name: "Retrait en boutique (gratuit)",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 1 },
              maximum: { unit: "business_day", value: 2 },
            },
          },
        },
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
