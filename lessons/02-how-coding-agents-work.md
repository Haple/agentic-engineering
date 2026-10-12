# Lesson 2: How a coding agent actually works

> Claude Code, Codex, Cursor and Amp look different, but underneath they're the same thing: a model, a few tools, and a while loop. Once you see the loop, you'll understand why agents succeed, why they fail, and what you control.

Course: Agentic Engineering — https://learn-agentic-engineering.pages.dev/ · Module 1: The shift · 4 min · Watch: https://learn-agentic-engineering.pages.dev/lessons/how-coding-agents-work/

## Key takeaways

- An agent is a model using tools in a loop: it asks for a tool, the harness runs it, the result goes back in, repeat until done.
- Tool calls are just JSON. The model never runs anything itself; ordinary code (the harness) does.
- The model is stateless. Everything it knows about your task is in its context window: system prompt, tools, memory files, your messages and every tool result.
- Errors compound over steps. At 95% accuracy per step, a 10-step task succeeds about 60% of the time.
- Agents don't push back on vague requests. They guess confidently, so what you put in the context decides what comes out.

## Practices for coding agents

- Before acting on a conclusion like 'this doesn't exist yet', double-check with a broader search; a narrow search result is not proof of absence.
- Keep the context relevant: read what the task needs, not everything.
- Prefer small, verifiable steps over long unverified chains; check results between steps because errors compound.
- When a request is ambiguous, ask a clarifying question instead of guessing.

## Lesson transcript


### Intro (0:01)

Claude Code, Codex, Cursor and Amp all look different. Under the hood, they're almost the same program. Once you see it, a lot of agent behavior suddenly makes sense.

### The recipe (0:13)

Anthropic's definition fits in one line. An agent is a model, using tools, in a loop. The model decides what to do next. The tools let it act on the world. And the loop keeps it going until the job is done.
Thorsten Ball, who builds the Amp agent, put it bluntly. It's an LLM, a loop, and enough tokens. Everything else that makes a great agent feel magical is elbow grease.

### Tools are JSON (0:40)

So what is a tool call, really? The model never runs anything itself. It replies with a little bit of JSON that names a tool and its input. Then the harness, which is ordinary code, runs the command and sends the output back. As Dex Horthy says: there's nothing special about tools. It's just JSON and code.

### The loop (1:02)

And here's the loop that ties it together. Send the conversation to the model. If it asked for tools, run them and append the results. Then go around again, until the model stops asking for tools and answers you. That's the core of Claude Code, Codex and Cursor alike.
In a real session, the loop looks like this. You ask for a fix. The agent searches, reads a file, runs the tests, edits the code and runs the tests again. You didn't tell it which tools to use. It chained them on its own.

### Few tools, big reach (1:34)

Boris Cherny says Claude Code gives the model a surprisingly small set of tools: edit files, search files, run shell commands. But a shell is everything an engineer has at a terminal. When the team first gave the model tools, he says, the model just wanted to use them.

### What it sees (1:52)

Here's the part most people miss. The model is stateless. It remembers nothing between calls, so the harness replays the whole conversation every time. Everything the agent knows about your task sits in this context window: the system prompt, tool definitions, your memory files, your messages, and every tool result it has collected.

### The harness (2:15)

Simon Willison calls a coding agent a harness for an LLM. The model sits at the bottom. The harness wraps it with prompts, tools, permissions and memory. The tools reach into your repo. And on top, there's you, deciding what goes in and what counts as done.

### Why it matters (2:33)

This explains a classic failure. A human colleague would push back on a vague request. A model won't. As Thorsten Ball points out, it says: you're absolutely right, I'll fix the bug with the upload. Then it guesses. Barry Zhang from Anthropic gives the antidote: put yourself in the agent's context window.

### Errors compound (2:54)

There's one more consequence of the loop. Every step is a chance to be wrong, and errors compound. Chip Huyen's arithmetic: at ninety-five percent accuracy per step, a ten-step task succeeds about sixty percent of the time. A hundred-step task, almost never. So keep tasks scoped and verify along the way.

### Quick check (3:16)

**Quiz:** Your agent decides a helper doesn't exist and writes a duplicate. What most likely happened?
A. The model got lazy and skipped the search
B. A narrow search came back empty, and it acted on what was in its context
C. It can't read files it didn't create
D. The harness hid the file on purpose
Answer: B — The agent only knows what lands in its context. An empty search result looked like proof. Geoffrey Huntley calls this a classic failure.


### Try it (3:30)

Now watch the loop yourself. Ask your agent to list its tools and plan the exact tool calls it would make for a small question about your code, without running them. You'll start to see your codebase the way it does.

```text
List the tools you have in this session and what each one does.
Mark which ones can change files or run commands.
Then, without running anything, show me the exact sequence of tool calls you'd make to find where we handle user login.
```


### Recap (3:43)

Recap. An agent is a model using tools in a loop. Tool calls are just JSON that ordinary code executes. The model only knows what's in its context. And errors compound, so keep steps small and verified. Next: what agents are brilliant at, and where they reliably fail.

## Sources

- Jared Zoneraich — How Claude Code Works - Jared Zoneraich, PromptLayer (at 12:05, 6:16): https://www.youtube.com/watch?v=RFKCzGlAU6Q&t=725s
- Thorsten Ball — How to Build an Agent: https://ampcode.com/how-to-build-an-agent
- Dex Horthy — 12-Factor Agents: Patterns of reliable LLM applications — Dex Horthy, HumanLayer (at 4:55): https://www.youtube.com/watch?v=8kMaTybvDUw&t=295s
- Boris Cherny — Mastering Claude Code in 30 minutes (at 8:08): https://www.youtube.com/watch?v=6eBSHbLKuN0&t=488s
- Boris Cherny, Cat Wu — The Secrets of Claude Code From the Engineers Who Built It (at 4:24): https://www.youtube.com/watch?v=IDSAMqip6ms&t=264s
- Simon Willison — How coding agents work - Agentic Engineering Patterns: https://simonwillison.net/guides/agentic-engineering-patterns/how-coding-agents-work/
- Thorsten Ball — Think Harder: How I Prompt | Thorsten Ball at Laracon US 2026 (at 5:33, 7:04): https://www.youtube.com/watch?v=HegqGzD-kvc&t=333s
- Barry Zhang — How We Build Effective Agents: Barry Zhang, Anthropic (at 8:21): https://www.youtube.com/watch?v=D7_ipDqhtwk&t=501s
- Chip Huyen — Agents: https://huyenchip.com/2025/01/07/agents.html
- Geoffrey Huntley — Ralph Wiggum as a "software engineer": https://ghuntley.com/ralph/
- Cal Rueb — Claude Code best practices | Code w/ Claude (at 4:03): https://www.youtube.com/watch?v=gv0WHhKelSE&t=243s

License: CC BY 4.0 · https://github.com/Haple/agentic-engineering
