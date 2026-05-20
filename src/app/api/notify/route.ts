import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, title, message, type, link } = body;

    if (!user_id || !title || !message) {
      return NextResponse.json({ error: "Parametres manquants" }, { status: 400 });
    }

    const supabase = createServiceClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("notifications") as any)
      .insert({
        user_id,
        title,
        message,
        type: type || "info",
        link: link || null,
        read: false,
      });

    if (error) {
      return NextResponse.json({ error: "Erreur lors de la creation" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
