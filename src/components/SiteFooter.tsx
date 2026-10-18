import Link from "next/link";
import { MANDIR } from "@/lib/mandir";
import { NAV } from "./nav";
import { ShikharMark } from "./Icons";
import { SamitiList } from "./SamitiList";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-card mt-8">
      <div className="wrap py-10 grid gap-10 lg:grid-cols-[1.2fr_1.6fr_0.8fr]">
        <div className="grid gap-3 content-start">
          <div className="flex items-center gap-3">
            <ShikharMark className="w-12 h-9" />
            <span className="font-display text-[1.2rem]">{MANDIR.name}</span>
          </div>
          <address className="not-italic text-ink-soft">
            {MANDIR.addressLines.map((l) => (
              <span key={l} className="block">{l}</span>
            ))}
          </address>
          <p lang="en" className="text-ink-soft text-[0.95rem]">Shiv Mandir, Road No. 24, Rajeev Nagar, Patna, Bihar 800024</p>
          <p className="text-[1.05rem]">
            संपर्क / WhatsApp: <a href={`tel:+${MANDIR.phone}`} className="font-semibold text-maroon no-underline tabular-nums">{MANDIR.phoneDisplay}</a>
          </p>
          <p className="font-display text-maroon text-[1.15rem]">ॐ नमः शिवाय · हर हर महादेव</p>
        </div>
        <section aria-labelledby="footer-samiti" className="grid gap-3 content-start">
          <h2 id="footer-samiti" className="eyebrow">मंदिर समिति</h2>
          <SamitiList compact />
        </section>
        <nav aria-label="फ़ुटर मेनू" className="grid gap-2 content-start">
          <span className="eyebrow">पृष्ठ</span>
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="text-ink hover:text-maroon no-underline w-fit">
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-line">
        <div className="wrap py-4 flex flex-wrap justify-between gap-2 text-ink-soft text-[0.92rem]">
          <span>कुछ जानकारी (आरती समय) समिति द्वारा पुष्टि की जानी है।</span>
          <span>सेवा भाव से वेबसाइट निर्माण: <strong className="text-ink font-semibold">आशुतोष गौतम</strong></span>
        </div>
      </div>
    </footer>
  );
}
