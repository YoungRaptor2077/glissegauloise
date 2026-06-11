import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { sendPushToUser } from "@/lib/push";

const repairStatusLabels: Record<string, string> = {
  received: "Reçue",
  diagnostic: "Diagnostic en cours",
  awaiting_decision: "En attente de décision",
  waiting_parts: "En attente de pièces",
  in_progress: "En cours de réparation",
  testing: "En phase de test",
  completed: "Terminée",
  ready_pickup: "Prête à récupérer",
  closed: "Clôturée",
};

function isAdminAuthenticated(request: NextRequest): boolean {
  const cookie = request.cookies.get("admin_session");
  return cookie?.value === "authenticated";
}

// DELETE - delete a repair and its related data
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const supabase = createServiceClient();

    // Try to delete related conversations (by related_id OR by matching subject)
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: conversations } = await (supabase.from("conversations") as any)
        .select("id")
        .eq("related_id", id);

      if (conversations && conversations.length > 0) {
        const convIds = conversations.map((c: { id: string }) => c.id);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from("messages") as any).delete().in("conversation_id", convIds);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from("conversations") as any).delete().in("id", convIds);
      }
    } catch {
      // related_id column might not exist, skip
    }

    // Delete any notifications referencing this repair
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from("notifications") as any).delete().eq("related_id", id);
    } catch {
      // Non-blocking
    }

    // Delete the repair itself
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("repairs") as any)
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting repair:", error);
      return NextResponse.json(
        { error: `Erreur: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Repair deletion error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression" },
      { status: 500 }
    );
  }
}

// PATCH - update repair status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const body = await request.json();

    const validStatuses = [
      "received",
      "diagnostic",
      "awaiting_decision",
      "waiting_parts",
      "in_progress",
      "testing",
      "completed",
      "ready_pickup",
      "closed",
    ];

    if (!body.status || !validStatuses.includes(body.status)) {
      return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
    }

    const supabase = createServiceClient();

    const { error } = await supabase
      .from("repairs")
      .update({ status: body.status })
      .eq("id", id);

    if (error) {
      console.error("Error updating repair status:", error);
      return NextResponse.json(
        { error: "Erreur lors de la mise a jour du statut" },
        { status: 500 }
      );
    }

    // Send push notification to client
    try {
      const { data: repair } = await supabase
        .from("repairs")
        .select("user_id")
        .eq("id", id)
        .single();

      if (repair?.user_id) {
        const statusFr = repairStatusLabels[body.status] || body.status;
        sendPushToUser(
          repair.user_id,
          "Réparation mise à jour",
          "Statut: " + statusFr,
          "/espace-client/reparations"
        ).catch(() => {});
      }
    } catch {
      // Push notification failed, non-blocking
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Repair status update error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise a jour du statut" },
      { status: 500 }
    );
  }
}
