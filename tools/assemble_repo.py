#!/usr/bin/env python3
"""Assemble the public GitHub repo at ~/agentic-engineering-public from the working project."""
import json, os, re, shutil, subprocess, glob
W = os.path.expanduser("~/agentic-engineering"); P = os.path.expanduser("~/agentic-engineering-public")
SITE = "https://learn-agentic-engineering.pages.dev"; REPO = "https://github.com/Haple/agentic-engineering"
course = json.load(open(f"{W}/course/course.json"))
cat = json.load(open(f"{W}/research/sources.json"))
os.makedirs(P, exist_ok=True)
def copytree(src, dst, ignore=None):
    if os.path.exists(dst): shutil.rmtree(dst)
    shutil.copytree(src, dst, ignore=ignore)
# --- site source (no build output, no audio) ---
copytree(f"{W}/site/static", f"{P}/site/static", ignore=shutil.ignore_patterns("audio"))
shutil.copy(f"{W}/site/build.mjs", f"{P}/site/build.mjs")
copytree(f"{W}/site/dev", f"{P}/site/dev")
# --- course sources ---
copytree(f"{W}/course", f"{P}/course", ignore=shutil.ignore_patterns("test"))
os.makedirs(f"{P}/research", exist_ok=True); shutil.copy(f"{W}/research/sources.json", f"{P}/research/sources.json")
# --- tools ---
os.makedirs(f"{P}/tools", exist_ok=True)
for f in ["voice.mjs", "stills.mjs", "og.mjs", "shot.mjs", "fake_timing.mjs", "make_lesson.sh", "search_sources.py", "extract_insights.py", "topic_index.py", "brief.py", "assemble_repo.py", "capture.mjs"]:
    if os.path.exists(f"{W}/tools/{f}"): shutil.copy(f"{W}/tools/{f}", f"{P}/tools/{f}")
# --- lessons markdown (from the built site) ---
os.makedirs(f"{P}/lessons", exist_ok=True)
lessons = []
for m in course["modules"]:
    for l in m["lessons"]:
        lessons.append({**l, "module": m["title"]})
for i, l in enumerate(lessons, 1):
    src = f"{W}/site/dist/lessons/{l['slug']}.md"
    if os.path.exists(src): shutil.copy(src, f"{P}/lessons/{i:02d}-{l['slug']}.md")
# --- skills + plugin ---
copytree(f"{W}/agent/skills", f"{P}/skills")
refdir = f"{P}/skills/agentic-engineering/references"; os.makedirs(refdir, exist_ok=True)
strip = lambda s: re.sub(r"\*\*(.+?)\*\*|\*(.+?)\*", lambda m: m.group(1) or m.group(2), s)
for i, l in enumerate(lessons, 1):
    a = json.load(open(f"{W}/course/lessons/{l['id']}.json"))
    lines = [f"# {a['title']}", "", strip(a["summary"]), "", "## Key ideas", ""] + [f"- {strip(x)}" for x in a.get("takeaways", [])]
    lines += ["", "## Practices for agents", ""] + [f"- {strip(x)}" for x in a.get("practices", [])]
    lines += ["", f"Full lesson (Markdown): {SITE}/lessons/{l['slug']}.md", f"Video: {SITE}/lessons/{l['slug']}/", ""]
    open(f"{refdir}/{i:02d}-{l['slug']}.md", "w").write("\n".join(lines))
os.makedirs(f"{P}/.claude-plugin", exist_ok=True)
json.dump({"name": "agentic-engineering", "description": "The Agentic Engineering course as skills: working practices for coding agents, an interactive tutor for the 24-lesson course, and a repo audit.", "version": "1.0.0", "author": {"name": "Agentic Engineering course", "url": REPO}, "homepage": SITE, "repository": REPO, "license": "CC-BY-4.0", "keywords": ["agentic-engineering", "skills", "claude-code", "course", "best-practices"]}, open(f"{P}/.claude-plugin/plugin.json", "w"), indent=2)
json.dump({"name": "agentic-engineering", "owner": {"name": "Agentic Engineering course", "url": REPO}, "metadata": {"description": "Free course on building software with AI coding agents, packaged as skills.", "version": "1.0.0"}, "plugins": [{"name": "agentic-engineering", "source": "./", "description": "Working practices for coding agents + interactive course tutor + repo audit, from the free Agentic Engineering course.", "version": "1.0.0", "category": "development", "homepage": SITE}]}, open(f"{P}/.claude-plugin/marketplace.json", "w"), indent=2)
# --- README ---
data = {}
for l in lessons:
    f = f"{W}/site/static/data/{l['id']}.json"
    if os.path.exists(f): data[l["id"]] = json.load(open(f))
total_min = round(sum(d["total"] for d in data.values()) / 60)
talks = sum(1 for s in cat.values() if s["kind"] == "talk"); arts = sum(1 for s in cat.values() if s["kind"] == "article")
rows = []
n = 0
for mi, m in enumerate(course["modules"], 1):
    rows.append(f"\n### Module {mi} · {m['title']}\n\n{m['blurb']}\n\n| # | Lesson | Watch | Read | Length |\n|---|---|---|---|---|")
    for l in m["lessons"]:
        n += 1; d = data.get(l["id"]); mins = f"{round(d['total']/60)} min" if d else "–"
        rows.append(f"| {n:02d} | **{l['title']}** | [▶ watch]({SITE}/lessons/{l['slug']}/) | [markdown](lessons/{n:02d}-{l['slug']}.md) | {mins} |")
speakers = []
for name in ["Andrej Karpathy", "Boris Cherny", "Simon Willison", "Kent Beck", "Mitchell Hashimoto", "Martin Fowler", "Dex Horthy", "Matt Pocock", "Thorsten Ball", "Cat Wu", "Thariq Shihipar", "Ryan Lopopolo", "Peter Steinberger", "Armin Ronacher", "Geoffrey Huntley", "Hamel Husain", "Shreya Shankar", "Charity Majors", "DHH", "Lauren Tan", "Barry Zhang", "Addy Osmani", "Andrew Ng", "Steve Yegge", "Clare Liguori", "Daisy Hollman", "Mario Zechner", "Theo Browne"]:
    speakers.append(name)
readme = f"""<p align="center"><a href="{SITE}"><img src="site/static/img/og/og-default.png" alt="Agentic Engineering — free animated course" width="760"></a></p>

<h1 align="center">Agentic Engineering</h1>
<p align="center"><b>A free, animated course on building real software with AI coding agents.</b><br>
Claude Code · Codex · Cursor · Copilot · Amp · any agent.<br>
{len(lessons)} short lessons · ~{total_min} minutes · distilled from {talks} talks and {arts} articles · every claim linked to its source.</p>

<p align="center">
<a href="{SITE}/lessons/vibe-coding-to-agentic-engineering/"><b>▶ Start lesson 1</b></a> ·
<a href="#lessons">All lessons</a> ·
<a href="#your-agent-can-take-this-course-too">For your agent</a> ·
<a href="{SITE}/sources/">Sources</a> ·
<a href="{SITE}/llms.txt">llms.txt</a>
</p>

---

**Agentic engineering** is Andrej Karpathy's name for the professional version of vibe coding: agents write and run the code, and you keep the quality bar. Since late 2025 coding agents do what you ask almost every time, and the people who build them now ship most of their code this way. This course teaches the workflow they actually use.

It's built from the talks, interviews and essays of people like {", ".join(speakers[:-1])} and {speakers[-1]}. Not affiliated with or endorsed by any of them.

## What you'll learn

- **How agents work** — the loop, tool calls, context windows, and why agents are jagged geniuses
- **The core workflow** — explore → plan → implement → verify, specs, prompting, and closing the loop with real checks
- **Your toolkit** — AGENTS.md / CLAUDE.md memory files, CLIs vs MCP, skills, commands, hooks, git as a safety net
- **Scaling up** — subagents, parallel agents with worktrees, Ralph loops and long-running agents, harness engineering
- **Quality, safety, teams** — agent-friendly codebases, evals, prompt injection and the lethal trifecta, team adoption
- **The engineer you become** — which skills lose value, which compound, and what comes next

Each lesson is a 3–5 minute animated video, a full transcript, a quiz, a hands-on "try it with your agent" prompt, and cited sources.

## Your agent can take this course too

The course ships as **agent skills**, so your coding agent follows the same practices you learn:

```bash
npx skills add Haple/agentic-engineering
```

Or in Claude Code, as a plugin marketplace:

```text
/plugin marketplace add Haple/agentic-engineering
/plugin install agentic-engineering@agentic-engineering
```

| Skill | What it does |
|---|---|
| [`agentic-engineering`](skills/agentic-engineering/SKILL.md) | Working practices for any non-trivial coding task: explore before editing, plan in verifiable slices, verify with real checks, keep context clean, stay safe. |
| [`agentic-engineering-tutor`](skills/agentic-engineering-tutor/SKILL.md) | Teaches you the course inside your agent: *"teach me lesson 4"*, *"quiz me on evals"*, *"next lesson"*. |
| [`agentic-engineering-audit`](skills/agentic-engineering-audit/SKILL.md) | Audits your repo's agent setup (memory files, feedback loops, skills, hooks, security) and fixes the top gaps. |

Agents can also read the whole course directly: [`/llms.txt`]({SITE}/llms.txt) · [`/llms-full.txt`]({SITE}/llms-full.txt) · [`/api/course.json`]({SITE}/api/course.json) · or any lesson in [`lessons/`](lessons/).

## Lessons
{chr(10).join(rows)}

## How it was made

A course about building with agents, built with agents:

1. **Sources.** {talks} talks and interviews (transcripts) and {arts} written guides on agentic coding from 2025–2026.
2. **Distillation.** A model extracted ~3,000 specific, citable insights, each with a verbatim quote and timestamp, automatically checked against the transcript.
3. **Writing.** Lessons were written from those insights by Claude, with every source attached; claims and numbers were checked against the source text.
4. **Animation.** The lessons are **not video files**. Each is a JSON list of scenes (terminals, diffs, diagrams, charts, quizzes) rendered live by a small GSAP engine ([`site/static/js`](site/static/js)) and synced word-by-word to an AI voice. That makes them tiny, crisp at any size, scrubbable, and responsive: 16:9 on desktop, 9:16 on phones.

Found a mistake? [Open an issue]({REPO}/issues) with the lesson and timestamp. Every claim links to its source, so corrections are easy to check.

## Run it locally

```bash
node site/build.mjs          # builds site/dist from course/ + site/static/data
cd site/dist && python3 -m http.server 8000
```

Narration audio isn't stored in git; regenerate it with `tools/voice.mjs` (needs a fal.ai key) or use the hosted site.

## License

Course content: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Code: MIT. Quotes belong to their speakers and link to the original talks.

If this helped you, ⭐ the repo and share it with a teammate. That's how free courses find people.
"""
open(f"{P}/README.md", "w").write(readme)
open(f"{P}/LICENSE", "w").write("""MIT License

Copyright (c) 2026 Agentic Engineering course contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Course content (lessons, scripts, transcripts, skills text) is licensed under Creative Commons Attribution 4.0 International (CC BY 4.0): https://creativecommons.org/licenses/by/4.0/
""")
open(f"{P}/AGENTS.md", "w").write(f"""# Agentic Engineering course repo

- Lessons are authored as JSON in `course/lessons/NN-*.json` (scenes: template + narration + params). `course/course.json` defines modules and order.
- Narration: `node tools/voice.mjs course/lessons/<id>.json` (needs FAL_KEY) writes `site/static/data/<id>.json` (timed) and `site/static/audio/<id>.mp3`.
- Build: `node site/build.mjs` → `site/dist`. QA stills: serve `.serve/` and run `node tools/stills.mjs /data/<id>.json <outdir>`.
- Scene templates live in `site/static/js/templates.js`; styles in `site/static/css/lesson.css` (scoped under `.stage`).
- Keep claims sourced: every lesson lists `sources` (talk ids with timestamps or article ids from `research/sources.json`). Quotes must be verbatim.
- Skills for agents are in `skills/`; `skills/agentic-engineering/references/` is generated by `tools/assemble_repo.py`.
""")
open(f"{P}/.gitignore", "w").write("site/dist/\nsite/static/audio/\nnode_modules/\n.serve/\n*.raw.png\n__pycache__/\n")
print("assembled", P, "lessons", len(lessons), "minutes", total_min)
