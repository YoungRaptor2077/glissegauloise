import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

function isAdminAuthenticated(request: NextRequest): boolean {
  const cookie = request.cookies.get("admin_session");
  return cookie?.value === "authenticated";
}

export async function POST(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { userId, repairId, validUntil, notes, lineItems, laborCost, total } = body;

    const supabase = createServiceClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.from("quotes") as any)
      .insert({
        user_id: userId || null,
        repair_id: repairId || null,
        status: "draft",
        line_items: lineItems,
        labor_cost: laborCost || 0,
        total: total || 0,
        notes: notes || "",
        valid_until: validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Auto-create a conversation for this user if one doesn't already exist
    if (userId) {
      try {
        const { data: existingConv } = await supabase
          .from("conversations")
          .select("id")
          .eq("user_id", userId)
          .limit(1)
          .single();

        if (!existingConv) {
          await supabase
            .from("conversations")
            .insert({
              user_id: userId,
              subject: "Votre devis",
              status: "open",
              last_message_at: new Date().toISOString(),
            });
        }
      } catch {
        // Non-blocking: conversation creation failure should not affect quote creation
      }
    }

    return NextResponse.json({ success: true, quote: data });
  } catch (error) {
    console.error("Quote creation error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
