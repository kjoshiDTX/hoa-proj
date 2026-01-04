import chromadb
from chromadb.config import Settings
import os

PERSIST_DIRECTORY = "chroma_db"

def get_chroma_client():
    """Returns a persistent ChromaDB client."""
    return chromadb.PersistentClient(path=PERSIST_DIRECTORY, settings=Settings(anonymized_telemetry=False))

def get_collection(name: str):
    """Get or create a collection."""
    client = get_chroma_client()
    return client.get_or_create_collection(name=name)

def delete_document_chunks(source_filename: str, collection_name: str = "rules"):
    """Deletes all chunks associated with a source filename."""
    collection = get_collection(collection_name)
    # Chroma delete by where metadata
    collection.delete(
        where={"source": source_filename}
    )
