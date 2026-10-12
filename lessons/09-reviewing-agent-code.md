# Lesson 9: Reviewing agent code

> Agents write code faster than anyone can read it, and review has become the new bottleneck. Practitioners disagree about reading every line, but they agree on how to review well: scale depth to blast radius, review your own work first, use a fresh-context reviewer, and turn repeated comments into rules.

Course: Agentic Engineering — https://learn-agentic-engineering.pages.dev/ · Module 2: Working with one agent · 4 min · Watch: https://learn-agentic-engineering.pages.dev/lessons/reviewing-agent-code/

## Key takeaways

- Review is a gradient: go deepest where the blast radius is biggest (shared infra, money, auth), lightest on isolated leaf code.
- Know what's load-bearing in your system, and watch every change there closely.
- Never open a pull request you haven't reviewed yourself. Attach evidence that it works.
- Use a reviewer agent in a fresh context; it isn't biased toward code it just wrote.
- If you keep leaving the same review comment, turn it into a lint rule or a test.

## Practices for coding agents

- Keep diffs small and focused so they can actually be reviewed.
- In every PR description, include what changed, why, how it was verified (with real output or screenshots), and anything risky.
- Flag changes to load-bearing code (shared infrastructure, auth, payments, data models, public APIs) explicitly for human review.
- When reviewing, check the blast radius: what else depends on this change, and can it be rolled back?

## Lesson transcript


### Intro (0:01)

Agents can write code far faster than any human can read it. So who reviews it, and how much is enough? This is where agentic engineering gets hard.

### The new bottleneck (0:12)

At Uber, the time it takes an engineer to get a first code review grew from three hours in 2024 to nine hours in 2026, as pull requests got bigger and more frequent. And Beyang Liu from Sourcegraph hears developers say they now spend around ninety percent of their time reviewing code.

### Two camps (0:31)

Practitioners genuinely disagree about how much to read. Peter Steinberger says much of an app is boring plumbing, and he ships code he doesn't read. Dex Horthy's team tried not reading agent code for six months. It did not end well. They had to rip out and replace large parts of the system.

### A gradient (0:51)

Both can be right, because review isn't a yes or no. Meta's John Kim calls it a gradient. How deeply you read should depend on the blast radius of the change: how much can break if it's wrong.
He pictures a codebase as a tree. The trunk is entry points and shared infrastructure, like networking, authentication or payments. Break it, and the whole app breaks, so read every line. The leaves are isolated, one-off code. There, tests and a screenshot of it working may be enough.

### Three questions (1:25)

To set the depth, he asks three questions. What must not change? How bad is it if this goes wrong? And can I roll it back? A change that's hidden behind a flag and easy to roll back needs far less scrutiny than one that can't be undone.

### Load-bearing code (1:42)

Thorsten Ball adds a related idea. Even if agents write ninety-nine percent of your code, you need to know what's load-bearing: the protocols between components, the business logic, the things that keep the system standing. When an agent touches those, watch it like a hawk.

### Review your own first (2:00)

Simon Willison calls out the most common anti-pattern: don't file pull requests with code you haven't reviewed yourself. Your reviewers could have prompted an agent themselves. Your value is the verification, so attach evidence: how you tested it, screenshots, notes on tricky choices.

### A fresh reviewer (2:19)

Agents can review too, if you set it up right. Anthropic's guide recommends a writer and reviewer pattern: a fresh session reviews the change, because it isn't biased toward code it just wrote. Matt Pocock warns that a review in the same long session happens in the dumb zone. At Anthropic, Claude reviews every pull request, and then a human does.

### What humans review (2:42)

So what should the human focus on? Leave typos, style and obvious bugs to automation. Spend your attention on the questions only you can answer: do we want this in our product? Is the boundary between these services in the right place? Will this design hold up?

### Make rules (3:00)

One more habit from Lauren Tan. If you find yourself leaving the same review comment again and again, treat that as a smell. Turn it into a lint rule, a test, or a CI check, so no one, human or agent, ever has to say it again.

### Quick check (3:16)

**Quiz:** Which change deserves your most careful line-by-line review?
A. A one-off internal admin page
B. A change to the auth middleware every service uses
C. A copy tweak on a marketing page
D. A new unit test file
Answer: B — It's trunk code: a huge blast radius, security-critical, and hard to roll back safely.


### Try it (3:29)

Try a fresh-context review on your last change. Open a new session and paste this. You'll get a prioritized list of risks before anyone else spends time on your pull request.

```text
Review the diff of this branch against main with fresh eyes.
List, prioritized P0/P1/P2: what could break elsewhere (blast radius), changes to load-bearing code, missing or weak tests, and anything you'd push back on. Quote the exact lines you're worried about.
```


### Recap (3:40)

Recap. Review is a gradient: go deepest where the blast radius is biggest. Know what's load-bearing. Review your own work first and attach evidence. Use a fresh-context reviewer, and turn repeated comments into rules. Next: what to do when an agent goes off the rails.

## Sources

- Will Bond, Ameya Ketkar — Building uReview, Uber’s Multi-Agent Code Review Engine — Will Bond & Ameya Ketkar, Uber (at 0:58): https://www.youtube.com/watch?v=EL123UNokkI&t=58s
- Beyang Liu — The Truth About Coding Agents: Why 90% of Your Time Is Now Code Review (at 31:40): https://www.youtube.com/watch?v=Jxz4GJSG8ZA&t=1900s
- Peter Steinberger — The creator of OpenClaw: "I ship code I don't read" (at 42:27): https://www.youtube.com/watch?v=8lF7HmQ_RgY&t=2547s
- Dex Horthy — Everything We Got Wrong About Research-Plan-Implement -  Dexter Horthy (at 8:59): https://www.youtube.com/watch?v=YwZR6tc7qYg&t=539s
- John Kim — How I Review AI Code - (Meta Senior Staff Engineer) (at 2:24, 4:35, 6:26): https://www.youtube.com/watch?v=b2QkhmQ0sT0&t=144s
- Thorsten Ball — Think Harder: How I Prompt | Thorsten Ball at Laracon US 2026 (at 23:23): https://www.youtube.com/watch?v=HegqGzD-kvc&t=1403s
- Simon Willison — Anti-patterns: things to avoid - Agentic Engineering Patterns: https://simonwillison.net/guides/agentic-engineering-patterns/anti-patterns/
- Anthropic (Claude Code team) — Best practices for Claude Code: https://www.anthropic.com/engineering/claude-code-best-practices
- Matt Pocock — Full Walkthrough: Workflow for AI Coding — Matt Pocock (at 66:01): https://www.youtube.com/watch?v=-QFHIoCo-Ko&t=3961s
- Boris Cherny — Head of Claude Code: What happens after coding is solved | Boris Cherny (at 16:57): https://www.youtube.com/watch?v=We7BZVKbCVw&t=1017s
- Charity Majors — Stop being skeptical about AI for development with Charity Majors (at 23:45): https://www.youtube.com/watch?v=HC8T1OlgYi0&t=1425s
- Lauren Tan — SpaceX AI Engineer Lauren Tan: Part 1 (at 47:11): https://www.youtube.com/watch?v=PaPpyQocMww&t=2831s
- Andrej Karpathy — Andrej Karpathy: Software Is Changing (Again) (at 23:07): https://www.youtube.com/watch?v=LCEmiRjPEtQ&t=1387s

License: CC BY 4.0 · https://github.com/Haple/agentic-engineering
