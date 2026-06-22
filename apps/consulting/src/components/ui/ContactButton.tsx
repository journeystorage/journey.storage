'use client'

import { type ReactNode } from 'react'
import { useContact } from './ContactProvider'

interface ContactButtonProps {
  className?: string
  children: ReactNode
}

/**
 * A button that opens the global Contact modal. Lets server components (e.g.
 * the Hero) trigger the modal without becoming client components themselves.
 */
export default function ContactButton({ className, children }: ContactButtonProps) {
  const { openContact } = useContact()
  return (
    <button type="button" onClick={openContact} className={className}>
      {children}
    </button>
  )
}
