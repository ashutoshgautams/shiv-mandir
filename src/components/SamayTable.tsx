"use client";

import { useState, useSyncExternalStore } from "react";
import { SEASONS, hiTime, patnaNow, seasonForMonth } from "@/lib/samay";

const noop = () => () => {};
const currentSeason = () => seasonForMonth(patnaNow().month).id;

// Phones: one season at a time with tabs (current season first). Desktop: both side by side.
export function SamayTable() {
  const now = useSyncExternalStore(noop, currentSeason, () => SEASONS[1].id);
  const [chosen, setChosen] = useState<string | null>(null);
  const active = chosen ?? now;

  return (
    <div className="grid gap-3">
      <div role="tablist" aria-label="मौसम" className="md:hidden grid grid-cols-2 rounded-xl border-2 border-line p-1 bg-card">
        {SEASONS.map((s) => (
          <button
            key={s.id}
            role="tab"
            type="button"
            aria-selected={active === s.id}
            onClick={() => setChosen(s.id)}
            className={`h-11 rounded-lg font-semibold ${active === s.id ? "bg-maroon text-white" : "text-ink"}`}
          >
            {s.title} {s.id === now && <span className="text-[0.8rem] font-normal">(अभी)</span>}
          </button>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        {SEASONS.map((s) => (
          <div key={s.id} className={`bg-card rounded-2xl border border-line overflow-hidden ${active === s.id ? "" : "hidden md:block"}`}>
            <div className="px-4 md:px-5 py-3 md:py-3.5 bg-saffron-soft border-b border-line flex items-baseline justify-between gap-3">
              <h3 className="text-[1.25rem] md:text-[1.35rem]">
                {s.title}
                {s.id === now && <span className="ml-2 align-middle text-[0.75rem] px-2 py-0.5 rounded bg-maroon text-white font-sans font-semibold">अभी लागू</span>}
              </h3>
              <span className="text-ink-soft text-[0.92rem]">{s.range}</span>
            </div>
            <table className="w-full text-[1rem] md:text-[1.05rem]">
              <tbody>
                {s.rows.map((r) => (
                  <tr key={r.label} className="border-b border-line last:border-0">
                    <th scope="row" className="text-left font-normal px-4 md:px-5 py-2.5 md:py-3">
                      {r.aarti && <span aria-hidden="true" className="inline-block w-2 h-2 rounded-full bg-saffron mr-2 align-middle" />}
                      {r.label}
                    </th>
                    <td className="text-right font-semibold px-4 md:px-5 py-2.5 md:py-3 tabular-nums">
                      {hiTime(r.time)}
                      {r.until && <> – {hiTime(r.until)}</>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
