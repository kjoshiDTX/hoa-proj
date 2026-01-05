from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from rag.retrieve import retrieve_context
from rag.generate import generate_answer_stream

router = APIRouter()

class ChatRequest(BaseModel):
    sessionId: str
    message: str

@router.post("/chat")
async def chat_endpoint(request: ChatRequest):
    # 1. Retrieve
    # Sync function, but fast enough (local DB). 
    # If slow, should be async or threadpool, but for MVP local Chroma it's fine.
    try:
        results = retrieve_context(request.message)
    except Exception as e:
        print(f"Retrieval Error: {e}")
        results = {}

    # 2. Generate (Streaming)
    return StreamingResponse(
        generate_answer_stream(request.message, results),
        media_type="application/x-ndjson"
    )
