# SparkGPT — AI Agent with Tools

A ReAct agent that reasons step by step using web search, Wikipedia, and calculator tools. Built with LangChain + LangGraph + Mistral for fast inference, exposed via FastAPI, visualized with React.

## Live Demo

- **App**: https://sparkgpt-opal.vercel.app
- **API**: https://sparkgpt-api.vercel.app

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   React Frontend                     │
│  Chat UI → Reasoning Trace → Final Answer            │
└──────────────────────┬──────────────────────────────┘
                       │ POST /api/agent/run
┌──────────────────────▼──────────────────────────────┐
│                  FastAPI Backend                      │
│  ┌─────────────────────────────────────────────┐    │
│  │         ReAct Agent (LangGraph)              │    │
│  │     Mistral LLM (ministral-3b) + Tools     │    │
│  │  ┌──────────┬──────────┬──────────────┐     │    │
│  │  │ Tavily   │ Wikipedia│  Calculator  │     │    │
│  │  │ Search   │          │              │     │    │
│  │  └──────────┴──────────┴──────────────┘     │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer    | Tech                                    |
| -------- | ---------------------------------------- |
| Backend  | Python, FastAPI, LangChain, LangGraph   |
| LLM      | Mistral (ministral-3b-latest, via `MISTRAL_MODEL`) |
| Tools    | Tavily Search (optional), Wikipedia, Calculator |
| Frontend | React, TypeScript, Tailwind CSS         |
| Deploy   | Vercel                                   |

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- [Mistral API key](https://console.mistral.ai) (free tier works; default model `ministral-3b-latest`)
- [Tavily API key](https://tavily.com) (optional — only needed for web search; app runs without it with Wikipedia + Calculator)

### Backend

```bash
pip install -r requirements.txt
# Create .env in repo root:
# MISTRAL_API_KEY=...
# MISTRAL_MODEL=ministral-3b-latest
# TAVILY_API_KEY=... (optional)
uvicorn api.index:app --reload
```

API docs at http://localhost:8000/docs

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

App at http://localhost:5173

## API Endpoints

| Method | Endpoint          | Description          |
| ------ | ----------------- | -------------------- |
| POST   | /api/agent/run    | Run agent with query |
| GET    | /api/examples     | Get example queries  |
| GET    | /                 | API status            |
| GET    | /health           | Health check          |

## Environment Variables

### Backend (.env)
```
MISTRAL_API_KEY=...
MISTRAL_MODEL=ministral-3b-latest
TAVILY_API_KEY=tvly-... (optional — web search disabled if missing)
```

### Frontend (.env)
```
VITE_API_URL=<your-backend-url>
```

## Deploy to Vercel

### Backend (API)
1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your repo — Vercel auto-detects Python
4. Add environment variables:
   - `MISTRAL_API_KEY` = your Mistral key
   - `MISTRAL_MODEL` = `ministral-3b-latest` (or `mistral-small-latest` / `mistral-medium-latest`)
   - `TAVILY_API_KEY` = your Tavily key (optional)
5. Deploy

### Frontend (Static Site)
1. Go to vercel.com → New Project → Import same repo
2. Settings:
   - **Root Directory**: `frontend`
3. Add environment variable:
   - `VITE_API_URL` = your backend URL (e.g. `https://sparkgpt-api.vercel.app`)
4. Deploy

## License

MIT

## Author

**Amimul Ahsan** - [GitHub](https://github.com/itsaahsan)
