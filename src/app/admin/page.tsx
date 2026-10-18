import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { adminConfigured, isAdmin } from "@/lib/auth";
import { storeDiagnostics, storeMode } from "@/lib/store";
import { ABHIYAN, MANDIR, MEMBERSHIP } from "@/lib/mandir";
import { rupees } from "@/lib/contact";
import { SITE_URL } from "@/lib/site";
import {
  KIND_LABEL,
  STATUS_LABEL,
  dues,
  listBookings,
  listMembers,
  listPayments,
  type Booking,
  type Member,
  type Payment,
  type PaymentKind,
} from "@/lib/records";
import {
  addMember,
  addOfflinePayment,
  changeBookingStatus,
  changePaymentStatus,
  importMemberCsv,
  logout,
} from "./actions";
import { ActionForm, LoginForm } from "./ui";
import { MembersTable } from "./MembersTable";

export const metadata: Metadata = { title: "समिति एडमिन", robots: { index: false, follow: false } };

const TABS = [
  { id: "saransh", label: "सारांश" },
  { id: "durga", label: ABHIYAN.title },
  { id: "dan", label: "सामान्य दान" },
  { id: "booking", label: "पूजा बुकिंग" },
  { id: "sadasya", label: "सदस्य" },
] as const;

export default function AdminPage(props: PageProps<"/admin">) {
  return (
    <div className="wrap py-8 md:py-10 grid gap-6">
      <Suspense fallback={<p className="text-ink-soft">लोड हो रहा है…</p>}>
        <Admin searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}

async function Admin({ searchParams }: { searchParams: PageProps<"/admin">["searchParams"] }) {
  await connection(); // always decide at request time, never bake the admin state into the build
  if (!adminConfigured()) {
    return (
      <Panel title="एडमिन अभी चालू नहीं है">
        <p>Vercel → Project → Settings → Environment Variables में <code className="font-semibold">ADMIN_PASSWORD</code> जोड़ें और दोबारा deploy करें।</p>
      </Panel>
    );
  }
  if (!(await isAdmin())) {
    return (
      <Panel title="समिति एडमिन लॉगिन">
        <p className="text-ink-soft">चंदा, बुकिंग और सदस्यता का हिसाब देखने के लिए पासवर्ड डालें।</p>
        <LoginForm />
      </Panel>
    );
  }
  if (storeMode === "none") {
    return (
      <Panel title="डेटाबेस जुड़ा नहीं है">
        <p>Vercel → Storage → <strong>Upstash for Redis</strong> बनाकर इस प्रोजेक्ट से जोड़ें (Production चुनें), फिर दोबारा deploy करें। तब तक चंदा और बुकिंग सहेजे नहीं जा सकते।</p>
        <p className="text-ink-soft text-[0.95rem]">
          मिले हुए वेरिएबल: {storeDiagnostics().seen.join(", ") || "कोई नहीं"}
        </p>
      </Panel>
    );
  }

  const sp = await searchParams;
  const tab = (typeof sp.tab === "string" ? sp.tab : "saransh") as (typeof TABS)[number]["id"];
  const status = typeof sp.status === "string" ? sp.status : "";
  const [payments, bookings, members] = await Promise.all([listPayments(), listBookings(), listMembers()]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="eyebrow">समिति एडमिन</span>
          <h1 className="text-[2rem]">हिसाब-किताब</h1>
        </div>
        <form action={logout}>
          <button className="btn btn-outline">लॉग आउट</button>
        </form>
      </div>

      <nav aria-label="एडमिन टैब" className="flex gap-2 overflow-x-auto pb-1 border-b border-line">
        {TABS.map((t) => (
          <Link
            key={t.id}
            href={`/admin?tab=${t.id}`}
            aria-current={tab === t.id ? "page" : undefined}
            className={`shrink-0 px-4 py-2.5 rounded-t-lg font-semibold no-underline border-b-4 ${
              tab === t.id ? "border-maroon text-maroon bg-card" : "border-transparent text-ink-soft hover:text-ink"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      {tab === "saransh" && <Summary payments={payments} bookings={bookings} members={members} />}
      {tab === "durga" && <PaymentsTab kind="durga-puja-2026" payments={payments} status={status} tab={tab} />}
      {tab === "dan" && <PaymentsTab kind="general" payments={payments} status={status} tab={tab} />}
      {tab === "booking" && <BookingsTab bookings={bookings} />}
      {tab === "sadasya" && <MembersTab members={members} payments={payments} status={status} />}
    </>
  );
}

// ── Summary ──────────────────────────────────────────────────────
function money(list: Payment[], s: Payment["status"]) {
  const l = list.filter((p) => p.status === s);
  return { sum: l.reduce((a, p) => a + p.amount, 0), n: l.length };
}

function Summary({ payments, bookings, members }: { payments: Payment[]; bookings: Booking[]; members: Member[] }) {
  const kinds: { kind: PaymentKind; tab: string }[] = [
    { kind: "durga-puja-2026", tab: "durga" },
    { kind: "general", tab: "dan" },
    { kind: "membership", tab: "sadasya" },
  ];
  const fee = members.reduce((a, m) => a + m.fee, 0);
  const paid = members.reduce((a, m) => a + m.paid, 0);
  return (
    <div className="grid gap-5">
      <div className="grid md:grid-cols-3 gap-4">
        {kinds.map(({ kind, tab }) => {
          const list = payments.filter((p) => p.kind === kind);
          const c = money(list, "confirmed");
          const pe = money(list, "pending");
          return (
            <Link key={kind} href={`/admin?tab=${tab}`} className="bg-card rounded-2xl border border-line p-5 grid gap-2 no-underline text-ink hover:border-gold">
              <span className="eyebrow">{KIND_LABEL[kind]} (ऑनलाइन + दर्ज)</span>
              <span className="text-[1.9rem] font-bold tabular-nums leading-none">{rupees(c.sum)}</span>
              <span className="text-ink-soft">{c.n} पुष्ट भुगतान</span>
              <span className={`font-semibold ${pe.n ? "text-saffron" : "text-ink-soft"}`}>
                {pe.n} पुष्टि लंबित · {rupees(pe.sum)}
              </span>
            </Link>
          );
        })}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Link href="/admin?tab=sadasya" className="bg-card rounded-2xl border border-line p-5 grid gap-2 no-underline text-ink hover:border-gold">
          <span className="eyebrow">सदस्यता {MEMBERSHIP.year}</span>
          <span className="text-[1.5rem] font-bold">{members.filter((m) => m.status === "active").length} सदस्य</span>
          <span className="tabular-nums">कुल शुल्क {rupees(fee)} · जमा {rupees(paid)} · <strong className="text-maroon">बकाया {rupees(Math.max(0, fee - paid))}</strong></span>
          <span className="text-ink-soft">{members.filter((m) => m.status === "applied").length} नए आवेदन</span>
        </Link>
        <Link href="/admin?tab=booking" className="bg-card rounded-2xl border border-line p-5 grid gap-2 no-underline text-ink hover:border-gold">
          <span className="eyebrow">पूजा बुकिंग</span>
          <span className="text-[1.5rem] font-bold">{bookings.filter((b) => b.status === "new").length} नई बुकिंग</span>
          <span className="text-ink-soft">{bookings.filter((b) => b.status === "confirmed").length} पुष्ट · कुल {bookings.length}</span>
        </Link>
      </div>
    </div>
  );
}

// ── Payments ─────────────────────────────────────────────────────
const STATUS_BADGE: Record<Payment["status"], string> = {
  awaiting: "bg-line text-ink",
  pending: "bg-saffron text-[#2a1606]",
  confirmed: "bg-leaf text-white",
  rejected: "bg-maroon text-white",
};

function PaymentsTab({ kind, payments, status, tab }: { kind: PaymentKind; payments: Payment[]; status: string; tab: string }) {
  const list = payments.filter((p) => p.kind === kind);
  const shown = status ? list.filter((p) => p.status === status) : list;
  const c = money(list, "confirmed");
  const pe = money(list, "pending");
  const cash = list.filter((p) => p.status === "confirmed" && p.mode === "cash").reduce((a, p) => a + p.amount, 0);

  return (
    <div className="grid gap-5">
      <div className="grid sm:grid-cols-3 gap-3">
        <Stat label="पुष्ट (कुल)" value={rupees(c.sum)} sub={`${c.n} भुगतान · नकद ${rupees(cash)}`} />
        <Stat label="पुष्टि लंबित" value={rupees(pe.sum)} sub={`${pe.n} भुगतान, बैंक से मिलान करें`} tone="saffron" />
        <Stat label="भुगतान बाकी" value={String(list.filter((p) => p.status === "awaiting").length)} sub="रसीद बनी, भुगतान की सूचना नहीं" />
      </div>

      <details className="bg-card rounded-2xl border border-line">
        <summary className="cursor-pointer p-4 font-semibold">+ नकद / ऑफ़लाइन चंदा दर्ज करें</summary>
        <ActionForm action={addOfflinePayment} hidden={{ kind }} className="p-4 pt-0 grid sm:grid-cols-2 lg:grid-cols-3 gap-3 items-end">
          <Field label="नाम" name="name" required />
          <Field label="मोबाइल (वैकल्पिक)" name="phone" />
          <Field label="राशि ₹" name="amount" type="number" required />
          {kind === "general" && <Field label="कार्य" name="purpose" placeholder="जैसे भंडारा" />}
          <div className="grid gap-1">
            <label htmlFor={`mode-${kind}`} className="text-[0.95rem] font-medium">माध्यम</label>
            <select id={`mode-${kind}`} name="mode" className="input">
              <option value="cash">नकद</option>
              <option value="upi">UPI (सीधे स्कैन)</option>
              <option value="other">अन्य</option>
            </select>
          </div>
          <Field label="UTR / टिप्पणी" name="utr" />
          <button className="btn btn-primary">दर्ज करें</button>
        </ActionForm>
      </details>

      <div className="flex flex-wrap items-center gap-2">
        {["", "pending", "awaiting", "confirmed", "rejected"].map((s) => (
          <Link
            key={s || "all"}
            href={`/admin?tab=${tab}${s ? `&status=${s}` : ""}`}
            className={`px-3 py-1.5 rounded-full border-2 no-underline text-[0.95rem] font-semibold ${
              status === s ? "bg-ink border-ink text-white" : "border-line text-ink"
            }`}
          >
            {s ? STATUS_LABEL[s as Payment["status"]] : "सभी"} ({s ? list.filter((p) => p.status === s).length : list.length})
          </Link>
        ))}
        <a href={`/admin/export?type=${kind}`} className="ml-auto btn btn-outline min-h-0 py-2">Excel (CSV) डाउनलोड</a>
      </div>

      {shown.length === 0 ? (
        <p className="text-ink-soft p-6 text-center bg-card rounded-xl border border-dashed border-line">कोई प्रविष्टि नहीं।</p>
      ) : (
        <ul className="grid gap-3">
          {shown.map((p) => (
            <PaymentRow key={p.id} p={p} />
          ))}
        </ul>
      )}
    </div>
  );
}

function PaymentRow({ p }: { p: Payment }) {
  const link = `${SITE_URL}/rasid/${p.id}`;
  const msg =
    p.status === "confirmed"
      ? `जय भोलेनाथ। आपका ${p.purpose} के लिए ${rupees(p.amount)} का भुगतान पुष्ट हो गया है। रसीद ${p.receipt}: ${link}\nसहयोग के लिए धन्यवाद।\n— ${MANDIR.name}`
      : `जय भोलेनाथ। रसीद ${p.receipt} (${rupees(p.amount)}) का भुगतान हमें अभी बैंक में नहीं दिखा। कृपया UTR या भुगतान का स्क्रीनशॉट भेजें।\n${link}`;
  const wa = p.phone ? `https://wa.me/91${p.phone}?text=${encodeURIComponent(msg)}` : null;
  const date = new Intl.DateTimeFormat("hi-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" }).format(new Date(p.createdAt));

  return (
    <li className="bg-card rounded-xl border border-line p-4 grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
      <div className="grid gap-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold tabular-nums">{p.receipt}</span>
          <span className={`text-[0.8rem] px-2 py-0.5 rounded font-semibold ${STATUS_BADGE[p.status]}`}>{STATUS_LABEL[p.status]}</span>
          {p.mode !== "upi" && <span className="text-[0.8rem] px-2 py-0.5 rounded bg-saffron-soft border border-line">{p.mode === "cash" ? "नकद" : "अन्य"}</span>}
          <span className="text-ink-soft text-[0.9rem]">{date}</span>
        </div>
        <p className="text-[1.1rem]">
          <strong>{p.name}</strong> · <span className="font-bold tabular-nums">{rupees(p.amount)}</span>
          {p.anonymous && <span className="text-ink-soft text-[0.9rem]"> (नाम गुप्त)</span>}
        </p>
        <p className="text-ink-soft text-[0.95rem]">
          {p.purpose}
          {p.phone && <> · <a href={`tel:+91${p.phone}`} className="text-maroon">{p.phone}</a></>}
          {p.mohalla && <> · {p.mohalla}</>}
          {p.utr && <> · UTR <strong className="text-ink tabular-nums">{p.utr}</strong></>}
        </p>
      </div>
      <div className="flex flex-wrap gap-2 md:justify-end">
        <ActionForm action={changePaymentStatus} hidden={{ id: p.id }} className="flex flex-wrap gap-2">
          {p.status !== "confirmed" && <button name="status" value="confirmed" className="btn btn-primary min-h-11 py-2">✓ पुष्टि करें</button>}
          {p.status !== "rejected" && p.status !== "confirmed" && <button name="status" value="rejected" className="btn btn-outline min-h-11 py-2">नहीं मिला</button>}
          {(p.status === "confirmed" || p.status === "rejected") && <button name="status" value="pending" className="btn btn-outline min-h-11 py-2">वापस लंबित करें</button>}
        </ActionForm>
        {wa && <a href={wa} target="_blank" rel="noopener" className="btn btn-outline min-h-11 py-2">WhatsApp</a>}
        <a href={link} target="_blank" rel="noopener" className="btn btn-outline min-h-11 py-2">रसीद</a>
      </div>
    </li>
  );
}

// ── Bookings ─────────────────────────────────────────────────────
const BOOKING_LABEL: Record<Booking["status"], string> = { new: "नई", confirmed: "पुष्ट", done: "सम्पन्न", cancelled: "रद्द" };

function BookingsTab({ bookings }: { bookings: Booking[] }) {
  return (
    <div className="grid gap-4">
      <div className="flex justify-end">
        <a href="/admin/export?type=bookings" className="btn btn-outline min-h-0 py-2">Excel (CSV) डाउनलोड</a>
      </div>
      {bookings.length === 0 && <p className="text-ink-soft p-6 text-center bg-card rounded-xl border border-dashed border-line">अभी कोई बुकिंग नहीं।</p>}
      <ul className="grid gap-3">
        {bookings.map((b) => {
          const wa = `https://wa.me/91${b.phone}?text=${encodeURIComponent(`जय भोलेनाथ। आपकी ${b.puja} बुकिंग (${b.ref}) के लिए मंदिर कार्यालय से संपर्क कर रहे हैं।`)}`;
          return (
            <li key={b.id} className="bg-card rounded-xl border border-line p-4 grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
              <div className="grid gap-1">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="font-bold">{b.ref}</span>
                  <span className={`text-[0.8rem] px-2 py-0.5 rounded font-semibold ${b.status === "new" ? "bg-saffron" : b.status === "cancelled" ? "bg-line" : "bg-leaf text-white"}`}>
                    {BOOKING_LABEL[b.status]}
                  </span>
                </div>
                <p className="text-[1.1rem]"><strong>{b.puja}</strong>{b.option && ` (${b.option})`}</p>
                <p className="text-ink-soft">
                  {b.name} · <a href={`tel:+91${b.phone}`} className="text-maroon">{b.phone}</a> · तिथि: {b.date || "तय नहीं"}
                  {b.note && <> · {b.note}</>}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 md:justify-end">
                <ActionForm action={changeBookingStatus} hidden={{ id: b.id }} className="flex flex-wrap gap-2">
                  {(["confirmed", "done", "cancelled"] as const)
                    .filter((s) => s !== b.status)
                    .map((s) => (
                      <button key={s} name="status" value={s} className={`btn min-h-11 py-2 ${s === "confirmed" ? "btn-primary" : "btn-outline"}`}>
                        {BOOKING_LABEL[s]}
                      </button>
                    ))}
                </ActionForm>
                <a href={wa} target="_blank" rel="noopener" className="btn btn-outline min-h-11 py-2">WhatsApp</a>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ── Members ──────────────────────────────────────────────────────
function MembersTab({ members, payments, status }: { members: Member[]; payments: Payment[]; status: string }) {
  const fee = members.reduce((a, m) => a + m.fee, 0);
  const paid = members.reduce((a, m) => a + m.paid, 0);
  const memPayments = payments.filter((p) => p.kind === "membership" && p.status !== "awaiting");

  return (
    <div className="grid gap-5">
      <div className="grid sm:grid-cols-3 gap-3">
        <Stat label={`कुल शुल्क ${MEMBERSHIP.year}`} value={rupees(fee)} sub={`${members.length} सदस्य`} />
        <Stat label="जमा" value={rupees(paid)} sub="" />
        <Stat label="बकाया" value={rupees(Math.max(0, fee - paid))} sub={`${members.filter((m) => dues(m) > 0).length} सदस्यों पर`} tone="saffron" />
      </div>

      {memPayments.length > 0 && (
        <section className="grid gap-3">
          <h2 className="text-[1.4rem]">वेबसाइट से आए सदस्यता भुगतान</h2>
          <p className="text-ink-soft text-[0.95rem]">नए सदस्य का भुगतान पुष्ट करते ही वे सक्रिय हो जाते हैं। “पुराने सदस्य” वाले भुगतान पुष्ट करने के बाद नीचे उस सदस्य का “जमा” बदल दें।</p>
          <ul className="grid gap-3">
            {memPayments.map((p) => (
              <PaymentRow key={p.id} p={p} />
            ))}
          </ul>
        </section>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {[
          ["", "सभी"],
          ["dues", "बकाया वाले"],
          ["applied", "नए आवेदन"],
        ].map(([s, l]) => (
          <Link key={s || "all"} href={`/admin?tab=sadasya${s ? `&status=${s}` : ""}`} className={`px-3 py-1.5 rounded-full border-2 no-underline font-semibold ${status === s ? "bg-ink border-ink text-white" : "border-line text-ink"}`}>
            {l}
          </Link>
        ))}
        <a href="/admin/export?type=members" className="ml-auto btn btn-outline min-h-0 py-2">Excel (CSV) डाउनलोड</a>
      </div>

      <MembersTable members={members} initialFilter={status} />

      <div className="grid md:grid-cols-2 gap-4">
        <details className="bg-card rounded-2xl border border-line">
          <summary className="cursor-pointer p-4 font-semibold">+ नया सदस्य जोड़ें</summary>
          <ActionForm action={addMember} className="p-4 pt-0 grid sm:grid-cols-2 gap-3 items-end">
            <Field label="नाम" name="name" required />
            <Field label="मोबाइल" name="phone" />
            <Field label="शुल्क ₹" name="fee" type="number" defaultValue={String(MEMBERSHIP.fee)} />
            <Field label="जमा ₹" name="paid" type="number" defaultValue="0" />
            <button className="btn btn-primary">जोड़ें</button>
          </ActionForm>
        </details>
        <details className="bg-card rounded-2xl border border-line">
          <summary className="cursor-pointer p-4 font-semibold">सदस्य सूची आयात करें (CSV)</summary>
          <ActionForm action={importMemberCsv} className="p-4 pt-0 grid gap-3">
            <p className="text-ink-soft text-[0.95rem]">पहली पंक्ति: <code>name,mobile,fee,paid</code>। ध्यान दें: दोबारा आयात करने पर सदस्य दोहराए जाएँगे।</p>
            <input type="file" name="file" accept=".csv,text/csv" aria-label="CSV फ़ाइल" className="input py-2" />
            <textarea name="csv" rows={3} placeholder="या यहाँ चिपकाएँ" aria-label="CSV टेक्स्ट" className="input py-2" />
            <button className="btn btn-primary">आयात करें</button>
          </ActionForm>
        </details>
      </div>
    </div>
  );
}

// ── Small pieces ─────────────────────────────────────────────────
function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-2xl border border-line p-6 md:p-8 grid gap-4 max-w-xl">
      <h1 className="text-[1.8rem]">{title}</h1>
      {children}
    </div>
  );
}

function Stat({ label, value, sub, tone }: { label: string; value: string; sub: string; tone?: "saffron" }) {
  return (
    <div className={`bg-card rounded-xl border p-4 grid gap-1 ${tone ? "border-saffron/60" : "border-line"}`}>
      <span className="text-ink-soft text-[0.95rem]">{label}</span>
      <span className="text-[1.6rem] font-bold tabular-nums leading-tight">{value}</span>
      {sub && <span className="text-ink-soft text-[0.9rem]">{sub}</span>}
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  defaultValue,
  placeholder,
  small,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
  placeholder?: string;
  small?: boolean;
}) {
  return (
    <label className="grid gap-1 min-w-0">
      <span className={small ? "text-[0.85rem] font-medium" : "text-[0.95rem] font-medium"}>{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        inputMode={type === "number" ? "numeric" : undefined}
        className={`input ${small ? "min-h-10 py-1 text-[0.95rem]" : ""}`}
      />
    </label>
  );
}
