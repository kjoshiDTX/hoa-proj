from fastapi import APIRouter, HTTPException
import os
from db.chroma import delete_document_chunks, get_collection

router = APIRouter()

UPLOAD_DIR = "uploads"
# Ensure upload dir exists to avoid listing errors
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("/documents")
def list_documents():
    """List all ingested documents."""
    # Source of truth could be the filesystem or Chroma. 
    # For MVP, we'll list files in the upload directory.
    # Ideally, we query Chroma for distinct 'source' metadata, but filesystem is faster/simpler for now.
    try:
        files = os.listdir(UPLOAD_DIR)
        return {"documents": [f for f in files if f != ".DS_Store"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/documents/{filename}")
def delete_document(filename: str):
    """Delete a document and its embeddings."""
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    # 1. Remove from FS
    if os.path.exists(file_path):
        os.remove(file_path)
    else:
        # If not on FS, it might still be in DB (ghost file), so we proceed to DB deletion anyway
        pass

    # 2. Remove from Chroma
    try:
        delete_document_chunks(filename)
        return {"status": "success", "message": f"Deleted {filename}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete from DB: {str(e)}")
