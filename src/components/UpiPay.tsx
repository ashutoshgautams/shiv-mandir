"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import QRCode from "qrcode";
import { MANDIR } from "@/lib/mandir";
import { rupees } from "@/lib/contact";
import { CheckIcon, CopyIcon } from "./Icons";

export const upiLinkFor = (amount: number, note: string) =>
  `upi://pay?${new URLSearchParams({ pa: MANDIR.upiId, pn: MANDIR.upiPayee, am: String(amount), cu: "INR", tn: note.slice(0, 50) })}`;

const upiQuery = (amount: number, note: string) =>
  new URLSearchParams({ pa: MANDIR.upiId, pn: MANDIR.upiPayee, am: String(amount), cu: "INR", tn: note.slice(0, 50) }).toString();

type Platform = "android" | "ios" | "other";
const noop = () => () => {};
const getPlatform = (): Platform => {
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) return "android";
  if (/iphone|ipad|ipod/i.test(ua)) return "ios";
  return "other";
};

// Opening a specific app: Android intent URLs target the app's package; iOS uses each app's own scheme.
type App = { name: string; logo: string; wide?: boolean; android?: string; ios?: (q: string) => string };

const APPS: App[] = [
  { name: "Google Pay", logo: "/upi/gpay.svg", android: "com.google.android.apps.nbu.paisa.user", ios: (q) => `gpay://upi/pay?${q}` },
  { name: "Paytm", logo: "/upi/paytm.svg", wide: true, android: "net.one97.paytm", ios: (q) => `paytmmp://pay?${q}` },
];
// WhatsApp only opens payments by package on Android, so it is offered there only.
const WHATSAPP: App = { name: "WhatsApp UPI", logo: "/upi/whatsapp.svg", android: "com.whatsapp" };

function appLink(app: App, platform: Platform, q: string) {
  if (platform === "android" && app.android) return `intent://pay?${q}#Intent;scheme=upi;package=${app.android};end`;
  if (platform === "ios" && app.ios) return app.ios(q);
  return null;
}

// UTRs are 12 digits for UPI; some apps show longer alphanumeric IDs, so accept 6–35 letters/digits.
export function cleanUtr(v: string) {
  return v.replace(/[\s-]/g, "");
}
export function utrError(v: string) {
  return /^[A-Za-z0-9]{6,35}$/.test(cleanUtr(v)) ? null : "कृपया भुगतान के बाद ऐप में दिखी लेनदेन संख्या (UTR / Transaction ID) लिखें।";
}

function Heading({ children }: { children: React.ReactNode }) {
  return <h3 className="font-sans font-semibold text-[1.05rem] text-ink">{children}</h3>;
}

// Payment step for an existing receipt: (1) open an app, (2) copy the UPI ID, (3) scan the QR.
// The receipt number goes in the UPI note so the treasurer can match it in the bank statement.
export function UpiQr({ amount, receipt, purpose }: { amount: number; receipt: string; purpose: string }) {
  const q = upiQuery(amount, `${receipt} ${purpose}`);
  const platform = useSyncExternalStore(noop, getPlatform, () => "other" as Platform);
  const apps = APPS.map((a) => ({ app: a, href: appLink(a, platform, q) })).filter((a) => a.href);
  const wa = appLink(WHATSAPP, platform, q);
  const [qr, setQr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    QRCode.toDataURL(upiLinkFor(amount, `${receipt} ${purpose}`), { width: 480, margin: 1, color: { dark: "#23170f", light: "#ffffff" } }).then(setQr);
  }, [amount, receipt, purpose]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(MANDIR.upiId);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="grid gap-5">
      <div className="grid gap-0.5 text-center">
        <span className="text-ink-soft">{purpose} · रसीद {receipt}</span>
        <span className="text-[2.4rem] font-bold tabular-nums leading-tight">{rupees(amount)}</span>
      </div>

      {(apps.length > 0 || wa) && (
        <section className="grid gap-2.5">
          <Heading>ऐप से सीधे भुगतान करें</Heading>
          <div className="grid grid-cols-2 gap-2.5">
            {apps.map(({ app, href }) => (
              <a
                key={app.name}
                href={href!}
                aria-label={`${app.name} से ${rupees(amount)} भेजें`}
                className="grid place-items-center min-h-16 rounded-xl border-2 border-line bg-card hover:border-maroon"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={app.logo} alt="" className={app.wide ? "h-7 w-auto" : "h-9 w-auto"} />
              </a>
            ))}
          </div>
          {wa && (
            <a href={wa} className="flex items-center justify-center gap-2.5 min-h-14 rounded-xl border-2 border-line bg-card no-underline text-ink font-semibold hover:border-maroon">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={WHATSAPP.logo} alt="" className="h-7 w-7" />
              WhatsApp UPI से भेजें
            </a>
          )}
        </section>
      )}

      <section className="grid gap-2.5 rounded-xl bg-paper border border-line p-4">
        <Heading>{apps.length > 0 || wa ? "या UPI ID कॉपी करके भेजें" : "UPI ID कॉपी करके भेजें"}</Heading>
        <div className="grid gap-2">
          <span className="bg-card border border-line rounded-lg px-3 py-3 font-bold text-[1.25rem] tabular-nums text-center tracking-wide select-all">{MANDIR.upiId}</span>
          <button
            type="button"
            onClick={copy}
            className={`btn w-full min-h-12 py-2 ${copied ? "bg-leaf text-white" : "btn-primary"}`}
          >
            {copied ? <><CheckIcon width={18} height={18} /> कॉपी हो गया, अब अपने ऐप में पेस्ट करें</> : <><CopyIcon width={18} height={18} /> UPI ID कॉपी करें</>}
          </button>
        </div>
        <ol className="grid gap-1.5 text-[0.95rem] text-ink list-decimal pl-5 marker:text-ink-soft">
          <li>अपना कोई भी UPI ऐप खोलें</li>
          <li>“UPI ID पर भेजें / Pay to UPI ID” चुनें और UPI ID <strong>पेस्ट करें</strong></li>
          <li>राशि <strong className="tabular-nums">{rupees(amount)}</strong> लिखें और संदेश (note) में <strong>{receipt}</strong> लिखें</li>
        </ol>
      </section>

      <section className="grid gap-2.5 justify-items-center text-center">
        <Heading>या QR स्कैन करें</Heading>
        <div className="w-52 h-52 md:w-60 md:h-60 rounded-2xl border-2 border-line bg-white p-3 grid place-items-center">
          {qr ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qr} alt={`${rupees(amount)} भुगतान के लिए UPI QR कोड`} className="w-full h-full" />
          ) : (
            <span className="text-ink-soft">QR बन रहा है…</span>
          )}
        </div>
        <p className="text-ink-soft text-[0.92rem]">दूसरे फ़ोन से किसी भी UPI ऐप में स्कैन करें</p>
      </section>
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
