# Long-running agents and loops

Agents went from running thirty seconds before derailing to working for hours. The trick isn't one giant session; it's loops: fresh contexts, one task at a time, state kept in files and git, and a check the loop can't argue with. From the Ralph loop to nightly slow loops, here's how to let agents work while you're away.

## Key ideas

- Long runs work as loops of fresh sessions, not one giant session that rots.
- The Ralph loop: run the same prompt again and again, one task per iteration, fresh context each time.
- Keep state outside the context: a task list with pass/fail flags, a progress file, and git commits.
- Loops need back pressure: tests, types and metrics the loop must satisfy.
- Start with slow loops that make one small, verified improvement and open a PR.

## Practices for agents

- In a loop, do exactly one task per iteration, verify it, commit it, and update the progress file.
- At the start of each session, get your bearings: read the progress file and recent commits, and run a smoke test.
- Never mark a task as passing until its verification actually ran and passed.
- If the build breaks and you can't fix it in this iteration, stop and leave a clear note instead of piling on changes.

Full lesson (Markdown): https://learn-agentic-engineering.pages.dev/lessons/long-running-agents-ralph-loop.md
Video: https://learn-agentic-engineering.pages.dev/lessons/long-running-agents-ralph-loop/
