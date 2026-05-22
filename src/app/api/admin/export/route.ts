import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type"); // "clients" or "orders"

  const supabase = createServiceClient();

  if (type === "clients") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase.from("profiles") as any)
      .select("full_name, email, phone, address, city, postal_code, loyalty_points, created_at")
      .order("created_at", { ascending: false });

    const rows = data || [];
    const csv = [
      "Nom,Email,Telephone,Adresse,Ville,Code Postal,Points,Inscription",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...rows.map((r: any) =>
        `"${r.full_name || ""}","${r.email || ""}","${r.phone || ""}","${r.address || ""}","${r.city || ""}","${r.postal_code || ""}",${r.loyalty_points || 0},"${r.created_at || ""}"`
      ),
    ].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename=clients_${new Date().toISOString().split("T")[0]}.csv`,
      },
    });
  }

  if (type === "orders") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase.from("orders") as any)
      .select("id, status, total, customer_email, customer_name, created_at")
      .order("created_at", { ascending: false });

    const rows = data || [];
    const csv = [
      "Commande,Statut,Total,Email,Nom,Date",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...rows.map((r: any) =>
        `"GG-${(r.id || "").substring(0, 4).toUpperCase()}","${r.status || ""}",${r.total || 0},"${r.customer_email || ""}","${r.customer_name || ""}","${r.created_at || ""}"`
      ),
    ].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename=commandes_${new Date().toISOString().split("T")[0]}.csv`,
      },
    });
  }

  return NextResponse.json({ error: "Type invalide" }, { status: 400 });
}
