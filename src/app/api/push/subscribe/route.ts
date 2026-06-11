import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();

    const supabaseAuth = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll() {},
        },
      }
    );

    // Check admin authentication - support both methods
    const adminCookie = request.cookies.get("admin_session");
    let userId: string | null = null;

    if (adminCookie?.value === "authenticated") {
      // Admin logged in via password - get user from Supabase Auth if available
      try {
        const { data: { user } } = await supabaseAuth.auth.getUser();
        userId = user?.id || null;
      } catch {
        // No Supabase user, but admin cookie is valid
      }
    } else {
      // Try Supabase Auth
      const { data: { user } } = await supabaseAuth.auth.getUser();
      if (!user) {
        return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
      }
      const adminEmails = ["gdrmathis15@gmail.com", "vanderieviere76@gmail.com"];
      if (!adminEmails.includes(user.email || "")) {
        return NextResponse.json({ error: "Non autorise" }, { status: 403 });
      }
      userId = user.id;
    }

    const body = await request.json();
    const { subscription } = body;

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json(
        { error: "Subscription invalide" },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // Upsert subscription (replace if same endpoint exists)
    const insertData: Record<string, unknown> = {
      subscription: subscription,
      endpoint: subscription.endpoint,
    };
    if (userId) {
      insertData.user_id = userId;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("push_subscriptions") as any).upsert(
      insertData,
      { onConflict: "endpoint" }
    );

    if (error) {
      console.error("Push subscription save error:", error);
      return NextResponse.json(
        { error: "Erreur lors de l'enregistrement" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Push subscribe error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
