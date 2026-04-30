# ETF RAG App

A conversational research tool for ASX-listed ETFs. Ask natural language questions about ETFs — compare performance, filter by region or cost, or explore the market — and get answers grounded in real ASX monthly report data.

Built as a demonstration of production-grade RAG architecture with a focus on the specific challenges of financial document retrieval.

---

## Architecture

The app uses a dual-agent architecture with tool-calling LLMs backed by a hybrid retrieval system.

**Agents**
- **Cloud agent** — Gemini via Google AI, used when the service is publicly accessible
- **Local agent** — Gemma 4 4B via llama.cpp on a dedicated GPU, used for private/offline operation

Both agents share the same tool definitions and system prompt. The local agent demonstrates that the system can run entirely self-hosted with no external API dependencies.

**Retrieval**

Rather than routing all queries through vector search, the app uses two distinct retrieval strategies based on query type:

- **Semantic search** — pgvector with nomic-embed-text embeddings for qualitative queries like "high yield ETFs" or "low risk options"
- **Structured filtering** — direct SQL for queries with explicit criteria: region, category, MER thresholds, performance ranking

This separation exists because financial data is poorly suited to pure semantic retrieval — ticker codes, fund names, and numeric fields have no meaningful semantic similarity. A query like "US ETFs under 0.2% MER" is better answered by `WHERE region = 'usa' AND mer_pa <= 0.2` than by vector search.

Region is classified by a deterministic keyword classifier over fund names and ASX codes rather than embedding-based inference, which proved unreliable on the formulaic language of ASX monthly reports.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | SvelteKit |
| Backend | FastAPI |
| LLM orchestration | LangChain |
| Cloud LLM | Gemini (Google AI) |
| Local LLM | Gemma 4 4B via llama.cpp |
| Embeddings | nomic-embed-text (self-hosted) |
| Vector store | pgvector (PostgreSQL) |
| Database | PostgreSQL |
| Gateway | nginx |
| Containerisation | Docker |

---

## Data

Source: ASX monthly ETF reports (publicly available at asx.com.au).

Each ETF is embedded as enriched text combining fund metadata and numeric fields — MER, FUM, returns across 1/3/5 year periods, distribution yield, liquidity, and spread. Raw report text is not embedded directly due to its formulaic, low-variation language which produces poor semantic differentiation between funds.

---

## Known Limitations

- **Regional filtering accuracy** — region is inferred from fund names and ASX codes via keyword classification, not sourced from a structured data field. Coverage is high for major funds but edge cases exist.
- **Semantic search on financial text** — nomic-embed-text is a general-purpose model. Domain-specific embeddings or hybrid BM25 + semantic search would improve retrieval quality.
- **Data freshness** — reflects the most recently ingested ASX monthly report, not updated in real time.
- **Local agent availability** — the local Gemma agent runs on a personal GPU and is not guaranteed to be online.

---

## Potential Applications

While built as a demonstration, the architecture is applicable to:

- ETF screening tools for retail investors
- Research assistants for financial advisers
- Internal tools for fund issuers monitoring competitive positioning

---

## Access

The demo is available at [your-url] by invitation. Contact [your-email] for access.
