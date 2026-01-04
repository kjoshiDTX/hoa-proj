import os
from dotenv import load_dotenv

# Load env vars before imports that depend on them
load_dotenv()

from fastapi import FastAPI
from api.chat import router as chat_router
from api.chat import router as chat_router
from api.ingest import router as ingest_router
from api.documents import router as documents_router

app = FastAPI(title="HOA RAG MVP")

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For MVP, allow all. In prod, restrict to ["http://localhost:8081"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router, prefix="/api")
app.include_router(ingest_router, prefix="/api")
app.include_router(documents_router, prefix="/api")

@app.get("/")
def health_check():
    return {"status": "ok", "message": "RAG Pipeline MVP is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
