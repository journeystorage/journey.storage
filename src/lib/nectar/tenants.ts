import "server-only";
import { nectarFetch } from "./client";
import type { Customer, Tenant } from "./types";

/**
 * Customer lookup by email or phone.
 * GET /owners/{ownerId}/customers?email=... | ?phone=...
 * Returns an ARRAY: one email/phone can match multiple customers, and each
 * customer's `items` map spans facilities: { facilityId: { tenantId: [spaceId] } }.
 */
export async function findCustomers(ownerId: string, query: { email?: string; phone?: string }, traceId?: string): Promise<Customer[]> {
  if (!query.email && !query.phone) throw new Error("email or phone required");
  const { data } = await nectarFetch<Customer[]>(`/owners/${ownerId}/customers`, {
    query: { email: query.email, phone: query.phone },
    traceId,
  });
  return Array.isArray(data) ? data : [];
}

/**
 * Full tenant record (balances, autopay, gate access) — live PMS read.
 * GET /facilities/{fid}/tenants/{tid}?liveData=true -> data.tenant
 * Contains SSN/DL fields: never return this object to the browser;
 * project through toAccountView() first.
 */
export async function getTenant(facilityId: string, tenantId: string, traceId?: string): Promise<Tenant> {
  const { data } = await nectarFetch<{ tenant: Tenant }>(`/facilities/${facilityId}/tenants/${tenantId}`, {
    query: { liveData: true },
    traceId,
  });
  return data.tenant;
}
