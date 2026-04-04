'use client'

import Image from 'next/image'
import { externalUrls } from '@/lib/constants'

export default function Footer() {
  return (
    <footer className="border-t border-warm-white/[0.04] bg-black py-12">
      <div className="mx-auto max-w-[var(--container-content)] px-5 md:px-8 lg:px-16">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <div className="flex flex-col items-center gap-3 md:items-start">
            <Image src="/images/brand/logo-white-TM.svg" alt="Journey.Storage™ logo" width={140} height={32} className="w-[120px]" style={{ height: 'auto' }} />
            <p className="text-caption text-warm-white/25 text-center md:text-left">
              Journey.Advisory&trade; &middot;<br />
              A Journey.Storage&trade; division
            </p>
          </div>

          <div className="flex flex-col items-center gap-1 md:items-end text-caption text-warm-white/25">
            <p>Dallas, TX &middot; <a href={externalUrls.mainSite} className="transition-colors duration-150 hover:text-warm-white/50">journey.storage</a></p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-warm-white/[0.04] text-center">
          <p className="text-caption text-warm-white/15">
            &copy; {new Date().getFullYear()} Journey.Storage&trade;. All rights reserved. Privileged &amp; confidential.
          </p>
        </div>
      </div>
    </footer>
  )
}
