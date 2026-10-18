"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { templeStatus, hiTime, waitText } from "@/lib/samay";
import { DAY_DEITY, getDeity } from "@/lib/deities";
import { ClockIcon, DiyaIcon } from "./Icons";

type State = ReturnType<typeof templeStatus> & { dateText: string };

// Live "today" panel: open/closed, next aarti, and the deity of the day. Computed in Patna time.
export function TodayStrip() {
  const [s, setS] = useState<State | null>(null);

  useEffect(() => {
    const tick = () => {
      let dateText = "आज";
      try {
        dateText = new Intl.DateTimeFormat("hi-IN", { weekday: "long", day: "numeric", month: "long", timeZone: "Asia/Kolkata" }).format(new Date());
      } catch {}
      setS({ ...templeStatus(), dateText });
    };
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  const deity = getDeity(s ? DAY_DEITY[s.now.weekday] ?? "shivling" : "shivling")!;

  return (
    <section aria-label="आज की जानकारी" className="wrap mt-8">
      <div className="grid md:grid-cols-3 bg-card rounded-2xl border border-line shadow-[0_10px_30px_rgba(35,23,15,0.08)] divide-y md:divide-y-0 md:divide-x divide-line">
        <div className="p-5 md:p-6 grid gap-1">
          <span className="text-ink-soft text-[0.95rem]">{s?.dateText ?? "आज"}</span>
          <span className="flex items-center gap-2.5 text-[1.2rem] font-semibold">
            <span
              aria-hidden="true"
              className={`w-3 h-3 rounded-full shrink-0 ${s ? (s.isOpen ? "bg-leaf" : "bg-maroon") : "bg-line"}`}
            />
            {s?.statusText ?? "समय देख रहे हैं…"}
          </span>
        </div>
        <div className="p-5 md:p-6 grid gap-1">
          <span className="text-ink-soft text-[0.95rem] flex items-center gap-2">
            <ClockIcon width={18} height={18} /> अगली आरती
          </span>
          <span className="text-[1.2rem] font-semibold">
            {s ? (
              <>
                {s.next.label}, {hiTime(s.next.time)}{" "}
                <span className="font-normal text-ink-soft">({waitText(s.wait)})</span>
              </>
            ) : (
              "…"
            )}
          </span>
        </div>
        <Link href={`/darshan/${deity.slug}`} className="p-5 md:p-6 grid gap-1 no-underline text-ink hover:bg-saffron-soft rounded-b-2xl md:rounded-bl-none md:rounded-r-2xl transition-colors">
          <span className="text-ink-soft text-[0.95rem] flex items-center gap-2">
            <DiyaIcon width={18} height={18} /> आज का विशेष दर्शन
          </span>
          <span className="text-[1.2rem] font-semibold text-maroon">{deity.name} →</span>
        </Link>
      </div>
    </section>
  );
}
