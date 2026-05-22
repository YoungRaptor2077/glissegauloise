import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { createServerClient } from "@supabase/ssr";
import { rateLimit, getRateLimitKey } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const rateLimitKey = getRateLimitKey(request, "referral-apply");
    if (!rateLimit(rateLimitKey, 5, 60000)) {
      return NextResponse.json({ error: "Trop de tentatives. Reessayez dans 1 minute." }, { status: 429 });
    }

    const body = await request.json();
    const { referralCode } = body;

    if (!referralCode) {
      return NextResponse.json({ error: "Code manquant" }, { status: 400 });
    }

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

    // Find the referrer by their referral code
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: referrer } = await (supabase.from("profiles") as any)
      .select("id, loyalty_points, referral_count")
      .eq("referral_code", referralCode)
      .single();

    if (!referrer) {
      return NextResponse.json({ error: "Code invalide" }, { status: 400 });
    }

    // Don't let users refer themselves
    if (referrer.id === user.id) {
      return NextResponse.json({ error: "Vous ne pouvez pas vous parrainer" }, { status: 400 });
    }

    // Check if this user was already referred
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existingProfile } = await (supabase.from("profiles") as any)
      .select("referred_by")
      .eq("id", user.id)
      .single();

    if (existingProfile?.referred_by) {
      return NextResponse.json({ error: "Parrainage deja utilise" }, { status: 400 });
    }

    // Give 30 points to the referrer
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("profiles") as any)
      .update({
        loyalty_points: (referrer.loyalty_points || 0) + 30,
        referral_count: (referrer.referral_count || 0) + 1,
      })
      .eq("id", referrer.id);

    // Give 10 points to the new user and mark as referred
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: newUserProfile } = await (supabase.from("profiles") as any)
      .select("loyalty_points")
      .eq("id", user.id)
      .single();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("profiles") as any)
      .update({
        loyalty_points: (newUserProfile?.loyalty_points || 0) + 10,
        referred_by: referrer.id,
      })
      .eq("id", user.id);

    // Notify the referrer
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("notifications") as any)
      .insert({
        user_id: referrer.id,
        title: "Parrainage reussi !",
        message: `Votre filleul vient de s'inscrire ! +30 points de fidelite.`,
        type: "referral",
        is_read: false,
      });

    return NextResponse.json({ success: true, pointsEarned: 10 });
  } catch (error) {
    console.error("Referral apply error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
