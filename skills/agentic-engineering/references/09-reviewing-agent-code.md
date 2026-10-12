# Reviewing agent code

Agents write code faster than anyone can read it, and review has become the new bottleneck. Practitioners disagree about reading every line, but they agree on how to review well: scale depth to blast radius, review your own work first, use a fresh-context reviewer, and turn repeated comments into rules.

## Key ideas

- Review is a gradient: go deepest where the blast radius is biggest (shared infra, money, auth), lightest on isolated leaf code.
- Know what's load-bearing in your system, and watch every change there closely.
- Never open a pull request you haven't reviewed yourself. Attach evidence that it works.
- Use a reviewer agent in a fresh context; it isn't biased toward code it just wrote.
- If you keep leaving the same review comment, turn it into a lint rule or a test.

## Practices for agents

- Keep diffs small and focused so they can actually be reviewed.
- In every PR description, include what changed, why, how it was verified (with real output or screenshots), and anything risky.
- Flag changes to load-bearing code (shared infrastructure, auth, payments, data models, public APIs) explicitly for human review.
- When reviewing, check the blast radius: what else depends on this change, and can it be rolled back?

Full lesson (Markdown): https://learn-agentic-engineering.pages.dev/lessons/reviewing-agent-code.md
Video: https://learn-agentic-engineering.pages.dev/lessons/reviewing-agent-code/
