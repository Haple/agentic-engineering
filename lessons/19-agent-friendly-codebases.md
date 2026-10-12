# Lesson 19: Codebases agents can work in

> Bad codebases make bad agents, and agents can make a codebase bad fast: they copy whatever patterns they find, good or bad. Learn the principles that keep a codebase agent-friendly: make the shortest path the right path, deep modules, one way to do each thing, enforced architecture, simple code, and continuous cleanup.

Course: Agentic Engineering — https://learn-agentic-engineering.pages.dev/ · Module 5: Quality, safety, teams · 5 min · Watch: https://learn-agentic-engineering.pages.dev/lessons/agent-friendly-codebases/

## Key takeaways

- Agents copy the patterns they find. Garbage codebase in, garbage code out.
- Without steering, agent-built codebases decay fast, sometimes within weeks.
- Make the shortest path the right path: conventional structure, one way to do each thing.
- Deep modules with thin interfaces, strong types and fast, reliable tests are agent superpowers.
- Clean continuously: encode golden rules and let background agents open small refactor PRs.

## Practices for coding agents

- Before writing new code, find and follow the existing pattern for this kind of change; if there are several, ask which is canonical.
- Prefer simple, explicit code over clever abstractions; don't add a dependency when a few lines will do.
- Don't introduce a new way of doing something the codebase already does one way.
- Leave the code slightly cleaner: remove dead code you created and flag duplication you notice.

## Lesson transcript


### Intro (0:01)

Matt Pocock puts it bluntly: bad codebases make bad agents. If you have a garbage codebase, you'll get garbage out of the agent working in it. This lesson is about the codebase side of agentic engineering.

### Agents copy patterns (0:15)

Why does the codebase matter so much? Because agents imitate it. OpenAI's harness team found their agent replicates patterns that already exist in the repository, even uneven or suboptimal ones. Over time, that inevitably leads to drift.

### Decay is fast (0:32)

And drift is fast. Mario Zechner says agents, making local decisions, pile up abstractions, duplication and backwards-compatibility shims. You get enterprise-grade complexity within two weeks, with just two humans and ten agents. Dex Horthy finds agents start to struggle in a codebase after three to six months.

### Why it happens (0:54)

Kent Beck names the mechanism. Agents are prone to decisions that cause disruption at a distance. They don't reduce coupling or increase cohesion unless you tell them to. Each change is locally reasonable, and together they make a mess.

### The shortest path (1:11)

The first principle comes from Lauren Tan: make the shortest path the best path. Agents love shortcuts. So structure your code so that the lazy route is the correct one. Put a feature's code together in one place, and keep one obvious way to do each thing.

### Deep modules (1:29)

Second, prefer deep modules: a small interface hiding a lot of functionality. Left alone, agents tend to produce many tiny, shallow modules that are hard to navigate. Matt Pocock's approach: design the module interfaces yourself, and delegate the implementations, treating each module as a gray box with tests at its boundary.

### Sameness (1:52)

Third, sameness. Ryan Lopopolo's goal is to make the tokens needed for the job easy to predict, by making things the same as much as possible. One ORM, one language, one style of CI script, one way to do each shared thing. And with agents, finishing migrations is cheap, so don't leave two ways around for months.

### Enforced architecture (2:14)

Fourth, enforce your architecture. OpenAI's team gives every domain the same fixed layers, from types, to config, to repositories, services, runtime and UI, with dependency directions checked by custom linters. They note that this kind of architecture is usually postponed until you have hundreds of engineers. With agents, it's an early prerequisite.

### Simple code (2:39)

Fifth, keep code simple. Armin Ronacher's experience: simple code significantly outperforms complex code in agentic contexts. Ask for the dumbest thing that will work. Prefer plain functions with descriptive names over clever class hierarchies, and generating a few lines over adding a dependency.

### Strong feedback (3:00)

And give the agent strong feedback built into the code itself. Matt Pocock's wish list: more tests, higher quality tests, non-flaky tests, and above all, types, types, types. Thorsten Ball adds that over time, your codebase should hold more and more of the how-to knowledge, so your prompts can get shorter.

### Clean continuously (3:22)

Finally, clean continuously. OpenAI's team first spent every Friday, a fifth of the week, cleaning up AI slop by hand. It didn't scale. So they encoded golden principles as rules, and scheduled background agents that scan for deviations and open small refactoring pull requests. Garbage collection for code.

### Quick check (3:45)

**Quiz:** Three ways to query the database; agents keep mixing them. Best fix?
A. Mention the preferred one in every prompt
B. Pick one, migrate the rest with agents, and ban the others with a lint rule
C. Add a fourth, cleaner way
D. Accept it, everything still works
Answer: B — One way to do each thing, enforced by tooling, is something agents can't get wrong.


### Try it (4:00)

Audit your codebase from an agent's point of view. This prompt finds the places most likely to mislead an agent, and suggests a fix for each.

```text
Audit this codebase from an agent's point of view. Find: several ways of doing the same thing, shallow or tangled modules, weak types, flaky or slow tests, and patterns an agent would copy badly.
Rank the top 5 by how much they'd mislead an agent, with a fix each.
```


### Recap (4:09)

Recap. Agents copy what they see, so decay is fast. Make the shortest path the right path. Deep modules, one way to do each thing, enforced architecture, simple code and strong feedback. And clean continuously. Next: how to measure whether your agents are actually doing well, with evals.

## Sources

- Matt Pocock — Full Walkthrough: Workflow for AI Coding — Matt Pocock (at 36:50, 78:14): https://www.youtube.com/watch?v=-QFHIoCo-Ko&t=2210s
- Ryan Lopopolo — Harness engineering: leveraging Codex in an agent-first world: https://businessdatasolutions.github.io/ai-wiki/sources/2026-02-11-lopopolo-codex-harness-engineering
- Mario Zechner — Building pi in a World of Slop — Mario Zechner (at 14:12): https://www.youtube.com/watch?v=RjfbvDXpFls&t=852s
- Dex Horthy — Why Software Factories Fail (at 8:10): https://www.youtube.com/watch?v=Ib5GBkD555M&t=490s
- Kent Beck — TDD, AI agents and coding with Kent Beck (at 51:08): https://www.youtube.com/watch?v=aSXaxOdVtAQ&t=3068s
- Lauren Tan — SpaceX AI Engineer Lauren Tan: Part 1 (at 43:54): https://www.youtube.com/watch?v=PaPpyQocMww&t=2634s
- Matt Pocock — 5 Claude Code skills I use every single day (at 10:25): https://www.youtube.com/watch?v=EJyuu6zlQCg&t=625s
- Ryan Lopopolo — Harness Engineering: How to Build Software When Humans Steer, Agents Execute — Ryan Lopopolo, OpenAI (at 7:46, 34:25): https://www.youtube.com/watch?v=am_oeAoUhew&t=466s
- Armin Ronacher — Agentic Coding Recommendations: https://lucumr.pocoo.org/2025/6/12/agentic-coding/
- Matt Pocock — Ship working code while you sleep with the Ralph Wiggum technique (at 15:01): https://www.youtube.com/watch?v=_IK18goX4X8&t=901s
- Thorsten Ball — Think Harder: How I Prompt | Thorsten Ball at Laracon US 2026 (at 22:20): https://www.youtube.com/watch?v=HegqGzD-kvc&t=1340s
- Martin Fowler — How AI will change software engineering – with Martin Fowler (at 64:25): https://www.youtube.com/watch?v=CQmI4XKTa0U&t=3865s

License: CC BY 4.0 · https://github.com/Haple/agentic-engineering
