import type { Metadata } from "next";
import { MANDIR, isPlaceholder } from "@/lib/mandir";
import { telHref, whatsappHref } from "@/lib/contact";
import { PageHeading, SectionTitle } from "@/components/PageHeading";
import { SamayTable } from "@/components/SamayTable";
import { CopyAddress } from "@/components/CopyAddress";
import { PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/Icons";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbs, faqSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/site";
import { FAQS } from "@/lib/faq";

export const metadata: Metadata = pageMeta({
  title: "पता, आरती समय एवं संपर्क · शिव मंदिर रोड नं. 24, राजीव नगर",
  description: "शान्तेश्वर शिव मंदिर का पता: रोड नं. 24, राजीव नगर, पटना 800024 (Shiv Mandir Road No. 24, Rajeev Nagar, Patna). Google Maps रास्ता, आरती और दर्शन का समय, फ़ोन व WhatsApp।",
  path: "/sampark",
  image: "/og/sampark.jpg",
  imageAlt: "शान्तेश्वर शिव मंदिर, रोड नं. 24, राजीव नगर, पटना",
});

export default function SamparkPage() {
  const wa = whatsappHref("जय भोलेनाथ। मुझे मंदिर के बारे में जानकारी चाहिए।");
  return (
    <>
      <JsonLd data={[breadcrumbs([{ name: "समय एवं संपर्क", path: "/sampark" }]), faqSchema(FAQS)]} />
      <PageHeading eyebrow="पता, समय और संपर्क" title="मंदिर आएँ" lead="रोड नं. 24, राजीव नगर में सीढ़ियों वाला सफ़ेद मंदिर, ऊपर तीन शिखर और लाल अक्षरों में नाम।" />

      <div className="wrap py-10 grid gap-14">
        <section className="grid lg:grid-cols-[1fr_1.2fr] gap-6 items-start" aria-label="पता और संपर्क">
          <div className="grid gap-5">
            <div className="bg-card rounded-2xl border border-line p-6 grid gap-3">
              <span className="eyebrow">पता</span>
              <address className="not-italic font-display text-[1.45rem] leading-relaxed">
                {MANDIR.name}
                {MANDIR.addressLines.map((l) => (
                  <span key={l} className="block">{l}</span>
                ))}
              </address>
              <p className="text-ink-soft">Google Maps प्लस कोड: <strong className="text-ink">{MANDIR.plusCode}</strong></p>
              <div className="grid sm:grid-cols-2 gap-3 mt-1">
                <a href={MANDIR.mapsUrl} target="_blank" rel="noopener" className="btn btn-primary"><PinIcon /> रास्ता देखें</a>
                <CopyAddress text={MANDIR.addressPlain} />
              </div>
            </div>
            <div className="bg-card rounded-2xl border border-line p-6 grid gap-3">
              <span className="eyebrow">मंदिर कार्यालय</span>
              <p className="text-[1.5rem] font-semibold tabular-nums">{MANDIR.phoneDisplay}</p>
              {isPlaceholder.phone && <p className="text-ink-soft text-[0.95rem]">फ़ोन नंबर समिति द्वारा जोड़ा जाएगा।</p>}
              <div className="grid sm:grid-cols-2 gap-3">
                {telHref ? (
                  <a href={telHref} className="btn btn-primary"><PhoneIcon /> फ़ोन करें</a>
                ) : (
                  <span className="btn bg-line text-ink-soft cursor-not-allowed"><PhoneIcon /> फ़ोन करें</span>
                )}
                {wa ? (
                  <a href={wa} target="_blank" rel="noopener" className="btn btn-outline"><WhatsAppIcon /> WhatsApp</a>
                ) : (
                  <span className="btn bg-line text-ink-soft cursor-not-allowed"><WhatsAppIcon /> WhatsApp</span>
                )}
              </div>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden border border-line bg-card aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[28rem]">
            <iframe
              title="मंदिर का नक्शा"
              src={MANDIR.mapsEmbedUrl}
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>

        <section aria-labelledby="samay-title">
          <SectionTitle id="samay-title" eyebrow="आरती एवं दर्शन" title="मंदिर का समय" />
          <SamayTable />
        </section>

        <section aria-labelledby="niyam-title" className="bg-card rounded-2xl border border-line p-6 md:p-8">
          <h2 id="niyam-title" className="text-[1.7rem] mb-4">दर्शन के नियम</h2>
          <ul className="grid gap-3 text-[1.05rem] list-disc pl-6 marker:text-saffron">
            <li>गर्भगृह में जूते-चप्पल बाहर उतारें।</li>
            <li>मंदिर परिसर में शांति बनाए रखें, मोबाइल धीमी आवाज़ पर रखें।</li>
            <li>मुण्डन के समय परिसर में बाजा नहीं बजेगा।</li>
            <li>दान केवल दान-पात्र, मंदिर कार्यालय या इस वेबसाइट के चंदा पृष्ठ से दें।</li>
          </ul>
        </section>

        <section aria-labelledby="faq-title">
          <SectionTitle id="faq-title" eyebrow="अक्सर पूछे जाने वाले प्रश्न" title="आपके सवाल" />
          <div className="grid gap-3">
            {FAQS.map((f) => (
              <details key={f.q} className="group bg-card rounded-xl border border-line open:border-gold">
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 p-5 font-semibold text-[1.1rem]">
                  {f.q}
                  <span aria-hidden="true" className="text-maroon text-[1.5rem] leading-none transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="px-5 pb-5 text-ink-soft text-[1.05rem]">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
