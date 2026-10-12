# Lesson 13: Skills, commands and hooks

> A brilliant agent isn't the same as an expert one. Skills package your team's know-how into folders the agent loads only when needed. Commands save prompts you reuse. Hooks guarantee things happen every time. Here's what each is for, and how to grow them from real work.

Course: Agentic Engineering — https://learn-agentic-engineering.pages.dev/ · Module 3: Your toolkit · 4 min · Watch: https://learn-agentic-engineering.pages.dev/lessons/skills-commands-hooks/

## Key takeaways

- Skills are folders of know-how (a SKILL.md, plus scripts and references) that the agent loads only when relevant.
- Only a skill's name and description sit in context up front, so you can have hundreds.
- Grow skills from real work: repeated scripts, repeated mistakes, repeated workflows.
- Commands are prompts you trigger yourself; hooks are scripts that run on every event, every time.
- A prompt is a suggestion; a hook is a guarantee.

## Practices for coding agents

- Before starting a task, check whether an installed skill covers it and follow it.
- When you write the same helper script twice, propose saving it into a skill.
- Keep a skill's description specific about when to use it; keep the body short and link to references.
- Respect hooks' results (formatters, linters, blocked commands); never work around a hook.

## Lesson transcript


### Intro (0:01)

A brilliant agent isn't the same as an expert one. This lesson is about turning your team's know-how into something agents can pick up, exactly when they need it.

### Genius vs expert (0:11)

Barry Zhang from Anthropic uses a great analogy. You could ask a genius, like his colleague Mahesh, to do your taxes. But, he says, I don't want Mahesh to figure out the tax code from first principles. I need consistent execution from a domain expert. Skills are how you give an agent expertise.

### What a skill is (0:32)

So what is a skill? Anthropic's answer: organized collections of files that package procedural knowledge for agents. In other words, they're folders. Inside, a SKILL file with a name and a description, plus any scripts, templates or reference docs it needs. Building one is like writing an onboarding guide for a new hire.
Here's what the file looks like. The front matter has a name and a description, and the description matters most: it's how the agent decides when to use the skill. Then come the steps, including how to verify. Scripts are run, not read, so they don't cost context.

### Progressive disclosure (1:11)

The magic is progressive disclosure. At startup, the agent only sees each skill's name and description, a few dozen tokens. When a task matches, it reads the full file. Linked references and scripts are pulled in only as needed. Daisy Hollman calls a skill a lazy system prompt.

### Where skills come from (1:30)

Where do good skills come from? From real work. Anthropic noticed Claude writing the same styling script over and over, so they had it save the script inside a skill. Lauren Tan turns every failure mode she sees into a skill. And at Uber, teams asked Claude to read their past code reviews and write a review skill. You can simply ask your agent to write one.

### Commands (1:53)

Commands are simpler. A slash command, or prompt file, is just a saved prompt you trigger yourself, like a review checklist or a weekly changelog. Skills are chosen by the agent when relevant. Commands are chosen by you.

### Hooks (2:09)

Hooks are different again. They're scripts that run on agent events, like after every file edit, before every shell command, or when the agent stops. Use them for anything that must happen every single time: format the code, run the linter, block a dangerous command.

### Suggestion vs guarantee (2:27)

Here's the key difference. An instruction in a prompt or a memory file is a suggestion. The model will usually follow it, but not always. A hook is a guarantee, because it's ordinary code that runs every time. Daisy Hollman adds that hooks scale well: they put nothing in the context unless they have something to say.

### Which one when? (2:49)

So which do you use when? Facts needed every session go in the memory file. Know-how needed only sometimes becomes a skill. Prompts you reuse become commands. Anything that must happen every time becomes a hook. And new abilities come from tools and CLIs.

### Compound engineering (3:09)

Dan Shipper's team at Every calls this compounding engineering. Every feature should make the next one easier, by codifying what you learned into prompts, skills and commands. Do that consistently, and your setup gets better every week.

### Quick check (3:24)

**Quiz:** You want code formatted after every single edit, no exceptions. What do you use?
A. A line in your memory file
B. A skill about formatting
C. A hook that runs after each edit
D. A reminder in every prompt
Answer: C — Instructions are suggestions. A hook is code that runs every time.


### Try it (3:39)

Write your first skill from real work. This prompt has the agent find a workflow you repeat and turn it into a skill, with verification built in.

```text
Look at our recent git history and this repo. Find a workflow we repeat (adding an endpoint, a release, a migration...). Write it as
.claude/skills/<name>/SKILL.md: a precise name and description of when to use it, the steps, and how to verify. Put scripts in scripts/.
```


### Recap (3:49)

Recap. Skills are folders of know-how, loaded only when needed. Grow them from real work, or just ask the agent to write them. Commands are saved prompts. Hooks are guarantees. And every feature should make the next one easier. Next: git, your safety net.

## Sources

- Barry Zhang, Mahesh Murag — Don't Build Agents, Build Skills Instead – Barry Zhang & Mahesh Murag, Anthropic (at 2:38, 3:10, 3:48): https://www.youtube.com/watch?v=CEvIs9y1uog&t=158s
- Barry Zhang, Keith Lazuka, Mahesh Murag — Equipping agents for the real world with Agent Skills: https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
- Daisy Hollman — How Anthropic uses Claude Code: Agentic Software Engineering at Scale - Daisy Hollman (at 38:48, 44:32): https://www.youtube.com/watch?v=shZgedW15vg&t=2328s
- Lauren Tan — SpaceX AI Engineer Lauren Tan: Part 1 (at 16:25): https://www.youtube.com/watch?v=PaPpyQocMww&t=985s
- Vaibhav Srivastav (VB), Katia Gil Guzman — OpenAI Codex Masterclass  — Vaibhav Srivastav & Katia Gil Guzman (at 3:42): https://www.youtube.com/watch?v=MhHEGMFCEB0&t=222s
- Will Bond, Ameya Ketkar — Building uReview, Uber’s Multi-Agent Code Review Engine — Will Bond & Ameya Ketkar, Uber (at 9:41): https://www.youtube.com/watch?v=EL123UNokkI&t=581s
- Burke Holland — The complete guide to Agent Skills (at 0:15): https://www.youtube.com/watch?v=fabAI1OKKww&t=15s
- Birgitta Böckeler — Context Engineering for Coding Agents: https://martinfowler.com/articles/exploring-gen-ai/context-engineering-coding-agents.html
- IndyDevDan — I’m HOOKED on Claude Code Hooks: Advanced Agentic Coding (at 6:40): https://www.youtube.com/watch?v=J5B9UGTuNoM&t=400s
- Boris Cherny, Cat Wu — The Secrets of Claude Code From the Engineers Who Built It (at 30:12): https://www.youtube.com/watch?v=IDSAMqip6ms&t=1812s
- Matt Pocock — 5 Claude Code skills I use every single day (at 0:27): https://www.youtube.com/watch?v=EJyuu6zlQCg&t=27s

License: CC BY 4.0 · https://github.com/Haple/agentic-engineering
