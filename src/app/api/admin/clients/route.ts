import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { createClient } from "@/lib/supabase/server";

async function verifyAdmin() {
  const authClient = await createClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return null;

  const serviceClient = createServiceClient();
  const { data: profile } = await serviceClient
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const profileRole = (profile as { role: string } | null)?.role;
  if (!profileRole || !["admin", "super_admin"].includes(profileRole)) return null;
  return user;
}

export async function GET() {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const supabase = createServiceClient();

    // Fetch all customer profiles
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, full_name, email, phone, created_at")
      .eq("role", "customer");

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
      return NextResponse.json(
        { error: "Erreur lors de la recuperation des clients" },
        { status: 500 }
      );
    }

    if (!profiles || profiles.length === 0) {
      return NextResponse.json({ clients: [] });
    }

    const userIds = profiles.map((p) => p.id);

    // Get order counts and totals grouped by user_id
    const { data: orders } = await supabase
      .from("orders")
      .select("user_id, total")
      .in("user_id", userIds);

    // Get repair counts grouped by user_id
    const { data: repairs } = await supabase
      .from("repairs")
      .select("user_id")
      .in("user_id", userIds);

    // Aggregate order counts and totals
    const orderStats = new Map<string, { count: number; totalSpent: number }>();
    if (orders) {
      for (const order of orders) {
        if (!order.user_id) continue;
        const stats = orderStats.get(order.user_id) || { count: 0, totalSpent: 0 };
        stats.count += 1;
        stats.totalSpent += Number(order.total) || 0;
        orderStats.set(order.user_id, stats);
      }
    }

    // Aggregate repair counts
    const repairCounts = new Map<string, number>();
    if (repairs) {
      for (const repair of repairs) {
        if (!repair.user_id) continue;
        repairCounts.set(repair.user_id, (repairCounts.get(repair.user_id) || 0) + 1);
      }
    }

    // Build enriched client list
    const clients = profiles.map((profile) => {
      const stats = orderStats.get(profile.id) || { count: 0, totalSpent: 0 };
      return {
        id: profile.id,
        name: profile.full_name,
        email: profile.email,
        phone: profile.phone,
        orders: stats.count,
        repairs: repairCounts.get(profile.id) || 0,
        totalSpent: stats.totalSpent,
        createdAt: profile.created_at,
      };
    });

    return NextResponse.json({ clients });
  } catch (error) {
    console.error("Clients fetch error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la recuperation des clients" },
      { status: 500 }
    );
  }
}
