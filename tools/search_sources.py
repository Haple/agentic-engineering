#!/usr/bin/env python3
"""Collect candidate source talks for the Agentic Engineering course via yt-dlp search.
Writes sources/candidates.json (deduped, with query hits). Safe to re-run (cache per query)."""
import json, subprocess, sys, os, time, hashlib
ROOT = os.path.expanduser("~/agentic-engineering/sources")
CACHE = os.path.join(ROOT, "search-cache"); os.makedirs(CACHE, exist_ok=True)
QUERIES = [
 "karpathy agentic engineering", "karpathy software is changing again", "karpathy vibe coding", "karpathy no priors code agents",
 "agentic engineering talk", "agentic engineering workshop", "agentic coding best practices",
 "boris cherny claude code", "claude code creator interview", "cat wu claude code", "head of claude code talk",
 "claude code best practices anthropic", "anthropic claude code talk", "code with claude conference", "claude code advanced workflow",
 "claude code subagents", "claude code hooks skills", "agent skills anthropic", "claude code parallel agents worktrees",
 "openai codex talk engineering", "codex best practices openai", "harness engineering openai", "openai devday codex agents",
 "cursor agent talk", "cursor team lex fridman", "amp sourcegraph agent quinn slack", "thorsten ball agent",
 "ai engineer world's fair coding agents", "ai engineer summit agents talk", "ai engineer code agents keynote",
 "context engineering coding agents", "dex horthy advanced context engineering", "12 factor agents", "context rot long context",
 "spec driven development ai agents", "kiro spec driven", "test driven development ai agents",
 "simon willison agents talk", "simon willison coding agents", "armin ronacher agentic coding", "mitchell hashimoto ai coding",
 "peter steinberger agentic engineering", "geoffrey huntley ralph loop", "ralph wiggum loop coding agent",
 "kent beck augmented coding", "addy osmani agentic engineering", "steve yegge vibe coding",
 "building effective agents anthropic", "how we build agents anthropic", "mcp model context protocol talk", "mcp explained anthropic",
 "evals for ai agents talk", "llm evals hamel husain", "agent evaluation coding agents",
 "background agents async coding", "ai code review agents talk", "agents in ci github copilot coding agent",
 "prompt injection agents security simon willison", "ai agent security sandbox talk",
 "swe-bench coding agents explained", "how coding agents work under the hood", "build a coding agent from scratch",
 "y combinator vibe coding tips", "latent space podcast claude code", "pragmatic engineer ai coding", "lenny podcast claude code",
 "dwarkesh karpathy", "a16z coding agents", "every ai and i claude code", "google agentic engineering course",
 "agent teams loops graphs", "multi agent orchestration coding", "long running agents anthropic",
]
def search(q, n=20):
    key = hashlib.md5(q.encode()).hexdigest()[:10]
    f = os.path.join(CACHE, key + ".json")
    if os.path.exists(f): return json.load(open(f))
    for attempt in range(3):
        try:
            out = subprocess.run(["yt-dlp", "--no-update", "--flat-playlist", "-J", f"ytsearch{n}:{q}"], capture_output=True, text=True, timeout=180)
            data = json.loads(out.stdout)
            ents = [{k: e.get(k) for k in ("id","title","channel","channel_id","duration","view_count","url")} for e in data.get("entries", []) if e]
            json.dump({"q": q, "entries": ents}, open(f, "w"))
            return {"q": q, "entries": ents}
        except Exception as ex:
            print("retry", q, ex, file=sys.stderr); time.sleep(5)
    return {"q": q, "entries": []}
cands = {}
for i, q in enumerate(QUERIES):
    r = search(q)
    print(f"[{i+1}/{len(QUERIES)}] {q}: {len(r['entries'])}", flush=True)
    for rank, e in enumerate(r["entries"]):
        c = cands.setdefault(e["id"], {**e, "queries": []})
        c["queries"].append([q, rank])
json.dump(list(cands.values()), open(os.path.join(ROOT, "candidates.json"), "w"), indent=1)
print("candidates", len(cands))
