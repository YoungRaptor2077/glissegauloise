import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST(request: NextRequest) {
  try {
    // Simple admin check - admin_session cookie
    const adminCookie = request.cookies.get("admin_session");
    if (!adminCookie || adminCookie.value !== "authenticated") {
      // Fallback: check Supabase auth for admin email
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const adminEmails = ["gdrmathis15@gmail.com", "vanderieviere76@gmail.com"];
      if (!user || !adminEmails.includes(user.email || "")) {
        return NextResponse.json({ error: "Non autorise" }, { status: 403 });
      }
    }

    // Get user ID if available (optional, column is nullable)
    let userId: string | null = null;
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id || null;
    } catch {
      // No user, that's fine
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
