import Image from 'next/image'

/*
  Print-optimized deck: every <Page> is exactly 297x210mm (A4 landscape).
  Puppeteer renders this route and outputs a pixel-perfect PDF.
  No responsive utilities, no snap-scroll — just fixed dimensions.
*/

/* -- Design tokens (print) -- */
const C = {
  black: '#181818',
  charcoal: '#3A3835',
  orange: '#E8622A',
  stone: '#888680',
  warmWhite: '#F5F0E8',
  warmWhite80: 'rgba(245,240,232,0.80)',
  warmWhite70: 'rgba(245,240,232,0.70)',
  warmWhite60: 'rgba(245,240,232,0.60)',
  warmWhite55: 'rgba(245,240,232,0.55)',
  warmWhite50: 'rgba(245,240,232,0.50)',
  warmWhite40: 'rgba(245,240,232,0.40)',
  warmWhite35: 'rgba(245,240,232,0.35)',
  warmWhite30: 'rgba(245,240,232,0.30)',
  warmWhite25: 'rgba(245,240,232,0.25)',
  warmWhite20: 'rgba(245,240,232,0.20)',
  warmWhite10: 'rgba(245,240,232,0.10)',
  warmWhite08: 'rgba(245,240,232,0.08)',
  warmWhite06: 'rgba(245,240,232,0.06)',
  warmWhite04: 'rgba(245,240,232,0.04)',
  warmWhite03: 'rgba(245,240,232,0.03)',
  warmWhite02: 'rgba(245,240,232,0.02)',
  orange15: 'rgba(232,98,42,0.15)',
  orange06: 'rgba(232,98,42,0.06)',
  orange05: 'rgba(232,98,42,0.05)',
  orange04: 'rgba(232,98,42,0.04)',
  orange40: 'rgba(232,98,42,0.40)',
  orange25: 'rgba(232,98,42,0.25)',
  orange20: 'rgba(232,98,42,0.20)',
  orange60: 'rgba(232,98,42,0.60)',
} as const

/* -- Shared sub-components -- */

function Page({ children, style, last }: { children: React.ReactNode; style?: React.CSSProperties; last?: boolean }) {
  return (
    <section
      style={{
        width: '297mm',
        height: '210mm',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        background: C.black,
        boxSizing: 'border-box',
        ...(last ? {} : { breakAfter: 'page', pageBreakAfter: 'always' }),
        breakInside: 'avoid-page',
        pageBreakInside: 'avoid',
        fontFamily: 'var(--font-lato), sans-serif',
        color: C.warmWhite,
        ...style,
      }}
    >
      {children}
    </section>
  )
}

function Footer() {
  return (
    <div
      style={{
        marginTop: 'auto',
        flexShrink: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '6px 48px 10px',
        fontSize: '0.55rem',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: C.warmWhite25,
      }}
    >
      <span>Privileged &amp; Confidential&ensp;&middot;&ensp;Dallas, TX&ensp;&middot;&ensp;Q2, 2026</span>
    </div>
  )
}

function Logo() {
  return (
    <Image
      src="/images/brand/logo-white-TM.svg"
      alt="Journey.Storage™"
      width={130}
      height={32}
      style={{ opacity: 0.8 }}
    />
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
      <div style={{ height: 1, width: 32, background: C.orange60 }} />
      <span
        style={{
          fontSize: '0.65rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.25em',
          color: C.orange,
        }}
      >
        {children}
      </span>
    </div>
  )
}

/* Page content area: fills between header and footer */
function Content({
  children,
  style,
}: {
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  return (
    <div
      style={{
        flex: '1 1 0',
        minHeight: 0,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 48px',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

function Header({ label, children }: { label?: string; children?: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: '20px 48px 0',
        flexShrink: 0,
      }}
    >
      <div>{label && <Label>{label}</Label>}{children}</div>
      <Logo />
    </div>
  )
}

function H2({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <h2
      style={{
        fontSize: '2.2rem',
        fontWeight: 900,
        lineHeight: 0.95,
        letterSpacing: '-0.02em',
        margin: '0 0 12px',
        ...style,
      }}
    >
      {children}
    </h2>
  )
}

function Dot({ color = C.orange }: { color?: string }) {
  return <span style={{ color, marginRight: 6 }}>&bull;</span>
}


/* =====================================================
   SLIDE 1 -- COVER
   ===================================================== */

function SlideCover() {
  return (
    <Page>
      {/* Padded container with rounded inner */}
      <div style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 32px' }}>
        <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: 20 }}>
          <Image src="/images/hero/direct-hero-bg.webp" alt="" fill sizes="297mm" style={{ objectFit: 'cover', objectPosition: '50% 62%', filter: 'grayscale(30%) contrast(1.15) brightness(0.45) sepia(0.1)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.2), rgba(0,0,0,0.7))' }} />
          <div style={{ position: 'absolute', inset: 0, mixBlendMode: 'overlay', background: 'radial-gradient(ellipse 55% 50% at 50% 45%, rgba(232,98,42,0.1), transparent)' }} />

          {/* Logo */}
          <div style={{ position: 'absolute', top: 20, right: 28, zIndex: 10 }}>
            <Logo />
          </div>

          {/* Content -- centered */}
          <div style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 32px' }}>
            <span style={{ marginBottom: 8, fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3em', color: C.orange }}>— the —</span>
            <h1 style={{ fontSize: '6rem', textTransform: 'uppercase', lineHeight: 0.88, letterSpacing: '-0.03em' }}>
              <span style={{ fontWeight: 900 }}>Journey</span><span style={{ fontWeight: 300 }}>.Direct<span style={{ fontSize: '0.4em', verticalAlign: 'super' }}>&trade;</span></span>
            </h1>
            <p style={{ marginTop: 16, fontSize: '1.15rem', fontWeight: 400, letterSpacing: '0.02em', color: C.warmWhite60 }}>
              Investment Platform&ensp;&middot;&ensp;<span style={{ fontWeight: 700, color: C.warmWhite70 }}>Journey</span><span style={{ color: C.warmWhite70 }}>.Storage&trade;</span> Ecosystem
            </p>
            <div style={{ marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 999, border: `1px solid ${C.warmWhite08}`, background: C.warmWhite03, padding: '6px 16px' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: C.warmWhite50 }}>Est. 2026</span>
            </div>
          </div>

          {/* Orange accent line at bottom */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, zIndex: 10, background: 'linear-gradient(to right, transparent 5%, rgba(232,98,42,0.5) 30%, rgba(232,98,42,0.5) 70%, transparent 95%)' }} />
        </div>
      </div>
      <Footer />
    </Page>
  )
}


/* =====================================================
   SLIDE 2 -- THE OPPORTUNITY
   ===================================================== */

function SlideOpportunity() {
  const benefits = [
    { title: 'Operator-led, not fund-managed', desc: 'Every deal is sourced, operated, and managed by the same team.' },
    { title: 'Value created through operations, not speculation', desc: '$200M+ in acquisitions built on operational transformation, not market timing.' },
    { title: 'Aligned incentives', desc: 'The sponsor co-invests in every deal. Same risk, same upside.' },
  ]

  return (
    <Page>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 80% at 30% 50%, rgba(232,98,42,0.04), transparent)' }} />
      <Header label="The Platform" />
      <Content>
        {/* Headline */}
        <H2 style={{ fontSize: '2.4rem', lineHeight: 1.1, marginBottom: 10 }}>
          Invest alongside the operator.<br />
          <span style={{ color: C.warmWhite40 }}>Not through a fund.</span><br />
          <span style={{ color: C.warmWhite40 }}>Not through a REIT.</span><br />
          <span style={{ color: C.orange, fontStyle: 'italic', fontWeight: 300 }}>Directly.</span>
        </H2>

        {/* Closing line */}
        <p style={{ fontSize: '0.92rem', lineHeight: 1.7, color: C.warmWhite55, marginBottom: 24, maxWidth: 600 }}>
          Journey.Direct is the platform. The deals are the opportunity.
        </p>

        {/* Benefits -- three columns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, borderTop: `1px solid ${C.warmWhite06}`, paddingTop: 20 }}>
          {benefits.map((b, i) => (
            <div key={i}>
              <div style={{ height: 3, width: 32, background: C.orange, borderRadius: 999, marginBottom: 10 }} />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, lineHeight: 1.3, marginBottom: 4 }}>{b.title}</h3>
              <p style={{ fontSize: '0.88rem', lineHeight: 1.6, color: C.warmWhite55 }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </Content>
      <Footer />
    </Page>
  )
}


/* =====================================================
   SLIDE 3 -- THE OPERATOR
   ===================================================== */

function SlideOperator() {
  const capabilities = [
    'Acquisitions', 'Asset Management',
    'Development', 'Investor Relations',
    'Construction', 'Capital Raising',
    'Facility Operations', 'Deal Structuring',
    'Property Management',
  ]

  return (
    <Page>
      <Header label="Leadership" />
      <Content>
        <H2 style={{ fontSize: '2.2rem' }}>On a Mission</H2>
        <p style={{ fontSize: '0.82rem', fontWeight: 700, color: C.orange, marginBottom: 10 }}>Impact &amp; Excellence; Mediocre won&apos;t Suffice</p>

        <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr 1fr', gap: 20 }}>
          {/* LEFT -- Photo + name */}
          <div>
            <div style={{ position: 'relative', width: 160, height: 160, borderRadius: 14, overflow: 'hidden', background: C.charcoal }}>
              <Image src="/images/team/home-jonah-portrait.webp" alt="Jonah M. Hall" fill style={{ objectFit: 'cover', objectPosition: 'top' }} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginTop: 8 }}>Jonah M. Hall</h3>
            <ul style={{ marginTop: 4, fontSize: '0.85rem', lineHeight: 1.65, color: C.warmWhite70, listStyle: 'none', padding: 0 }}>
              <li><Dot />Deep Industry Relationships</li>
              <li><Dot />Proven Team Building</li>
              <li><Dot />Operational Mastery</li>
              <li><Dot />Transactional Prowess</li>
            </ul>
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ position: 'relative', width: 48, height: 48, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                <Image src="/images/other/qr-code.webp" alt="QR code" fill style={{ objectFit: 'contain' }} />
              </div>
              <span style={{ fontSize: '0.58rem', color: C.warmWhite40, lineHeight: 1.3 }}>Full bio<br />&amp; team</span>
            </div>
          </div>

          {/* CENTER -- Capabilities + Divestiture */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.7, color: C.warmWhite70, marginBottom: 8 }}>
              In under a decade in the industry, Jonah has served in almost every capacity, wearing the hats and running point directly, as well as building teams, systems and critical infrastructure around:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
              {capabilities.map((c, i) => (
                <span key={i} style={{ borderRadius: 6, background: C.warmWhite04, border: `1px solid ${C.orange20}`, padding: '3px 10px', fontSize: '0.8rem', color: C.warmWhite60 }}>
                  {c}
                </span>
              ))}
            </div>

            <div style={{ borderLeft: `2px solid ${C.orange40}`, paddingLeft: 14, marginTop: 'auto' }}>
              <h4 style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: C.warmWhite70, marginBottom: 3 }}>A Decisive Divestiture</h4>
              <p style={{ fontSize: '0.78rem', lineHeight: 1.75, color: C.warmWhite60 }}>
                In January 2026, Jonah M. Hall successfully exited his previous venture, <em style={{ color: C.warmWhite70 }}>Smartlock Self Storage&reg;</em>, and walked away from his active principal position as President and Chief Investment Officer at another industry giant, <em style={{ color: C.warmWhite70 }}>Cedar Creek Capital&reg;</em> — a calculated maneuver to sever ties with legacy infrastructure, reclaiming sovereignty and clearing the path for the Ecosystem.
              </p>
            </div>
          </div>

          {/* RIGHT -- Map + Proof bar */}
          <div style={{ overflow: 'hidden', borderRadius: 12, border: `1px solid ${C.warmWhite06}`, display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'relative', flex: 1, minHeight: 180, background: C.black }}>
              <Image src="/images/other/acquisitions-map-new.webp" alt="Acquisitions map" fill style={{ objectFit: 'contain' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', background: 'rgba(58,56,53,0.5)', padding: '8px 12px', borderTop: `1px solid ${C.warmWhite06}` }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, lineHeight: 1 }}>$200M<span style={{ color: C.orange }}>+</span></div>
                <div style={{ marginTop: 3, fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: C.warmWhite50 }}>Acquired</div>
              </div>
              <div style={{ height: 20, width: 1, background: C.warmWhite08 }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, lineHeight: 1 }}>30</div>
                <div style={{ marginTop: 3, fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: C.warmWhite50 }}>Facilities &middot; 6 states</div>
              </div>
              <div style={{ height: 20, width: 1, background: C.warmWhite08 }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, lineHeight: 1 }}>18<span style={{ color: C.orange }}>+</span> Yrs</div>
                <div style={{ marginTop: 3, fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: C.warmWhite50 }}>Experience</div>
              </div>
            </div>
          </div>
        </div>
      </Content>
      <Footer />
    </Page>
  )
}


/* =====================================================
   SLIDE 4 -- SELF STORAGE'S INFLECTION POINT
   ===================================================== */

function SlideMarket() {
  const supplyData = [
    { year: '2023', build: '778', exp: '427', total: '1,205' },
    { year: '2024', build: '692', exp: '215', total: '907' },
    { year: '2025', build: '561', exp: '107', total: '668' },
    { year: '2026', build: '447', exp: '137', total: '584' },
    { year: '2027', build: '440', exp: '121', total: '561' },
    { year: '2028', build: '343', exp: '108', total: '451' },
    { year: '2029', build: '337', exp: '118', total: '455' },
  ]

  const thStyle: React.CSSProperties = { padding: '6px 8px', textAlign: 'right', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: C.warmWhite50 }
  const tdStyle: React.CSSProperties = { padding: '5px 8px', textAlign: 'right', fontSize: '0.78rem', color: C.warmWhite40, fontFamily: 'monospace', fontVariantNumeric: 'tabular-nums' }

  return (
    <Page>
      <Header label="The Market" />
      <Content>
        <H2 style={{ fontSize: '2.25rem', marginBottom: 10 }}>Self Storage&apos;s Inflection Point</H2>

        {/* Declining supply number pills */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          {supplyData.map((d, i) => {
            const val = parseInt(d.total.replace(',', ''))
            const maxVal = 1205
            const pct = (val / maxVal) * 100
            return (
              <div key={d.year} style={{ position: 'relative', overflow: 'hidden', borderRadius: 8, background: C.warmWhite04, border: `1px solid ${C.warmWhite06}`, padding: '6px 10px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'monospace', fontWeight: 900, lineHeight: 1, fontSize: `${1.4 - i * 0.06}rem`, opacity: 0.95 - i * 0.07, fontVariantNumeric: 'tabular-nums' }}>
                  {d.total}
                </div>
                <div style={{ fontSize: '0.55rem', fontWeight: 700, color: C.warmWhite25, marginTop: 3 }}>{d.year}</div>
                {/* Proportional accent bar */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: C.warmWhite03 }}>
                  <div style={{ height: '100%', background: C.orange, borderRadius: 999, width: `${pct}%`, opacity: 0.5 + (pct / 100) * 0.5 }} />
                </div>
              </div>
            )
          })}
          <span style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: C.orange, marginLeft: 6, marginBottom: 4 }}>total<br />new supply</span>
        </div>

        {/* Supply data table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', fontVariantNumeric: 'tabular-nums', marginBottom: 14 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.warmWhite06}` }}>
              <th style={{ ...thStyle, textAlign: 'left', color: C.orange }}>Nationwide</th>
              {supplyData.map(d => <th key={d.year} style={thStyle}>{d.year}</th>)}
            </tr>
          </thead>
          <tbody style={{ fontFamily: 'monospace' }}>
            <tr style={{ borderBottom: `1px solid ${C.warmWhite04}` }}>
              <td style={{ ...tdStyle, textAlign: 'left', fontFamily: 'inherit', color: C.warmWhite40 }}>New Build</td>
              {supplyData.map(d => <td key={d.year} style={tdStyle}>{d.build}</td>)}
            </tr>
            <tr style={{ borderBottom: `1px solid ${C.warmWhite04}` }}>
              <td style={{ ...tdStyle, textAlign: 'left', fontFamily: 'inherit', color: C.warmWhite40 }}>Expansion</td>
              {supplyData.map(d => <td key={d.year} style={tdStyle}>{d.exp}</td>)}
            </tr>
            <tr style={{ borderTop: `1px solid ${C.warmWhite10}` }}>
              <td style={{ ...tdStyle, textAlign: 'left', fontFamily: 'inherit', fontWeight: 700, color: C.warmWhite }}>Total</td>
              {supplyData.map(d => <td key={d.year} style={{ ...tdStyle, fontWeight: 700, color: C.orange }}>{d.total}</td>)}
            </tr>
          </tbody>
        </table>

        {/* Bottom -- Market context + Execution punchline */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 24 }}>
          <div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.7, color: C.warmWhite60 }}>
              <strong style={{ color: C.warmWhite80 }}>REITs</strong> dominate ~40% through scale. The remaining ~60% are fragmented <strong style={{ color: C.warmWhite80 }}>Mom-and-Pop operators</strong> on legacy practices. Demand stays resilient — driven by the &ldquo;4 Ds&rdquo;: <strong style={{ color: C.orange }}>Death</strong>, <strong style={{ color: C.orange }}>Divorce</strong>, <strong style={{ color: C.orange }}>Downsizing</strong>, <strong style={{ color: C.orange }}>Dislocation</strong>. But the easy money has been made. As operators retire, supply thins. The window is now.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ borderLeft: `2px solid ${C.orange}`, paddingLeft: 14 }}>
              <p style={{ fontSize: '0.88rem', fontWeight: 700, lineHeight: 1.5, maxWidth: 280 }}>
                We acquire below replacement cost and transform with REIT-level technology — without REIT-level overhead.
              </p>
            </div>
          </div>
        </div>
      </Content>
      <Footer />
    </Page>
  )
}


/* =====================================================
   SLIDE 5 -- STORAGE WITHOUT THE FRICTION
   ===================================================== */

function SlideOperations() {
  const journey = [
    { num: '01', title: 'Find your space', desc: 'Browse and rent online. No phone calls, no office visits.' },
    { num: '02', title: 'Verify in seconds', desc: 'Digital identity verification. No paperwork.' },
    { num: '03', title: 'Sign and access', desc: 'Digital lease. Instant access code to your phone.' },
    { num: '04', title: 'Arrive and move in', desc: 'Gates open automatically. Any hour, any day.' },
    { num: '05', title: 'You\'re in control', desc: 'Manage, pay, upgrade, or move out from your phone.' },
  ]

  return (
    <Page>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(232,98,42,0.04), transparent)' }} />
      <Header label="Operations" />
      <Content>
        <H2 style={{ fontSize: '2.25rem', marginBottom: 6 }}>Storage Without the Friction</H2>

        {/* Tagline hero */}
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: C.warmWhite50, marginBottom: 4 }}>Our Operational Philosophy</p>
          <p style={{ fontSize: '1.4rem', fontWeight: 300, fontStyle: 'italic', color: C.orange, lineHeight: 1.4 }}>
            &ldquo;Frictionless Commerce at 11:00pm on a Weekday.&rdquo;
          </p>
          <p style={{ marginTop: 4, fontSize: '0.85rem', color: C.warmWhite50 }}>
            Our competitors close at 5 PM. We never close. Technology is the moat.
          </p>
        </div>

        {/* Two-column: Customer journey + Why It Matters */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          {/* Left -- The Customer Experience */}
          <div>
            <p style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: C.warmWhite50, marginBottom: 10 }}>The Customer Experience</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {journey.map((step) => (
                <div key={step.num} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{ display: 'flex', width: 24, height: 24, flexShrink: 0, alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: C.orange15, fontFamily: 'monospace', fontSize: '0.58rem', fontWeight: 700, color: C.orange, marginTop: 2 }}>{step.num}</span>
                  <div>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 700, lineHeight: 1.3 }}>{step.title}</h4>
                    <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: C.warmWhite50 }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right -- Why It Matters */}
          <div>
            <p style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: C.warmWhite50, marginBottom: 10 }}>Why It Matters</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ borderLeft: `2px solid ${C.warmWhite10}`, paddingLeft: 14 }}>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 700 }}>The customer wins</h4>
                <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: C.warmWhite50 }}>Rent anytime. Instant access. Zero friction. Higher satisfaction, lower churn.</p>
              </div>
              <div style={{ borderLeft: `2px solid ${C.warmWhite10}`, paddingLeft: 14 }}>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 700 }}>Revenue wins</h4>
                <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: C.warmWhite50 }}>Decreased payroll costs. Data-driven pricing. Higher occupancy from 24/7 availability.</p>
              </div>
              <div style={{ borderLeft: `2px solid ${C.orange}`, paddingLeft: 14 }}>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: C.orange }}>The investor wins</h4>
                <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: C.warmWhite55 }}>Higher NOI. Stronger returns. A defensible operational moat that compounds over time.</p>
              </div>
            </div>
          </div>
        </div>
      </Content>
      <Footer />
    </Page>
  )
}


/* =====================================================
   SLIDE 6 -- GROWTH THESIS
   ===================================================== */

function SlideGrowthThesis() {
  const buyBox = [
    { label: 'Market Characteristics', desc: 'Tier 1-3 markets with favorable supply/demand metrics.' },
    { label: 'Demographics', desc: 'Min. 30k people in trade area, positive pop. growth and min. HHI of $60k.' },
    { label: 'Demand', desc: 'Areas indicating strong demand, with manual verifications of pricing & occupancy.' },
    { label: 'Business Friendliness', desc: 'Markets that highlight technology efficiencies and avoid landlord-hurdles.' },
  ]

  const uwInputs = [
    { label: 'Projection Models', desc: 'A decade of storage-specific underwriting experience.' },
    { label: 'Onboarding Cap-Ex', desc: '$200-500k set aside to ensure tech/brand standards.' },
    { label: 'Financing', desc: '55-65% LTC at competitive rates, sized IO periods w/o prepayment penalties.' },
    { label: 'Conservative Outlook', desc: '24-48 month physical lease-up to 85-90% occupancy, then property-specific revenue stabilization through ECRI\'s.' },
    { label: 'Data Analytics', desc: 'Direct investment in and continued adoption of the best in technology the industry has to offer.' },
  ]

  return (
    <Page>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 50% 60% at 50% 40%, rgba(232,98,42,0.03), transparent)' }} />
      <Header label="Strategy" />
      <Content>
        <H2 style={{ fontSize: '2.3rem', marginBottom: 4 }}>Growth Thesis</H2>
        <p style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: C.warmWhite50, marginBottom: 20 }}>The &ldquo;Value-Add&rdquo; Math</p>

        {/* HERO -- The equation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginBottom: 8 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '3.5rem', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>$5M</div>
            <div style={{ marginTop: 6, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: C.warmWhite50 }}>The Buy</div>
          </div>
          <span style={{ fontSize: '1.8rem', color: C.warmWhite20 }}>&rarr;</span>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '3.5rem', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>$8M</div>
            <div style={{ marginTop: 6, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: C.warmWhite50 }}>The Exit</div>
          </div>
          <span style={{ fontSize: '1.8rem', color: C.warmWhite20 }}>=</span>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '3.5rem', lineHeight: 1, color: C.orange, fontVariantNumeric: 'tabular-nums' }}>+$3M</div>
            <div style={{ marginTop: 6, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: C.orange60 }}>Value Created</div>
          </div>
        </div>
        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: C.warmWhite55, marginBottom: 18, maxWidth: 600, margin: '0 auto 18px' }}>
          A facility purchased at a 6% Cap Rate ($300k NOI). Decrease payroll by $80k/year, raise rents 18%. NOI grows to $480k. At the same 6% Cap Rate, it&apos;s worth $8M. <strong style={{ color: C.warmWhite60 }}>No speculation. Pure operational value.</strong>
        </p>

        {/* Buy Box + UW Inputs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, borderTop: `1px solid ${C.warmWhite06}`, paddingTop: 16 }}>
          <div>
            <h3 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: C.warmWhite55, marginBottom: 8 }}>The Deal Buy Box</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {buyBox.map((b, i) => (
                <div key={i} style={{ display: 'flex', gap: 6, fontSize: '0.85rem', lineHeight: 1.6 }}>
                  <Dot />
                  <span style={{ color: C.warmWhite55 }}><strong style={{ color: C.warmWhite80 }}>{b.label}:</strong> {b.desc}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: C.warmWhite55, marginBottom: 8 }}>Key Underwriting Inputs / Value-Add Execution(s)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {uwInputs.map((u, i) => (
                <div key={i} style={{ display: 'flex', gap: 6, fontSize: '0.82rem', lineHeight: 1.6 }}>
                  <Dot />
                  <span style={{ color: C.warmWhite55 }}><strong style={{ color: C.warmWhite80 }}>{u.label}:</strong> {u.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Content>
      <Footer />
    </Page>
  )
}


/* =====================================================
   SLIDE 7 -- DEAL COVER
   ===================================================== */

function SlideDealCover() {
  return (
    <Page>
      {/* Padded container with rounded inner */}
      <div style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 32px' }}>
        <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: 20 }}>
          <Image src="/images/deals/granbury/granbury-2.jpg" alt="" fill sizes="297mm" style={{ objectFit: 'cover', objectPosition: '50% bottom', filter: 'grayscale(30%) contrast(1.15) brightness(0.4) sepia(0.1)', transform: 'scale(1.35)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.3), rgba(0,0,0,0.75))' }} />
          <div style={{ position: 'absolute', inset: 0, mixBlendMode: 'overlay', background: 'radial-gradient(ellipse 55% 50% at 50% 45%, rgba(232,98,42,0.1), transparent)' }} />

          {/* Logo */}
          <div style={{ position: 'absolute', top: 20, right: 28, zIndex: 10 }}>
            <Logo />
          </div>

          {/* Content -- centered */}
          <div style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 32px' }}>
            <span style={{ marginBottom: 8, fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3em', color: C.orange }}>— current deal —</span>
            <h1 style={{ fontSize: '5rem', textTransform: 'uppercase', lineHeight: 0.88, letterSpacing: '-0.03em' }}>
              <span style={{ fontWeight: 900 }}>Journey</span><span style={{ fontWeight: 300 }}>.Storage<span style={{ fontSize: '0.5em', verticalAlign: 'super' }}>&trade;</span></span>
            </h1>
            <p style={{ fontWeight: 300, fontStyle: 'italic', lineHeight: 1.0, letterSpacing: '-0.03em', color: C.orange, fontSize: '5.5rem' }}>
              Granbury
            </p>
            <p style={{ marginTop: 14, fontSize: '1.1rem', fontWeight: 400, letterSpacing: '0.02em', color: C.warmWhite60 }}>
              Current Investment Opportunity&ensp;&middot;&ensp;An Offering from <span style={{ fontWeight: 700, color: C.warmWhite70 }}>Journey</span><span style={{ color: C.warmWhite70 }}>.Direct&trade;</span>
            </p>
            <div style={{ marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 999, border: `1px solid ${C.warmWhite08}`, background: C.warmWhite03, padding: '6px 16px' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: C.warmWhite50 }}>Est. 2026</span>
            </div>
          </div>

          {/* Orange accent line */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, zIndex: 10, background: 'linear-gradient(to right, transparent 5%, rgba(232,98,42,0.5) 30%, rgba(232,98,42,0.5) 70%, transparent 95%)' }} />
        </div>
      </div>
      <Footer />
    </Page>
  )
}


/* =====================================================
   SLIDE 8 -- DISCLAIMER
   ===================================================== */

function SlideDisclaimer() {
  const pStyle: React.CSSProperties = { marginBottom: 7, fontSize: '0.73rem', lineHeight: 1.75, color: C.warmWhite50 }

  return (
    <Page>
      <Header label="" />
      <Content style={{ justifyContent: 'flex-start', paddingTop: 10 }}>
        <H2 style={{ fontSize: '1.7rem', marginBottom: 6 }}>Disclaimer</H2>
        <div style={{ maxWidth: 820 }}>
          {/* Section 1 — General */}
          <p style={{ marginBottom: 3, fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: C.orange40 }}>General</p>
          <p style={pStyle}>
            This contains privileged and confidential information and unauthorized use of this information in any manner is strictly prohibited. This is for informational purposes and not intended to be a general solicitation or a securities offering of any kind. The information contained herein is from sources believed to be reliable, however no representation by Journey.Direct&trade; (&ldquo;JD&rdquo;), nor by Journey.Storage&trade; (&ldquo;JS&rdquo;), either expressed or implied, is made as to the accuracy of any information and all investors should conduct their own research to determine the accuracy of any statements made.
          </p>
          <p style={{ ...pStyle, marginBottom: 12 }}>
            Neither JD (nor JS), nor their representatives, officers, employees, affiliates, sub-contractors or vendors provide tax, legal or investment advice. Nothing in this document is intended to be or should be construed as such advice. The SEC has not passed upon the merits of or given its approval to the securities, the terms of the offering, or the accuracy or completeness of any offering materials.
          </p>

          {/* Section 2 — Forward-Looking Statements */}
          <div style={{ borderTop: `1px solid ${C.warmWhite06}`, paddingTop: 8, marginBottom: 8 }}>
            <p style={{ marginBottom: 3, fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: C.orange40 }}>Forward-Looking Statements</p>
            <p style={pStyle}>
              Potential investors and other readers are also cautioned that these forward-looking statements are predictions only based on current information, assumptions and expectations that are inherently subject to risks and uncertainties that could cause future events or results to differ materially from those set forth or implied by such forward looking statements. These forward-looking statements can be identified by the use of forward-looking terminology, such as &ldquo;may,&rdquo; &ldquo;will,&rdquo; &ldquo;seek,&rdquo; &ldquo;should,&rdquo; &ldquo;expect,&rdquo; &ldquo;anticipate,&rdquo; &ldquo;project,&rdquo; &ldquo;estimate,&rdquo; &ldquo;intend,&rdquo; &ldquo;continue,&rdquo; or &ldquo;believe&rdquo; or the negatives thereof or other variations thereon or comparable terminology.
            </p>
            <p style={{ ...pStyle, marginBottom: 0 }}>
              This further contains several future financial projections and forecasts. These estimated projections are based on numerous assumptions and hypothetical scenarios and JD (and JS) explicitly make no representation or warranty of any kind with respect to any financial projection or forecast.
            </p>
          </div>

          {/* Section 3 — Past Performance */}
          <div style={{ borderTop: `1px solid ${C.warmWhite06}`, paddingTop: 8 }}>
            <p style={{ marginBottom: 3, fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: C.orange40 }}>Past Performance</p>
            <div style={{ borderLeft: `2px solid ${C.orange40}`, paddingLeft: 14 }}>
              <p style={{ ...pStyle, marginBottom: 0 }}>
                <strong style={{ color: C.warmWhite70 }}>Past performance does not guarantee future results.</strong> Current performance may be lower or higher than the performance data presented. All return examples provided are based on assumptions and expectations in light of currently available information, industry trends and comparisons to competitor&apos;s financials. Therefore, actual performance may, and most likely will, substantially differ from these projections and no guarantee is presented or implied as to the accuracy of specific forecasts, projections or predictive statements contained herein. JD (and JS) further make no representations or warranties that any investor will, or is likely to, achieve profits similar to those shown herein.
              </p>
            </div>
          </div>
        </div>
      </Content>
      <Footer />
    </Page>
  )
}


/* =====================================================
   SLIDE 9 -- CURRENT OPPORTUNITY
   ===================================================== */

function SlideCurrentOpportunity() {
  return (
    <Page>
      <Header label="Current Deal" />
      <Content>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 900, lineHeight: 0.95, letterSpacing: '-0.02em', margin: '0 0 6px', textTransform: 'uppercase' }}>
          <span style={{ fontWeight: 900 }}>Journey</span><span style={{ fontWeight: 300 }}>.Storage&trade;</span> <span style={{ textTransform: 'none' }}>&mdash;</span> <span style={{ fontWeight: 300, fontStyle: 'italic', color: C.orange, textTransform: 'none' }}>Granbury</span>
        </h2>

        {/* Metrics strip */}
        <div style={{ borderTop: `1px solid ${C.warmWhite06}`, borderBottom: `1px solid ${C.warmWhite06}`, padding: '8px 0', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 16, fontFamily: 'monospace', fontVariantNumeric: 'tabular-nums' }}>
          <div><span style={{ fontSize: '1.1rem', fontWeight: 900 }}>773</span> <span style={{ fontSize: '0.82rem', color: C.warmWhite50 }}>Units</span></div>
          <div style={{ height: 16, width: 1, background: C.warmWhite10 }} />
          <div><span style={{ fontSize: '1.1rem', fontWeight: 900 }}>126K</span> <span style={{ fontSize: '0.82rem', color: C.warmWhite50 }}>NRSF</span></div>
          <div style={{ height: 16, width: 1, background: C.warmWhite10 }} />
          <div><span style={{ fontSize: '1.1rem', fontWeight: 900, color: C.orange }}>$85</span><span style={{ fontSize: '0.82rem', color: C.warmWhite50 }}>/NRSF</span></div>
          <div style={{ height: 16, width: 1, background: C.warmWhite10 }} />
          <div><span style={{ fontSize: '1.1rem', fontWeight: 900, color: C.orange }}>$96</span><span style={{ fontSize: '0.82rem', color: C.warmWhite50 }}>/NRSF all-in</span></div>
          <div style={{ height: 16, width: 1, background: C.warmWhite10 }} />
          <div><span style={{ fontSize: '1.1rem', fontWeight: 900 }}>~15%</span> <span style={{ fontSize: '0.82rem', color: C.warmWhite50 }}>below replacement</span></div>
        </div>

        {/* Addresses */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, fontSize: '0.68rem', color: C.warmWhite25 }}>
          <span>Granbury, TX</span>
          <span style={{ color: C.warmWhite10 }}>&middot;</span>
          <span><span style={{ color: C.orange40, fontWeight: 700 }}>#1</span> 212 Temple Hall Hwy</span>
          <span style={{ color: C.warmWhite10 }}>&middot;</span>
          <span><span style={{ color: C.orange40, fontWeight: 700 }}>#2</span> 409 Western Hills Trl</span>
          <span style={{ color: C.warmWhite10 }}>&middot;</span>
          <span><span style={{ color: C.orange40, fontWeight: 700 }}>#3</span> 3501 McCreary Rd</span>
        </div>

        {/* We Will + Results */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 16 }}>
          <div>
            <h3 style={{ fontSize: '0.88rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8 }}>We Will:</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                'Immediately implement additional ancillary revenue sources increasing topline revenue by ~$50k/yr.',
                'Increase occupancy from 70% to ~90% over the first 24 months.',
                'Increase in-place rates from ~$.87/SF to ~$1.02/SF through calculated ECRI\'s from month 18-36.',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, fontSize: '0.85rem', lineHeight: 1.6, color: C.warmWhite60 }}>
                  <span style={{ color: C.orange, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>{String(i + 1).padStart(2, '0')}</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 style={{ fontSize: '0.88rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: C.warmWhite60, marginBottom: 8 }}>Results:</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                'EGI (Effective Gross Income) will grow from $970k (in-place today) to $1.475M.',
                'OPEX maintained at a healthy margin (~$419k or 29%).',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, fontSize: '0.85rem', lineHeight: 1.6, color: C.warmWhite60 }}>
                  <Dot />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Punchline -- the ONE number */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, borderTop: `1px solid ${C.warmWhite06}`, paddingTop: 14 }}>
          <div style={{ fontFamily: 'monospace', fontWeight: 900, color: C.orange, fontSize: '2.6rem', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
            +$7.36M
          </div>
          <div>
            <p style={{ fontSize: '0.92rem', fontWeight: 700 }}>in value created</p>
            <p style={{ fontSize: '0.85rem', color: C.warmWhite55 }}>NOI grows by $460k over 60 months at a 6.25% Cap Rate</p>
          </div>
        </div>
      </Content>
      <Footer />
    </Page>
  )
}


/* =====================================================
   SLIDE 10 -- INVESTMENT SUMMARY
   ===================================================== */

function SlideInvestmentSummary() {
  const termSheet = [
    { label: 'Equity Raise', value: '$4,560,000', detail: "Inclusive of Sponsor's Co-Invest (3%)" },
    { label: 'Financing', value: '~$7,560,000 (~63% LTC)' },
    { label: 'Total Project Cost', value: '~$12,120,000' },
    { label: 'Sponsor(s)', value: 'Journey.Direct, LLC ("JD")' },
    { label: 'Management', value: 'Journey.Management, LLC ("JM")', detail: 'Under the Journey.Storage\u2122 brand' },
    { label: 'Strategy', value: 'Value Add: Lease Up, Revenue Optimization, Expense Reduction via Automation' },
    { label: 'Waterfall', value: "Return of Equity first, then 70/30 in favor of LP's" },
    { label: 'Hold Period', value: '5 Years +/-', detail: 'Expected cash-out refinance near Month 36 (returning ~70% of equity)' },
    { label: 'Sponsor Fees', value: '3% Acquisition (one-time); 6% Development (one-time); 2% Asset Management (ongoing)' },
  ]

  return (
    <Page>
      <Header label="Overview" />
      <Content>
        <H2 style={{ marginBottom: 10 }}>Investment Summary</H2>

        {/* Hero returns */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 18, marginBottom: 12, borderTop: `1px solid ${C.warmWhite06}`, borderBottom: `1px solid ${C.warmWhite06}`, padding: '10px 0' }}>
          <div>
            <div style={{ fontFamily: 'monospace', fontWeight: 900, color: C.orange, fontSize: '1.7rem', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>25% IRR</div>
            <div style={{ marginTop: 3, fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: C.warmWhite50 }}>Targeted &middot; Project-level</div>
          </div>
          <div style={{ height: 32, width: 1, background: C.warmWhite08 }} />
          <div>
            <div style={{ fontFamily: 'monospace', fontWeight: 900, color: C.orange, fontSize: '1.7rem', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>2.5x MOIC</div>
            <div style={{ marginTop: 3, fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: C.warmWhite50 }}>Equity Multiple</div>
          </div>
          <div style={{ height: 32, width: 1, background: C.warmWhite08 }} />
          <div>
            <div style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '1.7rem', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>8.8% YOC</div>
            <div style={{ marginTop: 3, fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: C.warmWhite50 }}>Stabilized Yield on Cost</div>
          </div>
        </div>

        {/* Term sheet table + CTA badges */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 20 }}>
          <table style={{ width: '100%', fontSize: '0.88rem', borderCollapse: 'collapse' }}>
            <tbody>
              {termSheet.map((t, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.warmWhite06}` }}>
                  <td style={{ padding: '6px 12px 6px 0', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: C.orange, width: 130, verticalAlign: 'top' }}>{t.label}</td>
                  <td style={{ padding: '6px 0', fontWeight: 700, verticalAlign: 'top' }}>
                    {t.value}
                    {t.detail && <span style={{ fontWeight: 400, color: C.warmWhite50, marginLeft: 8 }}>&mdash; {t.detail}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* CTA badges */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'flex-start' }}>
            <div style={{ background: C.orange, borderRadius: 14, padding: '16px 22px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.58rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>Ask about</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, lineHeight: 1.25 }}>accelerated<br />&ldquo;bonus&rdquo;<br />depreciation</div>
            </div>
            <div style={{ border: `1px solid ${C.orange40}`, borderRadius: 10, padding: '10px 18px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.58rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: C.warmWhite40, marginBottom: 3 }}>Investment Window</div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: C.orange }}>Until May 8, 2026</div>
            </div>
          </div>
        </div>
      </Content>
      <Footer />
    </Page>
  )
}


/* =====================================================
   SLIDE 11 -- PROPERTY DETAILS
   ===================================================== */

function SlidePropertyDetails() {
  return (
    <Page>
      <Header label="The Asset" />
      <Content>
        <H2 style={{ marginBottom: 2 }}>Property Details</H2>
        <p style={{ fontSize: '0.8rem', color: C.warmWhite55, marginBottom: 12 }}>
          A recent expansion added capacity in mid-2025. Lease-up has been excellent.
        </p>

        {/* Photos -- hero asymmetric grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 3fr', gap: 6, marginBottom: 10 }}>
          {/* Large aerial */}
          <div style={{ gridRow: '1 / 3', position: 'relative', borderRadius: 10, overflow: 'hidden', minHeight: 220 }}>
            <Image src="/images/deals/granbury/granbury-1.jpg" alt="Granbury aerial view" fill style={{ objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }} />
          </div>
          {/* Top right -- drive-up perspective */}
          <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', height: 107 }}>
            <Image src="/images/deals/granbury/granbury-5.jpg" alt="Drive-up units" fill style={{ objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' }} />
            <div style={{ position: 'absolute', left: 6, bottom: 6, background: C.warmWhite10, borderRadius: 2, padding: '2px 8px', fontSize: '0.52rem', fontWeight: 700, color: C.warmWhite70 }}>Drive-Up Units</div>
          </div>
          {/* Bottom right -- 3 small */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
            <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', height: 107 }}>
              <Image src="/images/deals/granbury/granbury-4.jpg" alt="Office front" fill style={{ objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' }} />
              <div style={{ position: 'absolute', left: 4, bottom: 4, background: C.warmWhite10, borderRadius: 2, padding: '2px 6px', fontSize: '0.48rem', fontWeight: 700, color: C.warmWhite70 }}>Office</div>
            </div>
            <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', height: 107 }}>
              <Image src="/images/deals/granbury/granbury-2.jpg" alt="Expansion" fill style={{ objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' }} />
              <div style={{ position: 'absolute', left: 4, bottom: 4, background: C.orange, borderRadius: 2, padding: '2px 6px', fontSize: '0.48rem', fontWeight: 700 }}>Recent Expansion</div>
            </div>
            <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', height: 107 }}>
              <Image src="/images/deals/granbury/granbury-3.jpg" alt="Drive-up units" fill style={{ objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' }} />
              <div style={{ position: 'absolute', left: 4, bottom: 4, background: C.orange, borderRadius: 2, padding: '2px 6px', fontSize: '0.48rem', fontWeight: 700 }}>Recent Expansion</div>
            </div>
          </div>
        </div>

        {/* Data as compact support strip */}
        <div style={{ borderTop: `1px solid ${C.warmWhite06}`, borderBottom: `1px solid ${C.warmWhite06}`, padding: '8px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'monospace', fontSize: '0.82rem', fontVariantNumeric: 'tabular-nums' }}>
            <span><strong style={{ fontWeight: 900 }}>773</strong> <span style={{ color: C.warmWhite50 }}>Units</span></span>
            <span style={{ color: C.warmWhite10 }}>&middot;</span>
            <span><strong style={{ fontWeight: 900 }}>126K</strong> <span style={{ color: C.warmWhite50 }}>NRSF</span></span>
            <span style={{ color: C.warmWhite10 }}>&middot;</span>
            <span><strong style={{ fontWeight: 900 }}>17</strong> <span style={{ color: C.warmWhite50 }}>Bldgs</span></span>
            <span style={{ color: C.warmWhite10 }}>&middot;</span>
            <span><strong style={{ fontWeight: 900 }}>5.37</strong> <span style={{ color: C.warmWhite50 }}>Acres</span></span>
            <span style={{ color: C.warmWhite10 }}>&middot;</span>
            <span><strong style={{ fontWeight: 900 }}>449</strong> <span style={{ color: C.warmWhite50 }}>Drive-Up</span></span>
            <span style={{ color: C.warmWhite10 }}>&middot;</span>
            <span><strong style={{ fontWeight: 900 }}>315</strong> <span style={{ color: C.warmWhite50 }}>Climate</span></span>
            <span style={{ color: C.warmWhite10 }}>&middot;</span>
            <span><strong style={{ fontWeight: 900 }}>9</strong> <span style={{ color: C.warmWhite50 }}>Office Suites</span></span>
          </div>
          <div style={{ marginTop: 4, fontSize: '0.82rem', color: C.warmWhite55, display: 'flex', justifyContent: 'flex-end' }}>
            <span><span style={{ color: C.orange, fontWeight: 700 }}>5.95%</span> Cap Rate &middot; <span style={{ fontWeight: 700 }}>$85/NRSF</span> <span style={{ color: C.warmWhite50 }}>below replacement</span></span>
          </div>
        </div>
      </Content>
      <Footer />
    </Page>
  )
}


/* =====================================================
   SLIDE 12 -- MARKET OVERVIEW
   ===================================================== */

function SlideMarketOverview() {
  return (
    <Page>
      <Header label="Local Market" />
      <Content>
        <H2 style={{ marginBottom: 10 }}>Market Overview</H2>

        {/* Hero stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 14, borderTop: `1px solid ${C.warmWhite06}`, borderBottom: `1px solid ${C.warmWhite06}`, padding: '10px 0' }}>
          <div>
            <div style={{ fontFamily: 'monospace', fontWeight: 900, color: C.orange, fontSize: '1.7rem', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>0</div>
            <div style={{ marginTop: 3, fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: C.warmWhite50 }}>New supply since 2005</div>
          </div>
          <div style={{ height: 30, width: 1, background: C.warmWhite08 }} />
          <div>
            <div style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '1.7rem', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>22K</div>
            <div style={{ marginTop: 3, fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: C.warmWhite50 }}>Cars/day on Hwy 377</div>
          </div>
          <div style={{ height: 30, width: 1, background: C.warmWhite08 }} />
          <div>
            <div style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '1.7rem', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>3.1%</div>
            <div style={{ marginTop: 3, fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: C.warmWhite50 }}>Pop. growth (10 min)</div>
          </div>
          <div style={{ height: 30, width: 1, background: C.warmWhite08 }} />
          <div>
            <div style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '1.7rem', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>$91K</div>
            <div style={{ marginTop: 3, fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: C.warmWhite50 }}>Median HHI</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Left -- data */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <p style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: C.warmWhite50, marginBottom: 4 }}>Population &amp; Income</p>
              <ul style={{ fontSize: '0.82rem', lineHeight: 1.65, color: C.warmWhite70, listStyle: 'none', padding: 0 }}>
                <li>Median HHI of <strong style={{ color: C.warmWhite80 }}>$91k</strong> / Avg. HHI of <strong style={{ color: C.warmWhite80 }}>$112k</strong></li>
                <li>16k people in 10mins, w/ higher daytime population</li>
                <li><strong style={{ color: C.orange }}>3.1%</strong> population growth projected in 10 mins</li>
              </ul>
            </div>
            <div>
              <p style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: C.warmWhite50, marginBottom: 4 }}>Demand Drivers</p>
              <p style={{ fontSize: '0.82rem', lineHeight: 1.65, color: C.warmWhite70 }}>
                <strong style={{ color: C.warmWhite80 }}>No new supply</strong> has entered the 5-mile radius since 2005, besides one multi-story climate property (Store House Storage). All other competitors are lower-quality, many lacking security or online rentals.
              </p>
            </div>
            <div>
              <p style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: C.warmWhite50, marginBottom: 4 }}>Nearby Growth</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {['Lakeview Landing (47-acre mixed-use)', 'The Crossing (50-acre mixed-use)', '500+ housing units in development', 'Academy Sports', 'Hobby Lobby', 'Homegoods', 'Ulta'].map((item, i) => (
                  <span key={i} style={{ borderRadius: 6, background: C.warmWhite04, border: `1px solid ${C.warmWhite06}`, padding: '3px 8px', fontSize: '0.72rem', color: C.warmWhite55 }}>{item}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Right -- satellite map */}
          <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden' }}>
            <Image src="/images/deals/granbury/granbury-map-satellite.webp" alt="Granbury, TX satellite map" fill style={{ objectFit: 'cover' }} />
            <div style={{ position: 'absolute', bottom: 8, right: 8, borderRadius: 6, background: 'rgba(0,0,0,0.7)', padding: '4px 10px', border: `1px solid ${C.warmWhite08}` }}>
              <span style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.08em', color: C.orange }}>&oplus;</span>
              <span style={{ marginLeft: 6, fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.08em', color: C.warmWhite60 }}>5 mi radius</span>
            </div>
          </div>
        </div>
      </Content>
      <Footer />
    </Page>
  )
}


/* =====================================================
   SLIDE 13 -- COMPETITION
   ===================================================== */

function SlideCompetition() {
  const competitors = [
    { name: 'Champion Storage', grade: 'B+', web: 'F', note: 'No Online Rentals' },
    { name: 'DONE Storage', grade: 'C', web: 'C', note: 'Low Vacancy' },
    { name: 'Lake Granbury Lock & Leave', grade: 'B', web: 'NO', note: 'Very Small Location' },
    { name: 'KO Storage', grade: 'B-', web: 'B-', note: 'Basic Automations' },
    { name: 'Landmark Storage', grade: 'F', web: 'C', note: 'Very Rough Facility' },
    { name: 'Store House Storage', grade: 'A+', web: 'B+', note: '3-Story Climate' },
    { name: 'GuardBox Storage', grade: 'B+', web: 'A-', note: 'Location Limited' },
    { name: 'AAA Self Storage', grade: 'C', web: 'C', note: 'Low Vacancy' },
    { name: 'Lancrow Self Storage', grade: 'D+', web: 'C', note: 'Low Vacancy' },
    { name: 'U-Loc-It Storage', grade: 'C+', web: 'B-', note: 'Few Sizes Offered' },
    { name: 'A&E Storage', grade: 'C', web: 'B-', note: 'Waiting Lists' },
    { name: 'Acton Discount Storage', grade: 'D', web: 'C-', note: 'All Gravel/Grass' },
    { name: 'Walnut Creek Storage', grade: 'B', web: 'A-', note: 'Waiting Lists' },
    { name: 'Thrifty Self Storage', grade: 'C', web: 'C', note: 'Low Vacancy' },
  ]

  function gc(g: string) {
    if (g.startsWith('A')) return C.orange
    if (g.startsWith('B')) return C.warmWhite70
    if (g === 'NO') return '#E84040'
    if (g.startsWith('C')) return C.stone
    return C.warmWhite30
  }

  const grades = competitors.map(c => c.grade)
  const aCount = grades.filter(g => g.startsWith('A')).length
  const bCount = grades.filter(g => g.startsWith('B')).length
  const cCount = grades.filter(g => g.startsWith('C')).length
  const dfCount = grades.filter(g => g.startsWith('D') || g.startsWith('F') || g === 'NO').length

  const thS: React.CSSProperties = { padding: '4px 8px', textAlign: 'left', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: C.warmWhite50 }

  return (
    <Page>
      <Header label="Competitive Landscape" />
      <Content style={{ justifyContent: 'flex-start', paddingTop: 4 }}>
        <H2 style={{ fontSize: '2.15rem', marginBottom: 6 }}>Competition Analysis</H2>

        {/* Grade distribution hero */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 10, borderTop: `1px solid ${C.warmWhite06}`, borderBottom: `1px solid ${C.warmWhite06}`, padding: '8px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'monospace', fontWeight: 900, color: C.orange, fontSize: '1.5rem', lineHeight: 1 }}>{aCount}</div>
              <div style={{ marginTop: 2, fontSize: '0.58rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: C.warmWhite50 }}>A Grade</div>
            </div>
            <div style={{ height: 24, width: 1, background: C.warmWhite08 }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'monospace', fontWeight: 900, color: C.warmWhite60, fontSize: '1.5rem', lineHeight: 1 }}>{bCount}</div>
              <div style={{ marginTop: 2, fontSize: '0.58rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: C.warmWhite50 }}>B Grade</div>
            </div>
            <div style={{ height: 24, width: 1, background: C.warmWhite08 }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'monospace', fontWeight: 900, color: C.warmWhite30, fontSize: '1.5rem', lineHeight: 1 }}>{cCount}</div>
              <div style={{ marginTop: 2, fontSize: '0.58rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: C.warmWhite50 }}>C Grade</div>
            </div>
            <div style={{ height: 24, width: 1, background: C.warmWhite08 }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'monospace', fontWeight: 900, color: C.warmWhite20, fontSize: '1.5rem', lineHeight: 1 }}>{dfCount}</div>
              <div style={{ marginTop: 2, fontSize: '0.58rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: C.warmWhite50 }}>D/F Grade</div>
            </div>
          </div>
          <div style={{ borderLeft: `2px solid ${C.orange}`, paddingLeft: 12 }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 700 }}>Most competitors lack basic technology, security, or online presence.</p>
            <p style={{ fontSize: '0.72rem', color: C.warmWhite55 }}>Journey enters with A+ operations against a market that can&apos;t compete after 5 PM.</p>
          </div>
        </div>

        {/* Table + Map side by side */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 14 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.warmWhite08}` }}>
                <th style={{ ...thS, width: 24 }}>#</th>
                <th style={thS}>Competitor</th>
                <th style={{ ...thS, textAlign: 'center' }}>Facility</th>
                <th style={{ ...thS, textAlign: 'center' }}>Website</th>
                <th style={thS}>Note</th>
              </tr>
            </thead>
            <tbody>
              {competitors.map((c, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.warmWhite03}` }}>
                  <td style={{ padding: '2px 6px', fontFamily: 'monospace', fontWeight: 700, color: C.orange40 }}>{String(i + 1).padStart(2, '0')}</td>
                  <td style={{ padding: '2px 6px', fontWeight: 700, color: C.warmWhite70, fontSize: '0.72rem' }}>{c.name}</td>
                  <td style={{ padding: '2px 6px', textAlign: 'center', fontWeight: 700, color: gc(c.grade) }}>{c.grade}</td>
                  <td style={{ padding: '2px 6px', textAlign: 'center', fontWeight: 700, color: gc(c.web) }}>{c.web}</td>
                  <td style={{ padding: '2px 6px', color: C.warmWhite50, fontSize: '0.7rem' }}>{c.note}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Map */}
          <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', border: `1px solid ${C.warmWhite06}` }}>
            <Image src="/images/map/comp-map-dark.webp" alt="Competition map" fill style={{ objectFit: 'cover' }} />
            <div style={{ position: 'absolute', bottom: 8, left: 8, display: 'flex', alignItems: 'center', gap: 10, borderRadius: 6, background: 'rgba(0,0,0,0.7)', padding: '4px 10px', border: `1px solid ${C.warmWhite08}` }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.52rem', fontWeight: 700, color: C.orange }}><span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: C.orange }} />Journey</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.52rem', fontWeight: 700, color: C.warmWhite40 }}><span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: C.stone }} />Competitors</span>
            </div>
          </div>
        </div>
      </Content>
      <Footer />
    </Page>
  )
}


/* =====================================================
   SLIDE 14 -- SOURCES & USES
   ===================================================== */

function SlideSourcesUses() {
  const thStyle: React.CSSProperties = { background: C.orange, padding: '6px 10px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }
  const tdLabel: React.CSSProperties = { padding: '5px 10px 5px 0', fontSize: '0.82rem', color: C.warmWhite55 }
  const tdVal: React.CSSProperties = { padding: '5px 10px', textAlign: 'right', fontSize: '0.82rem', fontWeight: 700, fontFamily: 'monospace', fontVariantNumeric: 'tabular-nums' }
  const trBorder: React.CSSProperties = { borderBottom: `1px solid ${C.warmWhite06}` }

  return (
    <Page>
      <Header label="Financials" />
      <Content>
        <H2 style={{ marginBottom: 10 }}>Sources &amp; Uses</H2>

        {/* Hero metric cards */}
        <div style={{ marginBottom: 10 }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: C.warmWhite50, marginBottom: 8 }}>Project-Level Return Metrics</p>
          {/* Hero row -- 3 key metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 8, fontFamily: 'monospace', fontVariantNumeric: 'tabular-nums' }}>
            {[
              { label: 'Levered IRR', value: '24.98%' },
              { label: 'Project-Level Equity Multiple', value: '2.51x' },
              { label: 'Yield on Cost at Sale', value: '8.8%' },
            ].map((m, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '12px 8px', borderRadius: 10, border: `1px solid ${C.orange20}`, background: C.orange05 }}>
                <div style={{ fontSize: '1.55rem', fontWeight: 900, lineHeight: 1, color: C.orange }}>{m.value}</div>
                <div style={{ marginTop: 5, fontSize: '0.65rem', fontWeight: 700, color: C.warmWhite40, fontFamily: 'var(--font-lato), sans-serif' }}>{m.label}</div>
              </div>
            ))}
          </div>
          {/* Secondary row -- 4 supporting metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, fontFamily: 'monospace', fontVariantNumeric: 'tabular-nums' }}>
            {[
              { label: 'Unlevered IRR', value: '14.20%' },
              { label: 'Levered CoC (Hold)', value: '11.02%' },
              { label: 'Unlevered CoC (Hold)', value: '6.50%' },
              { label: 'Dev. Spread at Sale', value: '2.5%' },
            ].map((m, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '8px', borderRadius: 8, border: `1px solid ${C.warmWhite06}` }}>
                <div style={{ fontSize: '1.15rem', fontWeight: 900, lineHeight: 1, color: C.warmWhite70 }}>{m.value}</div>
                <div style={{ marginTop: 4, fontSize: '0.62rem', fontWeight: 700, color: C.warmWhite30, fontFamily: 'var(--font-lato), sans-serif' }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Sources + Uses tables */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {/* Sources */}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr><th colSpan={2} style={{ ...thStyle, borderRadius: '8px 8px 0 0' }}>Sources (at Close)</th></tr></thead>
            <tbody style={{ fontFamily: 'monospace', fontVariantNumeric: 'tabular-nums' }}>
              {[
                ['Acquisition Loan Proceeds', '$7,560,000'],
                ['LP Equity', '$4,420,484'],
                ['GP Equity', '$136,716'],
              ].map(([l, v], i) => (
                <tr key={i} style={trBorder}><td style={{ ...tdLabel, fontFamily: 'var(--font-lato), sans-serif' }}>{l}</td><td style={tdVal}>{v}</td></tr>
              ))}
              <tr style={{ borderTop: `1px solid ${C.warmWhite10}` }}><td style={{ ...tdLabel, fontWeight: 700, color: C.warmWhite, fontFamily: 'var(--font-lato), sans-serif' }}>Total</td><td style={tdVal}>$12,117,200</td></tr>
            </tbody>
          </table>

          {/* Uses */}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr><th colSpan={2} style={{ ...thStyle, borderRadius: '8px 8px 0 0' }}>Uses (at Close)</th></tr></thead>
            <tbody style={{ fontFamily: 'monospace', fontVariantNumeric: 'tabular-nums' }}>
              {[
                ['Acquisition Costs', '$11,286,000'],
                ['Reserves & Fees', '$831,200'],
              ].map(([l, v], i) => (
                <tr key={i} style={trBorder}><td style={{ ...tdLabel, fontFamily: 'var(--font-lato), sans-serif' }}>{l}</td><td style={tdVal}>{v}</td></tr>
              ))}
              <tr style={{ borderTop: `1px solid ${C.warmWhite10}` }}><td style={{ ...tdLabel, fontWeight: 700, color: C.warmWhite, fontFamily: 'var(--font-lato), sans-serif' }}>Total</td><td style={tdVal}>$12,117,200</td></tr>
            </tbody>
          </table>
        </div>
      </Content>
      <Footer />
    </Page>
  )
}


/* =====================================================
   SLIDE 15 -- PROJECTIONS
   ===================================================== */

function SlideProjections() {
  const rows = [
    { label: 'Rental Income', indent: true, values: ['$944,852', '$1,145,895', '$1,332,639', '$1,372,618', '$1,413,797'] },
    { label: 'Ancillary Income', indent: true, values: ['$55,192', '$63,077', '$70,961', '$70,961', '$70,961'] },
    { label: 'Fee & Other Income', indent: true, values: ['$31,733', '$36,709', '$39,244', '$40,234', '$41,253'] },
    { label: 'Bad Debt', indent: true, values: ['($9,449)', '($11,459)', '($13,326)', '($13,726)', '($14,138)'] },
    { label: 'Discounts', indent: true, values: ['($37,104)', '($37,104)', '($27,828)', '($27,828)', '($27,828)'] },
    { label: 'Effective Gross Income', bold: true, values: ['$985,225', '$1,197,118', '$1,401,690', '$1,442,259', '$1,484,045'] },
    { spacer: true, label: '', values: [] },
    { label: 'Total Expenses', bold: true, values: ['($352,056)', '($376,130)', '($399,737)', '($409,719)', '($419,958)'] },
    { spacer: true, label: '', values: [] },
    { label: 'Net Operating Income', bold: true, highlight: true, values: ['$633,169', '$820,988', '$1,001,953', '$1,032,540', '$1,064,087'] },
    { spacer: true, label: '', values: [] },
    { label: 'Yield on Cost', metric: true, values: ['5.23%', '6.78%', '8.27%', '8.52%', '8.78%'] },
    { label: 'Debt Service Coverage', metric: true, values: ['1.34x', '1.37x', '1.67x', '1.63x', '1.3x'] },
    { label: 'Cash on Cash', metric: true, values: ['0.00%', '4.36%', '8.24%', '26.78%', '15.72%'] },
  ]

  const years = [
    { label: 'Year 1', sub: 'In Lease-Up' }, { label: 'Year 2', sub: 'In Lease-Up' },
    { label: 'Year 3', sub: 'Stabilized' }, { label: 'Year 4', sub: 'Stabilized' }, { label: 'Year 5', sub: 'Stabilized' },
  ]

  return (
    <Page>
      <Header label="Financial Model" />
      <Content>
        <H2 style={{ fontSize: '2.2rem', marginBottom: 2 }}>Annualized Projections<span style={{ color: C.orange }}>*</span></H2>
        <p style={{ fontSize: '0.8rem', color: C.warmWhite55, marginBottom: 12 }}>* Expected Case</p>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontVariantNumeric: 'tabular-nums', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.warmWhite08}` }}>
              <th style={{ background: C.orange, padding: '6px 10px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', borderRadius: '6px 0 0 0' }}>P&amp;L by Year</th>
              {years.map((y, i) => (
                <th key={i} style={{ background: C.orange, padding: '6px 10px', textAlign: 'right', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', ...(i === 4 ? { borderRadius: '0 6px 0 0' } : {}) }}>
                  <div>{y.label}</div>
                  <div style={{ fontWeight: 400, color: 'rgba(255,255,255,0.6)' }}>{y.sub}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody style={{ fontFamily: 'monospace' }}>
            {rows.map((r, i) => {
              if (r.spacer) return <tr key={i}><td colSpan={6} style={{ height: 4 }} /></tr>
              return (
                <tr key={i} style={{ borderBottom: `1px solid ${r.highlight ? C.warmWhite10 : C.warmWhite04}`, ...(r.highlight ? { background: C.orange04 } : {}) }}>
                  <td style={{ padding: '5px 10px', fontFamily: 'inherit', ...(r.indent ? { paddingLeft: 22, color: C.warmWhite40 } : {}), ...(r.bold ? { fontWeight: 700, color: C.warmWhite } : {}), ...(r.metric ? { fontWeight: 700, color: C.orange } : {}) }}>{r.label}</td>
                  {r.values.map((v, j) => (
                    <td key={j} style={{ padding: '5px 10px', textAlign: 'right', ...(r.bold ? { fontWeight: 700, color: C.warmWhite } : { color: C.warmWhite50 }), ...(r.metric ? { fontWeight: 700, color: C.orange } : {}), ...(r.highlight ? { color: C.warmWhite, fontWeight: 900 } : {}) }}>{v}</td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </Content>
      <Footer />
    </Page>
  )
}


/* =====================================================
   SLIDE 16 -- RETURNS
   ===================================================== */

function SlideReturns() {
  const scenarios = [
    { name: 'Upside Case', border: 'rgba(122,175,110,0.2)', bg: 'rgba(122,175,110,0.03)', labelBg: '#7AAF6E', returns: ['$21,246', '$72,603', '$850,537', '$66,114', '$1,448,089'], coc: ['2.12%', '9.38%', '94.44%', '101.05%', '245.86%'] },
    { name: 'Expected Case', border: C.orange25, bg: C.orange04, labelBg: C.orange, returns: ['$20,494', '$69,422', '$749,819', '$80,085', '$1,106,370'], coc: ['2.05%', '8.99%', '83.97%', '91.98%', '202.62%'] },
    { name: 'Downside Case', border: C.warmWhite08, bg: C.warmWhite02, labelBg: C.stone, returns: ['$19,739', '$66,256', '$651,442', '$76,779', '$848,873'], coc: ['1.97%', '8.60%', '73.74%', '81.42%', '166.31%'] },
  ]

  const thS: React.CSSProperties = { padding: '4px 10px', textAlign: 'right' as const, fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: C.warmWhite40 }

  return (
    <Page>
      <Header label="Projected Returns" />
      <Content>
        <H2 style={{ fontSize: '2.2rem', marginBottom: 2 }}>Investor Return Projections</H2>
        <p style={{ fontSize: '0.8rem', color: C.warmWhite55, marginBottom: 16 }}>
          All scenarios assume a refinance at end of Year 3 and Sale at end of Year 5.
        </p>

        {/* Expected Case -- HERO, full width, larger */}
        <div style={{ borderRadius: 12, border: `1px solid ${C.orange25}`, background: C.orange04, padding: '16px 18px', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ background: C.orange, borderRadius: 4, padding: '4px 12px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Expected Case</span>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'monospace', fontWeight: 900, color: C.orange, fontSize: '1.7rem', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>202.62%</div>
              <div style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: C.warmWhite50, marginTop: 2 }}>Cumulative CoC &middot; Year 5</div>
            </div>
          </div>
          <table style={{ width: '100%', fontSize: '0.85rem', fontFamily: 'monospace', fontVariantNumeric: 'tabular-nums', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ ...thS, textAlign: 'left' }} />
                {[1, 2, 3, 4, 5].map(y => <th key={y} style={thS}>Year {y}</th>)}
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: `1px solid ${C.warmWhite06}` }}>
                <td style={{ padding: '4px 10px 4px 0', fontFamily: 'inherit', fontSize: '0.82rem', color: C.warmWhite60 }}>Annual Return</td>
                {scenarios[1].returns.map((v, i) => <td key={i} style={{ padding: '4px 10px', textAlign: 'right', fontWeight: 700 }}>{v}</td>)}
              </tr>
              <tr>
                <td style={{ padding: '4px 10px 4px 0', fontFamily: 'inherit', fontSize: '0.82rem', color: C.warmWhite60 }}>Cumulative CoC</td>
                {scenarios[1].coc.map((v, i) => <td key={i} style={{ padding: '4px 10px', textAlign: 'right', fontWeight: 700 }}>{v}</td>)}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Upside + Downside -- compact context, side by side */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[scenarios[0], scenarios[2]].map((s) => (
            <div key={s.name} style={{ borderRadius: 10, border: `1px solid ${s.border}`, background: s.bg, padding: '12px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ background: s.labelBg, borderRadius: 4, padding: '3px 10px', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.name}</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 700, color: C.warmWhite60, fontSize: '0.85rem', fontVariantNumeric: 'tabular-nums' }}>{s.coc[4]} CoC</span>
              </div>
              <table style={{ width: '100%', fontSize: '0.78rem', fontFamily: 'monospace', fontVariantNumeric: 'tabular-nums', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ ...thS, textAlign: 'left', fontSize: '0.58rem' }} />
                    {[1, 2, 3, 4, 5].map(y => <th key={y} style={{ ...thS, fontSize: '0.58rem' }}>Yr {y}</th>)}
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: `1px solid ${C.warmWhite04}` }}>
                    <td style={{ padding: '3px 8px 3px 0', fontFamily: 'inherit', fontSize: '0.75rem', color: C.warmWhite55 }}>Return</td>
                    {s.returns.map((v, i) => <td key={i} style={{ padding: '3px 8px', textAlign: 'right', color: C.warmWhite60 }}>{v}</td>)}
                  </tr>
                  <tr>
                    <td style={{ padding: '3px 8px 3px 0', fontFamily: 'inherit', fontSize: '0.75rem', color: C.warmWhite55 }}>Cum. CoC</td>
                    {s.coc.map((v, i) => <td key={i} style={{ padding: '3px 8px', textAlign: 'right', color: C.warmWhite60 }}>{v}</td>)}
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
        </div>

        <p style={{ marginTop: 10, fontSize: '0.7rem', color: C.warmWhite30, fontStyle: 'italic' }}>
          *Based on a $1,000,000 investment. Does not include additional tax benefit value from Year 1 bonus depreciation.
        </p>
      </Content>
      <Footer />
    </Page>
  )
}


/* =====================================================
   SLIDE 17 -- CONTACT / CLOSE
   ===================================================== */

function SlideContact() {
  return (
    <Page last>
      <div style={{ position: 'absolute', inset: 0 }}>
        <Image src="/images/hero/direct-hero-bg.webp" alt="" fill sizes="297mm" style={{ objectFit: 'cover', objectPosition: '50% 62%', filter: 'grayscale(30%) contrast(1.1) brightness(0.4) sepia(0.1)' }} />
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.4), rgba(0,0,0,0.8))' }} />
      <div style={{ position: 'absolute', inset: 0, mixBlendMode: 'overlay', background: 'radial-gradient(ellipse 55% 50% at 50% 45%, rgba(232,98,42,0.08), transparent)' }} />

      <div style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}><Logo /></div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 60 }}>
          {/* Left -- Next Steps */}
          <div style={{ flex: 1, maxWidth: 480 }}>
            <h2 style={{ fontSize: '2.8rem', fontWeight: 900, textTransform: 'uppercase', lineHeight: 0.92, letterSpacing: '-0.03em', marginBottom: 20 }}>
              What Happens<br />
              <span style={{ fontWeight: 300, fontStyle: 'italic', textTransform: 'none', color: C.orange }}>Next</span>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: C.warmWhite70 }}>
                The deal has been presented. The numbers speak.
              </p>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: C.warmWhite70 }}>
                If it resonates, the next step is simple. Review the documents with your advisors and let&apos;s go from there.
              </p>
            </div>
            <div style={{ marginTop: 20, display: 'inline-flex', width: 'fit-content', background: C.orange, borderRadius: 2, padding: '8px 18px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Accepting subscriptions until May 8, 2026</span>
            </div>
          </div>

          {/* Right -- Contact */}
          <div>
            <h3 style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: C.warmWhite60, marginBottom: 12 }}>Further Information</h3>
            {[
              { icon: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z', text: '(417) 848-2425' },
              { icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z', text: 'direct.journey.storage' },
              { icon: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6', text: 'jonah@journey.storage' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: C.orange15, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.orange} strokeWidth="2"><path d={item.icon} /></svg>
                </div>
                <span style={{ fontSize: '0.88rem', color: C.warmWhite80 }}>{item.text}</span>
              </div>
            ))}

            <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ position: 'relative', width: 64, height: 64, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                <Image src="/images/other/qr-code.webp" alt="QR code — direct.journey.storage" fill style={{ objectFit: 'contain' }} />
              </div>
              <span style={{ fontSize: '0.75rem', color: C.warmWhite55 }}>Or scan here</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </Page>
  )
}


/* =====================================================
   MAIN -- Assembles all slides
   ===================================================== */

export default function GranburyPrintDeck() {
  return (
    <>
      {/* Scale root font-size so all rem values increase proportionally */}
      <style dangerouslySetInnerHTML={{ __html: `:root { font-size: 19px !important; }` }} />
      <main
        style={{
          background: C.black,
          width: '297mm',
          margin: '0 auto',
          WebkitPrintColorAdjust: 'exact',
          printColorAdjust: 'exact',
        } as React.CSSProperties}
      >
      <SlideCover />
      <SlideOpportunity />
      <SlideOperator />
      <SlideMarket />
      <SlideOperations />
      <SlideGrowthThesis />
      <SlideDealCover />
      <SlideDisclaimer />
      <SlideCurrentOpportunity />
      <SlideInvestmentSummary />
      <SlidePropertyDetails />
      <SlideMarketOverview />
      <SlideCompetition />
      <SlideSourcesUses />
      <SlideProjections />
      <SlideReturns />
      <SlideContact />
      </main>
    </>
  )
}
