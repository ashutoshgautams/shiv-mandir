import "server-only";
import { Redis } from "@upstash/redis";
import { createClient } from "redis";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

// Records live in Redis in production. Vercel's storage integrations name their variables differently
// (and may add a custom prefix), so we look for any of:
//   *KV_REST_API_URL + *KV_REST_API_TOKEN, *REDIS_REST_URL + *REDIS_REST_TOKEN  → Upstash REST
//   *REDIS_URL or *KV_URL (redis:// or rediss://)                              → standard Redis protocol
// Without any of these, local development falls back to JSON files under /data.

export type Collection = "payments" | "bookings" | "members";

function findEnv(suffixes: string[]) {
  for (const suffix of suffixes) {
    const key = Object.keys(process.env).find((k) => k.endsWith(suffix) && process.env[k]);
    if (key) return { key, value: process.env[key]! };
  }
  return null;
}

function detect() {
  const restUrl = findEnv(["KV_REST_API_URL", "REDIS_REST_URL"]);
  const restToken = findEnv(["KV_REST_API_TOKEN", "REDIS_REST_TOKEN"]);
  if (restUrl && restToken) return { mode: "rest" as const, url: restUrl.value, token: restToken.value, via: [restUrl.key, restToken.key] };
  const tcp = findEnv(["REDIS_URL", "KV_URL"]);
  if (tcp && /^rediss?:\/\//.test(tcp.value)) return { mode: "tcp" as const, url: tcp.value, via: [tcp.key] };
  return { mode: (process.env.VERCEL ? "none" : "file") as "none" | "file", via: [] as string[] };
}

const cfg = detect();
export const storeMode: "redis" | "file" | "none" = cfg.mode === "rest" || cfg.mode === "tcp" ? "redis" : cfg.mode;

// For the admin setup screen: which variable names were seen (never their values).
export function storeDiagnostics() {
  return {
    mode: cfg.mode,
    via: cfg.via,
    seen: Object.keys(process.env).filter((k) => /REDIS|KV_|UPSTASH/i.test(k)).sort(),
  };
}

export class StoreNotConfigured extends Error {
  constructor() {
    super("डेटाबेस अभी जुड़ा नहीं है। कृपया मंदिर कार्यालय से संपर्क करें।");
  }
}

const PREFIX = "mandir:";

// ── Minimal hash/counter interface over both Redis clients ───────
type Backend = {
  hgetall(key: string): Promise<Record<string, string>>;
  hget(key: string, field: string): Promise<string | null>;
  hset(key: string, values: Record<string, string>): Promise<void>;
  hdel(key: string, field: string): Promise<void>;
  incr(key: string): Promise<number>;
};

function restBackend(url: string, token: string): Backend {
  // We store JSON strings ourselves so data looks the same whichever client wrote it.
  const r = new Redis({ url, token, automaticDeserialization: false });
  return {
    // With automaticDeserialization off, HGETALL comes back as a flat [field, value, field, value…] array.
    hgetall: async (k) => {
      const raw = (await r.hgetall(k)) as unknown;
      if (!raw) return {};
      if (Array.isArray(raw)) {
        const out: Record<string, string> = {};
        for (let i = 0; i + 1 < raw.length; i += 2) out[String(raw[i])] = String(raw[i + 1]);
        return out;
      }
      return raw as Record<string, string>;
    },
    hget: async (k, f) => (await r.hget<string>(k, f)) ?? null,
    hset: async (k, v) => void (await r.hset(k, v)),
    hdel: async (k, f) => void (await r.hdel(k, f)),
    incr: (k) => r.incr(k),
  };
}

async function connectTcp(url: string) {
  const c = createClient({ url });
  c.on("error", (e) => console.error("redis", e));
  await c.connect();
  return c;
}
type TcpClient = Awaited<ReturnType<typeof connectTcp>>;
const g = globalThis as unknown as { __mandirRedis?: Promise<TcpClient> };

// One shared connection per server instance, re-created if it fails.
function tcpBackend(url: string): Backend {
  const client = (): Promise<TcpClient> => {
    if (!g.__mandirRedis) {
      g.__mandirRedis = connectTcp(url).catch((e) => {
        g.__mandirRedis = undefined;
        throw e;
      });
    }
    return g.__mandirRedis;
  };
  return {
    hgetall: async (k) => (await client()).hGetAll(k),
    hget: async (k, f) => (await (await client()).hGet(k, f)) ?? null,
    hset: async (k, v) => void (await (await client()).hSet(k, v)),
    hdel: async (k, f) => void (await (await client()).hDel(k, f)),
    incr: async (k) => (await client()).incr(k),
  };
}

const backend: Backend | null =
  cfg.mode === "rest" ? restBackend(cfg.url, cfg.token) : cfg.mode === "tcp" ? tcpBackend(cfg.url) : null;

const parse = <T>(v: unknown): T => (typeof v === "string" ? JSON.parse(v) : (v as T));

// One unreadable record should never take down a whole page.
function parseAll<T>(values: unknown[]): T[] {
  const out: T[] = [];
  for (const v of values) {
    try {
      const rec = parse<T>(v);
      if (rec && typeof rec === "object") out.push(rec);
    } catch {
      console.error("store: skipped unreadable record");
    }
  }
  return out;
}

// ── File fallback (local development) ────────────────────────────
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

// ── Public API ───────────────────────────────────────────────────
export async function all<T>(col: Collection): Promise<T[]> {
  ensure();
  if (backend) return parseAll<T>(Object.values(await backend.hgetall(PREFIX + col)));
  return Object.values(await readJson<Record<string, T>>(col, {}));
}

export async function get<T>(col: Collection, id: string): Promise<T | null> {
  ensure();
  if (backend) {
    const v = await backend.hget(PREFIX + col, id);
    return v == null ? null : parse<T>(v);
  }
  return (await readJson<Record<string, T>>(col, {}))[id] ?? null;
}

export async function put<T extends { id: string }>(col: Collection, rec: T) {
  ensure();
  if (backend) return backend.hset(PREFIX + col, { [rec.id]: JSON.stringify(rec) });
  const map = await readJson<Record<string, T>>(col, {});
  map[rec.id] = rec;
  await writeJson(col, map);
}

export async function putMany<T extends { id: string }>(col: Collection, recs: T[]) {
  ensure();
  if (!recs.length) return;
  if (backend) return backend.hset(PREFIX + col, Object.fromEntries(recs.map((r) => [r.id, JSON.stringify(r)])));
  const map = await readJson<Record<string, T>>(col, {});
  for (const r of recs) map[r.id] = r;
  await writeJson(col, map);
}

export async function remove(col: Collection, id: string) {
  ensure();
  if (backend) return backend.hdel(PREFIX + col, id);
  const map = await readJson<Record<string, unknown>>(col, {});
  delete map[id];
  await writeJson(col, map);
}

// Monotonic counters for human-friendly receipt numbers.
export async function nextSeq(name: string): Promise<number> {
  ensure();
  if (backend) return backend.incr(`${PREFIX}seq:${name}`);
  const seqs = await readJson<Record<string, number>>("counters", {});
  seqs[name] = (seqs[name] ?? 0) + 1;
  await writeJson("counters", seqs);
  return seqs[name];
}
