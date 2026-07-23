# SparkGPT — AI Agent with Tools

A ReAct agent that reasons step by step using web search, Wikipedia, and calculator tools. Built with LangChain + LangGraph + Groq for fast inference, exposed via FastAPI, visualized with React.

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
│  │       Groq LLM (Llama-3.3-70B) + Tools      │    │
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
| LLM      | Groq (Llama-3.3-70B) — free tier        |
| Tools    | Tavily Search, Wikipedia, Calculator    |
| Frontend | React, TypeScript, Tailwind CSS         |
| Deploy   | Vercel                                   |

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- [Groq API key](https://console.groq.com) (free)
- [Tavily API key](https://tavily.com) (free)

### Backend

```bash
cp .env.example .env
# Add your API keys to .env
pip install -r requirements.txt
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
GROQ_API_KEY=gsk_...
TAVILY_API_KEY=tvly-...
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
   - `GROQ_API_KEY` = your Groq key
   - `TAVILY_API_KEY` = your Tavily key
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
