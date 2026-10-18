import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DEITIES, getDeity } from "@/lib/deities";
import { DarshanOffering } from "@/components/DarshanOffering";
import { ArrowLeft, ArrowRight } from "@/components/Icons";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbs } from "@/lib/schema";
import { pageMeta } from "@/lib/site";
import { MANDIR } from "@/lib/mandir";

export function generateStaticParams() {
  return DEITIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata(props: PageProps<"/darshan/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const d = getDeity(slug);
  if (!d) return { title: "दर्शन" };
  return pageMeta({
    title: `${d.name} के दर्शन · ${d.mantra}`,
    description: `${d.name} (${d.role}) के दर्शन, ${MANDIR.shortName}, रोड नं. 24, राजीव नगर, पटना। ${d.about}`,
    path: `/darshan/${d.slug}`,
    image: `/og/${d.slug}.jpg`,
    imageAlt: `${d.name}, ${MANDIR.shortName}, राजीव नगर, पटना`,
  });
}

export default async function DeityPage(props: PageProps<"/darshan/[slug]">) {
  const { slug } = await props.params;
  const d = getDeity(slug);
  if (!d) notFound();

  const i = DEITIES.indexOf(d);
  const prev = DEITIES[(i - 1 + DEITIES.length) % DEITIES.length];
  const next = DEITIES[(i + 1) % DEITIES.length];

  return (
    <div className="wrap py-6 md:py-10 grid gap-8">
      <JsonLd data={breadcrumbs([{ name: "दर्शन", path: "/darshan" }, { name: d.name, path: `/darshan/${d.slug}` }])} />
      <Link href="/darshan" className="inline-flex items-center gap-2 text-maroon font-semibold no-underline w-fit hover:underline">
        <ArrowLeft width={20} height={20} /> सभी दर्शन
      </Link>

      <div className="grid lg:grid-cols-[1.25fr_1fr] gap-8 lg:gap-12 items-start">
        <DarshanOffering image={d.detail?.src ?? d.image} ratio={d.detail} name={d.name} />

        <div className="grid gap-5">
          <div className="grid gap-1">
            <span className="eyebrow">{d.role}</span>
            <h1 className="text-[2.3rem] md:text-[2.9rem]">{d.name}</h1>
          </div>
          <p className="font-display text-[1.6rem] md:text-[1.85rem] text-maroon leading-snug border-l-4 border-saffron pl-4">
            {d.mantra}
          </p>
          <p className="text-[1.1rem]">{d.about}</p>
          <dl className="grid sm:grid-cols-2 gap-3">
            <div className="bg-card rounded-xl border border-line p-4">
              <dt className="text-ink-soft text-[0.95rem]">विशेष दिन</dt>
              <dd className="font-semibold text-[1.08rem]">{d.days}</dd>
            </div>
            <div className="bg-card rounded-xl border border-line p-4">
              <dt className="text-ink-soft text-[0.95rem]">प्रिय अर्पण</dt>
              <dd className="font-semibold text-[1.08rem]">{d.offerings}</dd>
            </div>
          </dl>
          {d.festival ? (
            <Link href="/chanda" className="btn btn-primary w-full sm:w-fit">दुर्गा पूजा के लिए चंदा दें</Link>
          ) : (
            <Link href="/puja" className="btn btn-outline w-full sm:w-fit">इनकी पूजा बुक करें</Link>
          )}
        </div>
      </div>

      <nav aria-label="अन्य दर्शन" className="grid grid-cols-2 gap-3 border-t border-line pt-6">
        <Link href={`/darshan/${prev.slug}`} className="grid gap-0.5 p-4 rounded-xl border-2 border-line hover:border-gold bg-card no-underline text-ink">
          <span className="text-ink-soft text-[0.9rem] flex items-center gap-1.5"><ArrowLeft width={18} height={18} /> पिछले</span>
          <span className="font-display text-[1.2rem]">{prev.short}</span>
        </Link>
        <Link href={`/darshan/${next.slug}`} className="grid gap-0.5 p-4 rounded-xl border-2 border-line hover:border-gold bg-card no-underline text-ink text-right">
          <span className="text-ink-soft text-[0.9rem] flex items-center gap-1.5 justify-end">अगले <ArrowRight width={18} height={18} /></span>
          <span className="font-display text-[1.2rem]">{next.short}</span>
        </Link>
      </nav>
    </div>
  );
}
