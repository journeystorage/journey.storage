#!/usr/bin/env python3
"""Build the Direct Equity Source edition of the Malakoff offering deck.

Source: apps/investors/public/deck/malakoff/index.html (the live Journey deck).
Output: apps/investors/public/deck/malakoff-des/index.html

Same slides and figures, presented as a DES offering: investors commit through a
DES SPV that holds a single LP position, Journey is credited only as the operating
partner, "The operator" slide becomes "How your investment is structured", and all
contact routes to Direct Equity Source. Re-run after any edit to the Journey deck.
Every replacement asserts it matched, so a changed source fails loudly.
"""
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'apps/investors/public/deck/malakoff/index.html'
OUT_DIR = ROOT / 'apps/investors/public/deck/malakoff-des'
OUT = OUT_DIR / 'index.html'
LOGO = '/deck/malakoff-des/assets/des-logo.png'
DES_URL = 'https://directequitysource.com'

t = SRC.read_text(encoding='utf-8')


def sub(old, new, count=1):
    """Literal replace; the source must contain `old` exactly `count` times."""
    global t
    n = t.count(old)
    assert n == count, f'expected {count}x, found {n}x: {old[:80]!r}'
    t = t.replace(old, new)


def resub(pattern, new, count=1):
    global t
    t, n = re.subn(pattern, new, t, flags=re.S)
    assert n == count, f'expected {count}x, found {n}x: {pattern[:80]!r}'


# ---- head ----
sub('<title>JOURNEY.DIRECT™ — Malakoff Offering</title>',
    '<title>Direct Equity Source — Malakoff Offering</title>')
# no Journey favicon; an empty icon also stops the browser falling back to the site's
resub(r'<link rel="icon" href="data:image/svg\+xml;base64,[^"]+" type="image/svg\+xml">', '<link rel="icon" href="data:,">')

# DES logo: its grey "DIRECT" needs a light chip to read on the dark slides
sub('</style>', """/* ---- Direct Equity Source edition ---- */
.des-logo{display:block;height:46px;width:auto}
/* eyebrow tick: plain orange square instead of the Journey J mark */
.eyebrow::before,.slide--cream .eyebrow::before{width:11px;height:11px;margin-top:0;border-radius:2px;background:var(--orange)}
.top__home .des-logo,.intro__word .des-logo,.rbar .des-logo{box-sizing:content-box;padding:9px 16px;border-radius:12px;background:#F5F0E8}
.slide--cream .top__home .des-logo{padding-left:0;background:none}
.intro__word{width:auto}
.intro__word img.des-logo{width:auto}
.rbar img.des-logo{width:auto;height:24px;padding:4px 8px;border-radius:6px}
.sign .des-logo{height:40px;padding:7px 12px;border-radius:10px;background:#F5F0E8}
.flow{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin-top:20px;position:relative}
.flow .card{position:relative}
.flow .card+.card::before{content:"";position:absolute;left:-16px;top:50%;width:16px;height:2px;background:var(--orange)}
.flow__k{display:block;font-size:14px;letter-spacing:.16em;text-transform:uppercase;font-weight:800;color:var(--orange);margin-bottom:10px}
.flow .card .p{font-size:18px}
.is-read .flow{grid-template-columns:1fr}
.is-read .flow .card+.card::before{display:none}
</style>""", count=1)

# ---- chrome: logo, confidentiality line, intro ----
resub(r'<img class="top__logo" src="\'\+\(s\.classList\.contains\(\'slide--cream\'\)\?\'[^\']+\':\'[^\']+\'\)\+\'" alt="">',
      f'<img class="top__logo des-logo" src="{LOGO}" alt="Direct Equity Source">')
sub('aria-label="Journey.Storage, back to the first slide"',
    'aria-label="Direct Equity Source, back to the first slide"', count=2)
sub('<span class="top__conf">Journey.Direct · Privileged &amp; confidential</span>',
    '<span class="top__conf">Direct Equity Source · Privileged &amp; confidential</span>')
resub(r'<img class="intro__j" src="data:image/svg\+xml;base64,[^"]+" alt="">', '')
sub('<span class="intro__word"><img src="/deck/malakoff/assets/brand/logo-white-TM.svg" alt=""></span>',
    f'<span class="intro__word"><img class="des-logo" src="{LOGO}" alt=""></span>')
sub('<header class="rbar"><a href="#1" data-go="1" aria-label="Direct Equity Source, back to the first slide"><img src="/deck/malakoff/assets/brand/logo-white-TM.svg" alt=""></a>',
    f'<header class="rbar"><a href="#1" data-go="1" aria-label="Direct Equity Source, back to the first slide"><img class="des-logo" src="{LOGO}" alt="Direct Equity Source"></a>')

# ---- 01 cover ----
sub('<p class="tag up"><span>Journey.Direct</span>Malakoff, Texas · Closing mid-November</p>',
    '<p class="tag up"><span>Direct Equity Source</span>Malakoff, Texas · Closing mid-November</p>')
sub('<span class="ln"><span>Invest alongside</span></span> <span class="ln"><span><b>the operator.</b></span></span>',
    '<span class="ln"><span>Own essential</span></span> <span class="ln"><span><b>real assets.</b></span></span>')
sub('Not through a fund. Not through a REIT. <b>Directly</b>, in a',
    'Not through a fund. Not through a REIT. <b>Through Direct Equity Source</b>, in a')

# ---- 02 disclosures: name DES alongside JD and JS ----
sub('no representation by Journey.Direct (JD) or Journey.Storage (JS)',
    'no representation by Direct Equity Source (DES), Journey.Direct (JD) or Journey.Storage (JS)')
sub('Neither JD nor JS, nor their', 'None of DES, JD or JS, nor their')
sub('JD and JS explicitly make no', 'DES, JD and JS explicitly make no')
sub('JD and JS make no representations', 'DES, JD and JS make no representations')
resub(r'<img class="sign__j" src="data:image/svg\+xml;base64,[^"]+" alt="">',
      f'<img class="des-logo" src="{LOGO}" alt="Direct Equity Source">')
sub('<p>Journey.Direct · Dallas, TX<br>Privileged &amp; Confidential · Q3 2026</p>',
    '<p>Malakoff, Texas<br>Privileged &amp; Confidential · Q3 2026</p>')

# ---- 10 alignment: speak about the sponsor, not "our" money ----
sub('<span class="ln"><span>Where</span></span> <span class="ln"><span><b>our money sits.</b></span></span>',
    '<span class="ln"><span>Where the</span></span> <span class="ln"><span><b>sponsor’s money sits.</b></span></span>')
sub('If the plan misses, we miss with you.', 'If the plan misses, the sponsor misses with you.')

# ---- 11 the operator -> how your investment is structured ----
arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">'
structure = f'''<section class="slide slide--cream slide--op" data-title="How it's structured">
  <div class="stage"><div class="fit">
    <div class="head">
      <div><span class="eyebrow up">Investment structure</span><h2 class="display h2" data-rv><span class="ln"><span>How your investment</span></span> <span class="ln"><span><b>is structured.</b></span></span></h2></div>
      <p class="lede" data-bw>Your capital goes in through <b>Direct Equity Source</b> and DES pools commitments into a single SPV that holds <b>one LP position</b> in the Malakoff property, so you keep <b>one relationship</b> from first call to final distribution.</p>
    </div>
    <div class="stats num">
      <div class="stat up"><div class="stat__v stat__v--o" data-count>$2.70M</div><div class="stat__k">LP equity</div><div class="stat__d">Raised through the SPV</div></div>
      <div class="stat up"><div class="stat__v stat__v--o" data-count>1</div><div class="stat__k">LP position</div><div class="stat__d">Held by the DES SPV</div></div>
      <div class="stat up"><div class="stat__v stat__v--o" data-count>8.0%</div><div class="stat__k">Preferred return</div><div class="stat__d">Paid before any promote</div></div>
      <div class="stat up"><div class="stat__v stat__v--o" data-count>$50k</div><div class="stat__k">Minimum</div><div class="stat__d">Accredited investors only</div></div>
    </div>
    <div class="flow">
      <div class="card up"><span class="ico" aria-hidden="true">{arrow}<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg></span><span class="flow__k">01 · You</span><h3 class="h3">Accredited investor</h3><p class="p">You commit capital to Direct Equity Source and deal with DES directly, from subscription to every distribution and report.</p></div>
      <div class="card up"><span class="ico" aria-hidden="true">{arrow}<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 13h18"/></svg></span><span class="flow__k">02 · The SPV</span><h3 class="h3">Direct Equity Source Malakoff SPV</h3><p class="p">Pools investor commitments and holds a <b>single LP position</b> in the property entity. Passes distributions, K-1s and reporting through to you.</p></div>
      <div class="card up"><span class="ico" aria-hidden="true">{arrow}<path d="M3 21V9l9-6 9 6v12"/><path d="M8 21v-7h8v7"/></svg></span><span class="flow__k">03 · The property</span><h3 class="h3">Malakoff, Texas</h3><p class="p">433 spaces on 5.37 acres. Operated by <b>JOURNEY.STORAGE™</b>, the vetted operating partner: lease-up, revenue management, technology and day-to-day asset management.</p></div>
    </div>
    <p class="small foot up">Structure shown for illustration. The SPV’s operating agreement and subscription documents govern; entity names are subject to final documents.</p>
  </div></div>
</section>'''
resub(r'<!-- 11 THE OPERATOR -->\n<section class="slide slide--cream slide--op" data-title="The operator">.*?</section>',
      '<!-- 11 HOW IT\'S STRUCTURED -->\n' + structure)

# ---- 12 terms + close ----
sub('<div class="term up"><dt>Sponsor</dt><dd>JOURNEY.DIRECT™</dd></div>',
    '<div class="term up"><dt>Invest through</dt><dd>Direct Equity Source · single LP position via SPV</dd></div>')
sub('<div class="term up"><dt>Management</dt><dd>JOURNEY.MANAGED™, under the JOURNEY.STORAGE™ brand</dd></div>',
    '<div class="term up"><dt>Operating partner</dt><dd>JOURNEY.MANAGED™, under the JOURNEY.STORAGE™ brand</dd></div>')
resub(r'<span class="close__j"><img src="data:image/svg\+xml;base64,[^"]+" alt=""></span>', '')
sub('Documents on request; commitments taken in order received.',
    'Documents on request through Direct Equity Source; commitments taken in order received.')
sub('<a class="btn btn--primary" href="mailto:jonah@journey.storage?subject=Malakoff%20offering"><span>Request the documents</span>',
    f'<a class="btn btn--primary" href="{DES_URL}" target="_blank" rel="noopener"><span>Contact Direct Equity Source</span>')
sub('<span>Journey.Direct&trade; &middot; Malakoff, Texas</span>',
    '<span>Direct Equity Source &middot; Malakoff, Texas</span>')

# nothing may still route investors to Journey
for leak in ('jonah@', 'mailto:', 'Journey.Direct ·', 'Jonah', 'Lyvia', 'logo-white-TM', 'logo-dark-TM'):
    assert leak not in t, f'leftover {leak!r}'

OUT_DIR.joinpath('assets').mkdir(parents=True, exist_ok=True)
shutil.copy(ROOT / 'public/images/brand/des-logo.png', OUT_DIR / 'assets/des-logo.png')
OUT.write_text(t, encoding='utf-8')
print(f'wrote {OUT.relative_to(ROOT)} ({OUT.stat().st_size // 1024} KB)')
