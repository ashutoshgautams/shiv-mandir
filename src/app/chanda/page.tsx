import type { Metadata } from "next";
import { ABHIYAN } from "@/lib/mandir";
import { PageHeading } from "@/components/PageHeading";
import { ChandaClient } from "@/components/ChandaClient";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbs } from "@/lib/schema";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: ABHIYAN.active ? `${ABHIYAN.title} ऑनलाइन चंदा · राजीव नगर, पटना` : "ऑनलाइन चंदा / दान",
  description: `${ABHIYAN.active ? ABHIYAN.title + " के लिए" : "मंदिर सेवा के लिए"} शान्तेश्वर शिव मंदिर, रोड नं. 24, राजीव नगर, पटना को UPI से ऑनलाइन चंदा दें और रसीद पाएँ। Donate online by UPI to Shiv Mandir Road No. 24, Rajeev Nagar, Patna.`,
  path: "/chanda",
  image: "/og/chanda.jpg",
  imageAlt: "दुर्गा पूजा 2026 ऑनलाइन चंदा, शान्तेश्वर शिव मंदिर",
});

export default function ChandaPage() {
  return (
    <>
      <JsonLd data={breadcrumbs([{ name: "चंदा / दान", path: "/chanda" }])} />
      <PageHeading
        eyebrow={ABHIYAN.active ? `${ABHIYAN.title} · ${ABHIYAN.subtitle}` : "चंदा एवं दान"}
        title="ऑनलाइन चंदा दें"
        en="Online chanda / donation by UPI · Shiv Mandir Road No. 24, Rajeev Nagar"
        lead={
          ABHIYAN.active
            ? `${ABHIYAN.appeal} UPI से भुगतान करें और तुरंत रसीद पाएँ।`
            : "मंदिर की सेवा में सहयोग करें। UPI से भुगतान करें और तुरंत रसीद पाएँ।"
        }
      />
      <div className="wrap py-8 md:py-10">
        <ChandaClient />
      </div>
    </>
  );
}
