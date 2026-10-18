import { handle, readBody } from "@/lib/api";
import { markPaid } from "@/lib/records";

// Donor says "I have paid" → status becomes pending until the committee verifies it.
export async function POST(request: Request, ctx: RouteContext<"/api/payments/[id]/paid">) {
  return handle(async () => {
    const { id } = await ctx.params;
    const b = await readBody(request);
    const p = await markPaid(id, String(b.utr ?? ""));
    return Response.json({ status: p.status });
  });
}
