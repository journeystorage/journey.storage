'use client'

import { useState } from 'react'
import Image from 'next/image'

// The four setup steps with the screen that goes with each one. Left column is
// the numbered list (sticky on desktop); right column shows all four frames
// and brightens the one whose step is active. Tapping a step or a frame
// selects it. On mobile every frame is full opacity, because there is no
// side-by-side to justify dimming.
//
// Kept as the only client component on the page: everything else is static.

type Step = {
  title: string
  body: React.ReactNode
  frame: React.ReactNode
  caption: React.ReactNode
}

const STEPS: Step[] = [
  {
    title: 'Find the text we sent you',
    body: (
      <>
        It holds a download link and your <strong className="font-semibold text-black">6-digit PIN</strong>.
        Don’t delete it until you’re logged in.
      </>
    ),
    frame: (
      <div className="mx-auto my-6 max-w-[360px] rounded-[16px_16px_16px_4px] bg-[#E9E3D8] px-[18px] py-4 text-[15px] leading-relaxed text-black/70">
        Your <b className="font-semibold text-black">Journey.Storage</b> unit is ready. Download the app, iOS or
        Android: <b className="font-semibold text-black">noke.app</b> · your temporary password to log in is{' '}
        <span className="font-bold tracking-wider text-[#B34516]">612975</span>
      </div>
    ),
    caption: 'The text you’ll get',
  },
  {
    title: 'Download the app',
    body: (
      <>
        Search <strong className="font-semibold text-black">“Storage Smart Entry.”</strong> Free. Check it says{' '}
        <strong className="font-semibold text-black">Noke Inc</strong>.
      </>
    ),
    frame: (
      <Image
        src="/images/smartentry/shot-store.webp"
        alt="App Store listing for Storage Smart Entry by Nokē, published by Noke Inc"
        width={660}
        height={248}
        className="w-full rounded-[10px] border border-black/[0.06]"
      />
    ),
    caption: 'The listing in the app store',
  },
  {
    title: 'Log in with your cell number',
    body: (
      <>
        Password is the PIN from the text. Then pick your own,{' '}
        <strong className="font-semibold text-black">8+ characters</strong>.
      </>
    ),
    frame: (
      <Image
        src="/images/smartentry/shot-login.webp"
        alt="Login screen: your cell number, then the 6-digit PIN"
        width={800}
        height={330}
        className="w-full rounded-[10px] border border-black/[0.06]"
      />
    ),
    caption: 'Cell number, then the PIN',
  },
  {
    title: 'Tap OK twice',
    body: (
      <>
        <strong className="font-semibold text-black">Bluetooth</strong> (all phones) and{' '}
        <strong className="font-semibold text-black">Location</strong> (Android). It’s how your phone finds the
        lock, not a tracker.
      </>
    ),
    frame: (
      <Image
        src="/images/smartentry/shot-bluetooth.webp"
        alt="iOS prompt: Storage Smart Entry would like to use Bluetooth. Tap OK."
        width={760}
        height={522}
        className="w-full rounded-[10px] border border-black/[0.06]"
      />
    ),
    caption: (
      <>
        Tap <em className="not-italic text-[#B34516]">OK</em>, not “Don’t Allow”
      </>
    ),
  },
]

export default function SetupStepper() {
  const [active, setActive] = useState(0)

  return (
    <div className="mt-14 grid gap-10 lg:grid-cols-[400px_minmax(0,1fr)] lg:items-start lg:gap-16">
      <ol className="grid gap-1 lg:sticky lg:top-24">
        {STEPS.map((s, i) => {
          const on = i === active
          return (
            <li key={s.title}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-current={on ? 'step' : undefined}
                className={[
                  'grid w-full grid-cols-[52px_1fr] gap-3.5 rounded-[14px_3px_14px_3px] border px-4 py-[18px] text-left transition duration-200',
                  on
                    ? 'border-black/[0.06] bg-[#FBF8F3] shadow-[0_10px_30px_-18px_rgba(24,24,24,0.35)]'
                    : 'border-transparent hover:bg-[#FBF8F3]/60',
                ].join(' ')}
              >
                <span className="font-[family-name:var(--font-barlow)] text-[44px] font-black leading-[0.9] text-[#B34516]">{i + 1}</span>
                <span>
                  <span className="block text-[19px] font-semibold leading-tight text-black">{s.title}</span>
                  <span
                    className={[
                      'mt-1.5 block text-[15px] leading-[1.55] text-black/70 transition-opacity',
                      on ? 'opacity-100' : 'hidden opacity-55 lg:block',
                    ].join(' ')}
                  >
                    {s.body}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ol>

      <div className="grid gap-[22px] md:grid-cols-2">
        {STEPS.map((s, i) => {
          const on = i === active
          return (
            <button
              type="button"
              key={s.title}
              onClick={() => setActive(i)}
              aria-label={`Show step ${i + 1}`}
              className={[
                'relative rounded-[18px] border border-black/10 bg-[#FBF8F3] p-3.5 text-left shadow-[0_2px_2px_rgba(24,24,24,0.04),0_24px_40px_-28px_rgba(102,40,13,0.35)] transition duration-250',
                on ? '' : 'lg:opacity-70',
              ].join(' ')}
            >
              <span className="absolute -top-[11px] left-4 rounded-full bg-orange px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-black">
                Step {i + 1}
              </span>
              {s.frame}
              <span className="mt-3 block text-center text-[11.5px] font-bold uppercase tracking-[0.16em] text-stone">
                {s.caption}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
