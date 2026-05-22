import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
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

    // Get user's loyalty points from profile
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profile } = await (supabase.from("profiles") as any)
      .select("loyalty_points")
      .eq("id", user.id)
      .single();

    const points = profile?.loyalty_points || 0;

    // Get loyalty settings
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: settings } = await (supabase.from("loyalty_settings") as any)
      .select("*")
      .limit(1)
      .single();

    const pointsPerEuro = settings?.points_per_euro || 1;
    const rewardThreshold = settings?.reward_threshold || 250;
    const rewardPercent = settings?.reward_percent || 10;

    // Calculate progress
    const progress = Math.min((points / rewardThreshold) * 100, 100);
    const pointsUntilReward = Math.max(rewardThreshold - points, 0);
    const hasReward = points >= rewardThreshold;

    return NextResponse.json({
      points,
      pointsPerEuro,
      rewardThreshold,
      rewardPercent,
      progress,
      pointsUntilReward,
      hasReward,
    });
  } catch (error) {
    console.error("Loyalty API error:", error);
    return NextResponse.json({ points: 0, progress: 0, rewardThreshold: 100, rewardPercent: 10, pointsUntilReward: 100, hasReward: false });
  }
}
