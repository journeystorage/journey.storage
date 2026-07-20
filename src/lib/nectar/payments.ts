import "server-only";
import { nectarFetch } from "./client";
import type { CostItem, PaymentInstrument } from "./types";

export interface PrepayQuote {
  /** Cost arrays keyed by period number ("1", "2", ...). */
  costs: Record<string, CostItem[]>;
  /** Current dues cost array; empty when nothing is owed. */
  current: CostItem[];
  prepay: Record<string, CostItem[]>;
}

/**
 * Prepay quote.
 * GET /facilities/{fid}/tenants/{tid}/payments?liveData=true&spaceid={spc}&periods={n}
 * NOTE the lowercase `spaceid` query param — verbatim from the Pay Bill guide.
 */
export async function quotePrepay(facilityId: string, tenantId: string, spaceId: string, periods: number, traceId?: string): Promise<PrepayQuote> {
  const { data } = await nectarFetch<PrepayQuote>(`/facilities/${facilityId}/tenants/${tenantId}/payments`, {
    query: { liveData: true, spaceid: spaceId, periods },
    traceId,
  });
  return data;
}

/**
 * Pay dues or prepay.
 * POST /facilities/{fid}/tenants/{tid}/payments?liveData=true
 * Rules: periods = 0 pays current dues (paymentAmount = balance total with
 * discounts subtracted); periods >= 1 prepays (quote first). Billing address
 * inside paymentInstrument is mandatory.
 */
export async function payBill(
  facilityId: string,
  tenantId: string,
  body: { paymentAmount: number; paymentInstrument: PaymentInstrument; spaceId: string; periods: number },
  traceId?: string,
): Promise<void> {
  await nectarFetch(`/facilities/${facilityId}/tenants/${tenantId}/payments`, {
    method: "POST",
    query: { liveData: true },
    body,
    traceId,
  });
}

/**
 * Enable autopay for one tenant + space.
 * POST /facilities/{fid}/tenants/{tid}/autopay — card, address, spaceId all mandatory.
 * Readback: tenant.spaces[].autoPay (card masked to last 4).
 */
export async function enableAutopay(facilityId: string, tenantId: string, body: { paymentInstrument: PaymentInstrument; spaceId: string }, traceId?: string): Promise<void> {
  await nectarFetch(`/facilities/${facilityId}/tenants/${tenantId}/autopay`, { method: "POST", body, traceId });
}

/**
 * Disable autopay.
 * DELETE /facilities/{fid}/tenants/{tid}/autopay — takes a JSON BODY { spaceId }
 * (unusual for DELETE, but that's the documented contract).
 */
export async function disableAutopay(facilityId: string, tenantId: string, spaceId: string, traceId?: string): Promise<void> {
  await nectarFetch(`/facilities/${facilityId}/tenants/${tenantId}/autopay`, { method: "DELETE", body: { spaceId }, traceId });
}
