import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
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
  images?: string[];
  videos?: string[];
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

    // Use untyped supabase client to avoid type mismatch with actual DB schema
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

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

    // Map urgency values
    const urgencyMap: Record<string, string> = {
      "normal": "normal",
      "urgent": "urgent",
      "tres-urgent": "very_urgent",
    };
    const mappedUrgency = urgencyMap[body.urgence] || "normal";

    // Map contact preference
    const contactMap: Record<string, string> = {
      "telephone": "phone",
      "email": "email",
    };
    const mappedContact = contactMap[body.preferenceContact] || "email";

    if (authenticatedUserId) {
      // Authenticated user: create repair in repairs table
      const { data: repair, error: repairError } = await supabase
        .from("repairs")
        .insert({
          user_id: authenticatedUserId,
          brand: body.marque,
          model: body.modele || body.marque,
          issue_description: body.description,
          urgency: mappedUrgency,
          status: "received",
          contact_preference: mappedContact,
          phone: body.telephone || null,
          email: body.email,
          location: body.localisation || null,
          images: body.images || [],
          videos: body.videos || [],
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
          type: "repair",
          related_id: repair.id,
        })
        .select()
        .single();

      let conversationCreated = true;
      if (conversationError) {
        console.error("Error creating conversation:", conversationError);
        conversationCreated = false;
      }

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

      const response: { success: boolean; repairId: string; warning?: string } = {
        success: true,
        repairId: repair.id,
      };
      if (!conversationCreated) {
        response.warning = "La conversation n'a pas pu etre creee";
      }
      return NextResponse.json(response);
    } else {
      // Anonymous: save to repairs table without user_id
      const { error } = await supabase
        .from("repairs")
        .insert({
          brand: body.marque,
          model: body.modele || body.marque,
          issue_description: body.description,
          urgency: mappedUrgency,
          status: "received",
          contact_preference: mappedContact,
          phone: body.telephone || null,
          email: body.email,
          location: body.localisation || null,
          images: body.images || [],
          videos: body.videos || [],
        });

      if (error) {
        console.error("Error saving repair:", error);
        return NextResponse.json(
          { error: "Erreur lors de l'envoi de la demande" },
          { status: 500 }
        );
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
