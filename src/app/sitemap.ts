import type { MetadataRoute } from "next";
import { DEITIES } from "@/lib/deities";
import { LAST_UPDATED, SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = LAST_UPDATED;
  return [
    { url: SITE_URL, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/chanda`, lastModified, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/puja`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/sampark`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/sadasya`, lastModified, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/darshan`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    ...DEITIES.map((d) => ({
      url: `${SITE_URL}/darshan/${d.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      images: [`${SITE_URL}${d.image}`],
    })),
  ];
}
