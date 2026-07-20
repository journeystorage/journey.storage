// POST /api/nectar/account/pay
// Dues:   { facilityId, tenantId, spaceId, card, billing }                    (periods 0)
// Prepay: { facilityId, tenantId, spaceId, card, billing, periods: n >= 1 }
// GET /api/nectar/account/pay?facilityId=&tenantId=&spaceId=&periods=n  -> prepay quote
// Server derives paymentAmount from live data — never trusts a client total.

import { NextRequest, NextResponse } from "next/server";
import { getTenant } from "@/lib/nectar/tenants";
import { quotePrepay, payBill } from "@/lib/nectar/payments";
import { NectarError } from "@/lib/nectar/client";
import { costArrayTotal } from "@/lib/nectar/types";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams;
  const [facilityId, tenantId, spaceId] = [q.get("facilityId"), q.get("tenantId"), q.get("spaceId")];
  const periods = Number(q.get("periods") ?? 1);
  if (!facilityId || !tenantId || !spaceId || periods < 1) return NextResponse.json({ error: "facilityId, tenantId, spaceId, periods>=1 required" }, { status: 400 });
  const quote = await quotePrepay(facilityId, tenantId, spaceId, periods);
  const total = Object.values(quote.prepay ?? quote.costs ?? {}).reduce((acc, arr) => acc + costArrayTotal(arr), 0);
  return NextResponse.json({ quote, totalDue: total, currentDue: costArrayTotal(quote.current) });
}

export async function POST(req: NextRequest) {
  const { facilityId, tenantId, spaceId, card, billing, periods = 0 } = await req.json();
  if (!facilityId || !tenantId || !spaceId || !card || !billing) {
    return NextResponse.json({ error: "facilityId, tenantId, spaceId, card, billing required" }, { status: 400 });
  }

  try {
    let paymentAmount: number;
    if (periods === 0) {
      // Current dues: authoritative amount from the live tenant balance.
      const tenant = await getTenant(facilityId, tenantId);
      const space = tenant.spaces.find((s) => s.spaceId === spaceId);
      if (!space) return NextResponse.json({ error: "Space not found on this account" }, { status: 404 });
      if (!space.allowOnlinePayment) return NextResponse.json({ error: "Online payment is not available for this space — please call the office" }, { status: 409 });
      paymentAmount = costArrayTotal(space.balance);
      if (paymentAmount <= 0) return NextResponse.json({ error: "Nothing due — use prepay (periods >= 1) to pay ahead" }, { status: 409 });
    } else {
      const quote = await quotePrepay(facilityId, tenantId, spaceId, periods);
      paymentAmount = Object.values(quote.prepay ?? quote.costs ?? {}).reduce((acc, arr) => acc + costArrayTotal(arr), 0);
    }

    await payBill(facilityId, tenantId, { paymentAmount, paymentInstrument: { card, address: billing }, spaceId, periods });
    return NextResponse.json({ paid: paymentAmount, periods });
  } catch (e) {
    if (e instanceof NectarError) return NextResponse.json({ error: "Payment failed — please check your card details", requestId: e.requestId }, { status: 402 });
    throw e;
  }
}
