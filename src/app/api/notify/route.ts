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
    await (supabase.from("notifications") as any)
      .insert({
        user_id,
        title,
        message,
        type: type || "info",
        link: link || null,
        is_read: false,
      });

    // Send email for repair updates (always, even if notification insert fails)
    if (type === "repair_update" && user_id) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: profile } = await (supabase.from("profiles") as any)
          .select("email, full_name")
          .eq("id", user_id)
          .single();

        if (profile?.email) {
          // Pass the raw status key from the body (added by the admin page)
          const statusKey = body.status_key || "";
          sendRepairStatusEmail(profile.email, profile.full_name || "", statusKey);
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
