# Lesson 4: Context is everything

> Almost every best practice for coding agents comes from one constraint: the context window fills up fast, and quality drops as it fills. Learn the smart zone and the dumb zone, why fresh sessions beat long ones, and the four moves of context engineering.

Course: Agentic Engineering — https://learn-agentic-engineering.pages.dev/ · Module 2: Working with one agent · 4 min · Watch: https://learn-agentic-engineering.pages.dev/lessons/context-engineering/

## Key takeaways

- The context window is the agent's working memory. It doesn't learn as it goes; you program that memory directly.
- Quality degrades long before the window is full. Treat roughly the first 40% as the smart zone.
- A long session full of failed attempts poisons the trajectory. A fresh session with a better prompt usually wins.
- Write important state to files, start fresh often, and load context just in time instead of up front.
- Context engineering has four moves: write it down, select what's relevant, compress, and isolate.

## Practices for coding agents

- Load context just in time: search and read the files the task needs instead of reading everything up front.
- Keep tool output lean: summarize long logs and stack traces instead of pasting them whole.
- At natural breakpoints, write the goal, decisions, open questions and next step to a file so a fresh session can resume.
- If the same correction has been needed twice, stop and suggest restarting with a clean session and a better prompt.

## Lesson transcript


### Intro (0:01)

If you remember one lesson from this course, make it this one. Almost every best practice for working with coding agents comes from a single constraint.

### The constraint (0:11)

Anthropic's own guide to Claude Code says it plainly. Most best practices are based on one constraint: the context window fills up fast, and performance degrades as it fills.

### Working memory (0:23)

Karpathy offers a helpful picture. The model is like a CPU. The context window is its RAM, a small working memory. And unlike a new colleague, the model doesn't get smarter as it works with you. So you are the operating system, deciding what goes into that memory.

### Smart zone, dumb zone (0:41)

Here's the catch. Quality doesn't hold steady until the window is full. Dex Horthy calls the early part the smart zone. Past it comes the dumb zone, where the agent forgets instructions and contradicts itself. His rule of thumb for beginners: try to stay under about forty percent, and start wrapping up around sixty.
You'll recognize the dumb zone when you see it. Deep into a long session, the agent starts trying more and more extreme things to make a test pass. Dex's favorite example: let me just delete your env file and try again. That's your cue to stop.

### What poisons context (1:18)

Size isn't the only problem. Dex lists four things that matter in a context window. Its size. Its quality, meaning wrong or outdated information. What's missing. And the trajectory, the history of what the agent has done. Models continue patterns, so a history full of mistakes and corrections invites more mistakes.
He describes it from the model's point of view. If I read the history, I should probably make another mistake, so the human can yell at me. When a session reaches that point, more corrections won't help.

### Fresh beats long (1:54)

Which leads to the most practical habit in this course. Anthropic's guidance: if you've corrected the agent twice on the same thing, clear the session and start over with a better prompt that includes what you learned. A clean session with a better prompt almost always beats a long one full of corrections.

### Hand off, then clear (2:13)

Here's how to restart without losing progress. Ask the agent to summarize the session for a fresh agent: the goal, what was decided, what failed, which files matter. Review it, clear, and paste it in. As Brendan O'Leary says, AI is really great at writing prompts for AI.

### Clear or compact (2:32)

What about compaction, where the agent summarizes itself automatically when the window fills? It works, but it's lossy, and it decides what to forget on its own. Matt Pocock's advice: clear should be your default. Compact only when you want to keep the gist. Better yet, write the important state to a file before you need to.

### Four moves (2:54)

Lance Martin sums up context engineering in four moves. Write things down outside the window, in notes and plans. Select only what's relevant for this step. Compress what you keep. And isolate work in separate contexts, like subagents, so one task doesn't pollute another. We'll use all four throughout the course.

### Quick check (3:16)

**Quiz:** You've corrected the agent three times on the same bug. What's the best move?
A. Correct it again, more firmly
B. Switch to a model with a bigger context window
C. Get a summary of what you learned, then start a fresh session
D. Paste in the whole codebase so it has more context
Answer: C — The trajectory is poisoned. A clean session with a better prompt beats more corrections, and a bigger window just extends the dumb zone.


### Try it (3:30)

Practice the handoff. Next time a session feels long, paste this prompt, save the summary, clear the session, and start again from the summary. Notice how much sharper the agent feels.

```text
Summarize this session for a fresh agent who knows nothing:
the goal, decisions made, what failed and why, the files that matter, and the exact next step. Under 200 words.
Save it to notes/handoff.md.
```


### Recap (3:43)

Recap. Context is the agent's working memory, and quality drops as it fills. Stay in the smart zone. When a session goes bad, hand off and start fresh. And write, select, compress and isolate. Next, the core workflow that puts all of this to work: explore, plan, implement, verify.

## Sources

- Anthropic (Claude Code team) — Best practices for Claude Code: https://www.anthropic.com/engineering/claude-code-best-practices
- Andrej Karpathy — Andrej Karpathy: Software Is Changing (Again) (at 17:09): https://www.youtube.com/watch?v=LCEmiRjPEtQ&t=1029s
- Lance Martin — Context Engineering for Agents (at 0:55, 3:40): https://www.youtube.com/watch?v=4GiqzUHD5AA&t=55s
- Dex Horthy — Context engineering with Dex Horthy (at 70:26, 71:18, 72:18, 73:41): https://www.youtube.com/watch?v=Usufn8IQJgw&t=4226s
- Dex Horthy — Everything We Got Wrong About Research-Plan-Implement -  Dexter Horthy (at 26:00): https://www.youtube.com/watch?v=YwZR6tc7qYg&t=1560s
- Matt Pocock — Full Walkthrough: Workflow for AI Coding — Matt Pocock (at 4:11): https://www.youtube.com/watch?v=-QFHIoCo-Ko&t=251s
- Matt Pocock — Most devs don’t understand how context windows work (at 6:58): https://www.youtube.com/watch?v=-uW5-TaVXu4&t=418s
- Geoffrey Huntley — The Ralph Wiggum Loop from 1st principles (by the creator of Ralph) (at 12:41): https://www.youtube.com/watch?v=4Nna09dG_c0&t=761s
- Anthropic Applied AI team (Prithvi Rajasekaran, Ethan Dixon, Carly Ryan, Jeremy Hadfield) — Effective context engineering for AI agents: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
- Brendan O'Leary — Agentic Engineering: Working With AI, Not Just Using It — Brendan O'Leary (at 11:03): https://www.youtube.com/watch?v=BEKc4P87XKo&t=663s
- The Coding Sloth — I Have Spent 1000+ Hours With Claude Code. This Is What I Learned (at 14:02): https://www.youtube.com/watch?v=YAsxyoTWFDA&t=842s

License: CC BY 4.0 · https://github.com/Haple/agentic-engineering
