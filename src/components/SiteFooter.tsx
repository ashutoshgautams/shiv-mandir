import Link from "next/link";
import { MANDIR } from "@/lib/mandir";
import { NAV } from "./nav";
import { ShikharMark } from "./Icons";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-card mt-8">
      <div className="wrap py-10 grid gap-8 md:grid-cols-[1.4fr_1fr_1fr]">
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
          <p className="font-display text-maroon text-[1.15rem]">ॐ नमः शिवाय · हर हर महादेव</p>
        </div>
        <nav aria-label="फ़ुटर मेनू" className="grid gap-2 content-start">
          <span className="eyebrow">पृष्ठ</span>
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="text-ink hover:text-maroon no-underline w-fit">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="grid gap-2 content-start text-ink-soft">
          <span className="eyebrow">जानकारी</span>
          <p className="text-[0.9rem]">यह वेबसाइट का प्रथम प्रारूप है। चित्र प्रतीकात्मक हैं और कुछ जानकारी (समय, संपर्क) समिति द्वारा पुष्टि की जानी है।</p>
        </div>
      </div>
    </footer>
  );
}
