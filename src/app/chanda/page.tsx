import type { Metadata } from "next";
import { PageHeading } from "@/components/PageHeading";
import { ChandaClient } from "@/components/ChandaClient";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbs } from "@/lib/schema";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "ऑनलाइन चंदा, दान एवं सदस्यता · राजीव नगर, पटना",
  description: "शान्तेश्वर शिव मंदिर, रोड नं. 24, राजीव नगर, पटना को सदस्यता, पर्व-आयोजन, भंडारा, नित्य पूजा और रख-रखाव के लिए UPI से ऑनलाइन चंदा दें और रसीद पाएँ। Donate online by UPI to Shiv Mandir Road No. 24, Rajeev Nagar, Patna.",
  path: "/chanda",
  image: "/og/chanda.jpg",
  imageAlt: "ऑनलाइन चंदा, शान्तेश्वर शिव मंदिर",
});

export default function ChandaPage() {
  return (
    <>
      <JsonLd data={breadcrumbs([{ name: "चंदा / दान", path: "/chanda" }])} />
      <PageHeading
        eyebrow="चंदा · दान · सदस्यता"
        title="मंदिर सेवा में सहयोग करें"
        en="Online chanda / donation by UPI · Shiv Mandir Road No. 24, Rajeev Nagar"
        lead="सदस्यता, पर्व-आयोजन, भंडारा, नित्य पूजा या रख-रखाव के लिए UPI से भुगतान करें और रसीद पाएँ।"
      />
      <div className="wrap py-8 md:py-10">
        <ChandaClient />
      </div>
    </>
  );
}
