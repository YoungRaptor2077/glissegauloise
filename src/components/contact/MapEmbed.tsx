"use client";

import { motion } from "framer-motion";

export function MapEmbed() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl overflow-hidden border border-white/5"
    >
      <iframe
        title="Localisation Glisse Gauloise"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2617.5!2d2.2764!3d48.9925!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s49+Route+de+Margency%2C+95600+Eaubonne%2C+France!5e0!3m2!1sfr!2sfr!4v1700000000000"
        width="100%"
        height="300"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="w-full h-[300px] lg:h-[400px] grayscale hover:grayscale-0 transition-all duration-500"
      />
    </motion.div>
  );
}
