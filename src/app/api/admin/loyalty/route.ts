import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

const DEFAULT_SETTINGS = {
  points_per_euro: 1,
  reward_threshold: 250,
  reward_percent: 10,
};

export async function GET() {
  try {
    const supabase = createServiceClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.from("loyalty_settings") as any)
      .select("*")
      .limit(1)
      .single();

    if (error || !data) {
      return NextResponse.json(DEFAULT_SETTINGS);
    }

    return NextResponse.json({
      points_per_euro: data.points_per_euro ?? DEFAULT_SETTINGS.points_per_euro,
      reward_threshold: data.reward_threshold ?? DEFAULT_SETTINGS.reward_threshold,
      reward_percent: data.reward_percent ?? DEFAULT_SETTINGS.reward_percent,
    });
  } catch {
    return NextResponse.json(DEFAULT_SETTINGS);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const points_per_euro = Math.round(Number(body.points_per_euro));
    const reward_threshold = Math.round(Number(body.reward_threshold));
    const reward_percent = Math.round(Number(body.reward_percent));

    if (isNaN(points_per_euro) || isNaN(reward_threshold) || isNaN(reward_percent)) {
      return NextResponse.json({ error: "Parametres invalides" }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Try to update existing row, or insert if none exists
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existing } = await (supabase.from("loyalty_settings") as any)
      .select("id")
      .limit(1)
      .single();

    if (existing) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from("loyalty_settings") as any)
        .update({ points_per_euro, reward_threshold, reward_percent, updated_at: new Date().toISOString() })
        .eq("id", existing.id);

      if (error) {
        console.error("Loyalty update error:", error);
        return NextResponse.json({ error: "Erreur: " + error.message }, { status: 500 });
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from("loyalty_settings") as any)
        .insert({ points_per_euro, reward_threshold, reward_percent });

      if (error) {
        console.error("Loyalty insert error:", error);
        return NextResponse.json({ error: "Erreur: " + error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, points_per_euro, reward_threshold, reward_percent });
  } catch (err) {
    console.error("Loyalty API catch error:", err);
    return NextResponse.json({ error: "Erreur serveur inattendue" }, { status: 500 });
  }
}
