"""Retrieval check for the portfolio assistant: does the right chunk come back for a fixed set of questions?

  python backend/scripts/retrieval_eval.py [--set main|holdout|refusal] [--sources profile ...] [--threshold 0.70] [--k 8]
  python backend/scripts/retrieval_eval.py --write-results     # run all three sets, save src/data/retrieval-results.json

Sets: `main` (28 questions the chunking was tuned against), `holdout` (30 written afterwards and never tuned
against, so its numbers are the honest ones) and `refusal` (out-of-scope questions that must NOT retrieve
anything convincing). `--cutoff` is the best-match similarity below which the assistant refuses without asking
the model; the in-scope sets report how many real questions it would wrongly refuse.

Metrics: hit@3 and hit@k (an expected pattern appears in the top 3 / top k chunks), mean top-1 similarity, and the
share of retrieved chunks that look like code. `match_threshold` goes straight to match_information_chunks, where
it is a maximum cosine DISTANCE (0.70 keeps similarity >= 0.30), not a minimum similarity.
The Evidence page on the site renders the file written by --write-results.
"""
import argparse
import datetime
import json
import os
import re
from collections import Counter
from pathlib import Path

import cohere
from dotenv import load_dotenv
from supabase import create_client

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")
sb = create_client(os.environ["SUPABASE_URL"], os.environ["SUPABASE_SERVICE_ROLE_KEY"])
co = cohere.Client(os.environ["COHERE_API_KEY"])
CODE = re.compile(r"\bimport\b.*\bfrom\b|\bexport\b|=>|className|</?[a-z]+[ >]|\{\s*\n|^\s*id:\s*\d+", re.M)
FILES = {"main": "retrieval_eval.json", "holdout": "retrieval_eval_holdout.json", "refusal": "retrieval_eval_refusal.json"}
RESULTS_PATH = ROOT / "src" / "data" / "retrieval-results.json"


def load(name):
    return json.loads((Path(__file__).parent / FILES[name]).read_text())


def retrieve(qs, a):
    embs = co.embed(texts=[f"{a.prefix}{x['q']}" for x in qs], model="embed-english-v3.0", input_type="search_query").embeddings
    out = []
    for e in embs:
        rows = sb.rpc("match_information_chunks", {"query_embedding": e, "match_threshold": a.threshold, "match_count": a.k, "filter_sources": a.sources}).execute().data or []
        out.append(rows)
    return out


def run_in_scope(name, a):
    qs = load(name)
    results = retrieve(qs, a)
    items, code, total = [], 0, 0
    for x, rows in zip(qs, results):
        match = lambda rs: all(any(re.search(p, r["content"]) for r in rs) for p in x["expect"])
        top = rows[0]["similarity"] if rows else 0.0
        code += sum(bool(CODE.search(r["content"])) for r in rows)
        total += len(rows)
        items.append({"q": x["q"], "top3": match(rows[:3]), "topk": match(rows), "best": round(top, 3), "refused": top < a.cutoff})
    n = len(items)
    return {
        "n": n,
        "hit3": sum(i["top3"] for i in items),
        "hitk": sum(i["topk"] for i in items),
        "mean_top1": round(sum(i["best"] for i in items) / n, 3),
        "code_like_pct": round(100 * code / max(1, total)),
        "wrongly_refused": sum(i["refused"] for i in items),
        "lowest_best": min(i["best"] for i in items),
        "questions": items,
    }


def run_refusal(a):
    qs = load("refusal")
    results = retrieve(qs, a)
    items = []
    for x, rows in zip(qs, results):
        top = rows[0]["similarity"] if rows else 0.0
        items.append({"q": x["q"], "best": round(top, 3), "refused": top < a.cutoff})
    return {"n": len(items), "refused": sum(i["refused"] for i in items), "highest_best": max(i["best"] for i in items), "questions": items}


def index_counts():
    rows = sb.table("information_chunks").select("source").range(0, 4999).execute().data
    return dict(Counter(r["source"] for r in rows))


def print_in_scope(name, r, a):
    print(f"set={name} sources={a.sources or 'ALL'} threshold={a.threshold} k={a.k}")
    print(f"hit@3 {r['hit3']}/{r['n']} ({r['hit3']/r['n']:.0%})   hit@{a.k} {r['hitk']}/{r['n']} ({r['hitk']/r['n']:.0%})   mean top-1 similarity {r['mean_top1']:.3f}   code-like chunks {r['code_like_pct']}%")
    print(f"would be wrongly refused at cutoff {a.cutoff}: {r['wrongly_refused']}/{r['n']}   lowest best-match similarity {r['lowest_best']:.3f}")
    missed = [i["q"] for i in r["questions"] if not i["topk"]]
    if missed:
        print("missed:", *missed, sep="\n  ")
    if a.verbose:
        for i in r["questions"]:
            print(("OK  " if i["top3"] else ("ok@k" if i["topk"] else "MISS")), i["best"], i["q"])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--set", default="main", choices=["main", "holdout", "refusal"])
    ap.add_argument("--threshold", type=float, default=0.70)
    ap.add_argument("--cutoff", type=float, default=0.34)
    ap.add_argument("--k", type=int, default=8)
    ap.add_argument("--sources", nargs="*", default=None)
    ap.add_argument("--prefix", default="Bhimesh: ", help="text the search function prepends to each query")
    ap.add_argument("--min-hit-k", type=float, default=None, help="exit 1 if hit@k is below this fraction (for CI)")
    ap.add_argument("--write-results", action="store_true", help="run all sets and write src/data/retrieval-results.json")
    ap.add_argument("--verbose", action="store_true")
    a = ap.parse_args()

    if a.write_results:
        data = {
            "generated": datetime.date.today().isoformat(),
            "settings": {"max_distance": a.threshold, "chunks_per_question": a.k, "refusal_cutoff": a.cutoff, "query_prefix": a.prefix},
            "index": index_counts(),
            "main": run_in_scope("main", a),
            "holdout": run_in_scope("holdout", a),
            "refusal": run_refusal(a),
        }
        RESULTS_PATH.write_text(json.dumps(data, indent=1, ensure_ascii=False) + "\n")
        for s in ("main", "holdout"):
            print_in_scope(s, data[s], a)
        print(f"refusal: {data['refusal']['refused']}/{data['refusal']['n']} refused; wrote {RESULTS_PATH.relative_to(ROOT)}")
        return

    if a.set == "refusal":
        r = run_refusal(a)
        for i in r["questions"]:
            print(f"  {i['best']:.3f} {'REFUSED' if i['refused'] else 'answered'}  {i['q']}")
        print(f"set=refusal cutoff={a.cutoff}: {r['refused']}/{r['n']} out-of-scope questions refused   highest best-match similarity {r['highest_best']:.3f}")
        return

    r = run_in_scope(a.set, a)
    print_in_scope(a.set, r, a)
    if a.min_hit_k is not None and r["hitk"] / r["n"] < a.min_hit_k:
        raise SystemExit(f"FAIL: hit@{a.k} {r['hitk']/r['n']:.0%} is below the required {a.min_hit_k:.0%}")


if __name__ == "__main__":
    main()
