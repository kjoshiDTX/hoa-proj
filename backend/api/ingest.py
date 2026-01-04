from fastapi import APIRouter, UploadFile, File, HTTPException
import shutil
import os
from rag.ingest import ingest_pdf

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/ingest")
async def ingest_file(file: UploadFile = File(...)):
    try:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Trigger ingestion
        num_chunks = ingest_pdf(file_path)
        
        return {
            "status": "success", 
            "message": f"Successfully ingested {file.filename}",
            "chunks_processed": num_chunks
        }
        
    except Exception as e:
        print(f"Error ingesting file: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Cleanup uploaded file if needed, or keep for record
        # os.remove(file_path) 
        pass
