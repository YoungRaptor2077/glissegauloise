import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST(request: NextRequest) {
  try {
    let userId: string | null = null;
    let isAuthorized = false;

    // Check 1: admin_session cookie (admin)
    const adminCookie = request.cookies.get("admin_session");
    if (adminCookie && adminCookie.value === "authenticated") {
      isAuthorized = true;
    }

    // Check 2: Supabase authenticated user (client or admin)
    if (!isAuthorized) {
      try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          isAuthorized = true;
          userId = user.id;
        }
      } catch {
        // Auth check failed
      }
    }

    // Parse body early to check for userId
    const body = await request.json();
    const { subscription, userId: bodyUserId } = body;

    // If userId provided in body, use it (client-side knows the user)
    if (bodyUserId) {
      userId = bodyUserId;
      isAuthorized = true; // If they have a userId, they're authenticated client-side
    }

    // If still not authorized, also try server auth one more time for admin
    if (!isAuthorized) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json({ error: "Subscription invalide" }, { status: 400 });
    }

    const serviceClient = createServiceClient();

    // Upsert - use service client to bypass RLS
    const { error } = await serviceClient
      .from("push_subscriptions")
      .upsert(
        {
          endpoint: subscription.endpoint,
          subscription: subscription,
          user_id: userId,
        },
        { onConflict: "endpoint" }
      );

    if (error) {
      console.error("Push subscription save error:", error);
      return NextResponse.json({ error: "Erreur enregistrement: " + error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Push subscribe error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
