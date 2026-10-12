#!/usr/bin/env -S uv run --script
# /// script
# dependencies = ["json-repair"]
# ///
"""Per-transcript insight extraction via fal's OpenRouter router (Sonnet 5.5).
sources/transcripts/<id>.json -> research/insights/<id>.json. Verifies quotes against the transcript.
Usage: FAL_KEY=... python3 tools/extract_insights.py [ids...]"""
import json, os, re, sys, time, difflib, urllib.request
from concurrent.futures import ThreadPoolExecutor
R = os.path.expanduser("~/agentic-engineering")
CANDS = {c["id"]: c for c in json.load(open(f"{R}/sources/candidates.json"))}
TOPICS = """what-is-agentic-engineering: vibe coding vs agentic engineering, software 3.0, the shift, why now
how-agents-work: the agent loop, models + tools + harness, what the agent sees, why agents fail
context: context windows, context engineering, CLAUDE.md/AGENTS.md/memory files, compaction, context rot, fresh sessions
workflow: explore/research -> plan -> implement -> verify; plan mode; iteration; course-correcting; checkpoints
specs: spec-driven development, PRDs, writing tasks/issues for agents, acceptance criteria
prompting: how to talk to agents; being specific; giving examples; asking it to think; tone
verification: tests, TDD, types, linters, screenshots, giving the agent a way to check its own work, closing the loop
code-review: reviewing agent output, PR review, reading diffs, trust, review bottlenecks, AI review bots
tools-mcp: tools, CLIs, MCP servers, integrations, what makes a good tool for an agent
skills-customization: skills, slash commands, hooks, plugins, settings, encoding team knowledge
subagents: delegation, subagents, context isolation, orchestrator/worker
parallel: running many agents at once, git worktrees, multiple sessions, agent teams, merging
autonomy-loops: Ralph loop, long-running agents, background/async agents, headless mode, CI agents, running overnight
harness-engineering: designing the environment/harness around agents, agent-friendly repos & tooling, software factories
codebase: agent-friendly codebases, architecture, code quality, slop, tech debt, docs for agents
evals: evaluating agents/LLM features, error analysis, LLM-as-judge, benchmarks
security: prompt injection, lethal trifecta, sandboxing, permissions, secrets, supply chain
team-org: team adoption, process change, productivity measurement, roles, hiring, company stories
career-skills: what engineers should learn, taste, judgment, staying sharp, skill atrophy, juniors
future: predictions, where this goes, loops/graphs/swarms, autonomy levels
models-cost: model choice, tokens, cost, latency, speed vs quality
other: anything important that fits nowhere else"""
SYSTEM = f"""You are a meticulous research assistant building a free course on AGENTIC ENGINEERING (building software with AI coding agents like Claude Code, Codex, Cursor). You extract the most useful, specific, actionable insights from one talk/interview transcript, with exact quotes and timestamps so every claim in the course can be cited.

TOPIC KEYS (use exactly these):
{TOPICS}

Rules:
- Prefer concrete practices, specific numbers, memorable framings, surprising claims, failure stories, and clear definitions over generic statements. Skip ads, sponsor reads, small talk.
- "quote" MUST be copied VERBATIM from the transcript text (same words, same order; you may trim the start/end, max 45 words). Never paraphrase inside "quote". If no clean quotable sentence exists, use "".
- "t" = the [mm:ss] or [h:mm:ss] timestamp of the paragraph containing the quote, converted to seconds (integer).
- "speaker": who says it (infer from intros/context; e.g. "Boris Cherny (Anthropic, creator of Claude Code)"). If unsure, use the main guest/speaker name, or "host".
- "strength": 3 = essential / course-defining, 2 = solid supporting point, 1 = minor.
- Capture disagreements and caveats too (type "warning" or "counterpoint").
- 12-45 insights depending on length/density.

Return ONLY JSON (no markdown fence):
{{"source":{{"speakers":[{{"name":"","role":""}}],"summary":"2-4 sentences: what this talk is about and its main argument","perspective":"e.g. builder of Claude Code / skeptic senior engineer / startup founder","date_hint":"year if inferable else ''"}},
 "insights":[{{"topic":"<key>","type":"practice|principle|definition|stat|anecdote|warning|counterpoint|prediction|tool","claim":"1-2 sentence paraphrase, specific","quote":"verbatim","t":0,"speaker":"","strength":2}}]}}"""

def fmt_t(s):
    s = int(s); h, m, sec = s // 3600, (s % 3600) // 60, s % 60
    return f"{h}:{m:02d}:{sec:02d}" if h else f"{m:02d}:{sec:02d}"

def paragraphs(tr):
    out, cur, t0 = [], [], None
    for c in tr.get("chunks") or []:
        off = (c.get("offset") or 0) / 1000
        if t0 is None: t0 = off
        cur.append(c["text"].strip())
        if off - t0 >= 25:
            out.append((t0, " ".join(cur))); cur, t0 = [], None
    if cur: out.append((t0 or 0, " ".join(cur)))
    return out

def norm(s): return re.sub(r"[^a-z0-9 ]+", "", re.sub(r"\s+", " ", s.lower().replace("’", "'"))).strip()

def verify(quote, full):
    if not quote: return 0.0
    q = norm(quote)
    if q in full: return 1.0
    # fuzzy: best window match
    words = full.split(" "); n = len(q.split(" "))
    best = 0.0
    qs = q
    for i in range(0, max(1, len(words) - n), max(1, n // 3)):
        w = " ".join(words[i:i + n + 3])
        r = difflib.SequenceMatcher(None, qs, w).ratio()
        if r > best: best = r
    return round(best, 3)

def call(system, prompt, max_tokens=16000):
    body = json.dumps({"model": "anthropic/claude-sonnet-5.5", "system_prompt": system, "prompt": prompt, "max_tokens": max_tokens, "temperature": 0.2, "reasoning": True}).encode()
    for attempt in range(4):
        try:
            req = urllib.request.Request("https://fal.run/openrouter/router", data=body, headers={"Authorization": f"Key {os.environ['FAL_KEY']}", "Content-Type": "application/json", "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) agentic-course/1.0"})
            with urllib.request.urlopen(req, timeout=600) as r:
                j = json.loads(r.read())
            if j.get("error"): raise RuntimeError(j["error"])
            return j
        except Exception as e:
            print("  retry", attempt, str(e)[:200], file=sys.stderr, flush=True); time.sleep(10 * (attempt + 1))
    raise RuntimeError("llm failed")

def run_article(slug):
    out = f"{R}/research/insights/article-{slug}.json"
    if os.path.exists(out): return f"skip {slug}"
    md = open(f"{R}/sources/articles/{slug}.md").read()
    m = re.search(r"^title: (.*)$", md, re.M); title = m.group(1).strip() if m else slug
    m = re.search(r"^url: (.*)$", md, re.M); url = m.group(1).strip() if m else ""
    m = re.search(r"^date: (.*)$", md, re.M); date = m.group(1).strip() if m else ""
    body = md[:180000]
    prompt = f"ARTICLE: \"{title}\" — {url} — published {date}\n\nTEXT:\n{body}\n\nExtract the insights now (t = 0 for articles; speaker = the author). JSON only."
    j = call(SYSTEM.replace("talk/interview transcript", "article or guide"), prompt)
    raw = j["output"].strip()
    raw = re.sub(r"^```(json)?|```$", "", raw).strip()
    raw = raw[raw.find("{"): raw.rfind("}") + 1]
    try:
        data = json.loads(raw)
    except Exception:
        from json_repair import repair_json
        data = json.loads(repair_json(raw))
    full = norm(md)
    for ins in data.get("insights", []):
        ins["qscore"] = verify(ins.get("quote", ""), full); ins["t"] = None
    data["article"] = {"slug": slug, "title": title, "url": url, "date": date}
    data["usage"] = j.get("usage")
    json.dump(data, open(out, "w"), indent=1)
    bad = sum(1 for i in data["insights"] if i.get("quote") and i["qscore"] < 0.85)
    return f"ok article {slug} insights={len(data['insights'])} badquotes={bad} cost=${(j.get('usage') or {}).get('cost', 0):.3f}"

def run(vid):
    if vid.startswith("article:"): return run_article(vid[8:])
    out = f"{R}/research/insights/{vid}.json"
    if os.path.exists(out): return f"skip {vid}"
    tr = json.load(open(f"{R}/sources/transcripts/{vid}.json"))
    meta = CANDS.get(vid, {})
    paras = paragraphs(tr)
    text = "\n".join(f"[{fmt_t(t)}] {p}" for t, p in paras)
    if len(text) > 400000: text = text[:400000]
    prompt = f"VIDEO: \"{meta.get('title')}\" — channel: {meta.get('channel')} — duration {fmt_t(meta.get('duration') or 0)}\nURL: https://www.youtube.com/watch?v={vid}\n\nTRANSCRIPT:\n{text}\n\nExtract the insights now. JSON only."
    j = call(SYSTEM, prompt)
    raw = j["output"].strip()
    raw = re.sub(r"^```(json)?|```$", "", raw).strip()
    raw = raw[raw.find("{"): raw.rfind("}") + 1]
    try:
        data = json.loads(raw)
    except Exception:
        from json_repair import repair_json
        data = json.loads(repair_json(raw))
    full = norm(" ".join(p for _, p in paras))
    for ins in data.get("insights", []):
        ins["qscore"] = verify(ins.get("quote", ""), full)
    data["video"] = {"id": vid, "title": meta.get("title"), "channel": meta.get("channel"), "duration": meta.get("duration"), "views": meta.get("view_count"), "url": f"https://www.youtube.com/watch?v={vid}"}
    data["usage"] = j.get("usage")
    json.dump(data, open(out, "w"), indent=1)
    bad = sum(1 for i in data["insights"] if i.get("quote") and i["qscore"] < 0.85)
    return f"ok {vid} insights={len(data['insights'])} badquotes={bad} cost=${(j.get('usage') or {}).get('cost', 0):.3f}"

if __name__ == "__main__":
    if sys.argv[1:] == ["--articles"]:
        ids = ["article:" + f[:-3] for f in sorted(os.listdir(f"{R}/sources/articles")) if f.endswith(".md") and os.path.getsize(f"{R}/sources/articles/{f}") > 1500]
    else:
      ids = sys.argv[1:] or [l.strip() for l in open(f"{R}/sources/selected.txt") if l.strip() and os.path.exists(f"{R}/sources/transcripts/{l.strip()}.json")]
    def safe(v):
        for attempt in range(2):
            try: return run(v)
            except Exception as e: err = e
        return f"FAIL {v} {str(err)[:200]}"
    with ThreadPoolExecutor(3) as ex:
        for r in ex.map(safe, ids):
            print(r, flush=True)
