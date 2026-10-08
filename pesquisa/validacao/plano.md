# Validação real da oferta: empreiteiras do Mississippi

O objetivo é responder **"alguém paga US$ 149/mês por isso?"** com dinheiro de verdade, em 2 a 3 semanas, gastando
quase nada. A simulação (MiroFish, entrevistas em `analise-oferta.md`) ajuda a afiar as hipóteses, mas só pagamento valida.

Arquivos desta pasta:

| Arquivo | Para que serve |
|---|---|
| `plano.md` | Este plano: metas, rotina e regras de decisão |
| `roteiros.md` | Mensagens e roteiros de ligação em inglês, prontos para usar |
| `planilha-contatos.csv` | Planilha de acompanhamento (abra no Google Sheets ou Excel) |

---

## 1. A hipótese que está sendo testada

> Donos de empreiteiras pequenas (2–15 pessoas) no Mississippi, com site ruim ou sem site, aceitam pagar
> **US$ 0 de setup + US$ 149/mês, sem contrato** por um site gerenciado, depois de ver um mockup grátis.

Três coisas podem dar errado, e o teste precisa dizer **qual**:

1. **O gancho não interessa.** Ninguém pede o mockup. → Problema de mensagem ou de público.
2. **Interessa, mas não confiam.** Pedem o mockup, mas somem na hora de pagar ("quem são vocês?"). → Problema de confiança.
3. **Confiam, mas não pagam esse preço.** → Problema de preço.

---

## 2. Antes de começar (1 dia)

- [ ] **Decidir o que dizer sobre onde a equipe está.** É o `[AJUSTE]` da semente. Recomendo ser direto:
      "small remote team; here are the Mississippi contractors we already run sites for — call them". No mundo real,
      esconder isso aparece na primeira ligação.
- [ ] **Pedir a 2 ou 3 clientes atuais do MS** (Coastal Contracting, Ambrose etc.) permissão para servirem de
      referência por telefone. É a prova social mais forte para o perfil "Darrell" (ver seção 6 da análise).
- [ ] **Ter um jeito de cobrar** (link do Stripe, PayPal ou fatura) de US$ 149, a primeira mensalidade, cobrada
      quando o dono aprova o mockup e antes de o site ir ao ar.
- [ ] **Preparar um modelo de mockup** que fique pronto em 1 a 2 horas por empresa: nome, cidade, serviços, fotos do
      Facebook/Google dele e botão de ligar. Velocidade importa mais que perfeição.

---

## 3. Montar a lista (2 a 3 horas, de graça)

Use o **Google Maps**, e não base de dados paga. Testei o Vibe Prospecting: dos ~2.400 negócios do ramo no MS, ele
marca ~1.700 como "sem site", mas os dados vêm sujos (distrito de esgoto classificado como HVAC) e sem telefone.
Ele também cobraria ~100 créditos por 100 empresas. Por isso não gastei créditos.

Como fazer:
1. Busque no Maps: `roofing Gulfport MS`, `roofer Biloxi`, `kitchen remodel Madison MS`, `HVAC Hattiesburg`,
   `concrete contractor Southaven` etc. Comece pela **Gulf Coast e pela região de Jackson**, onde já existe portfólio.
2. Anote quem tem **nota boa (4,5+) e 10 a 150 avaliações** e, ao mesmo tempo:
   - **não tem site** (o botão "Website" não aparece), ou
   - tem site **quebrado, antigo ou só uma página do Facebook**.
3. Meta: **100 empresas** na `planilha-contatos.csv`. Priorize telhado e reformas (ticket alto, mais chance de pagar).

Por que nota boa: "suas avaliações são melhores que as do concorrente, mas ele tem site" é o argumento mais
forte e mais concreto da oferta.

---

## 4. Rotina (2 semanas)

| Dia | O quê |
|---|---|
| 1–2 | Lista de 100 pronta. Mockup modelo pronto. |
| 3–7 | Contatar **20 por dia**: ligação primeiro; se não atender, SMS no mesmo dia (roteiros 1 e 2). |
| 3–12 | Quem pedir mockup recebe em até 48 h, com link + ligação de 15 min (roteiro 4). |
| 5–12 | Follow-up: 1 SMS no dia 3 e 1 no dia 7 depois do primeiro contato (roteiro 3). Depois disso, parar. |
| 13–14 | Somar a planilha e aplicar a regra de decisão (seção 6). |

Divida a lista em **dois conceitos de mensagem** (coluna `conceito`), 50 contatos para cada:
- **A, busca perdida:** "your reviews are better than X's, but X has a website and gets the click".
- **B, o cara que sumiu:** "we keep it running; if we stop answering, you stop paying".

Assim, além de saber se vende, você descobre **qual ângulo usar no anúncio** da etapa seguinte.

**Cuidados legais (EUA):** mande SMS **um por um, manualmente**, nunca por disparador automático. Respeite "STOP"
na hora. Ligue em horário comercial. Contato B2B com empresa costuma ser permitido, mas regras de telemarketing
(TCPA federal e a lei estadual do MS) existem. Se for escalar com automação, confirme antes com quem entende.

---

## 5. O que medir

Preencha a planilha **no mesmo dia** de cada contato. Os números que importam:

| Métrica | Conta |
|---|---|
| Taxa de resposta | responderam ÷ contatados |
| Taxa de mockup | pediram mockup ÷ contatados |
| Taxa de ligação | fizeram a ligação de 15 min ÷ mockups entregues |
| **Taxa de fechamento** | **pagaram ÷ mockups entregues** |
| Objeções | contagem de `objecao_principal`; as 3 mais comuns |

---

## 6. Regra de decisão (depois de 100 contatos)

São pontos de partida *(estimativa minha, não dado de mercado)*. Ajuste se o seu contexto for diferente.

| Resultado | Leitura | Próximo passo |
|---|---|---|
| **2 ou mais pagaram** | **Validado.** Vende a esse preço. | Etapa 3 do plano: anúncio Meta com o conceito que mais gerou mockup. Mais 100 contatos em paralelo. |
| 1 pagou, 5+ pediram mockup | Promissor, mas frágil. | Mais 100 contatos antes de anunciar. Olhe a objeção nº 1 e ajuste a página. |
| 0 pagaram, 5+ pediram mockup | O gancho funciona; o fechamento não. | Ler as objeções: se for **"quem são vocês"** → referências e transparência; se for **preço** → testar US$ 99 ou 1º mês grátis. |
| Menos de 5 pediram mockup | O gancho não interessa a esse público. | Trocar o ângulo ou o ramo (testar oficinas com `semente-oficinas.md`) antes de gastar com anúncio. |

**Pagamento é o único "sim".** "Gostei, vou pensar" conta como não. "Me manda mais informação" também.

---

## 7. Depois

- Os números reais da planilha substituem as suposições da seção 8 de `analise-oferta.md` (CPL, taxa de fechamento).
- Se quiser, rode o MiroFish depois **com as objeções reais** na semente. Aí a simulação passa a testar variações
  (preço, headline) a partir de um ponto de partida verdadeiro.
