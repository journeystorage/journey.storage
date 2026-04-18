'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronDown } from 'lucide-react'
import ScrollReveal from '@/components/ui/ScrollReveal'

const jonahChips = [
  'Acquisitions', 'Asset Management', 'Development', 'Investor Relations',
  'Construction', 'Capital Raising', 'Facility Operations',
  'Technology Implementation', 'Deal Structuring', 'Property Management',
]

const lyviaChips = [
  'Financial Execution', 'Asset Management', 'Accounting Controls',
  'Corporate Structure', 'Treasury Management', 'Tax Strategy',
  'Internal Operations', 'HR & Compliance', 'Investor Reporting', 'Lender Relations',
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
    <section id="team" className="relative overflow-hidden bg-warm-white py-20 md:py-24 lg:py-32">
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
            Not syndicators.<br />
            Not fund managers.<br />
            Operators.
          </h2>
        </ScrollReveal>

        {/* Jonah: photo left, bio right */}
        <ScrollReveal delay={160}>
          <div className="grid gap-8 lg:gap-14 lg:grid-cols-[2fr_3fr] items-start">
            <div className="relative aspect-square rounded-lg overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.15)]">
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

              {/* Tagline */}
              <p className="mt-3 text-body-sm tracking-wide text-charcoal/50">
                Mission Driven &nbsp;|&nbsp; Truth Seeker &nbsp;|&nbsp; Servant Leader &nbsp;|&nbsp; Empire Builder
              </p>

              <p className="mt-5 text-body leading-[1.7] text-charcoal/80">
                A decade into the industry, Jonah has served in almost every capacity,
                wearing the hats and running point directly, as well as building the
                teams, systems and critical infrastructure around:
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
                      Born in the buckle of the Bible-belt (Springfield, MO), Jonah was raised in a disciplined, Christian, God-fearing family home. Along with his two younger brothers, he was homeschooled from kindergarten through high school, before attending Evangel University and graduating with degrees in Political Science and Philosophy.
                    </p>
                    <p>
                      When he was just 13 years old, his father was taken out of the workforce due to a battle with Lyme&apos;s disease, sending Jonah into the workforce himself and forcing him to &ldquo;grow up&rdquo; faster than his peers. Just after college, he moved his family to Texas looking for a new opportunity. A few years in manual labor and customer service roles left him looking for his purpose.
                    </p>
                    <p>
                      He took an asset manager role with a family office in Garland, TX in 2016, where he managed ~$100M of commercial real estate and was mentored by the successful principal of the firm. In 2017, he was given the opportunity to find an alternative use for a Dollar General store that had gone dark, leading to his first industry adaptive reuse project and the moment that he likes to say self-storage &ldquo;found him&rdquo;.
                    </p>
                    <p>
                      His career took off in 2020, when he co-founded Smartlock Self Storage&reg; and rapidly scaled it from a startup to a vertically integrated staff of eighteen; and from inception to ~$70M+ in AUM across seventeen (17) locations in three states, pioneering self-service and the autonomous customer journey. Jonah resigned from day-to-day operations in 2024 when it became clear the partnership would not continue.
                    </p>
                    <p>
                      In 2024, Jonah partnered with Cedar Creek Capital&reg;, joining as President &amp; Chief Investment Officer. Originally brought in to reposition the portfolio, overhaul operations and implement the autonomous customer journey, Jonah quickly recognized the need for leadership. In under two years, Jonah transformed a dysfunctional team of seventy into a higher performing team of fifty-four, cutting nearly $1M in payroll and creating even more capacity, all while exiting or repositioning over ~$150M in existing assets and acquiring $60M in new assets.
                    </p>
                    <p>
                      As a Missouri native, he loves his Kansas City Chiefs and you&apos;ll often see him sporting his Jersey on Red Friday, game day or after a big win. He resides in Dallas, TX and spends all of his non-working hours with his two young entrepreneurs-in-training, Elisa (9) and Braden (7).
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
            <div className="lg:order-2 relative aspect-square rounded-lg overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.15)]">
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

              {/* Tagline */}
              <p className="mt-3 text-body-sm tracking-wide text-charcoal/50">
                Visionary Strategist &nbsp;|&nbsp; Portfolio Architect &nbsp;|&nbsp; Servant Leader &nbsp;|&nbsp; Empire Builder
              </p>

              <p className="mt-5 text-body leading-[1.7] text-charcoal/80">
                Over the last 12+ years, Lyvia has overseen complex, multi-entity
                structures, spanning 50+ entities, driving strategy, discipline, and
                performance across:
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
                      Born and raised in Rio de Janeiro, Brazil, Lyvia&apos;s relentless drive was forged on the tennis court. Earning a collegiate tennis scholarship, she graduated with degrees in Business Administration and Management from Dallas Baptist University, translating her fierce competitive focus directly into the corporate arena. Grounded in an abundance mindset and a deep dedication to faith, she builds systems designed to sustain long-term, generational wealth.
                    </p>
                    <p>
                      Her operational expertise and financial acumen were honed through rigorous leadership roles, including serving as Financial Controller of a multifamily and hospitality private equity firm and the director of finance for previous storage ventures, including Smartlock Self Storage&reg;. In these capacities, she directed critical financial operations&mdash;managing complex acquisitions, month-end closings, and intercompany reconciliations&mdash;overseeing complex transactions in real estate, securities, and alternative assets and providing the foundational controls necessary to support a scaling $70M+ self-storage portfolio across seventeen (17) locations in three states.
                    </p>
                    <p>
                      When the time came to pivot, Lyvia masterminded the complex divestiture from legacy operations. She executed the critical settlement agreements and mutual releases that secured the family&apos;s assets, severing legacy ties and establishing total operational sovereignty for their current empire.
                    </p>
                    <p>
                      Today, Lyvia drives the overarching operational strategy and structure of the ecosystem. She dictates the portfolio&apos;s trajectory by directing capital allocation, executing on the investment thesis, structuring entity development, mentoring high-performing teams, and rigorously preserving the organization&apos;s &ldquo;Empire-Building Grit.&rdquo; Her ability to drive financial strategy, operational discipline, and portfolio performance across complex, multi-entity structures positions her as a key driver of performance across acquisitions, development, and stabilized assets.
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
