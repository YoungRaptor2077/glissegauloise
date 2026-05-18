"use client";

import { useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "Quels types de trottinettes electriques reparez-vous ?",
    answer:
      "Nous reparons toutes les marques et modeles de trottinettes electriques : Dualtron, Kaabo, Xiaomi, Nami, Vsett, Minimotors, Kukirin, Teverun et bien d'autres. Que ce soit un modele grand public ou haut de gamme, nous avons l'expertise necessaire.",
  },
  {
    question: "Combien de temps dure une reparation en moyenne ?",
    answer:
      "La plupart des reparations courantes (changement de pneus, plaquettes, petite electronique) sont realisees en 24 a 48h. Pour les interventions plus complexes (remplacement batterie, controleur), comptez 3 a 5 jours ouvrables selon la disponibilite des pieces.",
  },
  {
    question: "Proposez-vous un devis gratuit ?",
    answer:
      "Oui, le diagnostic et le devis sont gratuits et sans engagement. Nous vous communiquons un devis detaille avant toute intervention afin que vous puissiez prendre votre decision en toute transparence.",
  },
  {
    question: "Quelles sont vos garanties sur les reparations ?",
    answer:
      "Toutes nos reparations sont garanties 3 mois pieces et main d'oeuvre. Les pieces neuves installees beneficient de la garantie constructeur. Nous utilisons uniquement des pieces de qualite certifiee.",
  },
  {
    question: "Livrez-vous les pieces detachees ?",
    answer:
      "Oui, nous proposons la livraison de pieces detachees partout en France. Les commandes passees avant 14h sont generalement expediees le jour meme. Retrait gratuit en atelier a Eaubonne.",
  },
  {
    question: "Puis-je suivre l'avancement de ma reparation ?",
    answer:
      "Absolument ! Nous vous tenons informe par SMS ou email a chaque etape de la reparation. Vous pouvez aussi nous contacter par telephone pour connaitre l'etat d'avancement.",
  },
  {
    question: "Faites-vous des reparations a domicile ?",
    answer:
      "Actuellement, les reparations sont effectuees dans notre atelier a Eaubonne. Cela nous permet d'utiliser tous nos outils specialises et de garantir la meilleure qualite d'intervention.",
  },
  {
    question: "Acceptez-vous les trottinettes sous garantie constructeur ?",
    answer:
      "Nous pouvons intervenir sur les trottinettes sous garantie pour les operations non couvertes. Pour les pannes couvertes par la garantie constructeur, nous vous recommandons de contacter votre revendeur en priorite.",
  },
];

function FAQItem({
  question,
  answer,
  index,
}: {
  question: string;
  answer: string;
  index: number;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="border-b border-white/5 last:border-0"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-5 text-left transition-colors hover:text-vert-neon"
      >
        <span className="pr-4 font-medium text-blanc-casse">{question}</span>
        <span className="flex-shrink-0 text-vert-neon">
          {isOpen ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm leading-relaxed text-blanc-casse/60">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="bg-gris-anthracite/50 py-20 sm:py-28" ref={ref}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            Questions <span className="text-vert-neon">Frequentes</span>
          </h2>
          <p className="mx-auto max-w-2xl text-blanc-casse/60">
            Les reponses aux questions les plus posees par nos clients.
          </p>
        </motion.div>

        {isInView && (
          <div className="rounded-2xl border border-white/5 bg-gris-anthracite p-6">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
