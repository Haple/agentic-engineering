# Talking to agents

Good prompts aren't clever. They answer one question: how is the model supposed to know what I mean? Learn the habits of people who prompt agents all day: point to where knowledge lives, show a gold standard, state constraints and exit criteria, and use the short phrases that carry a lot of discipline.

## Key ideas

- Ask of every prompt: how is the model supposed to know what I mean? Training data, the codebase, the context, or me?
- Point to where knowledge lives: files, folders, docs, screenshots, a working example to imitate.
- Describe the task, the guardrails and the exit criteria, then let the agent work. Don't script every step.
- Short phrases like “first run the tests” or “use red/green TDD” carry a lot of built-in discipline.
- You can just talk to it: ask why, push back, ask it to simplify, ask it to ask you questions.

## Practices for agents

- At the start of a session in an existing project, find and run the test suite before changing code.
- When a request points to a reference implementation or existing pattern, study it and match it.
- If the request lacks information you can't find in the codebase, ask; don't invent the missing intent.
- State explicit constraints back before starting (what must not change), and confirm the exit criteria.

Full lesson (Markdown): https://learn-agentic-engineering.pages.dev/lessons/prompting-coding-agents.md
Video: https://learn-agentic-engineering.pages.dev/lessons/prompting-coding-agents/
