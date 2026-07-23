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


@app.get("/")
async def root():
    return {"message": "SparkGPT API is running"}


@app.head("/")
async def head_root():
    return Response(status_code=200)


@app.get("/health")
async def health():
    return {"status": "ok"}


app.include_router(router, prefix="/api")
