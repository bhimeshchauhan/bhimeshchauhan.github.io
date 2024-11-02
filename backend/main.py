from fastapi import FastAPI, Request
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
from transformers import pipeline

# Initialize the FastAPI app
app = FastAPI()

# Load models and data
print("Loading models and data...")
model = SentenceTransformer('all-MiniLM-L6-v2')
faiss_index = faiss.read_index("resume_index.faiss")
resume_chunks = np.load("resume_chunks.npy", allow_pickle=True)
generator = pipeline("text-generation", model="EleutherAI/gpt-neo-1.3B")  # Change model if needed

@app.post("/query")
async def get_response(request: Request):
    data = await request.json()
    question = data.get("question")
    
    # Encode the query and retrieve relevant context
    query_embedding = model.encode([question])
    distances, indices = faiss_index.search(query_embedding, k=3)
    context = " ".join([resume_chunks[i] for i in indices[0]])

    # Check if relevant context was found
    if context:
        # Use a dynamic template based on the question type
        if "AI" in question or "machine learning" in question.lower():
            personalized_response = (f"Bhimesh's notable AI projects include: {context}. "
                                     "These projects highlight his ability to develop and integrate AI solutions "
                                     "with significant impact.")
        elif "project" in question.lower() or "work" in question.lower():
            personalized_response = (f"Bhimesh has worked on several impactful projects, such as: {context}. "
                                     "These experiences demonstrate his expertise and contribution.")
        elif "experience" in question.lower():
            personalized_response = (f"Bhimesh's professional experience includes: {context}. "
                                     "These roles and responsibilities showcase his comprehensive skill set.")
        else:
            personalized_response = f"Here is what Bhimesh has accomplished: {context}."
    else:
        personalized_response = "I'm sorry, I couldn't find relevant information about Bhimesh's work at the moment."

    return {"response": personalized_response}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
