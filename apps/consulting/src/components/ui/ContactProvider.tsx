'use client'

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import ContactModal from './ContactModal'

interface ContactContextValue {
  openContact: () => void
}

const ContactContext = createContext<ContactContextValue>({ openContact: () => {} })

export function useContact() {
  return useContext(ContactContext)
}

export default function ContactProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const openContact = useCallback(() => setOpen(true), [])
  const closeContact = useCallback(() => setOpen(false), [])

  const value = useMemo(() => ({ openContact }), [openContact])

  return (
    <ContactContext.Provider value={value}>
      {children}
      <ContactModal open={open} onClose={closeContact} />
    </ContactContext.Provider>
  )
}
