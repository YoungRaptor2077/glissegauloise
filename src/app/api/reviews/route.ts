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
          getAll() { return cookieStore.getAll(); },
          setAll() {},
        },
      }
    );

    const { data: { user } } = await supabaseAuth.auth.getUser();
    const body = await request.json();
    const { rating, comment, repair_id } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Note invalide" }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Check if this repair already has a review
    if (repair_id && user) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: existingReview } = await (supabase.from("reviews") as any)
        .select("id")
        .eq("user_id", user.id)
        .eq("repair_id", repair_id)
        .single();

      if (existingReview) {
        return NextResponse.json({ error: "Vous avez deja note cette reparation" }, { status: 400 });
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("reviews") as any).insert({
      user_id: user?.id || null,
      repair_id: repair_id || null,
      rating,
      comment: comment || null,
      is_verified: !!user,
    });

    // If repair_id provided, mark repair as "closed" (definitively terminated)
    if (repair_id) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from("repairs") as any)
        .update({ status: "closed" })
        .eq("id", repair_id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Review API error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// GET reviews for a specific repair (used by admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const repairId = searchParams.get("repair_id");
    
    if (!repairId) {
      return NextResponse.json({ error: "repair_id requis" }, { status: 400 });
    }

    const supabase = createServiceClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: review } = await (supabase.from("reviews") as any)
      .select("*")
      .eq("repair_id", repairId)
      .single();

    return NextResponse.json({ review: review || null });
  } catch (error) {
    console.error("Review GET error:", error);
    return NextResponse.json({ review: null });
  }
}
