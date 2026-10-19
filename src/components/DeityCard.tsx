import Image from "next/image";
import Link from "next/link";
import type { Deity } from "@/lib/deities";

export function DeityCard({ d, priority = false }: { d: Deity; priority?: boolean }) {
  return (
    <Link
      href={`/darshan/${d.slug}`}
      className="group grid bg-card rounded-2xl overflow-hidden border border-line no-underline text-ink hover:border-gold hover:shadow-[0_8px_24px_rgba(35,23,15,0.10)] transition-[border-color,box-shadow]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-saffron-soft">
        <Image
          src={d.image}
          alt={`${d.name} के दर्शन`}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 360px, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="p-3 md:p-5 grid gap-0.5 border-t-2 border-gold/60">
        <span className="eyebrow hidden sm:block">{d.role}</span>
        <span className="font-display text-[1.1rem] md:text-[1.4rem] leading-snug">{d.name}</span>
        <span lang="en" className="text-ink-soft text-[0.82rem] md:text-[0.9rem] leading-snug">{d.en}</span>
      </div>
    </Link>
  );
}
