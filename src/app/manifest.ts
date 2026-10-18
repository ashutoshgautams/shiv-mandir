import type { MetadataRoute } from "next";
import { MANDIR } from "@/lib/mandir";

// Lets visitors "Add to Home Screen" — handy for elderly users who won't type the address again.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: MANDIR.name,
    short_name: "शिव मंदिर",
    description: "शिव मंदिर, रोड नं. 24, राजीव नगर, पटना — दर्शन, पूजा बुकिंग, आरती समय और ऑनलाइन चंदा",
    lang: "hi",
    start_url: "/",
    display: "standalone",
    background_color: "#fbf6ec",
    theme_color: "#8e1b1b",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
