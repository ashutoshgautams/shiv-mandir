"use client";

import { useMemo, useRef, useState } from "react";
import { CATEGORIES, PUJAS, type Puja } from "@/lib/puja";
import { MANDIR } from "@/lib/mandir";
import { telHref, whatsappHref } from "@/lib/contact";
import { CloseIcon, PhoneIcon, SearchIcon, WhatsAppIcon } from "./Icons";

export function PujaBrowser() {
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const [booking, setBooking] = useState<Puja | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  const groups = useMemo(() => {
    const term = q.trim();
    const t = term.toLowerCase();
    const match = (p: Puja) => !t || [p.name, p.en, p.alias ?? "", p.about, ...(p.options ?? [])].join(" ").toLowerCase().includes(t);
    return CATEGORIES.filter((c) => cat === "all" || c.id === cat)
      .map((c) => ({ c, items: PUJAS.filter((p) => p.cat === c.id && match(p)) }))
      .filter((g) => g.items.length);
  }, [cat, q]);

  const open = (p: Puja) => {
    setBooking(p);
    dialog.current?.showModal();
  };

  const tabs = [{ id: "all", name: "सभी पूजा" }, ...CATEGORIES];

  return (
    <>
      <div className="sticky top-0 md:top-[4.5rem] z-30 bg-paper/95 backdrop-blur border-b border-line">
        <div className="wrap py-3 grid gap-3">
          <label className="relative block max-w-xl">
            <span className="sr-only">पूजा खोजें</span>
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" />
            <input
              id="puja-search"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="पूजा खोजें: रुद्राभिषेक / Rudrabhishek"
              className="w-full h-13 pl-12 pr-4 rounded-xl border-2 border-line bg-card text-[1.05rem] focus:border-maroon outline-none"
            />
          </label>
          <div role="tablist" aria-label="पूजा की श्रेणी" className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                role="tab"
                type="button"
                aria-selected={cat === t.id}
                onClick={() => setCat(t.id)}
                className={`shrink-0 h-11 px-4 rounded-full border-2 font-semibold transition-colors ${
                  cat === t.id ? "bg-maroon border-maroon text-white" : "bg-card border-line text-ink hover:border-maroon"
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="wrap py-5 md:py-8 grid gap-8 md:gap-10">
        {groups.length === 0 && (
          <p className="p-8 text-center bg-card rounded-2xl border border-dashed border-line text-ink-soft">
            “{q}” नाम की कोई पूजा नहीं मिली। दूसरा शब्द लिखकर देखें, या मंदिर कार्यालय से पूछें।
          </p>
        )}
        {groups.map(({ c, items }) => (
          <section key={c.id} aria-labelledby={`cat-${c.id}`} className="grid gap-4">
            <h2 id={`cat-${c.id}`} className="text-[1.7rem] text-maroon flex items-baseline gap-3 border-b-2 border-gold/50 pb-2">
              {c.name}
              <span className="font-sans text-[0.95rem] text-ink-soft">{items.length} सेवाएँ</span>
            </h2>
            <ul className="grid gap-3">
              {items.map((p) => (
                <li
                  key={p.name}
                  className="bg-card rounded-xl border border-line p-3.5 md:p-5 grid gap-2.5 md:gap-3 md:grid-cols-[1fr_auto] md:items-center"
                >
                  <div className="grid gap-1 min-w-0">
                    <h3 className="text-[1.3rem] md:text-[1.35rem] leading-snug">
                      {p.name} <span lang="en" className="block font-sans text-[0.88rem] text-ink-soft font-medium">{p.en}</span>
                    </h3>
                    <p className="text-ink-soft">{p.about}</p>
                    {(p.options || p.duration) && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {p.duration && (
                          <span className="text-[0.9rem] px-2.5 py-0.5 rounded-md bg-ink text-white">{p.duration}</span>
                        )}
                        {p.options?.map((o) => (
                          <span key={o} className="text-[0.9rem] px-2.5 py-0.5 rounded-md bg-saffron-soft text-ink border border-line">
                            {o}
                          </span>
                        ))}
                      </div>
                    )}
                    {p.note && <p className="text-maroon font-medium text-[0.95rem]">ध्यान दें: {p.note}</p>}
                  </div>
                  <button type="button" onClick={() => open(p)} className="btn btn-outline w-full md:w-auto">
                    बुकिंग करें
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <BookingDialog ref={dialog} puja={booking} onClose={() => setBooking(null)} />
    </>
  );
}

function BookingDialog({
  ref,
  puja,
  onClose,
}: {
  ref: React.RefObject<HTMLDialogElement | null>;
  puja: Puja | null;
  onClose: () => void;
}) {
  const [form, setForm] = useState({ name: "", phone: "", date: "", option: "", note: "" });
  const [error, setError] = useState("");
  const [ready, setReady] = useState<string | null>(null);
  const [bookingRef, setBookingRef] = useState<string | null>(null);

  const close = () => {
    ref.current?.close();
  };

  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return setError("कृपया अपना नाम लिखें।");
    if (form.phone.replace(/\D/g, "").length < 10) return setError("कृपया 10 अंकों का मोबाइल नंबर लिखें।");
    setError("");
    setSaving(true);
    // Save the booking for the committee's register; WhatsApp still works if saving fails.
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ puja: puja?.name, ...form }),
    }).catch(() => null);
    const ref: string | null = res?.ok ? (await res.json()).ref : null;
    setSaving(false);
    const date = form.date
      ? new Intl.DateTimeFormat("hi-IN", { day: "numeric", month: "long", year: "numeric" }).format(new Date(form.date))
      : "तिथि बाद में तय करेंगे";
    const text = [
      `जय भोलेनाथ।`,
      ref && `बुकिंग संख्या: ${ref}`,
      `पूजा: ${puja?.name}${form.option ? ` (${form.option})` : ""}`,
      `नाम: ${form.name}`,
      `मोबाइल: ${form.phone}`,
      `इच्छित तिथि: ${date}`,
      form.note && `निवेदन: ${form.note}`,
      `कृपया समय और दक्षिणा की पुष्टि करें।`,
    ]
      .filter(Boolean)
      .join("\n");
    setReady(text);
    setBookingRef(ref);
  };

  const wa = ready ? whatsappHref(ready) : null;

  return (
    <dialog
      ref={ref}
      onClose={() => {
        setReady(null);
        setBookingRef(null);
        setError("");
        onClose();
      }}
      aria-labelledby="booking-title"
      className="m-auto w-[min(34rem,calc(100vw-2rem))] max-h-[calc(100dvh-2rem)] rounded-2xl p-0 bg-card text-ink backdrop:bg-ink/50 shadow-2xl"
    >
      <div className="p-5 md:p-7 grid gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="eyebrow">पूजा बुकिंग</span>
            <h2 id="booking-title" className="text-[1.7rem]">{puja?.name}</h2>
          </div>
          <button type="button" onClick={close} aria-label="बंद करें" className="w-11 h-11 grid place-items-center rounded-full border-2 border-line hover:border-maroon shrink-0">
            <CloseIcon />
          </button>
        </div>

        {!ready ? (
          <form onSubmit={submit} className="grid gap-4" noValidate>
            {puja?.options && (
              <Field label="पूजा का प्रकार">
                <select
                  id="bk-option"
                  value={form.option}
                  onChange={(e) => setForm({ ...form, option: e.target.value })}
                  className="input"
                >
                  <option value="">चुनें (वैकल्पिक)</option>
                  {puja.options.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </Field>
            )}
            <Field label="आपका नाम">
              <input id="bk-name" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
            </Field>
            <Field label="मोबाइल नंबर">
              <input id="bk-phone" type="tel" inputMode="numeric" autoComplete="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input" />
            </Field>
            <Field label="किस दिन पूजा करानी है">
              <input id="bk-date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input" />
            </Field>
            <Field label="कोई विशेष बात (वैकल्पिक)">
              <textarea id="bk-note" rows={2} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} className="input py-3" />
            </Field>
            {error && <p role="alert" className="text-maroon font-semibold">{error}</p>}
            <button type="submit" disabled={saving} className="btn btn-primary w-full disabled:opacity-60">{saving ? "दर्ज हो रही है…" : "बुकिंग दर्ज करें"}</button>
          </form>
        ) : (
          <div className="grid gap-4">
            {bookingRef ? (
              <p className="text-[1.05rem] bg-leaf-soft border border-leaf/30 rounded-xl p-3">
                आपकी बुकिंग दर्ज हो गई, संख्या <strong>{bookingRef}</strong>। पुष्टि के लिए यह संदेश WhatsApp पर भेजें।
              </p>
            ) : (
              <p className="text-[1.05rem]">आपका संदेश तैयार है। इसे मंदिर कार्यालय को WhatsApp पर भेजें या सीधे फ़ोन करें।</p>
            )}
            <pre className="whitespace-pre-wrap font-sans bg-paper border border-line rounded-xl p-4 text-[1rem]">{ready}</pre>
            {wa ? (
              <a href={wa} target="_blank" rel="noopener" className="btn btn-primary w-full">
                <WhatsAppIcon /> WhatsApp पर भेजें
              </a>
            ) : (
              <p className="text-ink-soft text-[0.95rem] bg-saffron-soft rounded-lg p-3">WhatsApp नंबर समिति द्वारा जोड़ा जाएगा।</p>
            )}
            {telHref ? (
              <a href={telHref} className="btn btn-outline w-full">
                <PhoneIcon /> फ़ोन करें: {MANDIR.phoneDisplay}
              </a>
            ) : null}
            <button type="button" onClick={() => setReady(null)} className="underline text-ink-soft justify-self-center">
              जानकारी बदलें
            </button>
          </div>
        )}
      </div>
    </dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactElement<{ id: string }> }) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={children.props.id} className="font-semibold">
        {label}
      </label>
      {children}
    </div>
  );
}
