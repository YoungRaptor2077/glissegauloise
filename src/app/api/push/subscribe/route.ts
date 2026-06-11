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
      // Try to get user ID from Supabase auth if available
      try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        userId = user?.id || null;
      } catch {
        // No user session, that's fine for admin
      }
    }

    // Check 2: Supabase authenticated user (client or admin)
    if (!isAuthorized) {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        isAuthorized = true;
        userId = user.id;
      }
    }

    // Not authenticated at all
    if (!isAuthorized) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const body = await request.json();
    const { subscription } = body;

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
