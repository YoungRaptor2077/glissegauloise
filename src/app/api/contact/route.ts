import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

interface ContactSubmission {
  nom: string;
  email: string;
  telephone: string;
  sujet: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ContactSubmission;

    if (!body.nom || !body.email || !body.message) {
      return NextResponse.json(
        { error: "Les champs nom, email et message sont obligatoires" },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    const { error } = await supabase.from("contact_submissions").insert({
      name: body.nom,
      email: body.email,
      phone: body.telephone || null,
      subject: body.sujet || null,
      message: body.message,
    });

    if (error) {
      console.error("Error saving contact submission:", error);
      // Even if database insert fails, log the submission
      console.log("Contact submission received:", body);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du message" },
      { status: 500 }
    );
  }
}
