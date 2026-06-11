import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import webpush from "web-push";

export async function POST(request: NextRequest) {
  try {
    // Only allow internal calls (check for a secret or just trust server-side usage)
    const body = await request.json();
    const { title, body: notifBody, url } = body;

    if (!title) {
      return NextResponse.json({ error: "Title requis" }, { status: 400 });
    }

    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

    if (!vapidPublicKey || !vapidPrivateKey) {
      console.error("VAPID keys not configured");
      return NextResponse.json(
        { error: "Push non configure" },
        { status: 500 }
      );
    }

    webpush.setVapidDetails(
      "mailto:gdrmathis15@gmail.com",
      vapidPublicKey,
      vapidPrivateKey
    );

    const supabase = createServiceClient();

    // Fetch all push subscriptions
    const { data: subscriptions, error } = await supabase
      .from("push_subscriptions")
      .select("id, subscription, endpoint");

    if (error || !subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ sent: 0 });
    }

    const payload = JSON.stringify({
      title,
      body: notifBody || "",
      url: url || "/admin",
    });

    let sent = 0;
    const expired: string[] = [];

    for (const sub of subscriptions) {
      try {
        await webpush.sendNotification(
          sub.subscription as unknown as webpush.PushSubscription,
          payload
        );
        sent++;
      } catch (err: unknown) {
        const statusCode = (err as { statusCode?: number })?.statusCode;
        // 410 Gone or 404 means subscription is expired
        if (statusCode === 410 || statusCode === 404) {
          expired.push(sub.id);
        }
      }
    }

    // Clean up expired subscriptions
    if (expired.length > 0) {
      await supabase.from("push_subscriptions").delete().in("id", expired);
    }

    return NextResponse.json({ sent });
  } catch (error) {
    console.error("Push send error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
