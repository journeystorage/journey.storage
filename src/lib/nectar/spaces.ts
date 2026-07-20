import "server-only";
import { nectarFetch } from "./client";
import type { CostItem, SpaceType } from "./types";

/**
 * Live availability + pricing for a facility.
 * GET /facilities/{fid}/space-types
 * Response data: { lastUpdates: { spaceTypes: ts }, spaceTypes: [...] }
 * Rentable = spaceCount.available > 0.
 */
export async function getSpaceTypes(facilityId: string, opts?: { revalidate?: number }): Promise<SpaceType[]> {
  const { data } = await nectarFetch<{ lastUpdates?: unknown; spaceTypes: SpaceType[] }>(
    `/facilities/${facilityId}/space-types`,
    { next: { revalidate: opts?.revalidate ?? 120, tags: [`spaces-${facilityId}`] } },
  );
  return data.spaceTypes ?? [];
}

/**
 * Hold a space in a space type for 15 minutes.
 * POST /facilities/{fid}/space-types/{sptId}/hold -> { hold, spaceId }
 */
export async function holdSpace(facilityId: string, spaceTypeId: string, traceId?: string) {
  const { data } = await nectarFetch<{ hold: string; spaceId: string }>(
    `/facilities/${facilityId}/space-types/${spaceTypeId}/hold`,
    { method: "POST", traceId },
  );
  return data;
}

/**
 * Extend an active hold before its 15-minute TTL lapses.
 * PUT /facilities/{fid}/spaces/{spaceId}/hold  body { hold }
 */
export async function extendHold(facilityId: string, spaceId: string, hold: string, traceId?: string) {
  const { data } = await nectarFetch<{ hold: string }>(`/facilities/${facilityId}/spaces/${spaceId}/hold`, {
    method: "PUT",
    body: { hold },
    traceId,
  });
  return data;
}

export interface RentalQuote {
  moveinDate?: number;
  spaceType: string;
  space: string;
  hold: string;
  billingDate?: number;
  discountIds?: string[];
  insuranceId?: string;
  costs: CostItem[];
  paymentAmount?: number;
}

/**
 * Full move-in cost quote (prorated rent, fees, insurance, discounts, tax).
 * POST /facilities/{fid}/space-types/{sptId}/rental-cost  body { spaceId, hold, ... }
 * (The reservation-to-rental guide shows GET on the same path; the rental-flow
 * guide's POST-with-body is treated as canonical here.)
 * Response wraps the quote at data.rental.
 */
export async function quoteRentalCost(
  facilityId: string,
  spaceTypeId: string,
  params: { spaceId: string; hold: string; discountIds?: string[]; insuranceId?: string; moveinDate?: number; reservationId?: string },
  traceId?: string,
): Promise<RentalQuote> {
  const { data } = await nectarFetch<{ rental: RentalQuote }>(
    `/facilities/${facilityId}/space-types/${spaceTypeId}/rental-cost`,
    { method: "POST", body: { spaceId: params.spaceId, hold: params.hold, discountIds: params.discountIds, insuranceId: params.insuranceId, moveinDate: params.moveinDate, reservationId: params.reservationId }, traceId },
  );
  return data.rental;
}
