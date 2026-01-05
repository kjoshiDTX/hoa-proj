from anthropic import AsyncAnthropic
import os
import json

client = AsyncAnthropic(
    api_key=os.getenv("ANTHROPIC_API_KEY"),
)

SYSTEM_PROMPT = """
Answer ONLY using provided context.
If missing info, say: "This is not stated in the rulebook."
Cite sections/pages when possible.
"""

async def generate_answer_stream(query: str, retrieved_chunks):
    """
    Generates an answer using Claude (Streaming) based on retrieved context.
    Yields NDJSON lines.
    """
    context_str = ""
    citations = []
    
    # Flatten results from Chroma (which returns list of lists)
    if retrieved_chunks and 'documents' in retrieved_chunks:
         # Check if we have results
         # Note: Chroma result empty check
         if retrieved_chunks['documents'] and len(retrieved_chunks['documents'][0]) > 0:
             documents = retrieved_chunks['documents'][0]
             metadatas = retrieved_chunks['metadatas'][0]
             
             for i, doc in enumerate(documents):
                 meta = metadatas[i]
                 # Format: [Section: X | Page Y] \n <text>
                 section = meta.get('section', 'Unknown')
                 page = meta.get('page', 'Unknown')
                 source = meta.get('source', 'Unknown Document')
                 
                 context_str += f"[Source: {source} | Page {page}]\n{doc}\n\n"
                 
                 # Avoid duplicate citations
                 citation = f"{source} (Page {page})"
                 if citation not in citations:
                     citations.append(citation)

    # 1. Send Citations immediately
    yield json.dumps({"type": "citations", "citations": citations}) + "\n"

    # If no context, fail gracefully but still stream the message
    if not context_str:
        user_message = f"Question: {query}\n(No context found available)."
    else:
        user_message = f"Context:\n{context_str}\n\nQuestion: {query}"
    
    try:
        async with client.messages.stream(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            system=SYSTEM_PROMPT,
            messages=[
                {"role": "user", "content": user_message}
            ],
        ) as stream:
            async for text in stream.text_stream:
                yield json.dumps({"type": "content", "chunk": text}) + "\n"
                
    except Exception as e:
        yield json.dumps({"type": "error", "message": str(e)}) + "\n"
