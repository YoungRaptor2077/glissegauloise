import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { COMPANY_INFO, NAV_LINKS, LEGAL_LINKS, BUSINESS_HOURS, ONLINE_SERVICE_HOURS } from "@/lib/constants";

function formatHours(day: string, schedule: { open: string; close: string } | null): string {
  if (!schedule) return `${day}: Ferme`;
  return `${day}: ${schedule.open} - ${schedule.close}`;
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-gris-anthracite">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold text-blanc-casse">
                Glisse
              </span>
              <span className="text-lg font-bold text-vert-neon">
                Gauloisse
              </span>
            </div>
            <p className="text-sm text-blanc-casse/60">
              Votre specialiste en trottinettes electriques. Reparation,
              diagnostic et vente de pieces detachees.
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-sm text-blanc-casse/60">
                <MapPin size={16} className="mt-0.5 shrink-0 text-vert-neon/70" />
                <span>
                  {COMPANY_INFO.address}, {COMPANY_INFO.city},{" "}
                  {COMPANY_INFO.country}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-blanc-casse/60">
                <Phone size={16} className="shrink-0 text-vert-neon/70" />
                <a
                  href={`tel:${COMPANY_INFO.phone.replace(/\s/g, "")}`}
                  className="transition-colors hover:text-vert-neon"
                >
                  {COMPANY_INFO.phone}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-blanc-casse/60">
                <Mail size={16} className="shrink-0 text-vert-neon/70" />
                <a
                  href={`mailto:${COMPANY_INFO.email}`}
                  className="transition-colors hover:text-vert-neon"
                >
                  {COMPANY_INFO.email}
                </a>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-blanc-casse">
              Navigation
            </h3>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-blanc-casse/60 transition-colors hover:text-vert-neon"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-blanc-casse">
              Horaires
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-blanc-casse/60">
                <Clock size={16} className="mt-0.5 shrink-0 text-vert-neon/70" />
                <div className="space-y-2 text-xs">
                  <div>
                    <p className="font-medium text-blanc-casse/80 mb-1">Atelier</p>
                    <p>{formatHours("Samedi", BUSINESS_HOURS.saturday)}</p>
                    <p>{formatHours("Dimanche", BUSINESS_HOURS.sunday)}</p>
                    <p>Lundi - Vendredi: Ferme</p>
                  </div>
                  <div>
                    <p className="font-medium text-blanc-casse/80 mb-1">Service en ligne</p>
                    <p>Tous les jours: {ONLINE_SERVICE_HOURS.everyday.open} - {ONLINE_SERVICE_HOURS.everyday.close}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-blanc-casse">
              Informations legales
            </h3>
            <ul className="space-y-2">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-blanc-casse/60 transition-colors hover:text-vert-neon"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-blanc-casse">
              Suivez-nous
            </h3>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/glissegauloisse/?hl=fr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-blanc-casse/60 hover:border-vert-neon/40 hover:text-vert-neon transition-colors"
                aria-label="Instagram"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@glissegauloisse"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-blanc-casse/60 hover:border-vert-neon/40 hover:text-vert-neon transition-colors"
                aria-label="TikTok"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.28 0 .55.04.81.1v-3.5a6.37 6.37 0 0 0-.81-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.05a8.27 8.27 0 0 0 4.76 1.5V7.1a4.83 4.83 0 0 1-1-.41z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-white/5 pt-8">
          <p className="text-center text-xs text-blanc-casse/40">
            &copy; {currentYear} {COMPANY_INFO.name}. Tous droits reserves.
          </p>
        </div>
      </div>
    </footer>
  );
}
