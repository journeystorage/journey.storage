# Pipeline — Journey.Storage online systems

Running list of what's outstanding on the rental flow, Pay Bill and the
operational alerting. Newest findings at the top of each section.
Last reviewed: 2026-09-18.

---

## Blocked on Tenant Inc

**Pay Bill cannot take a card.** `POST companies/{co}/leases/{id}/payment`
returns HTTP 500 `Cannot read properties of undefined (reading 'contact_id')`
— an unhandled crash in their code, not a validation or card problem. We
cannot work around it: the endpoint accepts only `payment_amount` and
`payment_method_id` (34 other field names rejected), and no alternative charge
endpoint exists. `NECTAR_BILLPAY_LIVE=false`, so tenants get the "pay by
phone" panel. Ticket text is in the session notes.

**Rentals do not always collect.** The rental flow never charges at checkout —
Tenant stores the card and collects afterwards. Where autopay enrols, money
arrives same day or next. Where it doesn't, it never arrives at all.

**No API way to change an autopay card**, so Pay Bill's autopay controls are
status-only.

---

## Ready to build

**Capture a card in Pay Bill even though charging is broken.** `auto_charge:
true` on a stored payment method *does* enrol autopay — that part works. So a
tenant who owes money could add a card and have the balance collected on the
next run, without us ever calling the broken charge endpoint. Of 200 sampled
leases, **16 owe money with no card on file at all** (~44 across the
portfolio). This is the single biggest recoverable amount available to us.

**Stop claiming "Paid" before the money lands.** The confirmation screen shows
"Paid $87.00" and the move-in email says "Payment received", both asserted by
us rather than verified. It was wrong three times this week — A083 (collected
a day later), B210 and Clifford Bishop (never collected). Deliberately parked,
2026-09-18.

**Root SPF and DMARC.** journey.storage has neither, which affects mail sent by
hand from Google Workspace. Resend's own records are done and verified.

---

## Worth considering

- **A tenant gets no receipt after paying online** — staff are notified, the
  tenant isn't. Add one when charging works again.
- **No self-serve gate code.** If a tenant loses it, they must call. It's in
  the move-in email only.
- **No partial payments** in Pay Bill — all or nothing on each lease.
- **Codes are email only.** Every active tenant has an email on file (checked:
  0 of 549 missing), so this is not urgent, but 6 have no phone and an SMS
  option would help anyone whose email bounces.
- **5×5 appears in the size guide** but exists in no facility's inventory.
- **Unpriced back-office sizes** (10×16, 20×20, 20×24, 20×25, 25×50) have no
  art and no price.
- **`noAutopay` and `delinquency` overlap** in the sweep — the same lease
  appears in both when someone is late *and* unenrolled.

---

## Not to do

**Do not replace or recolour the logo files.** Brand Guide v3.0 locks them and
the orange (`#E8622A`). This was listed here as "ready to build" from the
superseded v2 guide — acting on it is what got reverted on 2026-09-18.

---

## Done (for reference)

- Daily ops sweep + GitHub Actions schedule, urgent alerts and a daily digest
- People signals: abandoned checkouts, unused sign-in codes, repeated card failures
- Every email on Brand Guide v3.0 — Lato, locked logo and orange; JOURNEY.STORAGE™ sender
- Resend domain verified, so tenant emails actually reach tenants
- One-time Pay Bill sign-in; rental and Pay Bill sessions fully separated
- Card field formatting, and the expiry-truncation bug that broke live rentals
