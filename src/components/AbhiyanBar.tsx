import Link from "next/link";
import { ArrowRight } from "./Icons";

// Site-wide strip above the header: a short invitation to become a member. One line on every screen;
// the yearly amount is explained on the membership page itself.
export function AbhiyanBar() {
  return (
    <Link href="/sadasya" className="no-print block bg-maroon text-white no-underline hover:bg-maroon-dark transition-colors">
      <span className="wrap flex items-center justify-center gap-2 py-2 text-[0.95rem] md:text-[0.98rem] whitespace-nowrap">
        <span aria-hidden="true" className="w-2 h-2 rounded-full bg-saffron shrink-0" />
        <span className="truncate">
          <strong className="font-semibold hidden sm:inline">मंदिर परिवार से जुड़ें · </strong>
          सहयोग भाव से सदस्य बनें
        </span>
        <ArrowRight width={18} height={18} className="shrink-0" />
      </span>
    </Link>
  );
}
