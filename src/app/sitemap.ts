import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://glissegauloisse.fr";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/boutique",
    "/reparations",
    "/tarifs",
    "/contact",
    "/mentions-legales",
    "/politique-de-confidentialite",
    "/conditions-generales-de-vente",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPages.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/boutique" ? 0.9 : 0.7,
  }));

  return staticEntries;
}
