# Lesson 12: Tools, CLIs and MCP

> An agent is only as capable as its tools, but more tools isn't better: every tool definition costs context. Learn why the shell is the universal adapter, what MCP is for, when a CLI beats an MCP server, and how to design tools that agents actually use well.

Course: Agentic Engineering — https://learn-agentic-engineering.pages.dev/ · Module 3: Your toolkit · 4 min · Watch: https://learn-agentic-engineering.pages.dev/lessons/tools-clis-and-mcp/

## Key takeaways

- Bash is the universal adapter: agents are excellent with well-known CLIs like git, gh and psql.
- MCP standardizes how agents connect to tools and data, so one server works with many clients.
- Every tool definition costs context. Dozens of tools crowd out the actual work.
- Climb the tool ladder: built-in tools first, then local scripts, and MCP when many clients need the same tools.
- Design tools for agents: consolidated actions, high-signal output, and actionable errors.

## Practices for coding agents

- Prefer a well-known, documented CLI (git, gh, psql, docker) over adding a new integration.
- Read a CLI's --help before using it, instead of guessing flags.
- Keep tool output small: filter with grep, jq or head instead of dumping everything into context.
- Suggest disabling MCP servers that aren't relevant to the current task.

## Lesson transcript


### Intro (0:01)

An agent is only as capable as its tools. But here's the twist: giving it more tools often makes it worse. This lesson is about choosing tools well.

### Bash is the adapter (0:12)

Start with the most powerful tool of all: the shell. Models have seen enormous amounts of shell usage, so they're excellent with well-known command line tools. Git, the GitHub CLI, a database client. The Claude Code team even dropped their search index, because, as Boris Cherny puts it, plain glob and grep outperformed everything.

### What MCP is (0:35)

So what's MCP, the Model Context Protocol? Its creators describe it simply: a standard way to give context to any app that uses an LLM, whether that's tools or raw data. You build a server once, and it works with every client that speaks the protocol: Claude Code, Codex, Cursor and many more.

### The hidden cost (0:56)

But tools aren't free. Every tool's name, description and schema sits in the context window, before you've typed a word. Daisy Hollman from Anthropic gives the math: twenty servers with fifteen tools each, and your context is mostly tool descriptions, with very little room left to work.

### CLI or MCP? (1:15)

That's why many practitioners reach for command line tools first. Cal from the Claude Code team recommends: if there's a well-known, well-documented CLI, use it instead of an MCP server. Kun Chen measured it: for the same GitHub tasks, the GitHub MCP server used about three times the tokens, and more than twice the latency, of the GitHub CLI.

### The tool ladder (1:39)

Will from Anthropic suggests a tool ladder. Start with the built-in tools: read, write, edit, bash. Then add small local scripts for your own agent. Only reach for an MCP server when several clients need the same standardized, governed set of tools. Running to MCP first creates a chaos of overlapping servers.

### Design tools for agents (2:01)

If you do build tools, design them for agents, not like an API for developers. Anthropic's guidance: don't just wrap every endpoint. Consolidate steps that always go together, like a single schedule event tool instead of three. Return names, not opaque IDs. And make error messages tell the agent what to do next.
Small details matter a lot. When Anthropic tuned their agent for a coding benchmark, it kept making mistakes with relative file paths. They changed the tool to require absolute paths, and the model used it flawlessly. Armin Ronacher's rule: protect your tools against an LLM chaos monkey. There's no such thing as user error.

### Help text for agents (2:48)

A neat trick from Simon Willison: write your tool's help output for agents. His browser tool's help text teaches an agent everything it needs. So the prompt can just say: run it with help, then use it to test the page. The agent bootstraps itself.

### A warning (3:05)

One warning before we move on. Simon Willison points out that MCP makes it easy to mix tools from different sources, and some of them read private data while others touch content attackers can influence. That combination is dangerous, and it gets its own lesson later.

### Quick check (3:23)

**Quiz:** You want your agent to work with GitHub issues and PRs. Best first step?
A. Install several GitHub MCP servers to be safe
B. Make sure the gh CLI is installed and logged in, and mention it in your memory file
C. Paste GitHub's API docs into every prompt
D. Build your own MCP server for GitHub
Answer: B — A well-known CLI the model already understands is cheaper in tokens and simpler to run.


### Try it (3:36)

Audit your agent's toolbox. This prompt finds the useful CLIs you already have, checks your MCP servers, and estimates how much context their definitions cost.

```text
Check which CLIs that matter for this project are installed and authenticated (git, gh, psql, docker, etc.). Then list the MCP
servers enabled in this session, roughly how much context their tool definitions use, and which ones I could disable for this repo.
```


### Recap (3:48)

Recap. The shell is the universal adapter. MCP standardizes connections, but every tool costs context. Prefer well-known CLIs, climb the tool ladder only as far as you need, and design tools for agents. Next: skills, commands and hooks, the way to teach your agent your team's know-how.

## Sources

- Jared Zoneraich — How Claude Code Works - Jared Zoneraich, PromptLayer (at 15:57): https://www.youtube.com/watch?v=RFKCzGlAU6Q&t=957s
- Boris Cherny — Building Claude Code with Boris Cherny (at 51:25): https://www.youtube.com/watch?v=julbw1JuAz0&t=3085s
- David Heinemeier Hansson (DHH) — DHH’s new way of writing code (at 51:45): https://www.youtube.com/watch?v=JiWgKRgdgpI&t=3105s
- Theo, David — The Model Context Protocol (MCP) (at 0:57, 4:56): https://www.youtube.com/watch?v=CQywdSdi5iA&t=57s
- Daisy Hollman — How Anthropic uses Claude Code: Agentic Software Engineering at Scale - Daisy Hollman (at 37:17): https://www.youtube.com/watch?v=shZgedW15vg&t=2237s
- Lance Martin — Context Engineering for Agents (at 8:15): https://www.youtube.com/watch?v=4GiqzUHD5AA&t=495s
- Cal Rueb — Claude Code best practices | Code w/ Claude (at 13:08): https://www.youtube.com/watch?v=gv0WHhKelSE&t=788s
- Kun Chen — L8 Principal's Agentic Engineering Workflow (at 16:40): https://www.youtube.com/watch?v=iQyg-KypKAA&t=1000s
- Peter Steinberger — The creator of OpenClaw: "I ship code I don't read" (at 82:44): https://www.youtube.com/watch?v=8lF7HmQ_RgY&t=4964s
- Armin Ronacher — Agentic Coding Recommendations: https://lucumr.pocoo.org/2025/6/12/agentic-coding/
- Will — Tool, skill, or subagent? Decomposing an agent that outgrew its prompt (at 32:16): https://www.youtube.com/watch?v=mWvtOHlZM-I&t=1936s
- Ken Aizawa (Anthropic) — Writing effective tools for AI agents—using AI agents: https://www.anthropic.com/engineering/writing-tools-for-agents
- Erik S. and Barry Zhang — Building Effective AI Agents: https://www.anthropic.com/engineering/building-effective-agents
- Simon Willison — Agentic manual testing - Agentic Engineering Patterns: https://simonwillison.net/guides/agentic-engineering-patterns/agentic-manual-testing/
- Simon Willison — The lethal trifecta for AI agents: private data, untrusted content, and external communication: https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/

License: CC BY 4.0 · https://github.com/Haple/agentic-engineering
