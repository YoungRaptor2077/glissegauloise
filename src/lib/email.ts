import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = "GlisseGauloisse <noreply@glissegauloisse.com>";

export async function sendRepairReceivedEmail(to: string, clientName: string) {
  if (!resend) return;
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Votre demande de reparation a ete recue - GlisseGauloisse",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f5f5f0; padding: 40px; border-radius: 16px;">
          <h1 style="color: #00ff88; font-size: 24px; margin-bottom: 20px;">Demande recue ✓</h1>
          <p>Bonjour ${clientName || ""},</p>
          <p>Votre demande de reparation a bien ete recue. Notre equipe l'examine et vous recontactera sous 24h.</p>
          <p>Vous pouvez suivre l'avancement dans votre <a href="https://glissegauloisse.com/espace-client/reparations" style="color: #00ff88;">espace client</a>.</p>
          <hr style="border: none; border-top: 1px solid #2a2a2a; margin: 30px 0;" />
          <p style="color: #888; font-size: 12px;">GlisseGauloisse - 49 Route de Margency, 95600 Eaubonne<br/>07 86 75 79 63</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Email send error (repair received):", error);
  }
}

export async function sendRepairStatusEmail(to: string, clientName: string, status: string) {
  if (!resend) return;
  const statusMessages: Record<string, string> = {
    received: "Votre demande de reparation a ete prise en compte.",
    diagnostic: "Votre trottinette est en cours de diagnostic.",
    waiting_parts: "Nous attendons les pieces necessaires pour votre reparation.",
    in_progress: "La reparation de votre trottinette est en cours.",
    testing: "Votre trottinette est en phase de test.",
    completed: "La reparation de votre trottinette est terminee !",
    ready_pickup: "Votre trottinette est prete a etre recuperee !",
    closed: "Votre reparation est terminee. Merci de votre confiance !",
  };

  const message = statusMessages[status] || `Le statut de votre reparation a ete mis a jour : ${status}`;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Mise a jour reparation - GlisseGauloisse`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f5f5f0; padding: 40px; border-radius: 16px;">
          <h1 style="color: #00ff88; font-size: 24px; margin-bottom: 20px;">Mise a jour de votre reparation</h1>
          <p>Bonjour ${clientName || ""},</p>
          <p style="font-size: 16px; background: #1a1a1a; padding: 16px; border-radius: 8px; border-left: 4px solid #00ff88;">${message}</p>
          <p>Suivez l'avancement dans votre <a href="https://glissegauloisse.com/espace-client/reparations" style="color: #00ff88;">espace client</a>.</p>
          <hr style="border: none; border-top: 1px solid #2a2a2a; margin: 30px 0;" />
          <p style="color: #888; font-size: 12px;">GlisseGauloisse - 49 Route de Margency, 95600 Eaubonne<br/>07 86 75 79 63</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Email send error (status update):", error);
  }
}

export async function sendNewMessageEmail(to: string, clientName: string) {
  if (!resend) return;
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Nouveau message - GlisseGauloisse",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f5f5f0; padding: 40px; border-radius: 16px;">
          <h1 style="color: #00ff88; font-size: 24px; margin-bottom: 20px;">Nouveau message</h1>
          <p>Bonjour ${clientName || ""},</p>
          <p>Vous avez recu un nouveau message de GlisseGauloisse.</p>
          <p><a href="https://glissegauloisse.com/espace-client/messages" style="display: inline-block; background: #00ff88; color: #0a0a0a; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Voir le message</a></p>
          <hr style="border: none; border-top: 1px solid #2a2a2a; margin: 30px 0;" />
          <p style="color: #888; font-size: 12px;">GlisseGauloisse - 49 Route de Margency, 95600 Eaubonne<br/>07 86 75 79 63</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Email send error (new message):", error);
  }
}

export async function sendOrderConfirmationEmail(to: string, clientName: string, orderId: string, total: number) {
  if (!resend) return;
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Confirmation commande #${orderId.substring(0, 8).toUpperCase()} - GlisseGauloisse`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f5f5f0; padding: 40px; border-radius: 16px;">
          <h1 style="color: #00ff88; font-size: 24px; margin-bottom: 20px;">Commande confirmee ✓</h1>
          <p>Bonjour ${clientName || ""},</p>
          <p>Merci pour votre commande !</p>
          <div style="background: #1a1a1a; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Commande :</strong> #${orderId.substring(0, 8).toUpperCase()}</p>
            <p style="margin: 8px 0 0;"><strong>Total :</strong> ${total.toFixed(2)} EUR</p>
          </div>
          <p>Suivez votre commande dans votre <a href="https://glissegauloisse.com/espace-client/commandes" style="color: #00ff88;">espace client</a>.</p>
          <hr style="border: none; border-top: 1px solid #2a2a2a; margin: 30px 0;" />
          <p style="color: #888; font-size: 12px;">GlisseGauloisse - 49 Route de Margency, 95600 Eaubonne<br/>07 86 75 79 63</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Email send error (order confirmation):", error);
  }
}
