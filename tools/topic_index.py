#!/usr/bin/env python3
"""research/insights/*.json -> research/by-topic/<topic>.md (ranked, cited) + research/sources.json (catalog)."""
import json, os, glob, collections, re
R = os.path.expanduser("~/agentic-engineering")
by = collections.defaultdict(list); cat = {}; cost = 0
for f in sorted(glob.glob(f"{R}/research/insights/*.json")):
    d = json.load(open(f)); cost += (d.get("usage") or {}).get("cost", 0) or 0
    if "video" in d:
        v = d["video"]; sid = v["id"]
        cat[sid] = {"kind": "talk", "id": sid, "title": v["title"], "channel": v["channel"], "url": v["url"], "duration": v.get("duration"), "views": v.get("views"), "speakers": d["source"].get("speakers", []), "summary": d["source"].get("summary"), "perspective": d["source"].get("perspective"), "date": d["source"].get("date_hint")}
    else:
        a = d["article"]; sid = "article-" + a["slug"]
        cat[sid] = {"kind": "article", "id": sid, "title": a["title"], "url": a["url"], "date": a.get("date"), "speakers": d["source"].get("speakers", []), "summary": d["source"].get("summary"), "perspective": d["source"].get("perspective")}
    for i, ins in enumerate(d.get("insights", [])):
        ins = dict(ins); ins["sid"] = sid; ins["iid"] = f"{sid}#{i}"
        by[ins.get("topic", "other")].append(ins)
# every fetched article is a source, even if extraction found little in it
MANUAL = {"anthropic-2026-agentic-coding-trends": {"title": "2026 Agentic Coding Trends Report", "url": "https://resources.anthropic.com/2026-agentic-coding-trends-report", "date": "2026", "speakers": [{"name": "Anthropic", "role": "report"}]},
          "karpathy-vibe-coding-retrospective": {"speakers": [{"name": "Andrej Karpathy", "role": "post on X"}], "title": "Vibe coding, one year later (post on X)"},
          "metr-dev-productivity": {"speakers": [{"name": "METR", "role": "research"}]},
          "humanlayer-12-factor-agents": {"title": "12-Factor Agents: patterns for reliable LLM applications", "url": "https://github.com/humanlayer/12-factor-agents"},
          "humanlayer-ace-fca": {"title": "Advanced Context Engineering for Coding Agents", "url": "https://github.com/humanlayer/advanced-context-engineering-for-coding-agents/blob/main/ace-fca.md"},
          "ball-how-to-build-an-agent": {"speakers": [{"name": "Thorsten Ball", "role": "Amp"}]},
          "anthropic-claude-code-best-practices": {"title": "Best practices for Claude Code"}, "metr-long-tasks": {"speakers": [{"name": "METR", "role": "research"}]}}
for f in sorted(glob.glob(f"{R}/sources/articles/*.md")):
    slug = os.path.basename(f)[:-3]; sid = "article-" + slug
    txt = open(f, errors="ignore").read(3000)
    title = re.search(r"^title: (.*)$", txt, re.M); url = re.search(r"^url: (.*)$", txt, re.M); date = re.search(r"^date: (.*)$", txt, re.M)
    base = cat.get(sid, {"kind": "article", "id": sid, "speakers": []})
    base.setdefault("title", title.group(1).strip() if title else slug); base.setdefault("url", url.group(1).strip() if url else "")
    if date and not base.get("date"): base["date"] = date.group(1).strip()
    for k, v in MANUAL.get(slug, {}).items(): base[k] = v
    cat[sid] = base
for s in cat.values():
    s["speakers"] = [p for p in (s.get("speakers") or []) if p.get("name") and not re.search(r"\bhost\b|interviewer|moderator", (p.get("name","") + " " + p.get("role","")), re.I)]
json.dump(cat, open(f"{R}/research/sources.json", "w"), indent=1)
import re
def tsec(v):
    if v is None: return None
    if isinstance(v, (int, float)): return int(v)
    m = re.match(r"^\s*(\d+)", str(v)); return int(m.group(1)) if m else None
def link(ins):
    s = cat[ins["sid"]]
    t = tsec(ins.get("t"))
    if s["kind"] == "talk" and t: return f'{s["url"]}&t={t}s'
    return s["url"]
for topic, items in by.items():
    items.sort(key=lambda x: (-(x.get("strength") or 1), x["sid"]))
    out = [f"# {topic} ({len(items)} insights)\n"]
    for ins in items:
        s = cat[ins["sid"]]
        q = ins.get("quote") or ""
        qs = ins.get("qscore", 0)
        out.append(f'- [{ins.get("strength")}|{ins.get("type")}] {ins.get("claim")}\n  > "{q}" ({"verified" if qs >= .9 else "UNVERIFIED" if q else "no quote"})\n  — {ins.get("speaker")} · {s["title"][:80]} · {link(ins)} · id={ins["iid"]}')
    open(f"{R}/research/by-topic/{topic}.md", "w").write("\n".join(out) + "\n")
print("sources", len(cat), "talks", sum(1 for s in cat.values() if s["kind"]=="talk"), "articles", sum(1 for s in cat.values() if s["kind"]=="article"), "cost $%.2f" % cost)
for t, items in sorted(by.items(), key=lambda kv: -len(kv[1])):
    print(f"{t:28} {len(items):4}  s3={sum(1 for i in items if i.get('strength')==3)}")
