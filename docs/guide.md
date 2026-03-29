# Guia Completo: Criação de Site Institucional via Vibe Coding
## Claude Code + VS Code + GitHub — Do Briefing ao Deploy

---

## ÍNDICE

- [FASE 1](#fase-1--preparação-do-ambiente) — Preparação do Ambiente
- [FASE 2](#fase-2--briefing--estratégia) — Briefing & Estratégia
- [FASE 3](#fase-3--conteúdo-copy--imagens) — Conteúdo (Copy + Imagens)
- [FASE 4](#fase-4--arquitetura--estrutura-do-site) — Arquitetura & Estrutura
- [FASE 5](#fase-5--design-system) — Design System
- [FASE 6](#fase-6--desenvolvimento-com-claude-code) — Desenvolvimento com Claude Code
- [FASE 7](#fase-7--refinamento--otimização) — Refinamento & Otimização
- [FASE 8](#fase-8--testes--qa) — Testes & QA
- [FASE 9](#fase-9--deploy--lançamento) — Deploy & Lançamento
- [FASE 10](#fase-10--pós-lançamento) — Pós-Lançamento
- [Apêndice A](#apêndice-a--comandos-essenciais-do-claude-code) — Comandos Essenciais
- [Apêndice B](#apêndice-b--estrutura-de-pastas-recomendada) — Estrutura de Pastas
- [Apêndice C](#apêndice-c--checklist-resumo) — Checklist Resumo

---

# FASE 1 — PREPARAÇÃO DO AMBIENTE

## 1.1 Instalações Obrigatórias

- [x] **Node.js** instalado (versão LTS)
- [x] **VS Code** instalado
- [x] **Git** instalado
- [x] **Claude Code** instalado via terminal: `npm install -g @anthropic-ai/claude-code`
- [x] Conta no **GitHub** criada
- [x] Conta na **Anthropic** com créditos/plano ativo
- [x] Conta na plataforma de deploy escolhida (Vercel ou Netlify — ambos gratuitos)

## 1.2 Configuração do VS Code

- [x] Extensão **GitHub Copilot** (opcional, complementa o Claude Code)
- [x] Extensão **Live Server** (para pré-visualização)
- [x] Extensão **Prettier** (formatação automática de código)
- [x] Extensão **ESLint** (detecção de erros)
- [x] Extensão **Image Preview** (ver imagens no editor)
- [x] Terminal integrado configurado (Ctrl+`)

## 1.3 Criação do Repositório

- [x] Criar repositório no GitHub (nome do projeto)
- [x] Marcar como **Private** (até o lançamento)
- [x] Adicionar `.gitignore` para Node
- [x] Clonar repositório localmente no VS Code
- [x] Testar que `git push` funciona

> **Dica Claude Code:** Abra o terminal no VS Code, navegue até a pasta do projeto e digite `claude`. O Claude Code vai iniciar uma sessão interativa dentro do seu projeto.

---

# FASE 2 — BRIEFING & ESTRATÉGIA

> **Documento:** [briefing.md](briefing.md)

## 2.1 Definição do Negócio

- [ ] Nome da empresa/marca
- [ ] Segmento de atuação
- [ ] Proposta de valor principal (o que resolve? para quem?)
- [ ] Diferenciais competitivos (3 a 5 pontos)
- [ ] Tom de voz da marca (formal, descontraído, técnico, acolhedor, premium…)
- [ ] Público-alvo primário (idade, perfil, dores, desejos)
- [ ] Público-alvo secundário (se houver)

## 2.2 Objetivos do Site

- [ ] Objetivo primário (gerar leads? vender? informar? agendar?)
- [ ] Objetivo secundário
- [ ] KPIs definidos (formulários enviados, cliques no WhatsApp, tempo na página…)
- [ ] CTAs principais definidos (ex: "Solicite um orçamento", "Fale conosco")

## 2.3 Análise de Concorrência

- [ ] Listar 3 a 5 sites concorrentes diretos
- [ ] Anotar pontos fortes de cada um (design, conteúdo, UX)
- [ ] Anotar pontos fracos
- [ ] Listar 3 a 5 sites de **referência visual** (não precisam ser do mesmo segmento)
- [ ] Salvar prints/links de seções específicas que agradaram → pasta [docs/references/](references/)

> **Usando sites como referência de design:**
>
> **Método 1 — Screenshot como referência:**
> ```
> "Olhe esta imagem em docs/references/hero/stripe-hero-clean.png.
> Quero que crie um hero section com o MESMO padrão de layout
> (disposição de elementos, espaçamentos, proporções),
> mas usando as cores, fontes e conteúdo da MINHA marca."
> ```
>
> **Método 2 — Descrição detalhada do padrão:**
> ```
> "O hero do apple.com tem: título gigante centralizado, subtítulo
> discreto abaixo, imagem de produto grande, muito espaço em branco,
> CTA mínimo. Crie um hero com esse padrão para o meu negócio."
> ```
>
> **Método 3 — Múltiplas referências combinadas:**
> ```
> "Header no estilo stripe.com + seção de serviços no estilo linear.app
> + footer no estilo vercel.com. Adapte para minha identidade visual."
> ```

## 2.4 Documento de Briefing Consolidado

- [ ] Compilar todas as informações acima em [briefing.md](briefing.md)

> Ao iniciar o projeto, peça ao Claude Code:
> ```
> "Leia o arquivo docs/briefing.md e use como base para todo o projeto.
> Confirme que entendeu os pontos principais."
> ```

---

# FASE 3 — CONTEÚDO (COPY + IMAGENS)

> **Documento:** [content.md](content.md)

## 3.1 Copywriting — Textos do Site

### Página Home

- [ ] Headline principal (H1) — máximo 10 palavras, impacto imediato
- [ ] Subheadline — expandir a promessa do H1 (1-2 frases)
- [ ] Texto do CTA principal
- [ ] Seção "O que fazemos" — 2 a 3 parágrafos curtos
- [ ] Lista de serviços/soluções resumida (3 a 6 itens com mini-descrição)
- [ ] Seção de prova social (depoimentos, números, logos de clientes)
- [ ] Seção de diferenciais (3 a 4 cards)
- [ ] Texto pré-footer (chamada final para ação)

### Página Sobre / Quem Somos

- [ ] História da empresa (narrativa envolvente, não cronológica)
- [ ] Missão, Visão e Valores (se aplicável e relevante)
- [ ] Equipe (nomes, cargos, mini-bios) — opcional
- [ ] Números da empresa (anos de mercado, clientes atendidos, projetos)

### Página de Serviços

- [ ] Título e descrição de cada serviço
- [ ] Benefícios de cada serviço (foco no cliente, não na empresa)
- [ ] Processo de trabalho / Como funciona (3 a 5 etapas)
- [ ] FAQ específico por serviço (se necessário)

### Página de Contato

- [ ] Texto de abertura acolhedor
- [ ] Campos do formulário definidos (nome, email, telefone, mensagem, assunto…)
- [ ] Informações de contato (telefone, email, endereço, redes sociais)
- [ ] Horário de funcionamento
- [ ] Mapa de localização (se aplicável)

### Páginas Adicionais (se necessário)

- [ ] Blog / Artigos
- [ ] Cases / Portfólio
- [ ] Política de Privacidade
- [ ] Termos de Uso

### Elementos Recorrentes

- [ ] Textos do menu de navegação
- [ ] Texto do footer (mini-about, links, copyright)
- [ ] Microcopy dos botões (CTAs secundários)
- [ ] Textos de mensagens de sucesso/erro de formulários
- [ ] Meta titles para cada página (SEO)
- [ ] Meta descriptions para cada página (SEO)

> **Gerando copy profissional:**
> ```
> "Com base no docs/briefing.md, gere TODOS os textos do site.
> Crie o arquivo docs/content.md com as copys organizadas por
> página e por seção. Use o tom de voz [descontraído e profissional].
> Foque em benefícios para o cliente, não em features do produto."
> ```

## 3.2 Imagens & Mídia

> **Documento:** [image-map.md](image-map.md) | **Referências:** [references/](references/)

### Inventário Visual

- [ ] Listar todas as imagens necessárias por página/seção → [image-map.md](image-map.md)
- [ ] Classificar: foto de banco? foto própria? ilustração? ícone?
- [ ] Definir proporções/tamanhos para cada posição

### Sourcing de Imagens

- [ ] Fotos próprias: sessão fotográfica profissional (se aplicável)
- [ ] Bancos gratuitos: Unsplash, Pexels, Pixabay
- [ ] Bancos pagos: Shutterstock, Adobe Stock, iStock (se necessário)
- [ ] Ilustrações: unDraw, Storyset, Blush (gratuitos)
- [ ] Ícones: Lucide, Phosphor Icons, Heroicons, Tabler Icons

### Tratamento de Imagens

- [ ] Todas as imagens com resolução adequada (mínimo 2x para retina)
- [ ] Imagens otimizadas para web (compactadas sem perder qualidade)
- [ ] Formato correto: WebP como padrão, com fallback para JPG/PNG
- [ ] Imagens recortadas nas proporções corretas
- [ ] Consistência visual (mesmo estilo de edição/filtro)

### Assets da Marca

- [ ] Logo em SVG (vetorial, escalável)
- [ ] Logo versão clara e escura
- [ ] Favicon (ícone da aba do navegador) — 32x32 e 16x16
- [ ] Open Graph Image (imagem para compartilhamento em redes sociais — 1200x630px)

---

# FASE 4 — ARQUITETURA & ESTRUTURA DO SITE

> **Documento:** [architecture.md](architecture.md)

## 4.1 Mapa do Site (Sitemap)

- [ ] Hierarquia de páginas definida
- [ ] URLs amigáveis definidas para cada página
- [ ] Estrutura de navegação principal (menu)
- [ ] Navegação secundária (footer, breadcrumbs)
- [ ] Fluxos de conversão mapeados

### Estrutura típica para site institucional:

```
/ (Home)
├── /sobre
├── /servicos
│   ├── /servicos/servico-1
│   ├── /servicos/servico-2
│   └── /servicos/servico-3
├── /portfolio        (opcional)
├── /blog             (opcional)
│   └── /blog/[slug]
├── /contato
├── /privacidade
└── /termos
```

## 4.2 Wireframe por Página (Estrutura de Blocos)

### Home — Seções na Ordem

- [ ] **Header/Navbar** — Logo + Menu + CTA
- [ ] **Hero Section** — Headline + Subtítulo + CTA + Imagem/Vídeo
- [ ] **Barra de Logos** — Clientes/Parceiros (prova social rápida)
- [ ] **Sobre Resumido** — Quem somos em 2-3 frases + link para página Sobre
- [ ] **Serviços** — Grid ou cards de serviços
- [ ] **Diferenciais** — 3-4 blocos com ícones
- [ ] **Números/Resultados** — Contadores animados ou estáticos
- [ ] **Depoimentos** — Carrossel ou grid de testemunhos
- [ ] **CTA Section** — Bloco de chamada para ação final
- [ ] **Footer** — Logo + links + contato + redes sociais + copyright

### Wireframe de outras páginas

- [ ] Sobre
- [ ] Serviços
- [ ] Contato
- [ ] Demais páginas

## 4.3 Elementos Globais do Site

- [ ] **Header** — fixo ou sticky? Transparente na home?
- [ ] **Menu mobile** — hamburger com drawer lateral? Full screen overlay?
- [ ] **Footer** — quantas colunas? Newsletter integrada?
- [ ] **Botão WhatsApp** — flutuante no canto inferior direito?
- [ ] **Cookie Banner** — LGPD compliance
- [ ] **Scroll to Top** — botão para voltar ao topo
- [ ] **Loading/Skeleton** — estado de carregamento

## 4.4 Definição de Stack Técnica

- [ ] **Framework:** Next.js (recomendado — SEO excelente, rotas automáticas, deploy fácil)
- [ ] **Estilização:** Tailwind CSS
- [ ] **Componentes:** shadcn/ui como base (opcional)
- [ ] **Animações:** Framer Motion
- [ ] **Ícones:** Lucide React
- [ ] **Formulário:** React Hook Form + envio via API Route ou serviço externo
- [ ] **Deploy:** Vercel

> **Inicializando o projeto:**
> ```
> "Inicialize um projeto Next.js com as seguintes specs:
> - Next.js 14+ com App Router
> - Tailwind CSS configurado
> - TypeScript
> - Estrutura de pastas organizada por feature
> - Shadcn/ui inicializado
> - Framer Motion instalado
> - Lucide React instalado
> - Pasta 'components' com subpastas: ui/, layout/, sections/
> - Página inicial com layout básico (header + main + footer)
> - Responsivo mobile-first
> Leia o docs/briefing.md para contexto da marca."
> ```

---

# FASE 5 — DESIGN SYSTEM

> **Documento:** [design-system.md](design-system.md) | **Referências visuais:** [references/](references/)

```
"Analise as imagens em docs/references/.
Para cada uma, extraia estrutura de grid, ritmo vertical,
estilo de tipografia, padrão de interação e filosofia de cor.
Depois, crie o design system usando esses padrões estruturais,
mas substituindo pela minha identidade visual."
```

## 5.1 Paleta de Cores

- [ ] **Cor primária** — cor principal da marca (botões, links, destaques)
- [ ] **Cor secundária** — cor de apoio (elementos complementares)
- [ ] **Cor de acento** — cor de destaque pontual (badges, alertas, hover)
- [ ] **Neutros** — escala de cinzas (backgrounds, textos, bordas)
  - Branco / Off-white
  - Cinza claro (backgrounds)
  - Cinza médio (textos secundários)
  - Cinza escuro (textos principais)
  - Preto / Near-black
- [ ] **Cores semânticas:** sucesso, erro, aviso, info
- [ ] **Gradientes** (se fizerem parte da identidade)
- [ ] **Variação dark mode** (opcional mas recomendado)

> Garanta contraste WCAG AA (mínimo 4.5:1 para texto normal).

## 5.2 Tipografia

- [ ] **Font família display/heading** — para títulos (mais personalidade)
- [ ] **Font família body** — para texto corrido (legibilidade)
- [ ] **Escala tipográfica definida:**
  - H1 a H4: tamanho, peso, line-height, letter-spacing
  - Body large / Body / Body small / Caption
- [ ] **Responsividade tipográfica** — tamanhos reduzidos para mobile
- [ ] **Font carregada via Google Fonts ou self-hosted**

> **Combinações recomendadas:**
> - **Premium/Luxo:** Playfair Display + Source Sans 3
> - **Moderno/Tech:** Space Grotesk + DM Sans
> - **Criativo/Ousado:** Syne + Outfit
> - **Corporativo/Confiável:** Instrument Serif + General Sans
> - **Clean/Minimalista:** Satoshi + Cabinet Grotesk

## 5.3 Espaçamento & Layout

- [ ] **Sistema de grid** — 12 colunas? Container max-width?
- [ ] **Escala de espaçamento** — múltiplos de 4px (4, 8, 16, 24, 32, 48, 64, 96, 128)
- [ ] **Padding de seções** — espaçamento vertical entre seções
- [ ] **Container max-width** — 1200px? 1280px? 1440px?
- [ ] **Margem lateral mínima** — padding horizontal do container

## 5.4 Componentes UI (Design Tokens)

- [ ] **Botões:** primário, secundário, terciário — tamanhos sm/md/lg, estados default/hover/active/disabled/loading
- [ ] **Cards:** sombra, borda, border-radius, padding, hover effect
- [ ] **Inputs de formulário:** estilo, labels, mensagens de erro, tamanhos
- [ ] **Badges/Tags**
- [ ] **Divisores/Separadores**
- [ ] **Tooltips**
- [ ] **Modais** (se necessário)

## 5.5 Imagens & Mídia (Estilo Visual)

- [ ] **Border-radius de imagens** — sharp? arredondado?
- [ ] **Tratamento de fotos** — filtro? overlay? duotone?
- [ ] **Estilo de ícones** — outline? filled? duotone? Tamanho padrão?
- [ ] **Aspect ratios padrão** — hero (16:9), cards (4:3), thumbnails (1:1)

## 5.6 Animações & Micro-interações

- [ ] **Transição padrão** — duração (300ms? 500ms?), easing
- [ ] **Hover effects** — links, botões, cards
- [ ] **Scroll animations** — fade in? slide up? stagger?
- [ ] **Page transitions**
- [ ] **Loading states** — skeleton? spinner? shimmer?

> **Criando o Design System inteiro:**
> ```
> "Crie o design system completo para o projeto. Baseie-se no
> docs/briefing.md para entender o tom da marca.
> 1. Configure tailwind.config.ts com cores, fontes e espaçamentos
> 2. Crie globals.css com CSS variables e importação de fontes
> 3. Crie componentes base em /components/ui/:
>    Button, Container, SectionWrapper, Heading, Card, Badge, Input, Textarea, Label
> 4. Crie docs/design-system.md documentando todas as decisões visuais."
> ```

---

# FASE 6 — DESENVOLVIMENTO COM CLAUDE CODE

## 6.1 Estratégia de Desenvolvimento

Construir incrementalmente — **nunca peça o site inteiro de uma vez:**

1. Layout global (header + footer + estrutura de página)
2. Home page seção por seção
3. Páginas internas uma a uma
4. Responsividade
5. Animações e polish
6. Funcionalidades (formulário, etc.)

## 6.2 Componentes de Layout Global

- [ ] **Header/Navbar**
  ```
  "Crie o componente Header em /components/layout/Header.tsx:
  - Logo à esquerda, links centralizados, CTA à direita
  - Background transparente que fica sólido ao scroll (sticky)
  - Menu hamburger para mobile com drawer lateral animado
  - Framer Motion para animações
  - Tokens do design system"
  ```

- [ ] **Footer**
  ```
  "Crie o componente Footer em /components/layout/Footer.tsx:
  - 4 colunas: Logo+mini-about | Links | Serviços | Contato
  - Ícones de redes sociais, barra de copyright
  - Responsivo: 4 colunas → 2 → 1"
  ```

- [ ] **Layout wrapper** que inclui Header + Footer em todas as páginas

## 6.3 Página Home — Seção por Seção

- [ ] **Hero Section**
- [ ] **Barra de Logos de Clientes**
- [ ] **Seção Sobre (resumida)**
- [ ] **Seção de Serviços**
- [ ] **Seção de Diferenciais/Features**
- [ ] **Seção de Números/Resultados**
- [ ] **Seção de Depoimentos**
- [ ] **Seção CTA Final**

> **Iterando no visual após cada seção:**
> ```
> "A seção de serviços ficou muito genérica. Melhore:
> - Adicione ícones do Lucide para cada serviço
> - Hover no card: sobe levemente com sombra
> - Grid assimétrico (card principal maior + 2 menores)
> - Gradiente sutil no background
> - Entrada dos cards com stagger via Framer Motion"
> ```

## 6.4 Páginas Internas

- [ ] **Página Sobre**
- [ ] **Página Serviços** (listagem + páginas individuais se necessário)
- [ ] **Página Contato**
  ```
  "Crie a página /contato:
  - Grid 2 colunas: formulário à esquerda, info à direita
  - Campos: Nome, Email, Telefone, Assunto (select), Mensagem
  - Validação com React Hook Form + Zod
  - Feedback visual de sucesso/erro após envio
  - Em mobile: coluna única, formulário primeiro"
  ```
- [ ] **Página Política de Privacidade**
- [ ] **Página 404 (Not Found)**

## 6.5 Funcionalidades

- [ ] **Formulário de contato funcional** (API Route + Resend ou Formspree)
- [ ] **Botão de WhatsApp flutuante**
- [ ] **Cookie consent banner (LGPD)**
- [ ] **Scroll suave para âncoras**
- [ ] **Botão voltar ao topo**
- [ ] **Google Analytics / Tag Manager**

## 6.6 Versionamento com Git

- [ ] Fazer commit após cada componente/seção finalizada

> ```
> "Faça commit das alterações com uma mensagem descritiva
> e push para o GitHub."
> ```

---

# FASE 7 — REFINAMENTO & OTIMIZAÇÃO

## 7.1 Responsividade

- [ ] Mobile (375px — iPhone SE como base)
- [ ] Mobile grande (428px — iPhone Pro Max)
- [ ] Tablet (768px — iPad)
- [ ] Desktop (1024px–1440px)
- [ ] Desktop grande (1440px+)
- [ ] Nenhum conteúdo transborda horizontalmente
- [ ] Textos legíveis em todos os breakpoints
- [ ] Botões com área de toque mínima (44x44px) em mobile
- [ ] Imagens responsivas (srcset ou next/image)

> ```
> "Revise TODAS as seções da home e garanta que estão perfeitas
> em mobile (375px): textos, grids, imagens, padding, botões. Corrija tudo."
> ```

## 7.2 Performance

- [ ] Imagens otimizadas (WebP, lazy loading, tamanhos corretos)
- [ ] Fontes com `display: swap`
- [ ] Componentes com lazy loading onde aplicável
- [ ] Remoção de dependências não utilizadas
- [ ] Build sem erros (`npm run build`)
- [ ] Lighthouse score mínimo: 90+ em Performance

## 7.3 SEO

- [ ] **Meta tags** em cada página (title, description, og:image)
- [ ] **Heading hierarchy** correta (H1 único, H2 para seções, H3 para sub-itens)
- [ ] **Alt text** em todas as imagens
- [ ] **Sitemap.xml** gerado automaticamente
- [ ] **Robots.txt** configurado
- [ ] **Dados estruturados** (Schema.org — LocalBusiness ou Organization)
- [ ] **URLs limpas** sem parâmetros desnecessários
- [ ] **Canonical URLs** definidas
- [ ] **Open Graph tags** para compartilhamento em redes sociais

## 7.4 Acessibilidade (a11y)

- [ ] Contraste de cores adequado (WCAG AA)
- [ ] Navegação por teclado funcional (tab, enter, esc)
- [ ] Atributos ARIA onde necessário
- [ ] Labels em todos os inputs do formulário
- [ ] Skip navigation link
- [ ] Focus indicators visíveis
- [ ] Textos alternativos em imagens

## 7.5 Polish Visual Final

- [ ] Animações de scroll suaves e consistentes
- [ ] Hover effects em todos os elementos interativos
- [ ] Transições suaves entre páginas (se implementado)
- [ ] Consistência visual entre todas as páginas
- [ ] Revisão de espaçamentos e alinhamentos
- [ ] Verificação de tipografia (sem texto cortado, overflow, etc.)

---

# FASE 8 — TESTES & QA

## 8.1 Testes Funcionais

- [ ] Todos os links funcionam (internos e externos)
- [ ] Formulário de contato envia e-mail corretamente
- [ ] Mensagens de sucesso/erro aparecem corretamente
- [ ] Botão WhatsApp abre o chat correto
- [ ] Menu mobile abre e fecha corretamente
- [ ] Scroll to top funciona
- [ ] Âncoras de scroll estão corretas

## 8.2 Testes Cross-Browser

- [ ] Chrome (desktop + mobile)
- [ ] Safari (desktop + mobile — especialmente iPhone)
- [ ] Firefox
- [ ] Edge
- [ ] Samsung Internet (se público brasileiro for relevante)

## 8.3 Testes de Conteúdo

- [ ] Revisão ortográfica de todos os textos
- [ ] Nenhum texto placeholder restante ("Lorem ipsum", "Texto aqui", etc.)
- [ ] Todas as imagens placeholder foram substituídas por imagens reais
- [ ] Dados de contato estão corretos (telefone, email, endereço)
- [ ] Links de redes sociais apontam para perfis corretos
- [ ] Copyright com ano correto

## 8.4 Testes de Performance

- [ ] Google Lighthouse: Performance ≥ 90
- [ ] Google Lighthouse: Accessibility ≥ 90
- [ ] Google Lighthouse: Best Practices ≥ 90
- [ ] Google Lighthouse: SEO ≥ 90
- [ ] Tempo de carregamento inicial < 3 segundos
- [ ] Largest Contentful Paint (LCP) < 2.5s
- [ ] Cumulative Layout Shift (CLS) < 0.1

> ```
> "Revise o projeto inteiro e identifique:
> 1. Textos placeholder esquecidos
> 2. Imagens sem alt text
> 3. Links quebrados ou placeholder (#)
> 4. Console errors ou warnings
> 5. Imports não utilizados
> Liste tudo e corrija."
> ```

---

# FASE 9 — DEPLOY & LANÇAMENTO

## 9.1 Preparação para Deploy

- [ ] Variáveis de ambiente configuradas (`.env.local` → variáveis na plataforma)
- [ ] Build de produção roda sem erros (`npm run build`)
- [ ] Todas as imagens estão na pasta correta e sendo carregadas
- [ ] Nenhum `console.log` de debug restante
- [ ] Favicon configurado
- [ ] Open Graph image configurada

## 9.2 Deploy na Vercel

- [ ] Conta na Vercel criada
- [ ] Repositório GitHub conectado à Vercel
- [ ] Variáveis de ambiente configuradas na Vercel
- [ ] Deploy realizado com sucesso
- [ ] Preview URL funcionando

> Após conectar, cada `git push` fará deploy automático.

## 9.3 Domínio Customizado

- [ ] Domínio comprado (Registro.br, Cloudflare, Namecheap)
- [ ] DNS apontado para Vercel
- [ ] SSL/HTTPS ativo (automático na Vercel)
- [ ] Redirect de www para root (ou vice-versa)
- [ ] Site acessível pelo domínio final

## 9.4 Integrações Pós-Deploy

- [ ] Google Analytics / GA4 configurado e coletando dados
- [ ] Google Search Console configurado
- [ ] Sitemap submetido ao Google Search Console
- [ ] Meta pixel configurado (se usar anúncios no Facebook/Instagram)
- [ ] Google Tag Manager (se necessário)

---

# FASE 10 — PÓS-LANÇAMENTO

## 10.1 Monitoramento Inicial

- [ ] Verificar se formulários estão recebendo mensagens (teste real)
- [ ] Verificar métricas do Google Analytics (visitantes chegando?)
- [ ] Testar o site com conexão lenta (3G throttling no DevTools)
- [ ] Pedir feedback a 3-5 pessoas do público-alvo
- [ ] Verificar indexação no Google (`site:seudominio.com.br`)

## 10.2 Iterações e Melhorias

- [ ] Correções baseadas no feedback recebido
- [ ] Otimizações baseadas nos dados do Analytics
- [ ] Novas páginas ou seções conforme necessidade
- [ ] Blog posts para SEO orgânico (se aplicável)
- [ ] A/B testing em headlines ou CTAs (se volume de tráfego justificar)

## 10.3 Manutenção Contínua

- [ ] Atualizar dependências periodicamente (`npm update`)
- [ ] Renovar conteúdo (números, depoimentos, portfólio)
- [ ] Backup do repositório (GitHub já funciona como backup)
- [ ] Monitorar uptime (UptimeRobot — gratuito)

---

# APÊNDICE A — COMANDOS ESSENCIAIS DO CLAUDE CODE

## Iniciando Sessão

```bash
cd meu-projeto   # Entra na pasta do projeto
claude           # Inicia o Claude Code
```

## Prompts Eficientes para Vibe Coding

**Criar componente do zero:**
```
"Crie [nome do componente] em [caminho do arquivo].
Ele deve: [descrever funcionalidade e visual].
Use os tokens do design system. Mobile-first."
```

**Corrigir bug:**
```
"O [componente] está com esse problema: [descrever].
Corrija mantendo o restante do comportamento intacto."
```

**Refinar visual:**
```
"O visual do [componente/seção] está [problema].
Quero que fique similar a [referência]. Especificamente:
- [mudança 1]
- [mudança 2]
- [mudança 3]"
```

**Adicionar funcionalidade:**
```
"Adicione [funcionalidade] ao [componente].
Quando o usuário [ação], deve [resultado].
Mantenha o visual atual, só adicione o comportamento."
```

**Debug geral:**
```
"O terminal está mostrando este erro: [colar erro].
Identifique a causa e corrija."
```

**Revisão completa:**
```
"Faça uma revisão completa do projeto:
- Erros de build
- Componentes não utilizados
- Imports redundantes
- Problemas de responsividade
- Textos placeholder esquecidos
Liste tudo e corrija."
```

---

# APÊNDICE B — ESTRUTURA DE PASTAS RECOMENDADA

```
meu-site-institucional/
├── public/
│   ├── images/
│   │   ├── hero/
│   │   ├── services/
│   │   ├── team/
│   │   ├── clients/
│   │   └── og/
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── sobre/page.tsx
│   │   ├── servicos/page.tsx
│   │   ├── contato/page.tsx
│   │   ├── privacidade/page.tsx
│   │   ├── not-found.tsx
│   │   └── api/
│   │       └── contact/route.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── MobileMenu.tsx
│   │   ├── sections/
│   │   │   ├── Hero.tsx
│   │   │   ├── Services.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   ├── Stats.tsx
│   │   │   ├── CTA.tsx
│   │   │   └── ClientLogos.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Container.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── SectionWrapper.tsx
│   │   └── shared/
│   │       ├── WhatsAppButton.tsx
│   │       ├── CookieBanner.tsx
│   │       ├── ScrollToTop.tsx
│   │       └── ContactForm.tsx
│   ├── lib/
│   │   └── utils.ts
│   ├── styles/
│   │   └── globals.css
│   └── data/
│       └── site-content.ts
├── docs/
│   ├── guide.md             ← você está aqui
│   ├── briefing.md
│   ├── content.md
│   ├── architecture.md
│   ├── design-system.md
│   ├── image-map.md
│   └── references/
├── tailwind.config.ts
├── next.config.js
├── package.json
└── .env.local
```

---

# APÊNDICE C — CHECKLIST RESUMO

Use esta lista para acompanhar o progresso geral do projeto:

## Fundação

- [x] Ambiente configurado (Node, VS Code, Git, Claude Code)
- [x] Repositório criado no GitHub
- [ ] Briefing documentado → [briefing.md](briefing.md)
- [ ] Conteúdo escrito (copys) → [content.md](content.md)
- [ ] Imagens coletadas e organizadas → [image-map.md](image-map.md)
- [ ] Arquitetura do site definida → [architecture.md](architecture.md)

## Design System

- [ ] Cores definidas e configuradas
- [ ] Tipografia escolhida e configurada
- [ ] Componentes base criados
- [ ] Espaçamentos padronizados
- [ ] Design system documentado → [design-system.md](design-system.md)

## Desenvolvimento

- [ ] Projeto Next.js inicializado
- [ ] Layout global (header + footer)
- [ ] Home page completa
- [ ] Páginas internas completas
- [ ] Formulário funcional
- [ ] Elementos de UI (WhatsApp, cookies, scroll to top)

## Qualidade

- [ ] Responsividade testada
- [ ] Performance otimizada (Lighthouse 90+)
- [ ] SEO implementado
- [ ] Acessibilidade verificada
- [ ] Cross-browser testado
- [ ] Conteúdo revisado (sem placeholders)

## Lançamento

- [ ] Build sem erros
- [ ] Deploy na Vercel
- [ ] Domínio conectado
- [ ] HTTPS ativo
- [ ] Analytics configurado
- [ ] Search Console configurado

## Pós-Lançamento

- [ ] Formulários testados em produção
- [ ] Feedback coletado
- [ ] Indexação verificada
- [ ] Monitoramento ativo

---

> **Lembre-se:** A qualidade do resultado é diretamente proporcional à qualidade das instruções. Quanto mais específico e detalhado você for com o Claude Code, melhor será o resultado. Iterar é o fluxo natural — peça ajustes, refinamentos e melhorias sem hesitar.
