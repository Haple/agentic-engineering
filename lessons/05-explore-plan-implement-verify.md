# Lesson 5: The core loop: explore, plan, implement, verify

> The people who build coding agents rarely type a feature request and hit enter. They explore first, agree on a plan, implement in a fresh context, and verify. Here's that loop, why planning has the most leverage, and how to make plans that can actually be checked.

Course: Agentic Engineering — https://learn-agentic-engineering.pages.dev/ · Module 2: Working with one agent · 4 min · Watch: https://learn-agentic-engineering.pages.dev/lessons/explore-plan-implement-verify/

## Key takeaways

- Don't jump straight to code. Explore, plan, implement, verify.
- Mistakes are cheapest to fix upstream: a bad line of research can become thousands of bad lines of code.
- Planning is about shared understanding. Let the agent interview you, one question at a time.
- Ask for plans in thin vertical slices you can test, not horizontal layers that only work at the end.
- Implement from the plan in a fresh session; skip planning only for tiny, obvious changes.

## Practices for coding agents

- For non-trivial tasks, explore the relevant code and propose a plan (or two or three options) before editing anything.
- When requirements are ambiguous, ask questions one at a time, each with a recommended answer.
- Structure plans as thin vertical slices, each with a concrete verification step (test, command, or check).
- Write the agreed plan to a file so implementation can start from a clean context.

## Lesson transcript


### Intro (0:01)

The most common beginner move is to type a feature request and hit enter. The people who build these tools almost never do that. Here's what they do instead.

### Why plan (0:11)

Boris Cherny says landing on a plan first can easily double or triple your success rate. And once there's a good plan, he says, the model will one-shot the implementation almost every time. Most of his tasks start in plan mode.

### The loop (0:27)

Here's the loop. Explore: let the agent read the relevant code and explain it before touching anything. Plan: agree on the approach and how you'll check it. Implement: let it write the code, in small steps. Verify: run the checks, read the result. Then around again for the next slice.

### Leverage (0:48)

Why put so much effort up front? Dex Horthy explains. A bad line of code is just a bad line of code. A bad line of a plan can become hundreds of bad lines of code. And a bad line of research, a misunderstanding of how the system works, can become thousands. So your attention has the most leverage early.

### Explore (1:09)

Exploring is just asking. Cal from the Claude Code team suggests a prompt like this: search around, figure out how we'd do it, report back with two or three options, and don't start working. You get the agent's understanding on the table before any code exists.

### Plan (1:27)

Then plan. Plan mode is surprisingly simple; Boris says it's one sentence telling the model not to write code yet. Matt Pocock goes further with a prompt he calls grill me: interview me relentlessly about this plan until we reach a shared understanding, one question at a time, each with your recommended answer.
Pocock's insight is that the goal of planning isn't the document. It's alignment. As he puts it: I didn't need a plan, I needed to be on the same wavelength as my agent.

### Vertical slices (2:00)

One more planning trap. Ask a model for a plan, and it loves going layer by layer: the whole database, then all the services, then the API, then the front end. Nothing can be tested until the very end. Instead, ask for thin vertical slices, each one cutting through every layer and testable on its own.

### Implement (2:21)

Now implement. Save the plan to a file, start a fresh session, and give it only the plan, so the context is clean. Let it work through the slices, review each change, and commit as you go. Brendan O'Leary treats his local git history as a first pull request review of the agent's work.

### Verify (2:41)

And verify. Every slice in the plan should say how you'll know it works: a test, a command, a screenshot. If the plan can't say how to check it, it isn't finished yet. We'll go deep on verification in lesson eight.

### When to skip it (2:56)

Does every task need the full loop? No. Boris describes three modes. For a quick prototype, just let it build and throw it away. For small tasks it can one-shot, like a typo or a rename, auto-accept and move on. For anything harder, start in plan mode. Dex adds that thirty minutes of planning can save hours of review.

### Quick check (3:19)

**Quiz:** Plan: all DB tables → all services → all endpoints → the whole UI. What's the problem?
A. Nothing, that's how apps are built
B. Nothing is testable end to end until the very end
C. It should start with the UI instead
D. Plans are unnecessary for agents
Answer: B — Horizontal plans hide integration problems until the end. Thin vertical slices give you a checkpoint every step.


### Try it (3:37)

Run the whole loop on one of the tasks from lesson one. Use this prompt to explore, get interviewed, and produce a plan in vertical slices, each with its own check. Then implement it in a fresh session.

```text
I want to [describe the feature]. Don't write code yet.
1. Explore the relevant code and explain how it works today.
2. Interview me one question at a time, with your recommended answer.
3. Write a plan as thin vertical slices, each with the exact
   command or test that verifies it. Save it to plans/[name].md.
```


### Recap (3:51)

Recap. Explore, plan, implement, verify. Spend your attention upstream, where mistakes are cheapest. Plan for alignment, in vertical slices you can test. Then implement from the plan in a fresh session. Next: how to write specs an agent can actually execute.

## Sources

- Boris Cherny, Cat Wu — The Secrets of Claude Code From the Engineers Who Built It (at 43:30, 17:53): https://www.youtube.com/watch?v=IDSAMqip6ms&t=2610s
- Boris Cherny — Building Claude Code with Boris Cherny (at 37:48): https://www.youtube.com/watch?v=julbw1JuAz0&t=2268s
- Boris Cherny — Head of Claude Code: What happens after coding is solved | Boris Cherny (at 69:57): https://www.youtube.com/watch?v=We7BZVKbCVw&t=4197s
- Anthropic (Claude Code team) — Best practices for Claude Code: https://www.anthropic.com/engineering/claude-code-best-practices
- Dex Horthy — Advanced Context Engineering for Coding Agents: https://github.com/humanlayer/advanced-context-engineering-for-coding-agents/blob/main/ace-fca.md
- Boris Cherny — Mastering Claude Code in 30 minutes (at 6:42): https://www.youtube.com/watch?v=6eBSHbLKuN0&t=402s
- Cal Rueb — Claude Code best practices | Code w/ Claude (at 7:47): https://www.youtube.com/watch?v=gv0WHhKelSE&t=467s
- Matt Pocock — 5 Claude Code skills I use every single day (at 1:24): https://www.youtube.com/watch?v=EJyuu6zlQCg&t=84s
- Matt Pocock — Full Walkthrough: Workflow for AI Coding — Matt Pocock (at 17:35, 42:58): https://www.youtube.com/watch?v=-QFHIoCo-Ko&t=1055s
- Dex Horthy — Everything We Got Wrong About Research-Plan-Implement -  Dexter Horthy (at 17:46): https://www.youtube.com/watch?v=YwZR6tc7qYg&t=1066s
- Brendan O'Leary — Agentic Engineering: Working With AI, Not Just Using It — Brendan O'Leary (at 16:45): https://www.youtube.com/watch?v=BEKc4P87XKo&t=1005s
- Dex Horthy — Why Software Factories Fail (at 17:00): https://www.youtube.com/watch?v=Ib5GBkD555M&t=1020s

License: CC BY 4.0 · https://github.com/Haple/agentic-engineering
