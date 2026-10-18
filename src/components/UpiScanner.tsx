"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { MANDIR } from "@/lib/mandir";
import { CheckIcon, CopyIcon } from "./Icons";

const UPI_LINK = `upi://pay?${new URLSearchParams({ pa: MANDIR.upiId, pn: MANDIR.upiPayee, cu: "INR" })}`;

// Plain scan-and-pay QR for the temple's UPI ID (any amount). For a tracked receipt, use the chanda form.
export function UpiScanner({ title = "UPI स्कैनर", note }: { title?: string; note?: string }) {
  const [qr, setQr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    QRCode.toDataURL(UPI_LINK, { width: 520, margin: 1, color: { dark: "#23170f", light: "#ffffff" } }).then(setQr);
  }, []);

  return (
    <div className="bg-card rounded-2xl border-2 border-gold/50 p-5 grid gap-3 justify-items-center text-center">
      <span className="eyebrow">{title}</span>
      <div className="w-52 h-52 rounded-xl border border-line bg-white p-2.5 grid place-items-center">
        {qr ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={qr} alt={`मंदिर का UPI QR कोड: ${MANDIR.upiId}`} className="w-full h-full" />
        ) : (
          <span className="text-ink-soft text-[0.9rem]">QR बन रहा है…</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className="font-semibold text-[1.15rem] tabular-nums">{MANDIR.upiId}</span>
        <button
          type="button"
          aria-label="UPI ID कॉपी करें"
          className="w-10 h-10 grid place-items-center rounded-lg border-2 border-line hover:border-maroon text-maroon"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(MANDIR.upiId);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            } catch {}
          }}
        >
          {copied ? <CheckIcon width={18} height={18} /> : <CopyIcon width={18} height={18} />}
        </button>
      </div>
      <a href={UPI_LINK} className="btn btn-outline w-full md:hidden">UPI ऐप खोलें</a>
      <p className="text-ink-soft text-[0.92rem]">{note ?? "PhonePe, Google Pay, Paytm या BHIM से स्कैन करें"}</p>
    </div>
  );
}
