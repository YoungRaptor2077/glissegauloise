import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions Legales",
  description: "Mentions legales de GlisseGauloisse - Informations sur l'entreprise et l'editeur du site.",
};

export default function MentionsLegalesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-blanc-casse mb-8">
        Mentions Legales
      </h1>

      <div className="space-y-8 text-blanc-casse/80">
        {/* Editeur du site */}
        <section>
          <h2 className="text-xl font-semibold text-blanc-casse mb-4">
            1. Editeur du site
          </h2>
          <div className="rounded-2xl border border-white/5 bg-gris-anthracite p-6 space-y-2">
            <p>
              <strong className="text-blanc-casse">Nom :</strong> GlisseGauloisse
            </p>
            <p>
              <strong className="text-blanc-casse">Forme juridique :</strong>{" "}
              Entreprise Individuelle (EI)
            </p>
            <p>
              <strong className="text-blanc-casse">SIREN :</strong> 993709013
            </p>
            <p>
              <strong className="text-blanc-casse">SIRET :</strong>{" "}
              99370901300011
            </p>
            <p>
              <strong className="text-blanc-casse">
                Numero de TVA intracommunautaire :
              </strong>{" "}
              FR55993709013
            </p>
            <p>
              <strong className="text-blanc-casse">Adresse :</strong> 49 Route
              de Margency, 95600 Eaubonne, France
            </p>
            <p>
              <strong className="text-blanc-casse">Telephone :</strong> 07 86 75
              79 63
            </p>
            <p>
              <strong className="text-blanc-casse">Email :</strong>{" "}
              GlisseGauloisse.Service@outlook.fr
            </p>
          </div>
        </section>

        {/* Directeur de publication */}
        <section>
          <h2 className="text-xl font-semibold text-blanc-casse mb-4">
            2. Directeur de la publication
          </h2>
          <p>Le directeur de la publication est le gerant de GlisseGauloisse EI.</p>
        </section>

        {/* Hebergement */}
        <section>
          <h2 className="text-xl font-semibold text-blanc-casse mb-4">
            3. Hebergement
          </h2>
          <div className="rounded-2xl border border-white/5 bg-gris-anthracite p-6 space-y-2">
            <p>
              <strong className="text-blanc-casse">Hebergeur :</strong> Vercel
              Inc.
            </p>
            <p>
              <strong className="text-blanc-casse">Adresse :</strong> 340 S
              Lemon Ave #4133, Walnut, CA 91789, USA
            </p>
            <p>
              <strong className="text-blanc-casse">Site web :</strong>{" "}
              <a
                href="https://vercel.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-vert-neon hover:underline"
              >
                https://vercel.com
              </a>
            </p>
          </div>
        </section>

        {/* Propriete intellectuelle */}
        <section>
          <h2 className="text-xl font-semibold text-blanc-casse mb-4">
            4. Propriete intellectuelle
          </h2>
          <p>
            L&apos;ensemble du contenu de ce site (textes, images, videos, logos,
            graphismes) est la propriete exclusive de GlisseGauloisse, sauf
            mention contraire. Toute reproduction, representation, modification,
            publication, ou adaptation de tout ou partie des elements du site est
            interdite sans l&apos;accord prealable ecrit de GlisseGauloisse.
          </p>
        </section>

        {/* Responsabilite */}
        <section>
          <h2 className="text-xl font-semibold text-blanc-casse mb-4">
            5. Limitation de responsabilite
          </h2>
          <p>
            GlisseGauloisse s&apos;efforce d&apos;assurer l&apos;exactitude et la mise a jour
            des informations diffusees sur ce site. Toutefois, GlisseGauloisse ne
            peut garantir l&apos;exactitude, la precision ou l&apos;exhaustivite des
            informations mises a disposition sur ce site.
          </p>
        </section>

        {/* Donnees personnelles */}
        <section>
          <h2 className="text-xl font-semibold text-blanc-casse mb-4">
            6. Protection des donnees personnelles
          </h2>
          <p>
            Conformement au Reglement General sur la Protection des Donnees
            (RGPD) et a la loi Informatique et Libertes, vous disposez d&apos;un
            droit d&apos;acces, de rectification, de suppression et d&apos;opposition sur
            vos donnees personnelles.
          </p>
          <p className="mt-2">
            Pour exercer ces droits, vous pouvez nous contacter a l&apos;adresse :{" "}
            <a
              href="mailto:GlisseGauloisse.Service@outlook.fr"
              className="text-vert-neon hover:underline"
            >
              GlisseGauloisse.Service@outlook.fr
            </a>
          </p>
          <p className="mt-2">
            Pour plus d&apos;informations, consultez notre{" "}
            <a
              href="/politique-de-confidentialite"
              className="text-vert-neon hover:underline"
            >
              Politique de confidentialite
            </a>
            .
          </p>
        </section>

        {/* Cookies */}
        <section>
          <h2 className="text-xl font-semibold text-blanc-casse mb-4">
            7. Cookies
          </h2>
          <p>
            Ce site utilise uniquement des cookies techniques necessaires a son
            bon fonctionnement. Aucun cookie publicitaire ou de suivi n&apos;est
            utilise.
          </p>
        </section>

        {/* Droit applicable */}
        <section>
          <h2 className="text-xl font-semibold text-blanc-casse mb-4">
            8. Droit applicable
          </h2>
          <p>
            Les presentes mentions legales sont regies par le droit francais.
            Tout litige relatif a l&apos;utilisation du site sera soumis a la
            competence exclusive des tribunaux francais.
          </p>
        </section>
      </div>
    </div>
  );
}
