'use client'

import { useRef, useState } from 'react'
import { motion, useInView, useReducedMotion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import { sectionIds } from '@/lib/constants'

const faqs = [
  {
    question: 'When is Journey opening?',
    answer: "We're building our first facilities now. Join the waitlist and we'll notify you the moment we open near you. Early members get priority access.",
  },
  {
    question: 'How does pricing work?',
    answer: "Month-to-month. No lock-in contracts, no rate hikes after move-in. You see the price, you pay the price. If you need to leave, you leave — no penalties, no fees.",
  },
  {
    question: 'What sizes are available?',
    answer: "From compact 5\u00d75 closets (~25 sq ft) for boxes and seasonal gear, to 10\u00d725 garage-size spaces (~250 sq ft) that fit an entire household. Mid-range options like 5\u00d710, 10\u00d710, and 10\u00d715 cover everything in between.",
  },
  {
    question: 'What types of storage do you offer?',
    answer: "Self storage, climate-controlled spaces, drive-up access, indoor storage, and vehicle & RV parking. Every facility is designed with digital locks, 24/7 access, and the same quality experience across all space types.",
  },
  {
    question: 'How does digital access work?',
    answer: "No keys, no codes to memorize. You get a digital access credential on your phone. Gates and locks respond to you automatically. Works 24/7, every day of the year.",
  },
  {
    question: 'How does move-out work?',
    answer: "Empty your space, snap a photo, and send it through the app. You'll get approval in seconds. Access turns off, and you're done. No calls, no office visits, no waiting.",
  },
]

function FAQItem({ item, isOpen, onToggle, index, isInView }: {
  item: typeof faqs[0]
  isOpen: boolean
  onToggle: () => void
  index: number
  isInView: boolean
}) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      className="border-b border-warm-white/[0.06] last:border-b-0"
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 + index * 0.07 }}
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-6 text-left cursor-pointer group"
        aria-expanded={isOpen}
      >
        <span className={`text-base md:text-lg font-bold transition-colors duration-200 ${isOpen ? 'text-warm-white' : 'text-warm-white/60 group-hover:text-warm-white/80'}`}>
          {item.question}
        </span>
        <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors duration-200 ${isOpen ? 'bg-orange' : 'bg-warm-white/[0.06] group-hover:bg-warm-white/[0.1]'}`}>
          <Plus
            size={14}
            className={`transition-transform duration-300 ${isOpen ? 'rotate-45 text-warm-white' : 'text-warm-white/50'}`}
          />
        </div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-body-sm leading-[1.7] text-warm-white/40 max-w-[600px]">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQ() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const prefersReducedMotion = useReducedMotion()
  const ease = [0.22, 1, 0.36, 1] as const
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section ref={ref} id={sectionIds.faq} className="grain relative overflow-hidden bg-black py-20 lg:py-28">
      {/* Radial glow */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true" style={{
        background: 'radial-gradient(ellipse 50% 40% at 50% 20%, rgba(232,98,42,0.04), transparent)',
      }} />

      <div className="relative z-10 mx-auto max-w-content px-5 md:px-8 lg:px-16">
        {/* Header */}
        <motion.div
          className="mb-14 lg:mb-16 text-center"
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5, ease }}
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-8 bg-orange" />
            <span className="text-label font-bold uppercase tracking-[0.2em] text-orange">FAQ</span>
            <div className="h-px w-8 bg-orange" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-warm-white leading-[0.95]">
            Questions?
            <br />
            <span className="font-light text-warm-white/30">Answered.</span>
          </h2>
        </motion.div>

        {/* Accordion */}
        <div className="mx-auto max-w-[700px]">
          <div className="border-t border-warm-white/[0.06]">
            {faqs.map((item, i) => (
              <FAQItem
                key={i}
                item={item}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                index={i}
                isInView={isInView}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
