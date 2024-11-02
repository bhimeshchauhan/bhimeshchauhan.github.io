from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

# Load the SentenceTransformer model for generating embeddings
model = SentenceTransformer('all-MiniLM-L6-v2')

# Your resume data chunks (replace these with all your data from previous examples)
resume_chunks = [
    "Bhimesh designed and implemented an AI-powered ambient platform that passively listens to doctor-patient conversations using a custom fine-tuned Llama 3 model, enhancing transcription capabilities.",
    "Bhimesh developed custom note generation techniques extended by Retrieval-Augmented Generation (RAG), significantly reducing documentation time for healthcare professionals.",
    "He integrated a vector database (VectorDB) for efficient storage and retrieval of contextual information, optimizing the workflow for healthcare professionals by reducing documentation time by 80%.",
    "Bhimesh developed an interactive dashboard to manage kiosks in real-time, greatly improving operational efficiency at MicroMart/KitchenMate.",
    "He built clients for Modbus RS485 protocols, integrating low-level hardware with software to interface with smart fridges and enhance connectivity using sockets and servers.",
    "Bhimesh led the certification and integration of Heartland payment systems, ensuring PCI compliance and a secure payment experience.",
    "He collaborated with external vendors and partners to successfully complete complex API integrations, streamlining business processes.",
    "At Preply, Bhimesh led a cross-functional team to develop tracking tools for 80K students, boosting user engagement and retention.",
    "He increased user conversion rates by 5% through data-driven experiments and A/B testing, leading to improved user experiences.",
    "Bhimesh conducted customer interviews to gather insights that drove the launch of scalable product experiments, with a success rate of 72%.",
    "At DataRobot, Bhimesh integrated enterprise-level tools, increasing visibility by 70% for partners including Microsoft Excel, Tableau, and Snowflake.",
    "He built a CI/CD pipeline using Jenkins and Kibana, streamlining deployments and accelerating delivery speed.",
    "Bhimesh developed an Android application that enabled remote access to ML models, facilitating real-time classification and testing.",
    "He designed an MVC architecture around REST APIs, ensuring compliance with OWASP and HIPAA standards for data security.",
    "Bhimesh built two GraphQL applications to automate data intake and speed up deck generation, saving significant time and effort for clients.",
    "He developed an Android app to monitor plant growth remotely, increasing aeroponic system yield by 20%.",
    "Bhimesh implemented a neural network using PyTorch and TensorFlow to predict plant growth, optimizing resource usage and efficiency.",
    "He developed an AI-powered Connect 4 game that mimics human decision-making using alpha-beta pruning and decision trees, creating an interactive experience with React, Redux, and JavaScript.",
    "Bhimesh designed a procedural terrain generator using Unity, applying Gaussian transforms and triangulated surface points for realistic environmental rendering.",
    "He built a Sudoku solver using C++, Python, and OpenCV, employing image processing and backtracking techniques to enhance problem-solving skills.",
    "Bhimesh developed a digital auto sales platform with React and Node.js, integrating GraphQL APIs for real-time inventory management and seamless transactions.",
    "He integrated payment gateways and user authentication via Google SSO, making transactions smoother and more secure.",
    "Bhimesh designed a scalable backend using MongoDB to manage dealership inventories efficiently.",
    "He created a persona detection system using a Neo4j graph database and KNN algorithms, personalizing language learning paths based on user interactions.",
    "Bhimesh developed a Flask API for real-time recommendations, optimizing graph queries to scale with large datasets and enhance learning outcomes."
]

# Generate embeddings for each chunk
print("Generating embeddings...")
embeddings = model.encode(resume_chunks)
embedding_dim = embeddings.shape[1]

# Create a FAISS index and add the embeddings to it
print("Creating FAISS index...")
faiss_index = faiss.IndexFlatL2(embedding_dim)
faiss_index.add(embeddings)

# Save the FAISS index to a file
print("Saving FAISS index...")
faiss.write_index(faiss_index, "resume_index.faiss")

# Save the resume chunks to a .npy file for use in retrieval
print("Saving resume chunks...")
with open("resume_chunks.npy", "wb") as f:
    np.save(f, np.array(resume_chunks))

print("FAISS index and .npy file have been generated and saved successfully.")
