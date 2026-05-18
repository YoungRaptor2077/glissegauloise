import { NextRequest, NextResponse } from "next/server";
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
        related_order_id: conv.related_order_id || null,
        related_repair_id: conv.related_repair_id || null,
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
        attachments: [],
        is_read: false,
      })
      .select()
      .single();

    if (error) {
      console.error("Error sending message:", error);
      return NextResponse.json({ error: "Erreur lors de l'envoi" }, { status: 500 });
    }

    // Update conversation updated_at
    await supabase
      .from("conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", id);

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
