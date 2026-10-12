# Harness engineering: build the factory

Harness engineering means: every time an agent makes a mistake, engineer it out of the system for good. OpenAI used it to ship a million lines with zero hand-written code. Learn the difference between soft and hard constraints, how to make your environment legible to agents, and why lights-off factories still fail.

## Key ideas

- Harness engineering: whenever an agent makes a mistake, build something so it can't happen again.
- Hard constraints (types, lints, CI, architecture rules) beat soft ones (memory files, skills), which can be forgotten.
- Make error messages teach: a failing check should tell the agent how to fix it.
- Make the environment legible: the agent should be able to run, test and observe everything a human can.
- Keep humans steering. Factories where nobody reads the code degrade within months.

## Practices for agents

- When you notice a recurring mistake, propose a durable fix (a lint rule, test, type or hook), not just a memory-file note.
- Write custom lint and test failure messages that explain the rule and the remedy.
- Use the project's own scripts to run, test and observe the app; if something can't be done without a human, point it out.
- Respect architectural boundaries enforced by tooling; never disable a check to get a change through.

Full lesson (Markdown): https://learn-agentic-engineering.pages.dev/lessons/harness-engineering.md
Video: https://learn-agentic-engineering.pages.dev/lessons/harness-engineering/
