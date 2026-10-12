# The core loop: explore, plan, implement, verify

The people who build coding agents rarely type a feature request and hit enter. They explore first, agree on a plan, implement in a fresh context, and verify. Here's that loop, why planning has the most leverage, and how to make plans that can actually be checked.

## Key ideas

- Don't jump straight to code. Explore, plan, implement, verify.
- Mistakes are cheapest to fix upstream: a bad line of research can become thousands of bad lines of code.
- Planning is about shared understanding. Let the agent interview you, one question at a time.
- Ask for plans in thin vertical slices you can test, not horizontal layers that only work at the end.
- Implement from the plan in a fresh session; skip planning only for tiny, obvious changes.

## Practices for agents

- For non-trivial tasks, explore the relevant code and propose a plan (or two or three options) before editing anything.
- When requirements are ambiguous, ask questions one at a time, each with a recommended answer.
- Structure plans as thin vertical slices, each with a concrete verification step (test, command, or check).
- Write the agreed plan to a file so implementation can start from a clean context.

Full lesson (Markdown): https://learn-agentic-engineering.pages.dev/lessons/explore-plan-implement-verify.md
Video: https://learn-agentic-engineering.pages.dev/lessons/explore-plan-implement-verify/
