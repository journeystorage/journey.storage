# Changelog — Journey.Storage

Log interno de alterações de design, arquitetura e funcionalidades.

---

## 2026-04-07

### Lead capture pipeline — n8n + Google Sheets (todos os 3 sites)
- **Arquitetura** unificada: 1 webhook único (`https://webhook.vayloh.top/webhook/journey-lead`) recebe leads de 7 origens distintas via campo `form_source`:
  - `website-waitlist`, `website-location`, `website-newsletter` (main)
  - `consulting-scout`, `consulting-pursuit`, `consulting-booking` (advisory)
  - `investors-booking` (direct)
- **n8n workflow simplificado** ([docs/n8n-sheets-lead-capture.json](docs/n8n-sheets-lead-capture.json)) — 3 nodes apenas: `Webhook → Append row in sheet → Response`. Toda lógica de derivação (`source_label`, `site`, `tier_interest`, `redirect_url`, `first_name`/`last_name`) acontece dentro do próprio node Sheets via dicionários inline (`({...})[$json.body.form_source]`). Substitui versão anterior com 9 nodes (Switch + 6 Sets) que estava perdendo dados por inconsistência de namespace.
- **Google Sheets** como destino único — coluna por coluna mapeada do payload. Permite filtrar leads por origem direto na planilha. GHL fica pra fase posterior.
- **GTM** — `apps/consulting/src/app/layout.tsx`: container atualizado de `GTM-NL5KP8QJ` para `GTM-54GBZ4GW`.
- **Modal de captura no consulting** ([apps/consulting/src/components/ui/LeadCaptureModal.tsx](apps/consulting/src/components/ui/LeadCaptureModal.tsx)) — react-hook-form + zod, mesmo design do modal de Location do main site (warm-white card, accent orange, asymmetric border-radius). Disparado por todos os CTAs do Pricing (Scout/Pursuit/Command) e do FinalCTA. Captura nome/email/phone/company antes de redirecionar pro Stripe ou Google Calendar.
- **API route `/api/waitlist`** ([src/app/api/waitlist/route.ts](src/app/api/waitlist/route.ts)) — agora faz proxy server-side do payload pro webhook do n8n (env `LEAD_WEBHOOK_URL`), evitando CORS no main site. Mantida pra uso futuro (validação, rate limit, banco).
- **Formulários do main site** ([Waitlist.tsx](src/components/sections/Waitlist.tsx), [LocationsMap.tsx](src/components/sections/LocationsMap.tsx), [Footer.tsx](src/components/layout/Footer.tsx)) — todos enviam `form_source` correto pro `/api/waitlist`. Newsletter do footer agora dispara HTTP (antes era só `console.log`).
- **CORS no n8n**: `allowedOrigins` do node Webhook lista os 3 sites em produção + os 3 localhosts pra dev.
- **Env vars**: `LEAD_WEBHOOK_URL` (server-side, main) e `NEXT_PUBLIC_LEAD_WEBHOOK_URL` (browser, consulting/investors) consolidadas no [.env.local](.env.local) da raiz.
- **Fix script `dev:investors`**: `next dev --port 3002 -c apps/investors` (flag `-c` inválida) → `next dev apps/investors --port 3002 --webpack`. Servidor não subia.

### Investors (Journey.Direct™) — Hero polish (iteração 6 — bg, agrupamento timer, full-bleed)
- **BG image enquadramento**: `object-position: 50% 62%` + `contrast 1.05` — alinha o ponto de fuga do corredor com o centro horizontal da página, elimina céu escuro no topo que parecia "borda preta".
- **Hero altura**: volta para `min-h-screen` (corrige fundo preto visível abaixo do hero em mobile/tablet causado pelo `min-h-[88vh]` anterior). Paddings reduzidos (`pt-[100px]/pb-[72px]`, lg `110/80`) para manter compacidade.
- **Labels do timer agrupadas com os números**: removida separação subline-no-meio. Labels agora vivem em grid 4-col idêntica, **diretamente** abaixo dos números (`mt-1`), dentro do mesmo wrapper relativo. Associação visual clara.
- **Wrapper do timer único**: `relative flex flex-col max-w-[1120px] mx-auto` envolve números + labels; headline absolute restrita à altura da banda dos números (não mais `inset-0`).
- **Cada cell do grid agora é `flex items-center justify-center`** (em vez de `text-center` direto no span) — força centralização geométrica robusta independente de letter-spacing.
- **Headline sem ponto final** (`Built by operators`) — remove peso visual à direita.
- **Gaps maiores** (`gap-10/14/20/28/32`) — números respiram, marcadores `dd hh mm ss` não parecem "apertados".
- **`html { background-color: black }`** em [globals.css](apps/investors/src/styles/globals.css) — garante consistência. Removido `scrollbar-gutter: stable both-edges` que reservava ~30px de gutter laterais (visíveis como "bordas pretas" no desktop, fazendo o BG não tocar as bordas).

### Investors (Journey.Direct™) — Hero polish (iteração 5 — proporções e alinhamento)
- **Altura do hero reduzida**: `min-h-screen` → `min-h-[88vh]`, padding `pt-[120px]/pb-[100px]` → `pt-[110px]/pb-[96px]` (lg `120/104`). Remove ar excessivo.
- **Centralização do timer**: wrapper dos números e das labels agora compartilha `mx-auto max-w-[1100px]` (antes herdavam o `max-w-[1400px]` do container externo). Headline absolute, números e labels alinham no mesmo eixo central.
- **Gaps da grid do timer reduzidos** (`gap-8/12/16/24/32` → `gap-6/10/14/20/24`) — números mais coesos como bloco.
- **Labels do timer maiores e mais próximas dos números**: `clamp(0.7rem,1.1vw,1rem)` → `clamp(0.8rem,1.4vw,1.15rem)`, opacidade `0.30` → `0.35`. Gap subline→labels reduzido (`mt-10` subline + `mt-8` labels → `mt-6` + `mt-4`).
- **CTA**: `transition-all` → `transition-colors` (regra do CLAUDE.md), `mt-12` → `mt-10`.

### Investors (Journey.Direct™) — Hero refinement (iteração 4 — nova ordem vertical + segunda fonte)
- **Nova ordem vertical do foreground** (top → bottom):
  1. Eyebrow pill (`JOURNEY.DIRECT™ · Investment Platform`)
  2. Stay tuned + Launching · April 13, 2026
  3. **Timer numbers + Headline** (mesma linha horizontal — números absolute centered atrás, headline anchor no centro do flex)
  4. Subline (`A direct investment platform for self-storage is on the way.`)
  5. Labels row (DAYS / HOURS / MINUTES / SECONDS — grid 4-col, alinha visualmente com as colunas dos números acima)
  6. CTA outline (`Book a call →`) + accredited disclaimer
- **Decoupling labels ↔ números**: labels saíram do bloco do timer (eram empilhados na mesma coluna `flex-col items-center`) e foram pra própria row no foreground stack, abaixo da subline. Mantém o alinhamento por coluna via `grid grid-cols-4` com mesmo `gap` responsivo.
- **Tipografia do timer**: Lato Black → **IBM Plex Mono 700** (`var(--font-mono)`). Adicionado `IBM_Plex_Mono` via `next/font/google` em [layout.tsx](apps/investors/src/app/layout.tsx) (weights 300/500/700). Razão: Lato Black no número competia com Lato Black na headline — Plex Mono 700 traz vibe ticker/financial-data, contraste tipográfico claro sem brigar. Labels também usam Plex Mono pra manter a unidade visual do timer.
- **Padding** das duas stacks: `pt-[88px] pb-12 gap-7` (top) e `pt-12 pb-[88px] gap-7` (bottom) — flex-1 simétrico mantém o headline no centro vertical real do section.

### Investors (Journey.Direct™) — Hero refinement (iteração 3 — simplificada)
- **Timer estrutura simplificada**: voltei pro pattern original da referência — números + labels empilhados na mesma coluna `flex-col items-center`, single absolute layer centralizada, sem translateY hacks ou layers separadas. Cada coluna do grid contém o número (clamp 4.5/18vw/18rem) e a label diretamente abaixo (clamp 0.75/1.6vw/1.5rem) com gap responsivo (mt-3/4/6).
- **Foreground stack** mantido com `flex-1 above + headline anchor + flex-1 below` — headline fica no centro vertical real do section, alinhado com o eixo central do timer.
- **Padding subline/CTA**: `pt-9 gap-9` no below-stack (36px breathable) com `gap-4` interno do CTA cluster.
- **Launch date** atualizado: `April 27, 2026` → `April 13, 2026` em [constants.ts](apps/investors/src/lib/constants.ts) (`LAUNCH_DATE_ISO = '2026-04-13T05:00:00.000Z'` — 00:00 America/Chicago) e no display da launching strip.

### Investors (Journey.Direct™) — Refinamento do hero (iteração 2)
- **Headline single-line**: `Built by / operators.` (2 linhas) → `Built by operators.` (1 linha) com `whitespace-nowrap` + `clamp(2.1rem, 8.4vw, 8.4rem)` — fica entre top/bottom dos números do timer (igual à referência)
- **Container do hero**: `max-w-820px` → `max-w-1100px` pra acomodar o headline single-line
- **Labels do timer maiores**: `clamp(0.55rem, 1.1vw, 1rem)` → `clamp(0.85rem, 2vw, 1.875rem)` (DAYS / HOURS / MINUTES / SECONDS agora bem legíveis)
- **Numbers e labels separados em layers independentes** — antes colidiam com o subline + launching strip no mobile/tablet:
  - Números: layer absolute centralizado (atrás do headline)
  - Labels: layer absolute na bottom da section (`bottom-16 lg:bottom-20`), alinhados em grid de 4 colunas com os números
- **Background image substituído**: `consulting-meeting.webp` (placeholder) → `direct-hero-bg.png` (fornecido pelo usuário, 6.5MB) convertido pra WebP via sharp (`quality: 90, effort: 6`) → `577KB` (2816×1364). Mesma treatment grayscale + dark overlays
- **Footer copyright** completo: `© Journey.Storage™ 2026` → `© 2026 Journey.Storage™. All rights reserved. Privileged & confidential.` — caption normal weight (não uppercase) pra contraste com a tag `Direct · 001` à direita

### Investors (Journey.Direct™) — Coming soon page (primeira versão)
- Substituído o placeholder mínimo (`Journey.Direct™ / Coming soon.`) por uma página completa com identidade da marca
- **Layout** inspirado em referência fornecida: B&W background + countdown timer GIANTE como watermark + headline central
- **Navbar:** logo + dropdown Ecosystem (Storage / Advisory / Direct — com Direct marcado como `Here`) + CTA `Book a call`
- **Hero** (`ComingSoonHero.tsx`):
  - Eyebrow pill `JOURNEY.DIRECT™ · Investment Platform` (espelhando o pattern do hero do Advisory)
  - Strip `— Stay tuned —`
  - Headline gigante `Built by operators.` (Lato Black, clamp `3rem → 8.5rem`)
  - Subline italic `A direct investment platform for self-storage is on the way.`
  - Strip `Launching · April 27, 2026 · 00:00 CT`
  - CTA outline `Book a call →` (abre `LeadCaptureModal`)
  - Footer marks `© Journey.Storage™ 2026` / `Direct · 001`
- **Countdown timer** ao vivo (atualiza a cada 1s) — target `2026-04-27T00:00 America/Chicago` (`LAUNCH_DATE_ISO` em `constants.ts`)
- **Background:** `consulting-meeting.webp` copiada como `investors-hero-bg.webp`, tratada com `grayscale(100%) contrast(0.95) brightness(0.32)` + 4 layers de overlay (gradient, vignette, orange wash, grain)
- **LeadCaptureModal** simplificado (vanilla React, sem framer-motion / react-hook-form / zod) — captura nome/email/phone/company antes de redirecionar pro Google Calendar
- **Setup do app:** `globals.css` agora completo com tokens da marca + grain; `layout.tsx` com Lato (300/400/700/900 normal+italic) e metadata SEO; `lib/constants.ts` com `CALENDAR_URL`, `LAUNCH_DATE_ISO`, `ecosystemDropdownLinks`
- Assets copiados pra `apps/investors/public/images/{brand,hero}/`
- **Ainda pendente:** swap da hero image se quisermos algo mais investidor-themed; configurar `NEXT_PUBLIC_LEAD_WEBHOOK_URL` no env; eventualmente migrar pra standalone build (próximo deploy)

---

## 2026-04-05

### Main site — Hero background atualizado (v2-box)
- Imagem substituída: `home-hero-bg-v2.webp` → `home-hero-bg-v2-box.webp`
- Nova imagem com caixas branded Journey.Storage visíveis na composição
- Convertida de JPG para WebP (near-lossless, 1920x1072, ~1.3MB)
- Posicionamento preservado em todos os viewports — mesmas classes CSS

### Consulting — Pricing CTAs com Stripe checkout
- Scout e Pursuit agora apontam para links de pagamento Stripe
- Scout: `buy.stripe.com/...0sU00` | Pursuit: `buy.stripe.com/...0sU02`
- Command mantém link do Google Calendar (Schedule a call)
- Refatorado: cada tier agora tem campo `href` próprio em vez de `CALENDAR_URL` fixo

---

## 2026-04-04

### Consulting — Copy das headlines condensada (padrão 2 linhas)
- Todas as section headlines agora seguem o padrão: 1 linha bold + 1 linha thin
- Problem: "Most investors enter self-storage with capital and conviction. / What they don't have is the expertise." → "Capital isn't enough. / Expertise is."
- Solution: "The output of an entire self storage team, / without building any of it." → "A full team's output, / without building one."
- Pricing label: "Choose your level" → "Pricing" (eliminada redundância com headline)
- Pricing headline mantida: "Choose your level / of access."

### Consulting — Tipografia das headlines alinhada com main site
- Todas as h2 de seção: `text-3xl md:text-4xl lg:text-5xl` → `text-4xl md:text-5xl lg:text-6xl`
- Seções afetadas: Problem, Solution, Pricing, FAQ
- Agora idêntico ao main site (`text-4xl/5xl/6xl font-black leading-[0.95]`)

### Main site — Hero background atualizado
- Imagem substituída: `home-hero-bg.webp` → `home-hero-bg-v2.webp`
- Nova imagem convertida de JPG para WebP (qualidade máxima, ~1.3MB)
- Posicionamento mantido: rosto da mulher acima do headline em todos os viewports (desktop, tablet, mobile)
- Nenhum ajuste de CSS necessário — `object-[center_15%]` + `scale-125` funciona com a nova imagem

### Consulting — Rebrand Journey.Consulting → Journey.Advisory
- Todas as referências renomeadas site-wide (componentes, metadata, footer)
- Tag do hero redesenhada: "JOURNEY.ADVISORY™" com tipografia similar ao logo + "Consulting & Operations" como subline
- Metadata atualizada: título, descrição, OpenGraph

### Consulting — Hero atualizado
- Headline com quebras de linha explícitas (4 linhas)
- Subline: "advisory" → "expertise", espaços faltando corrigidos
- CTA: "Schedule a call with Jonah" → "Get Started"
- Link secundário aponta para pricing ao invés de how-it-works
- Font size mobile reduzido: `2.75rem` → `2.35rem` para line breaks corretos

### Consulting — Problem section redesenhada
- Stats: "27 facilities" → "30", "8+ Yrs" → "18+ Years"
- Heading: "underwriting" → "expertise"
- Bottom padding reduzido para transição mais limpa com seção seguinte
- IaaS callout destacado com borda laranja à esquerda
- "You have / You lack" movido para o corpo do texto, abaixo do pitch IaaS
- Imagem da porta: aspect ratio square no desktop, 4:5 no mobile
- Grid rebalanceado: colunas iguais (50/50), items-center, gap maior
- Removida divider line entre blocos de problema e solução
- Removida dark tension band (evita overload visual dark-light-dark-dark)
- Cards de tensão redesenhados como scroll cards horizontais (`snap-x`) no mobile, grid 2-col no desktop
- Cards com labels simétricos: "WITHOUT US ($200K+)" / "THE ALTERNATIVE"
- UX mobile: gradient fade à direita + dot indicators sinalizando scroll
- Scroll padding corrigido para borda do card não ser cortada

### Consulting — Solution copy refinada
- Tab 2 (Flexible): adicionada outcome phrase "so your advisory cost always matches your activity, never your headcount"
- Tab 3 (No lock-in): reescrita para "You stay because the work is worth it, not because a contract says so"
- Em dashes removidos de todos os tab bodies (substituídos por vírgula)

### Consulting — Solution section redesenhada
- Label: "A different model" → "Here's what replacing guesswork looks like"
- Heading simplificado: "The output of an entire self storage team, without building any of it."
- Subline mobile reduzida: `text-h1` → `text-h2` para peso visual adequado
- Labels de serviço (Acquisitions, Transactions, etc.) como tags inline com separadores `/`
- Parágrafos redundantes removidos — conteúdo absorvido pelos cards
- Tabs Chrome-style: aba ativa maior (44px) com rounded 12px, inativas recuadas (38px/8px)
- Cada tab expande painel com hook + body text + ghost number + cor distinta (orange, terracotta, sand)
- Painel com altura fixa (180/200/210px) para evitar layout shift entre tabs
- Container floating removido — seção agora é `bg-black` direto com grain, sem margens/rounded
- Removidas referências a Jonah — foco na equipe Journey.Storage
- Watermark "DIFFERENT" removido

### Consulting — HowItWorks removido / integrado ao Pricing
- Seção "Three Steps" / "Two Steps" removida como componente standalone
- Steps (01: Choose your level, 02: Send us your deals) integrados como indicator compacto no header do Pricing

### Consulting — Pricing section atualizada
- Preços adicionados: Scout $7,500/mo, Pursuit $15,000/mo, Command "Let's talk"
- Novo frame por card: Name → Tier → For who (lighter) → Price → Description
- Descrições reescritas (mais curtas e diretas)
- CTAs por tier: "Get started →" (Scout/Pursuit), "Schedule a call →" (Command)
- Features atualizadas com novo copy
- Setas laterais substituídas por dot indicators com scroll tracking em tempo real
- Dot ativo: barra orange expandida (24px), inativos: pontos 6px
- Label: "Levels of access" → "Choose your level"
- Heading: "One model. Three levels. No lock-in." → "Choose your level of access."
- Tipografia description (abaixo do preço): reduzida para `text-[0.8rem]`
- Disclaimer: condensado em linha única, `text-[0.65rem]`/`warm-white/20`
- "For who" movido acima da divider line (agrupa identidade do tier)
- Divider line adicionada abaixo do tier label em todos os cards
- Ghost divider line orange no topo da seção (`via-orange/20`, fade nas pontas)

### Consulting — Seções removidas
- Founder (about Jonah) removida do page.tsx
- FinalCTA (Ready to move?) removida do page.tsx
- Imports limpos

### Consulting — FAQ atualizada
- Q4: "beyond underwriting, due diligence, financing, closing?" → "beyond underwriting and feasibility?"
- A1: "A full financial model built from" → "A full set of projections based on"
- A2: "the underwriting adapts" → "our team will adapt"
- A4: resposta atualizada com "operational support and more"

### Consulting — Navbar atualizada
- "Schedule a call" → "Get Started" (desktop e mobile)
- Link "About" removido (seção Founder não existe mais)
- Link "How it works" removido (seção integrada ao Pricing)
- Links finais: "Why Journey", "Services", "Pricing", "FAQ"

### Consulting — Footer atualizado
- Journey.Consulting → Journey.Advisory
- Email de Jonah removido

### Consulting — Tipografia alinhada com main site
- display: 4rem → 4.5rem, h1: 3rem → 3.5rem, h2: 2.25rem → 2.5rem, h3: 1.5rem → 1.75rem
- Container: 1100px → 1200px
- Mobile breakpoints atualizados para match

### Infra — Main site migrado para standalone
- Adicionado `output: 'standalone'` + `outputFileTracingRoot: __dirname` ao root `next.config.ts`
- Processos caíram de ~90-96 para ~13 (limite: 120)
- Ambos os sites agora rodam em modo standalone (processo único)

### Infra — Dev server consulting corrigido
- `dev:consulting` agora usa `--webpack` em vez de Turbopack
- Turbopack não encontrava o pacote `next` a partir de `apps/consulting/` (limitação de resolução no monorepo)
- Produção não é afetada (build:consulting copia tudo para a raiz)

### Infra — Consulting next.config.ts simplificado
- Removido `turbopack.root` e `import { resolve }` — desnecessários com `--webpack` no dev

### Docs — DEPLOYMENT.md reescrito
- Configurações reais da Hostinger documentadas
- Tabela de arquivos críticos, post-deploy checklist (Flush CDN cache)
- Estratégia de processo limit, changelog de incidentes

### Docs — CHANGELOG.md criado
- Log interno de alterações de design, arquitetura e funcionalidades

### Docs — CLAUDE.md atualizado
- Instrução para ler DEPLOYMENT.md antes de mexer em infra
- Instrução para atualizar CHANGELOG.md após alterações
- Regra de nunca usar `git add -A`

---

## 2026-04-03

### Main site — Map pins recalibrados
- Pins do mapa (LocationsMap) recalibrados com coordenadas geográficas reais
- Análise do SVG bounding box (viewBox 2000x1200) para mapear lon/lat → porcentagem
- 32 pins distribuídos: 4 large (Dallas, Charlotte, PNW, OKC), 16 medium, 12 small
- Dallas-Fort Worth posicionado como pin principal sobre o norte do Texas
- Nenhum pin fora das fronteiras ou colidindo com bordas

### Main site — MapPin component reescrito
- Migrou de `<svg>` com `<circle>` para `<div>` com CSS (absolute positioning)
- Prop `active` substituída por `size` (sm/md/lg) com opacidades e dimensões responsivas
- Pulse rings agora usam `scale` em vez de `r` para animação

### Main site — LifeMoments redesenhada
- Desktop: tabs coloridos à esquerda + carousel à direita (era text + carousel)
- Mobile: cards horizontais collapse/expand (era dots de navegação)
- Temas por momento com cores distintas (blue, green, yellow, terracotta)
- Ghost watermark numbers nos tabs ativos
- Swipe support mantido

### Main site — Navbar atualizada
- Dropdown "Ecosystem" substituiu "Business" com description por item
- Import renomeado: `businessDropdownLinks` → `ecosystemDropdownLinks`
- Labels atualizados: "How it works" → "Spaces"
- Logo atualizada para versão TM

### Main site — AboutFounder simplificada
- Componente refatorado com menos código
- Layout visual mantido

### Main site — Seções novas adicionadas
- FAQ: accordion com perguntas frequentes
- FinalCTA, Founder, Pricing, Problem, ProofBar, Solution — componentes criados (não usados em page.tsx exceto FAQ)

### Main site — Constants atualizadas
- Novos sectionIds: problem, solution, pricing, founder, cta, faq
- Novo externalUrl: mainSite
- Novo export: CALENDAR_URL
- ecosystemDropdownLinks com campo `description`

### Main site — Footer atualizado
- Referência à logo TM

### Main site — Brand assets
- Logo TM: `logo-white-TM.svg`, `logo-dark-TM.svg`
- Hero images: `storage-door.webp`, `storage-door-v2.webp`

### Consulting — Navbar mobile redesenhada
- Menu mobile com radial glow, logo no header, links com descrição
- Botão hamburger com background blur quando scrolled

### Consulting — Assets atualizados
- `logo-white-TM.svg` adicionado
- Hero background atualizado (foto de Dallas, 449KB)

### Infra — .gitignore
- `screenshots/` adicionado ao .gitignore (pasta pode ter 1GB+ de PNGs de dev)

---

## 2026-04-02

### Infra — Standalone migration
- Consulting migrado para `output: 'standalone'` (processo único)
- Build scripts atualizados para copiar public/ e .next/static/ para standalone
- Start command: `HOSTNAME=0.0.0.0 node .next/standalone/server.js`
- Motivação: limite de 120 processos na Hostinger

### Infra — DEPLOYMENT.md criado
- Documentação completa do setup de deploy na Hostinger
- Estrutura do projeto, settings por app, notas importantes

---

## Antes de 2026-04-02

### Infra — Imagens comprimidas
- Todas as JPGs convertidas para WebP (mozjpeg quality 75)
- Hero image: 1.8MB → 221KB (88% menor)
- `images.unoptimized: true` no next.config.ts

### Infra — Monorepo structure
- Web app movido para raiz (Hostinger exige root directory)
- Consulting e investors em `apps/`
- Turborepo configurado (`turbo.json`)
