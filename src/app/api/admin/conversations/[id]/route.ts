import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { createClient } from "@/lib/supabase/server";
import { sendNewMessageEmail } from "@/lib/email";
import { sendPushToUser } from "@/lib/push";

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

// GET - fetch conversation details with messages
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const supabase = createServiceClient();

    // Fetch conversation
    const { data: conv } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", id)
      .single();

    if (!conv) {
      return NextResponse.json({ error: "Conversation introuvable" }, { status: 404 });
    }

    // Fetch customer profile
    let customer = null;
    if (conv.user_id) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, email, phone")
        .eq("id", conv.user_id)
        .single();
      if (profile) {
        customer = {
          name: profile.full_name || "Client",
          email: profile.email,
          phone: profile.phone,
        };
      }
    }

    // Fetch messages
    const { data: messages } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", id)
      .order("created_at", { ascending: true });

    // Mark unread messages as read (those not from admin)
    await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("conversation_id", id)
      .eq("is_read", false)
      .neq("sender_id", admin.id);

    return NextResponse.json({
      conversation: {
        id: conv.id,
        subject: conv.subject,
        status: conv.status,
        type: (conv as { type?: string }).type || null,
        related_id: (conv as { related_id?: string | null }).related_id || null,
      },
      customer,
      messages: messages || [],
    });
  } catch (error) {
    console.error("Conversation detail API error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST - send a message as admin
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const body = await request.json();
    if (!body.content) {
      return NextResponse.json({ error: "Le contenu est requis" }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Verify conversation exists
    const { data: conv } = await supabase
      .from("conversations")
      .select("id")
      .eq("id", id)
      .single();

    if (!conv) {
      return NextResponse.json({ error: "Conversation introuvable" }, { status: 404 });
    }

    // Insert message
    const { data: message, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: id,
        sender_id: admin.id,
        content: body.content,
        is_admin: true,
        attachments: [],
        is_read: false,
      })
      .select()
      .single();

    if (error) {
      console.error("Error sending message:", error);
      return NextResponse.json({ error: "Erreur lors de l'envoi" }, { status: 500 });
    }

    // Update conversation last_message_at
    await supabase
      .from("conversations")
      .update({ last_message_at: new Date().toISOString() })
      .eq("id", id);

    // Send email notification to client
    try {
      const { data: convData } = await supabase
        .from("conversations")
        .select("user_id")
        .eq("id", id)
        .single();

      if (convData?.user_id) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("email, full_name")
          .eq("id", convData.user_id)
          .single();

        if (profile?.email) {
          sendNewMessageEmail(profile.email, (profile as { full_name?: string }).full_name || "");
        }

        // Send push notification to client
        sendPushToUser(
          convData.user_id,
          "Nouveau message",
          body.content.substring(0, 100),
          "/espace-client/messages"
        ).catch(() => {});
      }
    } catch {
      // Email notification failed, non-blocking
    }

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Send message API error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PATCH - close/reopen conversation
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const body = await request.json();

    const validStatuses = ["open", "closed", "archived"];
    if (!body.status || !validStatuses.includes(body.status)) {
      return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
    }

    const supabase = createServiceClient();

    const { error } = await supabase
      .from("conversations")
      .update({ status: body.status })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: "Erreur lors de la mise a jour" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Conversation update error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
