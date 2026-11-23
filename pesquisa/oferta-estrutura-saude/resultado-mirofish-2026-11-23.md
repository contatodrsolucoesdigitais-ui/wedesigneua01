# Resultado MiroFish — Clínica Cheia (23/11/2026)

> **[simulação]** MiroFish (OASIS) com Groq `openai/gpt-oss-120b` e Zep. Semente: `semente-clinica-cheia.md`.
> 29 agentes · 10 rodadas (o MiroFish planejou 168; limitado a 10 para caber no limite do Groq).

## O que rodou
- Grafo: 64 entidades, 80 relações. 29 perfis gerados.
- Atividade: **24 ações, todas "criar post"** (6 posts iniciais em Twitter e Reddit simulados). **Nenhum comentário,
  curtida ou resposta** entre agentes em 10 rodadas.
- Relatório automático: **falhou** (incompatibilidade de chamada de ferramenta entre o ReportAgent e o modelo do Groq).

## Os posts gerados (sinal útil)
| Agente | Post |
|---|---|
| Gestora de clínica multidisciplinar média (BH) | "Vejo potencial na proposta, mas a ausência de manutenção gera receio de ficar desatualizado. Preciso de garantias de suporte técnico." |
| Terapeuta recém-formada (Niterói) | "Não tenho dinheiro para R$ 1.997 e pretendo usar Canva/Wix. A oferta parece cara para mim." |
| Conselho (CFP) | Alerta: anúncios de clínicas não podem prometer resultado nem usar antes/depois. |
| Agência (DR) | Post de divulgação da oferta. |
| "WhatsApp" e "Connecta ABA" | Posts com números **inventados pela simulação** (ex.: "120 cliques em 48h", "6,5x após a Clínica Cheia") — **descartar**: o case real da Connecta foi de Google Ads, não desta oferta. |

## Leitura
- Sinal fraco (pouca interação), mas **coerente com a simulação do `simulador-de-oferta`**:
  1. "Sem manutenção" gera receio → incluir suporte.
  2. R$ 1.997 é caro para autônomos/recém-formados → não são o público; R$ 1.497 é o teto para pequenas.
  3. Compliance dos conselhos precisa estar no texto.
- O MiroFish simula **conversa em rede social**, não a negociação no WhatsApp; para esta oferta (venda B2B por
  conversa), ele acrescenta pouco além do que já tínhamos.

## Para uma rodada melhor (se valer o custo)
- 30+ rodadas e usar a função de **entrevista** dos agentes (perguntas diretas sobre preço e objeções).
- Trocar o modelo do relatório (ex.: `qwen/qwen3.8-27b`) para evitar a falha de ferramenta.
