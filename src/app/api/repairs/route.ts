import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

interface RepairSubmission {
  marque: string;
  modele: string;
  description: string;
  urgence: string;
  preferenceContact: string;
  telephone: string;
  email: string;
  localisation: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RepairSubmission;

    if (!body.marque || !body.description || !body.email) {
      return NextResponse.json(
        { error: "Les champs marque, description et email sont obligatoires" },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    const { error } = await supabase.from("repair_requests").insert({
      brand: body.marque,
      model: body.modele || null,
      description: body.description,
      urgency: body.urgence || "normal",
      contact_preference: body.preferenceContact || "email",
      phone: body.telephone || null,
      email: body.email,
      location: body.localisation || null,
    });

    if (error) {
      console.error("Error saving repair request:", error);
      // Even if database insert fails, log the submission
      console.log("Repair request received:", body);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Repair form error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi de la demande" },
      { status: 500 }
    );
  }
}
