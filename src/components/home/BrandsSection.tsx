"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const brands = [
  "Dualtron",
  "Kaabo",
  "Xiaomi",
  "Kukirin",
  "Nami",
  "Teverun",
  "Vsett",
  "Minimotors",
];

export function BrandsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
            Marques <span className="text-vert-neon">Compatibles</span>
          </h2>
          <p className="mx-auto max-w-2xl text-blanc-casse/60">
            Nous intervenons sur toutes les grandes marques de trottinettes
            electriques.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {brands.map((brand, index) => (
            <motion.div
              key={brand}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              whileHover={{ scale: 1.05 }}
              className="group flex items-center justify-center rounded-xl border border-white/5 bg-gris-anthracite p-6 transition-all duration-300 hover:border-vert-neon/30 hover:shadow-lg hover:shadow-vert-neon/5"
            >
              <span className="text-lg font-bold text-blanc-casse/50 transition-colors group-hover:text-vert-neon">
                {brand}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
