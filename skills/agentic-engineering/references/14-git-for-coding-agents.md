# Git is your safety net

Agents make mistakes fast; git lets you undo them faster. And every coding agent is fluent in git, including the parts nobody remembers. Use commits as save points, history as research material, bisect for bug hunts, and branches to keep work isolated.

## Key ideas

- Commit after every working step. Small commits are save points and easy reviews.
- Seed a new session with history: “look at the recent commits” loads useful context fast.
- Agents are fluent in git: history digs, bisect, reflog, conflict resolution, cleanup.
- One task per branch. Worktrees let several agents work without colliding.
- Protect what can't be undone: no force-pushes or resets on shared branches without asking.

## Practices for agents

- Commit after each verified step with a clear message describing what and why.
- Use git history (log -S, blame, linked issues) to understand why code is the way it is before changing it.
- Ask before any destructive git operation: force-push, hard reset, branch deletion, history rewrites on shared branches.
- Resolve merge conflicts by reasoning about the intent of both sides, then run the tests before finishing.

Full lesson (Markdown): https://learn-agentic-engineering.pages.dev/lessons/git-for-coding-agents.md
Video: https://learn-agentic-engineering.pages.dev/lessons/git-for-coding-agents/
