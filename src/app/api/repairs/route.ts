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

    // Map urgency values to DB enum
    const urgencyMap: Record<string, "normal" | "urgent" | "very_urgent"> = {
      "normal": "normal",
      "urgent": "urgent",
      "tres-urgent": "very_urgent",
    };
    const mappedUrgency = urgencyMap[body.urgence] || "normal";

    // Map contact preference to DB enum
    const contactMap: Record<string, "email" | "phone"> = {
      "telephone": "phone",
      "email": "email",
    };
    const mappedContact = contactMap[body.preferenceContact] || "email";

    // Insert repair record
    const repairData: {
      brand: string;
      model: string;
      issue_description: string;
      urgency: "normal" | "urgent" | "very_urgent";
      status: "received";
      contact_preference: "email" | "phone";
      phone: string | null;
      email: string;
      location: string | null;
      images: string[];
      videos: string[];
      user_id?: string;
    } = {
      brand: body.marque,
      model: body.modele || body.marque,
      issue_description: body.description,
      urgency: mappedUrgency,
      status: "received",
      contact_preference: mappedContact,
      phone: body.telephone || null,
      email: body.email,
      location: body.localisation || null,
      images: [],
      videos: [],
    };

    if (authenticatedUserId) {
      repairData.user_id = authenticatedUserId;
    }

    const { data: repair, error: repairError } = await supabase
      .from("repairs")
      .insert(repairData)
      .select()
      .single();

    if (repairError) {
      console.error("Error creating repair:", repairError);
      return NextResponse.json(
        { error: "Erreur lors de la creation de la reparation" },
        { status: 500 }
      );
    }

    // If authenticated, try to create a conversation (non-blocking)
    if (authenticatedUserId && repair) {
      try {
        const subject = "Reparation - " + body.marque + (body.modele ? " " + body.modele : "");
        const { data: conversation } = await supabase
          .from("conversations")
          .insert({
            user_id: authenticatedUserId,
            subject,
            status: "open",
            type: "repair",
            related_id: repair.id,
          })
          .select()
          .single();

        // Create an initial message in the conversation
        if (conversation) {
          await supabase
            .from("messages")
            .insert({
              conversation_id: conversation.id,
              sender_id: authenticatedUserId,
              content: `Demande de reparation:\nMarque: ${body.marque}\nModele: ${body.modele || "Non precise"}\nUrgence: ${body.urgence}\n\n${body.description}`,
              is_admin: false,
              is_read: false,
              attachments: [],
            });
        }
      } catch (convError) {
        // Conversation creation is non-critical - don't fail the whole request
        console.error("Error creating conversation:", convError);
      }
    }

    return NextResponse.json({
      success: true,
      repairId: repair?.id || null,
    });
  } catch (error) {
    console.error("Repair form error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi de la demande" },
      { status: 500 }
    );
  }
}
