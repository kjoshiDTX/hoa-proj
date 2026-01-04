from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from rag.retrieve import retrieve_context
from rag.generate import generate_answer

router = APIRouter()

class ChatRequest(BaseModel):
    sessionId: str
    message: str

class ChatResponse(BaseModel):
    answer: str
    citations: List[str]
    confidence: Optional[float] = None

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        # 1. Retrieve
        results = retrieve_context(request.message)
        
        # 2. Check if retrieval got anything (Guardrail)
        if not results or not results['documents'] or len(results['documents'][0]) == 0:
             return ChatResponse(
                 answer="I could not find any relevant information in the rulebook to answer your question.",
                 citations=[]
             )

        # 3. Generate
        answer, citations = generate_answer(request.message, results)
        
        # 4. Log interaction (Placeholder for logging logic)
        print(f"Query: {request.message} | Answer: {answer}")
        
        return ChatResponse(
            answer=answer,
            citations=citations
        )
        
    except Exception as e:
        print(f"Error processing chat request: {e}")
        raise HTTPException(status_code=500, detail=str(e))
