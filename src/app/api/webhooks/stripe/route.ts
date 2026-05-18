import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import type Stripe from "stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error("Webhook signature verification failed:", message);
      return NextResponse.json(
        { error: "Webhook signature verification failed" },
        { status: 400 }
      );
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("Payment succeeded:", paymentIntent.id);
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const metadata = session.metadata;

  console.log("Checkout completed:", {
    sessionId: session.id,
    customerEmail: session.customer_details?.email,
    amountTotal: session.amount_total,
    metadata,
  });

  // In production, this would create an order in Supabase:
  // const supabase = createServiceClient();
  // await supabase.from("orders").insert({
  //   user_id: userId,
  //   status: "confirmed",
  //   items: JSON.parse(metadata?.items || "[]"),
  //   subtotal: (session.amount_subtotal || 0) / 100,
  //   shipping_cost: (session.shipping_cost?.amount_total || 0) / 100,
  //   total: (session.amount_total || 0) / 100,
  //   shipping_address: {
  //     name: metadata?.shipping_name,
  //     address: metadata?.shipping_address,
  //     city: metadata?.shipping_city,
  //     postalCode: metadata?.shipping_postal,
  //     country: metadata?.shipping_country,
  //   },
  //   stripe_payment_intent_id: session.payment_intent as string,
  // });
}
