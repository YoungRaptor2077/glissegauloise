import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function GET() {
  try {
    const supabase = createServiceClient();

    // Fetch all reviews
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: reviews } = await (supabase.from("reviews") as any)
      .select("*")
      .order("created_at", { ascending: false });

    if (!reviews || reviews.length === 0) {
      return NextResponse.json({
        reviews: [],
        stats: { totalReviews: 0, averageRating: 0, ratingDistribution: {}, withComments: 0 },
      });
    }

    // Fetch user profiles for reviews
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userIds = [...new Set(reviews.map((r: any) => r.user_id).filter(Boolean))];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const profileMap: Record<string, any> = {};
    if (userIds.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: profiles } = await (supabase.from("profiles") as any)
        .select("id, full_name, email")
        .in("id", userIds);
      if (profiles) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        profiles.forEach((p: any) => { profileMap[p.id] = p; });
      }
    }

    // Fetch repair info for reviews with repair_id
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const repairIds = [...new Set(reviews.map((r: any) => r.repair_id).filter(Boolean))];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const repairMap: Record<string, any> = {};
    if (repairIds.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: repairs } = await (supabase.from("repairs") as any)
        .select("id, brand, model")
        .in("id", repairIds);
      if (repairs) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        repairs.forEach((r: any) => { repairMap[r.id] = r; });
      }
    }

    // Build enriched reviews
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const enrichedReviews = reviews.map((r: any) => {
      const profile = r.user_id ? profileMap[r.user_id] : null;
      const repair = r.repair_id ? repairMap[r.repair_id] : null;
      return {
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        created_at: r.created_at,
        user_name: profile?.full_name || null,
        user_email: profile?.email || null,
        repair_brand: repair?.brand || null,
        repair_model: repair?.model || null,
        repair_id: r.repair_id,
      };
    });

    // Calculate stats
    const totalReviews = reviews.length;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const averageRating = reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / totalReviews;
    const ratingDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reviews.forEach((r: any) => {
      ratingDistribution[r.rating] = (ratingDistribution[r.rating] || 0) + 1;
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const withComments = reviews.filter((r: any) => r.comment && r.comment.trim().length > 0).length;

    return NextResponse.json({
      reviews: enrichedReviews,
      stats: { totalReviews, averageRating, ratingDistribution, withComments },
    });
  } catch (error) {
    console.error("Admin reviews API error:", error);
    return NextResponse.json({
      reviews: [],
      stats: { totalReviews: 0, averageRating: 0, ratingDistribution: {}, withComments: 0 },
    });
  }
}
