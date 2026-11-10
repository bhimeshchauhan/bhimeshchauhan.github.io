"""Retrieval check for the portfolio assistant: does the right chunk come back for a fixed set of questions?

  python backend/scripts/retrieval_eval.py [--sources profile case_study ...] [--threshold 0.75] [--k 10]

Metrics, per question set: hit@3 and hit@k (an expected pattern appears in the top 3 / top k chunks),
mean top-1 similarity, and the share of retrieved chunks that look like code (imports, JSX, braces).
`match_threshold` is passed straight to match_information_chunks, where it is a maximum cosine DISTANCE
(0.75 keeps similarity >= 0.25), not a minimum similarity.
"""
import argparse, json, os, re
from pathlib import Path
from dotenv import load_dotenv
import cohere
from supabase import create_client

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")
sb = create_client(os.environ["SUPABASE_URL"], os.environ["SUPABASE_SERVICE_ROLE_KEY"])
co = cohere.Client(os.environ["COHERE_API_KEY"])
CODE = re.compile(r"\bimport\b.*\bfrom\b|\bexport\b|=>|className|</?[a-z]+[ >]|\{\s*\n|^\s*id:\s*\d+", re.M)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--sources", nargs="*", default=None)
    ap.add_argument("--threshold", type=float, default=0.75)
    ap.add_argument("--k", type=int, default=10)
    ap.add_argument("--prefix", default="Bhimesh: ", help="text the search function prepends to each query")
    ap.add_argument("--verbose", action="store_true")
    a = ap.parse_args()
    qs = json.loads((Path(__file__).parent / "retrieval_eval.json").read_text())
    embs = co.embed(texts=[f"{a.prefix}{x['q']}" for x in qs], model="embed-english-v3.0", input_type="search_query").embeddings
    h3 = hk = 0
    top1, code, total, misses = [], 0, 0, []
    for x, e in zip(qs, embs):
        rows = sb.rpc("match_information_chunks", {"query_embedding": e, "match_threshold": a.threshold, "match_count": a.k, "filter_sources": a.sources}).execute().data or []
        match = lambda rs: all(any(re.search(p, r["content"]) for r in rs) for p in x["expect"])
        ok3, okk = match(rows[:3]), match(rows)
        h3 += ok3; hk += okk
        if rows: top1.append(rows[0]["similarity"])
        code += sum(bool(CODE.search(r["content"])) for r in rows); total += len(rows)
        if not okk: misses.append(x["q"])
        if a.verbose: print(("OK " if ok3 else ("ok@k" if okk else "MISS")), round(rows[0]["similarity"], 3) if rows else None, x["q"])
    n = len(qs)
    print(f"sources={a.sources or 'ALL'} threshold={a.threshold} k={a.k}")
    print(f"hit@3 {h3}/{n} ({h3/n:.0%})   hit@{a.k} {hk}/{n} ({hk/n:.0%})   mean top-1 similarity {sum(top1)/max(1,len(top1)):.3f}   code-like chunks {code}/{total} ({code/max(1,total):.0%})")
    if misses: print("missed:", *misses, sep="\n  ")


if __name__ == "__main__":
    main()
