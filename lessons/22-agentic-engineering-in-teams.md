# Lesson 22: Agentic engineering in teams

> Individuals can rewire their workflow overnight; teams can't. The teams that win with agents change how they work rather than sprinkling AI on top, share their know-how as skills and memory, keep humans accountable, and measure honestly: speed and quality together.

Course: Agentic Engineering — https://learn-agentic-engineering.pages.dev/ · Module 5: Quality, safety, teams · 4 min · Watch: https://learn-agentic-engineering.pages.dev/lessons/agentic-engineering-in-teams/

## Key takeaways

- Results vary wildly. The difference is rarely the tool; it's whether the team changed how it works.
- Expect to slow down before you speed up, while you make the codebase and process agent-ready.
- Share know-how: checked-in memory files and skills mean every new teammate's agent knows your practices.
- You own the loop. Never send something you haven't read.
- Measure honestly: speed should rise while escaped defects stay flat or fall. Aim for 2–3×, then compound.

## Practices for coding agents

- Follow the team's shared conventions, memory files and skills over your own defaults.
- Make your work easy for teammates to review: small changes, clear descriptions, evidence it works.
- When you discover something teammates' agents would need to know, propose adding it to the shared memory file or a skill.
- Be explicit about uncertainty and risk in summaries so the accountable human can make the call.

## Lesson transcript


### Intro (0:01)

A solo developer can rebuild their workflow over a weekend. A team can't. And it's in teams, with shared code, reviews and production on-call, that agentic engineering gets genuinely hard.

### Wildly different results (0:14)

Team results vary wildly. Amazon's Clare Liguori reports pilots with a median four and a half times productivity improvement. Boris Cherny says productivity per engineer at Anthropic rose almost seventy percent, measured mostly by pull requests. Yet Armin Ronacher finds agents work much better on side projects than at work, and that token spending grows faster than measurable productivity.

### Change how you work (0:40)

So what separates them? In a pilot with fifty teams, Liguori found the difference wasn't the tools; nearly all used the same one. The teams with step-function improvements intentionally changed the way they worked. The others sprinkled AI on top of their existing process.

### Slow down to speed up (0:59)

And almost every successful team reported the same shape. Productivity went down first, while they did deliberate work to make their codebase and process ready for agents. Then came the hockey stick. GitHub adds a warning: pilots often fail to scale because organizations copy the tool, but not the conditions that made the pilot work.

### The rift (1:21)

Teams also split. Dex Horthy describes a growing rift: staff engineers who don't adopt because it doesn't speed them up, junior engineers who use agents heavily and ship slop, and seniors who spend their weeks cleaning it up. Charity Majors says both camps are seeing real things. Her advice: when you share wins, tell the whole story, including the costs.

### You own the loop (1:46)

Whatever your process, accountability doesn't move. Charity Majors puts it perfectly: there is no human in the loop. You own the loop. And her rule for AI-assisted communication: never send anyone something you haven't read. If it would take them longer to read it than it took you to make it, it's probably slop.

### Shared know-how (2:08)

The big team advantage is shared know-how. Check in your memory files, skills and permission settings, so every lesson benefits everyone. Anthropic's Mahesh Murag describes the goal: when someone joins your team, their agent already knows what your team cares about. Anthropic says technical onboarding dropped from two or three weeks to two or three days. And OpenAI's harness team held a weekly garbage collection day to turn the week's slop into durable rules.

### Deciding is the bottleneck (2:38)

As implementation gets cheap, the bottleneck moves. DHH says the constraint now is figuring out what to build, how it should be built, and which customers to talk to. Clare Liguori sees frontier teams spending more time making decisions than writing code. So invest in fast, reversible decisions.

### Measure honestly (2:58)

Finally, measure honestly. Remember the study where developers felt faster while measuring slower: self-reports aren't enough. GitHub's health test: as agent use grows, escaped defects should stay flat or fall while delivery speeds up. Dex Horthy's realistic target is two to three times faster, then two to three times on top of that. And watch out for burnout: DHH says the people most all-in on agents are working harder than ever.

### Quick check (3:29)

**Quiz:** PRs per engineer tripled, but escaped defects doubled. What does that tell you?
A. It's working: ship even faster
B. The operating model needs work: speed without quality isn't progress
C. Switch to a different agent
D. Ban agents from production code
Answer: B — Healthy adoption raises speed while defects stay flat or fall. Fix the system: context, checks, review.


### Try it (3:45)

Draft a one-page agent charter for your team. Let your agent propose it from your repo and history, then argue about it with your teammates. That conversation is the real value.

```text
Draft a one-page agent charter for our team, based on this repo and our recent history: what we delegate to agents, what humans always review, how we share memory files and skills, our security rules, and how we'll measure success (speed AND escaped defects).
```


### Recap (3:57)

Recap. Change how you work, don't just add tools, and expect a dip first. Share know-how through checked-in memory and skills. You own the loop. And measure speed and quality together. Next, our final module: the engineer you become.

## Sources

- Armin Ronacher, Ben Vinegar — State of Agentic Coding #10 with Armin and Ben (at 67:45, 98:12): https://www.youtube.com/watch?v=9UAxrdcDjjU&t=4065s
- Boris Cherny, Cat Wu — The Secrets of Claude Code From the Engineers Who Built It (at 61:58): https://www.youtube.com/watch?v=IDSAMqip6ms&t=3718s
- Clare Liguori — From AI-Assisted to AI-Native: Building a Frontier Development Team — Clare Liguori, AWS (at 1:24, 7:10, 9:34): https://www.youtube.com/watch?v=pqlWNihgdjI&t=84s
- GitHub (authors of the Agentic Engineering System) — GitHub's Agentic Engineering System: https://github.com/resources/insights/agentic-engineering-system
- Dex Horthy — No Vibes Allowed: Solving Hard Problems in Complex Codebases – Dex Horthy, HumanLayer (at 19:41): https://www.youtube.com/watch?v=rmvDxxNubIg&t=1181s
- Charity Majors — Stop being skeptical about AI for development with Charity Majors (at 32:00, 34:59, 44:00): https://www.youtube.com/watch?v=HC8T1OlgYi0&t=1920s
- Barry Zhang, Mahesh Murag — Don't Build Agents, Build Skills Instead – Barry Zhang & Mahesh Murag, Anthropic (at 12:35): https://www.youtube.com/watch?v=CEvIs9y1uog&t=755s
- Boris Cherny — Mastering Claude Code in 30 minutes (at 4:49): https://www.youtube.com/watch?v=6eBSHbLKuN0&t=289s
- David Heinemeier Hansson (DHH) — DHH’s new way of writing code (at 81:19, 98:20): https://www.youtube.com/watch?v=JiWgKRgdgpI&t=4879s
- Dex Horthy — Why Coding Agents Keep Making Your Codebase Worse (at 20:40): https://www.youtube.com/watch?v=vKT59uoByXc&t=1240s

License: CC BY 4.0 · https://github.com/Haple/agentic-engineering
