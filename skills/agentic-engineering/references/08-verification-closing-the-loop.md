# Close the loop: let agents check their work

Ask people who ship with agents for their single best tip and you hear the same thing: give the agent a way to check its own work. Tests, types, a running app, a browser. Without a check, “looks done” is the only signal, and you become the bottleneck.

## Key ideas

- Give the agent a pass/fail check it can run itself, and it will iterate until the check passes.
- Without a check, you are the verification loop and the bottleneck.
- Use red/green TDD: a failing test first makes it much harder for the agent to cheat.
- Passing tests aren't proof. Have the agent run the real thing: the app, the CLI, a browser.
- Make your system agent-testable: fast tests, debug output, CLIs, ways to reach real behavior.

## Practices for agents

- Before implementing, decide how the change will be verified and say so.
- Prefer test-first: write a failing test, confirm it fails, then make it pass.
- Never edit an expected value or delete a test to get green; fix the code or explain why the test is wrong.
- After tests pass, exercise the real behavior (run the app, CLI or browser) and report actual output, not a summary.

Full lesson (Markdown): https://learn-agentic-engineering.pages.dev/lessons/verification-closing-the-loop.md
Video: https://learn-agentic-engineering.pages.dev/lessons/verification-closing-the-loop/
