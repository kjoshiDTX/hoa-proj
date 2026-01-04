import anthropic
import os

client = anthropic.Anthropic(
    api_key=os.getenv("ANTHROPIC_API_KEY"),
)

SYSTEM_PROMPT = """
Answer ONLY using provided context.
If missing info, say: "This is not stated in the rulebook."
Cite sections/pages when possible.
"""

def generate_answer(query: str, retrieved_chunks):
    """
    Generates an answer using Claude based on retrieved context.
    """
    context_str = ""
    citations = []
    
    # Flatten results from Chroma (which returns list of lists)
    if retrieved_chunks and 'documents' in retrieved_chunks:
         # Check if we have results
         if not retrieved_chunks['documents'] or len(retrieved_chunks['documents'][0]) == 0:
             return "I could not find any relevant information in the rulebook.", []

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

    user_message = f"Context:\n{context_str}\n\nQuestion: {query}"
    
    try:
        message = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            system=SYSTEM_PROMPT,
            messages=[
                {"role": "user", "content": user_message}
            ]
        )
        answer = message.content[0].text
    except Exception as e:
        answer = f"Error generating answer: {str(e)}"
    
    return answer, citations
