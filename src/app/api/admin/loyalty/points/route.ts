import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, email, points, reason } = body;

    if ((!user_id && !email) || !points) {
      return NextResponse.json({ error: "email (ou user_id) et points requis" }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Find user by email or user_id
    let profileQuery;
    if (user_id) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      profileQuery = await (supabase.from("profiles") as any)
        .select("id, loyalty_points, full_name")
        .eq("id", user_id)
        .single();
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      profileQuery = await (supabase.from("profiles") as any)
        .select("id, loyalty_points, full_name")
        .eq("email", email.toLowerCase().trim())
        .single();
    }

    const profile = profileQuery.data;

    if (!profile) {
      return NextResponse.json({ error: "Client introuvable avec cet email" }, { status: 404 });
    }

    const currentPoints = profile.loyalty_points || 0;
    const newPoints = Math.max(0, currentPoints + points);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("profiles") as any)
      .update({ loyalty_points: newPoints })
      .eq("id", profile.id);

    return NextResponse.json({
      success: true,
      previousPoints: currentPoints,
      pointsAdded: points,
      newTotal: newPoints,
      clientName: profile.full_name,
      reason: reason || null,
    });
  } catch (error) {
    console.error("Loyalty points error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
