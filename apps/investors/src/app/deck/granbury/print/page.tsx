import Image from 'next/image'

/*
  Print-optimized deck: every <Page> is exactly 297×210mm (A4 landscape).
  Puppeteer renders this route and outputs a pixel-perfect PDF.
  No responsive utilities, no snap-scroll — just fixed dimensions.
*/

/* ── Design tokens (print) ── */
const C = {
  black: '#181818',
  charcoal: '#3A3835',
  orange: '#E8622A',
  stone: '#888680',
  warmWhite: '#F5F0E8',
  warmWhite80: 'rgba(245,240,232,0.80)',
  warmWhite70: 'rgba(245,240,232,0.70)',
  warmWhite60: 'rgba(245,240,232,0.60)',
  warmWhite50: 'rgba(245,240,232,0.50)',
  warmWhite40: 'rgba(245,240,232,0.40)',
  warmWhite35: 'rgba(245,240,232,0.35)',
  warmWhite30: 'rgba(245,240,232,0.30)',
  warmWhite20: 'rgba(245,240,232,0.20)',
  warmWhite10: 'rgba(245,240,232,0.10)',
  warmWhite06: 'rgba(245,240,232,0.06)',
  warmWhite04: 'rgba(245,240,232,0.04)',
  orange15: 'rgba(232,98,42,0.15)',
  orange06: 'rgba(232,98,42,0.06)',
  orange40: 'rgba(232,98,42,0.40)',
} as const

/* ── Shared sub-components ── */

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
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '6px 48px 10px',
        fontSize: '0.55rem',
        letterSpacing: '0.04em',
        color: C.warmWhite35,
      }}
    >
      <span>PRIVILEGED AND CONFIDENTIAL</span>
      <span>DALLAS, TX | Q2, 2026</span>
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
      <div style={{ height: 1, width: 32, background: C.orange40 }} />
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
        fontSize: '2.1rem',
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
  return <span style={{ color, marginRight: 6 }}>•</span>
}


/* ═══════════════════════════════════════════════
   SLIDE 1 — COVER
   ═══════════════════════════════════════════════ */

function SlideCover() {
  return (
    <Page>
      <div style={{ position: 'absolute', inset: 0 }}>
        <Image src="/images/hero/direct-hero-bg.webp" alt="" fill sizes="297mm" style={{ objectFit: 'cover', objectPosition: '50% 62%', filter: 'grayscale(30%) contrast(1.1) brightness(0.5) sepia(0.1)' }} />
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.3), rgba(0,0,0,0.75))' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 65% at 50% 50%, transparent, rgba(24,24,24,0.55))' }} />

      <div style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}><Logo /></div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h1 style={{ fontSize: '5.2rem', fontWeight: 900, textTransform: 'uppercase', lineHeight: 0.92, letterSpacing: '-0.03em' }}>
            The Journey.<span style={{ fontWeight: 300 }}>Direct</span> Platform
          </h1>
          <p style={{ marginTop: 14, fontSize: '1.3rem', fontWeight: 300, fontStyle: 'italic', color: C.warmWhite60 }}>
            Part of the Journey.Storage&trade; Ecosystem
          </p>
          <div style={{ marginTop: 16, display: 'inline-flex', width: 'fit-content', background: C.orange, borderRadius: 2, padding: '7px 18px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 900 }}>Est. 2026</span>
          </div>
        </div>
      </div>
      <Footer />
    </Page>
  )
}


/* ═══════════════════════════════════════════════
   SLIDE 2 — THE OPPORTUNITY
   ═══════════════════════════════════════════════ */

function SlideOpportunity() {
  const benefits = [
    { title: 'Direct ownership in a recession-resilient asset class', desc: 'Backed by a team with $200M+ in completed transactions.' },
    { title: 'Value-add strategy that creates measurable equity', desc: 'Through operational transformation, not market speculation.' },
    { title: 'Full alignment — the sponsor invests alongside you', desc: 'Transparent reporting throughout the hold period.' },
  ]

  return (
    <Page>
      <Header label="The Opportunity" />
      <Content>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <H2 style={{ fontSize: '1.5rem', lineHeight: 1.05 }}>
              An opportunity for accredited investors to access operator-led self-storage investments.
            </H2>
            <p style={{ marginTop: 12, fontSize: '0.88rem', lineHeight: 1.8, color: C.warmWhite50, fontStyle: 'italic', maxWidth: 420 }}>
              This is not a fund. This is direct access to the deals, the operator, and the infrastructure behind them.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {benefits.map((b, i) => (
              <div key={i} style={{ background: C.charcoal, borderRadius: 12, padding: '18px 20px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 80% at 20% 50%, rgba(232,98,42,0.06), transparent)' }} />
                <div style={{ position: 'relative', display: 'flex', gap: 12 }}>
                  <div style={{ marginTop: 2, width: 20, height: 20, borderRadius: '50%', background: C.orange15, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={C.orange} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 700, lineHeight: 1.3 }}>{b.title}</div>
                    <div style={{ marginTop: 3, fontSize: '0.8rem', lineHeight: 1.7, color: C.warmWhite40 }}>{b.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Content>
      <Footer />
    </Page>
  )
}


/* ═══════════════════════════════════════════════
   SLIDE 3 — THE OPERATOR
   ═══════════════════════════════════════════════ */

function SlideOperator() {
  const capabilities = ['Acquisitions', 'Asset Management', 'Development', 'Investor Relations', 'Construction', 'Capital Raising', 'Facility Operations', 'Deal Structuring', 'Property Management', 'and more.']

  return (
    <Page>
      <Header label="Leadership" />
      <Content>
        <H2 style={{ fontSize: '2.2rem' }}>On a Mission</H2>
        <p style={{ fontSize: '0.82rem', fontWeight: 700, color: C.orange, marginBottom: 10 }}>Impact &amp; Excellence; Mediocre won&apos;t Suffice</p>

        <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 24 }}>
          {/* Left — Photo + name */}
          <div>
            <div style={{ position: 'relative', width: 160, height: 160, borderRadius: 14, overflow: 'hidden', background: C.charcoal }}>
              <Image src="/images/team/home-jonah-portrait.webp" alt="Jonah M. Hall" fill style={{ objectFit: 'cover', objectPosition: 'top' }} />
            </div>
            <h3 style={{ fontSize: '1.0rem', fontWeight: 900, marginTop: 8 }}>Jonah M. Hall</h3>
            <ul style={{ marginTop: 4, fontSize: '0.72rem', lineHeight: 1.8, color: C.warmWhite50, listStyle: 'none', padding: 0 }}>
              <li>Deep Industry Relationships</li>
              <li>Proven Team Building Experience</li>
              <li>Storage Operational Mastery</li>
              <li>Strong Transactional Prowess</li>
              <li style={{ fontWeight: 700, color: C.warmWhite70 }}>8yrs+ Industry UW Experience</li>
              <li style={{ fontWeight: 700, color: C.warmWhite70 }}>$200M+ Deals Acquired/Developed</li>
            </ul>
          </div>

          {/* Right */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ fontSize: '0.82rem', lineHeight: 1.8, color: C.warmWhite60 }}>
              In under a decade in the industry, Jonah has served in almost every capacity, wearing the hats and running point directly, as well as building teams, systems and critical infrastructure around:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px 24px', fontSize: '0.8rem', color: C.warmWhite50 }}>
              {capabilities.map((c, i) => (
                <span key={i}><Dot />{c}</span>
              ))}
            </div>

            <div style={{ borderLeft: `2px solid ${C.orange40}`, paddingLeft: 14, marginTop: 2 }}>
              <h4 style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: C.warmWhite70, marginBottom: 4 }}>A Decisive Divestiture</h4>
              <p style={{ fontSize: '0.75rem', lineHeight: 1.8, color: C.warmWhite40 }}>
                In January 2026, Jonah M. Hall successfully exited his previous venture, <em>Smartlock Self Storage</em>, and walked away from his active principal position at <em>Cedar Creek Capital</em> — reclaiming sovereignty and clearing the path for the Ecosystem.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 30, alignItems: 'center', marginTop: 2 }}>
              <div>
                <div style={{ fontSize: '1.7rem', fontWeight: 900 }}>$200M<span style={{ color: C.orange }}>+</span></div>
                <div style={{ fontSize: '0.58rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.25em', color: C.warmWhite30 }}>Deals acquired & developed</div>
              </div>
              <div style={{ width: 1, height: 30, background: C.warmWhite06 }} />
              <div>
                <div style={{ fontSize: '1.7rem', fontWeight: 900 }}>8<span style={{ color: C.orange }}>+</span></div>
                <div style={{ fontSize: '0.58rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.25em', color: C.warmWhite30 }}>Years in the industry</div>
              </div>
              <div style={{ width: 1, height: 30, background: C.warmWhite06 }} />
              <div>
                <div style={{ fontSize: '1.7rem', fontWeight: 900 }}>Full-stack</div>
                <div style={{ fontSize: '0.58rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.25em', color: C.warmWhite30 }}>Operator experience</div>
              </div>
            </div>
          </div>
        </div>
      </Content>
      <Footer />
    </Page>
  )
}


/* ═══════════════════════════════════════════════
   SLIDE 4 — THE STORAGE INFLECTION POINT
   ═══════════════════════════════════════════════ */

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

  const thStyle: React.CSSProperties = { padding: '5px 6px', textAlign: 'right', fontSize: '0.66rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: C.warmWhite50 }
  const tdStyle: React.CSSProperties = { padding: '4px 6px', textAlign: 'right', fontSize: '0.75rem', color: C.warmWhite40, fontFamily: 'monospace', fontVariantNumeric: 'tabular-nums' }

  return (
    <Page>
      <Header label="The Market" />
      <Content>
        <H2 style={{ fontSize: '2.1rem', marginBottom: 14 }}>The Storage Inflection Point</H2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
          {/* Left */}
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 6 }}>The Market</h3>
            <p style={{ fontSize: '0.78rem', lineHeight: 1.8, color: C.warmWhite50, marginBottom: 6 }}>
              For decades, the self-storage sector has been bifurcated into two distinct classes:
            </p>
            <ul style={{ fontSize: '0.78rem', lineHeight: 1.85, color: C.warmWhite50, paddingLeft: 0, listStyle: 'none' }}>
              <li style={{ marginBottom: 5 }}><Dot />The massive, capital-heavy <strong style={{ color: C.warmWhite70 }}>REITs</strong> (Public Storage, Extra Space Storage) dominate through scale and data aggregation (~40%, up from ~15% in just 10yrs).</li>
              <li style={{ marginBottom: 6 }}><Dot />The fragmented, often unsophisticated <strong style={{ color: C.warmWhite70 }}>&ldquo;Mom-and-Pop&rdquo; Operators</strong> who rely on legacy practices (~60%).</li>
            </ul>
            <div style={{ borderLeft: `2px solid ${C.orange40}`, paddingLeft: 12 }}>
              <p style={{ fontSize: '0.78rem', lineHeight: 1.8, color: C.warmWhite60, fontStyle: 'italic' }}>
                We are not entering the market to compete; we are entering to redefine the benchmark of operational excellence and profitability.
              </p>
            </div>
          </div>

          {/* Right */}
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 6 }}>The Opportunity</h3>
            <p style={{ fontSize: '0.78rem', lineHeight: 1.8, color: C.warmWhite50, marginBottom: 4 }}>
              Demand is driven by the &ldquo;4 Ds&rdquo;: <strong style={{ color: C.orange }}>Death</strong>, <strong style={{ color: C.orange }}>Divorce</strong>, <strong style={{ color: C.orange }}>Downsizing</strong>, and <strong style={{ color: C.orange }}>Dislocation</strong>.
            </p>
            <p style={{ fontSize: '0.78rem', lineHeight: 1.8, color: C.warmWhite50, marginBottom: 10 }}>
              However, the easy money has been made. The &ldquo;if you build it, they will come&rdquo; era is dead. The industry is transitioning from the &ldquo;Digital Age&rdquo; to the &ldquo;Autonomous Age.&rdquo;
            </p>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontVariantNumeric: 'tabular-nums' }}>
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
                  {supplyData.map(d => <td key={d.year} style={{ ...tdStyle, fontWeight: 700, color: C.warmWhite }}>{d.total}</td>)}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Content>
      <Footer />
    </Page>
  )
}


/* ═══════════════════════════════════════════════
   SLIDE 5 — OPERATIONAL EDGE
   ═══════════════════════════════════════════════ */

function SlideOperations() {
  const edges = [
    { num: '01', title: 'Eliminate payroll overhead', desc: 'Fully automated customer onboarding — digital lease, identity verification, and key delivery — removes the need for on-site staff.', impact: 'Up to $80k/yr savings per facility' },
    { num: '02', title: 'Data-driven revenue management', desc: 'Real-time pricing optimization using occupancy, demand, and competitor data. Existing customer rental increases (ECRIs) executed systematically.', impact: '15-20% rent growth potential' },
    { num: '03', title: '24/7 frictionless access', desc: 'NFC tap-to-access, geofenced gates, and digital key sharing. Customers rent, move in, and manage everything from their phone — any hour, any day.', impact: 'Higher occupancy, lower churn' },
    { num: '04', title: 'Automated collections & enforcement', desc: 'Non-payment instantly disables access. Payment restores it. No calls, no confrontation, no bad debt accumulation.', impact: 'Bad debt reduced to <1.5%' },
  ]

  return (
    <Page>
      <Header label="Operations" />
      <Content>
        <H2 style={{ fontSize: '2.1rem' }}>The Operational Edge</H2>
        <p style={{ fontSize: '0.78rem', lineHeight: 1.7, color: C.warmWhite40, marginBottom: 10, maxWidth: 600 }}>
          Every facility we acquire is converted to the Journey.Storage&trade; operating standard. The result: lower expenses, higher revenue, and a customer experience that drives occupancy.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 200px', gap: 8 }}>
          {edges.map((e) => (
            <div key={e.num} style={{ background: C.charcoal, borderRadius: 12, padding: 16, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 80% at 20% 50%, rgba(232,98,42,0.05), transparent)' }} />
              <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                  <span style={{ width: 22, height: 22, borderRadius: '50%', background: C.orange15, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 700, color: C.orange, fontFamily: 'monospace' }}>{e.num}</span>
                  <h4 style={{ fontSize: '0.82rem', fontWeight: 700, lineHeight: 1.25 }}>{e.title}</h4>
                </div>
                <p style={{ fontSize: '0.7rem', lineHeight: 1.7, color: C.warmWhite40, marginBottom: 5 }}>{e.desc}</p>
                <div style={{ fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: C.orange }}>{e.impact}</div>
              </div>
            </div>
          ))}
          {/* Facility photo */}
          <div style={{ gridRow: '1 / 3', gridColumn: 3, position: 'relative', borderRadius: 12, overflow: 'hidden' }}>
            <Image src="/images/facility/journey.storage_12.png" alt="Journey.Storage facility" fill style={{ objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.2), transparent)' }} />
            <div style={{ position: 'absolute', bottom: 10, left: 12, right: 12 }}>
              <p style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: C.warmWhite40 }}>Powered by</p>
              <p style={{ fontSize: '0.72rem', fontWeight: 900, color: C.warmWhite70 }}>Journey.Storage&trade;</p>
            </div>
          </div>
        </div>
      </Content>
      <Footer />
    </Page>
  )
}


/* ═══════════════════════════════════════════════
   SLIDE 6 — GROWTH THESIS
   ═══════════════════════════════════════════════ */

function SlideGrowthThesis() {
  const mathSteps = [
    { label: 'The Buy', value: '$5M', detail: '6% Cap Rate ($300k NOI)' },
    { label: 'The Value', value: '+$180k', detail: 'Cut payroll $80k, raise rents 18%' },
    { label: 'The Exit', value: '$8M', detail: '6% Cap Rate ($480k NOI)' },
    { label: 'The Result', value: '+$3M', detail: 'Value created via operations', highlight: true },
  ]

  const buyBox = [
    { label: 'Market Characteristics', desc: 'Tier 1-3 markets with favorable supply/demand metrics.' },
    { label: 'Demographics', desc: 'Min. 30k people in trade area, positive pop. growth and min. HHI of $60k.' },
    { label: 'Demand', desc: 'Areas indicating strong demand, with manual verifications of pricing & occupancy.' },
    { label: 'Business Friendliness', desc: 'Markets that highlight technology efficiencies and avoid landlord-hurdles.' },
  ]

  const uwInputs = [
    { label: 'Projection Models', desc: 'A decade of storage-specific underwriting experience.' },
    { label: 'Onboarding Cap-Ex', desc: '$200-500k set aside for tech/brand standards.' },
    { label: 'Financing', desc: '55-65% LTC, competitive rates, sized IO periods.' },
    { label: 'Conservative Outlook', desc: '24-48 month lease-up to 85-90% occupancy.' },
    { label: 'Data Analytics', desc: 'Continued adoption of best-in-class technology.' },
  ]

  return (
    <Page>
      <Header label="Strategy" />
      <Content>
        <H2 style={{ fontSize: '2.1rem', marginBottom: 12 }}>Growth Thesis</H2>

        {/* Value-Add Math */}
        <div style={{ marginBottom: 12 }}>
          <h3 style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: C.warmWhite50, marginBottom: 6 }}>The &ldquo;Value-Add&rdquo; Math</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {mathSteps.map((s, i) => (
              <div key={i} style={{ background: s.highlight ? C.orange : C.charcoal, borderRadius: 12, padding: '14px 18px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: s.highlight ? 'rgba(255,255,255,0.7)' : C.warmWhite40, marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 900, fontVariantNumeric: 'tabular-nums' }}>{s.value}</div>
                <div style={{ marginTop: 3, fontSize: '0.62rem', lineHeight: 1.5, color: s.highlight ? 'rgba(255,255,255,0.7)' : C.warmWhite30 }}>{s.detail}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Buy Box + UW Inputs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div>
            <h3 style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: C.warmWhite50, marginBottom: 6 }}>The Deal Buy Box</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5 }}>
              {buyBox.map((b, i) => (
                <div key={i} style={{ border: `1px solid ${C.warmWhite06}`, borderRadius: 8, padding: 10 }}>
                  <div style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: C.orange, marginBottom: 2 }}>{b.label}</div>
                  <p style={{ fontSize: '0.68rem', lineHeight: 1.7, color: C.warmWhite40 }}>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: C.warmWhite50, marginBottom: 6 }}>Key Underwriting Inputs</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {uwInputs.map((u, i) => (
                <div key={i} style={{ display: 'flex', gap: 6, fontSize: '0.72rem', color: C.warmWhite40 }}>
                  <Dot />
                  <span><strong style={{ color: C.warmWhite60 }}>{u.label}:</strong> {u.desc}</span>
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


/* ═══════════════════════════════════════════════
   SLIDE 7 — DEAL COVER
   ═══════════════════════════════════════════════ */

function SlideDealCover() {
  return (
    <Page>
      <div style={{ position: 'absolute', inset: 0 }}>
        <Image src="/images/deals/granbury/granbury-2.jpg" alt="" fill sizes="297mm" style={{ objectFit: 'cover', objectPosition: '50% 40%', filter: 'grayscale(30%) contrast(1.1) brightness(0.45) sepia(0.1)' }} />
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.4), rgba(0,0,0,0.8))' }} />

      <div style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}><Logo /></div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h1 style={{ fontSize: '4.8rem', fontWeight: 900, textTransform: 'uppercase', lineHeight: 0.88, letterSpacing: '-0.03em' }}>
            Journey.Storage<span style={{ fontSize: '0.5em', verticalAlign: 'super' }}>&trade;</span><br />Granbury
          </h1>
          <p style={{ marginTop: 10, fontSize: '1.15rem', fontWeight: 300, fontStyle: 'italic', color: C.warmWhite50 }}>An Investment Opportunity</p>
          <div style={{ marginTop: 12, display: 'inline-flex', width: 'fit-content', background: C.orange, borderRadius: 2, padding: '7px 18px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 900 }}>Est. 2026</span>
          </div>
        </div>
        <p style={{ fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.1em', color: C.warmWhite30 }}>
          An Investment Offering from <span style={{ color: C.warmWhite50 }}>Journey.Direct&trade;</span>
        </p>
      </div>
      <Footer />
    </Page>
  )
}


/* ═══════════════════════════════════════════════
   SLIDE 8 — DISCLAIMER
   ═══════════════════════════════════════════════ */

function SlideDisclaimer() {
  const pStyle: React.CSSProperties = { marginBottom: 12, fontSize: '0.72rem', lineHeight: 1.85, color: C.warmWhite40 }

  return (
    <Page>
      <Header label="" />
      <Content style={{ justifyContent: 'flex-start', paddingTop: 10 }}>
        <H2 style={{ fontSize: '1.6rem', marginBottom: 10 }}>Disclaimer</H2>
        <div style={{ maxWidth: 820 }}>
          <p style={pStyle}>
            This contains privileged and confidential information and unauthorized use of this information in any manner is strictly prohibited. This is for informational purposes and not intended to be a general solicitation or a securities offering of any kind. The information contained herein is from sources believed to be reliable, however no representation by Journey.Direct&trade; (&ldquo;JD&rdquo;), nor by Journey.Storage&trade; (&ldquo;JS&rdquo;), either expressed or implied, is made as to the accuracy of any information and all investors should conduct their own research to determine the accuracy of any statements made.
          </p>
          <p style={pStyle}>
            Neither JD (nor JS), nor their representatives, officers, employees, affiliates, sub-contractors or vendors provide tax, legal or investment advice. Nothing in this document is intended to be or should be construed as such advice. The SEC has not passed upon the merits of or given its approval to the securities, the terms of the offering, or the accuracy or completeness of any offering materials.
          </p>
          <p style={pStyle}>
            Potential investors and other readers are also cautioned that these forward-looking statements are predictions only based on current information, assumptions and expectations that are inherently subject to risks and uncertainties that could cause future events or results to differ materially from those set forth or implied by such forward looking statements.
          </p>
          <p style={pStyle}>
            This further contains several future financial projections and forecasts. These estimated projections are based on numerous assumptions and hypothetical scenarios and JD (and JS) explicitly make no representation or warranty of any kind with respect to any financial projection or forecast.
          </p>
          <p style={{ ...pStyle, marginBottom: 0 }}>
            <strong style={{ color: C.warmWhite60 }}>Past performance does not guarantee future results.</strong> Current performance may be lower or higher than the performance data presented. All return examples provided are based on assumptions and expectations in light of currently available information, industry trends and comparisons to competitor&apos;s financials. Therefore, actual performance may, and most likely will, substantially differ from these projections and no guarantee is presented or implied as to the accuracy of specific forecasts, projections or predictive statements contained herein.
          </p>
        </div>
      </Content>
      <Footer />
    </Page>
  )
}


/* ═══════════════════════════════════════════════
   SLIDE 9 — CURRENT OPPORTUNITY
   ═══════════════════════════════════════════════ */

function SlideCurrentOpportunity() {
  return (
    <Page>
      <Header label="Current Deal" />
      <Content>
        <H2 style={{ fontSize: '1.6rem', marginBottom: 8 }}>Current Opportunity</H2>
        <p style={{ fontSize: '0.8rem', lineHeight: 1.8, color: C.warmWhite60, marginBottom: 6, maxWidth: 820 }}>
          Journey.Direct&trade; is pleased to present an off-market acquisition of a <strong style={{ color: C.orange }}>773-Unit, 126,000 NRSF portfolio</strong>; three parcels located at 212 Temple Hall Hwy, 409 Western Hills Trl. and 3501 McCreary Rd., all well-positioned within Granbury, TX.
        </p>
        <p style={{ fontSize: '0.8rem', lineHeight: 1.8, color: C.warmWhite60, marginBottom: 14, maxWidth: 820 }}>
          This property is being acquired at <strong style={{ color: C.orange }}>$85/NRSF</strong> ($10.8M) and an all-in cost of <strong style={{ color: C.orange }}>$96/NRSF</strong> ($12.2M), which is roughly <strong>~15% below replacement cost</strong>.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <h3 style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 6 }}>We Will:</h3>
            <ol style={{ paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 5 }}>
              {[
                'Immediately implement additional ancillary revenue sources increasing topline revenue by ~$50k/yr.',
                'Increase occupancy from 70% to ~90% over the first 24 months.',
                "Increase in-place rates from ~$.87/SF to ~$1.02/SF through calculated ECRI's from month 18-36.",
              ].map((item, i) => (
                <li key={i} style={{ display: 'flex', gap: 8, fontSize: '0.75rem', lineHeight: 1.75, color: C.warmWhite50 }}>
                  <span style={{ color: C.orange, fontWeight: 700, flexShrink: 0 }}>{String(i + 1).padStart(2, '0')}</span>
                  {item}
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h3 style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: C.orange, marginBottom: 6 }}>Results:</h3>
            <ul style={{ paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 5 }}>
              <li style={{ fontSize: '0.75rem', lineHeight: 1.75, color: C.warmWhite50 }}><Dot />EGI (Effective Gross Income) will grow from $970k (in-place today) to $1.475M.</li>
              <li style={{ fontSize: '0.75rem', lineHeight: 1.75, color: C.warmWhite50 }}><Dot />OPEX maintained at a healthy margin (~$419k or 29%).</li>
              <li style={{ fontSize: '0.75rem', lineHeight: 1.55 }}><Dot />NOI grows by $460k over 60 months, <strong style={{ color: C.orange }}>adding ~$7.36M in value</strong> (at a 6.25% CR).</li>
            </ul>
          </div>
        </div>
      </Content>
      <Footer />
    </Page>
  )
}


/* ═══════════════════════════════════════════════
   SLIDE 10 — INVESTMENT SUMMARY
   ═══════════════════════════════════════════════ */

function SlideInvestmentSummary() {
  const leftTerms = [
    { label: 'Sponsor(s)', value: 'Journey.Direct, LLC ("JD")' },
    { label: 'Equity Raise', value: '$4,560,000', detail: "Inclusive of Sponsor's Co-Invest (3%)" },
    { label: 'Financing', value: '~$7,560,000 (~63% LTC)' },
    { label: 'Total Project Cost', value: '~$12,120,000' },
    { label: 'Waterfall', value: "Return of Equity first, then 70/30 in favor of LP's" },
    { label: 'Targeted Returns', value: '25% IRR / 2.5x MOIC (Proj-level)', detail: '8.8% Stabilized YOC' },
  ]

  const rightTerms = [
    { label: 'Management Company', value: 'Journey.Management, LLC ("JM")', detail: 'Under the Journey.Storage\u2122 brand' },
    { label: 'Investment Type / Strategy', value: 'Value Add:', detail: 'Lease Up, Revenue Optimization, and Expense Reduction via Automation' },
    { label: 'Sponsor Fees', value: '3% Acq. | 6% Dev. | 2% AM', detail: '3% Acquisition Fee (one-time); 6% Development Fee on work overseen (one-time); 2% Asset Management Fee (ongoing during hold)' },
    { label: 'Targeted Hold Period', value: '5 Years +/-', detail: 'With an expected cash-out refinance near Month 36 (returning ~70% of equity)' },
  ]

  const termBlock: React.CSSProperties = {
    padding: '7px 0',
    borderBottom: `1px solid ${C.warmWhite06}`,
  }
  const labelS: React.CSSProperties = {
    fontSize: '0.52rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.18em',
    color: C.orange,
    marginBottom: 2,
  }
  const valueS: React.CSSProperties = {
    fontSize: '0.78rem',
    fontWeight: 700,
    lineHeight: 1.45,
  }
  const detailS: React.CSSProperties = {
    fontSize: '0.62rem',
    color: C.warmWhite40,
    marginTop: 1,
    lineHeight: 1.45,
  }

  return (
    <Page>
      <Header label="Investment Structure" />
      <Content>
        <H2 style={{ marginBottom: 14 }}>Investment Summary</H2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 24 }}>
          {/* Left column */}
          <div>
            {leftTerms.map((t, i) => (
              <div key={i} style={termBlock}>
                <div style={labelS}>{t.label}</div>
                <div style={valueS}>{t.value}</div>
                {t.detail && <div style={detailS}>{t.detail}</div>}
              </div>
            ))}
          </div>

          {/* Right column */}
          <div>
            {rightTerms.map((t, i) => (
              <div key={i} style={termBlock}>
                <div style={labelS}>{t.label}</div>
                <div style={valueS}>{t.value}</div>
                {t.detail && <div style={detailS}>{t.detail}</div>}
              </div>
            ))}
          </div>

          {/* CTA column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'center' }}>
            <div style={{ background: C.orange, borderRadius: 14, padding: '16px 22px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.52rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>Ask about</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, lineHeight: 1.25 }}>accelerated<br />&ldquo;bonus&rdquo;<br />depreciation</div>
            </div>
            <div style={{ border: `1px solid ${C.orange40}`, borderRadius: 10, padding: '10px 18px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.52rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: C.warmWhite40, marginBottom: 3 }}>Investment Window</div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: C.orange }}>Until May 8, 2026</div>
            </div>
          </div>
        </div>
      </Content>
      <Footer />
    </Page>
  )
}


/* ═══════════════════════════════════════════════
   SLIDE 11 — PROPERTY DETAILS
   ═══════════════════════════════════════════════ */

function SlidePropertyDetails() {
  return (
    <Page>
      <Header label="The Asset" />
      <Content>
        <H2 style={{ marginBottom: 2 }}>Property Details</H2>
        <p style={{ fontSize: '0.72rem', color: C.warmWhite40, marginBottom: 10 }}>
          With an expansion opening in mid-2025, the overall occupancy took a temporary dip, and lease-up has been excellent.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Left — stats */}
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>773 Units</div>
                <ul style={{ marginTop: 4, fontSize: '0.72rem', lineHeight: 1.85, color: C.warmWhite40, listStyle: 'none', padding: 0 }}>
                  <li><Dot />449 Drive-Up Spaces</li>
                  <li><Dot />315 Climate Spaces</li>
                  <li><Dot />9 Commercial Office Suites</li>
                </ul>
              </div>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>126K NRSF</div>
                <ul style={{ marginTop: 4, fontSize: '0.72rem', lineHeight: 1.85, color: C.warmWhite40, listStyle: 'none', padding: 0 }}>
                  <li><Dot />17 Bldgs</li>
                  <li><Dot />5.37 Acres</li>
                  <li><Dot />163 SF/Unit</li>
                </ul>
              </div>
            </div>
            <div style={{ border: `1px solid ${C.warmWhite06}`, borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, marginBottom: 4 }}>Great Basis</div>
              <ul style={{ fontSize: '0.72rem', lineHeight: 1.8, color: C.warmWhite50, listStyle: 'none', padding: 0 }}>
                <li><Dot />Inbound 5.95% Cap Rate</li>
                <li><Dot />Acquiring at $85/NRSF, <strong style={{ color: C.warmWhite70 }}>below replacement cost</strong></li>
              </ul>
            </div>
          </div>

          {/* Right — photos */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            <div style={{ gridColumn: '1 / -1', position: 'relative', height: 170, borderRadius: 10, overflow: 'hidden' }}>
              <Image src="/images/deals/granbury/granbury-1.jpg" alt="Granbury aerial view" fill style={{ objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.35), transparent)' }} />
            </div>
            <div style={{ position: 'relative', height: 120, borderRadius: 10, overflow: 'hidden' }}>
              <Image src="/images/deals/granbury/granbury-2.jpg" alt="Granbury buildings" fill style={{ objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.35), transparent)' }} />
            </div>
            <div style={{ position: 'relative', height: 120, borderRadius: 10, overflow: 'hidden' }}>
              <Image src="/images/deals/granbury/granbury-3.jpg" alt="Granbury expansion" fill style={{ objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.35), transparent)' }} />
              <div style={{ position: 'absolute', left: 6, top: 6, background: C.orange, borderRadius: 2, padding: '3px 8px', fontSize: '0.58rem', fontWeight: 700 }}>Expansion</div>
            </div>
          </div>
        </div>
      </Content>
      <Footer />
    </Page>
  )
}


/* ═══════════════════════════════════════════════
   SLIDE 12 — MARKET OVERVIEW
   ═══════════════════════════════════════════════ */

function SlideMarketOverview() {
  return (
    <Page>
      <Header label="Local Market" />
      <Content>
        <H2 style={{ marginBottom: 10 }}>Market Overview</H2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Left — data */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div>
              <h3 style={{ fontSize: '0.72rem', fontWeight: 700, marginBottom: 3 }}>Growing Population &amp; Income</h3>
              <ul style={{ fontSize: '0.72rem', lineHeight: 1.8, color: C.warmWhite50, listStyle: 'none', padding: 0 }}>
                <li>Median HHI of <strong style={{ color: C.warmWhite70 }}>$91k</strong> / Avg. HHI of <strong style={{ color: C.warmWhite70 }}>$112k</strong></li>
                <li>16k people in 10mins, w/ higher daytime population</li>
                <li><strong style={{ color: C.orange }}>3.1%</strong> population growth projected in 10 mins</li>
              </ul>
            </div>
            <div>
              <h3 style={{ fontSize: '0.72rem', fontWeight: 700, marginBottom: 3 }}>Consistent Demand Drivers</h3>
              <p style={{ fontSize: '0.72rem', lineHeight: 1.8, color: C.warmWhite50 }}>
                Besides one new multi-story climate controlled property (Store House Storage), <strong style={{ color: C.warmWhite70 }}>no new supply has entered the 5-mile radius since 2005</strong>.
              </p>
              <p style={{ fontSize: '0.7rem', lineHeight: 1.7, color: C.warmWhite40, marginTop: 3 }}>
                All other competitors are lower-quality, many lacking any security and offer no website/online rentals.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '0.72rem', fontWeight: 700, marginBottom: 3 }}>Nearby Retailers &amp; Growth</h3>
              <ul style={{ fontSize: '0.72rem', lineHeight: 1.8, color: C.warmWhite50, listStyle: 'none', padding: 0 }}>
                <li><Dot />Lakeview Landing: a 47-acre mixed-use development</li>
                <li><Dot />The Crossing: a 50-acre mixed-use development</li>
                <li><Dot />500+ units of housing in active development</li>
                <li><Dot />Academy Sports, Hobby Lobby, Homegoods, Ulta, etc.</li>
              </ul>
            </div>
            <div>
              <h3 style={{ fontSize: '0.72rem', fontWeight: 700, marginBottom: 3 }}>High Visibility &amp; Traffic Counts</h3>
              <p style={{ fontSize: '0.72rem', color: C.warmWhite50 }}><strong style={{ color: C.orange }}>22k cars per day</strong> on Hwy 377 through Granbury.</p>
            </div>
          </div>

          {/* Right — map placeholder */}
          <div style={{ background: C.charcoal, borderRadius: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: C.warmWhite10, marginBottom: 8 }}>MAP</div>
            <p style={{ fontSize: '0.72rem', color: C.warmWhite20, marginBottom: 10 }}>Granbury, TX — Satellite View</p>
            {[
              { n: '#1', addr: '212 Temple Hall Hwy' },
              { n: '#2', addr: '409 Western Hills Trl' },
              { n: '#3', addr: '3501 McCreary Rd' },
            ].map((p) => (
              <div key={p.n} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, fontSize: '0.7rem', color: C.warmWhite30 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: C.orange }} />
                <span>Granbury {p.n} — {p.addr}</span>
              </div>
            ))}
          </div>
        </div>
      </Content>
      <Footer />
    </Page>
  )
}


/* ═══════════════════════════════════════════════
   SLIDE 13 — COMPETITION
   ═══════════════════════════════════════════════ */

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
    if (g.startsWith('B')) return C.warmWhite60
    if (g === 'NO') return '#E84040'
    if (g.startsWith('C')) return C.stone
    return C.warmWhite20
  }

  return (
    <Page>
      <Header label="Competitive Landscape" />
      <Content>
        <H2 style={{ marginBottom: 10 }}>Competition Analysis</H2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
            {competitors.map((c, i) => (
              <div key={i} style={{ border: `1px solid ${C.warmWhite06}`, borderRadius: 6, padding: '5px 7px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 5 }}>
                  <span style={{ width: 16, height: 16, borderRadius: '50%', background: C.orange15, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.52rem', fontWeight: 700, color: C.orange, flexShrink: 0 }}>{i + 1}</span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '0.66rem', fontWeight: 700, lineHeight: 1.45, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.58rem', marginTop: 1 }}>
                      <span style={{ color: gc(c.grade) }}>{c.grade}</span>
                      <span style={{ color: C.warmWhite10 }}>|</span>
                      <span style={{ color: gc(c.web) }}>Web: {c.web}</span>
                    </div>
                    <div style={{ fontSize: '0.52rem', color: C.warmWhite20, marginTop: 1 }}>{c.note}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: C.charcoal, borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: C.warmWhite10, marginBottom: 6 }}>MAP</div>
            <p style={{ fontSize: '0.66rem', color: C.warmWhite20, textAlign: 'center', marginBottom: 4 }}>Satellite view with<br />numbered competitor pins</p>
            <p style={{ fontSize: '0.58rem', color: C.warmWhite10, fontStyle: 'italic' }}>Upload satellite image to replace</p>
          </div>
        </div>
      </Content>
      <Footer />
    </Page>
  )
}


/* ═══════════════════════════════════════════════
   SLIDE 14 — SOURCES & USES
   ═══════════════════════════════════════════════ */

function SlideSourcesUses() {
  const thStyle: React.CSSProperties = { background: C.orange, padding: '6px 10px', textAlign: 'left', fontSize: '0.66rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }
  const tdLabel: React.CSSProperties = { padding: '4px 8px 4px 0', fontSize: '0.72rem', color: C.warmWhite40 }
  const tdVal: React.CSSProperties = { padding: '4px 8px', textAlign: 'right', fontSize: '0.75rem', fontWeight: 700, fontFamily: 'monospace', fontVariantNumeric: 'tabular-nums' }
  const trBorder: React.CSSProperties = { borderBottom: `1px solid ${C.warmWhite04}` }

  return (
    <Page>
      <Header label="Financials" />
      <Content>
        <H2 style={{ marginBottom: 12 }}>Sources &amp; Uses</H2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
          {/* Return Metrics */}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr><th colSpan={2} style={{ ...thStyle, borderRadius: '8px 8px 0 0' }}>Project-Level Return Metrics</th></tr></thead>
            <tbody>
              {[
                ['Unlevered IRR', '14.20%'], ['Levered IRR', '24.98%'], ['Project-Level Equity Multiple', '2.51x'],
                ['Unlevered CoC For Hold Period', '6.50%'], ['Levered CoC For Hold Period', '11.02%'],
                ['Development Spread At Sale', '2.5%'], ['YOC At Sale', '8.8%'],
              ].map(([l, v], i) => (
                <tr key={i} style={trBorder}><td style={tdLabel}>{l}</td><td style={tdVal}>{v}</td></tr>
              ))}
            </tbody>
          </table>

          {/* Sources */}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr><th colSpan={2} style={{ ...thStyle, borderRadius: '8px 8px 0 0' }}>Sources (at Close)</th></tr></thead>
            <tbody>
              {[
                ['Acquisition Loan Proceeds', '$7,560,000'], ['LP Equity', '$4,420,484'], ['GP Equity', '$136,716'],
              ].map(([l, v], i) => (
                <tr key={i} style={trBorder}><td style={tdLabel}>{l}</td><td style={tdVal}>{v}</td></tr>
              ))}
              <tr style={{ borderTop: `1px solid ${C.warmWhite10}` }}><td style={{ ...tdLabel, fontWeight: 700, color: C.warmWhite }}>Total</td><td style={tdVal}>$12,117,200</td></tr>
            </tbody>
          </table>

          {/* Uses */}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr><th colSpan={2} style={{ ...thStyle, borderRadius: '8px 8px 0 0' }}>Uses (at Close)</th></tr></thead>
            <tbody>
              {[
                ['Purchase Price', '$10,800,000'], ['Acquisition Fee', '$324,000'], ['Closing Costs', '$162,000'],
                ['Capex Budget & Int. Reserves', '$680,000'], ['Acquisition Loan Fees', '$151,200'],
              ].map(([l, v], i) => (
                <tr key={i} style={trBorder}><td style={tdLabel}>{l}</td><td style={tdVal}>{v}</td></tr>
              ))}
              <tr style={{ borderTop: `1px solid ${C.warmWhite10}` }}><td style={{ ...tdLabel, fontWeight: 700, color: C.warmWhite }}>Total</td><td style={tdVal}>$12,117,200</td></tr>
            </tbody>
          </table>
        </div>
      </Content>
      <Footer />
    </Page>
  )
}


/* ═══════════════════════════════════════════════
   SLIDE 15 — PROJECTIONS
   ═══════════════════════════════════════════════ */

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
        <H2 style={{ fontSize: '2.2rem', marginBottom: 10 }}>Annualized Projections</H2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontVariantNumeric: 'tabular-nums', fontSize: '0.72rem' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.warmWhite06}` }}>
              <th style={{ background: C.orange, padding: '5px 8px', textAlign: 'left', fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', borderRadius: '6px 0 0 0' }}>P&amp;L by Year</th>
              {years.map((y, i) => (
                <th key={i} style={{ background: C.orange, padding: '5px 8px', textAlign: 'right', fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', ...(i === 4 ? { borderRadius: '0 6px 0 0' } : {}) }}>
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
                <tr key={i} style={{ borderBottom: `1px solid ${r.highlight ? C.warmWhite10 : C.warmWhite04}` }}>
                  <td style={{ padding: '3px 8px', fontFamily: 'inherit', ...(r.indent ? { paddingLeft: 20, color: C.warmWhite30 } : {}), ...(r.bold ? { fontWeight: 700, color: C.warmWhite } : {}), ...(r.metric ? { fontWeight: 700, color: C.orange } : {}) }}>{r.label}</td>
                  {r.values.map((v, j) => (
                    <td key={j} style={{ padding: '3px 8px', textAlign: 'right', ...(r.bold ? { fontWeight: 700, color: C.warmWhite } : { color: C.warmWhite40 }), ...(r.metric ? { fontWeight: 700, color: C.orange } : {}), ...(r.highlight ? { color: C.warmWhite } : {}) }}>{v}</td>
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


/* ═══════════════════════════════════════════════
   SLIDE 16 — RETURNS
   ═══════════════════════════════════════════════ */

function SlideReturns() {
  const scenarios = [
    { name: 'Upside Case', border: 'rgba(122,175,110,0.2)', bg: 'rgba(122,175,110,0.03)', labelBg: '#7AAF6E', returns: ['$21,246', '$72,603', '$850,537', '$66,114', '$1,448,089'], coc: ['2.12%', '9.38%', '94.44%', '101.05%', '245.86%'] },
    { name: 'Expected Case', border: 'rgba(232,98,42,0.25)', bg: 'rgba(232,98,42,0.04)', labelBg: C.orange, returns: ['$20,494', '$69,422', '$749,819', '$80,085', '$1,106,370'], coc: ['2.05%', '8.99%', '83.97%', '91.98%', '202.62%'] },
    { name: 'Downside Case', border: C.warmWhite06, bg: 'rgba(245,240,232,0.02)', labelBg: C.stone, returns: ['$19,739', '$66,256', '$651,442', '$76,779', '$848,873'], coc: ['1.97%', '8.60%', '73.74%', '81.42%', '166.31%'] },
  ]

  const thS: React.CSSProperties = { padding: '3px 8px', textAlign: 'right', fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: C.warmWhite35 }

  return (
    <Page>
      <Header label="Projected Returns" />
      <Content>
        <H2 style={{ fontSize: '2.2rem', marginBottom: 2 }}>Investor Return Projections</H2>
        <p style={{ fontSize: '0.7rem', color: C.warmWhite30, marginBottom: 10 }}>
          All scenarios assume a refinance at end of Year 3 and Sale at end of Year 5.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {scenarios.map((s) => (
            <div key={s.name} style={{ border: `1px solid ${s.border}`, background: s.bg, borderRadius: 10, padding: '8px 12px' }}>
              <div style={{ marginBottom: 5 }}>
                <span style={{ background: s.labelBg, borderRadius: 4, padding: '3px 10px', fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.name}</span>
              </div>
              <table style={{ width: '100%', fontSize: '0.72rem', fontFamily: 'monospace', fontVariantNumeric: 'tabular-nums', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ ...thS, textAlign: 'left' }} />
                    {[1, 2, 3, 4, 5].map(y => <th key={y} style={thS}>Year {y}</th>)}
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: `1px solid ${C.warmWhite04}` }}>
                    <td style={{ padding: '3px 8px 3px 0', fontFamily: 'inherit', fontSize: '0.7rem', color: C.warmWhite50 }}>Annual Return</td>
                    {s.returns.map((v, i) => <td key={i} style={{ padding: '3px 8px', textAlign: 'right', fontWeight: 700 }}>{v}</td>)}
                  </tr>
                  <tr>
                    <td style={{ padding: '3px 8px 3px 0', fontFamily: 'inherit', fontSize: '0.7rem', color: C.warmWhite50 }}>Cumulative CoC</td>
                    {s.coc.map((v, i) => <td key={i} style={{ padding: '3px 8px', textAlign: 'right', fontWeight: 700 }}>{v}</td>)}
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
        </div>

        <p style={{ marginTop: 6, fontSize: '0.62rem', color: C.warmWhite20, fontStyle: 'italic' }}>
          *Based on a $1,000,000 investment. Does not include additional tax benefit value from Year 1 bonus depreciation.
        </p>
      </Content>
      <Footer />
    </Page>
  )
}


/* ═══════════════════════════════════════════════
   SLIDE 17 — CONTACT
   ═══════════════════════════════════════════════ */

function SlideContact() {
  return (
    <Page last>
      <div style={{ position: 'absolute', inset: 0 }}>
        <Image src="/images/hero/direct-hero-bg.webp" alt="" fill sizes="297mm" style={{ objectFit: 'cover', objectPosition: '50% 62%', filter: 'grayscale(30%) contrast(1.1) brightness(0.4) sepia(0.1)' }} />
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.4), rgba(0,0,0,0.8))' }} />

      <div style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}><Logo /></div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <h1 style={{ fontSize: '4.2rem', fontWeight: 900, textTransform: 'uppercase', lineHeight: 0.92, letterSpacing: '-0.03em' }}>
            The Journey.<span style={{ fontWeight: 300 }}>Direct</span> Platform
          </h1>

          <div style={{ marginTop: 24, textAlign: 'left' }}>
            <h3 style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: C.warmWhite50, marginBottom: 8 }}>Further Information</h3>
            {[
              { icon: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z', text: '(417) 848-2425' },
              { icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z', text: 'direct.journey.storage' },
              { icon: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6', text: 'jonah@journey.storage' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: C.orange15, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.orange} strokeWidth="2"><path d={item.icon} /></svg>
                </div>
                <span style={{ fontSize: '0.88rem', color: C.warmWhite70 }}>{item.text}</span>
              </div>
            ))}

            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 52, height: 52, borderRadius: 8, border: `2px dashed ${C.orange40}`, background: 'rgba(58,56,53,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '0.55rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: C.warmWhite30 }}>QR</span>
              </div>
              <span style={{ fontSize: '0.72rem', color: C.warmWhite30 }}>Or scan here</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </Page>
  )
}


/* ═══════════════════════════════════════════════
   MAIN — Assembles all slides
   ═══════════════════════════════════════════════ */

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
