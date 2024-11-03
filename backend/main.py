from fastapi import FastAPI, Request
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
from transformers import pipeline
from fastapi.middleware.cors import CORSMiddleware

# Initialize the FastAPI app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8000", "http://127.0.0.1:8000", "https://bhimeshchauhan.github.io"],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Load models and data
print("Loading models and data...")
model = SentenceTransformer('all-MiniLM-L6-v2')
faiss_index = faiss.read_index("resume_index.faiss")
resume_chunks = np.load("resume_chunks.npy", allow_pickle=True)
generator = pipeline("text-generation", model="gpt2")

# Predefined casual responses
casual_responses = {
    "hi": "Hello! How can I assist you today?",
    "hello": "Hi there! What would you like to talk about?",
    "how are you": "I'm just a program, but I'm here to help you with anything you need!",
    "goodbye": "Goodbye! Feel free to come back if you have more questions.",
    "bye": "Take care! I'm here whenever you need assistance."
}

# Add a simple route for the root URL
@app.get("/")
async def read_root():
    return {"message": "Welcome to Bhimesh's FastAPI service!"}

@app.post("/query")
async def get_response(request: Request):
    data = await request.json()
    question = data.get("question").strip().lower()

    # Check for casual responses
    if question in casual_responses:
        return {"response": casual_responses[question]}

    # Encode the query and retrieve relevant context
    query_embedding = model.encode([question])
    distances, indices = faiss_index.search(query_embedding, k=3)
    context = " ".join([resume_chunks[i] for i in indices[0]])

    # Check if context relevance is above a threshold
    relevance_threshold = 0.7  # Adjust this threshold as needed
    if max(distances[0]) < relevance_threshold:
        return {"response": "I'm sorry, I couldn't find relevant information related to your question in my knowledge base."}

    # Use a dynamic template based on the question type
    if context:
        personalized_response = f"Here is what Bhimesh has accomplished: {context}."
    else:
        personalized_response = "I'm sorry, I couldn't find relevant information about Bhimesh's work at the moment."

    return {"response": personalized_response}

if __name__ == "__main__":
    import os
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    print(f"Starting server on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port)
