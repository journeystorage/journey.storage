// POST   /api/nectar/account/autopay  { facilityId, tenantId, spaceId, card, billing } — enable
// DELETE /api/nectar/account/autopay  { facilityId, tenantId, spaceId }                — disable

import { NextRequest, NextResponse } from "next/server";
import { enableAutopay, disableAutopay } from "@/lib/nectar/payments";
import { NectarError } from "@/lib/nectar/client";

export async function POST(req: NextRequest) {
  const { facilityId, tenantId, spaceId, card, billing } = await req.json();
  if (!facilityId || !tenantId || !spaceId || !card || !billing) {
    return NextResponse.json({ error: "facilityId, tenantId, spaceId, card, billing required" }, { status: 400 });
  }
  try {
    await enableAutopay(facilityId, tenantId, { paymentInstrument: { card, address: billing }, spaceId });
    return NextResponse.json({ enabled: true });
  } catch (e) {
    if (e instanceof NectarError) return NextResponse.json({ error: "Could not enable autopay", requestId: e.requestId }, { status: 402 });
    throw e;
  }
}

export async function DELETE(req: NextRequest) {
  const { facilityId, tenantId, spaceId } = await req.json();
  if (!facilityId || !tenantId || !spaceId) return NextResponse.json({ error: "facilityId, tenantId, spaceId required" }, { status: 400 });
  try {
    await disableAutopay(facilityId, tenantId, spaceId);
    return NextResponse.json({ enabled: false });
  } catch (e) {
    if (e instanceof NectarError) return NextResponse.json({ error: "Could not disable autopay", requestId: e.requestId }, { status: 502 });
    throw e;
  }
}
