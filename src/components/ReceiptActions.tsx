"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MANDIR } from "@/lib/mandir";
import { rupees, whatsappHref } from "@/lib/contact";
import { UpiPay } from "./UpiPay";
import { CopyIcon, WhatsAppIcon } from "./Icons";

type P = { id: string; receipt: string; amount: number; purpose: string; name: string; utr: string; status: string };

export function ReceiptActions({ payment: p, link }: { payment: P; link: string }) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const message = [
    "जय भोलेनाथ।",
    `मैंने ${p.purpose} के लिए ${rupees(p.amount)} का भुगतान किया है।`,
    `नाम: ${p.name}`,
    `रसीद: ${p.receipt}`,
    p.utr && `UTR: ${p.utr}`,
    `रसीद लिंक: ${link}`,
    "कृपया पुष्टि करें। (भुगतान का स्क्रीनशॉट साथ में भेज रहा/रही हूँ)",
  ]
    .filter(Boolean)
    .join("\n");
  const wa = whatsappHref(message);

  if (p.status === "awaiting") {
    return (
      <div className="bg-card rounded-2xl border border-line p-5 md:p-8 no-print">
        <UpiPay paymentId={p.id} receipt={p.receipt} amount={p.amount} purpose={p.purpose} onPaid={() => router.refresh()} />
      </div>
    );
  }

  return (
    <div className="grid gap-3 no-print">
      {p.status !== "confirmed" && wa && (
        <a href={wa} target="_blank" rel="noopener" className="btn btn-primary w-full min-h-14 text-[1.08rem]">
          <WhatsAppIcon /> जल्दी पुष्टि के लिए WhatsApp पर स्क्रीनशॉट भेजें
        </a>
      )}
      <div className="grid sm:grid-cols-2 gap-3">
        <button type="button" onClick={() => window.print()} className="btn btn-outline">रसीद प्रिंट / सेव करें</button>
        <button
          type="button"
          className="btn btn-outline"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(link);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            } catch {}
          }}
        >
          <CopyIcon /> {copied ? "लिंक कॉपी हो गया" : "रसीद का लिंक कॉपी करें"}
        </button>
      </div>
      <p className="text-ink-soft text-[0.95rem] text-center">
        किसी भी प्रश्न के लिए: {MANDIR.phoneDisplay}
      </p>
    </div>
  );
}
