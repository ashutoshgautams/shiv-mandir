import type { Metadata } from "next";
import { MANDIR } from "./mandir";

// Live address. If a custom domain is added later, set NEXT_PUBLIC_SITE_URL in Vercel (or change this).
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://shiv-mandir.vercel.app").replace(/\/$/, "");

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
  "मंदिर रोड नं. 24",
  "रोड नं. 24 मंदिर",
  "रोड नंबर 24 शिव मंदिर",
  "राजीव नगर का मंदिर",
  "राजीव नगर शिव मंदिर पटना",
  "शान्तेश्वर शिवलोक मंदिर रोड 24",
  "Mandir Road No 24",
  "Road No 24 Mandir Patna",
  "Road No 24 Rajeev Nagar Mandir",
  "Shanteshwar Shivlok Mandir Road 24",
  "Shanteswar Shiv Lok Mandir",
  "Rajeev Nagar Mandir",
  "Rajiv Nagar Mandir Patna",
  "Rajeev Nagar Shiv Mandir",
  "Durga Puja 2026 Rajeev Nagar",
];

export const ALT_NAMES = [
  "Sri Sri Shanteshwar Shiv Mandir",
  "Shanteshwar Shivlok Mandir",
  "Shiv Mandir Road No. 24, Rajeev Nagar",
  "श्री श्री शान्तेश्वर शिव मंदिर",
  "शिव मंदिर, रोड नं. 24, राजीव नगर",
  "Mandir Road No. 24, Rajeev Nagar",
  "Rajeev Nagar Shiv Mandir",
  "Shanteshwar Shivlok Mandir, Road 24",
  "राजीव नगर शिव मंदिर",
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
