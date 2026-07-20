// Server-only Nectar HTTP client.
// Auth: static API key in X-storageapi-key + unix-seconds X-storageapi-date.
// All responses arrive in the Core envelope { message, data, applicationData, meta }.
// Auth failures come back as HTTP 400 (not 401/403) with data.errors.code.

import "server-only";
import { randomUUID } from "crypto";

const BASE_URL = (process.env.NECTAR_BASE_URL ?? "https://edge.tenant.dev/api/v3").replace(/\/$/, "");
const API_KEY = process.env.NECTAR_API_KEY ?? "";

export class NectarError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
    public readonly requestId?: string,
    public readonly detail?: unknown,
  ) {
    super(message);
    this.name = "NectarError";
  }
  get isAuthError() {
    return this.code === "APIKeyInvalid" || this.code === "PermissionDenied";
  }
}

interface Envelope<T> {
  message: string;
  data: T;
  applicationData?: Record<string, Array<{ status?: unknown; data?: unknown; event?: unknown }>> | null;
  meta?: { requestId?: string };
}

export interface NectarRequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
  /** One value per user session/flow; forwarded for cross-call tracing. */
  traceId?: string;
  /** Next.js fetch caching, e.g. { revalidate: 120 } for the spaces feed. */
  next?: { revalidate?: number; tags?: string[] };
}

function redact(value: unknown): unknown {
  // Never let PANs/CVVs reach logs. Replaces paymentInstrument/payment_method contents.
  if (value && typeof value === "object") {
    const clone: Record<string, unknown> = Array.isArray(value) ? ({ ...value } as never) : { ...(value as object) };
    for (const k of Object.keys(clone)) {
      if (/payment_?(instrument|method)/i.test(k) || /^(number|card_number|cvv2?|ssn|account_number|routing_number)$/i.test(k)) {
        clone[k] = "[redacted]";
      } else {
        clone[k] = redact(clone[k]);
      }
    }
    return clone;
  }
  return value;
}

function firstErrorCode(err: unknown): string | undefined {
  // Errors nest: data.errors.code -> origin.code -> origin.origin.code ...
  let node = (err as { code?: string; origin?: unknown }) ?? undefined;
  let code: string | undefined;
  while (node && typeof node === "object") {
    if (typeof node.code === "string") code = node.code;
    node = node.origin as never;
  }
  return code;
}

export async function nectarFetch<T>(path: string, opts: NectarRequestOptions = {}): Promise<{ data: T; requestId?: string; raw: Envelope<T> }> {
  if (!API_KEY) throw new NectarError("NECTAR_API_KEY is not configured", 500, "ConfigMissing");

  const url = new URL(BASE_URL + (path.startsWith("/") ? path : `/${path}`));
  for (const [k, v] of Object.entries(opts.query ?? {})) {
    if (v !== undefined) url.searchParams.set(k, String(v));
  }

  const requestId = randomUUID();
  const res = await fetch(url, {
    method: opts.method ?? "GET",
    headers: {
      "X-storageapi-key": API_KEY,
      "X-storageapi-date": String(Math.floor(Date.now() / 1000)),
      "X-storageapi-request-id": requestId,
      ...(opts.traceId ? { "X-storageapi-trace-id": opts.traceId } : {}),
      ...(opts.body !== undefined ? { "Content-Type": "application/json" } : {}),
    },
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    // DELETE with a JSON body is required by the autopay-disable endpoint; fetch allows it.
    ...(opts.next ? { next: opts.next } : { cache: "no-store" as const }),
  });

  let envelope: Envelope<T> | undefined;
  try {
    envelope = (await res.json()) as Envelope<T>;
  } catch {
    /* non-JSON body */
  }

  if (!res.ok || (envelope && envelope.message && envelope.message !== "success")) {
    const errors = (envelope?.data as { errors?: unknown } | undefined)?.errors;
    const code = firstErrorCode(errors);
    console.error("[nectar] request failed", {
      path,
      status: res.status,
      code,
      requestId: envelope?.meta?.requestId ?? requestId,
      body: redact(opts.body),
    });
    throw new NectarError(envelope?.message ?? `Nectar request failed (${res.status})`, res.status, code, envelope?.meta?.requestId, redact(errors));
  }

  return { data: envelope!.data, requestId: envelope!.meta?.requestId, raw: envelope! };
}

/**
 * Hummingbird App Passthrough helper.
 * Path pattern: /applications/{HB_APP_ID}/v2/companies/{companyId}/...
 * Passthrough payloads are wrapped at applicationData[appId][0]; some endpoints
 * (hold, reserve, lease, move-out) return flat JSON in `data` instead — this
 * helper returns whichever is present.
 */
export async function hummingbirdFetch<T>(path: string, opts: NectarRequestOptions = {}): Promise<T> {
  const appId = process.env.HB_APPLICATION_ID ?? "appbc35600a675841eea5893df84231789e"; // production HB app id from docs
  const { data, raw } = await nectarFetch<T>(`/applications/${appId}/${path.replace(/^\//, "")}`, opts);
  const wrapped = raw.applicationData?.[appId]?.[0];
  if (wrapped && wrapped.data !== undefined) return wrapped.data as T;
  return data;
}
