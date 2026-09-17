// POST /api/nectar/checkout/rent
// Commit an online move-in via the verified Direct Rental flow:
//   lease-set-up (authoritative cost) → documents/finalize (auto-signs) → lease (pending).
// Verified end-to-end against the sandbox (returns lease_id + gate PIN).
// Card data is server-side only and never logged. Gated behind
// NECTAR_CHECKOUT_LIVE so it stays dormant until deliberately switched on.

import { NextRequest, NextResponse } from 'next/server'
import { facilityBySlug } from '@/lib/nectar/facilities'
import { completeRental, type Tenant, type Card } from '@/lib/nectar/rental'
import { VERIFY_COOKIE, readSession } from '@/lib/account-verify'
import { getContactBasics } from '@/lib/nectar/account'
import { sendMoveInConfirmation } from '@/lib/move-in-email'
import { sendLeadNotification } from '@/lib/lead-email'
import { classifyFailure } from '@/lib/nectar/failure'

interface RentBody {
  facility?: string
  unitId?: string
  holdToken?: string
  dossierToken?: string
  spaceMixId?: string
  startDate?: string
  // From the single quote the client already fetched (do NOT re-run lease-setup:
  // a second lease-setup on the same hold makes the lease step 500).
  billDay?: number
  webRate?: number
  totalDue?: number
  lineItems?: Array<{ name: string; amount: number }>
  promotionIds?: string[]
  insuranceId?: string
  /** Display label for the confirmation email, e.g. "10 × 10 · Climate Controlled". */
  spaceLabel?: string
  tenant?: Tenant
  card?: Card
  /** Tenant asked for autopay; staff must enable it (API cannot). */
  autopayRequested?: boolean
  /**
   * True only when the flow was launched from inside verified Pay Bill, i.e.
   * the tenant is knowingly adding a space to their own account. A rental
   * started from the public site must never attach to whoever last verified in
   * this browser, so the verified cookie is honoured only alongside this flag.
   * The flag alone grants nothing — the signed cookie is still required.
   */
  onAccount?: boolean
}

export async function POST(req: NextRequest) {
  if (process.env.NECTAR_CHECKOUT_LIVE !== 'true') {
    return NextResponse.json({ error: 'Online rental completes by phone for now — please call to finish.' }, { status: 503 })
  }
  let body: RentBody
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }) }
  const cfg = body.facility ? facilityBySlug(body.facility) : undefined
  if (!cfg) return NextResponse.json({ error: 'Unknown facility' }, { status: 404 })
  const { unitId, holdToken, startDate, tenant, card, lineItems, billDay, webRate, totalDue } = body
  // A verified tenant adding another space: the lease attaches to their existing
  // contact, so their personal details are neither needed nor trusted from the
  // browser. The cookie is signed server-side and cannot be forged — but it is
  // only consulted when the client says this is an on-account rental, so a
  // public rental in the same browser stays a brand-new tenant.
  const existingContactId = body.onAccount === true
    ? readSession(req.cookies.get(VERIFY_COOKIE)?.value)?.contactId ?? undefined
    : undefined
  if (body.onAccount === true && !existingContactId) {
    return NextResponse.json(
      { error: 'Your sign-in expired — please verify your account again.', needsVerification: true },
      { status: 401 },
    )
  }
  const needsDetails = !existingContactId
  if (!unitId || !holdToken || !startDate || !card?.card_number || !lineItems?.length || billDay == null) {
    return NextResponse.json({ error: 'Missing rental details.' }, { status: 400 })
  }
  if (needsDetails && !tenant?.email) {
    return NextResponse.json({ error: 'Missing rental details.' }, { status: 400 })
  }
  try {
    // For a verified tenant, name and email come off their contact record —
    // never from the browser, which sends no personal details in that flow.
    const basics = existingContactId ? await getContactBasics(existingContactId) : null
    const result = await completeRental({
      existingContactId,
      unitId,
      holdToken,
      dossierToken: body.dossierToken,
      spaceMixId: body.spaceMixId,
      startDate,
      billDay,
      webRate: webRate ?? 0,
      totalDue: totalDue ?? 0,
      lineItems,
      promotionIds: body.promotionIds,
      insuranceId: body.insuranceId,
      tenant,
      card,
      metadata: {
        ip: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '',
        user_agent: req.headers.get('user-agent') || 'Mozilla/5.0',
      },
    })
    // Branded move-in confirmation (fire-and-forget — the rental is already
    // committed and charged, so email trouble must never fail this response).
    await sendMoveInConfirmation({
      facilitySlug: cfg.slug,
      tenantFirst: basics?.first ?? tenant?.first ?? '',
      tenantEmail: basics?.email ?? tenant?.email ?? '',
      spaceLabel: body.spaceLabel,
      unitNumber: result.unitNumber ?? null,
      startDate,
      billDay,
      lineItems,
      totalDue: totalDue ?? 0,
      gatePin: result.gatePin ?? null,
      signed: result.signed,
      documentUrl: result.documentUrl ?? null,
      autopayRequested: body.autopayRequested === true,
    })

    // Autopay can't be enabled through the API (verified on live data: a lease
    // created here with auto_charge:true still came back auto_pay = 0), so the
    // tenant's request is routed to staff to set up in the back office.
    if (body.autopayRequested === true) {
      const who = [basics?.first, basics?.last].filter(Boolean).join(' ') || [tenant?.first, tenant?.last].filter(Boolean).join(' ') || 'New tenant'
      await sendLeadNotification({
        name: who,
        email: basics?.email ?? tenant?.email ?? '',
        phone: tenant?.phone,
        formSource: 'autopay-request',
        message: `AUTOPAY REQUESTED — please enable it in Hummingbird.\n\nTenant: ${who}\nFacility: ${cfg.displayName}\nUnit: ${result.unitNumber ?? '(see lease)'}\nLease: ${result.leaseId}\nBills the ${billDay} of each month.\n\nThe tenant ticked "Set up autopay" at checkout and their card is on file. The API cannot switch autopay on, so it needs doing in the back office.`,
      }).catch(() => {})
    }

    // Never echo card data. Confirmation-safe fields only.
    return NextResponse.json({
      ok: true,
      leaseId: result.leaseId,
      unitNumber: result.unitNumber ?? null,
      gatePin: result.gatePin ?? null,
      signed: result.signed,
      documentUrl: result.documentUrl ?? null,
      status: result.status ?? null,
    })
  } catch (err) {
    // Say WHAT failed. A declined card and a provider outage need completely
    // different things from the renter, and the old single message told them
    // neither — while throwing away the only record of the real cause.
    const f = classifyFailure(err, { facility: cfg.slug, unitId, startDate })
    // A failed online rental is a customer about to be lost, and production
    // logs aren't reachable from a dev machine — so email staff the renter's
    // details together with the provider's own words. They can finish the
    // rental by phone, and we get the real cause without guessing.
    const who = [tenant?.first, tenant?.last].filter(Boolean).join(' ') || 'Online renter'
    await sendLeadNotification({
      name: who,
      email: tenant?.email ?? '',
      phone: tenant?.phone,
      formSource: 'rental-failed',
      subject: `Online rental FAILED — ${who} at ${cfg.displayName}`,
      message: [
        `ONLINE RENTAL FAILED — please call this person back.`,
        ``,
        `Renter:   ${who}${tenant?.email ? ` <${tenant.email}>` : ''}${tenant?.phone ? ` · ${tenant.phone}` : ''}`,
        `Facility: ${cfg.displayName}`,
        `Space:    ${body.spaceLabel ?? '(not recorded)'}`,
        `Move-in:  ${startDate}`,
        `Due today: $${(totalDue ?? 0).toFixed(2)}`,
        ``,
        `What we told them: ${f.message}`,
        ``,
        `--- for the Tenant Inc ticket ---`,
        `Reference:        ${f.reference}`,
        `Classified as:    ${f.kind}`,
        `Provider status:  ${f.providerStatus ?? '(none)'}`,
        `Provider message: ${f.providerMessage ?? '(none)'}`,
        `Unit id:          ${unitId}`,
      ].join('\n'),
    }).catch(() => {})
    return NextResponse.json(
      { error: f.message, kind: f.kind, retryCard: f.retryCard, reference: f.reference },
      { status: f.status },
    )
  }
}
