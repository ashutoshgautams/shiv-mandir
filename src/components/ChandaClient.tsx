"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ABHIYAN } from "@/lib/mandir";
import { CHANDA_AMOUNTS, CHANDA_PURPOSES } from "@/lib/chanda";
import { rupees } from "@/lib/contact";
import { UpiPay } from "./UpiPay";
import { UpiScanner } from "./UpiScanner";
import { CheckIcon } from "./Icons";

type Summary = { total: number; count: number; recent: { receipt: string; name: string; amount: number }[] };
type Details = { purpose: string; amount: number | null; custom: string; name: string; phone: string; mohalla: string; anonymous: boolean };

const STEPS = ["राशि और नाम", "भुगतान", "रसीद"];

export function ChandaClient() {
  const router = useRouter();
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
  const [busy, setBusy] = useState(false);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [payment, setPayment] = useState<{ id: string; receipt: string } | null>(null);

  const amount = d.amount ?? Math.round(Number(d.custom));
  const purpose = CHANDA_PURPOSES.find((p) => p.id === d.purpose)!;

  const refresh = useCallback(() => {
    fetch(`/api/chanda?kind=${ABHIYAN.id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((s) => s && setSummary(s))
      .catch(() => {});
  }, []);
  useEffect(refresh, [refresh]);

  const toPay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount < 1) return setError("कृपया चंदा की राशि चुनें या लिखें।");
    if (!d.name.trim()) return setError("कृपया अपना नाम लिखें।");
    if (d.phone.replace(/\D/g, "").length < 10) return setError("कृपया 10 अंकों का मोबाइल नंबर लिखें।");
    setError("");
    setBusy(true);
    const res = await fetch("/api/payments", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ type: "chanda", ...d, amount }),
    }).catch(() => null);
    setBusy(false);
    if (!res?.ok) {
      const msg = res ? (await res.json().catch(() => ({}))).error : null;
      return setError(msg || "रसीद नहीं बन सकी। इंटरनेट जाँचकर फिर कोशिश करें।");
    }
    setPayment(await res.json());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const stepIdx = payment ? 1 : 0;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem] items-start">
      <div className="bg-card rounded-2xl border border-line shadow-[0_10px_30px_rgba(35,23,15,0.06)] overflow-hidden">
        <ol className="grid grid-cols-3 border-b border-line bg-paper" aria-label="चरण">
          {STEPS.map((label, i) => {
            const state = i < stepIdx ? "done" : i === stepIdx ? "now" : "next";
            return (
              <li
                key={label}
                aria-current={state === "now" ? "step" : undefined}
                className={`flex items-center justify-center gap-2 py-3.5 px-2 text-[0.95rem] font-semibold ${
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
                <span className="hidden sm:inline">{label}</span>
              </li>
            );
          })}
        </ol>

        <div className="p-5 md:p-8">
          {payment ? (
            <UpiPay
              paymentId={payment.id}
              receipt={payment.receipt}
              amount={amount}
              purpose={purpose.name}
              onBack={() => setPayment(null)}
              onPaid={() => router.push(`/rasid/${payment.id}`)}
            />
          ) : (
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
                      <input type="radio" name="purpose" id={`cp-${p.id}`} value={p.id} checked={d.purpose === p.id} onChange={() => setD({ ...d, purpose: p.id })} className="sr-only" />
                      <span className="font-semibold text-[1.05rem] flex items-center gap-2 flex-wrap">
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
                  <input id="chanda-anon" type="checkbox" checked={d.anonymous} onChange={(e) => setD({ ...d, anonymous: e.target.checked })} className="w-6 h-6 accent-maroon" />
                  <span>सहयोगी सूची में मेरा नाम न दिखाएँ</span>
                </label>
              </fieldset>

              {error && <p role="alert" className="text-maroon font-semibold">{error}</p>}
              <button type="submit" disabled={busy} className="btn btn-primary w-full text-[1.15rem] min-h-14 disabled:opacity-60">
                {busy ? "रसीद बन रही है…" : amount ? `${rupees(amount)} का चंदा देने के लिए आगे बढ़ें` : "आगे बढ़ें"}
              </button>
            </form>
          )}
        </div>
      </div>

      <aside className="grid gap-5 lg:sticky lg:top-24">
        <div className="bg-card rounded-2xl border border-line p-5 grid gap-3">
          <span className="eyebrow">{ABHIYAN.title} · पुष्ट चंदा</span>
          <p className="text-[2rem] font-bold tabular-nums leading-none">{summary ? rupees(summary.total) : "—"}</p>
          <div
            className="h-3 rounded-full bg-paper border border-line overflow-hidden"
            role="progressbar"
            aria-label="लक्ष्य की प्रगति"
            aria-valuemin={0}
            aria-valuemax={ABHIYAN.goal}
            aria-valuenow={summary?.total ?? 0}
          >
            <div className="h-full bg-saffron rounded-full transition-[width] duration-700" style={{ width: `${Math.min(100, ((summary?.total ?? 0) / ABHIYAN.goal) * 100)}%` }} />
          </div>
          <p className="text-ink-soft text-[0.95rem]">
            लक्ष्य {rupees(ABHIYAN.goal)} · {summary?.count ?? 0} श्रद्धालुओं का सहयोग पुष्ट
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
            <p className="text-ink-soft">समिति द्वारा पुष्टि के बाद सहयोगियों के नाम यहाँ दिखेंगे।</p>
          )}
        </div>
        <UpiScanner
          title="सीधे स्कैन करके भुगतान"
          note="रसीद चाहिए तो बाईं ओर का फ़ॉर्म भरें। सीधे स्कैन करने पर WhatsApp पर नाम और राशि भेज दें।"
        />
      </aside>
    </div>
  );
}
