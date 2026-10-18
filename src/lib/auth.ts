import "server-only";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

// Single shared committee password, set as ADMIN_PASSWORD in Vercel. The session cookie is an
// HMAC-signed expiry, so changing the password logs everyone out.
const COOKIE = "mandir_admin";
const DAYS = 30;

export const adminConfigured = () => Boolean(process.env.ADMIN_PASSWORD);

const sign = (payload: string) =>
  createHmac("sha256", `${process.env.ADMIN_PASSWORD}:${process.env.ADMIN_SECRET ?? "shanteshwar"}`).update(payload).digest("hex");

const safeEqual = (a: string, b: string) => {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

export function passwordMatches(input: string) {
  return adminConfigured() && safeEqual(input, process.env.ADMIN_PASSWORD!);
}

export async function startSession() {
  const exp = Date.now() + DAYS * 864e5;
  (await cookies()).set(COOKIE, `${exp}.${sign(String(exp))}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DAYS * 86400,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin() {
  if (!adminConfigured()) return false;
  const v = (await cookies()).get(COOKIE)?.value;
  if (!v) return false;
  const [exp, sig] = v.split(".");
  return Number(exp) > Date.now() && !!sig && safeEqual(sig, sign(exp));
}
