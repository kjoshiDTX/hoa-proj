from db.chroma import get_collection

# Removed explicit embedding functions.
# We rely on ChromaDB's default embedding function (all-MiniLM-L6-v2) running locally.
# This avoids API rate limits and costs.

def retrieve_context(query: str, collection_name: str = "rules", top_k: int = 10):
    """
    Retrieves top_k chunks for a query using valid local embeddings.
    """
    collection = get_collection(collection_name)
    
    # Pass query_texts, Chroma handles embedding.
    results = collection.query(
        query_texts=[query],
        n_results=top_k,
    )
    
    return results
