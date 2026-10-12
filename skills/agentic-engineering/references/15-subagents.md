# Subagents: delegate to a fresh context

A subagent is a fresh copy of your agent, sent off with its own context window to do messy work and report back only the answer. Used for context control, not role-play, subagents keep your main session sharp: exploring, running noisy tests, reviewing with fresh eyes, or trying several designs at once.

## Key ideas

- A subagent is a fresh copy of the agent with its own context window; only its summary comes back.
- Subagents are for context control, not role-play personas.
- Great uses: exploring a codebase, running verbose tests, fresh-eyes review, trying several designs in parallel.
- Parallel subagents shine on breadth-first work; most coding tasks have fewer independent pieces.
- Don't over-split: handoffs between agents are a common failure point.

## Practices for agents

- Delegate token-heavy searching and reading to a subagent and keep only its summary in the main context.
- Give subagents a complete, self-contained brief: goal, scope, what to return and in what format.
- Use a fresh subagent with no stake in the code to review your own changes.
- Have subagents write large outputs to files and return paths, not paste everything back.

Full lesson (Markdown): https://learn-agentic-engineering.pages.dev/lessons/subagents.md
Video: https://learn-agentic-engineering.pages.dev/lessons/subagents/
