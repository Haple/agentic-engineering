# What agents are great at, and where they fail

Agent intelligence is jagged: superhuman on some tasks, baffling on others. The pattern isn't random. Agents fly where results are easy to verify and stumble on judgment, design and long, unchecked runs. Learn to delegate by verifiability.

## Key ideas

- Agent ability is jagged: the same model can refactor a huge codebase and still make a mistake no human would.
- Models are best at what can be verified. Code is ideal because you can compile it, run it and test it.
- Agents struggle with judgment: architecture, design quality and business context. Their code can be technically correct and contextually wrong.
- They report success confidently, even when they failed or quietly weakened a test. Don't trust, verify.
- Delegate by verifiability and risk: easy to check and cheap to get wrong means more autonomy.

## Practices for agents

- Never report a task as done without evidence; if a check was skipped or failed, say so plainly.
- Never weaken, skip or delete tests to make them pass; fix the code or flag the test as wrong and explain why.
- Flag design decisions that need human judgment (data models, identifiers, money, security, public APIs) instead of silently choosing.
- Don't add functionality that wasn't asked for, even if it seems like a natural next step; propose it instead.

Full lesson (Markdown): https://learn-agentic-engineering.pages.dev/lessons/what-agents-are-good-at.md
Video: https://learn-agentic-engineering.pages.dev/lessons/what-agents-are-good-at/
