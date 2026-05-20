import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createServiceClient } from "@/lib/supabase/service";

export async function GET() {
  try {
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

    if (!user) {
      return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
    }

    const supabase = createServiceClient();

    // Fetch conversations for this user
    const { data: conversations } = await supabase
      .from("conversations")
      .select("*")
      .eq("user_id", user.id)
      .order("last_message_at", { ascending: false });

    if (!conversations || conversations.length === 0) {
      return NextResponse.json({ conversations: [] });
    }

    const convIds = conversations.map((c) => c.id);

    // Fetch all messages for these conversations
    const { data: allMessages } = await supabase
      .from("messages")
      .select("*")
      .in("conversation_id", convIds)
      .order("created_at", { ascending: false });

    const messagesMap: Record<string, typeof allMessages> = {};
    if (allMessages) {
      for (const msg of allMessages) {
        if (!messagesMap[msg.conversation_id]) {
          messagesMap[msg.conversation_id] = [];
        }
        messagesMap[msg.conversation_id]!.push(msg);
      }
    }

    const result = conversations.map((conv) => {
      const msgs = messagesMap[conv.id] || [];
      const lastMsg = msgs[0] || null;
      const unreadCount = msgs.filter(
        (m) => !m.is_read && m.sender_id !== user.id
      ).length;

      return {
        id: conv.id,
        subject: conv.subject,
        status: conv.status,
        type: (conv as { type?: string }).type || "general",
        related_id: (conv as { related_id?: string | null }).related_id || null,
        created_at: conv.created_at,
        lastMessage: lastMsg?.content || null,
        lastMessageDate: lastMsg?.created_at || conv.last_message_at || conv.created_at,
        unreadCount,
      };
    });

    return NextResponse.json({ conversations: result });
  } catch (error) {
    console.error("Messages API error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
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

    if (!user) {
      return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
    }

    const body = await request.json();
    const { subject, content } = body;

    if (!subject || !content) {
      return NextResponse.json(
        { error: "Sujet et contenu requis" },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // Create the conversation
    const { data: conversation, error: convError } = await supabase
      .from("conversations")
      .insert({
        user_id: user.id,
        subject,
        status: "open",
        type: "general",
      })
      .select()
      .single();

    if (convError || !conversation) {
      console.error("Error creating conversation:", convError);
      return NextResponse.json(
        { error: "Erreur lors de la creation de la conversation" },
        { status: 500 }
      );
    }

    // Create the first message
    const { error: msgError } = await supabase.from("messages").insert({
      conversation_id: conversation.id,
      sender_id: user.id,
      content,
      is_read: false,
    });

    if (msgError) {
      console.error("Error creating message:", msgError);
      return NextResponse.json(
        { error: "Erreur lors de la creation du message" },
        { status: 500 }
      );
    }

    return NextResponse.json({ conversationId: conversation.id });
  } catch (error) {
    console.error("Messages POST error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabaseAuth = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll() {},
        },
      }
    );

    const { data: { user } } = await supabaseAuth.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const convId = searchParams.get("id");
    if (!convId) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Verify the conversation belongs to this user
    const { data: conv } = await supabase
      .from("conversations")
      .select("user_id")
      .eq("id", convId)
      .single();

    if (!conv || conv.user_id !== user.id) {
      return NextResponse.json({ error: "Non autorise" }, { status: 403 });
    }

    // Delete messages first (foreign key)
    await supabase.from("messages").delete().eq("conversation_id", convId);

    // Delete conversation
    await supabase.from("conversations").delete().eq("id", convId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Messages DELETE error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}