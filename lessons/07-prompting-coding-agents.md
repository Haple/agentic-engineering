# Lesson 7: Talking to agents

> Good prompts aren't clever. They answer one question: how is the model supposed to know what I mean? Learn the habits of people who prompt agents all day: point to where knowledge lives, show a gold standard, state constraints and exit criteria, and use the short phrases that carry a lot of discipline.

Course: Agentic Engineering — https://learn-agentic-engineering.pages.dev/ · Module 2: Working with one agent · 4 min · Watch: https://learn-agentic-engineering.pages.dev/lessons/prompting-coding-agents/

## Key takeaways

- Ask of every prompt: how is the model supposed to know what I mean? Training data, the codebase, the context, or me?
- Point to where knowledge lives: files, folders, docs, screenshots, a working example to imitate.
- Describe the task, the guardrails and the exit criteria, then let the agent work. Don't script every step.
- Short phrases like “first run the tests” or “use red/green TDD” carry a lot of built-in discipline.
- You can just talk to it: ask why, push back, ask it to simplify, ask it to ask you questions.

## Practices for coding agents

- At the start of a session in an existing project, find and run the test suite before changing code.
- When a request points to a reference implementation or existing pattern, study it and match it.
- If the request lacks information you can't find in the codebase, ask; don't invent the missing intent.
- State explicit constraints back before starting (what must not change), and confirm the exit criteria.

## Lesson transcript


### Intro (0:01)

The best prompts for coding agents aren't clever. There are no magic words. They just answer one question better than most people bother to.

### The kidnapped engineer (0:10)

Thorsten Ball, who builds the Amp agent, uses this picture. Imagine a brilliant senior engineer, kidnapped and locked in a room, with only a computer and your note: fix the bug with the upload. What do they know? What are they missing?

### Where knowledge comes from (0:27)

His core question is: how is the model supposed to know what I mean? There are only four places the answer can come from. Its training data, which knows general programming. Your codebase, if it can find the right part. Whatever is already in its context. And your head, which it can only reach through your prompt.

### A better prompt (0:46)

Compare two prompts. The first is the note in the locked room. The second answers the question. It describes the symptom, points to the files, names a working example to copy, states the constraint, and says what done looks like.
Look at what each part does. The symptom says what's wrong. The pointers save the agent from reading the whole repo. The gold standard shows what good looks like. The constraint closes a gap. And the exit criteria tell it when to stop.

### The one-two punch (1:19)

Thorsten's favorite trick is the one-two punch. Instead of cramming everything into the first prompt, he first asks the agent to find the relevant code. That loads the right files into its context. Then he makes the real request.

### Show, don't describe (1:34)

Notice how much work examples do. Simon Willison often tells the agent to imitate existing logic elsewhere in the project, instead of describing the rules. And Thorsten says ninety percent of his prompts include a screenshot: a bug, a design, a customer message. Pictures and examples are cheap, dense context.

### Guardrails and exit (1:56)

How much detail is right? Boris Cherny warns against scripting every step. With modern models, describe the task, describe the guardrails, describe the exit criteria, and then let the model cook. He even suggests giving it tasks slightly harder than you think it can do.

### Phrases that pack a punch (2:14)

Some short phrases carry a surprising amount of discipline, because the habits are already baked into the models. Simon Willison starts sessions with: first run the tests. That's four words, and the agent will keep running them. Use red green TDD. Ask me questions if anything is unclear, because agents rarely ask on their own. And copy how another part of the code does it.

### Just talk to it (2:40)

And remember you can just talk to it. Cat Wu from the Claude Code team says even experts forget this. Output too complicated? Say: simplify it. Something looks off? Ask why it made that choice. Airbnb's engineers found that after a few rounds of pushing back, the agent often admits it was wrong. You can even dictate by voice. What matters is how much information you give, not how polished it sounds.

### Executive communication (3:07)

Thariq Shihipar from the Claude Code team sums it up. Sufficiently advanced prompting is indistinguishable from sufficiently advanced executive communication. Clear context, clear goal, clear constraints. The same things that make a great brief for a human.

### Quick check (3:24)

**Quiz:** Which addition most improves “fix the flaky checkout test”?
A. “Please, this is really urgent!”
B. Writing it in ALL CAPS
C. The failing output, the file to look at, and a test that's known to be stable
D. “You are a world-class senior engineer.”
Answer: C — It answers “how is the model supposed to know?” Urgency, caps and role-play add no information.


### Try it (3:36)

Try this with a prompt you'd normally send. Instead of running it, ask the agent what it would be missing and where it would look. You'll quickly learn which parts of your intent never made it out of your head.

```text
Here's a request: "[your usual one-liner]"
Don't do it yet. Tell me what information you'd be missing to do it well, where in the codebase you'd look for it, and ask me up to 3 questions to fill the gaps.
```


### Recap (3:49)

Recap. Ask how the model is supposed to know what you mean. Point it at files, examples and screenshots. Give guardrails and exit criteria, then let it cook. And talk to it like a colleague. Next: the habit that makes agents trustworthy. Giving them a way to check their own work.

## Sources

- Thorsten Ball — Think Harder: How I Prompt | Thorsten Ball at Laracon US 2026 (at 5:13, 8:10, 10:46, 13:53, 15:04, 18:44): https://www.youtube.com/watch?v=HegqGzD-kvc&t=313s
- Boris Cherny — Boris Cherny: We Cut 80% of Claude Code’s Prompt (at 15:15): https://www.youtube.com/watch?v=qyPCVqFUyDo&t=915s
- Simon Willison — First run the tests - Agentic Engineering Patterns: https://simonwillison.net/guides/agentic-engineering-patterns/first-run-the-tests/
- Simon Willison — Red/green TDD - Agentic Engineering Patterns: https://simonwillison.net/guides/agentic-engineering-patterns/red-green-tdd/
- Simon Willison — Adding a new content type to my blog-to-newsletter tool - Agentic Engineering Patterns: https://simonwillison.net/guides/agentic-engineering-patterns/adding-a-new-content-type/
- Boris Cherny, Cat Wu — The Secrets of Claude Code From the Engineers Who Built It (at 42:47, 52:02): https://www.youtube.com/watch?v=IDSAMqip6ms&t=2567s
- Szczepan Faber, Mike — Agentic coding at Airbnb (at 11:01): https://www.youtube.com/watch?v=o6oYc9-X9Iw&t=661s
- Thariq Shihipar — Claude Code’s Bitter Lesson: Prompts, Harnesses, Mods, and Agents — Thariq Shihipar (at 22:43, 31:51): https://www.youtube.com/watch?v=IZAlq-V19U8&t=1363s

License: CC BY 4.0 · https://github.com/Haple/agentic-engineering
