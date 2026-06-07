export interface BusinessHours {
  open: string;
  close: string;
}

export type DaySchedule = BusinessHours | null;

export interface WeekSchedule {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export const BUSINESS_HOURS: WeekSchedule = {
  monday: null,
  tuesday: null,
  wednesday: null,
  thursday: null,
  friday: null,
  saturday: { open: "09:00", close: "17:00" },
  sunday: { open: "09:00", close: "17:00" },
};

export const ONLINE_SERVICE_HOURS = {
  everyday: { open: "09:00", close: "17:00" },
};

export const COMPANY_INFO = {
  name: "GlisseGauloisse",
  forme: "Entreprise Individuelle (EI)",
  address: "49 Route de Margency",
  city: "95600 Eaubonne",
  country: "France",
  phone: "07 86 75 79 63",
  email: "GlisseGauloisse.Service@outlook.fr",
  siren: "993709013",
  siret: "99370901300011",
  tva: "FR55993709013",
} as const;

export const NAV_LINKS = [
  { label: "Accueil", href: "/" },
  { label: "Boutique", href: "/boutique" },
  { label: "Reparations", href: "/reparations" },
  { label: "Diagnostic", href: "/diagnostic" },
  { label: "Demander un devis", href: "/reparations#devis" },
  { label: "Tarifs", href: "/tarifs" },
  { label: "Contact", href: "/contact" },
] as const;

export const LEGAL_LINKS = [
  { label: "Mentions legales", href: "/mentions-legales" },
  { label: "Politique de confidentialite", href: "/politique-de-confidentialite" },
  { label: "CGV", href: "/conditions-generales-de-vente" },
] as const;
