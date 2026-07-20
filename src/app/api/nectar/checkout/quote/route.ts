// POST /api/nectar/checkout/quote
// { facility, spaceTypeId, spaceId, hold, discountIds?, insuranceId?, moveinDate? }
// -> { costs, totalDue } — the order summary for the checkout page.

import { NextRequest, NextResponse } from "next/server";
import { facilityBySlug } from "@/lib/nectar/facilities";
import { quoteRentalCost } from "@/lib/nectar/spaces";
import { NectarError } from "@/lib/nectar/client";
import { costArrayTotal } from "@/lib/nectar/types";

export async function POST(req: NextRequest) {
  const { facility, spaceTypeId, spaceId, hold, discountIds, insuranceId, moveinDate } = await req.json();
  const cfg = facilityBySlug(facility);
  if (!cfg || !spaceTypeId || !spaceId || !hold) {
    return NextResponse.json({ error: "facility, spaceTypeId, spaceId, hold required" }, { status: 400 });
  }
  try {
    const traceId = req.headers.get("x-checkout-trace") ?? undefined;
    const quote = await quoteRentalCost(cfg.gdsFacilityId, spaceTypeId, { spaceId, hold, discountIds, insuranceId, moveinDate }, traceId);
    return NextResponse.json({ costs: quote.costs, totalDue: costArrayTotal(quote.costs), billingDate: quote.billingDate ?? null });
  } catch (e) {
    if (e instanceof NectarError) return NextResponse.json({ error: "Could not price this space — the hold may have expired", requestId: e.requestId }, { status: 410 });
    throw e;
  }
}
