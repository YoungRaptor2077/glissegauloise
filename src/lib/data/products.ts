// @deprecated - This file contains static fallback data. Real data is fetched from Supabase.

export interface ProductData {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  brand: string;
  category: string;
  categorySlug: string;
  images: string[];
  stockQuantity: number;
  isActive: boolean;
  isFeatured: boolean;
  compatibility: string[];
  specifications: Record<string, string>;
}

export const brands = [
  "Dualtron",
  "Kaabo",
  "Xiaomi",
  "Kukirin",
  "Nami",
  "Teverun",
  "Vsett",
  "Minimotors",
] as const;

export const categories = [
  { name: "Pneus", slug: "pneus" },
  { name: "Controleurs", slug: "controleurs" },
  { name: "Batteries", slug: "batteries" },
  { name: "Freinage", slug: "freinage" },
  { name: "Eclairage", slug: "eclairage" },
  { name: "Suspensions", slug: "suspensions" },
  { name: "Accessoires", slug: "accessoires" },
] as const;

export const products: ProductData[] = [
  {
    id: "1",
    name: "Pneu Tout-Terrain 10x3.0 Renforcé",
    slug: "pneu-tout-terrain-10x3-renforce",
    description:
      "Pneu tout-terrain haute performance pour trottinette électrique. Profil agressif pour une adhérence maximale sur tous types de surfaces. Gomme renforcée anti-crevaison avec chambre à air incluse. Compatible avec la majorité des modèles 10 pouces.",
    price: 34.9,
    compareAtPrice: 44.9,
    brand: "Dualtron",
    category: "Pneus",
    categorySlug: "pneus",
    images: ["/images/products/pneu-tt-10x3.jpg"],
    stockQuantity: 45,
    isActive: true,
    isFeatured: true,
    compatibility: ["Dualtron Thunder", "Dualtron Victor", "Kaabo Wolf Warrior"],
    specifications: {
      Dimensions: "10 x 3.0 pouces",
      Type: "Tout-terrain avec chambre",
      Poids: "680g",
      Matériau: "Caoutchouc renforcé",
    },
  },
  {
    id: "2",
    name: "Controleur Sinusoidal 60V 40A",
    slug: "controleur-sinusoidal-60v-40a",
    description:
      "Controleur sinusoidal de haute qualité pour trottinette électrique 60V. Offre une conduite souple et silencieuse avec un contrôle précis de la puissance. Programmable via application Bluetooth pour ajuster les paramètres de conduite.",
    price: 89.9,
    compareAtPrice: null,
    brand: "Minimotors",
    category: "Controleurs",
    categorySlug: "controleurs",
    images: ["/images/products/controleur-60v-40a.jpg"],
    stockQuantity: 12,
    isActive: true,
    isFeatured: true,
    compatibility: ["Dualtron Mini", "Dualtron Compact", "Minimotors Speedway 5"],
    specifications: {
      Tension: "60V",
      Courant: "40A max",
      Type: "Sinusoidal FOC",
      Connectique: "JST / XT60",
    },
  },
  {
    id: "3",
    name: "Batterie Lithium 48V 20Ah Samsung",
    slug: "batterie-lithium-48v-20ah-samsung",
    description:
      "Batterie lithium-ion haute capacité avec cellules Samsung 21700. Offre une autonomie exceptionnelle et une durée de vie prolongée. BMS intelligent intégré pour une protection optimale contre la surcharge et la décharge profonde.",
    price: 449.0,
    compareAtPrice: 529.0,
    brand: "Kaabo",
    category: "Batteries",
    categorySlug: "batteries",
    images: ["/images/products/batterie-48v-20ah.jpg"],
    stockQuantity: 8,
    isActive: true,
    isFeatured: true,
    compatibility: ["Kaabo Mantis", "Kaabo Wolf King", "Vsett 10+"],
    specifications: {
      Tension: "48V",
      Capacité: "20Ah (960Wh)",
      Cellules: "Samsung 21700 50E",
      Cycles: "800+ cycles",
    },
  },
  {
    id: "4",
    name: "Kit Freinage Hydraulique Zoom",
    slug: "kit-freinage-hydraulique-zoom",
    description:
      "Kit de frein hydraulique complet avec disque 140mm et étriers. Installation facile avec durites pré-remplies. Puissance de freinage exceptionnelle pour une sécurité maximale même à haute vitesse.",
    price: 67.5,
    compareAtPrice: 79.9,
    brand: "Xiaomi",
    category: "Freinage",
    categorySlug: "freinage",
    images: ["/images/products/frein-hydraulique-zoom.jpg"],
    stockQuantity: 23,
    isActive: true,
    isFeatured: false,
    compatibility: ["Xiaomi Pro 2", "Xiaomi Essential", "Ninebot Max G30"],
    specifications: {
      Type: "Hydraulique à disque",
      Disque: "140mm",
      Matériau: "Alliage aluminium",
      Durite: "Pré-remplie 1200mm",
    },
  },
  {
    id: "5",
    name: "Phare LED Avant 1200 Lumens",
    slug: "phare-led-avant-1200-lumens",
    description:
      "Phare avant LED ultra-puissant avec 1200 lumens. Trois modes d'éclairage (fort, moyen, clignotant). Étanche IPX5 pour une utilisation par tous les temps. Fixation universelle par collier réglable.",
    price: 29.9,
    compareAtPrice: null,
    brand: "Kukirin",
    category: "Eclairage",
    categorySlug: "eclairage",
    images: ["/images/products/phare-led-1200lm.jpg"],
    stockQuantity: 56,
    isActive: true,
    isFeatured: false,
    compatibility: ["Universel - Compatible toutes trottinettes"],
    specifications: {
      Puissance: "1200 lumens",
      Batterie: "4000mAh intégrée",
      Autonomie: "4-8h selon mode",
      Étanchéité: "IPX5",
    },
  },
  {
    id: "6",
    name: "Amortisseur Arrière Hydraulique 150mm",
    slug: "amortisseur-arriere-hydraulique-150mm",
    description:
      "Amortisseur arrière hydraulique réglable en précharge et détente. Course de 150mm pour un confort optimal sur les routes dégradées. Construction robuste en aluminium anodisé noir.",
    price: 54.9,
    compareAtPrice: 69.9,
    brand: "Nami",
    category: "Suspensions",
    categorySlug: "suspensions",
    images: ["/images/products/amortisseur-150mm.jpg"],
    stockQuantity: 15,
    isActive: true,
    isFeatured: true,
    compatibility: ["Nami Burn-E", "Nami Klima", "Dualtron Thunder"],
    specifications: {
      Course: "150mm",
      Type: "Hydraulique réglable",
      Matériau: "Aluminium 6061-T6",
      Poids: "420g",
    },
  },
  {
    id: "7",
    name: "Pneu Route Tubeless 8.5 pouces",
    slug: "pneu-route-tubeless-8-5-pouces",
    description:
      "Pneu route tubeless anti-crevaison pour Xiaomi M365 et compatibles. Technologie en nid d'abeille pour un roulement sans effort et zéro risque de crevaison. Installation simple sans chambre à air.",
    price: 19.9,
    compareAtPrice: 24.9,
    brand: "Xiaomi",
    category: "Pneus",
    categorySlug: "pneus",
    images: ["/images/products/pneu-tubeless-8-5.jpg"],
    stockQuantity: 78,
    isActive: true,
    isFeatured: false,
    compatibility: ["Xiaomi M365", "Xiaomi Pro 2", "Xiaomi 1S"],
    specifications: {
      Dimensions: "8.5 pouces",
      Type: "Tubeless plein",
      Poids: "450g",
      Structure: "Nid d'abeille",
    },
  },
  {
    id: "8",
    name: "Controleur Double 72V 50A Nami",
    slug: "controleur-double-72v-50a-nami",
    description:
      "Controleur double moteur pour trottinettes 72V haute puissance. Gestion indépendante des deux moteurs pour une traction optimale. Mode ECO et SPORT programmables avec écran de contrôle.",
    price: 159.0,
    compareAtPrice: 189.0,
    brand: "Nami",
    category: "Controleurs",
    categorySlug: "controleurs",
    images: ["/images/products/controleur-72v-50a.jpg"],
    stockQuantity: 5,
    isActive: true,
    isFeatured: true,
    compatibility: ["Nami Burn-E", "Nami Viper"],
    specifications: {
      Tension: "72V",
      Courant: "50A par moteur",
      Type: "Double sinusoidal",
      Programmation: "Via écran LCD",
    },
  },
  {
    id: "9",
    name: "Batterie 60V 28Ah LG Haute Autonomie",
    slug: "batterie-60v-28ah-lg-haute-autonomie",
    description:
      "Batterie premium avec cellules LG M50T pour une autonomie record. Idéale pour les longs trajets avec plus de 100km d'autonomie. Système BMS avancé avec monitoring par application mobile.",
    price: 699.0,
    compareAtPrice: null,
    brand: "Teverun",
    category: "Batteries",
    categorySlug: "batteries",
    images: ["/images/products/batterie-60v-28ah.jpg"],
    stockQuantity: 3,
    isActive: true,
    isFeatured: true,
    compatibility: ["Teverun Fighter 11", "Teverun Blade GT", "Dualtron Thunder 2"],
    specifications: {
      Tension: "60V",
      Capacité: "28Ah (1680Wh)",
      Cellules: "LG M50T",
      Cycles: "1000+ cycles",
    },
  },
  {
    id: "10",
    name: "Plaquettes Frein Semi-Métalliques (x4)",
    slug: "plaquettes-frein-semi-metalliques-x4",
    description:
      "Lot de 4 plaquettes de frein semi-métalliques haute performance. Excellent compromis entre puissance de freinage et durée de vie. Compatible avec la majorité des étriers de trottinettes électriques.",
    price: 14.9,
    compareAtPrice: null,
    brand: "Vsett",
    category: "Freinage",
    categorySlug: "freinage",
    images: ["/images/products/plaquettes-frein-x4.jpg"],
    stockQuantity: 120,
    isActive: true,
    isFeatured: false,
    compatibility: ["Vsett 8", "Vsett 9+", "Vsett 10+", "Vsett 11+"],
    specifications: {
      Quantité: "4 plaquettes",
      Type: "Semi-métallique",
      Compatible: "Étriers mécaniques et hydrauliques",
      Durée: "3000-5000 km",
    },
  },
  {
    id: "11",
    name: "Bande LED RGB Étanche Deck",
    slug: "bande-led-rgb-etanche-deck",
    description:
      "Bande LED RGB étanche pour personnaliser le deck de votre trottinette. 16 millions de couleurs contrôlables par télécommande ou application. Coupe adaptable à toutes les tailles de deck.",
    price: 22.9,
    compareAtPrice: 29.9,
    brand: "Kukirin",
    category: "Eclairage",
    categorySlug: "eclairage",
    images: ["/images/products/led-rgb-deck.jpg"],
    stockQuantity: 34,
    isActive: true,
    isFeatured: false,
    compatibility: ["Universel - Compatible toutes trottinettes"],
    specifications: {
      Longueur: "1m (coupable)",
      LEDs: "60 LEDs/m RGB",
      Alimentation: "5V USB",
      Étanchéité: "IP65",
    },
  },
  {
    id: "12",
    name: "Amortisseur Avant Pneumatique Réglable",
    slug: "amortisseur-avant-pneumatique-reglable",
    description:
      "Amortisseur avant pneumatique avec réglage de pression pour adapter la dureté à votre poids et style de conduite. Construction en aluminium usiné CNC. Idéal pour les trottinettes sans suspension d'origine.",
    price: 79.9,
    compareAtPrice: 99.9,
    brand: "Dualtron",
    category: "Suspensions",
    categorySlug: "suspensions",
    images: ["/images/products/amortisseur-avant-pneumatique.jpg"],
    stockQuantity: 9,
    isActive: true,
    isFeatured: false,
    compatibility: ["Dualtron Mini", "Dualtron Spider", "Dualtron Compact"],
    specifications: {
      Type: "Pneumatique réglable",
      Pression: "30-80 PSI",
      Course: "40mm",
      Matériau: "Aluminium CNC 7075",
    },
  },
  {
    id: "13",
    name: "Poignées Ergonomiques Gel Anti-Vibration",
    slug: "poignees-ergonomiques-gel-anti-vibration",
    description:
      "Poignées ergonomiques avec gel anti-vibration pour un confort optimal sur les longs trajets. Design lock-on pour une fixation sécurisée. Compatibles avec tous les guidons standards 22mm.",
    price: 18.5,
    compareAtPrice: null,
    brand: "Kaabo",
    category: "Accessoires",
    categorySlug: "accessoires",
    images: ["/images/products/poignees-gel.jpg"],
    stockQuantity: 42,
    isActive: true,
    isFeatured: false,
    compatibility: ["Universel - Guidon 22mm"],
    specifications: {
      Diamètre: "22mm standard",
      Matériau: "Caoutchouc + Gel",
      Longueur: "130mm",
      Fixation: "Lock-on double vis",
    },
  },
  {
    id: "14",
    name: "Garde-Boue Arrière Renforcé avec Support",
    slug: "garde-boue-arriere-renforce-support",
    description:
      "Garde-boue arrière renforcé en fibre de nylon avec support métallique. Résiste aux projections et aux chocs. Design aérodynamique qui s'intègre parfaitement à votre trottinette.",
    price: 24.9,
    compareAtPrice: null,
    brand: "Vsett",
    category: "Accessoires",
    categorySlug: "accessoires",
    images: ["/images/products/garde-boue-arriere.jpg"],
    stockQuantity: 0,
    isActive: true,
    isFeatured: false,
    compatibility: ["Vsett 9+", "Vsett 10+"],
    specifications: {
      Matériau: "Nylon renforcé fibre de verre",
      Support: "Acier inoxydable",
      Poids: "180g",
      Couleur: "Noir mat",
    },
  },
  {
    id: "15",
    name: "Pneu Hiver Clouté 10 pouces",
    slug: "pneu-hiver-cloute-10-pouces",
    description:
      "Pneu hiver avec clous en carbure de tungstène pour une adhérence maximale sur routes mouillées et verglas. 72 clous répartis uniformément. Indispensable pour rouler en toute sécurité l'hiver.",
    price: 49.9,
    compareAtPrice: 59.9,
    brand: "Teverun",
    category: "Pneus",
    categorySlug: "pneus",
    images: ["/images/products/pneu-hiver-cloute.jpg"],
    stockQuantity: 18,
    isActive: true,
    isFeatured: false,
    compatibility: ["Teverun Fighter 11", "Dualtron Thunder", "Kaabo Wolf Warrior"],
    specifications: {
      Dimensions: "10 x 2.5 pouces",
      Clous: "72 carbure de tungstène",
      Poids: "820g",
      Saison: "Hiver / routes mouillées",
    },
  },
];

export function getProductBySlug(slug: string): ProductData | undefined {
  return products.find((p) => p.slug === slug);
}

export function getRelatedProducts(product: ProductData, limit = 4): ProductData[] {
  return products
    .filter((p) => p.id !== product.id && p.categorySlug === product.categorySlug)
    .slice(0, limit);
}
