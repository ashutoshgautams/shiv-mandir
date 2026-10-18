import type { Metadata } from "next";
import { DEITIES } from "@/lib/deities";
import { DeityCard } from "@/components/DeityCard";
import { PageHeading } from "@/components/PageHeading";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbs } from "@/lib/schema";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "दर्शन: शिवलिंग, माँ दुर्गा, हनुमान जी, राधे-कृष्ण, सूर्यदेव",
  description: "शिव मंदिर रोड नं. 24, राजीव नगर, पटना में विराजमान श्री शान्तेश्वर महादेव, माँ दुर्गा, हनुमान जी, राधे-कृष्ण, सूर्यदेव और सप्त पिंडी के घर बैठे दर्शन।",
  path: "/darshan",
  image: "/og/darshan.jpg",
  imageAlt: "शान्तेश्वर शिव मंदिर के देवी-देवताओं के दर्शन",
});

export default function DarshanPage() {
  return (
    <>
      <JsonLd data={breadcrumbs([{ name: "दर्शन", path: "/darshan" }])} />
      <PageHeading eyebrow="गर्भगृह" title="देवी-देवताओं के दर्शन" lead="मंदिर में विराजमान सभी देवी-देवता। किसी पर भी दबाएँ और घर बैठे दर्शन करें, पुष्प अर्पित करें।" />
      <div className="wrap py-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {DEITIES.map((d, i) => (
          <DeityCard key={d.slug} d={d} priority={i < 3} />
        ))}
      </div>
    </>
  );
}
