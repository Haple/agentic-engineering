# Lesson 18: Harness engineering: build the factory

> Harness engineering means: every time an agent makes a mistake, engineer it out of the system for good. OpenAI used it to ship a million lines with zero hand-written code. Learn the difference between soft and hard constraints, how to make your environment legible to agents, and why lights-off factories still fail.

Course: Agentic Engineering — https://learn-agentic-engineering.pages.dev/ · Module 4: Scaling up · 4 min · Watch: https://learn-agentic-engineering.pages.dev/lessons/harness-engineering/

## Key takeaways

- Harness engineering: whenever an agent makes a mistake, build something so it can't happen again.
- Hard constraints (types, lints, CI, architecture rules) beat soft ones (memory files, skills), which can be forgotten.
- Make error messages teach: a failing check should tell the agent how to fix it.
- Make the environment legible: the agent should be able to run, test and observe everything a human can.
- Keep humans steering. Factories where nobody reads the code degrade within months.

## Practices for coding agents

- When you notice a recurring mistake, propose a durable fix (a lint rule, test, type or hook), not just a memory-file note.
- Write custom lint and test failure messages that explain the rule and the remedy.
- Use the project's own scripts to run, test and observe the app; if something can't be done without a human, point it out.
- Respect architectural boundaries enforced by tooling; never disable a check to get a change through.

## Lesson transcript


### Intro (0:01)

Mitchell Hashimoto describes his whole approach in one sentence. Anytime you find an agent makes a mistake, you take the time to engineer a solution, such that the agent never makes that mistake again. That's harness engineering.

### Inner and outer harness (0:16)

Dex Horthy, following Martin Fowler's site, splits it into two parts. The inner harness is what your agent ships with: its loop, its tools, its system prompt. The outer harness is what you build around it: memory files, skills, commands, hooks, checks, and the way your codebase and dev environment are organized. You can't change the first much. The second is yours.

### The OpenAI experiment (0:40)

How far can this go? OpenAI's Ryan Lopopolo describes a team that shipped a real internal product in five months: about a million lines of code, fifteen hundred pull requests, seven engineers, and zero lines written by hand. Humans steer. Agents execute.
His key observation: building software still demands discipline, but the discipline shows up more in the scaffolding than in the code. The tooling, abstractions and feedback loops that keep the codebase coherent become the real work.

### Fix it forever (1:15)

Here's what fixing a mistake forever looks like. Agents kept calling fetch without a timeout. Instead of correcting it in every review, Lopopolo's team wrote a custom lint rule. And the error message doesn't just say no. It explains the rule and how to fix it, so the agent repairs its own code.

### Hard beats soft (1:34)

Lauren Tan draws a sharp line between soft and hard constraints. Memory files, skills, style guides and review bots are soft. They can be forgotten. Types, lints, CI checks and enforced architecture are hard. If you only have soft constraints, she warns, it's only a matter of time before your codebase looks like complete trash.
Her team goes further. Everything you can imagine the agents are bad at, she says, we ban. A React hook agents misuse, banned. Rambling code comments, banned. Imports that cross an architecture boundary, blocked by a check.

### Legible environments (2:14)

The other half of the harness is the environment. The Claude Code team makes sure the agent can do everything a human does to build and test the product end to end. OpenAI teaches its agent to launch the app, start the observability stack and drive a browser. And Karpathy's pet peeve: docs that say go click this URL, instead of giving you text to paste to your agent.

### Factories fail (2:38)

But don't remove the humans. Dex Horthy's team built a lights-off software factory in July 2025, where nobody read the code. By November, they had shut it down. After three to six months without human steering, the codebase was easier to restart than to fix.

### Keep it light (2:56)

And hold your harness loosely. Boris Cherny notes that as models get better, the harness matters less. The Claude Code team builds scaffolding knowing it will be deleted, like the to-do list tool they needed for older models. Build what today's models need, and prune as they improve.

### Quick check (3:14)

**Quiz:** Agents keep calling fetch without a timeout. Most durable fix?
A. Add “always use timeouts” to the memory file
B. A custom lint that fails CI and explains how to fix it
C. Remind the agent in every prompt
D. Review more carefully
Answer: B — A hard check runs every time, and a teaching error message lets the agent fix itself.


### Try it (3:29)

Start your harness engineering habit. This prompt finds recurring mistakes in your history and turns the worst one into a durable check.

```text
Look at our last 20 commits and any review comments. Find mistakes that recur. For each, propose the most durable fix: a lint rule, a test, a type, or a hook, with a memory-file line only as a last resort. Implement the top one, with an error message that teaches.
```


### Recap (3:38)

Recap. Every mistake is a chance to fix the system, not just the code. Prefer hard constraints, with errors that teach. Make your environment legible to agents. Keep humans steering, and keep the harness light. That's module four. Next: codebases agents can work in.

## Sources

- Mitchell Hashimoto — My AI Adoption Journey: https://mitchellh.com/writing/my-ai-adoption-journey
- Mitchell Hashimoto — Mitchell Hashimoto’s new way of writing code (at 98:39): https://www.youtube.com/watch?v=WjckELpzLOU&t=5919s
- Dex Horthy — Context engineering with Dex Horthy (at 27:22, 41:49): https://www.youtube.com/watch?v=Usufn8IQJgw&t=1642s
- Ryan Lopopolo — Harness engineering: leveraging Codex in an agent-first world: https://businessdatasolutions.github.io/ai-wiki/sources/2026-02-11-lopopolo-codex-harness-engineering
- Ryan Lopopolo — Harness Engineering: How to Build Software When Humans Steer, Agents Execute — Ryan Lopopolo, OpenAI (at 13:02, 14:57): https://www.youtube.com/watch?v=am_oeAoUhew&t=782s
- Lauren Tan — SpaceX AI Engineer Lauren Tan: Part 1 (at 39:39, 45:31): https://www.youtube.com/watch?v=PaPpyQocMww&t=2379s
- Claude Code team members (Boris Cherny referenced; others include Sid and Robert) — How the Claude Code team uses Claude Code (at 14:38, 3:45): https://www.youtube.com/watch?v=S-sYlFiGFv8&t=878s
- Andrej Karpathy — Andrej Karpathy: From Vibe Coding to Agentic Engineering w/ Stephanie Zhan (at 26:20): https://www.youtube.com/watch?v=96jN2OCOfLs&t=1580s
- Boris Cherny — Anthropic's Boris Cherny: Why Coding Is Solved, and What Comes Next (at 14:13): https://www.youtube.com/watch?v=SlGRN8jh2RI&t=853s
- Geoffrey Huntley — The Ralph Wiggum Loop from 1st principles (by the creator of Ralph) (at 19:50): https://www.youtube.com/watch?v=4Nna09dG_c0&t=1190s

License: CC BY 4.0 · https://github.com/Haple/agentic-engineering
