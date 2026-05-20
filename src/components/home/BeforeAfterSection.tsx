"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";

interface GalleryImage {
  id: string;
  image_url: string;
  title: string | null;
  description: string | null;
}

const repairs = [
  {
    title: "Remplacement batterie Dualtron",
    description: "Batterie defectueuse remplacee par une cellule haute capacite.",
    before: "Batterie gonflee, autonomie 5km",
    after: "Batterie neuve, autonomie 60km",
  },
  {
    title: "Reparation controleur Kaabo",
    description: "Controleur grille suite a un court-circuit, remplacement complet.",
    before: "Trottinette ne demarre plus",
    after: "Fonctionnement parfait restaure",
  },
  {
    title: "Changement pneus Xiaomi Pro",
    description: "Pneus uses remplaces par des pneus renforcees anti-crevaison.",
    before: "Pneus lisses, crevaisons frequentes",
    after: "Pneus neufs, adherence optimale",
  },
  {
    title: "Revision freinage Nami",
    description: "Plaquettes et disques remplaces, purge du systeme hydraulique.",
    before: "Freinage mou, distance longue",
    after: "Freinage puissant et precis",
  },
];

export function BeforeAfterSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const res = await fetch("/api/admin/gallery");
        if (res.ok) {
          const data = await res.json();
          setGalleryImages(data.images || []);
        }
      } catch {
        // Use default content
      }
    }
    fetchGallery();
  }, []);

  return (
    <section className="py-20 sm:py-28" ref={ref}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            {galleryImages.length > 0 ? (
              <>Nos <span className="text-vert-neon">Realisations</span></>
            ) : (
              <>Avant / <span className="text-vert-neon">Apres</span></>
            )}
          </h2>
          <p className="mx-auto max-w-2xl text-blanc-casse/60">
            {galleryImages.length > 0
              ? "Decouvrez nos travaux et reparations en images."
              : "Quelques exemples de nos interventions et reparations realisees."}
          </p>
        </motion.div>

        {galleryImages.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {galleryImages.map((img, index) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-2xl border border-white/5 bg-gris-anthracite overflow-hidden"
              >
                <img
                  src={img.image_url}
                  alt={img.title || "Realisation"}
                  className="h-48 w-full object-cover"
                />
                {(img.title || img.description) && (
                  <div className="p-4">
                    {img.title && (
                      <h3 className="text-sm font-semibold text-blanc-casse">
                        {img.title}
                      </h3>
                    )}
                    {img.description && (
                      <p className="mt-1 text-xs text-blanc-casse/60">
                        {img.description}
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {repairs.map((repair, index) => (
              <motion.div
                key={repair.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="rounded-2xl border border-white/5 bg-gris-anthracite p-6"
              >
                <h3 className="mb-2 text-lg font-semibold text-blanc-casse">
                  {repair.title}
                </h3>
                <p className="mb-4 text-sm text-blanc-casse/60">
                  {repair.description}
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 rounded-lg bg-red-500/10 p-3">
                    <span className="text-xs font-medium text-red-400">Avant</span>
                    <p className="mt-1 text-sm text-blanc-casse/70">
                      {repair.before}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 flex-shrink-0 text-vert-neon" />
                  <div className="flex-1 rounded-lg bg-vert-neon/10 p-3">
                    <span className="text-xs font-medium text-vert-neon">Apres</span>
                    <p className="mt-1 text-sm text-blanc-casse/70">
                      {repair.after}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
