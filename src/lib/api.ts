import "server-only";
import { StoreNotConfigured } from "./store";
import { InputError } from "./records";

// Turns known errors into friendly Hindi JSON responses.
export async function handle(fn: () => Promise<Response>) {
  try {
    return await fn();
  } catch (e) {
    if (e instanceof InputError) return Response.json({ error: e.message }, { status: 400 });
    if (e instanceof StoreNotConfigured) return Response.json({ error: e.message }, { status: 503 });
    console.error(e);
    return Response.json({ error: "कुछ गड़बड़ हुई। थोड़ी देर बाद फिर कोशिश करें।" }, { status: 500 });
  }
}

export async function readBody(request: Request): Promise<Record<string, unknown>> {
  try {
    return await request.json();
  } catch {
    throw new InputError("जानकारी पढ़ी नहीं जा सकी।");
  }
}
