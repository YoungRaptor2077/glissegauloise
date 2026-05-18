import { NextResponse } from "next/server";
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

export async function GET() {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const supabase = createServiceClient();

    // Fetch all conversations
    const { data: conversations } = await supabase
      .from("conversations")
      .select("*")
      .order("updated_at", { ascending: false });

    if (!conversations || conversations.length === 0) {
      return NextResponse.json({ conversations: [] });
    }

    // Fetch profiles for all user_ids
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userIds = [...new Set(conversations.map((c: any) => c.user_id).filter(Boolean))];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const profileMap: Record<string, any> = {};
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", userIds);
      if (profiles) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        profiles.forEach((p: any) => { profileMap[p.id] = p; });
      }
    }

    // Fetch last message and unread count for each conversation
    const result = [];
    for (const conv of conversations) {
      const { data: lastMsg } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conv.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      const { count: unreadCount } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("conversation_id", conv.id)
        .eq("is_read", false)
        .neq("sender_id", admin.id);

      const profile = conv.user_id ? profileMap[conv.user_id] : null;
      result.push({
        id: conv.id,
        customerName: profile?.full_name || "Client",
        subject: conv.subject,
        lastMessage: lastMsg?.content || "",
        date: lastMsg?.created_at || conv.updated_at,
        unread: unreadCount || 0,
        status: conv.status,
      });
    }

    return NextResponse.json({ conversations: result });
  } catch (error) {
    console.error("Conversations API error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
