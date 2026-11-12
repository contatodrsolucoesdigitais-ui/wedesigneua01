---
name: simulador-de-oferta
description: Simulador de público para validar ofertas antes de gastar (estilo MiroFish, sem dependências externas). Use quando o usuário pedir para "simular", "testar com personas", "ver como o público reage", "validar oferta antes de anunciar", "quais objeções vão aparecer", "qual ângulo/preço/headline funciona melhor" ou comparar versões de uma oferta, anúncio, landing page ou preço. Cria personas realistas do público-alvo (incluindo céticos e indiferentes), simula a reação ao anúncio, a conversa no WhatsApp e a decisão de compra, e entrega um relatório com funil simulado, objeções ranqueadas, melhor ângulo, faixa de preço aceita e o plano de teste real.
---

# Simulador de oferta

Você simula **como um público real reagiria** a uma oferta, criando personas que pensam, duvidam e decidem
como clientes de verdade. Responda em português do Brasil. Falas das personas no idioma e no jeito de falar
do público (gíria regional, nível de formalidade, erros comuns de digitação no WhatsApp).

Leia antes de rodar: `references/protocolo.md` (passo a passo e calibração) e
`references/modelo-relatorio.md` (formato da entrega).

---

## Regras que não se quebram

1. **Tudo que sai daqui é [simulação].** Hipótese para afiar a oferta, nunca prova de que vende. Diga isso
   no topo do relatório e no fim.
2. **Não seja otimista.** IA tende a gostar de tudo. Siga a distribuição de calibração do protocolo:
   em tráfego frio, a maioria ignora ou desconfia. Se mais de 30% das personas "comprariam" num público
   frio, o resultado está inflado — refaça com mais ceticismo.
3. **Personas são pessoas, não fãs.** Cada uma tem orçamento, pressa, experiências ruins, alternativas
   (fazer nada, concorrente, fazer sozinho) e um motivo concreto para dizer não.
4. **Independência.** Ao simular cada persona, ela não sabe o que as outras disseram (exceto na rodada
   social, que é explícita). Se a ferramenta Agent estiver disponível **e o usuário pedir** mais
   independência, rode as personas em lotes de subagentes; caso contrário, simule em sequência,
   escrevendo a reação de cada uma antes de ler a próxima.
5. **Não invente dados de mercado.** Números de mercado só com fonte; o resto é [estimativa] ou [AJUSTE].
6. **Sempre termine com o teste real** que confirmaria ou derrubaria o que a simulação sugeriu.

---

## Entrada mínima

Extraia do material do usuário; pergunte só o que faltar (máximo 4 perguntas, de uma vez):

| Item | Exemplo |
|---|---|
| A oferta | o que é, preço, condições, garantia |
| O material | texto do anúncio, roteiro do vídeo, página, mensagem de abordagem |
| O público | quem, onde (cidade/região), tamanho do negócio ou perfil de renda |
| O canal | anúncio frio, abordagem de SDR, indicação, orgânico |
| O que comparar (opcional) | versão A × B de preço, headline, ângulo ou oferta |

Sem resposta, siga com suposições marcadas [AJUSTE].

---

## Como rodar (resumo — detalhes no protocolo)

1. **Segmentar o público** em 3 a 6 segmentos com peso (% do público), nível de consciência e principais
   dores/medos.
2. **Criar personas**: padrão 20 (rápido) ou 40 (completo), distribuídas pelos pesos dos segmentos e pela
   distribuição de calibração.
3. **Rodada 1 — Rolagem (3 segundos):** a persona vê o criativo/primeira linha no meio do feed. Para ou
   passa? O que pensou em uma frase.
4. **Rodada 2 — Leitura:** quem parou lê a oferta inteira. Reação, dúvida principal, clicaria/chamaria?
5. **Rodada 3 — Conversa:** quem chamou conversa com o vendedor (use a mensagem padrão do usuário, se
   houver). Simule 3 a 6 trocas reais de WhatsApp até a decisão: compra / vai pensar / não compra, com o
   motivo real.
6. **Rodada 4 — Preço:** para todas as personas que leram, as 4 perguntas de percepção de preço do
   protocolo (barato demais, barato, caro, caro demais).
7. **Rodada social (opcional):** as personas veem os comentários umas das outras num post do anúncio;
   registre como objeções se espalham ou se dissolvem.
8. **Variantes:** se houver A × B, rode as mesmas personas nas duas versões e compare.
9. **Consolidar e recomendar** no formato de `references/modelo-relatorio.md`.

---

## Entrega

- **Pedido rápido** ("simula rapidinho"): 20 personas, rodadas 1 a 3, relatório resumido no chat.
- **Simulação completa**: 40 personas, todas as rodadas; salve em
  `pesquisa/<nome-da-oferta>/simulacao-<data>.md` se estiver num repositório e resuma no chat.
- Mostre **trechos de fala** das personas (é o que dá vida ao relatório), mas sempre com a contagem ao lado.
- Termine com **"Próximo passo"**: o teste real mais barato que confirma o principal achado.

## Depois do teste real

Se o usuário trouxer resultados reais, compare com a simulação: o que ela acertou, o que errou, e ajuste a
calibração para o próximo uso naquele nicho (registre em `references/calibracao-nichos.md`).
