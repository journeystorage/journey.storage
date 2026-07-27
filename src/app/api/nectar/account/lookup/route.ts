// Account lookup — deferred.
// The online-rental / account flows target v2 endpoints not yet verified against the
// live API, and require the production Granbury property ids (still pending from Tenant Inc).
// Until then these return 503 so the reserve-by-phone fallback stays the path of record.

import { NextResponse } from "next/server";

const unavailable = () =>
  NextResponse.json({ error: "Online rental is not available yet — please reserve by phone." }, { status: 503 });

export const POST = unavailable;

