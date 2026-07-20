// POST /api/nectar/checkout/rent — the move-in.
// Body: { facility, spaceTypeId, spaceId, hold, insuranceId?, discountIds?, autopay?,
//         moveinDate?, tenant: { first, last, email, phone, address1, address2?, city,
//         stateCode, postalCode, dob? }, card: { name, number, cvv, expiration, zip },
//         billing?: address override }
// Card data: transits this handler once, is forwarded to Nectar over TLS, and is
// never stored or logged (client.ts redacts payment fields from error logs).
// Re-quotes server-side and derives paymentAmount itself — never trust a
// client-supplied total.

import { NextRequest, NextResponse } from "next/server";
import { facilityBySlug } from "@/lib/nectar/facilities";
import { quoteRentalCost } from "@/lib/nectar/spaces";
import { createRental } from "@/lib/nectar/rentals";
import { NectarError } from "@/lib/nectar/client";
import { costArrayTotal, type Contact } from "@/lib/nectar/types";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const cfg = facilityBySlug(body.facility);
  if (!cfg) return NextResponse.json({ error: "Unknown facility" }, { status: 404 });
  const { spaceTypeId, spaceId, hold, insuranceId, discountIds, autopay, moveinDate, tenant, card } = body ?? {};
  if (!spaceTypeId || !spaceId || !hold || !tenant?.email || !tenant?.phone || !card?.number) {
    return NextResponse.json({ error: "Missing required checkout fields" }, { status: 400 });
  }

  const traceId = req.headers.get("x-checkout-trace") ?? undefined;
  const address = {
    name: `${tenant.first} ${tenant.last}`,
    address1: tenant.address1,
    address2: tenant.address2 ?? "",
    city: tenant.city,
    stateCode: tenant.stateCode,
    postalCode: tenant.postalCode,
  };
  const billing = body.billing ?? address; // billing address is MANDATORY on the API

  try {
    // 1) Authoritative re-quote (also validates the hold is still alive).
    const quote = await quoteRentalCost(cfg.gdsFacilityId, spaceTypeId, { spaceId, hold, discountIds, insuranceId, moveinDate }, traceId);
    const paymentAmount = costArrayTotal(quote.costs);

    // 2) Move-in.
    const primary: Contact = {
      type: "primary",
      email: tenant.email,
      name: { first: tenant.first, last: tenant.last, middle: "", prefix: "", company: "" },
      address,
      phones: [{ description: "cell", number: toE164(tenant.phone), type: "cell" }],
      accessAuthorized: true,
    };

    const result = await createRental(
      cfg.gdsFacilityId,
      {
        spaceType: spaceTypeId,
        space: spaceId,
        hold,
        paymentAmount,
        paymentInstrument: { card, address: billing },
        tenantInfo: { contacts: [primary], alternateDeclined: true, business: false, dob: tenant.dob ?? "" },
        autopay: !!autopay,
        discountIds: discountIds ?? [],
        insuranceId: insuranceId ?? "",
        moveinDate,
        tracking: {
          touchpoints: [
            {
              platform_source: "journey.storage website",
              platform_device: req.headers.get("user-agent") ?? "",
              record_type: "touchpoint",
              referrer_channel: "online",
              referrer_request_url: req.headers.get("referer") ?? "https://journey.storage/rentaspace",
              referrer_timestamp: new Date().toISOString(),
            },
          ],
        },
      },
      traceId,
    );

    // 3) Confirmation payload — only what the UI needs (no SSN/DL fields).
    const space = result.spaces?.find((s) => s.spaceId === spaceId) ?? result.spaces?.[0];
    return NextResponse.json({
      tenantId: result.id,
      spaceNumber: space?.spaceNumber ?? "",
      leaseId: space?.leaseId ?? "",
      gateCode: space?.gateAccess?.pin || space?.accessCode || null,
      paidAmount: paymentAmount,
      documents: (space?.documents ?? []).map((d) => ({ name: d.Name, url: d.Location })),
      autopayEnabled: !!space?.autoPay?.enabled,
    });
  } catch (e) {
    if (e instanceof NectarError) {
      return NextResponse.json(
        { error: friendlyError(e), requestId: e.requestId },
        { status: e.code === "PermissionDenied" || e.code === "APIKeyInvalid" ? 502 : 402 },
      );
    }
    throw e;
  }
}

function toE164(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 ? `+1${digits}` : `+${digits}`;
}

function friendlyError(e: NectarError): string {
  if (e.isAuthError) return "We hit a configuration problem — please call the office to finish your rental.";
  return "Your payment could not be completed. Please check your card details and try again.";
}
