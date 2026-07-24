import ScrollReveal from '@/components/ui/ScrollReveal'

const steps = [
  {
    number: '01',
    title: 'Explore',
    desc: 'Review the platform thesis, operator track record, and our current opportunities. Get a clear picture of how we invest and why.',
  },
  {
    number: '02',
    title: 'Connect',
    desc: 'Book a call with our team to discuss your investment objectives, get your questions answered, and determine alignment. No pressure. No pitch until you\u2019re ready.',
  },
  {
    number: '03',
    title: 'Review',
    desc: 'Qualified investors receive the complete deal package: market analysis, financial projections, investment terms, and risk factors.',
  },
  {
    number: '04',
    title: 'Invest',
    desc: 'Subscribe and deploy. Clear documentation. Direct communication throughout the hold period. Quarterly reporting.',
  },
]

export default function Process() {
  return (
    <section id="process" className="grain relative overflow-hidden bg-black py-16 md:py-20 lg:py-28">
      {/* Elevated surface */}
      <div className="absolute inset-0 bg-charcoal/[0.12]" />

      {/* Divider top */}
      <div className="absolute top-0 left-0 right-0 flex justify-center">
        <div className="w-16 h-[2px] bg-gradient-to-r from-orange/0 via-orange/25 to-orange/0" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[var(--container-content)] px-5 md:px-8 lg:px-16">

        {/* Section label */}
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-6 lg:justify-center">
            <div className="h-px w-8 bg-orange/60" />
            <span className="text-label font-bold uppercase tracking-[0.25em] text-orange">
              Process
            </span>
            <div className="h-px w-8 bg-orange/60 hidden lg:block" />
          </div>
        </ScrollReveal>

        {/* Headline */}
        <ScrollReveal delay={80}>
          <h2
            className="font-black leading-[0.95] tracking-[-0.03em] text-warm-white mb-12 lg:mb-16 lg:text-center"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            From interest to investment.
          </h2>
        </ScrollReveal>

        {/* Desktop: horizontal timeline */}
        <ScrollReveal delay={160}>
          <div className="hidden lg:block">
            <div className="relative">
              {/* Connecting line */}
              <div className="absolute top-[3px] left-[12.5%] right-[12.5%] h-px bg-warm-white/[0.12]" />

              <div className="grid grid-cols-4 gap-8">
                {steps.map((step) => (
                  <div key={step.number} className="text-center">
                    {/* Timeline dot */}
                    <div className="relative z-10 mx-auto w-[7px] h-[7px] rounded-full bg-orange shadow-[0_0_10px_rgba(232,98,42,0.5)] mb-8" />

                    <span
                      className="text-[3rem] font-black text-orange/50 leading-none"
                      style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}
                    >
                      {step.number}
                    </span>
                    <h3 className="mt-3 text-h3 font-bold text-warm-white">{step.title}</h3>
                    <p className="mt-2 text-body-sm leading-[1.65] text-warm-white/50">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Mobile: vertical timeline */}
        <div className="lg:hidden">
          {steps.map((step, i) => (
            <ScrollReveal key={step.number} delay={160 + i * 100}>
              <div className="flex gap-5">
                {/* Left: dot + line */}
                <div className="flex flex-col items-center pt-1">
                  <div className="w-[7px] h-[7px] rounded-full bg-orange shadow-[0_0_10px_rgba(232,98,42,0.5)] shrink-0" />
                  {i < steps.length - 1 && (
                    <div className="w-px flex-1 bg-warm-white/[0.10] mt-3" />
                  )}
                </div>

                {/* Right: content */}
                <div className={i < steps.length - 1 ? 'pb-10' : ''}>
                  <span
                    className="text-[2.5rem] font-black text-orange/50 leading-none"
                    style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}
                  >
                    {step.number}
                  </span>
                  <h3 className="mt-2 text-h3 font-bold text-warm-white">{step.title}</h3>
                  <p className="mt-2 text-body-sm leading-[1.65] text-warm-white/50">{step.desc}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
