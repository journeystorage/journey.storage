// Move-out is NOT part of Nectar Core — it goes through the Hummingbird App
// Passthrough and uses Hummingbird short ids (company, lease, contact), not
// GDS ids. Map GDS tenant/contact -> Hummingbird via the pmsId fields.
// Documented flow assumes NO due amount and NO prepay balance: check the
// tenant's balance first and route to Pay Bill when non-zero.

import "server-only";
import { hummingbirdFetch } from "./client";
import { HB_COMPANY_ID } from "./facilities";

export interface LeaseMetrics {
  lifetime_payments: number;
  paid_through_date: string; // "YYYY-MM-DD"
  prepaid_balance: number;
  has_autopay: boolean;
}

/** Step 1 — GET companies/{cid}/leases/{lease_id}/metrics */
export async function getLeaseMetrics(leaseId: string, traceId?: string): Promise<LeaseMetrics> {
  const data = await hummingbirdFetch<{ metrics: LeaseMetrics }>(`v2/companies/${HB_COMPANY_ID}/leases/${leaseId}/metrics`, { traceId });
  return data.metrics;
}

/**
 * Step 2 — GET companies/{cid}/leases/{lease_id}/security-deposit
 * Returns { amount: "50" } — a STRING. Any refund must be LESS than this amount.
 */
export async function getSecurityDeposit(leaseId: string, traceId?: string): Promise<number> {
  const data = await hummingbirdFetch<{ amount: string }>(`v2/companies/${HB_COMPANY_ID}/leases/${leaseId}/security-deposit`, { traceId });
  return parseFloat(data.amount || "0");
}

/**
 * Step 3 — POST companies/{cid}/contacts/{contact_id}/interaction
 * A move-out note: context "moveout", method "note", ref_object_type "lease".
 */
export async function addMoveOutNote(contactId: string, leaseId: string, spaceNumber: string, content: string, traceId?: string): Promise<void> {
  await hummingbirdFetch(`v2/companies/${HB_COMPANY_ID}/contacts/${contactId}/interaction`, {
    method: "POST",
    body: {
      context: "moveout",
      content,
      method: "note",
      pinned: false,
      ref_object_type: "lease",
      ref_object_id: leaseId,
      space: spaceNumber,
    },
    traceId,
  });
}

/**
 * Step 4 — PUT companies/{cid}/leases/{lease_id}/close
 * moved_out: "YYYY-MM-DD"; readyToMove: manager's "clean & ready" flag (false from web).
 */
export async function closeLease(leaseId: string, movedOut: string, traceId?: string): Promise<void> {
  await hummingbirdFetch(`v2/companies/${HB_COMPANY_ID}/leases/${leaseId}/close`, {
    method: "PUT",
    body: { moved_out: movedOut, readyToMove: false },
    traceId,
  });
}
