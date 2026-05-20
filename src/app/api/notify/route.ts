import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { sendRepairStatusEmail } from "@/lib/email";

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

    // Send email for repair updates
    if (body.type === "repair_update" && body.user_id) {
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("email, full_name")
          .eq("id", body.user_id)
          .single();

        if (profile?.email) {
          // Extract status from the message (format: "Votre reparation est maintenant : STATUS")
          const statusMatch = body.message?.match(/: (.+)$/);
          const status = statusMatch ? statusMatch[1] : "";
          sendRepairStatusEmail(profile.email, (profile as { full_name?: string }).full_name || "", status);
        }
      } catch {
        // Email failed, non-blocking
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
