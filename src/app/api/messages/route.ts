import { NextResponse } from "next/server";
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
      .order("updated_at", { ascending: false });

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
        lastMessageDate: lastMsg?.created_at || conv.updated_at,
        unreadCount,
      };
    });

    return NextResponse.json({ conversations: result });
  } catch (error) {
    console.error("Messages API error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
