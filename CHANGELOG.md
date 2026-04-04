# Changelog — Journey.Storage

Log interno de alterações de design, arquitetura e funcionalidades.

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
