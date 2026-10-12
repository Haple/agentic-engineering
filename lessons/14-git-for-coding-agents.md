# Lesson 14: Git is your safety net

> Agents make mistakes fast; git lets you undo them faster. And every coding agent is fluent in git, including the parts nobody remembers. Use commits as save points, history as research material, bisect for bug hunts, and branches to keep work isolated.

Course: Agentic Engineering — https://learn-agentic-engineering.pages.dev/ · Module 3: Your toolkit · 4 min · Watch: https://learn-agentic-engineering.pages.dev/lessons/git-for-coding-agents/

## Key takeaways

- Commit after every working step. Small commits are save points and easy reviews.
- Seed a new session with history: “look at the recent commits” loads useful context fast.
- Agents are fluent in git: history digs, bisect, reflog, conflict resolution, cleanup.
- One task per branch. Worktrees let several agents work without colliding.
- Protect what can't be undone: no force-pushes or resets on shared branches without asking.

## Practices for coding agents

- Commit after each verified step with a clear message describing what and why.
- Use git history (log -S, blame, linked issues) to understand why code is the way it is before changing it.
- Ask before any destructive git operation: force-push, hard reset, branch deletion, history rewrites on shared branches.
- Resolve merge conflicts by reasoning about the intent of both sides, then run the tests before finishing.

## Lesson transcript


### Intro (0:01)

Agents make mistakes fast. Git lets you undo them faster. And it turns out every coding agent is fluent in git, including the commands nobody can remember.

### Fluent in git (0:12)

Simon Willison points out that all the coding agents are fluent in git's features, both basic and advanced. That means we can be more ambitious with git ourselves. We don't need to memorize how to do things. We just need to know what's possible.

### Save points (0:27)

The first habit is save points. Commit after every step that works. In Anthropic's long-running agent experiments, committing progress with descriptive messages let the agent revert bad changes by itself. Brendan O'Leary treats these small local commits as his first pull request review.

### Seed with history (0:46)

History is also great context. Starting a fresh session? Ask the agent to look at the recent changes. It runs git log and git diff, and instantly knows what you've been working on, from both the code and the commit messages.

### History as research (1:01)

Git history answers why questions too. Boris Cherny's example: ask why a function has weird arguments, and the agent digs through the commits and the linked issues to find out. There's nothing in the system prompt about this, he says. If you tell it to use git, it knows how.

### Superpowers (1:19)

A few git superpowers become everyday tools. Bisect: give the agent a test for a bug, and it binary-searches history to find the commit that caused it. Reflog: lost work that was never committed? The agent can often find it. Merge conflicts: it reasons about the intent of both sides, then runs the tests. And cleanup: it remembers the exact command to undo your last commit.
Here's bisect in action. You describe the bug. The agent writes a tiny script that reproduces it, hands it to git bisect, and comes back with the exact commit. Simon Willison notes this turns bisect from an occasional tool into one you can use whenever you're curious.

### Branches and worktrees (2:04)

Use one branch per task, so experiments stay isolated and easy to throw away. And when you want several agents working at once, git worktrees give each one its own checkout of the repo. Matt Pocock says he now uses worktrees for everything. We'll go deep on that in module four.

### Guard rails (2:23)

One caution. Agents are fluent in the dangerous commands too. Force-pushing, hard resets and history rewrites on shared branches can destroy other people's work. Let the agent experiment freely on its own branch, and require your approval for anything that can't be undone.

### Quick check (2:41)

**Quiz:** A bug appeared sometime in the last month (a few hundred commits). Fastest way to find the cause?
A. Read every commit yourself
B. Have the agent write a check for the bug and run git bisect
C. Revert the whole month
D. Ask the agent to guess from the file names
Answer: B — Bisect binary-searches history: a few hundred commits take about eight checks.


### Try it (2:56)

Try using history as context. This prompt asks your agent to summarize where the project is heading and to explain why one piece of code is the way it is, without changing anything.

```text
Look at the last 10 commits and summarize where this project is heading. Then pick the most confusing function you've seen and tell me why it's written that way, using git log -S, blame and any linked issues. Don't modify anything.
```


### Recap (3:09)

Recap. Commit after every working step. Seed sessions with history. Use git's superpowers: bisect, reflog, conflict resolution. One task per branch, one worktree per agent. And keep the irreversible commands behind your approval. Next module: scaling up, starting with subagents.

## Sources

- Simon Willison — Using Git with coding agents - Agentic Engineering Patterns: https://simonwillison.net/guides/agentic-engineering-patterns/using-git-with-coding-agents/
- Justin Young — Effective harnesses for long-running agents: https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
- Brendan O'Leary — Agentic Engineering: Working With AI, Not Just Using It — Brendan O'Leary (at 16:45): https://www.youtube.com/watch?v=BEKc4P87XKo&t=1005s
- Boris Cherny — Mastering Claude Code in 30 minutes (at 6:36): https://www.youtube.com/watch?v=6eBSHbLKuN0&t=396s
- Matt Pocock — I'm using claude --worktree for everything now: https://www.youtube.com/watch?v=yv8VZpov8bk
- Boris Cherny — Building Claude Code with Boris Cherny (at 33:40): https://www.youtube.com/watch?v=julbw1JuAz0&t=2020s

License: CC BY 4.0 · https://github.com/Haple/agentic-engineering
