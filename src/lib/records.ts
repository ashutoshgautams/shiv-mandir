import "server-only";
import { all, get, nextSeq, put, putMany } from "./store";
import { MEMBERSHIP } from "./mandir";

// ── Types ────────────────────────────────────────────────────────
export type PaymentKind = "durga-puja-2026" | "general" | "membership";
// awaiting: receipt created, donor hasn't said they paid · pending: donor says paid, committee to verify
export type PaymentStatus = "awaiting" | "pending" | "confirmed" | "rejected";

export type Payment = {
  id: string;
  receipt: string;
  kind: PaymentKind;
  purpose: string;
  name: string;
  phone: string;
  mohalla: string;
  amount: number;
  utr: string;
  mode: "upi" | "cash" | "other";
  anonymous: boolean;
  status: PaymentStatus;
  memberId?: string;
  note?: string;
  createdAt: string;
  paidAt?: string;
  confirmedAt?: string;
};

export type BookingStatus = "new" | "confirmed" | "done" | "cancelled";
export type Booking = {
  id: string;
  ref: string;
  puja: string;
  option: string;
  name: string;
  phone: string;
  date: string;
  note: string;
  status: BookingStatus;
  createdAt: string;
};

export type Member = {
  id: string;
  name: string;
  phone: string;
  mohalla: string;
  fee: number;
  paid: number;
  year: string;
  status: "active" | "applied";
  source: "import" | "website" | "admin";
  createdAt: string;
};

export const KIND_LABEL: Record<PaymentKind, string> = {
  "durga-puja-2026": "दुर्गा पूजा 2026",
  general: "सामान्य दान",
  membership: "सदस्यता शुल्क",
};

export const STATUS_LABEL: Record<PaymentStatus, string> = {
  awaiting: "भुगतान बाकी",
  pending: "पुष्टि लंबित",
  confirmed: "पुष्ट",
  rejected: "भुगतान नहीं मिला",
};

const RECEIPT_PREFIX: Record<PaymentKind, string> = { "durga-puja-2026": "DP26", general: "DAN", membership: "SDS" };

const newId = () => crypto.randomUUID().replace(/-/g, "").slice(0, 20);
const now = () => new Date().toISOString();
export const dues = (m: Member) => Math.max(0, m.fee - m.paid);

// ── Validation helpers ───────────────────────────────────────────
export class InputError extends Error {}
export const cleanText = (v: unknown, max = 80) => String(v ?? "").trim().replace(/\s+/g, " ").slice(0, max);
export const cleanPhone = (v: unknown) => String(v ?? "").replace(/\D/g, "").slice(-10);
export function requireName(v: unknown) {
  const s = cleanText(v, 60);
  if (!s) throw new InputError("कृपया नाम लिखें।");
  return s;
}
export function requirePhone(v: unknown) {
  const s = cleanPhone(v);
  if (s.length !== 10) throw new InputError("कृपया 10 अंकों का मोबाइल नंबर लिखें।");
  return s;
}
export function requireAmount(v: unknown) {
  const n = Math.round(Number(v));
  if (!Number.isFinite(n) || n < 1 || n > 1_000_000) throw new InputError("कृपया सही राशि लिखें।");
  return n;
}

// ── Payments ─────────────────────────────────────────────────────
export async function createPayment(input: Omit<Payment, "id" | "receipt" | "createdAt" | "status"> & { status?: PaymentStatus }) {
  const seq = await nextSeq(`receipt:${input.kind}`);
  const p: Payment = {
    ...input,
    status: input.status ?? "awaiting",
    id: newId(),
    receipt: `${RECEIPT_PREFIX[input.kind]}-${String(seq).padStart(4, "0")}`,
    createdAt: now(),
  };
  await put("payments", p);
  return p;
}

export const getPayment = (id: string) => get<Payment>("payments", id);

export async function listPayments(kind?: PaymentKind) {
  const list = await all<Payment>("payments");
  return list.filter((p) => !kind || p.kind === kind).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function markPaid(id: string, utr: string) {
  const p = await getPayment(id);
  if (!p) throw new InputError("रसीद नहीं मिली।");
  if (p.status === "confirmed" || p.status === "rejected") return p;
  const updated: Payment = { ...p, utr: cleanText(utr, 30).replace(/\s/g, "") || p.utr, status: "pending", paidAt: now() };
  await put("payments", updated);
  return updated;
}

export async function setPaymentStatus(id: string, status: PaymentStatus) {
  const p = await getPayment(id);
  if (!p) throw new InputError("रसीद नहीं मिली।");
  const wasConfirmed = p.status === "confirmed";
  const updated: Payment = { ...p, status, confirmedAt: status === "confirmed" ? now() : p.confirmedAt };
  await put("payments", updated);

  // Membership money counts toward the member's yearly fee only once confirmed.
  if (p.memberId && wasConfirmed !== (status === "confirmed")) {
    const m = await get<Member>("members", p.memberId);
    if (m) {
      const paid = Math.max(0, m.paid + (status === "confirmed" ? p.amount : -p.amount));
      await put("members", { ...m, paid, status: status === "confirmed" ? "active" : m.status });
    }
  }
  return updated;
}

export async function campaignSummary(kind: PaymentKind) {
  const list = (await listPayments(kind)).filter((p) => p.status === "confirmed");
  return {
    total: list.reduce((s, p) => s + p.amount, 0),
    count: list.length,
    recent: list.slice(0, 12).map((p) => ({ receipt: p.receipt, name: p.anonymous ? "गुप्त दानदाता" : p.name, amount: p.amount })),
  };
}

// ── Bookings ─────────────────────────────────────────────────────
export async function createBooking(input: Omit<Booking, "id" | "ref" | "status" | "createdAt">) {
  const seq = await nextSeq("booking");
  const b: Booking = { ...input, id: newId(), ref: `PB-${String(seq).padStart(4, "0")}`, status: "new", createdAt: now() };
  await put("bookings", b);
  return b;
}

export async function listBookings() {
  return (await all<Booking>("bookings")).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function setBookingStatus(id: string, status: BookingStatus) {
  const b = await get<Booking>("bookings", id);
  if (!b) throw new InputError("बुकिंग नहीं मिली।");
  await put("bookings", { ...b, status });
}

// ── Members ──────────────────────────────────────────────────────
export async function listMembers() {
  return (await all<Member>("members")).sort((a, b) => a.name.localeCompare(b.name, "hi"));
}

export async function createMember(input: Partial<Member> & { name: string }) {
  const m: Member = {
    id: newId(),
    name: input.name,
    phone: input.phone ?? "",
    mohalla: input.mohalla ?? "",
    fee: input.fee ?? MEMBERSHIP.fee,
    paid: input.paid ?? 0,
    year: input.year ?? MEMBERSHIP.year,
    status: input.status ?? "applied",
    source: input.source ?? "website",
    createdAt: now(),
  };
  await put("members", m);
  return m;
}

export async function updateMember(id: string, patch: Partial<Member>) {
  const m = await get<Member>("members", id);
  if (!m) throw new InputError("सदस्य नहीं मिला।");
  await put("members", { ...m, ...patch });
}

// CSV with header: name,mobile,fee,paid (extra columns ignored). Imported members are active.
export async function importMembers(csv: string) {
  const rows = csv.split(/\r?\n/).map((l) => l.split(",").map((c) => c.trim()));
  const header = rows.shift()?.map((h) => h.toLowerCase()) ?? [];
  const col = (n: string) => header.indexOf(n);
  const [ni, mi, fi, pi] = [col("name"), col("mobile"), col("fee"), col("paid")];
  if (ni < 0) throw new InputError("पहली पंक्ति में कॉलम के नाम होने चाहिए: name,mobile,fee,paid");
  const recs: Member[] = rows
    .filter((r) => r[ni])
    .map((r) => ({
      id: newId(),
      name: cleanText(r[ni], 60),
      phone: mi >= 0 ? cleanPhone(r[mi]) : "",
      mohalla: "",
      fee: fi >= 0 && Number(r[fi]) > 0 ? Math.round(Number(r[fi])) : MEMBERSHIP.fee,
      paid: pi >= 0 && Number(r[pi]) > 0 ? Math.round(Number(r[pi])) : 0,
      year: MEMBERSHIP.year,
      status: "active",
      source: "import",
      createdAt: now(),
    }));
  await putMany("members", recs);
  return recs.length;
}

export async function publicMemberNames() {
  return (await listMembers()).filter((m) => m.status === "active").map((m) => m.name);
}
