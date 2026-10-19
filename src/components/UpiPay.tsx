"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { MANDIR } from "@/lib/mandir";
import { rupees } from "@/lib/contact";
import { CheckIcon, CopyIcon } from "./Icons";

export const upiLinkFor = (amount: number, note: string) =>
  `upi://pay?${new URLSearchParams({ pa: MANDIR.upiId, pn: MANDIR.upiPayee, am: String(amount), cu: "INR", tn: note.slice(0, 50) })}`;

// UTRs are 12 digits for UPI; some apps show longer alphanumeric IDs, so accept 6–35 letters/digits.
export function cleanUtr(v: string) {
  return v.replace(/[\s-]/g, "");
}
export function utrError(v: string) {
  return /^[A-Za-z0-9]{6,35}$/.test(cleanUtr(v)) ? null : "कृपया भुगतान के बाद ऐप में दिखी लेनदेन संख्या (UTR / Transaction ID) लिखें।";
}

// QR + "open UPI app" for an existing receipt. The receipt number goes in the UPI note for bank matching.
export function UpiQr({ amount, receipt, purpose }: { amount: number; receipt: string; purpose: string }) {
  const link = upiLinkFor(amount, `${receipt} ${purpose}`);
  const [qr, setQr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    QRCode.toDataURL(link, { width: 480, margin: 1, color: { dark: "#23170f", light: "#ffffff" } }).then(setQr);
  }, [link]);

  return (
    <div className="grid gap-4 justify-items-center text-center">
      <div className="grid gap-0.5">
        <span className="text-ink-soft">{purpose} · रसीद {receipt}</span>
        <span className="text-[2.4rem] font-bold tabular-nums leading-tight">{rupees(amount)}</span>
      </div>
      <a href={link} className="btn btn-primary w-full max-w-sm min-h-14 text-[1.12rem] md:hidden">
        UPI ऐप खोलकर भुगतान करें
      </a>
      <div className="w-56 h-56 md:w-64 md:h-64 rounded-2xl border-2 border-line bg-white p-3 grid place-items-center">
        {qr ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={qr} alt={`${rupees(amount)} भुगतान के लिए UPI QR कोड`} className="w-full h-full" />
        ) : (
          <span className="text-ink-soft">QR बन रहा है…</span>
        )}
      </div>
      <p className="text-ink-soft text-[0.95rem]">PhonePe, Google Pay, Paytm या BHIM से स्कैन करें</p>
      <div className="flex items-center gap-2">
        <span className="font-semibold text-[1.1rem] tabular-nums">{MANDIR.upiId}</span>
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
    </div>
  );
}

// Sends the UTR; the receipt becomes "पुष्टि लंबित" until the committee confirms.
export async function submitUtr(paymentId: string, utr: string): Promise<string | null> {
  const res = await fetch(`/api/payments/${paymentId}/paid`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ utr: cleanUtr(utr) }),
  }).catch(() => null);
  if (res?.ok) return null;
  const msg = res ? (await res.json().catch(() => ({}))).error : null;
  return msg || "जानकारी नहीं भेजी जा सकी। इंटरनेट जाँचकर फिर कोशिश करें।";
}

export function UtrField({ id, value, onChange, autoFocus }: { id: string; value: string; onChange: (v: string) => void; autoFocus?: boolean }) {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="font-semibold text-[1.1rem]">लेनदेन संख्या (UTR / Transaction ID)</label>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoFocus={autoFocus}
        autoComplete="off"
        inputMode="text"
        placeholder="जैसे 428177652210"
        className="input text-[1.2rem] min-h-14 tabular-nums tracking-wide"
      />
      <p className="text-ink-soft text-[0.92rem]">
        भुगतान के बाद ऐप में दिखती है: PhonePe में “Transaction ID / UTR”, Google Pay में “UPI transaction ID”, Paytm में “UPI Ref No.”
      </p>
    </div>
  );
}

// Used on the receipt page when a donor comes back before finishing payment.
export function UpiPay({ paymentId, receipt, amount, purpose, onPaid }: { paymentId: string; receipt: string; amount: number; purpose: string; onPaid: () => void }) {
  const [utr, setUtr] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <form
      className="grid gap-6"
      onSubmit={async (e) => {
        e.preventDefault();
        const err = utrError(utr);
        if (err) return setError(err);
        setBusy(true);
        const msg = await submitUtr(paymentId, utr);
        setBusy(false);
        if (msg) return setError(msg);
        onPaid();
      }}
    >
      <UpiQr amount={amount} receipt={receipt} purpose={purpose} />
      <div className="border-t border-line pt-5 grid gap-3">
        <UtrField id={`utr-${paymentId}`} value={utr} onChange={setUtr} />
        {error && <p role="alert" className="text-maroon font-semibold">{error}</p>}
        <button disabled={busy} className="btn btn-primary min-h-14 text-[1.1rem] disabled:opacity-60">
          {busy ? "भेजा जा रहा है…" : "रसीद लें"}
        </button>
      </div>
    </form>
  );
}
