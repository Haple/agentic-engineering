# Context is everything

Almost every best practice for coding agents comes from one constraint: the context window fills up fast, and quality drops as it fills. Learn the smart zone and the dumb zone, why fresh sessions beat long ones, and the four moves of context engineering.

## Key ideas

- The context window is the agent's working memory. It doesn't learn as it goes; you program that memory directly.
- Quality degrades long before the window is full. Treat roughly the first 40% as the smart zone.
- A long session full of failed attempts poisons the trajectory. A fresh session with a better prompt usually wins.
- Write important state to files, start fresh often, and load context just in time instead of up front.
- Context engineering has four moves: write it down, select what's relevant, compress, and isolate.

## Practices for agents

- Load context just in time: search and read the files the task needs instead of reading everything up front.
- Keep tool output lean: summarize long logs and stack traces instead of pasting them whole.
- At natural breakpoints, write the goal, decisions, open questions and next step to a file so a fresh session can resume.
- If the same correction has been needed twice, stop and suggest restarting with a clean session and a better prompt.

Full lesson (Markdown): https://learn-agentic-engineering.pages.dev/lessons/context-engineering.md
Video: https://learn-agentic-engineering.pages.dev/lessons/context-engineering/
