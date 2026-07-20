// POST /api/nectar/account/moveout
// { leaseId, contactId, spaceNumber, moveOutDate: "YYYY-MM-DD", note? }
// Hummingbird-passthrough move-out: metrics -> deposit -> note -> close.
// leaseId/contactId here are HUMMINGBIRD ids (from the tenant's pmsId fields),
// not GDS ids. The documented flow assumes no outstanding balance — check the
// tenant balance via /account/lookup first and route to Pay Bill if non-zero.

import { NextRequest, NextResponse } from "next/server";
import { getLeaseMetrics, getSecurityDeposit, addMoveOutNote, closeLease } from "@/lib/nectar/moveout";
import { NectarError } from "@/lib/nectar/client";

export async function POST(req: NextRequest) {
  const { leaseId, contactId, spaceNumber, moveOutDate, note } = await req.json();
  if (!leaseId || !contactId || !moveOutDate) {
    return NextResponse.json({ error: "leaseId, contactId, moveOutDate required" }, { status: 400 });
  }
  try {
    const metrics = await getLeaseMetrics(leaseId);
    const deposit = await getSecurityDeposit(leaseId);

    await addMoveOutNote(contactId, leaseId, spaceNumber ?? "", note ?? `Move-out requested online for ${moveOutDate} via journey.storage`);
    await closeLease(leaseId, moveOutDate);

    return NextResponse.json({
      closed: true,
      paidThrough: metrics.paid_through_date,
      prepaidBalance: metrics.prepaid_balance,
      hadAutopay: metrics.has_autopay,
      securityDeposit: deposit, // refunds are handled by the office; must be < deposit
    });
  } catch (e) {
    if (e instanceof NectarError) {
      return NextResponse.json({ error: "Move-out could not be completed online — please call the office", requestId: e.requestId }, { status: 502 });
    }
    throw e;
  }
}
