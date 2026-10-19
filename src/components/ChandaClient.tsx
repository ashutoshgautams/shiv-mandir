"use client";

import { useCallback, useEffect, useState } from "react";
import { ABHIYAN, MEMBERSHIP } from "@/lib/mandir";
import Link from "next/link";
import { CHANDA_AMOUNTS, CHANDA_PURPOSES } from "@/lib/chanda";
import { rupees } from "@/lib/contact";
import { PayWizard } from "./PayWizard";
import { UpiScanner } from "./UpiScanner";

type Summary = { total: number; count: number; recent: { receipt: string; name: string; amount: number }[] };
type Details = { purpose: string; amount: number | null; custom: string };

// Membership leads the list: fixed yearly amount, recorded as a membership payment.
const SADASYATA = { id: "sadasyata", name: "सदस्यता", about: `मंदिर परिवार के सदस्य बनें · वार्षिक सहयोग` };

export function ChandaClient() {
  const [d, setD] = useState<Details>({
    purpose: SADASYATA.id,
    amount: 501,
    custom: "",
  });
  const [summary, setSummary] = useState<Summary | null>(null);

  const isMember = d.purpose === SADASYATA.id;
  const amount = isMember ? MEMBERSHIP.fee : (d.amount ?? Math.round(Number(d.custom)));
  const purposeName = isMember ? `नई सदस्यता ${MEMBERSHIP.year}` : CHANDA_PURPOSES.find((p) => p.id === d.purpose)!.name;

  const refresh = useCallback(() => {
    fetch(`/api/chanda?kind=${ABHIYAN.id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((s) => s && setSummary(s))
      .catch(() => {});
  }, []);
  useEffect(refresh, [refresh]);

  return (
    <div className="grid gap-6 lg:gap-8 lg:grid-cols-[1fr_22rem] items-start">
      <PayWizard
        choiceTitle="किस कार्य के लिए, कितना चंदा"
        amount={amount || 0}
        purpose={purposeName}
        body={isMember ? { type: "membership", memberMode: "new" } : { type: "chanda", purpose: d.purpose }}
        allowAnonymous
        validateChoice={() => (!amount || amount < 1 ? "कृपया चंदा की राशि चुनें या लिखें।" : null)}
        choice={
          <div className="grid gap-6">
            <fieldset className="grid gap-2.5">
              <legend className="font-semibold mb-2">कार्य</legend>
              <div className="grid grid-cols-2 gap-2.5">
                <label
                  className={`col-span-2 relative flex items-center justify-between gap-3 p-3.5 md:p-4 rounded-xl border-2 cursor-pointer transition-colors has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-saffron ${
                    isMember ? "border-maroon bg-saffron-soft" : "border-gold/60 hover:border-gold"
                  }`}
                >
                  <input type="radio" name="purpose" id="cp-sadasyata" value={SADASYATA.id} checked={isMember} onChange={() => setD({ ...d, purpose: SADASYATA.id })} className="sr-only" />
                  <span className="grid gap-0.5">
                    <span className="font-semibold text-[1.08rem] md:text-[1.12rem]">{SADASYATA.name}</span>
                    <span className="text-ink-soft text-[0.85rem] md:text-[0.92rem] leading-snug">{SADASYATA.about}</span>
                  </span>
                  <span className="font-bold text-[1.3rem] tabular-nums text-maroon shrink-0">{rupees(MEMBERSHIP.fee)}</span>
                </label>
                {CHANDA_PURPOSES.map((p) => (
                  <label
                    key={p.id}
                    className={`relative grid content-start gap-0.5 p-3 md:p-3.5 rounded-xl border-2 cursor-pointer transition-colors has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-saffron ${
                      d.purpose === p.id ? "border-maroon bg-saffron-soft" : "border-line hover:border-gold"
                    }`}
                  >
                    <input type="radio" name="purpose" id={`cp-${p.id}`} value={p.id} checked={d.purpose === p.id} onChange={() => setD({ ...d, purpose: p.id })} className="sr-only" />
                    <span className="font-semibold text-[1rem] md:text-[1.05rem] leading-snug flex items-center gap-1.5 flex-wrap">
                      {p.name}
                      {p.id === ABHIYAN.id && ABHIYAN.active && (
                        <span className="text-[0.75rem] px-2 py-0.5 rounded bg-maroon text-white font-semibold">अभी चल रहा</span>
                      )}
                    </span>
                    <span className="text-ink-soft text-[0.82rem] md:text-[0.9rem] leading-snug">{p.about}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            {isMember ? (
              <p className="text-ink-soft text-[0.95rem]">
                पहले से सदस्य हैं और बकाया जमा करना है? <Link href="/sadasya" className="text-maroon font-semibold">सदस्यता पृष्ठ पर जाएँ</Link>
              </p>
            ) : (
            <fieldset className="grid gap-2.5">
                <legend className="font-semibold mb-2">राशि</legend>
                <div className="grid grid-cols-3 gap-2.5">
                  {CHANDA_AMOUNTS.map((a) => (
                    <button
                      key={a}
                      type="button"
                      aria-pressed={d.amount === a}
                      onClick={() => setD({ ...d, amount: a, custom: "" })}
                      className={`h-14 rounded-xl border-2 font-bold text-[1.1rem] tabular-nums transition-colors ${
                        d.amount === a ? "bg-maroon border-maroon text-white" : "bg-card border-line hover:border-maroon"
                      }`}
                    >
                      {rupees(a)}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <label htmlFor="chanda-custom" className="sr-only">अपनी राशि</label>
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-ink-soft">₹</span>
                  <input
                    id="chanda-custom"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    value={d.custom}
                    onChange={(e) => setD({ ...d, custom: e.target.value, amount: null })}
                    onFocus={() => setD((x) => ({ ...x, amount: null }))}
                    placeholder="या अपनी राशि लिखें"
                    className="input pl-9 tabular-nums min-h-14 text-[1.1rem]"
                  />
                </div>
              </fieldset>
            )}
          </div>
        }
      />

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
