import { connection } from "next/server";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { CHANDA_PURPOSES, type ChandaEntry, type ChandaSummary } from "@/lib/chanda";

// Draft storage: a JSON file on the server. Works for `next start` on one machine;
// swap for a real database (or Google Sheet) before hosting on serverless platforms.
const FILE = path.join(process.cwd(), "data", "chanda.json");

async function load(): Promise<ChandaEntry[]> {
  try {
    return JSON.parse(await readFile(FILE, "utf8"));
  } catch {
    return [];
  }
}

async function save(entries: ChandaEntry[]) {
  await mkdir(path.dirname(FILE), { recursive: true });
  await writeFile(FILE, JSON.stringify(entries, null, 2));
}

export async function GET(request: Request) {
  await connection();
  const purpose = new URL(request.url).searchParams.get("purpose");
  const entries = (await load()).filter((e) => !purpose || e.purpose === purpose);
  const summary: ChandaSummary = {
    total: entries.reduce((s, e) => s + e.amount, 0),
    count: entries.length,
    recent: entries
      .slice(-12)
      .reverse()
      .map((e) => ({
        receipt: e.receipt,
        name: e.anonymous ? "गुप्त दानदाता" : e.name,
        amount: e.amount,
        purpose: e.purpose,
        createdAt: e.createdAt,
      })),
  };
  return Response.json(summary);
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "जानकारी पढ़ी नहीं जा सकी।" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim().slice(0, 60);
  const phone = String(body.phone ?? "").replace(/\D/g, "").slice(-10);
  const mohalla = String(body.mohalla ?? "").trim().slice(0, 80);
  const utr = String(body.utr ?? "").replace(/\s/g, "").slice(0, 30);
  const amount = Math.round(Number(body.amount));
  const purpose = String(body.purpose ?? "");

  if (!name) return Response.json({ error: "कृपया नाम लिखें।" }, { status: 400 });
  if (phone.length !== 10) return Response.json({ error: "कृपया 10 अंकों का मोबाइल नंबर लिखें।" }, { status: 400 });
  if (!Number.isFinite(amount) || amount < 1 || amount > 1_000_000)
    return Response.json({ error: "कृपया सही राशि लिखें।" }, { status: 400 });
  if (!CHANDA_PURPOSES.some((p) => p.id === purpose))
    return Response.json({ error: "कृपया उद्देश्य चुनें।" }, { status: 400 });

  const entries = await load();
  const year = new Date().getFullYear();
  const entry: ChandaEntry = {
    id: crypto.randomUUID(),
    receipt: `SSM-${year}-${String(entries.length + 1).padStart(4, "0")}`,
    name,
    phone,
    mohalla,
    amount,
    purpose,
    utr,
    anonymous: Boolean(body.anonymous),
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  entries.push(entry);
  await save(entries);

  return Response.json({ receipt: entry.receipt, createdAt: entry.createdAt }, { status: 201 });
}
