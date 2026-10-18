"use client";

import { useMemo, useState } from "react";
import type { Member } from "@/lib/records";
import { recordMemberPayment, saveMember } from "./actions";
import { ActionForm, DeleteMemberButton } from "./ui";

const rs = (n: number) => "₹" + n.toLocaleString("en-IN");
const duesOf = (m: Member) => Math.max(0, m.fee - m.paid);

type Sort = "name" | "dues";

// Read-only member register; one row at a time opens for editing.
export function MembersTable({ members, initialFilter }: { members: Member[]; initialFilter: string }) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>(initialFilter === "dues" ? "dues" : "name");
  const [open, setOpen] = useState<string | null>(null);

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    let list = members.filter((m) => !term || m.name.toLowerCase().includes(term) || m.phone.includes(term));
    if (initialFilter === "dues") list = list.filter((m) => duesOf(m) > 0);
    if (initialFilter === "applied") list = list.filter((m) => m.status === "applied");
    return [...list].sort((a, b) => (sort === "dues" ? duesOf(b) - duesOf(a) : a.name.localeCompare(b.name, "hi")));
  }, [members, q, sort, initialFilter]);

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap gap-3 items-center">
        <label className="relative flex-1 min-w-[14rem] max-w-md">
          <span className="sr-only">सदस्य खोजें</span>
          <input
            id="member-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="नाम या मोबाइल से खोजें"
            className="input rounded-full"
          />
        </label>
        <div role="group" aria-label="क्रम" className="flex rounded-full border-2 border-line p-0.5 bg-card">
          {(
            [
              ["name", "नाम से"],
              ["dues", "बकाया अधिक पहले"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              aria-pressed={sort === id}
              onClick={() => setSort(id)}
              className={`px-3.5 py-1.5 rounded-full text-[0.92rem] font-semibold ${sort === id ? "bg-ink text-white" : "text-ink"}`}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="text-ink-soft text-[0.95rem]">{rows.length} सदस्य</span>
      </div>

      <div className="bg-card rounded-2xl border border-line overflow-hidden">
        {/* Column header (desktop) */}
        <div className="hidden md:grid grid-cols-[2.5rem_minmax(0,2.2fr)_minmax(0,1.2fr)_6rem_6rem_7.5rem_5.5rem] gap-3 px-4 py-2.5 bg-paper border-b border-line text-ink-soft text-[0.85rem] font-semibold">
          <span>#</span>
          <span>नाम</span>
          <span>मोबाइल</span>
          <span className="text-right">शुल्क</span>
          <span className="text-right">जमा</span>
          <span className="text-right">बकाया</span>
          <span />
        </div>

        {rows.length === 0 && <p className="p-6 text-center text-ink-soft">कोई सदस्य नहीं मिला।</p>}

        <ul className="divide-y divide-line">
          {rows.map((m, i) => {
            const d = duesOf(m);
            const isOpen = open === m.id;
            return (
              <li key={m.id} className={isOpen ? "bg-saffron-soft/50" : ""}>
                <div className="grid grid-cols-[1fr_auto] md:grid-cols-[2.5rem_minmax(0,2.2fr)_minmax(0,1.2fr)_6rem_6rem_7.5rem_5.5rem] gap-x-3 gap-y-1 px-4 py-3 items-center">
                  <span className="hidden md:block text-ink-soft tabular-nums">{i + 1}</span>
                  <span className="min-w-0">
                    <span className="font-semibold block truncate">{m.name}</span>
                    {m.status === "applied" && (
                      <span className="text-[0.78rem] px-2 py-0.5 rounded bg-saffron text-[#2a1606] font-semibold">नया आवेदन</span>
                    )}
                    <span className="md:hidden block text-ink-soft text-[0.9rem] tabular-nums">
                      शुल्क {rs(m.fee)} · जमा {rs(m.paid)}
                      {m.phone && <> · {m.phone}</>}
                    </span>
                  </span>
                  <span className="hidden md:block text-ink-soft tabular-nums truncate">
                    {m.phone ? <a href={`tel:+91${m.phone}`} className="text-ink no-underline hover:text-maroon">{m.phone}</a> : "—"}
                  </span>
                  <span className="hidden md:block text-right tabular-nums">{rs(m.fee)}</span>
                  <span className="hidden md:block text-right tabular-nums">{rs(m.paid)}</span>
                  <span className="flex items-center justify-end gap-2 md:contents">
                    <span className="md:text-right">
                      {d > 0 ? (
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-[#fbe9e7] text-maroon font-bold tabular-nums text-[0.95rem]">{rs(d)}</span>
                      ) : (
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-leaf-soft text-leaf font-semibold text-[0.9rem]">पूरा जमा</span>
                      )}
                    </span>
                    <span className="md:text-right">
                      <button
                        type="button"
                        onClick={() => setOpen(isOpen ? null : m.id)}
                        aria-expanded={isOpen}
                        className="px-3 py-1.5 rounded-lg border-2 border-line hover:border-maroon text-maroon font-semibold text-[0.92rem]"
                      >
                        {isOpen ? "बंद करें" : "बदलें"}
                      </button>
                    </span>
                  </span>
                </div>

                {isOpen && (
                  <div className="px-4 pb-4 grid gap-4 md:grid-cols-[1fr_1.6fr]">
                    <ActionForm action={recordMemberPayment} hidden={{ id: m.id }} className="bg-card rounded-xl border border-line p-4 grid gap-2 content-start self-start">
                      <span className="font-semibold">जमा जोड़ें</span>
                      <span className="text-ink-soft text-[0.9rem]">सदस्य से अभी मिली राशि लिखें, कुल जमा अपने-आप बढ़ जाएगा।</span>
                      <div className="flex gap-2">
                        <input name="amount" type="number" inputMode="numeric" min={1} defaultValue={d || ""} aria-label="राशि" className="input min-h-11 tabular-nums" />
                        <button className="btn btn-primary min-h-11 py-2 shrink-0">जोड़ें</button>
                      </div>
                    </ActionForm>

                    <div className="bg-card rounded-xl border border-line p-4 grid gap-3">
                    <ActionForm action={saveMember} hidden={{ id: m.id }} className="grid grid-cols-2 gap-3 items-end">
                      <span className="col-span-2 font-semibold">जानकारी बदलें</span>
                      <Field label="नाम" name="name" value={m.name} wide />
                      <Field label="मोबाइल" name="phone" value={m.phone} />
                      <label className="grid gap-1">
                        <span className="text-[0.85rem] font-medium">स्थिति</span>
                        <select name="status" defaultValue={m.status} className="input min-h-11 py-1">
                          <option value="active">सक्रिय</option>
                          <option value="applied">नया आवेदन</option>
                        </select>
                      </label>
                      <Field label="वार्षिक शुल्क ₹" name="fee" value={String(m.fee)} number />
                      <Field label="कुल जमा ₹" name="paid" value={String(m.paid)} number />
                      <div className="col-span-2 flex justify-end">
                        <button className="btn btn-primary min-h-11 py-2">सहेजें</button>
                      </div>
                    </ActionForm>
                    <div className="border-t border-line pt-2 flex justify-start">
                      <DeleteMemberButton id={m.id} name={m.name} />
                    </div>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function Field({ label, name, value, number, wide }: { label: string; name: string; value: string; number?: boolean; wide?: boolean }) {
  return (
    <label className={`grid gap-1 min-w-0 ${wide ? "col-span-2" : ""}`}>
      <span className="text-[0.85rem] font-medium">{label}</span>
      <input
        name={name}
        defaultValue={value}
        type={number ? "number" : "text"}
        inputMode={number ? "numeric" : undefined}
        className="input min-h-11 py-1"
      />
    </label>
  );
}
