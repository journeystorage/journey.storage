import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Investment Disclaimer — Journey.Storage™',
}

export default function DisclaimerPage() {
  return (
    <article>
      <h1 className="text-h2 font-bold text-black">Investment disclaimer</h1>

      <div className="mt-6 space-y-4 text-body text-charcoal">
        <p>
          The information provided on this website and any affiliated
          properties (including direct.journey.storage and
          advisory.journey.storage) is for informational purposes only and
          does not constitute an offer to sell, a solicitation of an offer to
          buy, or a recommendation for any security, investment product, or
          investment strategy.
        </p>

        <p>
          Nothing on this website should be construed as investment advice,
          tax advice, legal advice, or financial planning advice.
          Journey.Storage™, Journey.Direct™, and Journey.Consulting™ do not
          make any representation or warranty, express or implied, regarding
          the accuracy, completeness, or reliability of any information
          presented.
        </p>

        <p>
          Any investment opportunities referenced on affiliated properties are
          available exclusively to accredited investors as defined under
          applicable securities regulations. Past performance is not
          indicative of future results. All investments involve risk,
          including the potential loss of principal.
        </p>

        <p>
          Prospective investors should consult with their own legal, tax, and
          financial advisors before making any investment decisions. Specific
          deal details, financial projections, and offering materials are
          provided only after direct inquiry and qualification.
        </p>
      </div>

      <p className="mt-6 text-body-sm text-stone">
        Last updated: March 2026
      </p>
    </article>
  )
}
