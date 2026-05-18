"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { COMPANY_INFO, BUSINESS_HOURS } from "@/lib/constants";

const DAY_LABELS: Record<string, string> = {
  monday: "Lundi",
  tuesday: "Mardi",
  wednesday: "Mercredi",
  thursday: "Jeudi",
  friday: "Vendredi",
  saturday: "Samedi",
  sunday: "Dimanche",
};

export function BusinessInfo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl bg-gris-anthracite border border-white/5 p-6 lg:p-8 space-y-6"
    >
      <h3 className="text-xl font-bold text-blanc-casse">
        Informations de contact
      </h3>

      {/* Address */}
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-vert-neon/10 flex items-center justify-center flex-shrink-0">
          <MapPin className="h-4 w-4 text-vert-neon" />
        </div>
        <div>
          <p className="text-sm font-medium text-blanc-casse">Adresse</p>
          <p className="text-sm text-blanc-casse/60">
            {COMPANY_INFO.address}
            <br />
            {COMPANY_INFO.city}, {COMPANY_INFO.country}
          </p>
        </div>
      </div>

      {/* Phone */}
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-vert-neon/10 flex items-center justify-center flex-shrink-0">
          <Phone className="h-4 w-4 text-vert-neon" />
        </div>
        <div>
          <p className="text-sm font-medium text-blanc-casse">Telephone</p>
          <a
            href={`tel:${COMPANY_INFO.phone.replace(/\s/g, "")}`}
            className="text-sm text-vert-neon hover:text-vert-neon-dark transition-colors"
          >
            {COMPANY_INFO.phone}
          </a>
        </div>
      </div>

      {/* Email */}
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-vert-neon/10 flex items-center justify-center flex-shrink-0">
          <Mail className="h-4 w-4 text-vert-neon" />
        </div>
        <div>
          <p className="text-sm font-medium text-blanc-casse">Email</p>
          <a
            href={`mailto:${COMPANY_INFO.email}`}
            className="text-sm text-vert-neon hover:text-vert-neon-dark transition-colors"
          >
            {COMPANY_INFO.email}
          </a>
        </div>
      </div>

      {/* Hours */}
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-vert-neon/10 flex items-center justify-center flex-shrink-0">
          <Clock className="h-4 w-4 text-vert-neon" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-blanc-casse mb-2">
            Horaires d&apos;ouverture
          </p>
          <table className="w-full">
            <tbody>
              {Object.entries(BUSINESS_HOURS).map(([day, schedule]) => (
                <tr key={day} className="border-b border-white/5 last:border-0">
                  <td className="py-1.5 text-sm text-blanc-casse/70">
                    {DAY_LABELS[day]}
                  </td>
                  <td className="py-1.5 text-sm text-right">
                    {schedule ? (
                      <span className="text-blanc-casse/80">
                        {schedule.open} - {schedule.close}
                      </span>
                    ) : (
                      <span className="text-red-400/80">Ferme</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
