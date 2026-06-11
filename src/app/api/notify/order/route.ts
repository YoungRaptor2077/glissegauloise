import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { sendPushToUser } from "@/lib/push";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = "GlisseGauloisse <noreply@glissegauloisse.com>";

const statusMessages: Record<string, string> = {
  confirmed: "Votre commande a ete confirmee et est en cours de preparation.",
  shipped: "Votre commande a ete expediee ! Elle est en route vers vous.",
  delivered: "Votre commande a ete livree ! Merci pour votre achat.",
};

const statusSubjects: Record<string, string> = {
  confirmed: "Commande confirmee",
  shipped: "Commande expediee",
  delivered: "Commande livree",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, clientName, orderId, status, userId } = body;

    if (!email || !status) {
      return NextResponse.json({ error: "Parametres manquants" }, { status: 400 });
    }

    if (!resend) {
      // Still send push notification even if no email API key
      if (userId) {
        const subject = statusSubjects[status] || "Mise a jour commande";
        const message = statusMessages[status] || "Le statut de votre commande a ete mis a jour.";
        sendPushToUser(userId, subject, message, "/espace-client/commandes").catch(() => {});
      }
      return NextResponse.json({ success: true, note: "No API key" });
    }

    const message = statusMessages[status] || `Le statut de votre commande a ete mis a jour.`;
    const subject = statusSubjects[status] || "Mise a jour commande";

    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `${subject} #${orderId || ""} - GlisseGauloisse`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f5f5f0; padding: 40px; border-radius: 16px;">
          <h1 style="color: #00ff88; font-size: 24px; margin-bottom: 20px;">${subject}</h1>
          <p>Bonjour ${clientName || ""},</p>
          <p style="font-size: 16px; background: #1a1a1a; padding: 16px; border-radius: 8px; border-left: 4px solid #00ff88;">${message}</p>
          ${orderId ? `<p style="color: #888; margin-top: 16px;">Commande : #${orderId}</p>` : ""}
          <p>Suivez votre commande dans votre <a href="https://glissegauloisse.com/espace-client/commandes" style="color: #00ff88;">espace client</a>.</p>
          <hr style="border: none; border-top: 1px solid #2a2a2a; margin: 30px 0;" />
          <p style="color: #888; font-size: 12px;">GlisseGauloisse - 49 Route de Margency, 95600 Eaubonne<br/>07 86 75 79 63</p>
        </div>
      `,
    });

    // Send push notification to client
    if (userId) {
      sendPushToUser(userId, subject, message, "/espace-client/commandes").catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Order notification email error:", error);
    return NextResponse.json({ success: true }); // Non-blocking
  }
}
