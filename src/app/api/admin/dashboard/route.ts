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
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    // Orders this month (not cancelled)
    const { data: monthOrders } = await supabase
      .from("orders")
      .select("*")
      .gte("created_at", startOfMonth)
      .neq("status", "cancelled");

    const orderCount = monthOrders?.length || 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const revenue = monthOrders?.reduce((sum: number, o: any) => sum + (o.total || 0), 0) || 0;

    // Active repairs
    const { count: repairCount } = await supabase
      .from("repairs")
      .select("*", { count: "exact", head: true })
      .in("status", ["received", "diagnostic", "waiting_parts", "in_progress", "testing"]);

    // New clients this month
    const { count: clientCount } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfMonth);

    // Recent orders (4)
    const { data: recentOrdersRaw } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(4);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let recentOrders: any[] = [];
    if (recentOrdersRaw && recentOrdersRaw.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const orderUserIds = [...new Set(recentOrdersRaw.map((o: any) => o.user_id).filter(Boolean))];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const profileMap: Record<string, any> = {};
      if (orderUserIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", orderUserIds);
        if (profiles) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          profiles.forEach((p: any) => { profileMap[p.id] = p; });
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recentOrders = recentOrdersRaw.map((o: any) => ({
        id: o.id.substring(0, 8).toUpperCase(),
        client: (o.user_id && profileMap[o.user_id]?.full_name) || "Client",
        total: o.total,
        status: o.status,
        date: new Date(o.created_at).toLocaleDateString("fr-FR"),
      }));
    }

    // Recent repairs (3)
    const { data: recentRepairsRaw } = await supabase
      .from("repairs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(3);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let recentRepairs: any[] = [];
    if (recentRepairsRaw && recentRepairsRaw.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const repairUserIds = [...new Set(recentRepairsRaw.map((r: any) => r.user_id).filter(Boolean))];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const repairProfileMap: Record<string, any> = {};
      if (repairUserIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", repairUserIds);
        if (profiles) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          profiles.forEach((p: any) => { repairProfileMap[p.id] = p; });
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recentRepairs = recentRepairsRaw.map((r: any) => ({
        id: r.id.substring(0, 8).toUpperCase(),
        client: (r.user_id && repairProfileMap[r.user_id]?.full_name) || "Client",
        board: `${r.brand || ""} ${r.model || ""}`.trim(),
        status: r.status,
        date: new Date(r.created_at).toLocaleDateString("fr-FR"),
      }));
    }

    return NextResponse.json({
      revenue,
      orderCount,
      repairCount: repairCount || 0,
      clientCount: clientCount || 0,
      recentOrders,
      recentRepairs,
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
