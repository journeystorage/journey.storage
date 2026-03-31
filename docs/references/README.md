# Referências Visuais

Pasta organizada por tipo de elemento. Cada subpasta tem um `notes.md` para anotar o que você gostou em cada referência.

## Estrutura

```
references/
├── hero/           prints de hero sections
├── navigation/     prints de headers e menus
├── cards/          prints de cards e grids de serviços
├── footer/         prints de footers
├── typography/     prints de estilos tipográficos
├── color-palette/  prints de paletas e sites com cores interessantes
├── full-pages/     prints de páginas inteiras
└── map/            prints de seções com mapa / locations
```

## Como salvar um print

1. Tire o screenshot e salve como `.png` com nome descritivo:
   ```
   [site]-[descricao-breve].png
   ```
   Exemplos:
   - `stripe-hero-clean.png`
   - `linear-nav-minimal.png`
   - `vercel-card-grid-dark.png`
   - `airbnb-footer-links.png`

2. Coloque na subpasta do tipo de elemento que você quer referenciar.

3. Abra o `notes.md` da subpasta e anote o que gostou.

## Como referenciar ao Claude Code

No chat, mencione o caminho completo da imagem:

```
Veja docs/references/hero/stripe-hero-clean.png — quero um hero com esse estilo de espaçamento.
```

O Claude Code consegue ler imagens `.png` diretamente quando você referencia o caminho.

## Dica

Se tiver múltiplas referências para uma decisão, mencione todas de uma vez:

```
Para o hero, veja:
- docs/references/hero/stripe-hero-clean.png (espaçamento)
- docs/references/color-palette/linear-dark-palette.png (cores)
- docs/references/typography/inter-heading-scale.png (tipografia)
```
