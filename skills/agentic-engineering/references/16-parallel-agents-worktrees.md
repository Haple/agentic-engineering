# Running agents in parallel

Heavy users run five, ten, even hundreds of agents at once. But your attention doesn't parallelize, and naive parallelism creates conflicts and duplicate work. Learn how to isolate agents with worktrees, pick tasks that don't collide, and keep the orchestration tax under control.

## Key ideas

- Power users run several agents at once, each on independent work.
- Give each agent its own checkout: git worktrees locally, or cloud sandboxes at scale.
- Your attention doesn't parallelize. Every extra agent adds routing, review and merging work for you.
- Parallelize reads freely; parallelize writes only when tasks don't touch the same code.
- Trust one agent before you run ten.

## Practices for agents

- Work in your own worktree and branch; never push to main directly.
- Before starting, check whether other in-flight work touches the same files and flag likely conflicts.
- Keep each parallel task self-contained, with its own verification, so it can merge independently.
- When finished, report clearly so a busy human can review quickly: what changed, how it was verified, what's risky.

Full lesson (Markdown): https://learn-agentic-engineering.pages.dev/lessons/parallel-agents-worktrees.md
Video: https://learn-agentic-engineering.pages.dev/lessons/parallel-agents-worktrees/
