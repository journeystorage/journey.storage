'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronDown } from 'lucide-react'
import ScrollReveal from '@/components/ui/ScrollReveal'

const jonahChips = [
  'Acquisitions', 'Asset Management', 'Development', 'Capital Raising',
  'Deal Structuring', 'Construction', 'Property Management',
]

const lyviaChips = [
  'Capital Allocation', 'Treasury Management', 'Investor Reporting',
  'Refinance Execution', 'Tax Strategy', 'Banking Strategy', 'Entity Structuring',
]

const stats = [
  { value: '$200M+', label: 'Deals acquired & developed' },
  { value: '30+', label: 'Facilities managed' },
  { value: '50+', label: 'Entities structured' },
  { value: '18+', label: 'Years in the industry' },
]

export default function Leadership() {
  const [expandedBio, setExpandedBio] = useState<'jonah' | 'lyvia' | null>(null)

  const toggleBio = (name: 'jonah' | 'lyvia') => {
    setExpandedBio(prev => (prev === name ? null : name))
  }

  return (
    <section id="leadership" className="relative overflow-hidden bg-warm-white py-20 md:py-24 lg:py-32">
      <div className="relative z-10 mx-auto w-full max-w-[var(--container-content)] px-5 md:px-8 lg:px-16">

        {/* Section label */}
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-orange/60" />
            <span className="text-label font-bold uppercase tracking-[0.25em] text-orange">
              Leadership
            </span>
          </div>
        </ScrollReveal>

        {/* Headline */}
        <ScrollReveal delay={80}>
          <h2
            className="font-black leading-[0.95] tracking-[-0.03em] text-black mb-14 lg:mb-20"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            Not fund managers.<br />
            Operators.
          </h2>
        </ScrollReveal>

        {/* Jonah: photo left, bio right */}
        <ScrollReveal delay={160}>
          <div className="grid gap-8 lg:gap-14 lg:grid-cols-[2fr_3fr] items-start">
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.15)]">
              <Image
                src="/images/team/home-jonah-portrait.webp"
                alt="Jonah M. Hall, Co-Founder and CEO"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
                style={{ objectPosition: '50% 20%' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="text-h3 font-black text-black tracking-[-0.02em]">
                Jonah M. Hall
              </h3>
              <p className="mt-1 text-body-sm font-bold text-orange">
                Co-Founder &amp; CEO
              </p>
              <p className="mt-5 text-body leading-[1.7] text-charcoal/80">
                Nearly a decade inside self-storage. Not observing it from
                a spreadsheet, but building it from the ground up. Acquisitions.
                Development. Construction. Property management. Asset management.
                Investor relations. Capital raising. He&apos;s sat in every seat.
              </p>
              <p className="mt-3 text-body leading-[1.7] text-charcoal/80">
                $200M+ in transactions acquired and developed. Built and scaled
                a vertically integrated team from startup to ~$70M in AUM across
                17 locations.
              </p>

              {/* Expand full bio */}
              <button
                onClick={() => toggleBio('jonah')}
                className="mt-4 inline-flex items-center gap-1.5 text-body-sm font-bold text-orange hover:text-orange/80 transition-colors duration-200 cursor-pointer self-start"
              >
                {expandedBio === 'jonah' ? 'Read less' : 'Read full bio'}
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${expandedBio === 'jonah' ? 'rotate-180' : ''}`}
                />
              </button>
              <div className={`faq-content ${expandedBio === 'jonah' ? 'open' : ''}`}>
                <div>
                  <div className="mt-4 rounded-lg bg-black/[0.04] border border-black/[0.06] p-5 lg:p-6 space-y-3 text-body-sm leading-[1.7] text-charcoal/70">
                    <p>
                      Born in Springfield, MO, Jonah was raised in a disciplined, Christian family home. Homeschooled from kindergarten through high school, he attended Evangel University and graduated with degrees in Political Science and Philosophy.
                    </p>
                    <p>
                      When he was just 13 years old, his father was taken out of the workforce due to a battle with Lyme&apos;s disease, sending Jonah into the workforce himself. Just after college, he moved his family to Texas looking for a new opportunity.
                    </p>
                    <p>
                      He took an asset manager role with a family office in Garland, TX in 2016, where he managed ~$100M of commercial real estate. In 2017, he was given the opportunity to find an alternative use for a Dollar General store that had gone dark, leading to his first adaptive reuse project and the moment self-storage &ldquo;found him.&rdquo;
                    </p>
                    <p>
                      His career took off in 2020, when he co-founded Smartlock Self Storage and rapidly scaled it from a startup to a vertically integrated staff of eighteen, and from inception to ~$70M+ in AUM across seventeen locations in three states, pioneering self-service and the autonomous customer journey.
                    </p>
                    <p>
                      In 2024, Jonah partnered with Cedar Creek Capital, joining as President &amp; Chief Investment Officer. In under two years, he transformed a team of seventy into a higher performing team of fifty-four, cutting nearly $1M in payroll while exiting or repositioning over ~$150M in existing assets and acquiring $60M in new assets.
                    </p>
                    <p>
                      He resides in Dallas, TX and spends all of his non-working hours with his two young entrepreneurs-in-training, Elisa (9) and Braden (7).
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-1.5">
                {jonahChips.map(chip => (
                  <span
                    key={chip}
                    className="rounded-full bg-black/[0.05] border border-black/[0.08] px-3 py-1 text-[0.7rem] font-bold text-charcoal/70"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Lyvia: bio left, photo right (alternating) */}
        <ScrollReveal delay={260}>
          <div className="mt-14 lg:mt-20 grid gap-8 lg:gap-14 lg:grid-cols-[3fr_2fr] items-start">
            <div className="lg:order-2 relative aspect-[3/4] rounded-lg overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.15)]">
              <Image
                src="/images/team/home-lyvia-portrait.webp"
                alt="Lyvia Hall, Co-Founder and President"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
                style={{ objectPosition: '50% 20%' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
            <div className="lg:order-1 flex flex-col justify-center">
              <h3 className="text-h3 font-black text-black tracking-[-0.02em]">
                Lyvia Hall
              </h3>
              <p className="mt-1 text-body-sm font-bold text-orange">
                Co-Founder &amp; President
              </p>
              <p className="mt-5 text-body leading-[1.7] text-charcoal/80">
                Over 12 years directing complex, multi-entity financial structures
                spanning 50+ entities. From financial controller at RREAF/Gravitas
                Management to director of finance for previous storage ventures,
                overseeing the financial operations of a scaling $70M+ portfolio
                across 17 locations.
              </p>
              <p className="mt-3 text-body leading-[1.7] text-charcoal/80">
                Today, she drives the overarching operational strategy and
                structure of the ecosystem, directing capital allocation,
                structuring entity development, and executing on the investment thesis.
              </p>

              {/* Expand full bio */}
              <button
                onClick={() => toggleBio('lyvia')}
                className="mt-4 inline-flex items-center gap-1.5 text-body-sm font-bold text-orange hover:text-orange/80 transition-colors duration-200 cursor-pointer self-start"
              >
                {expandedBio === 'lyvia' ? 'Read less' : 'Read full bio'}
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${expandedBio === 'lyvia' ? 'rotate-180' : ''}`}
                />
              </button>
              <div className={`faq-content ${expandedBio === 'lyvia' ? 'open' : ''}`}>
                <div>
                  <div className="mt-4 rounded-lg bg-black/[0.04] border border-black/[0.06] p-5 lg:p-6 space-y-3 text-body-sm leading-[1.7] text-charcoal/70">
                    <p>
                      Born and raised in Rio de Janeiro, Brazil, Lyvia&apos;s relentless drive was forged on the tennis court. Earning a collegiate tennis scholarship, she graduated with degrees in Business Administration and Management from Dallas Baptist University, translating her fierce competitive focus directly into the corporate arena.
                    </p>
                    <p>
                      Her operational expertise and financial acumen were honed through rigorous leadership roles, including serving as Financial Controller of RREAF/Gravitas Management and the director of finance for previous storage ventures. In these capacities, she directed critical financial operations, managing complex acquisitions, month-end closings, and intercompany reconciliations across real estate, securities, and alternative assets.
                    </p>
                    <p>
                      When the time came to pivot, Lyvia masterminded the complex divestiture from legacy operations. She executed the critical settlement agreements and mutual releases that secured the family&apos;s assets, severing legacy ties and establishing total operational sovereignty.
                    </p>
                    <p>
                      Lyvia&apos;s motivations transcend corporate growth. She champions a massive, shared financial objective: building an enterprise capable of generating enough wealth to give half of it away to self-sustaining causes. She resides in Dallas, TX, balancing her executive leadership with raising their two young entrepreneurs-in-training, Elisa (9) and Braden (7).
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-1.5">
                {lyviaChips.map(chip => (
                  <span
                    key={chip}
                    className="rounded-full bg-black/[0.05] border border-black/[0.08] px-3 py-1 text-[0.7rem] font-bold text-charcoal/70"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Stats row */}
        <ScrollReveal delay={400}>
          <div className="mt-16 lg:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 pt-10 border-t border-black/[0.08]">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div
                  className="font-black text-black leading-none"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {stat.value.replace('+', '')}<span className="text-orange">+</span>
                </div>
                <p className="mt-2 text-body-sm text-stone">{stat.label}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
