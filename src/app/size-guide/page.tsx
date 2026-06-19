import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Storage Unit Size Guide | Journey.Storage',
  description:
    'Find the right storage unit size for your move, renovation, or seasonal needs. Compare dimensions, square footage, and what fits in each Journey self-storage unit.',
}

type Unit = {
  size: string
  sqft: number
  cubicFt: number
  fits: string
  comparison: string
  description: string
  rightSizeFor: string[]
  group: 'small' | 'medium' | 'large'
}

const UNITS: Unit[] = [
  {
    size: "5' x 5'",
    sqft: 25,
    cubicFt: 200,
    fits: 'A storage closet',
    comparison: 'Similar to a large standard closet',
    description:
      "Our smallest standard unit. The right fit for stashing away household items, small furniture, or seasonal belongings you don't need every day.",
    rightSizeFor: [
      'Up to 10 large moving boxes',
      'Seasonal clothing or shoes',
      'Sports gear or equipment',
      'A small desk or chair',
    ],
    group: 'small',
  },
  {
    size: "5' x 10'",
    sqft: 50,
    cubicFt: 400,
    fits: 'A studio apartment',
    comparison: 'Similar to a large walk-in closet or small shed',
    description:
      "A balance of space and versatility. Holds the contents of a mid-sized bedroom, dorm, or studio apartment, a few large furniture pieces plus boxes.",
    rightSizeFor: [
      '20+ large moving boxes',
      'A twin or full mattress',
      'A small office set-up',
      'Around 2 large furniture pieces',
    ],
    group: 'small',
  },
  {
    size: "5' x 15'",
    sqft: 75,
    cubicFt: 600,
    fits: 'A one-bedroom apartment',
    comparison: 'Similar to a large walk-in closet',
    description:
      "Fits the contents of an entire bedroom and a bit extra. A go-to choice if you're moving out of a small apartment, with room to walk around and browse.",
    rightSizeFor: [
      'Around 30 large moving boxes',
      'A bedroom furniture set',
      'A kitchen table',
      'Luggage and travel gear',
    ],
    group: 'medium',
  },
  {
    size: "10' x 10'",
    sqft: 100,
    cubicFt: 800,
    fits: 'Two small bedrooms',
    comparison: 'Similar to half of a one-car garage',
    description:
      "Space for an entire living area or two bedrooms, boxes and all. Spacious enough to store your stuff with room to spare.",
    rightSizeFor: [
      'Around 40 large moving boxes',
      'Large household furniture sets',
      'Appliances',
      'Seasonal clothing',
    ],
    group: 'medium',
  },
  {
    size: "10' x 15'",
    sqft: 150,
    cubicFt: 1200,
    fits: 'A two-bedroom home',
    comparison: 'Similar to a large bedroom',
    description:
      "Room for bulky furniture and appliances. Holds up to four rooms' worth of belongings, ideal for moving, decluttering, or freeing up your garage.",
    rightSizeFor: [
      'Around 60 large moving boxes',
      'Large furniture sets',
      'Small business inventory',
      'Kitchenware',
    ],
    group: 'large',
  },
  {
    size: "10' x 20'",
    sqft: 200,
    cubicFt: 1600,
    fits: 'A three-bedroom home',
    comparison: 'Similar to a standard one-car garage',
    description:
      "For when you need serious space. Five rooms' worth of belongings, living room sets, patio furniture, and full-sized appliances all fit comfortably.",
    rightSizeFor: [
      'Around 80 large moving boxes',
      'Full living and dining rooms',
      'Full kitchenware sets',
      'Major appliances',
    ],
    group: 'large',
  },
  {
    size: "10' x 30'",
    sqft: 300,
    cubicFt: 2400,
    fits: 'A four or five-bedroom home',
    comparison: 'Similar to a large one-car garage',
    description:
      "Our largest standard unit. Built for big moves, full home renovations, or storing the contents of a multi-bedroom house with room to maneuver.",
    rightSizeFor: [
      'Around 100+ large moving boxes',
      'Multiple bedroom sets',
      'Large appliances and furniture',
      'Long-term storage of vehicles or trailers (where permitted)',
    ],
    group: 'large',
  },
]

function UnitIllustration({ size, sqft }: { size: string; sqft: number }) {
  const scale = Math.min(1, Math.max(0.45, sqft / 300))
  const w = 240 * scale
  const h = 160 * scale
  return (
    <div
      className="relative flex h-44 w-full items-center justify-center rounded-md bg-warm-white/5 ring-1 ring-warm-white/10"
      aria-hidden="true"
    >
      <svg viewBox="0 0 240 160" width={w} height={h} className="overflow-visible">
        <rect x="20" y="20" width="200" height="120" rx="6" fill="none" stroke="#ff6b35" strokeWidth="2" strokeDasharray="4 4" />
        <line x1="60" y1="140" x2="60" y2="155" stroke="#ff6b35" strokeWidth="2" />
        <line x1="60" y1="155" x2="120" y2="155" stroke="#ff6b35" strokeWidth="2" />
        <text x="120" y="78" textAnchor="middle" fill="#f6f1e8" fontSize="22" fontWeight="700" letterSpacing="0.05em">
          {size}
        </text>
        <text x="120" y="102" textAnchor="middle" fill="#f6f1e8" opacity="0.6" fontSize="11" letterSpacing="0.15em">
          {sqft} SQ FT
        </text>
      </svg>
    </div>
  )
}

function SizeCard({ unit }: { unit: Unit }) {
  return (
    <article className="group flex flex-col rounded-lg bg-warm-white/[0.03] p-6 ring-1 ring-warm-white/10 transition hover:ring-orange/40">
      <UnitIllustration size={unit.size} sqft={unit.sqft} />

      <div className="mt-5 flex items-baseline justify-between gap-3">
        <h3 className="text-2xl font-bold tracking-tight text-warm-white">{unit.size}</h3>
        <span className="text-[0.7rem] font-bold uppercase tracking-[0.15em] text-orange">{unit.sqft} sq ft</span>
      </div>

      <p className="mt-1 text-sm text-warm-white/60">{unit.comparison}</p>

      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs uppercase tracking-[0.12em] text-warm-white/50">
        <span><span className="text-warm-white/80">{unit.sqft}</span> sq ft</span>
        <span><span className="text-warm-white/80">{unit.cubicFt.toLocaleString()}</span> cu ft</span>
        <span>Fits <span className="text-warm-white/80">{unit.fits}</span></span>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-warm-white/75">{unit.description}</p>

      <div className="mt-5">
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.15em] text-warm-white/60">The right size for</p>
        <ul className="mt-2 space-y-1 text-sm text-warm-white/80">
          {unit.rightSizeFor.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-orange" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 pt-6 border-t border-warm-white/10">
        <Link
          href={`/contact?unit=${encodeURIComponent(unit.size)}`}
          className="inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.15em] text-orange hover:text-warm-white transition"
        >
          Contact us about this size
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  )
}

export default function SizeGuidePage() {
  const small = UNITS.filter((u) => u.group === 'small')
  const medium = UNITS.filter((u) => u.group === 'medium')
  const large = UNITS.filter((u) => u.group === 'large')

  return (
    <main className="bg-black text-warm-white">
      <section className="relative overflow-hidden border-b border-warm-white/10">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-orange">Storage Unit Size Guide</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            Find the right size for what you need to store.
          </h1>
          <p className="mt-6 max-w-2xl text-base text-warm-white/70 md:text-lg">
            Not sure which unit fits your needs? This guide helps you visualize the right size, from a single closet of belongings up to a multi-bedroom home. Sizes are approximate and may vary by facility.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 text-[0.7rem] font-bold uppercase tracking-[0.15em] text-warm-white/60">
            <a href="#small" className="rounded-full border border-warm-white/15 px-4 py-2 hover:border-orange hover:text-orange transition">Small</a>
            <a href="#medium" className="rounded-full border border-warm-white/15 px-4 py-2 hover:border-orange hover:text-orange transition">Medium</a>
            <a href="#large" className="rounded-full border border-warm-white/15 px-4 py-2 hover:border-orange hover:text-orange transition">Large</a>
            <a href="#compare" className="rounded-full border border-warm-white/15 px-4 py-2 hover:border-orange hover:text-orange transition">Compare All</a>
          </div>
        </div>
      </section>

      <SizeGroupSection
        id="small"
        eyebrow="Small Units"
        title="For a closet, dorm, or studio."
        description="Perfect for seasonal items, small furniture, and the contents of a studio or one bedroom."
        units={small}
      />

      <SizeGroupSection
        id="medium"
        eyebrow="Medium Units"
        title="For one or two bedrooms."
        description="Fits the contents of a one to two bedroom apartment with room to walk around."
        units={medium}
        alt
      />

      <SizeGroupSection
        id="large"
        eyebrow="Large Units"
        title="For a whole home."
        description="Designed for moves, renovations, and full multi-bedroom homes."
        units={large}
      />

      <section id="compare" className="border-y border-warm-white/10 bg-warm-white/[0.02]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-orange">Side by side</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">Unit size comparison</h2>
          <p className="mt-3 max-w-2xl text-sm text-warm-white/70">All Journey self-storage sizes at a glance. Sizes are approximate and may vary by facility.</p>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="text-[0.7rem] uppercase tracking-[0.15em] text-warm-white/50">
                  <th className="border-b border-warm-white/10 py-3 pr-4 font-bold">Unit Size</th>
                  <th className="border-b border-warm-white/10 py-3 pr-4 font-bold">Square Feet</th>
                  <th className="border-b border-warm-white/10 py-3 pr-4 font-bold">Cubic Feet</th>
                  <th className="border-b border-warm-white/10 py-3 pr-4 font-bold">Fits The Contents Of</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {UNITS.map((u) => (
                  <tr key={u.size} className="border-b border-warm-white/5 last:border-b-0">
                    <td className="py-4 pr-4 font-bold text-warm-white">{u.size}</td>
                    <td className="py-4 pr-4 text-warm-white/80">{u.sqft}</td>
                    <td className="py-4 pr-4 text-warm-white/80">{u.cubicFt.toLocaleString()}</td>
                    <td className="py-4 pr-4 text-warm-white/80">{u.fits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="border-b border-warm-white/10">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-orange">Still not sure?</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            Tell us what you need to store. We'll help you pick the right size.
          </h2>
          <p className="mt-4 text-warm-white/70">
            Our team can walk you through unit options at the facility nearest you and answer any questions about availability, pricing, and features.
          </p>
          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 rounded-full bg-orange px-8 py-3 text-[0.75rem] font-bold uppercase tracking-[0.15em] text-black hover:bg-warm-white transition"
            >
              Contact Us
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

function SizeGroupSection({
  id,
  eyebrow,
  title,
  description,
  units,
  alt = false,
}: {
  id: string
  eyebrow: string
  title: string
  description: string
  units: Unit[]
  alt?: boolean
}) {
  return (
    <section id={id} className={alt ? 'bg-warm-white/[0.02]' : ''}>
      <div className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-orange">{eyebrow}</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
        <p className="mt-3 max-w-2xl text-sm text-warm-white/70 md:text-base">{description}</p>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {units.map((unit) => (
            <SizeCard key={unit.size} unit={unit} />
          ))}
        </div>
      </div>
    </section>
  )
}
