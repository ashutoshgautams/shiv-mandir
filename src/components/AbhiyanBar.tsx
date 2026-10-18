import Link from "next/link";
import { ABHIYAN } from "@/lib/mandir";
import { ArrowRight } from "./Icons";

// Thin announcement strip above the header while a festival appeal is running.
export function AbhiyanBar() {
  if (!ABHIYAN.active) return null;
  return (
    <Link
      href="/chanda"
      className="no-print block bg-maroon text-white no-underline hover:bg-maroon-dark transition-colors"
    >
      <span className="wrap flex items-center justify-center gap-2 py-2 text-[0.95rem] text-center">
        <span aria-hidden="true" className="w-2 h-2 rounded-full bg-saffron shrink-0" />
        <span>
          <strong className="font-semibold">{ABHIYAN.title}</strong> चल रही है · ऑनलाइन चंदा दें
        </span>
        <ArrowRight width={18} height={18} />
      </span>
    </Link>
  );
}
