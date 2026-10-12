---
name: agentic-engineering-audit
description: Audit how ready a repository is for AI coding agents and fix the top gaps - memory files (AGENTS.md / CLAUDE.md), verification commands, tests/types/lints as feedback loops, skills, commands and hooks, git and parallel-work habits, codebase consistency, and agent security (the lethal trifecta). Use when asked to "set up this repo for coding agents", "audit our AI coding setup", "make this codebase agent-friendly", or "what should our AGENTS.md say".
license: CC-BY-4.0
metadata:
  course: https://learn-agentic-engineering.pages.dev
---

# Agentic engineering audit

Audit the current repository against the practices from the Agentic Engineering course, then propose (and, with permission, implement) the highest-leverage fixes. Read-only until the user approves changes.

## Checklist (score each: ✅ good · ⚠️ partial · ❌ missing)

**1. Memory file** (lesson 11)
- `AGENTS.md` and/or `CLAUDE.md` exists at the root; nested files for big subprojects.
- Contains what an agent can't infer: build, test and *single-test* commands; non-obvious conventions; gotchas; where things live.
- Short (aim for well under ~150 lines); links to deeper docs instead of inlining them; no stale or contradictory rules.

**2. Feedback loops** (lessons 8, 19)
- A fast, reliable test command; type checking; linting; all documented.
- Flaky or very slow tests identified.
- The agent can run the real app/CLI and observe it (logs, a browser for UI, debug output).

**3. Codebase consistency** (lesson 19)
- One obvious way to do each common thing (data access, endpoints, jobs, errors). List places with several competing patterns.
- Architecture boundaries that matter are enforced by tooling, not just documented.

**4. Skills, commands, hooks** (lesson 13)
- Repeated workflows captured as skills (`.claude/skills/*/SKILL.md` or equivalent) with precise descriptions.
- Must-always-happen steps (formatting, blocking dangerous commands) implemented as hooks, not prompt instructions.
- Shared settings and permissions checked into the repo.

**5. Git and parallel work** (lessons 14, 16)
- Main branch protected; work happens on branches; small PRs.
- Worktree- or sandbox-friendly setup (no hard-coded paths or shared local state that breaks with two checkouts).

**6. Security** (lesson 21)
- Map the lethal trifecta: private data the agent can reach, untrusted content it reads, outbound channels. Flag any setup with all three.
- Secrets kept out of the agent's reach (no secrets in tracked files; `.env` excluded); scoped, short-lived credentials; sandboxing/network allowlists where agents run unattended.
- MCP servers and third-party skills reviewed before use.

## Output
1. A scored table of the six areas with one-line evidence each (file paths, commands).
2. The **top 3 fixes**, ranked by leverage, each with concrete first steps.
3. Offer to implement them one at a time, starting with the memory file and the verification commands, verifying each change.

Course reference for any item: https://learn-agentic-engineering.pages.dev/llms.txt

## Example
**"Audit this repo for coding agents."** You read the repo and reply with a table like this one:

| Area | Score | Evidence |
|---|---|---|
| Memory file | ⚠️ | `CLAUDE.md` is 340 lines, half of it style rules a linter could enforce |
| Feedback loops | ❌ | no documented single-test command; the e2e suite takes 14 minutes |
| Security | ⚠️ | `.env` with live keys is readable, and the agent has unrestricted network access |

Then the top three fixes, for example: (1) cut `CLAUDE.md` to the commands and gotchas, (2) add `npm run test:one <file>` and document it, (3) move secrets out of the agent's reach and allowlist the domains it needs. Finally, offer to do the first one.
