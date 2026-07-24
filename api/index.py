from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="SparkGPT API",
    description="AI Agent with Tools — ReAct agent powered by LangChain + Groq",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

FAVICON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none"><defs><linearGradient id="bg" x1="0" y1="0" x2="48" y2="48"><stop offset="0%" stop-color="#14b8a6"/><stop offset="50%" stop-color="#22d3ee"/><stop offset="100%" stop-color="#67e8f9"/></linearGradient><linearGradient id="robot" x1="12" y1="12" x2="36" y2="36"><stop offset="0%" stop-color="#ccfbf1"/><stop offset="100%" stop-color="#99f6e4"/></linearGradient></defs><rect width="48" height="48" rx="12" fill="url(#bg)"/><g transform="translate(10, 8)"><rect x="4" y="12" width="20" height="16" rx="4" fill="url(#robot)" opacity="0.95"/><rect x="8" y="4" width="12" height="10" rx="3" fill="url(#robot)" opacity="0.95"/><circle cx="11" cy="9" r="2" fill="#14b8a6"/><circle cx="19" cy="9" r="2" fill="#22d3ee"/><line x1="12" y1="28" x2="12" y2="34" stroke="url(#robot)" stroke-width="2.5" stroke-linecap="round"/><line x1="16" y1="28" x2="16" y2="34" stroke="url(#robot)" stroke-width="2.5" stroke-linecap="round"/><line x1="20" y1="28" x2="20" y2="34" stroke="url(#robot)" stroke-width="2.5" stroke-linecap="round"/><rect x="-1" y="16" width="5" height="3" rx="1.5" fill="url(#robot)" opacity="0.8"/><rect x="22" y="16" width="5" height="3" rx="1.5" fill="url(#robot)" opacity="0.8"/><line x1="10" y1="17" x2="6" y2="17.5" stroke="url(#robot)" stroke-width="2" stroke-linecap="round"/><line x1="18" y1="17" x2="22" y2="17.5" stroke="url(#robot)" stroke-width="2" stroke-linecap="round"/></g></svg>'


@app.get("/")
async def root():
    return {"message": "SparkGPT API is running"}


@app.head("/")
async def head_root():
    return Response(status_code=200)


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/favicon.ico")
async def favicon():
    return Response(content=FAVICON_SVG, media_type="image/svg+xml")


app.include_router(router, prefix="/api")
