# Lesson 11: CLAUDE.md and AGENTS.md: memory files that work

> Your agent starts every session with amnesia. A memory file, CLAUDE.md or AGENTS.md, is how it learns your project: commands, conventions and gotchas. The best ones are short, grown from real mistakes, pruned as models improve, and shared with the team.

Course: Agentic Engineering — https://learn-agentic-engineering.pages.dev/ · Module 3: Your toolkit · 4 min · Watch: https://learn-agentic-engineering.pages.dev/lessons/claude-md-agents-md-memory-files/

## Key takeaways

- AGENTS.md (or CLAUDE.md) is a README for agents, loaded at the start of every session.
- Put in what the agent can't infer: build and test commands, conventions, gotchas, where things live.
- Keep it short. For each line ask: would removing this cause mistakes? If not, cut it.
- Grow it from real mistakes, and prune it as models improve.
- Make it a map, not an encyclopedia: link to deeper docs and use nested files in subprojects.

## Practices for coding agents

- Read the project's memory file (AGENTS.md / CLAUDE.md) and any nested ones before working in a directory.
- When the user corrects a repeated mistake, propose a one-line addition to the memory file.
- Keep memory-file additions short and specific; prefer linking to docs over pasting them.
- Point out memory-file instructions that seem outdated or contradictory instead of silently ignoring them.

## Lesson transcript


### Intro (0:01)

Your agent wakes up with amnesia at the start of every session. It doesn't remember your build command, your conventions, or the mistake it made yesterday. One small file fixes that.

### What it is (0:13)

The community standard calls AGENTS.md a README for agents: a predictable place for the instructions a coding agent needs. Claude Code reads CLAUDE.md the same way. It's loaded automatically at the start of every session. Big repos can add nested files in subfolders, and you can keep a personal one for your own preferences.

### What goes in (0:34)

What goes in it? Only what the agent can't figure out by itself. How to build and test, including how to run a single test. Conventions you can't infer from the code. Gotchas that have bitten you before. And pointers to where things live.

### Keep it short (0:51)

The most common mistake is making it too long. Anthropic's guide suggests a brutal test. For each line, ask: would removing this cause the agent to make mistakes? If not, cut it. Bloated files cause the agent to ignore your actual instructions.
There's a reason. Dex Horthy notes that frontier models can only follow roughly a hundred and fifty to two hundred instructions with good consistency. Beyond that, they're half attending to all of them. And your memory file shares that budget with the system prompt, the tools and your request.

### Grow it from mistakes (1:27)

So how do you write a good one? Don't write it all up front. Grow it from real mistakes. Mitchell Hashimoto says every line in Ghostty's agents file is based on a bad agent behavior, and together they almost completely resolved them. Boris Cherny's habit is the same: when the agent slips, tell it to add the lesson to the file.

### Prune it (1:49)

Then prune it, because models keep improving. A rule that was essential six months ago can over-constrain today's model. Thariq Shihipar from the Claude Code team expects memory files to shrink over time, and the team itself cut most of Claude Code's own system prompt for newer models.

### A map, not an encyclopedia (2:08)

For big projects, think of the file as a map. OpenAI's harness engineering team keeps a top-level agents file of about a hundred lines that works as a table of contents, pointing to deeper documents like architecture and design notes. The agent reads those only when it needs them.

### Trails (2:26)

Thorsten Ball calls nested files trails. Drop a small agents file into a subfolder, and the agent picks it up when it works there. The billing package can carry its own rules without cluttering everything else.

### Team habits (2:40)

Two team habits. Check the file into the repo, so everyone benefits from every lesson; Boris calls it a network effect. And don't copy a stranger's giant setup. Birgitta Böckeler warns you'll inherit contradictions you can't see, and then blame the agent for following them.

### Quick check (2:58)

**Quiz:** Your memory file is 900 lines and the agent ignores half of it. Best fix?
A. Add IMPORTANT to every rule
B. Cut it to what prevents real mistakes; link out to deeper docs
C. Split it into three files that all load at startup
D. Switch to a model with a bigger context window
Answer: B — Too much guidance becomes no guidance. Keep what prevents mistakes; load the rest only when needed.


### Try it (3:13)

Let your agent audit its own memory file. This prompt asks it to justify every line and propose a short version that links out to deeper docs.

```text
Read our AGENTS.md / CLAUDE.md (create one if missing).
For each line, say whether removing it would make you err.
Propose a version under 60 lines: commands (incl. single test), conventions you can't infer, gotchas. Link out to deeper docs.
```


### Recap (3:23)

Recap. A memory file is a README for agents. Fill it with what the agent can't infer. Keep it short, grow it from real mistakes, and prune it as models improve. Make it a map, and share it with your team. Next: giving your agent new abilities with tools and MCP.

## Sources

- AGENTS.md maintainers (OpenAI Codex, Amp, Jules, Cursor, Factory; now Agentic AI Foundation / Linux Foundation) — AGENTS.md: https://agents.md/
- Boris Cherny — Mastering Claude Code in 30 minutes (at 12:47, 13:33, 17:38): https://www.youtube.com/watch?v=6eBSHbLKuN0&t=767s
- Anthropic (Claude Code team) — Best practices for Claude Code: https://www.anthropic.com/engineering/claude-code-best-practices
- Dex Horthy — Everything We Got Wrong About Research-Plan-Implement -  Dexter Horthy (at 7:59): https://www.youtube.com/watch?v=YwZR6tc7qYg&t=479s
- Mitchell Hashimoto — My AI Adoption Journey: https://mitchellh.com/writing/my-ai-adoption-journey
- Boris Cherny, Cat Wu — The Secrets of Claude Code From the Engineers Who Built It (at 31:52): https://www.youtube.com/watch?v=IDSAMqip6ms&t=1912s
- Thariq Shihipar — Claude Code’s Bitter Lesson: Prompts, Harnesses, Mods, and Agents — Thariq Shihipar (at 30:14): https://www.youtube.com/watch?v=IZAlq-V19U8&t=1814s
- Ryan Lopopolo — Harness engineering: leveraging Codex in an agent-first world: https://businessdatasolutions.github.io/ai-wiki/sources/2026-02-11-lopopolo-codex-harness-engineering
- Thorsten Ball — Think Harder: How I Prompt | Thorsten Ball at Laracon US 2026 (at 21:53): https://www.youtube.com/watch?v=HegqGzD-kvc&t=1313s
- Birgitta Böckeler — Context Engineering for Coding Agents: https://martinfowler.com/articles/exploring-gen-ai/context-engineering-coding-agents.html
- Brendan O'Leary — Agentic Engineering: Working With AI, Not Just Using It — Brendan O'Leary (at 19:35): https://www.youtube.com/watch?v=BEKc4P87XKo&t=1175s

License: CC BY 4.0 · https://github.com/Haple/agentic-engineering
