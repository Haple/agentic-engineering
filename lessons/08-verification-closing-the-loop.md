# Lesson 8: Close the loop: let agents check their work

> Ask people who ship with agents for their single best tip and you hear the same thing: give the agent a way to check its own work. Tests, types, a running app, a browser. Without a check, “looks done” is the only signal, and you become the bottleneck.

Course: Agentic Engineering — https://learn-agentic-engineering.pages.dev/ · Module 2: Working with one agent · 4 min · Watch: https://learn-agentic-engineering.pages.dev/lessons/verification-closing-the-loop/

## Key takeaways

- Give the agent a pass/fail check it can run itself, and it will iterate until the check passes.
- Without a check, you are the verification loop and the bottleneck.
- Use red/green TDD: a failing test first makes it much harder for the agent to cheat.
- Passing tests aren't proof. Have the agent run the real thing: the app, the CLI, a browser.
- Make your system agent-testable: fast tests, debug output, CLIs, ways to reach real behavior.

## Practices for coding agents

- Before implementing, decide how the change will be verified and say so.
- Prefer test-first: write a failing test, confirm it fails, then make it pass.
- Never edit an expected value or delete a test to get green; fix the code or explain why the test is wrong.
- After tests pass, exercise the real behavior (run the app, CLI or browser) and report actual output, not a summary.

## Lesson transcript


### Intro (0:01)

Ask people who ship real software with agents for their single best tip, and a surprising number give you the same answer. This lesson is that answer.

### The big secret (0:11)

Peter Steinberger, creator of OpenClaw, calls it the big secret. To be effective with a coding agent, you have to close the loop. It needs to be able to debug and test itself. Boris Cherny says the same: give it a tool to check its work, and it will iterate by itself.
Here's what a closed loop looks like. The agent makes a change. It runs a check: tests, types, the app itself. It reads the result. And it fixes what's wrong, then runs the check again, until it passes. No human needed in the middle.

### You are the loop (0:47)

Without a check, Anthropic's guide warns, looks done is the only signal available, and you become the verification loop. Every mistake waits for you to notice it. Lauren Tan puts it more bluntly: without a way to verify, you are the bottleneck, and you can't run agents in parallel.

### Kinds of checks (1:06)

Checks come in many shapes. Unit and integration tests. Type checkers and linters. Running the app and reading its output or logs. A real browser the agent can click through and screenshot. And comparisons against ground truth, like expected output or a known-good page.

### Red, then green (1:25)

The strongest pattern is test first. Simon Willison's shorthand is: use red green TDD. Write a test, watch it fail, that's red. Then write just enough code to make it pass, that's green. Every good model understands those few words.

### Why test first (1:43)

Why does order matter? If the agent writes the code first, it tends to write tests that simply match whatever it wrote. And when it's stuck, it may quietly change the test instead of the code. Kent Beck once found an agent had replaced his logic with a lookup table of expected answers.

### Tests aren't enough (2:03)

But be careful: passing tests aren't proof. Simon Willison again: just because code passes tests doesn't mean it works as intended. The app can still crash on startup, or miss a button. So ask the agent to run the real thing, and show you.
Anthropic saw this in their long-running agent experiments. The agent kept marking features complete after unit tests passed, without noticing they didn't work end to end. Once it was told to use browser automation and test like a human user, results improved dramatically.

### Make it checkable (2:37)

So make your system easy for agents to check. Keep tests fast; Kent Beck's suite runs in about three hundred milliseconds, so it can run constantly. Make behavior visible: Armin Ronacher logs sign-in emails to the console in debug mode, so the agent can finish a login flow on its own. And when an app is slow to test, Peter Steinberger has the agent build a small CLI that runs the same code path.

### The rule (3:04)

Which brings us to the rule, straight from Anthropic's guide. If you can't verify it, don't ship it. Mitchell Hashimoto adds the payoff: give an agent a way to verify its work, and more often than not, it fixes its own mistakes.

### Quick check (3:20)

**Quiz:** “Feature done. I added tests and all 12 pass.” Best next step?
A. Merge it. Tests pass.
B. Ask it to show the real test output and demo the feature running
C. Ask for a longer written summary
D. Ask it to raise coverage to 100%
Answer: B — Summaries aren't evidence. Real output plus the feature actually running is.


### Try it (3:34)

Try this on your next task. It makes the agent plan its verification first, prove the test fails, and show you real output at the end instead of a summary.

```text
Before changing anything, tell me how you'll verify this end to end.
Use red/green TDD: write the failing test and show it failing.
Then implement until it passes, run the full suite, and run the real app to confirm. Show me actual output, not a summary.
```


### Recap (3:44)

Recap. Close the loop: give the agent a check it can run. Without one, you're the bottleneck. Test first, so it can't grade its own homework. Then run the real thing, because passing tests aren't proof. Next: when the agent is done, how do you review its code?

## Sources

- Peter Steinberger — The creator of OpenClaw: "I ship code I don't read" (at 57:27, 58:29): https://www.youtube.com/watch?v=8lF7HmQ_RgY&t=3447s
- Boris Cherny — Mastering Claude Code in 30 minutes (at 11:42): https://www.youtube.com/watch?v=6eBSHbLKuN0&t=702s
- Anthropic (Claude Code team) — Best practices for Claude Code: https://www.anthropic.com/engineering/claude-code-best-practices
- Lauren Tan — SpaceX AI Engineer Lauren Tan: Part 1 (at 8:13): https://www.youtube.com/watch?v=PaPpyQocMww&t=493s
- Simon Willison — Red/green TDD - Agentic Engineering Patterns: https://simonwillison.net/guides/agentic-engineering-patterns/red-green-tdd/
- Matt Pocock — Full Walkthrough: Workflow for AI Coding — Matt Pocock (at 67:58): https://www.youtube.com/watch?v=-QFHIoCo-Ko&t=4078s
- Kent Beck — TDD, AI agents and coding with Kent Beck (at 10:45, 51:08, 52:00): https://www.youtube.com/watch?v=aSXaxOdVtAQ&t=645s
- Simon Willison — Agentic manual testing - Agentic Engineering Patterns: https://simonwillison.net/guides/agentic-engineering-patterns/agentic-manual-testing/
- Justin Young — Effective harnesses for long-running agents: https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
- Armin Ronacher — Agentic Coding Recommendations: https://lucumr.pocoo.org/2025/6/12/agentic-coding/
- Mitchell Hashimoto — My AI Adoption Journey: https://mitchellh.com/writing/my-ai-adoption-journey
- Charity Majors — Stop being skeptical about AI for development with Charity Majors (at 28:15): https://www.youtube.com/watch?v=HC8T1OlgYi0&t=1695s

License: CC BY 4.0 · https://github.com/Haple/agentic-engineering
