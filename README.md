# ETF RAG

Ask plain-English questions about ASX-listed ETFs and get answers grounded in real fund data, not LLM guesswork.

> "Low-cost global ETFs under 0.2% MER"
> "Something like VAS but with a higher yield"
> "Which Asian ETFs have the most FUM?"

Status: **Active**

## Why
Comparing ETFs on the ASX means trawling through a monthly spreadsheet of 300+ funds. General-purpose chatbots answer these questions confidently, but often with stale or invented numbers. ETF RAG answers only from the latest ASX data.

## How it works
```
User ─▶ SvelteKit ─▶ Agent (Llama via Ollama  OR  Gemini 2.5 Flash Lite)
                          │  shared tool definitions
          ┌───────────────┼────────────────────┐
  get_product_filters  get_products_by_filter  get_products_by_semantics
   (valid options)      (SQL: region, MER…)     (pgvector similarity)
                          └──── PostgreSQL + pgvector ◀── monthly ASX ingestion
```

- **Hybrid retrieval.** Hard criteria ("under 0.2% MER", "Asia") become exact SQL filters. Fuzzy intent ("something like VAS") goes to vector search. The agent picks the right tool, or both.
- **One toolset, two models.** The local Llama model and Gemini share the same tool definitions, so the app can run fully self-hosted or switch to a faster cloud model without code changes.
- **Embeddings that tell funds apart.** Fund names are near-identical across providers, so numeric fields (returns, MER, FUM, yield) are combined with the metadata before embedding with `nomic-embed-text`.
- **Monthly ingestion.** The ASX monthly ETF report is downloaded, parsed with Pandas, classified, embedded and upserted automatically.

## Key design decisions
| Decision | Why | Trade-off |
|---|---|---|
| Region is classified by keyword at ingestion, not by the LLM | It's deterministic, free and testable, while an LLM mislabels tickers like `VAS` or `NDQ` | Funds with unusual names need new keywords |
| SQL for structured filters, vectors for the rest | Vector search is poor at exact numeric limits like "MER < 0.2%" | The agent has to choose the right tool, which takes careful tool descriptions |
| Local LLM as an option | No API cost, and queries stay on my own server | Slower, and weaker at multi-step tool calls than Gemini |

## Stack
SvelteKit · FastAPI · PostgreSQL + pgvector · Redis · Ollama · Gemini · Pandas · Docker Compose · nginx · Cloudflare Tunnel

## Run locally
```bash
cp .env.example .env   # add GEMINI_API_KEY, BETTER_AUTH_SECRET
docker compose -f compose.dev.yml up
```

## What I'd improve next
- An evaluation set of questions with expected funds, to measure retrieval accuracy
- Using the LLM as a fallback region classifier when no keyword matches
- Streaming responses
