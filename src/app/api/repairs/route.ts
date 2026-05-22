import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { createServerClient } from "@supabase/ssr";
import { sendRepairReceivedEmail } from "@/lib/email";
import { rateLimit, getRateLimitKey } from "@/lib/rate-limit";
import type { Database } from "@/types/database";

type RepairInsert = Database["public"]["Tables"]["repairs"]["Insert"];

export async function POST(request: NextRequest) {
  try {
    const rateLimitKey = getRateLimitKey(request, "repair-submit");
    if (!rateLimit(rateLimitKey, 3, 60000)) {
      return NextResponse.json({ error: "Trop de demandes. Reessayez dans 1 minute." }, { status: 429 });
    }

    const body = await request.json();

    if (!body.marque || !body.description || !body.email) {
      return NextResponse.json(
        { error: "Les champs marque, description et email sont obligatoires" },
        { status: 400 }
      );
    }

    // Validate email format if provided
    if (body.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body.email)) {
        return NextResponse.json({ error: "Email invalide" }, { status: 400 });
      }
    }

    // Basic spam detection
    const spamPatterns = /\b(viagra|casino|lottery|crypto.?earn|click here|free money)\b/i;
    if (body.description && spamPatterns.test(body.description)) {
      return NextResponse.json({ error: "Message invalide" }, { status: 400 });
    }

    // Try to get authenticated user from cookies
    let userId: string | null = null;
    try {
      const supabaseAuth = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return request.cookies.getAll();
            },
            setAll() {},
          },
        }
      );
      const { data: { user } } = await supabaseAuth.auth.getUser();
      if (user) {
        userId = user.id;
      }
    } catch {
      // Not authenticated, continue without user_id
    }

    const supabase = createServiceClient();

    // Map urgency
    let urgency: "normal" | "urgent" | "very_urgent" = "normal";
    if (body.urgence === "urgent") urgency = "urgent";
    if (body.urgence === "tres-urgent") urgency = "very_urgent";

    // Map contact preference
    let contactPref: "email" | "phone" | "both" = "email";
    if (body.preferenceContact === "telephone") contactPref = "phone";
    if (body.preferenceContact === "les-deux" || body.preferenceContact === "both") contactPref = "both";
    if (body.preferenceContact === "site") contactPref = "email"; // Store as email since notifications are via site

    // Build insert data
    const insertData: RepairInsert = {
      brand: body.marque,
      model: body.modele || body.marque,
      issue_description: body.description,
      urgency: urgency,
      status: "received",
      contact_preference: contactPref,
      phone: body.telephone || null,
      email: body.email,
      location: body.localisation || null,
      images: body.images || [],
      videos: body.videos || [],
      user_id: userId,
    };

    const { data: repair, error: insertError } = await supabase
      .from("repairs")
      .insert(insertData)
      .select()
      .single();

    if (insertError) {
      console.error("REPAIR INSERT ERROR:", JSON.stringify(insertError));
      return NextResponse.json(
        { error: "Erreur base de donnees: " + insertError.message },
        { status: 500 }
      );
    }

    // Send confirmation email
    const userEmail = body.email || null;
    if (userEmail) {
      // Get client name from profile if authenticated
      let clientName = "";
      if (userId) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", userId)
          .single();
        clientName = (profile as { full_name: string } | null)?.full_name || "";
      }
      sendRepairReceivedEmail(userEmail, clientName);
    }

    // Try to create conversation if user is authenticated (non-blocking)
    if (userId && repair) {
      try {
        await supabase.from("conversations").insert({
          user_id: userId,
          subject: "Reparation - " + body.marque + (body.modele ? " " + body.modele : ""),
          status: "open",
          type: "repair",
          related_id: repair.id,
        });
      } catch {
        // Non-critical, don't fail
      }
    }

    return NextResponse.json({ success: true, repairId: repair?.id });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "inconnue";
    console.error("REPAIR ROUTE ERROR:", message);
    return NextResponse.json(
      { error: "Erreur serveur: " + message },
      { status: 500 }
    );
  }
}
