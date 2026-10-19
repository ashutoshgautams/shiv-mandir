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
type App = { name: string; logo?: string; badge?: string; color?: string; android?: string; ios?: (q: string) => string };

// Shown as big buttons.
const MAIN_APPS: App[] = [
  { name: "Google Pay", logo: "/upi/gpay.svg", android: "com.google.android.apps.nbu.paisa.user", ios: (q) => `gpay://upi/pay?${q}` },
  { name: "Paytm", logo: "/upi/paytm.svg", android: "net.one97.paytm", ios: (q) => `paytmmp://pay?${q}` },
];

// Listed under "अन्य UPI ऐप". On Android each opens that app directly.
const OTHER_APPS: App[] = [
  { name: "BHIM UPI", logo: "/upi/upi.svg", android: "in.org.npci.upiapp" },
  { name: "WhatsApp", logo: "/upi/whatsapp.svg", android: "com.whatsapp" },
  { name: "Amazon Pay", logo: "/upi/amazonpay.svg", android: "in.amazon.mShop.android.shopping" },
  { name: "CRED", badge: "C", color: "#111111", android: "com.dreamplug.androidapp" },
  { name: "MobiKwik", badge: "M", color: "#1f4cb3", android: "com.mobikwik_new" },
];

function appLink(app: App, platform: Platform, q: string) {
  if (platform === "android" && app.android) return `intent://pay?${q}#Intent;scheme=upi;package=${app.android};end`;
  if (platform === "ios" && app.ios) return app.ios(q);
  return null;
}

function AppMark({ app, size = 26 }: { app: App; size?: number }) {
  if (app.logo) {
    // eslint-disable-next-line @next/next/no-img-element
    // Wordmark logos (Paytm, UPI, Amazon Pay) are wide, so keep the height and let the width follow.
    return <img src={app.logo} alt="" height={size} className="shrink-0 object-contain" style={{ height: size, width: "auto", maxWidth: size * 2.4 }} />;
  }
  return (
    <span aria-hidden="true" className="shrink-0 grid place-items-center rounded-md text-white font-bold text-[0.8rem]" style={{ width: size, height: size, background: app.color }}>
      {app.badge}
    </span>
  );
}

// UTRs are 12 digits for UPI; some apps show longer alphanumeric IDs, so accept 6–35 letters/digits.
export function cleanUtr(v: string) {
  return v.replace(/[\s-]/g, "");
}
export function utrError(v: string) {
  return /^[A-Za-z0-9]{6,35}$/.test(cleanUtr(v)) ? null : "कृपया भुगतान के बाद ऐप में दिखी लेनदेन संख्या (UTR / Transaction ID) लिखें।";
}

// QR + "open UPI app" for an existing receipt. The receipt number goes in the UPI note for bank matching.
export function UpiQr({ amount, receipt, purpose }: { amount: number; receipt: string; purpose: string }) {
  const note = `${receipt} ${purpose}`;
  const link = upiLinkFor(amount, note);
  const q = upiQuery(amount, note);
  const platform = useSyncExternalStore(noop, getPlatform, () => "other" as Platform);
  const main = MAIN_APPS.map((a) => ({ app: a, href: appLink(a, platform, q) })).filter((a) => a.href);
  const others = OTHER_APPS.map((a) => ({ app: a, href: appLink(a, platform, q) })).filter((a) => a.href);
  const [showOthers, setShowOthers] = useState(false);
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
      {platform !== "other" && (
        <div className="w-full max-w-sm grid gap-2">
          <span className="font-semibold">अपना UPI ऐप चुनें</span>
          <div className="grid grid-cols-2 gap-2">
            {main.map(({ app, href }) => (
              <a
                key={app.name}
                href={href!}
                className="flex items-center justify-center gap-2.5 min-h-14 px-3 rounded-xl border-2 border-line bg-card no-underline text-ink font-semibold hover:border-maroon"
              >
                <AppMark app={app} size={28} />
                {app.name}
              </a>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setShowOthers((v) => !v)}
            aria-expanded={showOthers}
            className="min-h-12 rounded-xl border-2 border-dashed border-line text-maroon font-semibold hover:border-maroon"
          >
            {showOthers ? "कम दिखाएँ" : "अन्य UPI ऐप (BHIM, WhatsApp, Amazon Pay…)"}
          </button>
          {showOthers && (
            <div className="grid gap-2">
              {others.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {others.map(({ app, href }) => (
                    <a
                      key={app.name}
                      href={href!}
                      className="flex items-center gap-2 min-h-12 px-3 rounded-xl border border-line bg-card no-underline text-ink font-medium hover:border-maroon"
                    >
                      <AppMark app={app} size={22} />
                      {app.name}
                    </a>
                  ))}
                </div>
              )}
              <a href={link} className="flex items-center justify-center gap-2 min-h-12 rounded-xl border border-line bg-paper no-underline text-ink font-medium hover:border-maroon">
                <AppMark app={{ name: "UPI", logo: "/upi/upi.svg" }} size={22} />
                फ़ोन में मौजूद कोई भी UPI ऐप
              </a>
            </div>
          )}
          <span className="text-ink-soft text-[0.88rem]">या दूसरे फ़ोन से नीचे का QR स्कैन करें</span>
        </div>
      )}
      <div className="w-56 h-56 md:w-64 md:h-64 rounded-2xl border-2 border-line bg-white p-3 grid place-items-center">
        {qr ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={qr} alt={`${rupees(amount)} भुगतान के लिए UPI QR कोड`} className="w-full h-full" />
        ) : (
          <span className="text-ink-soft">QR बन रहा है…</span>
        )}
      </div>
      <p className="text-ink-soft text-[0.95rem]">किसी भी UPI ऐप से स्कैन करें</p>
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
