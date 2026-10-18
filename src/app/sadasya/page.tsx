import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { MEMBERSHIP } from "@/lib/mandir";
import { rupees } from "@/lib/contact";
import { publicMemberNames } from "@/lib/records";
import { pageMeta } from "@/lib/site";
import { breadcrumbs } from "@/lib/schema";
import { PageHeading, SectionTitle } from "@/components/PageHeading";
import { MembershipClient } from "@/components/MembershipClient";
import { SamitiList } from "@/components/SamitiList";
import { UpiScanner } from "@/components/UpiScanner";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = pageMeta({
  title: "मंदिर परिवार के सदस्य बनें · शिव मंदिर रोड नं. 24, राजीव नगर",
  description: `सहयोग भाव से शान्तेश्वर शिवलोक मंदिर (रोड नं. 24, राजीव नगर, पटना) के सदस्य बनें। वार्षिक सहयोग ${rupees(MEMBERSHIP.fee)}। मंदिर समिति और सदस्यों की सूची।`,
  path: "/sadasya",
  image: "/og/home.jpg",
  imageAlt: "शान्तेश्वर शिवलोक मंदिर परिवार",
});

export default function SadasyaPage() {
  return (
    <>
      <JsonLd data={breadcrumbs([{ name: "सदस्यता", path: "/sadasya" }])} />
      <PageHeading
        eyebrow="मंदिर परिवार"
        title="सहयोग भाव से आइए, सदस्य बनिए"
        lead="भोलेनाथ की सेवा में मोहल्ले के सभी श्रद्धालुओं का स्वागत है। सदस्यों के सहयोग से ही मंदिर की नित्य पूजा, पर्व और रख-रखाव चलता है।"
      />
      <div className="wrap py-10 grid gap-14">
        <section className="grid lg:grid-cols-[1fr_20rem] gap-8 items-start" aria-label="सदस्यता फ़ॉर्म">
          <div className="bg-card rounded-2xl border border-line p-5 md:p-8 grid gap-5">
            <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-4">
              <h2 className="text-[1.6rem]">सदस्यता {MEMBERSHIP.year}</h2>
              <p className="text-[1.15rem]"><span className="font-bold tabular-nums">{rupees(MEMBERSHIP.fee)}</span> <span className="text-ink-soft">प्रति वर्ष</span></p>
            </div>
            <MembershipClient />
          </div>
          <div className="grid gap-4">
            <div className="bg-saffron-soft rounded-2xl border border-line p-5 grid gap-2">
              <h2 className="text-[1.25rem]">सदस्य के रूप में</h2>
              <ul className="grid gap-1.5 list-disc pl-5 marker:text-saffron">
                <li>मंदिर के पर्वों और आयोजनों में सहभागिता</li>
                <li>समिति की बैठकों की सूचना</li>
                <li>मंदिर परिवार की सूची में आपका नाम</li>
              </ul>
            </div>
            <UpiScanner title="सदस्यता शुल्क स्कैनर" note="स्कैन करके भुगतान करें, फिर फ़ॉर्म भरें या WhatsApp पर नाम भेजें ताकि रसीद बन सके।" />
          </div>
        </section>

        <section aria-labelledby="samiti-title">
          <SectionTitle id="samiti-title" eyebrow="मंदिर समिति" title="समिति एवं सेवक" />
          <SamitiList />
        </section>

        <section aria-labelledby="members-title">
          <SectionTitle id="members-title" eyebrow="मंदिर परिवार" title="सदस्य सूची" lead={`सदस्यता वर्ष ${MEMBERSHIP.year}`} />
          <Suspense fallback={<p className="text-ink-soft">सूची लोड हो रही है…</p>}>
            <MemberNames />
          </Suspense>
        </section>
      </div>
    </>
  );
}

async function MemberNames() {
  await connection(); // live list, not a build-time snapshot
  let names: string[] = [];
  try {
    names = await publicMemberNames();
  } catch {
    names = [];
  }
  if (!names.length) return <p className="text-ink-soft">सदस्य सूची जल्द यहाँ दिखेगी।</p>;
  return (
    <>
      <p className="text-ink-soft mb-3">{names.length} सदस्य</p>
      <ol className="columns-1 sm:columns-2 lg:columns-3 gap-8 list-decimal pl-6 marker:text-ink-soft">
        {names.map((n, i) => (
          <li key={`${n}-${i}`} className="py-1.5 break-inside-avoid border-b border-line/70">{n}</li>
        ))}
      </ol>
    </>
  );
}
