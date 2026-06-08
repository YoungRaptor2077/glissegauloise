import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/service";
import { sendOrderConfirmationEmail } from "@/lib/email";
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

  const supabase = createServiceClient();

  // Determine payment type from metadata
  const paymentType = metadata?.type;
  const quoteId = metadata?.quote_id;

  // Handle quote payment - mark as accepted and add loyalty points
  if (paymentType === "quote" && quoteId) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("quotes") as any)
      .update({ status: "accepted" })
      .eq("id", quoteId);

    // Add loyalty points for the quote payment
    const quoteUserId = metadata?.user_id;
    if (quoteUserId) {
      const amountPaid = session.amount_total ? session.amount_total / 100 : 0;
      const pointsToAdd = Math.floor(amountPaid);

      if (pointsToAdd > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: quoteProfile } = await (supabase.from("profiles") as any)
          .select("loyalty_points")
          .eq("id", quoteUserId)
          .single();

        const currentQuotePoints = quoteProfile?.loyalty_points || 0;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from("profiles") as any)
          .update({ loyalty_points: currentQuotePoints + pointsToAdd })
          .eq("id", quoteUserId);
      }
    }

    return;
  }

  // Handle deposit payment - no order creation needed
  if (paymentType === "deposit") {
    return;
  }

  // Regular product order flow
  // Look up user by email if available
  let userId: string | null = null;
  if (session.customer_details?.email) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", session.customer_details.email)
      .single();
    userId = profile?.id ?? null;
  }

  const items = metadata?.items ? JSON.parse(metadata.items) : [];

  await supabase.from("orders").insert({
    user_id: userId,
    status: "confirmed",
    items: items,
    subtotal: (session.amount_subtotal || 0) / 100,
    shipping_cost: (session.shipping_cost?.amount_total || 0) / 100,
    total: (session.amount_total || 0) / 100,
    shipping_address: {
      name: metadata?.shipping_name || null,
      address: metadata?.shipping_address || null,
      city: metadata?.shipping_city || null,
      postalCode: metadata?.shipping_postal || null,
      country: metadata?.shipping_country || null,
    },
    stripe_payment_intent_id: session.payment_intent as string,
  });

  // Send order confirmation email
  const customerEmail = session.customer_details?.email;
  if (customerEmail) {
    const { data: orderData } = await supabase
      .from("orders")
      .select("id")
      .eq("stripe_payment_intent_id", session.payment_intent as string)
      .single();
    sendOrderConfirmationEmail(customerEmail, "", orderData?.id || "", session.amount_total ? session.amount_total / 100 : 0);
  }

  // Add loyalty points (1 point per euro spent)
  if (userId && session.amount_total) {
    const totalEuros = Math.floor(session.amount_total / 100);
    if (totalEuros > 0) {
      // Get loyalty settings for points_per_euro
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: settings } = await (supabase.from("loyalty_settings") as any)
        .select("points_per_euro")
        .limit(1)
        .single();
      const pointsPerEuro = settings?.points_per_euro || 1;
      const pointsToAdd = totalEuros * pointsPerEuro;

      // Increment user's loyalty points
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: currentProfile } = await (supabase.from("profiles") as any)
        .select("loyalty_points")
        .eq("id", userId)
        .single();
      const currentPoints = currentProfile?.loyalty_points || 0;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from("profiles") as any)
        .update({ loyalty_points: currentPoints + pointsToAdd })
        .eq("id", userId);
    }
  }

  // If a discount was applied, reset points (reward used)
  if (session.total_details?.breakdown?.discounts && session.total_details.breakdown.discounts.length > 0 && userId) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("profiles") as any)
      .update({ loyalty_points: 0 })
      .eq("id", userId);
  }
}
