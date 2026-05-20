import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Generales de Vente",
  description: "Conditions generales de vente de GlisseGauloisse - Modalites de commande, paiement, livraison et retours.",
};

export default function CGVPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-blanc-casse mb-8">
        Conditions Generales de Vente
      </h1>

      <p className="text-blanc-casse/60 mb-8">
        Derniere mise a jour : Janvier 2025
      </p>

      <div className="space-y-8 text-blanc-casse/80">
        <section>
          <h2 className="text-xl font-semibold text-blanc-casse mb-4">
            Article 1 - Objet et champ d&apos;application
          </h2>
          <p>
            Les presentes Conditions Generales de Vente (CGV) regissent les
            ventes de produits et services effectuees par GlisseGauloisse EI
            (SIRET 99370901300011) via le site internet glissegauloisse.com.
            Toute commande implique l&apos;acceptation sans reserve des presentes CGV.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-blanc-casse mb-4">
            Article 2 - Produits et services
          </h2>
          <p>
            GlisseGauloisse propose a la vente des articles de glisse
            (skateboards, longboards, surfskates), des accessoires et des
            services de reparation. Les produits sont decrits avec la plus grande
            exactitude possible. Les photographies sont non contractuelles.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-blanc-casse mb-4">
            Article 3 - Commandes
          </h2>
          <p className="mb-3">Le processus de commande comprend les etapes suivantes :</p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Selection des produits et ajout au panier</li>
            <li>Verification du panier et des quantites</li>
            <li>Saisie des informations de livraison</li>
            <li>Choix du mode de livraison</li>
            <li>Paiement securise en ligne</li>
            <li>Confirmation de commande par email</li>
          </ol>
          <p className="mt-3">
            GlisseGauloisse se reserve le droit de refuser toute commande pour
            motif legitime (stock insuffisant, informations erronees, etc.).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-blanc-casse mb-4">
            Article 4 - Prix
          </h2>
          <p>
            Les prix sont indiques en euros toutes taxes comprises (TTC). La TVA
            applicable est celle en vigueur au jour de la commande. GlisseGauloisse
            se reserve le droit de modifier ses prix a tout moment. Les produits
            sont factures au prix en vigueur au moment de la validation de la
            commande. Les frais de livraison s&apos;ajoutent au prix des produits et
            sont indiques avant la validation de la commande.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-blanc-casse mb-4">
            Article 5 - Paiement
          </h2>
          <p>
            Le paiement s&apos;effectue en ligne par carte bancaire via la plateforme
            securisee Stripe. Le paiement est debite au moment de la validation
            de la commande. Les transactions sont securisees et chiffrees.
            GlisseGauloisse ne stocke aucune donnee bancaire.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-blanc-casse mb-4">
            Article 6 - Livraison
          </h2>
          <p className="mb-3">
            Les commandes sont livrees en France metropolitaine. Les delais de
            livraison indicatifs sont :
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Livraison standard : 3 a 5 jours ouvrables</li>
            <li>Livraison express : 1 a 2 jours ouvrables</li>
          </ul>
          <p className="mt-3">
            La livraison est gratuite a partir de 100 EUR d&apos;achat. En dessous de
            ce montant, les frais de livraison standard sont de 5,90 EUR.
            GlisseGauloisse ne saurait etre tenu responsable des retards de
            livraison imputables au transporteur.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-blanc-casse mb-4">
            Article 7 - Droit de retractation
          </h2>
          <p>
            Conformement aux articles L.221-18 et suivants du Code de la
            consommation, vous disposez d&apos;un delai de 14 jours a compter de la
            reception de votre commande pour exercer votre droit de retractation,
            sans avoir a justifier de motifs ni a payer de penalites. Les
            produits doivent etre retournes dans leur etat d&apos;origine et complets
            (emballage, accessoires, notice). Les frais de retour sont a la
            charge du client.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-blanc-casse mb-4">
            Article 8 - Remboursement
          </h2>
          <p>
            En cas de retour accepte, le remboursement sera effectue dans un
            delai de 14 jours suivant la reception du produit retourne, par le
            meme moyen de paiement que celui utilise lors de la commande. Le
            remboursement peut etre differe jusqu&apos;a reception du bien retourne ou
            preuve d&apos;expedition.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-blanc-casse mb-4">
            Article 9 - Garanties
          </h2>
          <p>
            Tous les produits beneficient de la garantie legale de conformite
            (articles L.217-4 et suivants du Code de la consommation) et de la
            garantie des vices caches (articles 1641 et suivants du Code civil).
            En cas de defaut de conformite, le client peut choisir entre la
            reparation ou le remplacement du bien.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-blanc-casse mb-4">
            Article 10 - Service de reparation
          </h2>
          <p>
            Le service de reparation fait l&apos;objet d&apos;un devis prealable. La
            reparation ne sera effectuee qu&apos;apres acceptation du devis par le
            client. Les delais de reparation sont communiques a titre indicatif.
            Le client est informe de l&apos;avancement via son espace client.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-blanc-casse mb-4">
            Article 11 - Responsabilite
          </h2>
          <p>
            GlisseGauloisse ne saurait etre tenu responsable de l&apos;inexecution du
            contrat en cas de force majeure, de perturbation ou de greve
            totale ou partielle des services postaux et moyens de transport
            et/ou communications. La responsabilite de GlisseGauloisse est
            limitee au montant de la commande.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-blanc-casse mb-4">
            Article 12 - Donnees personnelles
          </h2>
          <p>
            Les donnees personnelles collectees lors de votre commande sont
            traitees conformement a notre{" "}
            <a
              href="/politique-de-confidentialite"
              className="text-vert-neon hover:underline"
            >
              Politique de confidentialite
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-blanc-casse mb-4">
            Article 13 - Droit applicable et litiges
          </h2>
          <p className="mb-3">
            Les presentes CGV sont soumises au droit francais. En cas de litige,
            une solution amiable sera recherchee avant toute action judiciaire.
          </p>
          <p>
            Conformement aux dispositions du Code de la consommation, le client
            peut recourir a un mediateur de la consommation. A defaut de
            resolution amiable, le litige sera porte devant les tribunaux
            competents.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-blanc-casse mb-4">
            Article 14 - Contact
          </h2>
          <div className="rounded-2xl border border-white/5 bg-gris-anthracite p-6 space-y-2">
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
