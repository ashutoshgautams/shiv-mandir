import type { Metadata, Viewport } from "next";
import { Mukta, Tiro_Devanagari_Hindi } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MobileTabBar } from "@/components/MobileTabBar";
import { AbhiyanBar } from "@/components/AbhiyanBar";
import { JsonLd } from "@/components/JsonLd";
import { MANDIR } from "@/lib/mandir";
import { KEYWORDS, SITE_URL, pageMeta } from "@/lib/site";
import { templeSchema, websiteSchema } from "@/lib/schema";
import "./globals.css";

const tiro = Tiro_Devanagari_Hindi({
  variable: "--font-tiro",
  weight: "400",
  subsets: ["devanagari", "latin"],
});

const mukta = Mukta({
  variable: "--font-mukta",
  weight: ["400", "500", "600", "700"],
  subsets: ["devanagari", "latin"],
});

const home = pageMeta({
  title: `${MANDIR.name} | शिव मंदिर रोड नं. 24, राजीव नगर, पटना`,
  description:
    "शिव मंदिर, रोड नं. 24, राजीव नगर, पटना (Shiv Mandir Road No. 24, Rajeev Nagar). श्री शान्तेश्वर महादेव के दर्शन, रुद्राभिषेक व पूजा-पाठ बुकिंग, आरती समय और दुर्गा पूजा 2026 का ऑनलाइन चंदा।",
  path: "/",
  image: "/og/home.jpg",
  imageAlt: `${MANDIR.name}, रोड नं. 24, राजीव नगर, पटना`,
});

export const metadata: Metadata = {
  ...home,
  metadataBase: new URL(SITE_URL),
  title: { default: home.title as string, template: `%s | शान्तेश्वर शिव मंदिर, रोड नं. 24 राजीव नगर` },
  applicationName: MANDIR.name,
  keywords: KEYWORDS,
  category: "religion",
  authors: [{ name: "श्री श्री शान्तेश्वर शिवलोक मंदिर समिति" }],
  formatDetection: { telephone: false, address: false, email: false },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  other: {
    "geo.region": "IN-BR",
    "geo.placename": "Rajeev Nagar, Patna",
    "geo.position": "25.631438;85.090609",
    ICBM: "25.631438, 85.090609",
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export const viewport: Viewport = {
  themeColor: "#8e1b1b",
  viewportFit: "cover",
};

// Applies the saved text size before first paint so the page doesn't jump.
const textSizeScript = `try{var s=localStorage.getItem('mandir-text');if(s)document.documentElement.dataset.size=s}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="hi" className={`${tiro.variable} ${mukta.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: textSizeScript }} />
        <JsonLd data={[templeSchema, websiteSchema]} />
      </head>
      <body className="min-h-dvh flex flex-col pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:btn focus:btn-primary"
        >
          मुख्य सामग्री पर जाएँ
        </a>
        <AbhiyanBar />
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <MobileTabBar />
      </body>
    </html>
  );
}
