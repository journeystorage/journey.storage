# Arquitetura & Estrutura do Site

---

## 1. Stack Técnica

| Camada | Escolha | Justificativa |
|--------|---------|---------------|
| Framework | [PREENCHER] | [PREENCHER] |
| Estilização | [PREENCHER] | [PREENCHER] |
| Componentes UI | [PREENCHER] | [PREENCHER] |
| Animações | [PREENCHER] | [PREENCHER] |
| Ícones | [PREENCHER] | [PREENCHER] |
| Formulário | [PREENCHER] | [PREENCHER] |
| CMS / Dados | [PREENCHER] | [PREENCHER] |
| Deploy / Hosting | [PREENCHER] | [PREENCHER] |
| Domínio | [PREENCHER] | — |

---

## 2. Mapa do Site (Sitemap)

```
/ (Home)
├── /sobre
├── /servicos
│   ├── /servicos/[PREENCHER]
│   ├── /servicos/[PREENCHER]
│   └── /servicos/[PREENCHER]
├── /contato
├── /privacidade
└── /termos
```

*Adicione ou remova páginas conforme o projeto.*

---

## 3. Rotas & URLs

| Página | URL | Title da página | Prioridade no sitemap |
|--------|-----|-----------------|-----------------------|
| Home | `/` | [PREENCHER] | 1.0 |
| Sobre | `/sobre` | [PREENCHER] | 0.8 |
| Serviços | `/servicos` | [PREENCHER] | 0.9 |
| Serviço 1 | `/servicos/[PREENCHER]` | [PREENCHER] | 0.8 |
| Serviço 2 | `/servicos/[PREENCHER]` | [PREENCHER] | 0.8 |
| Contato | `/contato` | [PREENCHER] | 0.7 |
| Privacidade | `/privacidade` | [PREENCHER] | 0.3 |
| Termos | `/termos` | [PREENCHER] | 0.3 |

---

## 4. Wireframe por Página

### Home (`/`)

Seções em ordem, de cima para baixo:

1. **Header/Navbar** — [PREENCHER: fixo? sticky? transparente?]
2. **Hero Section** — [PREENCHER: layout? imagem à direita, fullscreen, vídeo?]
3. **Barra de Logos** — [PREENCHER: clientes ou parceiros?]
4. **Sobre Resumido** — [PREENCHER: texto + imagem? texto simples?]
5. **Serviços** — [PREENCHER: grid de cards? lista? quantos serviços?]
6. **Diferenciais** — [PREENCHER: ícones + texto? quantos?]
7. **Números/Resultados** — [PREENCHER: contadores animados? estáticos?]
8. **Depoimentos** — [PREENCHER: carrossel? grid? quantos?]
9. **CTA Final** — [PREENCHER: fundo colorido? imagem de fundo?]
10. **Footer** — [PREENCHER: quantas colunas?]

---

### Sobre (`/sobre`)

Seções em ordem:

1. **Hero Interno** — [PREENCHER]
2. **História** — [PREENCHER: texto + imagem lateral? fullwidth?]
3. **Missão / Visão / Valores** — [PREENCHER: cards? lista?]
4. **Equipe** — [PREENCHER: fotos em grid? ou não tem?]
5. **Números** — [PREENCHER: mesmo componente da home?]
6. **CTA** — [PREENCHER]

---

### Serviços (`/servicos`)

Seções em ordem:

1. **Hero Interno** — [PREENCHER]
2. **Lista de Serviços** — [PREENCHER: cards em grid? accordion? uma seção por serviço?]
3. **Processo / Como Funciona** — [PREENCHER: steps horizontais? verticais?]
4. **FAQ** — [PREENCHER: accordion?]
5. **CTA** — [PREENCHER]

---

### Contato (`/contato`)

Seções em ordem:

1. **Hero Interno** — [PREENCHER]
2. **Grid de 2 colunas** — Formulário | Informações de contato
3. **Mapa** — [PREENCHER: embed Google Maps? ou não tem?]

---

### Páginas adicionais

| Página | Seções principais |
|--------|-------------------|
| Privacidade | [PREENCHER] |
| Termos | [PREENCHER] |
| 404 | [PREENCHER] |
| [PREENCHER] | [PREENCHER] |

---

## 5. Elementos Globais

| Elemento | Decisão |
|----------|---------|
| Header — comportamento no scroll | [PREENCHER — transparente→sólido? sempre sólido?] |
| Header — CTA visível? | [PREENCHER] |
| Menu mobile | [PREENCHER — drawer lateral? overlay fullscreen?] |
| Footer — número de colunas | [PREENCHER] |
| Footer — newsletter integrada? | [PREENCHER] |
| Botão WhatsApp flutuante | [PREENCHER — sim/não, número] |
| Cookie banner (LGPD) | [PREENCHER — sim/não] |
| Botão voltar ao topo | [PREENCHER — sim/não] |
| Loading / skeleton screens | [PREENCHER — sim/não] |
| Transição entre páginas | [PREENCHER — sim/não] |

---

## 6. Integrações Externas

| Integração | Finalidade | Observações |
|------------|------------|-------------|
| [PREENCHER] | [PREENCHER] | [PREENCHER] |
| [PREENCHER] | [PREENCHER] | [PREENCHER] |
| [PREENCHER] | [PREENCHER] | [PREENCHER] |

*Exemplos comuns: Google Analytics, Google Tag Manager, Resend (email), WhatsApp Business, Google Maps, Meta Pixel.*

---

## 7. SEO & Metadados

**Padrão de `<title>`:** [PREENCHER — ex: "Nome da Página | Nome da Marca"]

**Meta description padrão** *(fallback)*:
[PREENCHER]

**Open Graph:**
- Imagem padrão: `public/images/og/og-image-default.jpg` (1200×630px)
- Título padrão: [PREENCHER]
- Descrição padrão: [PREENCHER]

**Dados estruturados (Schema.org):** [PREENCHER — Organization? LocalBusiness?]

---

## 8. Performance & Acessibilidade

**Metas de Lighthouse:**
- Performance: ≥ [PREENCHER — recomendado: 90]
- Accessibility: ≥ [PREENCHER — recomendado: 90]
- Best Practices: ≥ [PREENCHER — recomendado: 90]
- SEO: ≥ [PREENCHER — recomendado: 90]

**Padrão de acessibilidade:** [PREENCHER — WCAG AA recomendado]

**Outras metas:** [PREENCHER — ex: LCP < 2.5s, CLS < 0.1]

---

## 9. Decisões Técnicas & Trade-offs

*Registre aqui decisões não óbvias e o porquê delas.*

| Decisão | Alternativa considerada | Motivo da escolha |
|---------|------------------------|-------------------|
| [PREENCHER] | [PREENCHER] | [PREENCHER] |
