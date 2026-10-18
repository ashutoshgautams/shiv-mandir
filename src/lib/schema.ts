import { MANDIR } from "./mandir";
import { ALT_NAMES, GEO, SITE_URL } from "./site";
import { DEITIES } from "./deities";

const abs = (p: string) => `${SITE_URL}${p}`;
export const TEMPLE_ID = `${SITE_URL}/#mandir`;

export const templeSchema = {
  "@context": "https://schema.org",
  "@type": "HinduTemple",
  "@id": TEMPLE_ID,
  name: MANDIR.name,
  alternateName: ALT_NAMES,
  description:
    "राजीव नगर, रोड नं. 24, पटना स्थित शिव मंदिर। प्रधान देव श्री शान्तेश्वर महादेव, साथ में माँ दुर्गा, हनुमान जी, राधे-कृष्ण, सूर्यदेव और सप्त पिंडी। रुद्राभिषेक, सत्यनारायण पूजा, दुर्गा पूजा और सभी अनुष्ठान।",
  url: SITE_URL,
  image: [abs("/images/mandir.jpg"), abs("/og/home.jpg")],
  logo: abs("/icon-512.png"),
  address: {
    "@type": "PostalAddress",
    streetAddress: "Road No. 24, Rajeev Nagar",
    addressLocality: "Patna",
    addressRegion: "Bihar",
    postalCode: "800024",
    addressCountry: "IN",
  },
  geo: { "@type": "GeoCoordinates", latitude: GEO.lat, longitude: GEO.lng },
  hasMap: MANDIR.mapsUrl,
  isAccessibleForFree: true,
  publicAccess: true,
  ...(MANDIR.phone ? { telephone: `+${MANDIR.phone}` } : {}),
  // TODO: add openingHoursSpecification once the committee confirms real timings.
  containsPlace: DEITIES.map((d) => ({ "@type": "Place", name: d.name, url: abs(`/darshan/${d.slug}`) })),
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: MANDIR.name,
  alternateName: "Shiv Mandir Road No. 24, Rajeev Nagar, Patna",
  inLanguage: "hi-IN",
  publisher: { "@id": TEMPLE_ID },
};

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "मुख्य पृष्ठ", path: "/" }, ...items].map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: abs(it.path),
    })),
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}
