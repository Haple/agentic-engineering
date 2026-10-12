#!/usr/bin/env python3
"""Compact research brief for writing a lesson. usage: brief.py topic[,topic2] [--min 3] [--grep REGEX] [--limit N] [--sid ID]"""
import json, glob, os, re, sys, argparse
R = os.path.expanduser("~/agentic-engineering")
ap = argparse.ArgumentParser(); ap.add_argument("topics"); ap.add_argument("--min", type=int, default=3); ap.add_argument("--grep"); ap.add_argument("--limit", type=int, default=120); ap.add_argument("--sid")
a = ap.parse_args()
cat = json.load(open(f"{R}/research/sources.json"))
topics = set(a.topics.split(",")) if a.topics != "all" else None
rows = []
for f in glob.glob(f"{R}/research/insights/*.json"):
    d = json.load(open(f)); sid = d["video"]["id"] if "video" in d else "article-" + d["article"]["slug"]
    if a.sid and a.sid not in sid: continue
    for i, ins in enumerate(d.get("insights", [])):
        if topics and ins.get("topic") not in topics: continue
        if (ins.get("strength") or 1) < a.min: continue
        txt = (ins.get("claim", "") + " " + ins.get("quote", ""))
        if a.grep and not re.search(a.grep, txt, re.I): continue
        rows.append((ins, sid, i))
rows.sort(key=lambda r: (-(r[0].get("strength") or 1), r[1]))
def tsec(v):
    if isinstance(v, (int, float)): return int(v)
    m = re.match(r"^\s*(\d+)", str(v or "")); return int(m.group(1)) if m else None
for ins, sid, i in rows[: a.limit]:
    s = cat.get(sid, {}); t = tsec(ins.get("t"))
    q = ins.get("quote") or ""; ok = (ins.get("qscore") or 0) >= 0.9
    print(f"* {ins.get('claim')}\n  Q{'' if ok else '?'}: {q}\n  - {ins.get('speaker')} | {s.get('title','')[:70]} | {sid}{('@'+str(t)) if t else ''}")
print(f"\n[{len(rows)} rows, showing {min(len(rows), a.limit)}]")
