"use client";

import { motion } from "framer-motion";
import { Phone, Mail } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { MapEmbed } from "@/components/contact/MapEmbed";
import { BusinessInfo } from "@/components/contact/BusinessInfo";
import { COMPANY_INFO } from "@/lib/constants";

export default function ContactPage() {
  return (
    <div className="min-h-screen py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl lg:text-5xl font-bold text-blanc-casse mb-4">
            Contactez-<span className="text-vert-neon">nous</span>
          </h1>
          <p className="text-lg text-blanc-casse/60 max-w-2xl mx-auto">
            Une question, un devis ou besoin d&apos;assistance ? Notre equipe
            est a votre ecoute.
          </p>
        </motion.div>

        {/* Quick action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          <a
            href={`tel:${COMPANY_INFO.phone.replace(/\s/g, "")}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-vert-neon text-noir-mat font-medium text-sm hover:bg-vert-neon-dark transition-colors"
          >
            <Phone className="h-4 w-4" />
            Appeler
          </a>
          <a
            href={`mailto:${COMPANY_INFO.email}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-vert-neon/30 text-vert-neon font-medium text-sm hover:bg-vert-neon/10 transition-colors"
          >
            <Mail className="h-4 w-4" />
            Envoyer un email
          </a>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <ContactForm />
          <BusinessInfo />
        </div>

        {/* Map */}
        <MapEmbed />
      </div>
    </div>
  );
}
