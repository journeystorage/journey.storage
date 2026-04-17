'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import ScrollReveal from '@/components/ui/ScrollReveal'

const faqs = [
  {
    q: 'What is Journey.Direct?',
    a: 'Journey.Direct is the investment platform within the Journey.Storage ecosystem. We structure direct investment opportunities in self-storage assets \u2014 acquired, operated, and managed by our team. Investors participate as limited partners in individual deals.',
  },
  {
    q: 'Who can invest?',
    a: 'Journey.Direct offerings are available to accredited investors as defined by SEC regulations. During our introductory call, we\u2019ll confirm eligibility and walk you through the verification process.',
  },
  {
    q: 'What type of deals do you focus on?',
    a: 'Value-add acquisitions in Tier 1-3 U.S. markets. We target existing facilities that are underperforming due to outdated operations, poor revenue management, or lack of technology adoption. We buy below replacement cost and execute a defined operational improvement plan.',
  },
  {
    q: 'How is Journey.Direct different from a REIT or syndication?',
    a: 'We are operators first. The team acquiring and managing your investment is the same team that runs the facilities day-to-day. There\u2019s no separation between the investment side and the operational side. This alignment means we catch problems early, move faster on value-add initiatives, and maintain tighter cost control than passive sponsors.',
  },
  {
    q: 'What is the typical hold period?',
    a: 'Our targeted hold period is approximately five years, though this varies by deal. We typically pursue a cash-out refinance midway through the hold to return a portion of invested capital while retaining upside.',
  },
  {
    q: 'What returns can I expect?',
    a: 'We share detailed return projections \u2014 including downside, expected, and upside scenarios \u2014 during the private platform overview after our initial call. All projections are forward-looking estimates based on assumptions and are not guarantees of future performance.',
  },
  {
    q: 'Does the sponsor co-invest?',
    a: 'Yes. The sponsor invests alongside limited partners in every deal. We believe alignment of interest is non-negotiable.',
  },
  {
    q: 'How do I receive updates on my investment?',
    a: 'Investors receive quarterly reports covering occupancy, revenue, expenses, and strategic updates. You\u2019ll also have direct access to our team \u2014 not a portal, not an AI, a person.',
  },
  {
    q: 'What are the fees?',
    a: 'Fee structures are detailed in each deal\u2019s offering documents and are discussed transparently during the platform overview call. We structure fees to align sponsor and investor incentives.',
  },
  {
    q: 'What if I have more questions?',
    a: 'Book a call. We prefer direct conversation over email chains. You\u2019ll speak with Jonah directly \u2014 not an associate, not a sales team.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (i: number) => {
    setOpenIndex(prev => (prev === i ? null : i))
  }

  return (
    <section id="faq" className="relative overflow-hidden bg-warm-white py-20 md:py-24 lg:py-32">
      <div className="relative z-10 mx-auto w-full max-w-[var(--container-content)] px-5 md:px-8 lg:px-16">

        {/* Section label */}
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-orange/60" />
            <span className="text-label font-bold uppercase tracking-[0.25em] text-orange">
              FAQ
            </span>
          </div>
        </ScrollReveal>

        {/* Headline: matches main + consulting pattern */}
        <ScrollReveal delay={80}>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-black leading-[0.95] mb-10 lg:mb-14">
            Questions?
            <br />
            <span className="font-light text-black/30">Answered.</span>
          </h2>
        </ScrollReveal>

        {/* Accordion */}
        <ScrollReveal delay={160}>
          <div className="max-w-[800px] divide-y divide-black/[0.08]">
            {faqs.map((faq, i) => {
              const isOpen = openIndex === i
              return (
                <div key={i}>
                  <button
                    onClick={() => toggle(i)}
                    className="w-full flex items-start justify-between gap-4 py-5 text-left cursor-pointer group"
                    aria-expanded={isOpen}
                  >
                    <span
                      className={`text-body font-bold transition-colors duration-200 ${
                        isOpen
                          ? 'text-orange'
                          : 'text-black/80 group-hover:text-black'
                      }`}
                    >
                      {faq.q}
                    </span>
                    <span className="shrink-0 mt-0.5">
                      {isOpen ? (
                        <Minus size={18} className="text-orange" />
                      ) : (
                        <Plus size={18} className="text-stone group-hover:text-charcoal transition-colors duration-200" />
                      )}
                    </span>
                  </button>
                  <div className={`faq-content ${isOpen ? 'open' : ''}`}>
                    <div>
                      <p className="pb-5 text-body-sm leading-[1.7] text-charcoal/70 pr-8">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
