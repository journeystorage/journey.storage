# Changelog — Journey.Storage

Log interno de alterações de design, arquitetura e funcionalidades.

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
