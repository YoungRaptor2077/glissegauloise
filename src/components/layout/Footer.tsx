import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { COMPANY_INFO, NAV_LINKS, LEGAL_LINKS, BUSINESS_HOURS } from "@/lib/constants";

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
              Votre specialiste glisse urbaine. Skateboards, longboards,
              surfskates et reparations professionnelles.
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
            <div className="space-y-1.5">
              <div className="flex items-start gap-2 text-blanc-casse/60">
                <Clock size={16} className="mt-0.5 shrink-0 text-vert-neon/70" />
                <div className="space-y-1 text-xs">
                  <p>{formatHours("Lundi", BUSINESS_HOURS.monday)}</p>
                  <p>{formatHours("Mardi", BUSINESS_HOURS.tuesday)}</p>
                  <p>{formatHours("Mercredi", BUSINESS_HOURS.wednesday)}</p>
                  <p>{formatHours("Jeudi", BUSINESS_HOURS.thursday)}</p>
                  <p>{formatHours("Vendredi", BUSINESS_HOURS.friday)}</p>
                  <p>{formatHours("Samedi", BUSINESS_HOURS.saturday)}</p>
                  <p>{formatHours("Dimanche", BUSINESS_HOURS.sunday)}</p>
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
