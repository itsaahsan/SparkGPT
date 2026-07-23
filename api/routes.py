from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from agent.agent import run_agent
from agent.prompts import EXAMPLE_QUERIES

router = APIRouter()


class QueryRequest(BaseModel):
    query: str


class QueryResponse(BaseModel):
    steps: list
    answer: str


@router.post("/agent/run", response_model=QueryResponse)
async def run(req: QueryRequest):
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    try:
        result = run_agent(req.query)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/examples")
async def get_examples():
    return {"examples": EXAMPLE_QUERIES}
