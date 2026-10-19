"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { rupees } from "@/lib/contact";
import { UpiQr, UtrField, submitUtr, utrError } from "./UpiPay";
import { ArrowLeft } from "./Icons";

type Step = "choice" | "name" | "phone" | "pay" | "utr";
const ORDER: Step[] = ["choice", "name", "phone", "pay", "utr"];

// One question per screen: choice → name → mobile → scan QR → transaction ID → receipt.
// Enter moves forward; the receipt is issued only after a transaction ID is given.
export function PayWizard({
  choiceTitle,
  choice,
  validateChoice,
  amount,
  purpose,
  body,
  allowAnonymous,
}: {
  choiceTitle: string;
  choice: React.ReactNode;
  validateChoice: () => string | null;
  amount: number;
  purpose: string;
  body: Record<string, unknown>;
  allowAnonymous?: boolean;
}) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("choice");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [mohalla, setMohalla] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [utr, setUtr] = useState("");
  const [payment, setPayment] = useState<{ id: string; receipt: string; amount: number } | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const idx = ORDER.indexOf(step);
  const go = (s: Step) => {
    setError("");
    setStep(s);
    window.scrollTo({ top: document.getElementById("pay-wizard")!.getBoundingClientRect().top + window.scrollY - 16, behavior: "smooth" });
  };
  const back = () => {
    if (step === "pay" || step === "utr") {
      // details may change, so a fresh receipt is made next time
      if (step === "pay") setPayment(null);
    }
    go(ORDER[Math.max(0, idx - 1)]);
  };

  const next = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === "choice") {
      const err = validateChoice();
      return err ? setError(err) : go("name");
    }
    if (step === "name") return name.trim() ? go("phone") : setError("कृपया अपना नाम लिखें।");
    if (step === "phone") {
      if (phone.replace(/\D/g, "").length < 10) return setError("कृपया 10 अंकों का मोबाइल नंबर लिखें।");
      if (payment && payment.amount === amount) return go("pay");
      setBusy(true);
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...body, name, phone, mohalla, anonymous, amount }),
      }).catch(() => null);
      setBusy(false);
      if (!res?.ok) {
        const msg = res ? (await res.json().catch(() => ({}))).error : null;
        return setError(msg || "आगे नहीं बढ़ सके। इंटरनेट जाँचकर फिर कोशिश करें।");
      }
      setPayment({ ...(await res.json()), amount });
      return go("pay");
    }
    if (step === "pay") return go("utr");
    if (step === "utr" && payment) {
      const err = utrError(utr);
      if (err) return setError(err);
      setBusy(true);
      const msg = await submitUtr(payment.id, utr);
      setBusy(false);
      if (msg) return setError(msg);
      router.push(`/rasid/${payment.id}`);
    }
  };

  const TITLES: Record<Step, string> = {
    choice: choiceTitle,
    name: "आपका नाम",
    phone: "आपका मोबाइल नंबर",
    pay: "QR स्कैन करके भुगतान करें",
    utr: "भुगतान हो गया? लेनदेन संख्या लिखें",
  };
  const BUTTON: Record<Step, string> = {
    choice: amount ? `${rupees(amount)} · आगे बढ़ें` : "आगे बढ़ें",
    name: "आगे बढ़ें",
    phone: busy ? "QR बन रहा है…" : "भुगतान के लिए आगे बढ़ें",
    pay: "भुगतान कर दिया, आगे बढ़ें",
    utr: busy ? "रसीद बन रही है…" : "रसीद लें",
  };

  return (
    <div id="pay-wizard" className="bg-card rounded-2xl border border-line shadow-[0_10px_30px_rgba(35,23,15,0.06)] overflow-hidden">
      <div className="px-5 md:px-8 pt-4 grid gap-2">
        <div className="flex items-center justify-between gap-3 min-h-10">
          {idx > 0 ? (
            <button type="button" onClick={back} className="inline-flex items-center gap-1.5 text-maroon font-semibold">
              <ArrowLeft width={20} height={20} /> पीछे
            </button>
          ) : (
            <span />
          )}
          <span className="text-ink-soft text-[0.92rem] tabular-nums">
            चरण {idx + 1} / {ORDER.length}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-paper overflow-hidden" aria-hidden="true">
          <div className="h-full bg-saffron transition-[width] duration-300" style={{ width: `${((idx + 1) / ORDER.length) * 100}%` }} />
        </div>
      </div>

      <form onSubmit={next} noValidate className="p-5 md:p-8 grid gap-5">
        <h2 className="text-[1.35rem] md:text-[1.7rem] leading-snug">{TITLES[step]}</h2>

        {step === "choice" && choice}

        {step === "name" && (
          <div className="grid gap-3">
            <label htmlFor="pw-name" className="sr-only">नाम</label>
            <input id="pw-name" autoFocus autoComplete="name" enterKeyHint="next" value={name} onChange={(e) => { setName(e.target.value); setError(""); }} placeholder="पूरा नाम" className="input text-[1.2rem] min-h-14" />
            {allowAnonymous && (
              <label className="flex items-center gap-3 cursor-pointer w-fit">
                <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} className="w-6 h-6 accent-maroon" />
                <span>सहयोगी सूची में मेरा नाम न दिखाएँ</span>
              </label>
            )}
          </div>
        )}

        {step === "phone" && (
          <div className="grid gap-4">
            <div className="grid gap-1.5">
              <label htmlFor="pw-phone" className="sr-only">मोबाइल नंबर</label>
              <input id="pw-phone" autoFocus type="tel" inputMode="numeric" autoComplete="tel" enterKeyHint="next" maxLength={14} value={phone} onChange={(e) => { setPhone(e.target.value); setError(""); }} placeholder="10 अंकों का नंबर" className="input text-[1.3rem] min-h-14 tabular-nums tracking-wide" />
              <p className="text-ink-soft text-[0.92rem]">रसीद और पुष्टि इसी नंबर पर WhatsApp से भेजी जा सकती है।</p>
            </div>
            <div className="grid gap-1.5">
              <label htmlFor="pw-mohalla" className="font-medium">पता / रोड नं. <span className="text-ink-soft font-normal">(वैकल्पिक)</span></label>
              <input id="pw-mohalla" value={mohalla} onChange={(e) => setMohalla(e.target.value)} placeholder="जैसे रोड नं. 24, राजीव नगर" className="input" />
            </div>
          </div>
        )}

        {step === "pay" && payment && <UpiQr amount={payment.amount} receipt={payment.receipt} purpose={purpose} />}

        {step === "utr" && payment && <UtrField id="pw-utr" value={utr} onChange={(v) => { setUtr(v); setError(""); }} autoFocus />}

        {error && <p role="alert" className="text-maroon font-semibold text-[1.02rem]">{error}</p>}

        <button disabled={busy} className="btn btn-primary w-full min-h-14 text-[1.12rem] disabled:opacity-60">
          {BUTTON[step]}
        </button>
        {step === "pay" && <p className="text-ink-soft text-[0.92rem] text-center">भुगतान के बाद अगले चरण में लेनदेन संख्या लिखें, तभी रसीद बनेगी।</p>}
      </form>
    </div>
  );
}
