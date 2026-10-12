import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${site.url}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/book`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/founding-members`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
  ];
}
