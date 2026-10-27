import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://skyscaled.com/sitemap.xml",
    host: "https://skyscaled.com",
  };
}
