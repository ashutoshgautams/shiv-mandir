import { connection } from "next/server";
import { handle } from "@/lib/api";
import { campaignSummary, type PaymentKind } from "@/lib/records";

// Public totals: only payments the committee has confirmed are counted.
export async function GET(request: Request) {
  await connection();
  return handle(async () => {
    const kind = (new URL(request.url).searchParams.get("kind") ?? "durga-puja-2026") as PaymentKind;
    return Response.json(await campaignSummary(kind));
  });
}
