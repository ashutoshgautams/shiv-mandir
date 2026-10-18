import "server-only";
import { Redis } from "@upstash/redis";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

// Records live in Upstash Redis in production (Vercel → Storage → Upstash for Redis sets these env vars).
// In local development without those vars, a JSON file under /data is used instead.
const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

export type Collection = "payments" | "bookings" | "members";

export const storeMode: "redis" | "file" | "none" = url && token ? "redis" : process.env.VERCEL ? "none" : "file";

export class StoreNotConfigured extends Error {
  constructor() {
    super("डेटाबेस अभी जुड़ा नहीं है। कृपया मंदिर कार्यालय से संपर्क करें।");
  }
}

const redis = storeMode === "redis" ? new Redis({ url: url!, token: token! }) : null;
const PREFIX = "mandir:";

// ── file fallback ────────────────────────────────────────────────
const DIR = path.join(process.cwd(), "data");
async function readJson<T>(name: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await readFile(path.join(DIR, `${name}.json`), "utf8"));
  } catch {
    return fallback;
  }
}
async function writeJson(name: string, value: unknown) {
  await mkdir(DIR, { recursive: true });
  await writeFile(path.join(DIR, `${name}.json`), JSON.stringify(value, null, 2));
}

function ensure() {
  if (storeMode === "none") throw new StoreNotConfigured();
}

export async function all<T>(col: Collection): Promise<T[]> {
  ensure();
  if (redis) {
    const map = await redis.hgetall<Record<string, T>>(PREFIX + col);
    return map ? Object.values(map) : [];
  }
  return Object.values(await readJson<Record<string, T>>(col, {}));
}

export async function get<T>(col: Collection, id: string): Promise<T | null> {
  ensure();
  if (redis) return (await redis.hget<T>(PREFIX + col, id)) ?? null;
  return (await readJson<Record<string, T>>(col, {}))[id] ?? null;
}

export async function put<T extends { id: string }>(col: Collection, rec: T) {
  ensure();
  if (redis) {
    await redis.hset(PREFIX + col, { [rec.id]: rec });
    return;
  }
  const map = await readJson<Record<string, T>>(col, {});
  map[rec.id] = rec;
  await writeJson(col, map);
}

export async function putMany<T extends { id: string }>(col: Collection, recs: T[]) {
  ensure();
  if (!recs.length) return;
  if (redis) {
    await redis.hset(PREFIX + col, Object.fromEntries(recs.map((r) => [r.id, r])));
    return;
  }
  const map = await readJson<Record<string, T>>(col, {});
  for (const r of recs) map[r.id] = r;
  await writeJson(col, map);
}

export async function remove(col: Collection, id: string) {
  ensure();
  if (redis) {
    await redis.hdel(PREFIX + col, id);
    return;
  }
  const map = await readJson<Record<string, unknown>>(col, {});
  delete map[id];
  await writeJson(col, map);
}

// Monotonic counters for human-friendly receipt numbers.
export async function nextSeq(name: string): Promise<number> {
  ensure();
  if (redis) return redis.incr(`${PREFIX}seq:${name}`);
  const seqs = await readJson<Record<string, number>>("counters", {});
  seqs[name] = (seqs[name] ?? 0) + 1;
  await writeJson("counters", seqs);
  return seqs[name];
}
