import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { createServerClient } from "@supabase/ssr";

export async function POST(request: NextRequest) {
  try {
    const supabaseAuth = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll(); },
          setAll() {},
        },
      }
    );

    const { data: { user } } = await supabaseAuth.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
    }

    const supabase = createServiceClient();

    // Check if user already claimed Google bonus
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existingBonus } = await (supabase.from("notifications") as any)
      .select("id")
      .eq("user_id", user.id)
      .eq("type", "google_bonus")
      .limit(1);

    if (existingBonus && existingBonus.length > 0) {
      return NextResponse.json({ success: false, message: "Bonus deja utilise" });
    }

    // Add 20 points
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profile } = await (supabase.from("profiles") as any)
      .select("loyalty_points")
      .eq("id", user.id)
      .single();

    const currentPoints = profile?.loyalty_points || 0;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("profiles") as any)
      .update({ loyalty_points: currentPoints + 20 })
      .eq("id", user.id);

    // Mark as claimed by creating a notification
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("notifications") as any)
      .insert({
        user_id: user.id,
        title: "Bonus Google avis",
        message: "+20 points de fidelite pour votre avis Google !",
        type: "google_bonus",
        is_read: false,
      });

    return NextResponse.json({ success: true, pointsAdded: 20, newTotal: currentPoints + 20 });
  } catch (error) {
    console.error("Google bonus error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
