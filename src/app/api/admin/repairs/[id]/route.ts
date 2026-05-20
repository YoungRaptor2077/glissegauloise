import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

function isAdminAuthenticated(request: NextRequest): boolean {
  const cookie = request.cookies.get("admin_session");
  return cookie?.value === "authenticated";
}

// DELETE - delete a repair and its related conversations/messages
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

    // Find related conversations
    const { data: conversations } = await supabase
      .from("conversations")
      .select("id")
      .eq("related_id", id);

    // Delete messages for related conversations
    if (conversations && conversations.length > 0) {
      const convIds = conversations.map((c) => c.id);
      await supabase
        .from("messages")
        .delete()
        .in("conversation_id", convIds);

      // Delete conversations
      await supabase
        .from("conversations")
        .delete()
        .eq("related_id", id);
    }

    // Delete the repair
    const { error } = await supabase
      .from("repairs")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting repair:", error);
      return NextResponse.json(
        { error: "Erreur lors de la suppression de la reparation" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Repair deletion error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la reparation" },
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
      "waiting_parts",
      "in_progress",
      "testing",
      "completed",
      "ready_pickup",
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Repair status update error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise a jour du statut" },
      { status: 500 }
    );
  }
}
