import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createServiceClient } from "@/lib/supabase/service";
import { sendPushNotification } from "@/lib/push";

async function getAuthUser() {
  const cookieStore = await cookies();

  const supabaseAuth = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {},
      },
    }
  );

  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();
  return user;
}

// GET - fetch messages for a conversation (verifies user owns it)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
    }

    const supabase = createServiceClient();

    // Verify user owns this conversation
    const { data: conv } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", id)
      .single();

    if (!conv) {
      return NextResponse.json(
        { error: "Conversation introuvable" },
        { status: 404 }
      );
    }

    if (conv.user_id !== user.id) {
      return NextResponse.json({ error: "Non autorise" }, { status: 403 });
    }

    // Fetch messages
    const { data: messages } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", id)
      .order("created_at", { ascending: true });

    // Mark unread messages from admin as read
    await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("conversation_id", id)
      .eq("is_read", false)
      .neq("sender_id", user.id);

    return NextResponse.json({
      conversation: {
        id: conv.id,
        subject: conv.subject,
        status: conv.status,
        type: (conv as { type?: string }).type || "general",
        related_id: (conv as { related_id?: string | null }).related_id || null,
      },
      messages: messages || [],
    });
  } catch (error) {
    console.error("Messages detail API error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST - send a new message from the client
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
    }

    const body = await request.json();
    if (!body.content) {
      return NextResponse.json(
        { error: "Le contenu est requis" },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // Verify user owns this conversation
    const { data: conv } = await supabase
      .from("conversations")
      .select("id, user_id, status")
      .eq("id", id)
      .single();

    if (!conv) {
      return NextResponse.json(
        { error: "Conversation introuvable" },
        { status: 404 }
      );
    }

    if (conv.user_id !== user.id) {
      return NextResponse.json({ error: "Non autorise" }, { status: 403 });
    }

    // Insert message
    const { data: message, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: id,
        sender_id: user.id,
        content: body.content,
        is_admin: false,
        attachments: body.attachments || [],
        is_read: false,
      })
      .select()
      .single();

    if (error) {
      console.error("Error sending message:", error);
      return NextResponse.json(
        { error: "Erreur lors de l'envoi" },
        { status: 500 }
      );
    }

    // Update conversation last_message_at
    await supabase
      .from("conversations")
      .update({ last_message_at: new Date().toISOString() })
      .eq("id", id);

    // Send email notification to admin
    try {
      const { data: clientProfile } = await supabase
        .from("profiles")
        .select("full_name, email")
        .eq("id", user.id)
        .single();

      const clientName = (clientProfile as { full_name?: string } | null)?.full_name || "Un client";

      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      if (resend) {
        const adminEmails = ["gdrmathis15@gmail.com", "vanderieviere76@gmail.com"];
        await resend.emails.send({
          from: "GlisseGauloisse <noreply@glissegauloisse.com>",
          to: adminEmails,
          subject: `Nouveau message de ${clientName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f5f5f0; padding: 40px; border-radius: 16px;">
              <h1 style="color: #00ff88; font-size: 20px; margin-bottom: 16px;">Nouveau message client</h1>
              <p><strong>${clientName}</strong> vous a envoye un message :</p>
              <div style="background: #1a1a1a; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #00ff88;">
                <p style="margin: 0; white-space: pre-wrap;">${body.content.substring(0, 300)}</p>
              </div>
              <p style="margin-top: 20px;">
                <a href="https://glissegauloisse.com/admin/conversations/${id}" style="display: inline-block; background: #00ff88; color: #0a0a0a; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Repondre</a>
              </p>
              <hr style="border: none; border-top: 1px solid #2a2a2a; margin: 30px 0;" />
              <p style="color: #888; font-size: 12px;">GlisseGauloisse - 49 Route de Margency, 95600 Eaubonne</p>
            </div>
          `,
        });
      }

      // Send push notification to admin devices
      sendPushNotification(
        `Message de ${clientName}`,
        body.content.substring(0, 100),
        `/admin/conversations/${id}`
      ).catch(() => {});
    } catch {
      // Email notification to admin failed, non-blocking
    }

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Send message API error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
