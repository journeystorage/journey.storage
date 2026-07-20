// POST /api/nectar/checkout/hold   { facility, spaceTypeId }         -> { hold, spaceId, expiresAt }
// PUT  /api/nectar/checkout/hold   { facility, spaceId, hold }       -> { hold, expiresAt }  (extend)
// Holds last 15 minutes; the UI should show a countdown from expiresAt.

import { NextRequest, NextResponse } from "next/server";
import { facilityBySlug } from "@/lib/nectar/facilities";
import { holdSpace, extendHold } from "@/lib/nectar/spaces";
import { NectarError } from "@/lib/nectar/client";

const HOLD_TTL_MS = 15 * 60 * 1000;

export async function POST(req: NextRequest) {
  const { facility, spaceTypeId } = await req.json();
  const cfg = facilityBySlug(facility);
  if (!cfg || !spaceTypeId) return NextResponse.json({ error: "facility and spaceTypeId required" }, { status: 400 });
  try {
    const traceId = req.headers.get("x-checkout-trace") ?? undefined;
    const { hold, spaceId } = await holdSpace(cfg.gdsFacilityId, spaceTypeId, traceId);
    return NextResponse.json({ hold, spaceId, expiresAt: Date.now() + HOLD_TTL_MS });
  } catch (e) {
    if (e instanceof NectarError) return NextResponse.json({ error: "No space available right now" }, { status: 409 });
    throw e;
  }
}

export async function PUT(req: NextRequest) {
  const { facility, spaceId, hold } = await req.json();
  const cfg = facilityBySlug(facility);
  if (!cfg || !spaceId || !hold) return NextResponse.json({ error: "facility, spaceId, hold required" }, { status: 400 });
  try {
    const res = await extendHold(cfg.gdsFacilityId, spaceId, hold);
    return NextResponse.json({ hold: res.hold ?? hold, expiresAt: Date.now() + HOLD_TTL_MS });
  } catch {
    return NextResponse.json({ error: "Hold expired — please restart checkout" }, { status: 410 });
  }
}
