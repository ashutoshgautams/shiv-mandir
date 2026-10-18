import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DEITIES } from "@/lib/deities";
import { DeityCard } from "@/components/DeityCard";
import { PageHeading } from "@/components/PageHeading";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbs } from "@/lib/schema";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "दर्शन: शिवलिंग, माँ दुर्गा, हनुमान जी, लक्ष्मी-नारायण, सूर्यदेव",
  description: "शिव मंदिर रोड नं. 24, राजीव नगर, पटना में विराजमान श्री शान्तेश्वर महादेव, माँ दुर्गा, हनुमान जी, लक्ष्मी-नारायण, सूर्यदेव और सप्त पिंडी के घर बैठे दर्शन।",
  path: "/darshan",
  image: "/og/darshan.jpg",
  imageAlt: "शान्तेश्वर शिव मंदिर के देवी-देवताओं के दर्शन",
});

export default function DarshanPage() {
  return (
    <>
      <JsonLd data={breadcrumbs([{ name: "दर्शन", path: "/darshan" }])} />
      <PageHeading eyebrow="गर्भगृह" title="देवी-देवताओं के दर्शन" lead="मंदिर में विराजमान सभी देवी-देवता। किसी पर भी दबाएँ और घर बैठे दर्शन करें, पुष्प अर्पित करें।" />
      <div className="wrap py-10 grid gap-8">
        {DEITIES.filter((d) => d.festival).map((d) => (
          <Link
            key={d.slug}
            href={`/darshan/${d.slug}`}
            className="group grid md:grid-cols-[1.5fr_1fr] bg-card rounded-2xl overflow-hidden border-2 border-gold/60 no-underline text-ink hover:shadow-[0_10px_30px_rgba(35,23,15,0.12)]"
          >
            <div className="relative aspect-[8/5]">
              <Image src={d.detail?.src ?? d.image} alt={`${d.name} पंडाल दर्शन`} fill priority sizes="(min-width: 768px) 60vw, 100vw" className="object-cover" />
            </div>
            <div className="p-6 md:p-8 grid gap-2 content-center">
              <span className="inline-flex w-fit px-3 py-1 rounded-full bg-maroon text-white text-[0.9rem] font-semibold">अभी चल रहा है</span>
              <span className="font-display text-[2rem] text-maroon leading-tight">{d.name}</span>
              <span className="text-ink-soft">{d.role}</span>
              <span className="text-maroon font-semibold mt-1">पंडाल के दर्शन करें →</span>
            </div>
          </Link>
        ))}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {DEITIES.filter((d) => !d.festival).map((d, i) => (
            <DeityCard key={d.slug} d={d} priority={i < 3} />
          ))}
        </div>
      </div>
    </>
  );
}
