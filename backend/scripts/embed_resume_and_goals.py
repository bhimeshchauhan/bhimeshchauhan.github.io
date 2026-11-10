"""Indexes the portfolio's content into Supabase (information_chunks) for the assistant's retrieval.

  python backend/scripts/embed_resume_and_goals.py            # build + embed + upload the clean prose chunks
  python backend/scripts/embed_resume_and_goals.py --drop-legacy   # then remove the old raw-source/PDF chunks
  python backend/scripts/embed_resume_and_goals.py --goals     # also re-index src/data/Goals.js

Chunks come from scripts/build-rag-chunks.cjs: llms-full.txt, case studies, blog posts, projects and a few
small facts, as prose with a context prefix. They are NOT slices of raw src/data/*.js files: that is what the
old `site_data` source was, and it made retrieval return import statements and JSX.

Run backend/scripts/retrieval_eval.py before and after to compare. Upload is per source and embeds first, so a
failed embedding never leaves a source empty.
"""
import argparse
import json
import os
import re
import subprocess
import uuid
from pathlib import Path

import cohere
from dotenv import load_dotenv
from supabase import Client, create_client

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
COHERE_API_KEY = os.getenv("COHERE_API_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
co = cohere.Client(COHERE_API_KEY)

CLEAN_SOURCES = ["profile", "case_study", "blog", "projects", "extras"]
LEGACY_SOURCES = ["site_data", "resume"]  # raw-source and PDF-fragment chunks the clean sources replace


def get_embeddings(texts):
    out = []
    for i in range(0, len(texts), 96):  # Cohere embed accepts at most 96 texts per call
        response = co.embed(texts=texts[i:i + 96], model="embed-english-v3.0", input_type="search_document")
        out.extend(response.embeddings)
    return out


def upload(rows, source):
    """rows: [{content, tag, embedding}]. Replaces everything stored under `source`."""
    supabase.table("information_chunks").delete().eq("source", source).execute()
    for i in range(0, len(rows), 40):
        supabase.table("information_chunks").insert([
            {
                "id": str(uuid.uuid4()),
                "content": r["content"],
                "embedding": r["embedding"],
                "source": source,
                "tags": [r["tag"]],
                "is_active": True,
                "version": 2,
            }
            for r in rows[i:i + 40]
        ]).execute()
    print(f"  {source}: {len(rows)} chunks")


def index_clean_chunks():
    built = subprocess.run(["node", str(ROOT / "scripts" / "build-rag-chunks.cjs")], capture_output=True, text=True, check=True)
    chunks = json.loads(built.stdout)
    print(built.stderr.strip())
    # Embed everything first, then write per source.
    embeddings = get_embeddings([c["content"] for c in chunks])
    by_source = {}
    for c, e in zip(chunks, embeddings):
        by_source.setdefault(c["source"], []).append({**c, "embedding": e})
    for source in CLEAN_SOURCES:
        if source in by_source:
            upload(by_source[source], source)


def drop_legacy():
    for source in LEGACY_SOURCES:
        supabase.table("information_chunks").delete().eq("source", source).execute()
        print(f"  removed legacy source: {source}")


# --- Goals (unchanged behaviour): src/data/Goals.js is parsed as JSON-ish and chunked by sentence ---
def chunk_text(text, max_length=500):
    sentences = re.split(r"(?<=[.?!])\s+", text)
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


def process_goals(goals_js_path):
    with open(goals_js_path, "r") as f:
        js_code = f.read()
    js_code_clean = re.sub(r"export\s+default\s+", "", js_code).strip()
    if js_code_clean.endswith(";"):
        js_code_clean = js_code_clean[:-1]
    js_code_clean = re.sub(r"(?<=[{,\n])\s*(\w+)\s*:", r' "\1":', js_code_clean)
    js_code_clean = re.sub(r",\s*([}\]])", r"\1", js_code_clean)
    goals = json.loads(js_code_clean)
    texts = [f"[{s['name']}] {i['desc']}" for s in goals for i in s["todo"] if i["desc"]]
    chunks = chunk_text(" ".join(texts))
    embeddings = get_embeddings(chunks)
    upload([{"content": c, "tag": "goals", "embedding": e} for c, e in zip(chunks, embeddings)], "goals")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--drop-legacy", action="store_true", help="remove the old site_data and resume chunks")
    ap.add_argument("--goals", action="store_true", help="also re-index Goals.js")
    args = ap.parse_args()
    if args.drop_legacy:
        drop_legacy()
    else:
        index_clean_chunks()
        if args.goals:
            process_goals(ROOT / "src" / "data" / "Goals.js")
