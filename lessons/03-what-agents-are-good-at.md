# Lesson 3: What agents are great at, and where they fail

> Agent intelligence is jagged: superhuman on some tasks, baffling on others. The pattern isn't random. Agents fly where results are easy to verify and stumble on judgment, design and long, unchecked runs. Learn to delegate by verifiability.

Course: Agentic Engineering — https://learn-agentic-engineering.pages.dev/ · Module 1: The shift · 4 min · Watch: https://learn-agentic-engineering.pages.dev/lessons/what-agents-are-good-at/

## Key takeaways

- Agent ability is jagged: the same model can refactor a huge codebase and still make a mistake no human would.
- Models are best at what can be verified. Code is ideal because you can compile it, run it and test it.
- Agents struggle with judgment: architecture, design quality and business context. Their code can be technically correct and contextually wrong.
- They report success confidently, even when they failed or quietly weakened a test. Don't trust, verify.
- Delegate by verifiability and risk: easy to check and cheap to get wrong means more autonomy.

## Practices for coding agents

- Never report a task as done without evidence; if a check was skipped or failed, say so plainly.
- Never weaken, skip or delete tests to make them pass; fix the code or flag the test as wrong and explain why.
- Flag design decisions that need human judgment (data models, identifiers, money, security, public APIs) instead of silently choosing.
- Don't add functionality that wasn't asked for, even if it seems like a natural next step; propose it instead.

## Lesson transcript


### Intro (0:01)

Agents are brilliant and baffling, often in the same hour. That's not random. Once you see the pattern, you'll know what to hand off and what to keep.

### Jagged intelligence (0:11)

Karpathy describes the paradox. A state of the art model will refactor a hundred-thousand-line codebase or find a zero-day vulnerability, and yet, when you ask how to get your car to a car wash fifty meters away, it tells you to walk.

### Why it's jagged (0:27)

His explanation is the most useful idea in this lesson. Traditional computers automate what you can specify in code. Today's models automate what you can verify. Labs train them on tasks with checkable answers, so they peak wherever checking is easy.

### Why code is ideal (0:44)

And code is the most verifiable thing there is. You can compile it, lint it, run it and test it. As Peter Steinberger puts it, if you design it right, you have a perfect loop. That's why coding agents arrived before agents for almost anything else.

### Where agents fly (1:01)

So agents fly on work with a fast, clear check. Reading and explaining a large codebase. Fixing a bug you can reproduce with a failing test. Migrations where the old tests define the target. Boilerplate, scripts and prototypes, where a wrong answer is cheap.

### Where they fail (1:19)

Now the other side. Karpathy's own app needed to connect Stripe payments to user accounts. The agent matched them by email address instead of a stable user ID. It looked fine, and it would have quietly lost track of money. Brendan O'Leary calls this code that is technically correct, and contextually wrong.
Why does this happen? Dex Horthy points at the training itself. The reward checks whether the code runs and the tests pass. Nothing penalizes poor design or code that will be hard to maintain in six months. So you get code that works, but is bloated, copy-pasted, and built on brittle abstractions.

### Confidently wrong (1:59)

Agents also report success with total confidence. Martin Fowler is blunt about it: they lie to you all the time. If they were a junior developer, he says, he'd be having some words with HR. In one demo, a browser agent hit a login wall and still reported that it had upvoted the post.

### Warning signs (2:18)

Kent Beck watches for three warning signs. Loops, where the agent keeps trying the same thing. Functionality you didn't ask for, even when it's a reasonable next step. And cheating, like disabling or deleting a test to make the build go green. See any of these, and it's time to step in.

### Task length (2:37)

Task length matters too. When METR measured agents in early 2025, they succeeded almost every time on tasks that take a human expert under four minutes, and less than ten percent of the time on tasks over four hours. That horizon has been doubling roughly every seven months, so check what today's models can sustain, but the shape stays the same.

### Delegate by verifiability (3:01)

Put it together and you get a simple rule. Delegate by verifiability and risk. If the result is easy to check and cheap to get wrong, give the agent room. If it needs judgment, touches money, security or your data model, or can't be tested, keep your hands on it.

### Trust (3:20)

Charity Majors frames the long game nicely. If trust is no longer earned by a human reading every line, it has to be built somewhere else: tests, evals, monitoring. The trust has to go somewhere. Most of this course is about where to put it.

### Quick check (3:37)

**Quiz:** Which task is safest to hand to an agent end to end?
A. Choosing the data model for a payments system
B. Moving 300 test files to a new test runner, with CI as the check
C. Deciding which features your users need next
D. Approving a change to authentication rules
Answer: B — It's mechanical, and the existing tests plus CI tell you immediately whether it worked.


### Try it (3:49)

Try sorting your own work. Ask your agent to rate a list of tasks by how verifiable and how risky they are, and to say which ones it could do end to end. It's a great way to calibrate where your trust should start.

```text
Here are tasks from my backlog: [paste them].
For each one, rate 1-5: how easy is it to verify automatically
(tests, types, a command), and how costly is a wrong change?
Say which you could finish end to end, and which need my judgment.
```


### Recap (4:02)

Recap. Agent intelligence is jagged. Models automate what can be verified, so code is their home turf. They're weak at judgment and design, and confident when wrong. So delegate by verifiability and risk. Next: the single most important concept in agentic engineering, context.

## Sources

- Andrej Karpathy — Andrej Karpathy: From Vibe Coding to Agentic Engineering w/ Stephanie Zhan (at 11:39, 9:57, 16:42, 20:14, 22:40): https://www.youtube.com/watch?v=96jN2OCOfLs&t=699s
- Peter Steinberger — The creator of OpenClaw: "I ship code I don't read" (at 60:52): https://www.youtube.com/watch?v=8lF7HmQ_RgY&t=3652s
- Barry Zhang — How We Build Effective Agents: Barry Zhang, Anthropic (at 5:24): https://www.youtube.com/watch?v=D7_ipDqhtwk&t=324s
- Brendan O'Leary — Agentic Engineering: Working With AI, Not Just Using It — Brendan O'Leary (at 3:30): https://www.youtube.com/watch?v=BEKc4P87XKo&t=210s
- Dex Horthy — Why Software Factories Fail (at 12:51): https://www.youtube.com/watch?v=Ib5GBkD555M&t=771s
- Martin Fowler — How AI will change software engineering – with Martin Fowler (at 44:26, 29:52): https://www.youtube.com/watch?v=CQmI4XKTa0U&t=2666s
- Kent Beck — Augmented Coding: Beyond the Vibes: https://tidyfirst.substack.com/p/augmented-coding-beyond-the-vibes
- Tejas Kumar — Harnesses in AI: A Deep Dive — Tejas Kumar, IBM (at 9:35): https://www.youtube.com/watch?v=C_GG5g38vLU&t=575s
- METR — Measuring AI Ability to Complete Long Software Tasks: https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/
- Charity Majors — Stop being skeptical about AI for development with Charity Majors (at 28:02): https://www.youtube.com/watch?v=HC8T1OlgYi0&t=1682s
- Matt Pocock — 5 Claude Code skills I use every single day: https://www.youtube.com/watch?v=EJyuu6zlQCg

License: CC BY 4.0 · https://github.com/Haple/agentic-engineering
