# SparkGPT — AI Agent with Tools

A ReAct agent that reasons step by step using web search, Wikipedia, and calculator tools. Built with LangChain + LangGraph + Groq for fast inference, exposed via FastAPI, visualized with React.

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
│  │       Groq LLM (Qwen3-32B) + Tools          │    │
│  │  ┌──────────┬──────────┬──────────────┐     │    │
│  │  │ Tavily   │ Wikipedia│  Calculator  │     │    │
│  │  │ Search   │          │              │     │    │
│  │  └──────────┴──────────┴──────────────┘     │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer    | Tech                                    |
| -------- | --------------------------------------- |
| Backend  | Python, FastAPI, LangChain, LangGraph   |
| LLM      | Groq (Qwen3-32B) — free tier            |
| Tools    | Tavily Search, Wikipedia, Calculator    |
| Frontend | React, TypeScript, Tailwind CSS         |
| Deploy   | Render (both frontend & backend)        |

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- [Groq API key](https://console.groq.com) (free)
- [Tavily API key](https://tavily.com) (free)

### Backend

```bash
cd backend
cp .env.example .env
# Add your API keys to .env
pip install -r requirements.txt
uvicorn main:app --reload
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
| GET    | /                 | API status           |
| GET    | /health           | Health check         |

## Environment Variables

### Backend (.env)
```
GROQ_API_KEY=gsk_...
TAVILY_API_KEY=tvly-...
```

### Frontend (.env)
```
VITE_API_URL=<your-backend-url>/api
```

## Deploy to Render

### Backend (Web Service)
1. Push to GitHub
2. Go to Render → New Web Service
3. Connect your repo
4. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables:
   - `GROQ_API_KEY` = your Groq key
   - `TAVILY_API_KEY` = your Tavily key
   - `PYTHON_VERSION` = `3.11`
6. Deploy

### Frontend (Static Site)
1. Go to Render → New Static Site
2. Connect same repo
3. Settings:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Add environment variable:
   - `VITE_API_URL` = `https://your-backend-name.onrender.com/api`
5. Deploy

### After Deploy
- Add UptimeRobot ping to backend URL to prevent sleep
- Update frontend `VITE_API_URL` with actual backend URL
