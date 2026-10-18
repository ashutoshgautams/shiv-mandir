"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { MANDIR } from "@/lib/mandir";
import { rupees } from "@/lib/contact";
import { CheckIcon, CopyIcon } from "./Icons";

// QR + UPI-app button for a receipt that already exists. The receipt number goes in the UPI note so the
// treasurer can match it against the bank statement. After paying, the donor enters the UTR.
export function UpiPay({
  paymentId,
  receipt,
  amount,
  purpose,
  onPaid,
  onBack,
}: {
  paymentId: string;
  receipt: string;
  amount: number;
  purpose: string;
  onPaid: () => void;
  onBack?: () => void;
}) {
  const [qr, setQr] = useState<string | null>(null);
  const [utr, setUtr] = useState("");
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const upiLink = `upi://pay?${new URLSearchParams({
    pa: MANDIR.upiId,
    pn: MANDIR.upiPayee,
    am: String(amount),
    cu: "INR",
    tn: `${receipt} ${purpose}`.slice(0, 50),
  })}`;

  useEffect(() => {
    QRCode.toDataURL(upiLink, { width: 480, margin: 1, color: { dark: "#23170f", light: "#ffffff" } }).then(setQr);
  }, [upiLink]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(MANDIR.upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const confirm = async () => {
    setBusy(true);
    setError("");
    const res = await fetch(`/api/payments/${paymentId}/paid`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ utr }),
    }).catch(() => null);
    setBusy(false);
    if (!res?.ok) {
      const msg = res ? (await res.json().catch(() => ({}))).error : null;
      return setError(msg || "जानकारी नहीं भेजी जा सकी। इंटरनेट जाँचकर फिर कोशिश करें।");
    }
    onPaid();
  };

  return (
    <div className="grid gap-6">
      <div className="text-center grid gap-1">
        <span className="text-ink-soft">{purpose} · रसीद {receipt}</span>
        <span className="text-[2.6rem] font-bold tabular-nums leading-tight">{rupees(amount)}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div className="grid justify-items-center gap-3">
          <div className="w-60 h-60 rounded-2xl border-2 border-line bg-card grid place-items-center p-3">
            {qr ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qr} alt={`${rupees(amount)} भुगतान के लिए UPI QR कोड`} className="w-full h-full" />
            ) : (
              <span className="text-ink-soft">QR बन रहा है…</span>
            )}
          </div>
          <span className="text-ink-soft text-[0.95rem] text-center">PhonePe, Google Pay, Paytm या BHIM से स्कैन करें</span>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-1">
            <span className="text-ink-soft text-[0.95rem]">मोबाइल पर हैं? सीधे UPI ऐप खोलें</span>
            <a href={upiLink} className="btn btn-primary w-full min-h-14 text-[1.1rem]">UPI ऐप से {rupees(amount)} भेजें</a>
          </div>
          <div className="grid gap-1">
            <span className="text-ink-soft text-[0.95rem]">या इस UPI ID पर भेजें</span>
            <div className="flex items-center gap-2">
              <span className="flex-1 min-w-0 truncate font-semibold text-[1.15rem] bg-paper border border-line rounded-lg px-3 py-2.5 tabular-nums">
                {MANDIR.upiId}
              </span>
              <button type="button" onClick={copy} className="btn btn-outline px-3" aria-label="UPI ID कॉपी करें">
                {copied ? <CheckIcon /> : <CopyIcon />}
              </button>
            </div>
            <span className="text-ink-soft text-[0.9rem]">भुगतान के संदेश (note) में रसीद संख्या <strong className="text-ink">{receipt}</strong> लिखें</span>
          </div>
        </div>
      </div>

      <div className="border-t border-line pt-6 grid gap-3">
        <p className="font-semibold text-[1.1rem]">भुगतान करने के बाद</p>
        <label htmlFor={`utr-${paymentId}`} className="text-ink-soft">
          UPI लेनदेन संख्या (UTR / Transaction ID) लिखें, यह आपके ऐप में 12 अंकों की होती है
        </label>
        <input
          id={`utr-${paymentId}`}
          inputMode="numeric"
          value={utr}
          onChange={(e) => setUtr(e.target.value)}
          placeholder="जैसे 4281 7765 2210"
          className="input tabular-nums max-w-sm"
        />
        {error && <p role="alert" className="text-maroon font-semibold">{error}</p>}
        <div className={`grid gap-3 mt-2 ${onBack ? "sm:grid-cols-[auto_1fr]" : ""}`}>
          {onBack && <button type="button" onClick={onBack} className="btn btn-outline">पीछे जाएँ</button>}
          <button type="button" disabled={busy} onClick={confirm} className="btn btn-primary disabled:opacity-60">
            {busy ? "भेजा जा रहा है…" : "भुगतान कर दिया, रसीद दें"}
          </button>
        </div>
      </div>
    </div>
  );
}
