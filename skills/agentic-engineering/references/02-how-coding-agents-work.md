# How a coding agent actually works

Claude Code, Codex, Cursor and Amp look different, but underneath they're the same thing: a model, a few tools, and a while loop. Once you see the loop, you'll understand why agents succeed, why they fail, and what you control.

## Key ideas

- An agent is a model using tools in a loop: it asks for a tool, the harness runs it, the result goes back in, repeat until done.
- Tool calls are just JSON. The model never runs anything itself; ordinary code (the harness) does.
- The model is stateless. Everything it knows about your task is in its context window: system prompt, tools, memory files, your messages and every tool result.
- Errors compound over steps. At 95% accuracy per step, a 10-step task succeeds about 60% of the time.
- Agents don't push back on vague requests. They guess confidently, so what you put in the context decides what comes out.

## Practices for agents

- Before acting on a conclusion like 'this doesn't exist yet', double-check with a broader search; a narrow search result is not proof of absence.
- Keep the context relevant: read what the task needs, not everything.
- Prefer small, verifiable steps over long unverified chains; check results between steps because errors compound.
- When a request is ambiguous, ask a clarifying question instead of guessing.

Full lesson (Markdown): https://learn-agentic-engineering.pages.dev/lessons/how-coding-agents-work.md
Video: https://learn-agentic-engineering.pages.dev/lessons/how-coding-agents-work/
