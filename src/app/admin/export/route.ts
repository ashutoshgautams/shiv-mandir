import { isAdmin } from "@/lib/auth";
import { KIND_LABEL, STATUS_LABEL, dues, listBookings, listMembers, listPayments, type PaymentKind } from "@/lib/records";

const esc = (v: unknown) => {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const toCsv = (rows: unknown[][]) => "﻿" + rows.map((r) => r.map(esc).join(",")).join("\n"); // BOM so Excel reads Hindi

// Excel-friendly exports for the treasurer. Admin cookie required.
export async function GET(request: Request) {
  if (!(await isAdmin())) return new Response("Unauthorized", { status: 401 });
  const type = new URL(request.url).searchParams.get("type") ?? "";
  let rows: unknown[][];

  if (type === "bookings") {
    const list = await listBookings();
    rows = [["बुकिंग", "पूजा", "प्रकार", "नाम", "मोबाइल", "तिथि", "निवेदन", "स्थिति", "दर्ज"], ...list.map((b) => [b.ref, b.puja, b.option, b.name, b.phone, b.date, b.note, b.status, b.createdAt])];
  } else if (type === "members") {
    const list = await listMembers();
    rows = [["नाम", "मोबाइल", "शुल्क", "जमा", "बकाया", "स्थिति", "वर्ष"], ...list.map((m) => [m.name, m.phone, m.fee, m.paid, dues(m), m.status, m.year])];
  } else if (type in KIND_LABEL) {
    const list = await listPayments(type as PaymentKind);
    rows = [
      ["रसीद", "दिनांक", "नाम", "मोबाइल", "मोहल्ला", "कार्य", "राशि", "माध्यम", "UTR", "स्थिति"],
      ...list.map((p) => [p.receipt, p.createdAt, p.name, p.phone, p.mohalla, p.purpose, p.amount, p.mode, p.utr, STATUS_LABEL[p.status]]),
    ];
  } else {
    return new Response("Unknown type", { status: 400 });
  }

  return new Response(toCsv(rows), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="${type}-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
