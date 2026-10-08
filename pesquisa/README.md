# Pesquisa de mercado com MiroFish — Agency DR

Objetivo: antes de gastar com anúncio, simular como donos de empreiteiras e oficinas do Mississippi reagem à
oferta (preço, promessa, objeções) e sair com 2 ou 3 versões para validar com dinheiro real.

| Arquivo | Para que serve |
|---|---|
| `semente-empreiteiras.md` | Documento semente do nicho empreiteiras — sobe no MiroFish |
| `semente-oficinas.md` | Documento semente do nicho oficinas — sobe no MiroFish |
| `analise-oferta.md` | Análise com frameworks (Hormozi, Schwartz, preço, objeções), pesquisa de concorrentes, entrevistas simuladas e conceitos de anúncio — **comece por aqui** |
| este README | Instalação, perguntas de previsão, plano de testes e planilha de comparação |

As sementes estão em **inglês** de propósito: o público simulado é americano e a copy testada é em inglês.
Se os agentes lerem a copy traduzida, vão reagir a outro texto. O relatório você pode pedir em português (ver abaixo).

---

## 0. Antes de rodar: preencha os `[AJUSTE]`

Nas duas sementes, troque:

1. **Preço**: já preenchido com a variante A da análise (US$ 0 + US$ 149/mês, sem contrato). Troque se o seu preço
   real for outro.
2. **Onde a equipe está de verdade.** O telefone é (316), código de Wichita, Kansas, e o FAQ diz "working across
   Mississippi". Um dono desconfiado percebe isso. Se a semente esconder, a simulação não testa essa objeção — e ela
   provavelmente é uma das que mais pesam no mundo real.
3. **O anúncio** que você vai rodar de fato (deixei um rascunho em cada semente; conceitos na seção 7 da análise).
4. Os concorrentes já vêm com preços pesquisados (fontes na análise); os marcados *(approx.)* são estimativas.

Formatos aceitos pelo MiroFish: `.md`, `.txt`, `.pdf`. Rode **um nicho por simulação** — misturar os dois
gera personas híbridas que não existem.

---

## 1. Instalação (no seu computador)

Pré-requisitos: Node.js 18+, Python **3.11 ou 3.12** (3.13 não serve), `uv` (`pip install uv`), Git.
Ou só Docker.

```bash
git clone https://github.com/666ghj/MiroFish.git
cd MiroFish
cp .env.example .env        # Windows: copy .env.example .env
```

No `.env`:

```
LLM_API_KEY=sua_chave
LLM_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
LLM_MODEL_NAME=qwen-plus
ZEP_API_KEY=sua_chave_zep
```

Qualquer API no formato OpenAI serve (OpenAI, DeepSeek, OpenRouter — troque `LLM_BASE_URL` e `LLM_MODEL_NAME`).
Chave do Zep em app.getzep.com (plano gratuito basta). **Não** preencha as linhas `LLM_BOOST_*` se não for usar:
o próprio `.env.example` avisa que elas não devem existir no arquivo nesse caso.

```bash
npm run setup:all
npm run dev                 # ou: docker compose up -d
```

Abra http://localhost:3000. Comece com **menos de 40 rodadas** — o consumo de tokens é alto.

---

## 2. O que o MiroFish simula (e o que não simula)

O motor por baixo é o OASIS: os agentes vivem numa **rede social simulada** (estilo Twitter/Reddit), postam,
comentam e influenciam uns aos outros. Ou seja, ele simula a *conversa* sobre a sua oferta, não uma reunião de
venda. Por isso as perguntas abaixo enquadram o cenário como "o anúncio apareceu num grupo de donos de negócio".

---

## 3. Perguntas de previsão (cole no campo de previsão)

### Rodada 1 — diagnóstico geral (rode primeiro, nos dois nichos)

```
Simulate how Mississippi [contractors / auto repair shop owners] react when Agency DR's Facebook ad and landing page
circulate in local business-owner Facebook groups over two weeks. The offer is [$X setup + $Y/month, contract terms].
1) Which profiles would ask for the free mockup, which would ignore it, and which would reject it — and why?
2) What are the most frequent objections, ranked by how often they come up?
3) Which message angle generates the most interest: losing jobs to a search, "you don't have to do anything",
   "we don't disappear like the last guy", or the free mockup?
4) What would make the rejectors change their mind?
5) Does anyone question where the company is located or whether it's legit? How does that spread?
Write the final report in Brazilian Portuguese.
```

### Rodada 2 — preço (mesma semente, muda só o preço)

Rode 3 vezes, trocando só o preço no `[AJUSTE]` da semente. Sugestão de variantes:

| Variante | Setup | Mensal | Contrato |
|---|---|---|---|
| A | $0 | $149 | mês a mês |
| B | $497 | $97 | 12 meses |
| C | $0 | $197 | mês a mês, 1º mês grátis |

```
Same scenario. The price is now [VARIANT]. How does the share of profiles willing to request the mockup change
compared to the previous price? Which profile is most price-sensitive and at what point do they drop out?
Write the report in Brazilian Portuguese.
```

### Rodada 3 — promessa (muda só a headline do anúncio)

Teste 2 ou 3 headlines, uma por simulação. Exemplos:

- Empreiteiras: "Your next job is being searched for right now." × "Stop paying Angi for leads you share with
  three other guys." × "Storm chasers have websites. You should too."
- Oficinas: "Somebody's check engine light just came on." × "Who fills your bays next February?" ×
  "Better reviews, fewer cars. Here's why."

---

## 4. Lendo o resultado

- **Use o relatório para mapear objeções e ângulos de copy**, não para prever taxa de conversão. Os números que o
  modelo der são opinião de LLM, não estatística.
- **Converse com os agentes que rejeitaram.** Perguntas que funcionam:
  - "What would I have to show you for you to request the mockup?"
  - "What price would feel like a no-brainer? What price is an automatic no?"
  - "Did anything on the page make you trust us less?"
- Desconfie de consenso fácil. Se todo mundo "adorou", a semente está rasa ou otimista demais — volte e deixe as
  objeções mais fortes.

### Planilha de comparação (preencha a cada simulação)

| # | Nicho | Variante (preço / headline) | Perfis que pediriam o mockup | Top 3 objeções | Ângulo mais forte | Observação |
|---|---|---|---|---|---|---|
| 1 | | | | | | |
| 2 | | | | | | |
| 3 | | | | | | |

---

## 5. Validação com dinheiro real

A simulação só gera hipóteses. A prova é o anúncio:

1. Pegue as 2 melhores variantes da simulação.
2. Meta Ads, R$ 100–300 (ou US$ 20–60) por variante, segmentando donos de negócio no Mississippi.
3. Os leads já caem no `/painel` deste projeto. Use os status (novo → ligado → reunião → fechado / perdido) e
   anote na linha de cada lead qual variante trouxe e qual objeção apareceu na ligação.
4. Compare com a planilha acima: as objeções reais batem com as simuladas? Se não, ajuste a semente e rode de novo.
