import Link from "next/link";
import { MANDIR } from "@/lib/mandir";
import { ShikharMark } from "./Icons";
import { NavLinks } from "./NavLinks";
import { TextSizeControl } from "./TextSizeControl";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-card/95 backdrop-blur border-b border-line">
      <div className="wrap flex items-center gap-4 min-h-[4.5rem]">
        <Link href="/" className="flex items-center gap-3 no-underline text-ink min-w-0">
          <ShikharMark className="w-10 h-8 sm:w-12 sm:h-9 shrink-0" />
          <span className="min-w-0">
            <span className="block font-display text-[1.05rem] sm:text-[1.2rem] leading-tight truncate">{MANDIR.shortName}</span>
            <span className="block text-[0.85rem] text-ink-soft leading-tight">राजीव नगर, पटना</span>
          </span>
        </Link>
        <NavLinks />
        <TextSizeControl />
      </div>
    </header>
  );
}
