"use client";

import { useCallback, useEffect, useState } from "react";
import QRCode from "qrcode";
import { ABHIYAN, MANDIR, isPlaceholder } from "@/lib/mandir";
import { CHANDA_AMOUNTS, CHANDA_PURPOSES, type ChandaSummary } from "@/lib/chanda";
import { rupees } from "@/lib/contact";
import { CheckIcon, CopyIcon } from "./Icons";

type Step = "details" | "pay" | "done";
type Details = { purpose: string; amount: number | null; custom: string; name: string; phone: string; mohalla: string; anonymous: boolean };

const STEPS: { id: Step; label: string }[] = [
  { id: "details", label: "राशि और नाम" },
  { id: "pay", label: "भुगतान" },
  { id: "done", label: "रसीद" },
];

export function ChandaClient() {
  const [step, setStep] = useState<Step>("details");
  const [d, setD] = useState<Details>({
    purpose: ABHIYAN.active ? ABHIYAN.id : CHANDA_PURPOSES[1].id,
    amount: 501,
    custom: "",
    name: "",
    phone: "",
    mohalla: "",
    anonymous: false,
  });
  const [error, setError] = useState("");
  const [summary, setSummary] = useState<ChandaSummary | null>(null);
  const [receipt, setReceipt] = useState<{ receipt: string; createdAt: string; utr: string } | null>(null);

  const amount = d.amount ?? Math.round(Number(d.custom));
  const purpose = CHANDA_PURPOSES.find((p) => p.id === d.purpose)!;

  const refresh = useCallback(() => {
    fetch(`/api/chanda?purpose=${ABHIYAN.id}`)
      .then((r) => r.json())
      .then(setSummary)
      .catch(() => {});
  }, []);
  useEffect(refresh, [refresh]);

  const toPay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount < 1) return setError("कृपया चंदा की राशि चुनें या लिखें।");
    if (!d.name.trim()) return setError("कृपया अपना नाम लिखें।");
    if (d.phone.replace(/\D/g, "").length < 10) return setError("कृपया 10 अंकों का मोबाइल नंबर लिखें।");
    setError("");
    setStep("pay");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const confirm = async (utr: string) => {
    setError("");
    const res = await fetch("/api/chanda", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...d, amount, utr }),
    }).catch(() => null);
    if (!res || !res.ok) {
      const msg = res ? (await res.json().catch(() => ({}))).error : null;
      return setError(msg || "रसीद नहीं बन सकी। इंटरनेट जाँचकर फिर से कोशिश करें।");
    }
    const data = await res.json();
    setReceipt({ ...data, utr });
    setStep("done");
    refresh();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem] items-start">
      <div className="bg-card rounded-2xl border border-line shadow-[0_10px_30px_rgba(35,23,15,0.06)] overflow-hidden">
        <ol className="no-print grid grid-cols-3 border-b border-line bg-paper" aria-label="चरण">
          {STEPS.map((s, i) => {
            const idx = STEPS.findIndex((x) => x.id === step);
            const state = i < idx ? "done" : i === idx ? "now" : "next";
            return (
              <li
                key={s.id}
                aria-current={state === "now" ? "step" : undefined}
                className={`flex items-center justify-center gap-2 py-3.5 px-2 text-[0.95rem] font-semibold text-center ${
                  state === "now" ? "text-maroon bg-card" : state === "done" ? "text-leaf" : "text-ink-soft"
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-full grid place-items-center text-[0.85rem] shrink-0 ${
                    state === "now" ? "bg-maroon text-white" : state === "done" ? "bg-leaf text-white" : "bg-line text-ink"
                  }`}
                >
                  {state === "done" ? <CheckIcon width={16} height={16} /> : i + 1}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </li>
            );
          })}
        </ol>

        <div className="p-5 md:p-8">
          {step === "details" && (
            <form onSubmit={toPay} noValidate className="grid gap-7">
              <fieldset className="grid gap-3">
                <legend className="font-semibold text-[1.1rem] mb-3">चंदा किस कार्य के लिए</legend>
                <div className="grid sm:grid-cols-2 gap-3">
                  {CHANDA_PURPOSES.map((p) => (
                    <label
                      key={p.id}
                      className={`relative grid gap-0.5 p-4 rounded-xl border-2 cursor-pointer transition-colors has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-saffron ${
                        d.purpose === p.id ? "border-maroon bg-saffron-soft" : "border-line hover:border-gold"
                      }`}
                    >
                      <input
                        type="radio"
                        name="purpose"
                        id={`cp-${p.id}`}
                        value={p.id}
                        checked={d.purpose === p.id}
                        onChange={() => setD({ ...d, purpose: p.id })}
                        className="sr-only"
                      />
                      <span className="font-semibold text-[1.05rem] flex items-center gap-2">
                        {p.name}
                        {p.id === ABHIYAN.id && ABHIYAN.active && (
                          <span className="text-[0.75rem] px-2 py-0.5 rounded bg-maroon text-white font-semibold">अभी चल रहा</span>
                        )}
                      </span>
                      <span className="text-ink-soft text-[0.92rem]">{p.about}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset className="grid gap-3">
                <legend className="font-semibold text-[1.1rem] mb-3">राशि चुनें</legend>
                <div className="grid grid-cols-3 gap-3">
                  {CHANDA_AMOUNTS.map((a) => (
                    <button
                      key={a}
                      type="button"
                      aria-pressed={d.amount === a}
                      onClick={() => setD({ ...d, amount: a, custom: "" })}
                      className={`h-14 rounded-xl border-2 font-bold text-[1.15rem] tabular-nums transition-colors ${
                        d.amount === a ? "bg-maroon border-maroon text-white" : "bg-card border-line hover:border-maroon"
                      }`}
                    >
                      {rupees(a)}
                    </button>
                  ))}
                </div>
                <label htmlFor="chanda-custom" className="mt-1 font-medium">या अपनी राशि लिखें</label>
                <div className="relative max-w-xs">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-ink-soft">₹</span>
                  <input
                    id="chanda-custom"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    value={d.custom}
                    onChange={(e) => setD({ ...d, custom: e.target.value, amount: null })}
                    onFocus={() => setD((x) => ({ ...x, amount: null }))}
                    placeholder="जैसे 1500"
                    className="input pl-9 tabular-nums"
                  />
                </div>
              </fieldset>

              <fieldset className="grid gap-4">
                <legend className="font-semibold text-[1.1rem] mb-3">आपकी जानकारी</legend>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="grid gap-1.5">
                    <label htmlFor="chanda-name" className="font-medium">नाम</label>
                    <input id="chanda-name" autoComplete="name" value={d.name} onChange={(e) => setD({ ...d, name: e.target.value })} className="input" />
                  </div>
                  <div className="grid gap-1.5">
                    <label htmlFor="chanda-phone" className="font-medium">मोबाइल नंबर</label>
                    <input id="chanda-phone" type="tel" inputMode="numeric" autoComplete="tel" value={d.phone} onChange={(e) => setD({ ...d, phone: e.target.value })} className="input" />
                  </div>
                </div>
                <div className="grid gap-1.5">
                  <label htmlFor="chanda-mohalla" className="font-medium">मोहल्ला / रोड नं. (वैकल्पिक)</label>
                  <input id="chanda-mohalla" value={d.mohalla} onChange={(e) => setD({ ...d, mohalla: e.target.value })} placeholder="जैसे रोड नं. 24, राजीव नगर" className="input" />
                </div>
                <label className="flex items-center gap-3 cursor-pointer w-fit">
                  <input
                    id="chanda-anon"
                    type="checkbox"
                    checked={d.anonymous}
                    onChange={(e) => setD({ ...d, anonymous: e.target.checked })}
                    className="w-6 h-6 accent-maroon"
                  />
                  <span>सूची में मेरा नाम न दिखाएँ</span>
                </label>
              </fieldset>

              {error && <p role="alert" className="text-maroon font-semibold">{error}</p>}
              <button type="submit" className="btn btn-primary w-full text-[1.15rem] min-h-14">
                {amount ? `${rupees(amount)} का चंदा देने के लिए आगे बढ़ें` : "आगे बढ़ें"}
              </button>
            </form>
          )}

          {step === "pay" && (
            <PayStep amount={amount} purpose={purpose.name} name={d.name} onBack={() => setStep("details")} onConfirm={confirm} error={error} />
          )}

          {step === "done" && receipt && (
            <div className="grid gap-6">
              <div className="flex items-center gap-3 text-leaf">
                <span className="w-12 h-12 rounded-full bg-leaf-soft grid place-items-center"><CheckIcon /></span>
                <p className="text-[1.3rem] font-semibold">धन्यवाद! आपका चंदा दर्ज हो गया।</p>
              </div>
              <div className="border-2 border-dashed border-gold rounded-xl p-5 md:p-6 grid gap-3 bg-paper">
                <div className="flex justify-between items-baseline gap-4 border-b border-line pb-3">
                  <span className="font-display text-[1.3rem]">{MANDIR.name}</span>
                  <span className="text-ink-soft text-[0.9rem] whitespace-nowrap">चंदा रसीद</span>
                </div>
                <Row k="रसीद संख्या" v={receipt.receipt} />
                <Row k="नाम" v={d.name} />
                <Row k="राशि" v={rupees(amount)} strong />
                <Row k="कार्य" v={purpose.name} />
                {receipt.utr && <Row k="UPI लेनदेन संख्या" v={receipt.utr} />}
                <Row k="दिनांक" v={new Intl.DateTimeFormat("hi-IN", { dateStyle: "long", timeZone: "Asia/Kolkata" }).format(new Date(receipt.createdAt))} />
                <p className="text-[0.9rem] text-ink-soft pt-2 border-t border-line">
                  समिति बैंक खाते से मिलान के बाद भुगतान की पुष्टि करेगी। यह रसीद संभाल कर रखें।
                </p>
              </div>
              <div className="no-print grid sm:grid-cols-2 gap-3">
                <button type="button" onClick={() => window.print()} className="btn btn-outline">रसीद प्रिंट करें</button>
                <button
                  type="button"
                  onClick={() => {
                    setReceipt(null);
                    setD({ ...d, custom: "", amount: 501 });
                    setStep("details");
                  }}
                  className="btn btn-outline"
                >
                  एक और चंदा दें
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <aside className="no-print grid gap-5 lg:sticky lg:top-24">
        <div className="bg-card rounded-2xl border border-line p-5 grid gap-3">
          <span className="eyebrow">{ABHIYAN.title} · अब तक</span>
          <p className="text-[2rem] font-bold tabular-nums leading-none">{summary ? rupees(summary.total) : "—"}</p>
          <div className="h-3 rounded-full bg-paper border border-line overflow-hidden" role="progressbar" aria-label="लक्ष्य की प्रगति" aria-valuemin={0} aria-valuemax={ABHIYAN.goal} aria-valuenow={summary?.total ?? 0}>
            <div className="h-full bg-saffron rounded-full transition-[width] duration-700" style={{ width: `${Math.min(100, ((summary?.total ?? 0) / ABHIYAN.goal) * 100)}%` }} />
          </div>
          <p className="text-ink-soft text-[0.95rem]">
            लक्ष्य {rupees(ABHIYAN.goal)} · {summary?.count ?? 0} श्रद्धालुओं ने सहयोग दिया
          </p>
        </div>
        <div className="bg-card rounded-2xl border border-line p-5 grid gap-3">
          <h2 className="text-[1.3rem]">हाल के सहयोगी</h2>
          {summary && summary.recent.length > 0 ? (
            <ul className="grid divide-y divide-line">
              {summary.recent.map((r) => (
                <li key={r.receipt} className="flex justify-between gap-3 py-2.5">
                  <span className="min-w-0 truncate">{r.name}</span>
                  <span className="font-semibold tabular-nums">{rupees(r.amount)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-ink-soft">अभी तक कोई ऑनलाइन चंदा नहीं। पहला सहयोग आपका हो सकता है।</p>
          )}
        </div>
      </aside>
    </div>
  );
}

function Row({ k, v, strong }: { k: string; v: string; strong?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-ink-soft">{k}</span>
      <span className={`text-right ${strong ? "font-bold text-[1.2rem]" : "font-medium"}`}>{v}</span>
    </div>
  );
}

function PayStep({
  amount,
  purpose,
  name,
  onBack,
  onConfirm,
  error,
}: {
  amount: number;
  purpose: string;
  name: string;
  onBack: () => void;
  onConfirm: (utr: string) => Promise<void>;
  error: string;
}) {
  const [qr, setQr] = useState<string | null>(null);
  const [utr, setUtr] = useState("");
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  const upiLink = MANDIR.upiId
    ? `upi://pay?${new URLSearchParams({ pa: MANDIR.upiId, pn: MANDIR.upiPayee, am: String(amount), cu: "INR", tn: `${purpose} - ${name}`.slice(0, 50) })}`
    : null;

  useEffect(() => {
    if (upiLink) QRCode.toDataURL(upiLink, { width: 480, margin: 1, color: { dark: "#23170f", light: "#ffffff" } }).then(setQr);
  }, [upiLink]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(MANDIR.upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="grid gap-6">
      <div className="text-center grid gap-1">
        <span className="text-ink-soft">{purpose} के लिए चंदा</span>
        <span className="text-[2.6rem] font-bold tabular-nums leading-tight">{rupees(amount)}</span>
      </div>

      {isPlaceholder.upi && (
        <p className="bg-saffron-soft border border-saffron/40 rounded-xl p-4 text-[0.98rem]">
          <strong>समिति के लिए:</strong> मंदिर की UPI ID अभी नहीं जोड़ी गई है, इसलिए QR नहीं दिख रहा। UPI ID जुड़ते ही यहाँ असली QR और भुगतान बटन दिखेगा। तब तक इस चरण को आज़माने के लिए नीचे “भुगतान कर दिया” दबा सकते हैं।
        </p>
      )}

      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div className="grid justify-items-center gap-3">
          <div className="w-60 h-60 rounded-2xl border-2 border-line bg-card grid place-items-center p-3">
            {qr ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qr} alt={`${MANDIR.upiPayee} को ${rupees(amount)} भुगतान का QR कोड`} className="w-full h-full" />
            ) : (
              <span className="text-ink-soft text-center text-[0.95rem] px-4">UPI ID जुड़ने पर यहाँ QR कोड दिखेगा</span>
            )}
          </div>
          <span className="text-ink-soft text-[0.95rem]">PhonePe, Google Pay, Paytm या BHIM से स्कैन करें</span>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-1">
            <span className="text-ink-soft text-[0.95rem]">मोबाइल पर हैं? सीधे UPI ऐप खोलें</span>
            {upiLink ? (
              <a href={upiLink} className="btn btn-primary w-full min-h-14 text-[1.1rem]">UPI ऐप से {rupees(amount)} भेजें</a>
            ) : (
              <span className="btn w-full bg-line text-ink-soft cursor-not-allowed">UPI ऐप से भेजें (जल्द)</span>
            )}
          </div>
          <div className="grid gap-1">
            <span className="text-ink-soft text-[0.95rem]">UPI ID</span>
            <div className="flex items-center gap-2">
              <span className="flex-1 min-w-0 truncate font-semibold text-[1.1rem] bg-paper border border-line rounded-lg px-3 py-2.5">
                {MANDIR.upiId || "जल्द जोड़ी जाएगी"}
              </span>
              {MANDIR.upiId && (
                <button type="button" onClick={copy} className="btn btn-outline px-3" aria-label="UPI ID कॉपी करें">
                  {copied ? <CheckIcon /> : <CopyIcon />}
                </button>
              )}
            </div>
            <span className="text-ink-soft text-[0.9rem]">खाताधारक: {MANDIR.upiPayee}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-line pt-6 grid gap-3">
        <p className="font-semibold text-[1.1rem]">भुगतान करने के बाद</p>
        <label htmlFor="chanda-utr" className="text-ink-soft">
          UPI लेनदेन संख्या (UTR) लिखें, यह आपके ऐप में 12 अंकों की होती है (वैकल्पिक)
        </label>
        <input id="chanda-utr" inputMode="numeric" value={utr} onChange={(e) => setUtr(e.target.value)} placeholder="जैसे 4281 7765 2210" className="input tabular-nums max-w-sm" />
        {error && <p role="alert" className="text-maroon font-semibold">{error}</p>}
        <div className="grid sm:grid-cols-[auto_1fr] gap-3 mt-2">
          <button type="button" onClick={onBack} className="btn btn-outline">पीछे जाएँ</button>
          <button
            type="button"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              await onConfirm(utr);
              setBusy(false);
            }}
            className="btn btn-primary disabled:opacity-60"
          >
            {busy ? "रसीद बन रही है…" : "भुगतान कर दिया, रसीद दें"}
          </button>
        </div>
      </div>
    </div>
  );
}
