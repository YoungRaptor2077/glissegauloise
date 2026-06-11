import webpush from "web-push";
import { createServiceClient } from "@/lib/supabase/service";

export async function sendPushNotification(
  title: string,
  body: string,
  url?: string
) {
  try {
    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

    if (!vapidPublicKey || !vapidPrivateKey) {
      return;
    }

    webpush.setVapidDetails(
      "mailto:gdrmathis15@gmail.com",
      vapidPublicKey,
      vapidPrivateKey
    );

    const supabase = createServiceClient();

    const { data: subscriptions } = await supabase
      .from("push_subscriptions")
      .select("id, subscription, endpoint");

    if (!subscriptions || subscriptions.length === 0) {
      return;
    }

    const payload = JSON.stringify({
      title,
      body,
      url: url || "/admin",
    });

    const expired: string[] = [];

    for (const sub of subscriptions) {
      try {
        await webpush.sendNotification(
          sub.subscription as unknown as webpush.PushSubscription,
          payload
        );
      } catch (err: unknown) {
        const statusCode = (err as { statusCode?: number })?.statusCode;
        if (statusCode === 410 || statusCode === 404) {
          expired.push(sub.id);
        }
      }
    }

    if (expired.length > 0) {
      await supabase.from("push_subscriptions").delete().in("id", expired);
    }
  } catch {
    // Push notification failed, non-blocking
  }
}

export async function sendPushToUser(
  userId: string,
  title: string,
  body: string,
  url?: string
) {
  try {
    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

    if (!vapidPublicKey || !vapidPrivateKey) {
      return;
    }

    webpush.setVapidDetails(
      "mailto:gdrmathis15@gmail.com",
      vapidPublicKey,
      vapidPrivateKey
    );

    const supabase = createServiceClient();

    const { data: subscriptions } = await supabase
      .from("push_subscriptions")
      .select("id, subscription, endpoint")
      .eq("user_id", userId);

    if (!subscriptions || subscriptions.length === 0) {
      return;
    }

    const payload = JSON.stringify({
      title,
      body,
      url: url || "/espace-client",
    });

    const expired: string[] = [];

    for (const sub of subscriptions) {
      try {
        await webpush.sendNotification(
          sub.subscription as unknown as webpush.PushSubscription,
          payload
        );
      } catch (err: unknown) {
        const statusCode = (err as { statusCode?: number })?.statusCode;
        if (statusCode === 410 || statusCode === 404) {
          expired.push(sub.id);
        }
      }
    }

    if (expired.length > 0) {
      await supabase.from("push_subscriptions").delete().in("id", expired);
    }
  } catch {
    // Push notification failed, non-blocking
  }
}
