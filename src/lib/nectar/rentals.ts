import "server-only";
import { nectarFetch } from "./client";
import type { RentalRequest, Tenant } from "./types";

/**
 * Move-in: POST /facilities/{fid}/rentals
 * Rules from the Rental guide:
 *  - `reservationId` OR (`space` + `spaceType` + `hold`) required.
 *  - tenantInfo.contacts must contain EXACTLY one contact with type "primary".
 *  - paymentInstrument.card AND .address are mandatory.
 *  - paymentAmount must equal the quote's cost-array total with discounts
 *    already subtracted (use costArrayTotal on the rental-cost quote).
 *  - `autopay: true` enrolls autopay with the same card during move-in.
 * Response: the full Tenant object (customerId, spaces[] with leaseId,
 * gateAccess, accessCode, documents, status "rented").
 */
export async function createRental(facilityId: string, req: RentalRequest, traceId?: string): Promise<Tenant> {
  const primaries = req.tenantInfo.contacts.filter((c) => c.type === "primary");
  if (primaries.length !== 1) {
    throw new Error(`tenantInfo.contacts must contain exactly one primary contact (got ${primaries.length})`);
  }
  const { data } = await nectarFetch<{ tenant?: Tenant } & Tenant>(`/facilities/${facilityId}/rentals`, {
    method: "POST",
    body: req,
    traceId,
  });
  // Docs show the tenant either nested under data.tenant or as data itself.
  return (data as { tenant?: Tenant }).tenant ?? (data as Tenant);
}
