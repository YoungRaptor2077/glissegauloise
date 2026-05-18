import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de Confidentialite",
  description: "Politique de confidentialite de GlisseGauloisse - Protection de vos donnees personnelles conformement au RGPD.",
};

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-blanc-casse mb-8">
        Politique de Confidentialite
      </h1>

      <p className="text-blanc-casse/60 mb-8">
        Derniere mise a jour : Janvier 2025
      </p>

      <div className="space-y-8 text-blanc-casse/80">
        {/* Introduction */}
        <section>
          <h2 className="text-xl font-semibold text-blanc-casse mb-4">
            1. Introduction
          </h2>
          <p>
            GlisseGauloisse (Entreprise Individuelle, SIRET 99370901300011) s&apos;engage
            a proteger la vie privee de ses utilisateurs. La presente politique
            de confidentialite decrit les donnees personnelles que nous
            collectons, comment nous les utilisons et les droits dont vous
            disposez conformement au Reglement General sur la Protection des
            Donnees (RGPD).
          </p>
        </section>

        {/* Responsable du traitement */}
        <section>
          <h2 className="text-xl font-semibold text-blanc-casse mb-4">
            2. Responsable du traitement
          </h2>
          <div className="rounded-2xl border border-white/5 bg-gris-anthracite p-6 space-y-2">
            <p>
              <strong className="text-blanc-casse">GlisseGauloisse EI</strong>
            </p>
            <p>49 Route de Margency, 95600 Eaubonne, France</p>
            <p>Email : GlisseGauloisse.Service@outlook.fr</p>
            <p>Telephone : 07 86 75 79 63</p>
          </div>
        </section>

        {/* Donnees collectees */}
        <section>
          <h2 className="text-xl font-semibold text-blanc-casse mb-4">
            3. Donnees collectees
          </h2>
          <p className="mb-4">
            Nous collectons les donnees suivantes dans le cadre de nos services :
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong className="text-blanc-casse">Donnees d&apos;identification :</strong>{" "}
              nom, prenom, adresse email, numero de telephone
            </li>
            <li>
              <strong className="text-blanc-casse">Donnees de livraison :</strong>{" "}
              adresse postale
            </li>
            <li>
              <strong className="text-blanc-casse">Donnees de commande :</strong>{" "}
              historique d&apos;achats, produits consultes
            </li>
            <li>
              <strong className="text-blanc-casse">Donnees de reparation :</strong>{" "}
              description du materiel, photos du produit
            </li>
            <li>
              <strong className="text-blanc-casse">Donnees de connexion :</strong>{" "}
              adresse IP, navigateur, pages visitees (donnees techniques)
            </li>
          </ul>
        </section>

        {/* Finalites */}
        <section>
          <h2 className="text-xl font-semibold text-blanc-casse mb-4">
            4. Finalites du traitement
          </h2>
          <p className="mb-4">
            Vos donnees personnelles sont collectees pour les finalites suivantes :
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Gestion de votre compte client</li>
            <li>Traitement et suivi de vos commandes</li>
            <li>Gestion des demandes de reparation</li>
            <li>Communication avec le service client (messagerie)</li>
            <li>Envoi de devis</li>
            <li>Amelioration de nos services</li>
          </ul>
        </section>

        {/* Base legale */}
        <section>
          <h2 className="text-xl font-semibold text-blanc-casse mb-4">
            5. Base legale du traitement
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong className="text-blanc-casse">Execution du contrat :</strong>{" "}
              traitement des commandes, livraison, service apres-vente
            </li>
            <li>
              <strong className="text-blanc-casse">Consentement :</strong>{" "}
              creation de compte, envoi de communications
            </li>
            <li>
              <strong className="text-blanc-casse">Obligation legale :</strong>{" "}
              conservation des factures et documents comptables
            </li>
            <li>
              <strong className="text-blanc-casse">Interet legitime :</strong>{" "}
              amelioration de nos services, securite du site
            </li>
          </ul>
        </section>

        {/* Duree de conservation */}
        <section>
          <h2 className="text-xl font-semibold text-blanc-casse mb-4">
            6. Duree de conservation
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Donnees de compte client : 3 ans apres la derniere activite</li>
            <li>Donnees de commande : 5 ans (obligations comptables)</li>
            <li>Donnees de reparation : 2 ans apres la fin du service</li>
            <li>Donnees de connexion : 12 mois</li>
          </ul>
        </section>

        {/* Destinataires */}
        <section>
          <h2 className="text-xl font-semibold text-blanc-casse mb-4">
            7. Destinataires des donnees
          </h2>
          <p className="mb-4">
            Vos donnees peuvent etre transmises aux destinataires suivants :
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Stripe (traitement des paiements)</li>
            <li>Transporteurs (livraison des commandes)</li>
            <li>Supabase (hebergement des donnees)</li>
          </ul>
          <p className="mt-4">
            Aucune donnee n&apos;est vendue ou transmise a des tiers a des fins
            commerciales.
          </p>
        </section>

        {/* Vos droits */}
        <section>
          <h2 className="text-xl font-semibold text-blanc-casse mb-4">
            8. Vos droits
          </h2>
          <p className="mb-4">
            Conformement au RGPD, vous disposez des droits suivants :
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong className="text-blanc-casse">Droit d&apos;acces :</strong>{" "}
              obtenir une copie de vos donnees personnelles
            </li>
            <li>
              <strong className="text-blanc-casse">Droit de rectification :</strong>{" "}
              corriger des donnees inexactes
            </li>
            <li>
              <strong className="text-blanc-casse">Droit a l&apos;effacement :</strong>{" "}
              demander la suppression de vos donnees
            </li>
            <li>
              <strong className="text-blanc-casse">Droit a la portabilite :</strong>{" "}
              recevoir vos donnees dans un format structure
            </li>
            <li>
              <strong className="text-blanc-casse">Droit d&apos;opposition :</strong>{" "}
              vous opposer au traitement de vos donnees
            </li>
            <li>
              <strong className="text-blanc-casse">Droit a la limitation :</strong>{" "}
              limiter le traitement dans certains cas
            </li>
          </ul>
          <p className="mt-4">
            Pour exercer vos droits, contactez-nous a :{" "}
            <a
              href="mailto:GlisseGauloisse.Service@outlook.fr"
              className="text-vert-neon hover:underline"
            >
              GlisseGauloisse.Service@outlook.fr
            </a>
          </p>
          <p className="mt-2">
            Vous pouvez egalement adresser une reclamation a la CNIL (Commission
            Nationale de l&apos;Informatique et des Libertes).
          </p>
        </section>

        {/* Cookies */}
        <section>
          <h2 className="text-xl font-semibold text-blanc-casse mb-4">
            9. Cookies
          </h2>
          <p>
            Notre site utilise exclusivement des cookies techniques necessaires
            au bon fonctionnement du service (session utilisateur,
            preferences). Aucun cookie publicitaire, de tracking ou analytique
            tiers n&apos;est utilise.
          </p>
        </section>

        {/* Securite */}
        <section>
          <h2 className="text-xl font-semibold text-blanc-casse mb-4">
            10. Securite des donnees
          </h2>
          <p>
            Nous mettons en oeuvre des mesures techniques et organisationnelles
            appropriees pour proteger vos donnees personnelles contre tout acces
            non autorise, modification, divulgation ou destruction. Les
            paiements sont traites de maniere securisee par Stripe et nous ne
            stockons aucune donnee bancaire.
          </p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-xl font-semibold text-blanc-casse mb-4">
            11. Contact
          </h2>
          <p>
            Pour toute question relative a la presente politique de
            confidentialite ou pour exercer vos droits, vous pouvez nous
            contacter :
          </p>
          <div className="rounded-2xl border border-white/5 bg-gris-anthracite p-6 mt-4 space-y-2">
            <p>GlisseGauloisse EI</p>
            <p>49 Route de Margency, 95600 Eaubonne, France</p>
            <p>
              Email :{" "}
              <a
                href="mailto:GlisseGauloisse.Service@outlook.fr"
                className="text-vert-neon hover:underline"
              >
                GlisseGauloisse.Service@outlook.fr
              </a>
            </p>
            <p>Telephone : 07 86 75 79 63</p>
          </div>
        </section>
      </div>
    </div>
  );
}
