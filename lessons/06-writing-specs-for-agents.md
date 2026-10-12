# Lesson 6: Specs agents can execute

> A coding agent fills every gap in your request with its best guess, drawn from average code on the internet. A good spec closes the gaps that matter: the goal, what done looks like, the constraints and what's out of scope. Here's how to write one, without writing it yourself.

Course: Agentic Engineering — https://learn-agentic-engineering.pages.dev/ · Module 2: Working with one agent · 4 min · Watch: https://learn-agentic-engineering.pages.dev/lessons/writing-specs-for-agents/

## Key takeaways

- Whatever your spec leaves blank, the model fills in with average patterns from its training data.
- Spec the goal, acceptance criteria, constraints and out-of-scope. Leave low-level decisions to the agent.
- Make 'done' checkable: concrete steps and a pass or fail for each feature.
- Don't hand-write specs. Let the agent interview you, generate the spec, then edit it.
- Keep specs small and current. Prototype to discover what you want, then spec what you'll keep.

## Practices for coding agents

- Before building a feature, confirm the goal, acceptance criteria, constraints (stack, dependencies, performance) and what's out of scope; ask if any are missing.
- Search for existing patterns and modules to reuse before proposing new ones, and say which you'll reuse.
- Never add a new dependency without stating why and checking that the spec allows it.
- Express acceptance criteria as concrete, checkable steps, and track each as passing or failing.

## Lesson transcript


### Intro (0:01)

Every request you give an agent has gaps. The agent will fill every one of them. The question is whether you choose what goes there, or the internet does.

### Gaps get filled (0:11)

Mario Zechner, who builds the Pi coding agent, puts it like this. You know what we call a sufficiently detailed spec? It's a program. So if you leave blanks in your spec, the model fills them with the patterns it learned from average code on the internet.
OpenAI's Ryan Lopopolo estimates a good patch involves around five hundred small decisions that nobody wrote down. Naming, error handling, logging, performance. The model has seen every possible choice. Your job is to write down what good looks like here.

### The intern problem (0:45)

Brendan O'Leary learned this before agents existed. As a new manager, he gave interns a rough wireframe with placeholder emoji and Comic Sans. They built exactly that, Comic Sans and all. It wasn't their fault, he says. He never told them what mattered. Agents work the same way.

### Anatomy of a spec (1:04)

So what goes in a spec? Start with the goal and who it's for. Then what done looks like, as criteria you can check. Then the constraints: the stack, which dependencies are allowed, any performance limits. What's out of scope. And existing code the agent should reuse instead of reinventing.

### The right altitude (1:24)

Notice what's missing: function names, file layouts, how to write the loop. The JetBrains course on spec-driven development calls it the architect and the builder. Give lots of context about goals and constraints, and leave the low-level decisions to the agent.

### Constraints matter (1:41)

Constraints are the gaps that bite hardest. When Cursor's Wilson Lin pointed thousands of agents at building a web browser, they pulled in existing parsers and a JavaScript engine. That wasn't misbehavior. His instructions never said what to build from scratch.

### Checkable done (1:58)

The best specs make done machine-checkable. In Anthropic's long-running agent experiments, every feature gets concrete steps and a passes flag that starts as false. The agent only flips it to true after it has actually verified the behavior.

### Don't write it yourself (2:15)

Here's the good news: you don't have to write specs by hand. Geoffrey Huntley's workflow: I don't create my specs, I generate them. Have the agent interview you, let it write the spec, then review and edit it yourself before any code gets written.

### Small and current (2:32)

Two cautions. Martin Fowler warns against recreating waterfall: write the smallest spec that makes forward progress, then build in thin slices. And specs drift. Dex Horthy's team throws away plans after each task. The code is the source of truth. Even Boris Cherny's team often skips documents and prototypes instead. Prototype to learn what you want, then spec what you'll keep.

### Quick check (2:59)

**Quiz:** The agent added 3 dependencies for a CSV parser you expected it to write. What went wrong?
A. The agent ignored the spec
B. The spec never said which dependencies were allowed
C. Agents always overuse dependencies
D. Nothing, dependencies are always fine
Answer: B — Unstated constraints are gaps, and gaps get filled with defaults. Put dependency rules in the spec.


### Try it (3:14)

Try it on your next feature. This prompt makes the agent interview you and produce a one-page spec with a goal, checkable criteria, constraints, scope and code to reuse. Edit it, then build from it.

```text
I want to build [feature]. Interview me one question at a time
(with your recommended answer) to write a one-page spec:
goal and who it's for, acceptance criteria I can check, constraints (stack, dependencies, performance), out of scope, and existing code to reuse. Save it to specs/[name].md.
```


### Recap (3:29)

Recap. Every gap gets filled, so close the ones that matter. Spec the goal, checkable done, constraints and scope, at the right altitude. Let the agent interview you and write it. And keep specs small and disposable. Next: how to talk to agents, prompt by prompt.

## Sources

- Mario Zechner — Building pi in a World of Slop — Mario Zechner (at 14:16): https://www.youtube.com/watch?v=RjfbvDXpFls&t=856s
- Ryan Lopopolo — Harness Engineering: How to Build Software When Humans Steer, Agents Execute — Ryan Lopopolo, OpenAI (at 9:09): https://www.youtube.com/watch?v=am_oeAoUhew&t=549s
- GitHub (authors of the Agentic Engineering System) — GitHub's Agentic Engineering System: https://github.com/resources/insights/agentic-engineering-system
- Paul Everett — Full Course: Spec-Driven Development with Coding Agents (at 0:27, 9:36): https://www.youtube.com/watch?v=hy8UstR2NEg&t=27s
- Brendan O'Leary — Agentic Engineering: Working With AI, Not Just Using It — Brendan O'Leary (at 10:11): https://www.youtube.com/watch?v=BEKc4P87XKo&t=611s
- Wilson Lin — FastRender with Wilson Lin - building a web browser with swarms of thousands of coding agents (at 28:28): https://www.youtube.com/watch?v=bKrAcTf2pL4&t=1708s
- Justin Young — Effective harnesses for long-running agents: https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
- Geoffrey Huntley — The Ralph Wiggum Loop from 1st principles (by the creator of Ralph) (at 8:44): https://www.youtube.com/watch?v=4Nna09dG_c0&t=524s
- Anthropic (Claude Code team) — Best practices for Claude Code: https://www.anthropic.com/engineering/claude-code-best-practices
- Martin Fowler — How AI will change software engineering – with Martin Fowler (at 47:00): https://www.youtube.com/watch?v=CQmI4XKTa0U&t=2820s
- Boris Cherny — Building Claude Code with Boris Cherny (at 60:00): https://www.youtube.com/watch?v=julbw1JuAz0&t=3600s
- Andrew Ng — Andrew Ng: Building Faster with AI (at 6:23): https://www.youtube.com/watch?v=RNJCfif1dPY&t=383s
- Dex Horthy — Context engineering with Dex Horthy (at 64:54): https://www.youtube.com/watch?v=Usufn8IQJgw&t=3894s

License: CC BY 4.0 · https://github.com/Haple/agentic-engineering
