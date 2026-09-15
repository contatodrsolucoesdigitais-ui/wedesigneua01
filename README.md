# WeDesign — landing pages + painel de leads

Cloudflare Pages. Duas páginas públicas, um painel privado e uma API sobre D1.

| Rota | O que é | Acesso |
|---|---|---|
| `/` | Landing — empreiteiras | pública |
| `/auto-shops` | Landing — oficinas | pública |
| `/painel` | Painel de leads | senha |
| `/api/lead` | Recebe o formulário (POST) | pública |
| `/api/leads` | Lê e atualiza leads (GET / PATCH) | header `x-painel-key` |

Sem build. As Functions em `functions/` são detectadas e publicadas pela própria Cloudflare.

---

## Banco de dados — já criado

| | |
|---|---|
| Nome | `wedesign-leads` |
| UUID | `aa6c9b1f-133e-4ff3-8991-2665c2f43daf` |
| Região | ENAM (leste dos EUA) |
| Tabela | `leads`, com índice em `created_at` |

Não precisa rodar migration. Só falta fazer o **binding** no projeto (passo 3 abaixo).

---

## Publicar

### 1. Criar o projeto
`dash.cloudflare.com` → **Workers & Pages → Create → Pages → Connect to Git**

Autorize a conta `contatodrsolucoesdigitais-ui` e escolha **`wedesigneua01`**.

### 2. Build settings
| Campo | Valor |
|---|---|
| Framework preset | **None** |
| Build command | **vazio** |
| Build output directory | **`/`** |

### 3. Binding do D1 — obrigatório
**Settings → Bindings → Add → D1 database**

| | |
|---|---|
| Variable name | **`DB`** — exatamente assim, o código procura por esse nome |
| D1 database | `wedesign-leads` |

Adicione em **Production** e **Preview**.

### 4. Senha do painel — obrigatório
**Settings → Variables and Secrets → Add → Secret**

| | |
|---|---|
| Name | `PANEL_PASSWORD` |
| Value | a senha que você escolher — use algo longo |

Sem ela o `/api/leads` nega tudo e o painel não abre.

### 5. Redeploy
Binding e secret novos só valem em deployment novo. **Deployments → Retry deployment**.

### Opcional — aviso por e-mail a cada lead
Três secrets: `RESEND_API_KEY`, `NOTIFY_EMAIL`, `NOTIFY_FROM`. Sem eles tudo funciona igual, os leads só aparecem no painel.

---

## Testar antes de divulgar

1. Abrir `/` e enviar o formulário com dados de teste
2. Abrir `/painel`, entrar com a senha, confirmar que o lead apareceu
3. Mudar o status e escrever uma anotação — recarregar e ver se persistiu
4. Baixar o CSV

---

## O painel

Login por senha, sessão só na aba. Cinco contadores no topo, filtros por nicho, status editável na linha (novo → ligado → reunião → fechado / perdido), anotação por lead, exportação CSV e recarga automática a cada 60 segundos.

## Se a API cair

O formulário não perde o lead: se `/api/lead` falhar, ele monta um e-mail com os campos preenchidos e abre o cliente do visitante, com `[LEAD]` no assunto.

## Anti-spam

Campo honeypot escondido (`website`) nos dois formulários. Submissão com ele preenchido é descartada em silêncio, com resposta 200 para o bot não perceber.

---

## Pendência

- [ ] Trocar `your town` na resposta do FAQ *"Who are you and where are you out of?"* — último placeholder, nas duas páginas

## Estrutura

```
/
├── index.html          landing — empreiteiras
├── auto-shops.html     landing — oficinas
├── painel.html         painel de leads
├── brand/              logo, favicon e variantes
├── previews/           screenshots dos 10 sites do portfólio
├── functions/api/
│   ├── lead.js         POST público — grava no D1
│   └── leads.js        GET/PATCH autenticado
├── _headers            headers de segurança e cache
└── package.json        sem dependências: as Functions usam só a API da plataforma
```
