# Lesson 15: Subagents: delegate to a fresh context

> A subagent is a fresh copy of your agent, sent off with its own context window to do messy work and report back only the answer. Used for context control, not role-play, subagents keep your main session sharp: exploring, running noisy tests, reviewing with fresh eyes, or trying several designs at once.

Course: Agentic Engineering — https://learn-agentic-engineering.pages.dev/ · Module 4: Scaling up · 4 min · Watch: https://learn-agentic-engineering.pages.dev/lessons/subagents/

## Key takeaways

- A subagent is a fresh copy of the agent with its own context window; only its summary comes back.
- Subagents are for context control, not role-play personas.
- Great uses: exploring a codebase, running verbose tests, fresh-eyes review, trying several designs in parallel.
- Parallel subagents shine on breadth-first work; most coding tasks have fewer independent pieces.
- Don't over-split: handoffs between agents are a common failure point.

## Practices for coding agents

- Delegate token-heavy searching and reading to a subagent and keep only its summary in the main context.
- Give subagents a complete, self-contained brief: goal, scope, what to return and in what format.
- Use a fresh subagent with no stake in the code to review your own changes.
- Have subagents write large outputs to files and return paths, not paste everything back.

## Lesson transcript


### Intro (0:01)

What if your agent could clone itself, send the clone off to do the messy work, and get back just the answer? That's a subagent, and it's one of the best tools you have for keeping context clean.

### What it is (0:13)

Simon Willison's definition: when a coding agent uses a subagent, it effectively dispatches a fresh copy of itself to achieve a specified goal, with a new context window that starts with a fresh prompt.

### Context isolation (0:26)

Here's why that matters. The main agent writes a short brief and hands it to the subagent. The subagent burns through tens of thousands of tokens, searching and reading files. Then it returns a compact summary, maybe a thousand or two thousand tokens. As Thorsten Ball puts it, all the garbage tokens stay out of your main context.
In one of Matt Pocock's sessions, an explore subagent used almost ninety-four thousand tokens of its own, and the main context barely moved. Thorsten calls this the multiplication of context windows: every subagent call is a whole new window.

### Not role-play (1:05)

There's a popular misconception. People build teams of personas: a front-end developer agent, a QA agent, a product manager agent. Dex Horthy is blunt about it: subagents are not for anthropomorphizing roles. They are for controlling context. Boris Cherny adds that the real value is uncorrelated context windows that don't know about each other.

### Good uses (1:30)

So what are subagents good for? Exploring: Claude Code often sends an explore subagent before touching an existing repo. Running a verbose test suite and reporting only the failures. Reviewing with fresh eyes, since an agent reviewing its own work tends to go easy on itself. And trying several designs at once: Matt Pocock spawns three subagents, each told to produce a radically different interface.

### Fan out, then filter (1:57)

Subagents also enable a powerful pattern: fan out, then filter. Boris describes a code review command that sends parallel subagents to look for problems from different angles. Then several more subagents check each finding for false positives, so you only see real issues.

### When parallel pays off (2:16)

How much can this help? On Anthropic's internal research benchmark, a lead agent coordinating parallel subagents outperformed a single agent by ninety percent. But they're careful to add that most coding tasks have fewer truly independent pieces than research, and agents aren't yet great at coordinating each other in real time.

### Pitfalls (2:38)

A few pitfalls. Don't over-split: Simon Willison warns against dozens of specialist subagents. Watch the handoff: Will from Anthropic says a subagent can get its task right and still fail because the message back to the orchestrator lost something. And for big outputs, have subagents write to files and pass back a path, instead of a game of telephone.

### Quick check (3:03)

**Quiz:** Which is the best use of a subagent?
A. A “senior frontend developer” persona chatting with a “QA” persona
B. Searching a huge codebase and returning a short map to the main agent
C. Splitting a ten-line bug fix across five agents
D. Running every single tool call in its own agent
Answer: B — Subagents are for context control: let one absorb the messy search and hand back only what matters.


### Try it (3:14)

Try both classic uses in one go. One subagent explores and reports back a short map. A second, with no knowledge of your plans, reviews a file with fresh eyes.

```text
Use a subagent to explore how [feature] works across the codebase and report back under 300 words, with file paths.
Then use a second, fresh subagent with no knowledge of my plans to review [file] for bugs. Tell me roughly how much context each used.
```


### Recap (3:26)

Recap. A subagent is a fresh copy with its own context window. Use it for context control, not role-play. Explore, run noisy work, review with fresh eyes, try alternatives. Fan out, then filter. And don't over-split. Next: running whole agents in parallel.

## Sources

- Simon Willison — Subagents - Agentic Engineering Patterns: https://simonwillison.net/guides/agentic-engineering-patterns/subagents/
- Thorsten Ball — Subagents & the Multiplication of Context Windows   Thorsten Ball (at 5:31, 10:53, 8:07): https://www.youtube.com/watch?v=sX1GYDHaCiw&t=331s
- Matt Pocock — Full Walkthrough: Workflow for AI Coding — Matt Pocock (at 18:14): https://www.youtube.com/watch?v=-QFHIoCo-Ko&t=1094s
- Anthropic Applied AI team (Prithvi Rajasekaran, Ethan Dixon, Carly Ryan, Jeremy Hadfield) — Effective context engineering for AI agents: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
- Dex Horthy — No Vibes Allowed: Solving Hard Problems in Complex Codebases – Dex Horthy, HumanLayer (at 6:52): https://www.youtube.com/watch?v=rmvDxxNubIg&t=412s
- Boris Cherny, Cat Wu — The Secrets of Claude Code From the Engineers Who Built It (at 24:06, 23:00): https://www.youtube.com/watch?v=IDSAMqip6ms&t=1446s
- Will — Tool, skill, or subagent? Decomposing an agent that outgrew its prompt (at 36:06, 7:47): https://www.youtube.com/watch?v=mWvtOHlZM-I&t=2166s
- Matt Pocock — 5 Claude Code skills I use every single day (at 13:31): https://www.youtube.com/watch?v=EJyuu6zlQCg&t=811s
- Jeremy Hadfield, Barry Zhang, Kenneth Lien, Florian Scholz, Jeremy Fox, Daniel Ford — How we built our multi-agent research system: https://www.anthropic.com/engineering/multi-agent-research-system
- John Kim — How I Review AI Code - (Meta Senior Staff Engineer) (at 13:15): https://www.youtube.com/watch?v=b2QkhmQ0sT0&t=795s

License: CC BY 4.0 · https://github.com/Haple/agentic-engineering
