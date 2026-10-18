import type { Metadata } from "next";
import { MANDIR } from "./mandir";

// TODO: set NEXT_PUBLIC_SITE_URL to the real domain once bought (e.g. https://shanteshwarmandir.in).
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://shanteshwarmandir.in").replace(/\/$/, "");

// Bump when content changes meaningfully; used by the sitemap.
export const LAST_UPDATED = "2026-10-18";

export const GEO = { lat: 25.631438, lng: 85.090609 }; // decoded from plus code 7MQ7J3JR+H6H

// How people actually search for this temple, in Hindi, Hinglish and English.
export const KEYWORDS = [
  "शिव मंदिर रोड नं. 24",
  "शिव मंदिर राजीव नगर पटना",
  "शान्तेश्वर शिवलोक मंदिर",
  "शान्तेश्वर शिव मंदिर",
  "राजीव नगर मंदिर",
  "Shiv Mandir Road No 24",
  "Shiv Mandir Road No 24 Rajeev Nagar",
  "Shiv Mandir Rajeev Nagar Patna",
  "Shiv Mandir Rajiv Nagar Patna",
  "Shanteshwar Shiv Mandir",
  "Sri Sri Shanteshwar Shiv Mandir",
  "Shanteshwar Shivlok Mandir Patna",
  "Rajeev Nagar temple Patna",
  "rudrabhishek Patna",
  "Durga Puja Rajeev Nagar Patna",
  "temple near Road No 24 Rajeev Nagar",
];

export const ALT_NAMES = [
  "Sri Sri Shanteshwar Shiv Mandir",
  "Shanteshwar Shivlok Mandir",
  "Shiv Mandir Road No. 24, Rajeev Nagar",
  "श्री श्री शान्तेश्वर शिव मंदिर",
  "शिव मंदिर, रोड नं. 24, राजीव नगर",
];

type PageMetaInput = { title: string; description: string; path: string; image: string; imageAlt: string; absoluteTitle?: boolean };

// One place to build per-page metadata so canonical, Open Graph (WhatsApp/Facebook) and Twitter stay in sync.
export function pageMeta({ title, description, path, image, imageAlt, absoluteTitle }: PageMetaInput): Metadata {
  const images = [{ url: image, width: 1200, height: 630, alt: imageAlt, type: "image/jpeg" }];
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "hi_IN",
      siteName: MANDIR.name,
      url: path,
      title,
      description,
      images,
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}
