'use client'

import { useRef, useState } from 'react'
import { motion, useInView, useReducedMotion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { sectionIds } from '@/lib/constants'

const faqs = [
  {
    q: 'What exactly do I get in an "underwriting analysis"?',
    a: 'A full set of projections based on an actual rent roll and operating data, not a broker\u2019s rosy pro forma. Revenue projections, expense assumptions, yield analysis, scenario modeling, and a walkthrough call so you understand every number and can make a decision with confidence.',
  },
  {
    q: 'Do I need to be an experienced investor to use this?',
    a: 'No. Whether you\u2019re evaluating your first self-storage deal or your fiftieth, our team will adapt to where you are. The point is to give you the analytical clarity that normally requires years of industry-specific experience.',
  },
  {
    q: 'Can I bring you a deal that\u2019s time-sensitive?',
    a: 'Yes, especially at the Pursuit and Command tiers, which include priority response. Self-storage deals move fast. So do we.',
  },
  {
    q: 'What if I need help beyond underwriting and feasibility?',
    a: 'The Command tier includes full transaction coordination, operational support and more. For Scout and Pursuit subscribers, single-project engagements and retainer + success fee structures are available on request.',
  },
  {
    q: 'Is there a long-term commitment?',
    a: 'No. Every tier is month-to-month with 30 days\u2019 notice to cancel. We earn your retention through the quality of the work, not a contract.',
  },
]

function AccordionItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-black/[0.08]">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-6 text-left cursor-pointer"
        aria-expanded={open}
      >
        <span className="text-body font-bold text-black">{q}</span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-stone transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-body-sm leading-[1.75] text-charcoal max-w-[640px]">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQ() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const prefersReducedMotion = useReducedMotion()
  const ease = [0.22, 1, 0.36, 1] as const
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section ref={ref} id={sectionIds.faq} className="relative overflow-hidden bg-warm-white py-16 lg:py-20">
      <div className="relative z-10 mx-auto max-w-[var(--container-content)] px-5 md:px-8 lg:px-16">
        <motion.div
          className="text-center mb-14 lg:mb-16"
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6, ease }}
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-8 bg-orange" />
            <span className="text-label font-bold uppercase tracking-[0.2em] text-orange">Common questions</span>
            <div className="h-px w-8 bg-orange" />
          </div>
          <h2 className="text-h2 font-black text-black leading-snug">
            What you probably want to know.
          </h2>
        </motion.div>

        <motion.div
          className="mx-auto max-w-[720px]"
          initial={prefersReducedMotion ? undefined : { opacity: 0 }}
          animate={isInView ? { opacity: 1 } : undefined}
          transition={{ duration: 0.5, ease, delay: 0.2 }}
        >
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              q={faq.q}
              a={faq.a}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
