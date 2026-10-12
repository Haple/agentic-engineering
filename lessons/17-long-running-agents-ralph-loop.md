# Lesson 17: Long-running agents and loops

> Agents went from running thirty seconds before derailing to working for hours. The trick isn't one giant session; it's loops: fresh contexts, one task at a time, state kept in files and git, and a check the loop can't argue with. From the Ralph loop to nightly slow loops, here's how to let agents work while you're away.

Course: Agentic Engineering — https://learn-agentic-engineering.pages.dev/ · Module 4: Scaling up · 4 min · Watch: https://learn-agentic-engineering.pages.dev/lessons/long-running-agents-ralph-loop/

## Key takeaways

- Long runs work as loops of fresh sessions, not one giant session that rots.
- The Ralph loop: run the same prompt again and again, one task per iteration, fresh context each time.
- Keep state outside the context: a task list with pass/fail flags, a progress file, and git commits.
- Loops need back pressure: tests, types and metrics the loop must satisfy.
- Start with slow loops that make one small, verified improvement and open a PR.

## Practices for coding agents

- In a loop, do exactly one task per iteration, verify it, commit it, and update the progress file.
- At the start of each session, get your bearings: read the progress file and recent commits, and run a smoke test.
- Never mark a task as passing until its verification actually ran and passed.
- If the build breaks and you can't fix it in this iteration, stop and leave a clear note instead of piling on changes.

## Lesson transcript


### Intro (0:01)

Karpathy says that to get the most out of these tools, you have to remove yourself as the bottleneck. You can't be there to prompt the next thing. So how do you let an agent work for hours without you?

### Longer runs (0:14)

Run lengths have exploded. Boris Cherny recalls that early models could run fifteen or thirty seconds before going off the rails. By 2026, typical unattended runs lasted tens of minutes, some for hours or days. Anthropic's trends report describes a single seven-hour autonomous run that implemented a feature in a twelve-million-line codebase.

### Loops, not marathons (0:38)

But long runs don't come from one giant session. A single session fills up, rots and compacts. Long runs come from loops: many fresh sessions in a row, each doing one piece of work, with the state of the project kept outside the context window.

### The Ralph loop (0:55)

The most famous version is the Ralph loop, by Geoffrey Huntley. In its purest form, Ralph is a bash loop. It pipes the same prompt into a coding agent, again and again. Each run starts with a fresh context, studies the plan, picks the single most important task, does it, and exits. Huntley calls it low control, high oversight.

### Engineers in shifts (1:19)

Anthropic's engineers describe the core problem vividly. Imagine a software project staffed by engineers working in shifts, where each new engineer arrives with no memory of what happened on the previous shift. That's what a loop of fresh sessions is.

### The shift handoff (1:35)

Their answer is a disciplined handoff. Every session gets its bearings first, from a progress file and the git log. It runs a quick smoke test. It implements exactly one failing feature, verifies it end to end, commits, and flips that feature's pass flag to true. Then the next shift begins.

### Back pressure (1:55)

Loops only work with back pressure: checks the loop has to satisfy, like tests, types and linters. Dex Horthy's lesson from Ralph: if you can make a problem very verifiable, you can treat it like a black box and loop on it. Karpathy's AutoResearch is the same idea. Give an agent an objective, a metric and boundaries. Overnight, it found tunings in his code that he'd missed.

### Slow loops (2:21)

You don't need an overnight swarm to start. Dex recommends slow loops: a nightly job that runs the linter, fixes one thing, and opens one small pull request, so you wake up to a slightly better codebase. Boris runs dozens of loops: one babysits his pull requests and fixes CI, another hunts flaky tests, another clusters user feedback.

### Headless (2:45)

Loops run headless. Boris describes Claude's print mode as a Unix utility: give it a prompt, get JSON back, and pipe it into anything. And a stop hook can check the tests when the agent tries to finish, and simply tell it: keep going.

### Use the boundaries (3:01)

Mitchell Hashimoto has a simple habit. He spends the boundaries of his day, when he wakes up and before he stops, deciding what slow task an agent can do while he's away: library research, edge case analysis, triage. Those agents write reports. They aren't allowed to respond to anyone.

### Caveats (3:20)

Some caveats. Geoffrey Huntley warns you'll sometimes wake up to a broken codebase, so commits and tags are your restore points. Peter Steinberger thinks heavy upfront plans for loops are waterfall in disguise. And OpenAI's harness team says their end-to-end autonomy depends heavily on their repo's structure and tooling, so don't assume it transfers for free.

### Quick check (3:44)

**Quiz:** Which task is the best fit for an overnight loop?
A. Redesign the onboarding flow based on vibes
B. Make the test suite run under 2 minutes without reducing coverage
C. Decide next quarter's roadmap
D. Rewrite the auth system, which has no tests
Answer: B — It has a clear metric and a hard boundary the loop can check after every iteration.


### Try it (3:55)

Design your first slow loop. This prompt has the agent propose a small, nightly improvement with a strict check, without scheduling anything yet.

```text
Propose one nightly "slow loop" for this repo: a job that fixes exactly ONE small thing (a lint warning, a flaky test, a TODO) and opens one small PR. Write the prompt file, the verification it must pass, and how it records progress. Don't schedule or run it yet.
```


### Recap (4:05)

Recap. Long runs are loops of fresh sessions. One task per iteration, with state kept in files and git. Loops need back pressure, so make the problem verifiable. Start with slow loops and restore points. Next: harness engineering, building the whole factory.

## Sources

- Andrej Karpathy — Skill Issue: Andrej Karpathy on Code Agents, AutoResearch, and the Loopy Era of AI (at 16:56, 17:28): https://www.youtube.com/watch?v=kwSVtQ7dziU&t=1016s
- Boris Cherny — Head of Claude Code: What happens after coding is solved | Boris Cherny (at 68:01): https://www.youtube.com/watch?v=We7BZVKbCVw&t=4081s
- Anthropic — 2026 Agentic Coding Trends Report: https://resources.anthropic.com/2026-agentic-coding-trends-report
- Geoffrey Huntley — Ralph Wiggum as a "software engineer": https://ghuntley.com/ralph/
- Geoffrey Huntley — The Ralph Wiggum Loop from 1st principles (by the creator of Ralph) (at 9:50, 30:52): https://www.youtube.com/watch?v=4Nna09dG_c0&t=590s
- Justin Young — Effective harnesses for long-running agents: https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
- Ash Prabaker, Andrew Wilson — Anthropic Workshop: Build Agents That Run for Hours — Ash Prabaker & Andrew Wilson (at 13:19): https://www.youtube.com/watch?v=mR-WAvEPRwE&t=799s
- Dex Horthy — Context engineering with Dex Horthy (at 34:28, 36:44): https://www.youtube.com/watch?v=Usufn8IQJgw&t=2068s
- Boris Cherny — Anthropic's Boris Cherny: Why Coding Is Solved, and What Comes Next (at 8:17): https://www.youtube.com/watch?v=SlGRN8jh2RI&t=497s
- Boris Cherny, Cat Wu — The Secrets of Claude Code From the Engineers Who Built It (at 44:42): https://www.youtube.com/watch?v=IDSAMqip6ms&t=2682s
- Mitchell Hashimoto — Mitchell Hashimoto’s new way of writing code (at 105:38): https://www.youtube.com/watch?v=WjckELpzLOU&t=6338s
- Peter Steinberger — The creator of OpenClaw: "I ship code I don't read" (at 69:50): https://www.youtube.com/watch?v=8lF7HmQ_RgY&t=4190s
- Ryan Lopopolo — Harness engineering: leveraging Codex in an agent-first world: https://businessdatasolutions.github.io/ai-wiki/sources/2026-02-11-lopopolo-codex-harness-engineering

License: CC BY 4.0 · https://github.com/Haple/agentic-engineering
