import Image from "next/image";
import Link from "next/link";
import { ABHIYAN, MANDIR, MEMBERSHIP } from "@/lib/mandir";
import { rupees } from "@/lib/contact";
import { DEITIES } from "@/lib/deities";
import { CATEGORIES, PUJAS } from "@/lib/puja";
import { PARV } from "@/lib/samay";
import { TodayStrip } from "@/components/TodayStrip";
import { DeityCard } from "@/components/DeityCard";
import { SectionTitle } from "@/components/PageHeading";
import { SamayTable } from "@/components/SamayTable";
import { ArrowRight, PinIcon } from "@/components/Icons";

const JHALAK = [
  { src: "/images/jhalak/garbhagriha.jpg", alt: "गर्भगृह में शिवलिंग", label: "गर्भगृह" },
  { src: "/images/jhalak/pravesh.jpg", alt: "मुख्य द्वार और घंटा", label: "प्रवेश द्वार" },
  { src: "/images/jhalak/parikrama.jpg", alt: "बरामदा और परिक्रमा मार्ग", label: "परिक्रमा मार्ग" },
  { src: "/images/jhalak/shikhar.jpg", alt: "मंदिर का शिखर", label: "शिखर" },
];

export default function Home() {
  return (
    <>
      {/* Hero: photo stays clean; name and actions sit beside it (below it on phones) */}
      <section className="bg-card border-b border-line">
        <div className="wrap grid md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-6 md:gap-10 lg:gap-14 items-center md:py-12">
          <div className="relative -mx-4 md:mx-0 md:order-2 aspect-[16/10] md:aspect-[4/3] lg:aspect-[3/2] overflow-hidden md:rounded-2xl md:border-4 md:border-card md:ring-1 md:ring-gold/60 md:shadow-[0_18px_44px_rgba(35,23,15,0.16)]">
            <Image
              src="/images/mandir.jpg"
              alt={`${MANDIR.name}, रोड नं. 24, राजीव नगर, पटना का मुख्य द्वार`}
              fill
              priority
              sizes="(min-width: 768px) 58vw, 100vw"
              className="object-cover object-[50%_35%]"
            />
          </div>

          <div className="md:order-1 grid gap-4 pb-9 md:pb-0">
            <span className="font-display text-maroon text-[1.15rem]">ॐ नमः शिवाय</span>
            <h1 className="leading-[1.15]">
              <span className="block text-gold text-[1.3rem] md:text-[1.5rem] mb-1">श्री श्री</span>
              <span className="block text-[2.3rem] sm:text-[2.6rem] lg:text-[3.2rem]">शान्तेश्वर शिवलोक मंदिर</span>
            </h1>
            <div aria-hidden="true" className="flex items-center gap-2 text-gold">
              <span className="h-px w-10 bg-gold/70" />
              <span className="w-1.5 h-1.5 rotate-45 bg-saffron" />
              <span className="h-px w-10 bg-gold/70" />
            </div>
            <div className="grid gap-1">
              <p className="flex items-start gap-2 text-[1.1rem]">
                <PinIcon width={22} height={22} className="shrink-0 mt-1 text-maroon" />
                <span>{MANDIR.addressLines.join(", ")}</span>
              </p>
              <p lang="en" className="text-ink-soft text-[0.95rem] pl-[30px]">Shiv Mandir, Road No. 24, Rajeev Nagar, Patna</p>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <Link href="/darshan" className="btn btn-primary col-span-2 min-h-14 text-[1.12rem]">दर्शन करें</Link>
              <Link href="/puja" className="btn btn-outline min-h-14">पूजा बुक करें</Link>
              <Link href="/chanda" className="btn btn-saffron min-h-14">चंदा दें</Link>
            </div>
          </div>
        </div>
      </section>

      <TodayStrip />

      <section className="wrap mt-12" aria-label="मंदिर का परिचय">
        <p className="max-w-[68ch] text-[1.12rem] leading-relaxed">
          <strong className="font-semibold">{MANDIR.name}</strong> पटना के राजीव नगर में <strong className="font-semibold">रोड नं. 24</strong> पर स्थित शिव मंदिर है।
          मोहल्ले में इसे “रोड नं. 24 वाला शिव मंदिर” या “राजीव नगर का शिव मंदिर” के नाम से जाना जाता है। प्रधान देव श्री शान्तेश्वर महादेव के साथ यहाँ माँ दुर्गा, हनुमान जी,
          लक्ष्मी-नारायण (बाल गोपाल सहित), सूर्यदेव और सप्त पिंडी विराजमान हैं। रुद्राभिषेक, सत्यनारायण पूजा, सुन्दरकाण्ड, मुण्डन और सभी संस्कार मंदिर के पुरोहित कराते हैं।
        </p>
      </section>

      {/* Membership invite */}
      <section className="wrap mt-12" aria-labelledby="sadasya-title">
        <div className="rounded-2xl border-2 border-gold/50 bg-[linear-gradient(135deg,#fff,#fdf1df)] p-7 md:p-10 grid md:grid-cols-[1fr_auto] gap-6 items-center">
          <div className="grid gap-2 max-w-[60ch]">
            <span className="eyebrow">मंदिर परिवार</span>
            <h2 id="sadasya-title" className="text-[1.9rem] md:text-[2.2rem]">सहयोग भाव से आइए, सदस्य बनिए</h2>
            <p className="text-ink-soft text-[1.08rem]">
              मंदिर की नित्य पूजा, पर्व और रख-रखाव सदस्यों के सहयोग से चलता है। वार्षिक सहयोग {rupees(MEMBERSHIP.fee)}।
            </p>
          </div>
          <Link href="/sadasya" className="btn btn-primary min-h-14 text-[1.1rem]">सदस्य बनें <ArrowRight /></Link>
        </div>
      </section>

      {ABHIYAN.active && (
        <section className="wrap mt-14" aria-labelledby="abhiyan-title">
          <div className="grid md:grid-cols-[1.3fr_1fr] rounded-2xl overflow-hidden border-2 border-gold/60 bg-card shadow-[0_12px_32px_rgba(142,27,27,0.10)]">
            <div className="relative aspect-[8/5] md:aspect-auto md:min-h-[22rem]">
              <Image
                src="/images/durga-puja-2026.jpg"
                alt="दुर्गा पूजा 2026: माँ दुर्गा, गणेश जी, लक्ष्मी जी, सरस्वती जी, कार्तिकेय जी और महिषासुर की प्रतिमा"
                fill
                sizes="(min-width: 768px) 58vw, 100vw"
                className="object-cover object-center"
              />
            </div>
            <div className="p-6 md:p-9 grid gap-4 content-center bg-[linear-gradient(135deg,#fff,#fdf1df)]">
              <span className="inline-flex w-fit items-center gap-2 px-3 py-1 rounded-full bg-maroon text-white text-[0.9rem] font-semibold">
                <span className="w-2 h-2 rounded-full bg-saffron animate-pulse" aria-hidden="true" /> अभी चल रहा है
              </span>
              <h2 id="abhiyan-title" className="text-[2rem] md:text-[2.5rem] text-maroon">
                {ABHIYAN.title} <span className="text-ink text-[0.6em] block md:inline">{ABHIYAN.subtitle}</span>
              </h2>
              <p className="text-[1.08rem] text-ink-soft">{ABHIYAN.appeal}</p>
              <div className="flex flex-wrap gap-3 mt-1">
                <Link href="/chanda" className="btn btn-primary">
                  ऑनलाइन चंदा दें <ArrowRight />
                </Link>
                <Link href="/darshan/durga-puja-2026" className="btn btn-outline">पंडाल के दर्शन</Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Darshan */}
      <section className="wrap mt-16" aria-labelledby="darshan-title">
        <SectionTitle id="darshan-title" eyebrow="गर्भगृह" title="देवी-देवताओं के दर्शन" lead="किसी भी देवता पर दबाएँ, बड़ा चित्र, मंत्र और जानकारी खुलेगी।" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {DEITIES.filter((d) => !d.festival).map((d, i) => (
            <DeityCard key={d.slug} d={d} priority={i < 3} />
          ))}
        </div>
      </section>

      {/* Puja */}
      <section className="mt-16 bg-card border-y border-line" aria-labelledby="puja-title">
        <div className="wrap py-12 grid md:grid-cols-[1fr_1.3fr] gap-8 items-start">
          <div>
            <SectionTitle id="puja-title" eyebrow="पूजा-पाठ" title="मंदिर में होने वाली पूजा" lead={`रुद्राभिषेक से लेकर वाहन-पूजा और कुण्डली तक, ${PUJAS.length} प्रकार की पूजा मंदिर के आचार्य कराते हैं।`} />
            <Link href="/puja" className="btn btn-primary">सभी पूजा देखें <ArrowRight /></Link>
          </div>
          <ul className="grid sm:grid-cols-2 gap-3">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link href="/puja" className="grid gap-1 h-full p-5 rounded-xl border-2 border-line hover:border-gold bg-paper no-underline text-ink transition-colors">
                  <span className="font-display text-[1.3rem]">{c.name}</span>
                  <span className="text-ink-soft text-[0.95rem]">{c.blurb}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Timings */}
      <section className="wrap mt-16" aria-labelledby="samay-title">
        <SectionTitle id="samay-title" eyebrow="आरती एवं दर्शन" title="मंदिर का समय" lead="गर्मी और सर्दी में समय अलग रहता है।" />
        <SamayTable />
      </section>

      {/* Gallery */}
      <section className="wrap mt-16" aria-labelledby="jhalak-title">
        <SectionTitle id="jhalak-title" eyebrow="मंदिर परिसर" title="मंदिर की झलक" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {JHALAK.map((j) => (
            <figure key={j.src} className="grid gap-2">
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden border border-line">
                <Image src={j.src} alt={j.alt} fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover" />
              </div>
              <figcaption className="text-center font-medium">{j.label}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Festivals */}
      <section className="wrap mt-16" aria-labelledby="parv-title">
        <SectionTitle id="parv-title" eyebrow="वार्षिक उत्सव" title="मंदिर के प्रमुख पर्व" lead="हिंदू पंचांग के मास के अनुसार। हर वर्ष की तिथि पंचांग से घोषित होती है।" />
        <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-6 border-t-2 border-gold/50">
          {PARV.map((p) => (
            <li key={p.name} className="py-5 border-b border-line grid gap-1 content-start">
              <span className="text-maroon font-semibold text-[0.95rem]">{p.masa}</span>
              <h3 className="text-[1.35rem]">{p.name}</h3>
              <p className="text-ink-soft text-[0.98rem]">{p.about}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Visit */}
      <section className="wrap mt-16 mb-6" aria-labelledby="visit-title">
        <div className="rounded-2xl bg-maroon text-white p-7 md:p-10 grid md:grid-cols-[1fr_auto] gap-6 items-center">
          <div className="grid gap-2">
            <h2 id="visit-title" className="text-[1.9rem]">मंदिर कैसे पहुँचें</h2>
            <p className="text-[1.1rem] text-white/90">{MANDIR.addressPlain}</p>
            <p className="text-white/80">Google Maps प्लस कोड: {MANDIR.plusCode}</p>
            <p lang="en" className="text-white/80 text-[0.95rem] max-w-[60ch]">
              Sri Sri Shanteshwar Shivlok Mandir is the Shiv Mandir on Road No. 24, Rajeev Nagar, Patna 800024, known locally as the
              Road No. 24 mandir. Open daily for darshan, aarti, rudrabhishek and puja bookings.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={MANDIR.mapsUrl} target="_blank" rel="noopener" className="btn bg-white text-maroon hover:bg-saffron-soft">
              <PinIcon /> रास्ता देखें
            </a>
            <Link href="/sampark" className="btn border-2 border-white/70 text-white hover:bg-white/10">संपर्क करें</Link>
          </div>
        </div>
      </section>
    </>
  );
}
