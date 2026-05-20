import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-noir-mat px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="text-8xl font-bold text-vert-neon/20">404</div>
        <h1 className="text-2xl font-bold text-blanc-casse">Page introuvable</h1>
        <p className="text-blanc-casse/60">
          La page que vous recherchez n&apos;existe pas ou a ete deplacee.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link
            href="/"
            className="rounded-xl bg-vert-neon px-6 py-3 text-sm font-semibold text-noir-mat hover:opacity-90 transition-opacity"
          >
            Retour a l&apos;accueil
          </Link>
          <Link
            href="/contact"
            className="rounded-xl border border-white/10 px-6 py-3 text-sm font-medium text-blanc-casse/80 hover:bg-gris-anthracite transition-colors"
          >
            Nous contacter
          </Link>
        </div>
      </div>
    </div>
  );
}
