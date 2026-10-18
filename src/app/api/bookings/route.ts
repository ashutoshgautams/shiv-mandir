import { handle, readBody } from "@/lib/api";
import { cleanText, createBooking, requireName, requirePhone } from "@/lib/records";

export async function POST(request: Request) {
  return handle(async () => {
    const b = await readBody(request);
    const booking = await createBooking({
      puja: cleanText(b.puja, 60),
      option: cleanText(b.option, 60),
      name: requireName(b.name),
      phone: requirePhone(b.phone),
      date: cleanText(b.date, 20),
      note: cleanText(b.note, 300),
    });
    return Response.json({ ref: booking.ref }, { status: 201 });
  });
}
