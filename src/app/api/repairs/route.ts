import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { createClient } from "@/lib/supabase/server";

interface RepairSubmission {
  marque: string;
  modele: string;
  description: string;
  urgence: string;
  preferenceContact: string;
  telephone: string;
  email: string;
  localisation: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RepairSubmission;

    if (!body.marque || !body.description || !body.email) {
      return NextResponse.json(
        { error: "Les champs marque, description et email sont obligatoires" },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // Try to get authenticated user
    let authenticatedUserId: string | null = null;
    try {
      const authClient = await createClient();
      const { data: { user } } = await authClient.auth.getUser();
      if (user) {
        authenticatedUserId = user.id;
      }
    } catch {
      // Not authenticated, continue as anonymous
    }

    if (authenticatedUserId) {
      // Authenticated user: create repair, conversation, and initial message
      const { data: repair, error: repairError } = await supabase
        .from("repairs")
        .insert({
          user_id: authenticatedUserId,
          board_type: body.modele || body.marque,
          brand: body.marque,
          description: body.description,
          status: "pending",
          images: [],
        })
        .select()
        .single();

      if (repairError) {
        console.error("Error creating repair:", repairError);
        return NextResponse.json(
          { error: "Erreur lors de la creation de la reparation" },
          { status: 500 }
        );
      }

      // Create a conversation linked to the repair
      const subject = "Reparation - " + body.marque + (body.modele ? " " + body.modele : "");
      const { data: conversation, error: conversationError } = await supabase
        .from("conversations")
        .insert({
          user_id: authenticatedUserId,
          subject,
          status: "open",
          related_repair_id: repair.id,
        })
        .select()
        .single();

      if (conversationError) {
        console.error("Error creating conversation:", conversationError);
        // Repair was created but conversation failed - still return success
      }

      // Create an initial message in the conversation
      if (conversation) {
        const { error: messageError } = await supabase
          .from("messages")
          .insert({
            conversation_id: conversation.id,
            sender_id: authenticatedUserId,
            content: body.description,
            attachments: [],
            is_read: false,
          });

        if (messageError) {
          console.error("Error creating initial message:", messageError);
        }
      }

      // Also save to repair_requests as a log
      await supabase.from("repair_requests").insert({
        brand: body.marque,
        model: body.modele || null,
        description: body.description,
        urgency: body.urgence || "normal",
        contact_preference: body.preferenceContact || "email",
        phone: body.telephone || null,
        email: body.email,
        location: body.localisation || null,
      });

      return NextResponse.json({ success: true, repairId: repair.id });
    } else {
      // Anonymous submission: just save to repair_requests
      const { error } = await supabase.from("repair_requests").insert({
        brand: body.marque,
        model: body.modele || null,
        description: body.description,
        urgency: body.urgence || "normal",
        contact_preference: body.preferenceContact || "email",
        phone: body.telephone || null,
        email: body.email,
        location: body.localisation || null,
      });

      if (error) {
        console.error("Error saving repair request:", error);
        console.log("Repair request received:", body);
      }

      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error("Repair form error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi de la demande" },
      { status: 500 }
    );
  }
}
