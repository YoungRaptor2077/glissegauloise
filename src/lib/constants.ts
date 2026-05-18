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
  monday: { open: "09:00", close: "18:00" },
  tuesday: null,
  wednesday: { open: "09:00", close: "18:00" },
  thursday: { open: "09:00", close: "18:00" },
  friday: { open: "09:00", close: "18:00" },
  saturday: { open: "09:00", close: "17:00" },
  sunday: null,
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
  { label: "Demander un devis", href: "/reparations#devis" },
  { label: "Tarifs", href: "/tarifs" },
  { label: "Contact", href: "/contact" },
] as const;

export const LEGAL_LINKS = [
  { label: "Mentions legales", href: "/mentions-legales" },
  { label: "Politique de confidentialite", href: "/politique-confidentialite" },
  { label: "CGV", href: "/cgv" },
] as const;
