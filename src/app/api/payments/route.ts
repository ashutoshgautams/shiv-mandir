import { handle, readBody } from "@/lib/api";
import { CHANDA_PURPOSES } from "@/lib/chanda";
import { MEMBERSHIP } from "@/lib/mandir";
import {
  InputError,
  cleanText,
  createMember,
  createPayment,
  requireAmount,
  requireName,
  requirePhone,
  type PaymentKind,
} from "@/lib/records";

// Creates a receipt (status "awaiting") before the donor pays, so the receipt number can go in the UPI note.
export async function POST(request: Request) {
  return handle(async () => {
    const b = await readBody(request);
    const name = requireName(b.name);
    const phone = requirePhone(b.phone);
    const amount = requireAmount(b.amount);
    const mohalla = cleanText(b.mohalla);
    const anonymous = Boolean(b.anonymous);

    let kind: PaymentKind;
    let purpose: string;
    let memberId: string | undefined;

    if (b.type === "membership") {
      kind = "membership";
      if (b.memberMode === "renew") {
        purpose = `सदस्यता शुल्क ${MEMBERSHIP.year} (पुराने सदस्य)`;
      } else {
        purpose = `नई सदस्यता ${MEMBERSHIP.year}`;
        memberId = (await createMember({ name, phone, mohalla, source: "website", status: "applied" })).id;
      }
    } else {
      const p = CHANDA_PURPOSES.find((x) => x.id === b.purpose);
      if (!p) throw new InputError("कृपया उद्देश्य चुनें।");
      kind = p.id === "durga-puja-2026" ? "durga-puja-2026" : "general";
      purpose = p.name;
    }

    const pay = await createPayment({ kind, purpose, name, phone, mohalla, amount, anonymous, utr: "", mode: "upi", memberId });
    return Response.json({ id: pay.id, receipt: pay.receipt }, { status: 201 });
  });
}
