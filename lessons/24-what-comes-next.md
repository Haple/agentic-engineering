# Lesson 24: What comes next

> Agents went from finishing your lines to working for hours in about two years, and the curve hasn't flattened. Here's where the people building these tools think it's heading, why the bottleneck is moving from “can we build it” to “should it exist”, and a simple playbook for staying current.

Course: Agentic Engineering — https://learn-agentic-engineering.pages.dev/ · Module 6: The engineer you become · 4 min · Watch: https://learn-agentic-engineering.pages.dev/lessons/what-comes-next/

## Key takeaways

- It's the decade of agents, not the year: progress is fast but uneven, and humans stay in the loop.
- Task lengths agents can handle have doubled roughly every seven months for years.
- Agents are moving into the cloud and into team tools, and starting to propose work, not just do it.
- The bottleneck moves from “can we build this?” to “should this exist, and can we answer for it?”
- Stay current: retry failed tasks with each new model, build for the next model, and think bigger.

## Practices for coding agents

- Don't assume a task is impossible because an earlier model failed at it; try, and report honestly.
- Surface product questions (should this exist? for whom?) when they matter, instead of only implementing.
- Prefer reversible, well-verified changes so humans can keep up as you move faster.
- Keep the human informed with concise, decision-ready summaries rather than raw transcripts.

## Lesson transcript


### Intro (0:01)

Nobody knows exactly where this goes. But the people building these tools agree on a few things, and those are worth knowing. Welcome to the last lesson.

### A decade, not a year (0:11)

First, temper the hype. When people called 2025 the year of agents, Karpathy pushed back. This is the decade of agents, he said. Software, like driving, is tricky, and humans need to stay in the loop while the technology matures.

### The curve (0:29)

But the curve is steep. METR found that the length of tasks agents can complete has doubled roughly every seven months for six years. If that continues for a few more years, they project agents handling week-long tasks. Boris Cherny says Anthropic's recent models already ran for around thirty hours on their own.

### Where it's heading (0:50)

Where is it heading? Agents are moving into the cloud, where they're easier to sandbox, and into the tools teams already use, like chat and issue trackers. They're starting to propose work, not just do it: Boris describes Claude reading feedback, bug reports and telemetry, and suggesting what to fix. And Daisy Hollman expects the next bottleneck to be getting information from the model to you, because your attention is the scarce part.

### The real question (1:18)

Addy Osmani describes the deeper shift. Every time software got cheaper to build, demand grew. Agents won't remove engineering work. They'll move the bottleneck, from can we build this, to should this exist, and can we answer for it?

### Scribes and authors (1:34)

Boris Cherny reaches for the printing press. Scribes stopped being scribes, but an enormous new world of writers and authors appeared. Martin Fowler, who has seen more shifts than most, doesn't think AI will wipe out software development. He expects a change as big as the move from assembly to high-level languages.

### Staying current (1:55)

So how do you keep up? Three habits from the people building this. Simon Willison: whenever a model fails at something, tuck it away and try again in six months. Sometimes it suddenly works. Boris Cherny: build for the model six months from now, not today's. And Theo Browne: the models are getting better faster than we are, so instead of only getting better, go bigger.

### The whole course (2:21)

Let's bring the whole course together. Agentic engineering keeps the quality bar while agents do the typing. Context is everything. Explore, plan, implement, verify. Close the loop, so agents check their own work. Encode what you learn into memory files, skills, hooks and checks. Scale with isolation and care. Guard against the lethal trifecta. And remember: you own the loop.

### Final check (2:49)

**Quiz:** An agent failed at a task you tried last spring. What now?
A. Conclude agents can't do that kind of task
B. Note it, and retry with newer models every few months
C. Never delegate that kind of task again
D. Only ever do it by hand
Answer: B — Capabilities shift with every release. Yesterday's failure is today's retry.


### Your agent's turn (3:02)

Here's your final exercise, and it's a fun one. Install this course as a skill, so your agent follows the same practices you just learned. Then ask it to audit your project against them and pick the top three improvements.

```text
npx skills add Haple/agentic-engineering

Then ask your agent:
"Audit this repo against the agentic-engineering skill: memory file, verification, skills and hooks, git habits, security.
Give me the top 3 improvements, with the first steps."
```


### Thank you (3:17)

That's the course. Thank you for taking it. If it helped, share it with a teammate, and let your agent take it too. Keep the quality bar high, keep learning, and enjoy building. You own the loop.

## Sources

- Andrej Karpathy — Andrej Karpathy: Software Is Changing (Again) (at 27:30): https://www.youtube.com/watch?v=LCEmiRjPEtQ&t=1650s
- METR — Measuring AI Ability to Complete Long Software Tasks: https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/
- Boris Cherny, Cat Wu — The Secrets of Claude Code From the Engineers Who Built It (at 46:16): https://www.youtube.com/watch?v=IDSAMqip6ms&t=2776s
- Armin Ronacher, Ben Vinegar — State of Agentic Coding #10 with Armin and Ben (at 47:40): https://www.youtube.com/watch?v=9UAxrdcDjjU&t=2860s
- Boris Cherny — Head of Claude Code: What happens after coding is solved | Boris Cherny (at 17:45, 65:51): https://www.youtube.com/watch?v=We7BZVKbCVw&t=1065s
- Daisy Hollman — How Anthropic uses Claude Code: Agentic Software Engineering at Scale - Daisy Hollman (at 57:23): https://www.youtube.com/watch?v=shZgedW15vg&t=3443s
- Addy Osmani — "The engineer of the future is the person who is able to choose what is worth doing." — Addy Osmani (at 17:18): https://www.youtube.com/watch?v=n97BCfyFIvw&t=1038s
- Boris Cherny — Building Claude Code with Boris Cherny (at 89:22): https://www.youtube.com/watch?v=julbw1JuAz0&t=5362s
- Martin Fowler — How AI will change software engineering – with Martin Fowler (at 100:50): https://www.youtube.com/watch?v=CQmI4XKTa0U&t=6050s
- Simon Willison — Simon Willison: Engineering practices that make coding agents work - The Pragmatic Summit (at 22:10): https://www.youtube.com/watch?v=owmJyKVu5f8&t=1330s
- Theo Browne (t3.gg) — Everything we knew about software has changed — Theo Browne, @t3dotgg ​ (at 3:35): https://www.youtube.com/watch?v=xUnRQ9vLXxo&t=215s

License: CC BY 4.0 · https://github.com/Haple/agentic-engineering
