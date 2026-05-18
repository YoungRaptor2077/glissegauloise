"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Phone, Mail, MapPin, Clock, ArrowRight } from "lucide-react";
import { COMPANY_INFO, BUSINESS_HOURS } from "@/lib/constants";

export function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const formatHours = () => {
    const days = [
      { label: "Lundi", schedule: BUSINESS_HOURS.monday },
      { label: "Mardi", schedule: BUSINESS_HOURS.tuesday },
      { label: "Mercredi", schedule: BUSINESS_HOURS.wednesday },
      { label: "Jeudi", schedule: BUSINESS_HOURS.thursday },
      { label: "Vendredi", schedule: BUSINESS_HOURS.friday },
      { label: "Samedi", schedule: BUSINESS_HOURS.saturday },
      { label: "Dimanche", schedule: BUSINESS_HOURS.sunday },
    ];
    return days;
  };

  const hours = formatHours();

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
            Nous <span className="text-vert-neon">Contacter</span>
          </h2>
          <p className="mx-auto max-w-2xl text-blanc-casse/60">
            Besoin d&apos;un renseignement ou d&apos;un devis ? N&apos;hesitez
            pas a nous contacter.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="rounded-2xl border border-white/5 bg-gris-anthracite p-6">
              <div className="space-y-5">
                <a
                  href={`tel:${COMPANY_INFO.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-4 transition-colors hover:text-vert-neon"
                >
                  <div className="rounded-lg bg-vert-neon/10 p-2.5 text-vert-neon">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-blanc-casse/50">Telephone</p>
                    <p className="font-medium">{COMPANY_INFO.phone}</p>
                  </div>
                </a>

                <a
                  href={`mailto:${COMPANY_INFO.email}`}
                  className="flex items-center gap-4 transition-colors hover:text-vert-neon"
                >
                  <div className="rounded-lg bg-vert-neon/10 p-2.5 text-vert-neon">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-blanc-casse/50">Email</p>
                    <p className="font-medium">{COMPANY_INFO.email}</p>
                  </div>
                </a>

                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-vert-neon/10 p-2.5 text-vert-neon">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-blanc-casse/50">Adresse</p>
                    <p className="font-medium">
                      {COMPANY_INFO.address}, {COMPANY_INFO.city}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/contact"
                className="flex items-center justify-center gap-2 rounded-xl bg-vert-neon px-7 py-3.5 text-base font-semibold text-noir-mat shadow-lg shadow-vert-neon/20 transition-colors hover:bg-vert-neon-dark"
              >
                Nous contacter
                <ArrowRight className="h-5 w-5" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Hours */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="rounded-2xl border border-white/5 bg-gris-anthracite p-6"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-vert-neon/10 p-2.5 text-vert-neon">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">Horaires d&apos;ouverture</h3>
            </div>

            <div className="space-y-3">
              {hours.map((day) => (
                <div
                  key={day.label}
                  className="flex items-center justify-between border-b border-white/5 pb-2 last:border-0"
                >
                  <span className="text-sm text-blanc-casse/70">{day.label}</span>
                  <span className="text-sm font-medium">
                    {day.schedule
                      ? `${day.schedule.open} - ${day.schedule.close}`
                      : "Ferme"}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
