import hashlib

def generate_chunk_id(text: str) -> str:
    """Generates a deterministic SHA256 ID for a text chunk."""
    return hashlib.sha256(text.encode('utf-8')).hexdigest()
