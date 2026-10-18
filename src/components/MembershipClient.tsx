"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MEMBERSHIP } from "@/lib/mandir";
import { rupees } from "@/lib/contact";
import { UpiPay } from "./UpiPay";

export function MembershipClient() {
  const router = useRouter();
  const [mode, setMode] = useState<"new" | "renew">("new");
  const [f, setF] = useState({ name: "", phone: "", mohalla: "", amount: String(MEMBERSHIP.fee) });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [payment, setPayment] = useState<{ id: string; receipt: string } | null>(null);

  const amount = mode === "new" ? MEMBERSHIP.fee : Math.round(Number(f.amount));
  const purpose = mode === "new" ? `नई सदस्यता ${MEMBERSHIP.year}` : `सदस्यता शुल्क ${MEMBERSHIP.year}`;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.name.trim()) return setError("कृपया अपना नाम लिखें।");
    if (f.phone.replace(/\D/g, "").length < 10) return setError("कृपया 10 अंकों का मोबाइल नंबर लिखें।");
    if (!amount || amount < 1) return setError("कृपया राशि लिखें।");
    setError("");
    setBusy(true);
    const res = await fetch("/api/payments", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ type: "membership", memberMode: mode, ...f, amount }),
    }).catch(() => null);
    setBusy(false);
    if (!res?.ok) {
      const msg = res ? (await res.json().catch(() => ({}))).error : null;
      return setError(msg || "आवेदन नहीं भेजा जा सका। इंटरनेट जाँचकर फिर कोशिश करें।");
    }
    setPayment(await res.json());
  };

  if (payment) {
    return (
      <UpiPay
        paymentId={payment.id}
        receipt={payment.receipt}
        amount={amount}
        purpose={purpose}
        onBack={() => setPayment(null)}
        onPaid={() => router.push(`/rasid/${payment.id}`)}
      />
    );
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-5">
      <div role="radiogroup" aria-label="सदस्यता का प्रकार" className="grid sm:grid-cols-2 gap-3">
        {(
          [
            ["new", "नया सदस्य बनना है", `वार्षिक सहयोग ${rupees(MEMBERSHIP.fee)}`],
            ["renew", "पहले से सदस्य हूँ", "बकाया या वार्षिक शुल्क जमा करना है"],
          ] as const
        ).map(([id, title, sub]) => (
          <label key={id} className={`grid gap-0.5 p-4 rounded-xl border-2 cursor-pointer has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-saffron ${mode === id ? "border-maroon bg-saffron-soft" : "border-line hover:border-gold"}`}>
            <input type="radio" name="mode" id={`mm-${id}`} checked={mode === id} onChange={() => setMode(id)} className="sr-only" />
            <span className="font-semibold text-[1.05rem]">{title}</span>
            <span className="text-ink-soft text-[0.92rem]">{sub}</span>
          </label>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="grid gap-1.5">
          <label htmlFor="mem-name" className="font-medium">नाम</label>
          <input id="mem-name" autoComplete="name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className="input" />
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="mem-phone" className="font-medium">मोबाइल नंबर</label>
          <input id="mem-phone" type="tel" inputMode="numeric" autoComplete="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} className="input" />
        </div>
      </div>
      <div className="grid gap-1.5">
        <label htmlFor="mem-mohalla" className="font-medium">पता / रोड नं.</label>
        <input id="mem-mohalla" value={f.mohalla} onChange={(e) => setF({ ...f, mohalla: e.target.value })} placeholder="जैसे रोड नं. 24, राजीव नगर" className="input" />
      </div>
      {mode === "renew" && (
        <div className="grid gap-1.5 max-w-xs">
          <label htmlFor="mem-amount" className="font-medium">जमा करने की राशि ₹</label>
          <input id="mem-amount" type="number" inputMode="numeric" min={1} value={f.amount} onChange={(e) => setF({ ...f, amount: e.target.value })} className="input tabular-nums" />
        </div>
      )}
      {error && <p role="alert" className="text-maroon font-semibold">{error}</p>}
      <button disabled={busy} className="btn btn-primary w-full min-h-14 text-[1.12rem] disabled:opacity-60">
        {busy ? "आवेदन भेजा जा रहा है…" : `${rupees(amount || 0)} सहयोग के लिए आगे बढ़ें`}
      </button>
      <p className="text-ink-soft text-[0.92rem]">भुगतान की पुष्टि होने पर आपका नाम सदस्य सूची में जुड़ जाएगा।</p>
    </form>
  );
}
