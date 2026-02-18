import os
import json
import uuid
import re
import fitz  # PyMuPDF
import json as json_mod
import cohere
from pathlib import Path
from supabase import create_client, Client
from dotenv import load_dotenv

# === ENV SETUP ===
env_path = Path(__file__).resolve().parents[2] / '.env'
load_dotenv(dotenv_path=env_path)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
COHERE_API_KEY = os.getenv("COHERE_API_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
co = cohere.Client(COHERE_API_KEY)

# === EMBEDDING FUNCTION ===
def get_embeddings(texts):
    if not texts:
        return []
    print("🧠 Embedding texts with Cohere...")
    response = co.embed(texts=texts, model="embed-english-v3.0", input_type="search_document")
    return response.embeddings

# === TEXT CHUNKING ===
def chunk_text(text, max_length=500):
    sentences = re.split(r'(?<=[.?!])\s+', text)
    chunks, current = [], ""
    for sentence in sentences:
        if len(current) + len(sentence) <= max_length:
            current += sentence + " "
        else:
            if current:
                chunks.append(current.strip())
            current = sentence + " "
    if current:
        chunks.append(current.strip())
    return chunks

# === SUPABASE INSERTION ===
def upload_chunks(chunks, source, tags=None):
    print(f"🧹 Deleting existing chunks for source: {source}")
    supabase.table("information_chunks").delete().eq("source", source).execute()

    embeddings = get_embeddings(chunks)
    print(f"📦 Uploading {len(chunks)} chunks for '{source}'...")
    for i, (chunk, embedding) in enumerate(zip(chunks, embeddings), 1):
        supabase.table("information_chunks").insert({
            "id": str(uuid.uuid4()),
            "content": chunk,
            "embedding": embedding,
            "source": source,
            "tags": tags or [],
            "is_active": True,
            "version": 1
        }).execute()
        print(f"✅ Uploaded chunk {i}/{len(chunks)}")

# === PROCESS RESUME PDF ===
def process_resume(pdf_path):
    print(f"📄 Processing resume: {pdf_path}")
    doc = fitz.open(str(pdf_path))
    text = "".join(page.get_text() for page in doc)
    chunks = chunk_text(text)
    upload_chunks(chunks, source="resume")
    print(f"✅ Uploaded {len(chunks)} resume chunks.")

# === PROCESS GOALS JSON ===
def process_goals(goals_js_path):
    print(f"🎯 Processing goals: {goals_js_path}")
    with open(goals_js_path, 'r') as f:
        js_code = f.read()

    # Remove `export default` and convert JS object syntax to JSON
    js_code_clean = re.sub(r'export\s+default\s+', '', js_code).strip()
    if js_code_clean.endswith(';'):
        js_code_clean = js_code_clean[:-1]
    # Quote unquoted keys and convert JS booleans
    js_code_clean = re.sub(r'(?<=[{,\n])\s*(\w+)\s*:', r' "\1":', js_code_clean)
    js_code_clean = js_code_clean.replace(': true', ': true').replace(': false', ': false')
    # Remove trailing commas before } or ]
    js_code_clean = re.sub(r',\s*([}\]])', r'\1', js_code_clean)

    try:
        goals = json_mod.loads(js_code_clean)
    except Exception as e:
        print("❌ Failed to parse goals JSON:", e)
        return

    all_goal_chunks = []
    for section in goals:
        year = section['name']
        for item in section['todo']:
            if item['desc']:
                goal_text = f"[{year}] {item['desc']}"
                all_goal_chunks.append(goal_text)

    chunks = chunk_text(" ".join(all_goal_chunks))
    upload_chunks(chunks, source="goals")
    print(f"✅ Uploaded {len(chunks)} goal chunks.")


# === STRIP JS EXPORTS ===
def strip_js_exports(content):
    content = re.sub(r'export\s+default\s+', '', content)
    content = re.sub(r'export\s+\{.*?\}', '', content)
    return content.strip()

# === PROCESS STATIC SITE DATA ===
def process_site_data(folder_path="src/data"):
    print(f"📁 Processing site data from: {folder_path}")
    data_dir = Path(folder_path)
    print(f"🧹 Deleting existing chunks for source: site_data")
    supabase.table("information_chunks").delete().eq("source", "site_data").execute()

    for js_file in data_dir.glob("*.js"):
        with open(js_file, "r", encoding="utf-8") as f:
            raw = f.read()
            cleaned = strip_js_exports(raw)
            tag = js_file.stem
            chunks = chunk_text(cleaned)
            upload_chunks(chunks, source="site_data", tags=[tag])
            print(f"✅ Uploaded {len(chunks)} chunks from {js_file.name}")

# === MAIN ENTRY ===
if __name__ == "__main__":
    root = Path(__file__).resolve().parents[2]
    process_resume(root / "resume.pdf")
    process_goals(root / "src/data/Goals.js")
    process_site_data(root / "src/data")
