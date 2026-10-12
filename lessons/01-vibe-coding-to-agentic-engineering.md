# Lesson 1: From vibe coding to agentic engineering

> In late 2025 coding agents crossed a line: they started doing what you asked, almost every time. This lesson defines agentic engineering, separates it from vibe coding, and shows what you still own when code becomes cheap.

Course: Agentic Engineering — https://learn-agentic-engineering.pages.dev/ · Module 1: The shift · 4 min · Watch: https://learn-agentic-engineering.pages.dev/lessons/vibe-coding-to-agentic-engineering/

## Key takeaways

- Vibe coding means not looking at the code. It's fine when the only person a bug can hurt is you.
- Agentic engineering means agents write and run the code while you keep the professional quality bar.
- Code is cheap now. Good code isn't. The skill is turning cheap code into good software.
- You still own what's worth building, the design, the proof that it works, and your understanding of the system.
- Agents don't make you faster automatically. In a 2025 trial, experienced developers were 19% slower while believing they were faster.

## Practices for coding agents

- Treat every task as professional work: the quality bar does not drop because an agent wrote the code.
- Before calling a task done, produce evidence it works (tests run, command output, screenshot), not just a summary.
- Match autonomy to the task: small, verifiable tasks can run with more autonomy; ambiguous or risky ones need a plan and a human checkpoint.
- Keep the human able to understand the change: explain non-obvious decisions in the PR or summary.

## Lesson transcript


### Intro (0:01)

In February 2025, Andrej Karpathy gave a name to a new way of programming. A year later, he said it was already out of date. This lesson is about what replaced it.

### Vibe coding (0:13)

He called it vibe coding. You fully give in to the vibes, embrace exponentials, and forget that the code even exists. It was perfect for weekend projects. It was not how you'd build a bank.

### What changed (0:27)

Here's the short history. Autocomplete finished your lines. Chat assistants wrote snippets you pasted in. Vibe coding let the model drive. Then, in late 2025, coding agents crossed a line. As Simon Willison put it, they now almost always do what you told them to do.
Karpathy described his own workflow flipping in a single month. In December, he went from writing about eighty percent of his code himself to delegating about eighty percent of it to agents.
Boris Cherny, who created Claude Code, says agents now write one hundred percent of his code. He ships dozens of pull requests a day, without editing a single line by hand.

### Two disciplines (1:11)

But vibe coding didn't simply grow up. A different discipline appeared next to it. Vibe coding means you don't read the code, which is fine when the only person a bug can hurt is you. Agentic engineering means agents write and run the code, while you keep the professional quality bar.
Karpathy's own definition: agentic engineering is about preserving the quality bar of what existed before in professional software. You go faster, but you're not allowed to ship a vulnerability just because an agent wrote it.

### The name (1:43)

The name has two halves. Agentic, because most of the time you're no longer typing the code. You orchestrate agents and act as oversight. And engineering, because there's an art, a science and real expertise to it. It's a skill you can learn and get better at.

### Code is cheap (2:01)

This changes what's scarce. As OpenAI's Ryan Lopopolo puts it, implementation is no longer the scarce resource. Simon Willison asks the real question: if I can churn out ten thousand lines in the time it used to take me to write a hundred, how do I make that code good?

### What you own (2:19)

That question is what this course answers, and it starts with what doesn't change. You still own what's worth building, the design and the taste, the proof that it works, and your understanding of the system. As Karpathy says, you can outsource your thinking, but you can't outsource your understanding.

### Reality check (2:39)

Now a reality check. In a 2025 trial, experienced open source developers expected AI to make them twenty-four percent faster. They were actually nineteen percent slower, and still believed they'd been sped up. Tools have improved a lot since then, but the lesson stands. Agents don't make you faster automatically. Skill does.

### The autonomy slider (3:03)

Karpathy calls this the autonomy slider. At one end, you type and the AI suggests. At the other, agents work for hours on their own. You are in charge of the slider. Agentic engineering is choosing the right setting for each task, and making the higher settings safe.

### Course map (3:21)

Here's the path. First, how agents actually work. Then the core workflow with a single agent. Then your toolkit: memory files, tools and skills. Then scaling up to many agents at once. Then quality, safety and teams. And finally, the engineer you become.

### Quick check (3:42)

**Quiz:** Which of these is agentic engineering?
A. Accepting every change without reading it, because the app runs
B. An agent writes and tests the code; you review it against a real quality bar
C. Writing every line yourself and using AI only for search
D. Pasting chatbot snippets into your editor
Answer: B — Agents do the typing and the running. You keep the quality bar and the judgment.


### Try it (3:52)

Try this with your own agent. Ask it to find three small, low-risk tasks in a real project, each with a way to prove it worked. Don't let it change anything yet. You'll use these tasks throughout the course.

```text
I'm learning agentic engineering. Explore this repository and suggest three small, low-risk tasks you could complete end to end.
For each one, tell me how you would prove it works
(a test, a command, a screenshot). Don't change any files yet.
```


### Recap (4:06)

Let's recap. Vibe coding forgets the code exists. Agentic engineering keeps the quality bar while agents do the typing. Code is cheap now, good code isn't. And you still own the judgment. Next, let's open the hood and see how a coding agent actually works.

## Sources

- Andrej Karpathy — Vibe coding, one year later (post on X): https://x.com/karpathy/status/2019137879310836075
- Andrej Karpathy — Andrej Karpathy: From Vibe Coding to Agentic Engineering w/ Stephanie Zhan (at 1:23, 16:07, 28:12): https://www.youtube.com/watch?v=96jN2OCOfLs&t=83s
- Andrej Karpathy — Skill Issue: Andrej Karpathy on Code Agents, AutoResearch, and the Loopy Era of AI (at 1:31): https://www.youtube.com/watch?v=kwSVtQ7dziU&t=91s
- Simon Willison — An AI state of the union: We’ve passed the inflection point & dark factories are coming (at 4:41, 9:29, 46:02): https://www.youtube.com/watch?v=wc8FBhQtdsA&t=281s
- Boris Cherny — Building Claude Code with Boris Cherny (at 35:36): https://www.youtube.com/watch?v=julbw1JuAz0&t=2136s
- Ryan Lopopolo — Harness Engineering: How to Build Software When Humans Steer, Agents Execute — Ryan Lopopolo, OpenAI (at 1:54): https://www.youtube.com/watch?v=am_oeAoUhew&t=114s
- Andrej Karpathy — Andrej Karpathy: Software Is Changing (Again) (at 20:30): https://www.youtube.com/watch?v=LCEmiRjPEtQ&t=1230s
- METR — Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity: https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/
- Anthropic — 2026 Agentic Coding Trends Report: https://resources.anthropic.com/2026-agentic-coding-trends-report
- Simon Willison — What is agentic engineering? - Agentic Engineering Patterns: https://simonwillison.net/guides/agentic-engineering-patterns/what-is-agentic-engineering/

License: CC BY 4.0 · https://github.com/Haple/agentic-engineering
