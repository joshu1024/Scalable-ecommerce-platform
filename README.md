# 👟 SneakerZone — Full-Stack E-Commerce App + AI Features

A production-ready full-stack ecommerce platform built with React, Redux Toolkit, Node.js, Express, PostgreSQL, and Prisma. Features JWT authentication, PayPal payments, Cloudinary image uploads, a full Admin Dashboard, and an AI-powered shopping assistant built with Groq and Llama 3.1.

![React](https://img.shields.io/badge/Frontend-React-blue)
![Node](https://img.shields.io/badge/Backend-Node.js-green)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791)
![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748)
![Groq](https://img.shields.io/badge/AI-Groq%20%2F%20Llama%203.1-orange)
![Cohere](https://img.shields.io/badge/Embeddings-Cohere-purple)
![License](https://img.shields.io/github/license/joshu1024/sneakerzone)

---

## 🌐 Live Demo

- 🛍️ **Frontend (Vercel)** → [sneakerzone.vercel.app](https://mern-ecommerce-26w1-git-main-joes-projects-50075601.vercel.app/)
- ⚙️ **Backend (Render)** → [sneakerzone-api.onrender.com](https://mern-ecommerce-4ahr.onrender.com/)

---

## 🤖 AI Features

This project is being progressively upgraded with AI capabilities as part of a fullstack AI engineer learning roadmap — this is the differentiator, so it's worth reading first.

### ✅ Completed

| Feature | Description | Tech |
|---------|-------------|------|
| AI Chat Endpoint | Natural language shopping assistant with conversation history, assistant role, and few-shot prompting | Groq / Llama 3.1 |
| AI Product Description Generator | Generates title, description, bullet points, and SEO tags from product data. Returns validated JSON. | Groq / Llama 3.1 + Zod |
| Streaming Chat Widget | Word-by-word streaming response in the storefront UI with blinking cursor and stop functionality | Groq / Llama 3.1 + SSE |
| Natural Language Product Search | AI detects product queries, searches real PostgreSQL database via Prisma, and streams results word by word | Groq / Llama 3.1 + Tool use + SSE |
| AI Security Layer | Rate limiting per IP, prompt injection detection, output moderation, input sanitisation | express-rate-limit + custom middleware |
| Per-user Token Quota | Tracks AI token usage per user per month in Prisma with automatic monthly reset | Prisma + PostgreSQL |
| AI Usage Dashboard API | Admin panel showing total calls, tokens used, estimated cost, and per-user breakdown | Prisma aggregation |
| Retry + Error Handling | Exponential backoff on Groq API failures — app never crashes when AI is unavailable | Custom retry utility |
| pgvector Embeddings | All 17 products embedded with Cohere embed-english-v3.0 model. Stored in PostgreSQL with HNSW index for fast cosine similarity search | Cohere + pgvector + Prisma |
| Semantic Product Search | Natural language search using Cohere embeddings + pgvector. "Something for a teenager who likes running" returns relevant results by meaning not keywords | Cohere + pgvector + HNSW |

### 🔜 Coming Soon

| Feature | Description |
|---------|-------------|
| Document Q&A | Continuing on Analytics Dashboard project — upload docs, query in natural language |
| Shopping Agent | Standalone agent project — Phase 3 |

### 🗺️ AI Roadmap

- ✅ **Phase 1** — AI integration fundamentals (Groq API, prompt engineering, streaming, function calling, security)
- ✅ **Phase 2 (partial)** — pgvector semantic search (embeddings, HNSW index, cosine similarity)
- 🔜 **Phase 2 (full RAG)** — Continues on Analytics Dashboard project (document Q&A, RAG pipeline)
- 🔜 **Phase 3** — Agents (standalone project — autonomous agent with LangGraph/Mastra)
- 🔜 **Phase 4** — Production AI (LangSmith tracing, evals, cost optimisation)

### 🔌 AI Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/chat/prompt` | Shopping assistant with conversation history and few-shot prompting | Public |
| POST | `/api/chat/stream` | Streaming assistant with SSE, tool use, output moderation, and token tracking | Protected |
| POST | `/api/chat/generate-description` | Generate structured product description from product fields | Admin only |
| POST | `/api/chat/tools` | Non-streaming assistant with tool use and product/order lookup | Protected |
| GET | `/api/admin/ai-stats` | Total tokens, estimated cost, and per-user AI usage breakdown | Admin only |

### 🔒 AI Security

| Layer | Implementation |
|-------|----------------|
| Rate limiting | 20 requests per 15 minutes per IP across all AI endpoints |
| Token quota | 50,000 tokens per user per month — resets automatically |
| Input validation | Length limits + prompt injection pattern detection |
| Output moderation | Full response scanned before delivery — harmful content replaced |
| Tool call scoping | AI can never access another user's orders even if prompt-manipulated |
| API key security | Keys in .env only — never exposed to client |

### 💡 Architectural Decisions

| Decision | Why |
|----------|-----|
| Groq over OpenAI for chat | Free tier, faster inference (800 tokens/sec), same API shape |
| Cohere over OpenAI for embeddings | Free tier (1000 calls/month), no credit card, 1024-dim vectors |
| pgvector over Pinecone | Already running PostgreSQL — no new service, no extra cost. Handles current scale (<100k vectors) with HNSW indexing |
| Recursive chunking (Phase 2) | Preserves semantic boundaries better than fixed-size — splits on paragraphs → sentences → words |
| Separate ProductEmbedding model | Prisma doesn't support vector type natively — keeps Product model clean and all existing queries untouched |

### 📊 Example Requests

**Streaming Chat:**
```json
POST /api/chat/stream
{
  "messages": [
    { "role": "user", "content": "show me Nike shoes under $60" }
  ]
}
```
