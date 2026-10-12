# CLAUDE.md and AGENTS.md: memory files that work

Your agent starts every session with amnesia. A memory file, CLAUDE.md or AGENTS.md, is how it learns your project: commands, conventions and gotchas. The best ones are short, grown from real mistakes, pruned as models improve, and shared with the team.

## Key ideas

- AGENTS.md (or CLAUDE.md) is a README for agents, loaded at the start of every session.
- Put in what the agent can't infer: build and test commands, conventions, gotchas, where things live.
- Keep it short. For each line ask: would removing this cause mistakes? If not, cut it.
- Grow it from real mistakes, and prune it as models improve.
- Make it a map, not an encyclopedia: link to deeper docs and use nested files in subprojects.

## Practices for agents

- Read the project's memory file (AGENTS.md / CLAUDE.md) and any nested ones before working in a directory.
- When the user corrects a repeated mistake, propose a one-line addition to the memory file.
- Keep memory-file additions short and specific; prefer linking to docs over pasting them.
- Point out memory-file instructions that seem outdated or contradictory instead of silently ignoring them.

Full lesson (Markdown): https://learn-agentic-engineering.pages.dev/lessons/claude-md-agents-md-memory-files.md
Video: https://learn-agentic-engineering.pages.dev/lessons/claude-md-agents-md-memory-files/
