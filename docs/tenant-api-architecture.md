# Tenant/Nectar API — Architecture Notes

> Notas de arquitetura para a integração com a API da Tenant Inc. (Hummingbird PMS).
> Referência para quando formos migrar do tenant-lab para produção no main website.

---

## 1. Caching Strategy (ISR)

O site NÃO deve chamar a API da Tenant a cada request de usuário. Com 10k+ usuários simultâneos, isso sobrecarregaria tanto o site quanto a API.

**Solução: Incremental Static Regeneration (ISR)** — Next.js gera páginas estáticas e revalida em background a cada N minutos. Cada property/página é servida como HTML estático; a API só é chamada 1x por ciclo de revalidação, não 1x por visitante.

### Revalidation por tipo de dado

| Dado | Frequência de mudança | `revalidate` recomendado |
|---|---|---|
| Properties (locations) | Quase nunca | `86400` (24h) |
| Categories | Quase nunca | `86400` (24h) |
| Size Guide | Estático puro | Sem API — hardcoded |
| Units / Facility page (preços, disponibilidade) | A cada rental/move-out | `900` (15 min) |
| Amenities, descriptions | Quase nunca | `86400` (24h) |

### Como funciona

```
Usuário acessa /locations/granbury
  → Next.js serve HTML estático do cache (50-100ms)
  → Se cache tem mais de 15 min, regenera em background
  → Próximo visitante recebe a versão atualizada
  → API da Tenant chamada: 1x a cada 15 min, não 1x por visitante
```

### Se a API da Tenant cair

O site continua funcionando com o último cache válido. O ISR do Next.js serve a versão stale até conseguir revalidar. Nenhum downtime para o usuário final.

### Quando escalar para sync job (futuro, se necessário)

Se o volume crescer para 50k+/dia com múltiplas properties e necessidade de near-real-time, migrar para:
- Cron job a cada 15 min puxa tudo da API
- Salva num banco local (Postgres ou JSON na edge)
- Site lê do banco — zero chamadas à Tenant no runtime
- Premature optimization agora; ISR resolve para o lançamento.

---

## 2. Autenticação

Custom header-based auth (não OAuth, não Bearer):

```
X-Storageapi-Key: {{api_key}}
X-Storageapi-Date: {{current_epoch_timestamp}}
Content-Type: application/json  (POST/PUT)
```

**URL pattern**: `{base_url}/{app_id}/v2/companies/{company_id}/{resource}`

- **Base URL**: `https://prod.edge.tenant.dev/api/v3/applications/`
- **App ID**: `appc02fcbc01b5e41818669077c87c01e7f` (constante)
- **API version**: `v2` (v1 das Postman Collections antigas está deprecated)
- **Company ID**: `kQoBXpBpnx`
- **API Key**: armazenada em `.env.local` (nunca commitada)

**Credenciais NUNCA vão para o client-side.** Todas as chamadas passam por API routes server-side ou server components do Next.js.

---

## 3. Endpoints utilizados

### Read (para o frontend)

| Endpoint | Propósito | Testado |
|---|---|---|
| `GET /properties` | Listar locations da Journey | ✅ |
| `GET /properties/{id}` | Detalhes de uma property | Disponível |
| `GET /properties/{id}/units?limit=N&concise=true` | Listar units com preço/tamanho | ✅ |
| `GET /units/{id}` | Detalhes de um unit | Disponível |
| `GET /categories/list` | Categorias para filtros | ✅ |

### Write (para o futuro, se necessário)

| Endpoint | Propósito |
|---|---|
| `POST /units/{id}/hold` | Segurar unit (gera hold_token) |
| `POST /units/{id}/reserve` | Criar reserva |
| `POST /units/{id}/lease` | Criar lease completo (com payment) |
| `POST /leads` | Capturar lead de interesse |

---

## 4. Response structure

A API da Tenant envelopa toda resposta assim:

```json
{
  "message": "success",
  "applicationData": {
    "APP_ID": [{
      "status": 200,
      "data": { /* dados reais aqui */ },
      "message": ""
    }]
  },
  "meta": { "requestId": "..." }
}
```

O client em `lib/tenant-api.ts` já faz o unwrap automaticamente.

---

## 5. Campos do Unit (confirmados da API)

```
id, number, floor, type, description
price, set_rate, default_price
width, length, height
state, available_date, featured
category_id, space_mix_id, product_id
Category: { id, name, description, unit_type }
Amenities: { "Space Features": [{ name, value }], ... }
  → Climate Control, Door, Power Outlet, Humidity Control, Drive Up Access
Promotions: []
Lease: { id, start_date, rent, status, Tenants: [...] } | null
```

Se `Lease` é `null` ou objeto vazio → unit está disponível.

---

## 6. Checkout — SuperLease (Tenant)

O checkout é 100% responsabilidade da Tenant. A Journey nunca toca em dados de pagamento.

**Fluxo**: "Rent Now" no site da Journey → redireciona para a Mariposa da facility (storagefront.com) → usuário completa o rental via SuperLease.

O campo `landing_page` do property retorna o domínio Mariposa (ex: `www.tenantv2-prod.storagefront.com`). O botão "Rent Now" abre `https://{landing_page}` em nova aba.

**Deep-link direto para unit específico**: não documentado publicamente. O checkout SuperLease é SPA client-side. Para o MVP, redirecionar para a facility page é suficiente.

---

## 7. Postman Collections (referência)

4 collections no Google Drive com endpoints reais (originalmente v1, precisam ser atualizados para v2):

- `Call_Center_Collection.json` — mais completo: units, leases, reservations, leads, payments
- `Revenue_Management_API.json` — properties, units, rate management
- `Lein_Management.json` — invoices, payments, tenants
- `Space Groups.json` — endpoint único de space groups

Localização: Google Drive → VSHUB → Operação → Journey.Storage → API → Tenant.dev → Postman Collections

---

## 8. Test Environment

- Property de teste: "UCI Storage" (Los Angeles)
- Property ID: `85B73ubBGy`
- 5845 units, ~77% occupancy
- Dev portal: https://www.tenant.dev (Journey tem credenciais)
- Documentação detalhada (data models) atrás de login no portal
