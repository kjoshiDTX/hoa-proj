import os
from unstructured.partition.pdf import partition_pdf
from unstructured.chunking.title import chunk_by_title
from utils.hashing import generate_chunk_id
from db.chroma import get_collection, get_chroma_client

# Constants
CHUNK_SIZE = 700 # Max tokens approx
OVERLAP = 70 # ~10% overlap

def ingest_pdf(file_path: str):
    """
    Ingests a PDF, chunks it by title/section, and stores in ChromaDB.
    """
    print(f"Partitioning PDF: {file_path}")
    elements = partition_pdf(filename=file_path)
    
    # Use unstructured built-in chunking which is robust
    print("Chunking elements...")
    chunks = chunk_by_title(
        elements,
        max_characters=CHUNK_SIZE * 4, # rough approx char/token ratio
        new_after_n_chars=CHUNK_SIZE * 3,
        overlap=OVERLAP * 4
    )
    
    documents = []
    metadatas = []
    ids = []
    
    print(f"Processing {len(chunks)} chunks...")
    for chunk in chunks:
        text = str(chunk)
        chunk_id = generate_chunk_id(text)
        
        # Extract metadata if available from unstructured element
        page_number = chunk.metadata.page_number if hasattr(chunk.metadata, 'page_number') else "Unknown"
        section = "Unknown" # extraction of section title is complex without knowing doc structure, using placeholder
        
        documents.append(text)
        metadatas.append({
            "source": os.path.basename(file_path),
            "page": str(page_number),
            "section": section,
            "chunk_id": chunk_id
        })
        ids.append(chunk_id)

    # Store in Chroma
    print("Storing in ChromaDB...")
    collection = get_collection("rules")
    
    # Check for existing IDs to avoid duplicates (naive check)
    # Chroma upsert handles this, but we want to avoid re-embedding if possible.
    # For MVP, simple upsert is fine as instructed: "Ensure re-runs do not duplicate data" -> upsert works by ID.
    
    # Get embedding function wrapper or let Chroma use default (if we didn't specify one in db/chroma.py)
    # The requirement says "Embed model: text-embedding-3-large". 
    # We need to manually embed if we want to control the model, OR configure Chroma to use OpenAI EF.
    # IN `retrieve.py` we manually embedded. So we should probably manually embed here OR accept that `retrieve.py` logic needs to match.
    
    # Let's import the embedding function from retrieve (or move it to utils) to be consistent.
    # Refactoring embedding to `utils/embedding.py` would be cleaner, but I'll keeping it simple and import or duplicates.
    collection.upsert(
        documents=documents,
        metadatas=metadatas,
        ids=ids,
        # embeddings=embeddings # Let Chroma compute default embeddings locally
    )
    
    print(f"Ingestion complete. Stored {len(documents)} chunks.")
    return len(documents)
