# Lesson 10: When the agent goes off the rails

> Every agent goes off the rails sometimes. The skill isn't avoiding it; it's noticing early and recovering cheaply. Learn the warning signs, the recovery ladder from a quick interrupt to throwing the work away, and the habits that make recovery cheap.

Course: Agentic Engineering — https://learn-agentic-engineering.pages.dev/ · Module 2: Working with one agent · 4 min · Watch: https://learn-agentic-engineering.pages.dev/lessons/when-agents-go-wrong/

## Key takeaways

- Interrupt early. Escape is always safe, and fixing one wrong line now beats untangling twenty later.
- Climb the recovery ladder: redirect, rewind, revert to a commit, start fresh, or throw it away.
- Commit after every working step. Commits are save points for you and for the agent.
- When stuck, change the approach, not just the prompt.
- Code is cheap now. Throwing work away and re-planning is often the fastest path.

## Practices for coding agents

- Commit after each verified step with a descriptive message so work can be rolled back.
- If the same fix has failed twice, stop and report what you've learned instead of trying again.
- Don't widen the scope to make a failing approach work; propose a different approach instead.
- Never take destructive actions (deleting files, resetting branches, editing secrets) to get unstuck without asking.

## Lesson transcript


### Intro (0:01)

Every agent goes off the rails sometimes. The skill isn't avoiding it. It's noticing early, and recovering cheaply.

### It's normal (0:09)

Ben Vinegar makes a provocative point. If your agent never seems subtly wrong, if you never have to stop and scrutinize, that's a bad sign. It probably means you're just pressing go and merging.

### Warning signs (0:23)

Here are the warning signs we've met so far. It loops, trying the same thing again. It does work you didn't ask for. It weakens a test to get green. It agrees with you enthusiastically and keeps failing. Or its attempts get more and more extreme. Any one of these means: stop.

### Interrupt early (0:44)

The first tool is the escape key. Boris Cherny's advice: no matter what the agent is doing, you can always safely hit escape. It won't corrupt anything. If nineteen of twenty lines look right, stop it, correct the one, and let it continue.

### The recovery ladder (1:00)

When interrupting isn't enough, climb the recovery ladder. Each rung costs a bit more. Redirect with a quick correction. Rewind to an earlier point in the conversation. Revert the code to your last good commit. Start a fresh session from a summary. Or throw the work away and re-plan.

### Save points (1:20)

Reverting only works if there's something to revert to. In Anthropic's long-running agent experiments, the best behavior came from asking the model to commit its progress to git with descriptive messages after each step. That let it roll back bad changes and recover a working state on its own.

### Start fresh (1:38)

And when a session has gone sour, don't argue with it. As we saw in lesson four, a history full of failures invites more failures. Ask for a summary of what was learned, clear the session, and start over with a better prompt.

### Change the approach (1:53)

Sometimes the fix is to change the problem, not the prompt. Kent Beck's agent stalled on an algorithm in Rust. So he had it write a Python version first, with the same tests, in a less constraining language. Once the algorithm worked, he told it to erase the Rust code and transliterate the Python.

### Throw it away (2:13)

The top rung is the one people resist most: throwing the work away. But the economics have flipped. DHH says the cost of exploring a hunch has dropped a thousandfold. Kent Beck predicts teams will generate ten times as many experiments and keep one. Throwing away a failed attempt and re-planning is often the fastest path.

### Make recovery cheap (2:35)

A few habits make all of this cheaper. Commit after every working step. Keep tasks small, so a do-over costs minutes, not hours. Plan first, so mistakes surface in a document instead of a diff. And Mitchell Hashimoto suggests turning off agent notifications, so you decide when to check in, instead of being pulled away every few minutes.

### Quick check (2:58)

**Quiz:** 20 minutes of failed fixes, a growing diff, a third “You're absolutely right!”. Best move?
A. Let it keep going, it must be close
B. Stop, revert to the last good commit, restart with a better prompt
C. Tell it to try harder and think carefully
D. Accept the diff now and clean up later
Answer: B — The session is poisoned and the diff is suspect. Roll back to a save point and restart with what you learned.


### Try it (3:16)

Build recovery into your next task from the start. This prompt makes the agent leave save points, and tells it to stop and report instead of flailing.

```text
Commit after each step that passes the tests, with a descriptive message, so we can roll back. If a fix fails twice, stop and tell me what you learned instead of trying a third time. Never delete files, reset branches, or touch secrets to get unstuck.
```


### Recap (3:26)

Recap. Interrupt early; escape is always safe. Climb the ladder: redirect, rewind, revert, restart, throw away. Commit save points as you go. And when you're stuck, change the approach. That completes the core workflow. Next module: your toolkit, starting with memory files.

## Sources

- Armin Ronacher, Ben Vinegar — State of Agentic Coding #10 with Armin and Ben (at 88:33): https://www.youtube.com/watch?v=9UAxrdcDjjU&t=5313s
- Boris Cherny — Mastering Claude Code in 30 minutes (at 20:10): https://www.youtube.com/watch?v=6eBSHbLKuN0&t=1210s
- Boris Cherny, Cat Wu — The Secrets of Claude Code From the Engineers Who Built It (at 17:53, 16:16): https://www.youtube.com/watch?v=IDSAMqip6ms&t=1073s
- Justin Young — Effective harnesses for long-running agents: https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
- Brendan O'Leary — Agentic Engineering: Working With AI, Not Just Using It — Brendan O'Leary (at 11:03): https://www.youtube.com/watch?v=BEKc4P87XKo&t=663s
- Dex Horthy — Context engineering with Dex Horthy (at 73:41): https://www.youtube.com/watch?v=Usufn8IQJgw&t=4421s
- Kent Beck — Augmented Coding: Beyond the Vibes: https://tidyfirst.substack.com/p/augmented-coding-beyond-the-vibes
- Kent Beck — TDD, AI agents and coding with Kent Beck (at 73:31): https://www.youtube.com/watch?v=aSXaxOdVtAQ&t=4411s
- David Heinemeier Hansson (DHH) — DHH’s new way of writing code (at 70:40): https://www.youtube.com/watch?v=JiWgKRgdgpI&t=4240s
- Boris Cherny — Head of Claude Code: What happens after coding is solved | Boris Cherny (at 68:01): https://www.youtube.com/watch?v=We7BZVKbCVw&t=4081s
- Mitchell Hashimoto — My AI Adoption Journey: https://mitchellh.com/writing/my-ai-adoption-journey
- Anthropic (Claude Code team) — Best practices for Claude Code: https://www.anthropic.com/engineering/claude-code-best-practices

License: CC BY 4.0 · https://github.com/Haple/agentic-engineering
