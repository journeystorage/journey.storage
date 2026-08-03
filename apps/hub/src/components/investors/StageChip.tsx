import { STAGES, type Stage } from '@/lib/investors/types'

const STAGE_STYLES: Record<Stage, string> = {
  funded: 'bg-status-good/15 text-status-good',
  committed: 'bg-cyan/15 text-cyan',
  engaged: 'bg-orange/15 text-orange',
  lead: 'bg-warm-white/10 text-warm-white',
  backup: 'bg-stone/15 text-stone',
  finder: 'bg-sky/15 text-sky',
  connector: 'bg-stone/15 text-stone',
  gatekept: 'bg-stone/15 text-stone',
  needs_contact: 'bg-stone/15 text-stone',
  finder_inactive: 'bg-stone/10 text-stone/70',
  out: 'bg-danger/10 text-danger/80',
}

export function StageChip({ stage }: { stage: Stage }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 font-sans text-label font-semibold whitespace-nowrap ${STAGE_STYLES[stage]}`}>
      {STAGES[stage]?.label ?? stage}
    </span>
  )
}
