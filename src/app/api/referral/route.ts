import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: NextRequest) {
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

    // Check if user already has a referral code in profile
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profile } = await (supabase.from("profiles") as any)
      .select("referral_code, referral_count, loyalty_points")
      .eq("id", user.id)
      .single();

    let referralCode = profile?.referral_code;

    // Generate one if missing
    if (!referralCode) {
      referralCode = `GG-${user.id.substring(0, 6).toUpperCase()}`;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from("profiles") as any)
        .update({ referral_code: referralCode })
        .eq("id", user.id);
    }

    return NextResponse.json({
      code: referralCode,
      referralCount: profile?.referral_count || 0,
      link: `https://glissegauloisse.com/connexion?ref=${referralCode}`,
    });
  } catch (error) {
    console.error("Referral API error:", error);
    return NextResponse.json({ code: null, referralCount: 0, link: "" });
  }
}
