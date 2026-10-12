# Lesson 16: Running agents in parallel

> Heavy users run five, ten, even hundreds of agents at once. But your attention doesn't parallelize, and naive parallelism creates conflicts and duplicate work. Learn how to isolate agents with worktrees, pick tasks that don't collide, and keep the orchestration tax under control.

Course: Agentic Engineering — https://learn-agentic-engineering.pages.dev/ · Module 4: Scaling up · 4 min · Watch: https://learn-agentic-engineering.pages.dev/lessons/parallel-agents-worktrees/

## Key takeaways

- Power users run several agents at once, each on independent work.
- Give each agent its own checkout: git worktrees locally, or cloud sandboxes at scale.
- Your attention doesn't parallelize. Every extra agent adds routing, review and merging work for you.
- Parallelize reads freely; parallelize writes only when tasks don't touch the same code.
- Trust one agent before you run ten.

## Practices for coding agents

- Work in your own worktree and branch; never push to main directly.
- Before starting, check whether other in-flight work touches the same files and flag likely conflicts.
- Keep each parallel task self-contained, with its own verification, so it can merge independently.
- When finished, report clearly so a busy human can review quickly: what changed, how it was verified, what's risky.

## Lesson transcript


### Intro (0:01)

The people who ship the most with agents rarely run just one. But parallelism has a hidden cost, and it's paid in the scarcest resource you have: your attention.

### How many? (0:12)

How many is normal? Boris Cherny runs five to ten sessions at a time, which between them hold a few hundred agents, and thousands more overnight. Peter Steinberger runs five to ten agents in parallel on his projects. Ben Vinegar keeps about six checkouts going.

### Macro actions (0:31)

Karpathy describes the shift as working in macro actions. Not a line of code or a function at a time, but whole pieces of functionality. Here's a new feature, give it to agent one. Here's another that won't interfere with the first, give it to agent two.

### Isolation (0:47)

The first rule is isolation. Agents can't safely edit the same folder at once. So give each one its own checkout. Git worktrees make this cheap: each agent gets its own folder and branch, and comes back as a pull request. Matt Pocock says he now uses worktrees for everything.
Worktrees share your local services, though: the same database, the same caches. Teams running agents at scale, like Cursor and Airbnb, move to cloud sandboxes, where each agent gets its own machine with its own database. More setup, but it scales to hundreds of agents.

### The orchestration tax (1:26)

Now the hidden cost. Addy Osmani calls it the orchestration tax. More agents running does not mean there is more of you available. Your cognitive bandwidth does not parallelize. Peter Steinberger says it feels like managing five or ten employees at once, and it's mentally more taxing than writing code.

### Naive parallelism (1:46)

And naive parallelism backfires in software. Luke Alvoeiro from Factory lists the problems: agents step on each other's changes, duplicate work, and make inconsistent architectural decisions. Matt Pocock warns that sixteen agents on sixteen backlog tasks would be absolute hell, full of merge conflicts and hidden dependencies.

### Reads vs writes (2:10)

Factory's answer is surprising. They run feature work serially, one writer at a time, and parallelize only the read-only work: searching code, researching APIs, reviewing. It looks slower on paper, but the error rate drops dramatically. Parallelize reads freely. Parallelize writes only when tasks truly don't overlap.

### What works (2:34)

So what works? Pick tasks that don't touch the same code; you can even ask the agent which tasks will intersect. Make dependencies explicit, so blocked work waits its turn. Prefer longer, self-verifying tasks, so you check in less often. And Lauren Tan's rule: you can't spawn a hundred agents when you don't even trust the output of one.

### Competition mode (2:57)

There's also a different way to use parallel agents: competition. When Mitchell Hashimoto has low confidence in a task, he gives the same prompt to different agents in separate checkouts, and keeps the best result.

### Quick check (3:11)

**Quiz:** Six tasks; three touch the same checkout module. How do you run them?
A. Six agents at once in the same folder
B. Separate worktrees: the three independent tasks in parallel, the overlapping ones in sequence
C. One agent, all six tasks, one long session
D. Six agents at once, then fix the conflicts
Answer: B — Isolate every agent, parallelize what doesn't collide, and sequence what does.


### Try it (3:25)

Plan your next batch of work for parallel agents. This prompt finds what can run side by side, what must wait, and starts the first task in its own worktree.

```text
Here are my next tasks: [list them]. Tell me which can run in parallel without touching the same files, which depend on each other, and a safe order. Then start the first independent one in a new git worktree on its own branch, and verify it before a PR.
```


### Recap (3:36)

Recap. Run agents in parallel on work that doesn't collide. Isolate each one: worktrees locally, sandboxes at scale. Remember your attention doesn't parallelize. Parallelize reads freely and writes carefully. And trust one before you run ten. Next: agents that run for hours on their own.

## Sources

- Boris Cherny — Anthropic's Boris Cherny: Why Coding Is Solved, and What Comes Next (at 7:49): https://www.youtube.com/watch?v=SlGRN8jh2RI&t=469s
- Peter Steinberger — The creator of OpenClaw: "I ship code I don't read" (at 46:30, 55:00): https://www.youtube.com/watch?v=8lF7HmQ_RgY&t=2790s
- Armin Ronacher, Ben Vinegar — State of Agentic Coding #10 with Armin and Ben (at 31:04): https://www.youtube.com/watch?v=9UAxrdcDjjU&t=1864s
- Andrej Karpathy — Skill Issue: Andrej Karpathy on Code Agents, AutoResearch, and the Loopy Era of AI (at 3:40): https://www.youtube.com/watch?v=kwSVtQ7dziU&t=220s
- Matt Pocock — I'm using claude --worktree for everything now: https://www.youtube.com/watch?v=yv8VZpov8bk
- Eric Zakariasson — Building your own software factory — Eric Zakariasson, Cursor (at 21:22): https://www.youtube.com/watch?v=rnDm57Py54A&t=1282s
- Addy Osmani — "The engineer of the future is the person who is able to choose what is worth doing." — Addy Osmani (at 12:15): https://www.youtube.com/watch?v=n97BCfyFIvw&t=735s
- Luke Alvoeiro — The Multi-Agent Architecture That Actually Ships — Luke Alvoeiro, Factory (at 9:34, 10:15): https://www.youtube.com/watch?v=ow1we5PzK-o&t=574s
- Matt Pocock — Ship working code while you sleep with the Ralph Wiggum technique (at 1:50): https://www.youtube.com/watch?v=_IK18goX4X8&t=110s
- Lauren Tan — SpaceX AI Engineer Lauren Tan: Part 1 (at 47:33): https://www.youtube.com/watch?v=PaPpyQocMww&t=2853s
- Mitchell Hashimoto — Agentic Engineering in Action with Mitchell Hashimoto (at 16:07): https://www.youtube.com/watch?v=XyQ4ZTS5dGw&t=967s
- Dex Horthy — Why Coding Agents Keep Making Your Codebase Worse (at 39:52): https://www.youtube.com/watch?v=vKT59uoByXc&t=2392s

License: CC BY 4.0 · https://github.com/Haple/agentic-engineering
