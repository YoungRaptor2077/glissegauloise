import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.marque || !body.description || !body.email) {
      return NextResponse.json(
        { error: "Les champs marque, description et email sont obligatoires" },
        { status: 400 }
      );
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

    const { error: insertError } = await supabase
      .from("repairs")
      .insert({
        brand: body.marque,
        model: body.modele || body.marque,
        issue_description: body.description,
        urgency: urgency,
        status: "received",
        contact_preference: contactPref,
        phone: body.telephone || null,
        email: body.email,
        location: body.localisation || null,
        images: [],
        videos: [],
      });

    if (insertError) {
      console.error("REPAIR INSERT ERROR:", JSON.stringify(insertError));
      return NextResponse.json(
        { error: "Erreur base de donnees: " + insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "inconnue";
    console.error("REPAIR ROUTE ERROR:", message);
    return NextResponse.json(
      { error: "Erreur serveur: " + message },
      { status: 500 }
    );
  }
}
