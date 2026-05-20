import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

const DEFAULT_SETTINGS = {
  points_per_euro: 1,
  reward_threshold: 100,
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
    const { points_per_euro, reward_threshold, reward_percent } = body;

    if (
      typeof points_per_euro !== "number" ||
      typeof reward_threshold !== "number" ||
      typeof reward_percent !== "number"
    ) {
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
        .update({ points_per_euro, reward_threshold, reward_percent })
        .eq("id", existing.id);

      if (error) {
        return NextResponse.json({ error: "Erreur lors de la mise a jour" }, { status: 500 });
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from("loyalty_settings") as any)
        .insert({ points_per_euro, reward_threshold, reward_percent });

      if (error) {
        return NextResponse.json({ error: "Erreur lors de la creation" }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, points_per_euro, reward_threshold, reward_percent });
  } catch {
    return NextResponse.json(DEFAULT_SETTINGS);
  }
}
