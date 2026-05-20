import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://glissegauloisse.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/espace-client/", "/api/", "/checkout/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
