# Tools, CLIs and MCP

An agent is only as capable as its tools, but more tools isn't better: every tool definition costs context. Learn why the shell is the universal adapter, what MCP is for, when a CLI beats an MCP server, and how to design tools that agents actually use well.

## Key ideas

- Bash is the universal adapter: agents are excellent with well-known CLIs like git, gh and psql.
- MCP standardizes how agents connect to tools and data, so one server works with many clients.
- Every tool definition costs context. Dozens of tools crowd out the actual work.
- Climb the tool ladder: built-in tools first, then local scripts, and MCP when many clients need the same tools.
- Design tools for agents: consolidated actions, high-signal output, and actionable errors.

## Practices for agents

- Prefer a well-known, documented CLI (git, gh, psql, docker) over adding a new integration.
- Read a CLI's --help before using it, instead of guessing flags.
- Keep tool output small: filter with grep, jq or head instead of dumping everything into context.
- Suggest disabling MCP servers that aren't relevant to the current task.

Full lesson (Markdown): https://learn-agentic-engineering.pages.dev/lessons/tools-clis-and-mcp.md
Video: https://learn-agentic-engineering.pages.dev/lessons/tools-clis-and-mcp/
