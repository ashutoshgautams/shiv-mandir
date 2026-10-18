import Link from "next/link";
import { MEMBERSHIP } from "@/lib/mandir";
import { rupees } from "@/lib/contact";
import { ArrowRight } from "./Icons";

// Site-wide strip above the header: invitation to become a member.
export function AbhiyanBar() {
  return (
    <Link href="/sadasya" className="no-print block bg-maroon text-white no-underline hover:bg-maroon-dark transition-colors">
      <span className="wrap flex items-center justify-center gap-2 py-2.5 text-[0.98rem] text-center">
        <span aria-hidden="true" className="w-2 h-2 rounded-full bg-saffron shrink-0" />
        <span>
          <strong className="font-semibold">मंदिर परिवार से जुड़ें</strong> · सहयोग भाव से सदस्य बनें ({rupees(MEMBERSHIP.fee)} वार्षिक)
        </span>
        <ArrowRight width={18} height={18} className="shrink-0" />
      </span>
    </Link>
  );
}
