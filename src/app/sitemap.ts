import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://skyscaled.com";
  const lastModified = new Date("2026-10-27T00:00:00.000Z");

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/#scale-explorer`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/#explainers`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/#sky-events`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}
