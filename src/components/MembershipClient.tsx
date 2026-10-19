"use client";

import { useState } from "react";
import { MEMBERSHIP } from "@/lib/mandir";
import { rupees } from "@/lib/contact";
import { PayWizard } from "./PayWizard";

export function MembershipClient() {
  const [mode, setMode] = useState<"new" | "renew">("new");
  const [custom, setCustom] = useState(String(MEMBERSHIP.fee));

  const amount = mode === "new" ? MEMBERSHIP.fee : Math.round(Number(custom));
  const purpose = mode === "new" ? `नई सदस्यता ${MEMBERSHIP.year}` : `सदस्यता शुल्क ${MEMBERSHIP.year}`;

  return (
    <PayWizard
      choiceTitle="आप क्या करना चाहते हैं"
      amount={amount || 0}
      purpose={purpose}
      body={{ type: "membership", memberMode: mode }}
      validateChoice={() => (!amount || amount < 1 ? "कृपया राशि लिखें।" : null)}
      choice={
        <div className="grid gap-4">
          <div role="radiogroup" aria-label="सदस्यता का प्रकार" className="grid sm:grid-cols-2 gap-3">
            {(
              [
                ["new", "नया सदस्य बनना है", `वार्षिक सहयोग ${rupees(MEMBERSHIP.fee)}`],
                ["renew", "पहले से सदस्य हूँ", "बकाया या वार्षिक शुल्क जमा करना है"],
              ] as const
            ).map(([id, title, sub]) => (
              <label
                key={id}
                className={`grid gap-0.5 p-4 rounded-xl border-2 cursor-pointer has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-saffron ${
                  mode === id ? "border-maroon bg-saffron-soft" : "border-line hover:border-gold"
                }`}
              >
                <input type="radio" name="mode" id={`mm-${id}`} checked={mode === id} onChange={() => setMode(id)} className="sr-only" />
                <span className="font-semibold text-[1.08rem]">{title}</span>
                <span className="text-ink-soft text-[0.92rem]">{sub}</span>
              </label>
            ))}
          </div>
          {mode === "renew" && (
            <div className="grid gap-1.5 max-w-xs">
              <label htmlFor="mem-amount" className="font-medium">जमा करने की राशि (₹)</label>
              <input id="mem-amount" type="number" inputMode="numeric" min={1} value={custom} onChange={(e) => setCustom(e.target.value)} className="input tabular-nums min-h-14 text-[1.15rem]" />
            </div>
          )}
          <p className="text-ink-soft text-[0.92rem]">भुगतान की पुष्टि होने पर आपका नाम सदस्य सूची में जुड़ जाएगा।</p>
        </div>
      }
    />
  );
}
