"use server";

import { refresh } from "next/cache";
import { endSession, isAdmin, passwordMatches, startSession } from "@/lib/auth";
import {
  InputError,
  cleanPhone,
  cleanText,
  createMember,
  createPayment,
  importMembers,
  requireAmount,
  requireName,
  setBookingStatus,
  setPaymentStatus,
  updateMember,
  type BookingStatus,
  type PaymentKind,
  type PaymentStatus,
} from "@/lib/records";
import { StoreNotConfigured } from "@/lib/store";

export type ActionState = { ok?: string; error?: string } | null;

async function guard() {
  if (!(await isAdmin())) throw new InputError("कृपया दोबारा लॉगिन करें।");
}

// Runs an admin mutation and reports a friendly message back to the form.
async function run(fn: () => Promise<string>): Promise<ActionState> {
  try {
    await guard();
    const ok = await fn();
    refresh();
    return { ok };
  } catch (e) {
    if (e instanceof InputError || e instanceof StoreNotConfigured) return { error: e.message };
    console.error(e);
    return { error: "कुछ गड़बड़ हुई, फिर कोशिश करें।" };
  }
}

export async function login(_: ActionState, form: FormData): Promise<ActionState> {
  await new Promise((r) => setTimeout(r, 400)); // slows down password guessing
  if (!passwordMatches(String(form.get("password") ?? ""))) return { error: "पासवर्ड सही नहीं है।" };
  await startSession();
  refresh();
  return { ok: "स्वागत है" };
}

export async function logout() {
  await endSession();
  refresh();
}

export async function changePaymentStatus(_: ActionState, form: FormData) {
  return run(async () => {
    const status = String(form.get("status")) as PaymentStatus;
    if (!["pending", "confirmed", "rejected"].includes(status)) throw new InputError("गलत स्थिति।");
    const p = await setPaymentStatus(String(form.get("id")), status);
    return `${p.receipt}: स्थिति बदल दी गई`;
  });
}

export async function addOfflinePayment(_: ActionState, form: FormData) {
  return run(async () => {
    const kind = String(form.get("kind")) as PaymentKind;
    if (!["durga-puja-2026", "general"].includes(kind)) throw new InputError("गलत श्रेणी।");
    const mode = String(form.get("mode")) as "cash" | "upi" | "other";
    const p = await createPayment({
      kind,
      purpose: kind === "durga-puja-2026" ? "दुर्गा पूजा 2026" : cleanText(form.get("purpose")) || "सामान्य दान",
      name: requireName(form.get("name")),
      phone: cleanPhone(form.get("phone")),
      mohalla: cleanText(form.get("mohalla")),
      amount: requireAmount(form.get("amount")),
      utr: cleanText(form.get("utr"), 30),
      mode: ["cash", "upi", "other"].includes(mode) ? mode : "cash",
      anonymous: false,
      note: "समिति द्वारा दर्ज",
      status: "confirmed",
    });
    return `${p.receipt} दर्ज हो गया`;
  });
}

export async function changeBookingStatus(_: ActionState, form: FormData) {
  return run(async () => {
    const status = String(form.get("status")) as BookingStatus;
    if (!["new", "confirmed", "done", "cancelled"].includes(status)) throw new InputError("गलत स्थिति।");
    await setBookingStatus(String(form.get("id")), status);
    return "बुकिंग अपडेट हो गई";
  });
}

export async function saveMember(_: ActionState, form: FormData) {
  return run(async () => {
    const fee = requireAmount(form.get("fee"));
    const paid = Math.max(0, Math.round(Number(form.get("paid")) || 0));
    await updateMember(String(form.get("id")), {
      name: requireName(form.get("name")),
      phone: cleanPhone(form.get("phone")),
      fee,
      paid,
      status: form.get("status") === "applied" ? "applied" : "active",
    });
    return "सदस्य की जानकारी सहेज ली गई";
  });
}

export async function addMember(_: ActionState, form: FormData) {
  return run(async () => {
    const m = await createMember({
      name: requireName(form.get("name")),
      phone: cleanPhone(form.get("phone")),
      fee: requireAmount(form.get("fee") || 3100),
      paid: Math.max(0, Math.round(Number(form.get("paid")) || 0)),
      status: "active",
      source: "admin",
    });
    return `${m.name} जोड़ दिए गए`;
  });
}

export async function importMemberCsv(_: ActionState, form: FormData) {
  return run(async () => {
    const file = form.get("file");
    let csv = String(form.get("csv") ?? "");
    if (file instanceof File && file.size > 0) csv = await file.text();
    if (!csv.trim()) throw new InputError("CSV फ़ाइल चुनें या टेक्स्ट चिपकाएँ।");
    const n = await importMembers(csv);
    return `${n} सदस्य आयात हुए`;
  });
}
