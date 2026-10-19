import type { Metadata } from "next";
import { PageHeading } from "@/components/PageHeading";
import { PujaBrowser } from "@/components/PujaBrowser";
import { JsonLd } from "@/components/JsonLd";
import { TEMPLE_ID, breadcrumbs } from "@/lib/schema";
import { pageMeta } from "@/lib/site";
import { PUJAS } from "@/lib/puja";

export const metadata: Metadata = pageMeta({
  title: "पूजा-पाठ बुकिंग · Rudrabhishek, Satyanarayan Puja, Mundan Booking",
  description: "राजीव नगर, पटना के शिव मंदिर (रोड नं. 24) में रुद्राभिषेक, महारुद्राभिषेक, सत्यनारायण पूजा, सुन्दरकाण्ड, दुर्गासप्तशती, नवग्रह शान्ति, मुण्डन, वाहन-पूजा और कुण्डली परामर्श की बुकिंग। Book Rudrabhishek, Satyanarayan Katha, Sunderkand, Navgrah Shanti, Mundan, vehicle puja and Kundli Milan at Shiv Mandir Road No. 24, Rajeev Nagar, Patna.",
  path: "/puja",
  image: "/og/puja.jpg",
  imageAlt: "शान्तेश्वर शिव मंदिर में पूजा-पाठ बुकिंग",
});

const servicesSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "मंदिर में होने वाली पूजा",
  itemListElement: PUJAS.map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: { "@type": "Service", name: p.name, alternateName: p.en, description: p.about, provider: { "@id": TEMPLE_ID }, areaServed: "Rajeev Nagar, Patna" },
  })),
};

export default function PujaPage() {
  return (
    <>
      <JsonLd data={[breadcrumbs([{ name: "पूजा-पाठ", path: "/puja" }]), servicesSchema]} />
      <PageHeading
        eyebrow="पूजा-पाठ एवं अनुष्ठान"
        title="मंदिर की सभी पूजा"
        en="Puja booking · Rudrabhishek, Satyanarayan, Sunderkand, Mundan, Vehicle Puja, Kundli"
        lead="पूजा चुनें और “बुकिंग करें” दबाएँ। मंदिर कार्यालय आपसे समय और दक्षिणा की पुष्टि करेगा। सावन, शिवरात्रि और नवरात्रि में पहले से बुकिंग करें।"
      />
      <PujaBrowser />
    </>
  );
}
