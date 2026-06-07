import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { createClient } from "@/lib/supabase/server";
import { sendNewMessageEmail } from "@/lib/email";

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

export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const body = await request.json();
    const { userId, subject, content } = body;

    if (!userId || !content) {
      return NextResponse.json(
        { error: "L'identifiant client et le message sont requis" },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // Create the conversation
    const { data: conversation, error: convError } = await supabase
      .from("conversations")
      .insert({
        user_id: userId,
        subject: subject || "Nouvelle conversation",
        status: "open",
        last_message_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (convError) {
      console.error("Error creating conversation:", convError);
      return NextResponse.json({ error: "Erreur lors de la creation de la conversation" }, { status: 500 });
    }

    // Insert the first message
    const { error: msgError } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversation.id,
        sender_id: admin.id,
        content,
        is_admin: true,
        attachments: [],
        is_read: false,
      });

    if (msgError) {
      console.error("Error creating message:", msgError);
      return NextResponse.json({ error: "Erreur lors de l'envoi du message" }, { status: 500 });
    }

    // Send email notification to client
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("email, full_name")
        .eq("id", userId)
        .single();

      if (profile?.email) {
        sendNewMessageEmail(profile.email, (profile as { full_name?: string }).full_name || "");
      }
    } catch {
      // Email notification failed, non-blocking
    }

    return NextResponse.json({ success: true, conversation });
  } catch (error) {
    console.error("New conversation API error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
