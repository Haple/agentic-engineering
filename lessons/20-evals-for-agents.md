# Lesson 20: Evals: measure, don't vibe

> Did that new prompt, skill or model actually make things better? Most teams vibe-check. Evals turn that into a measurement. Start by reading traces and counting failure modes, then build small, binary checks from real failures, validate your judges, and read the transcripts before trusting any score.

Course: Agentic Engineering — https://learn-agentic-engineering.pages.dev/ · Module 5: Quality, safety, teams · 4 min · Watch: https://learn-agentic-engineering.pages.dev/lessons/evals-for-agents/

## Key takeaways

- An eval is a test for an AI system: an input plus grading logic for the output.
- Start with error analysis: read traces, note the first failure in each, cluster, and count.
- 20 to 50 tasks drawn from real failures is a great start.
- Prefer code-based graders; use binary LLM judges for subjective checks, and validate them against human labels.
- Read the transcripts. Broken tasks and graders are common, and they hide real capability.

## Practices for coding agents

- When changing a prompt, skill or model setting, check it against concrete examples before and after, not by impression.
- Express evaluation criteria as binary pass/fail checks, scripted where possible.
- When a test or eval fails, read the actual output before concluding whether the agent or the check is wrong.
- Grade the outcome the user cares about, not whether a specific sequence of steps was followed.

## Lesson transcript


### Intro (0:01)

You changed a prompt, added a skill, or switched models. Did things actually get better? Most teams answer that with a vibe check. This lesson is about answering it with a measurement.

### What an eval is (0:13)

Anthropic's definition is refreshingly simple. An eval is a test for an AI system. Give it an input, then apply grading logic to its output. Hamel Husain adds that at its core, evals are just data analytics on your AI application.

### Why bother (0:30)

Why bother? Without evals, Anthropic warns, you get stuck in reactive loops, catching problems in production, where fixing one failure creates others. With them, Andrew Ng's team can test every new model the day it's released and switch if it scores better. And Lauren Tan uses evals as unit tests for her skills.

### Error analysis first (0:51)

Here's the surprise: don't start by writing tests. Hamel Husain and Shreya Shankar start with error analysis. Read real traces, the full logs of what the agent did. For each one, write down only the first thing that went wrong. Then cluster those notes into failure modes, and count them.
One caution from Shreya: don't hand that first reading to an AI. It lacks your product context, so it tends to say the trace looks fine. You read; the AI can help you cluster. And you don't need thousands of traces. Often around thirty is enough before new ones stop revealing new problems.

### Small and real (1:32)

Then turn the failures that keep coming back into eval tasks. Anthropic's advice: twenty to fifty simple tasks drawn from real failures is a great start. Early changes have big effects, so small samples are enough, and evals get harder to build the longer you wait.

### Graders (1:51)

How should you grade? Prefer code: checking that tests pass, the JSON is valid, the output has the right shape. It's cheap and objective. For subjective qualities, use an LLM judge, but make it binary, pass or fail. Hamel calls one to five scales a weasel way of not making a decision. And give each failure mode its own narrow judge.

### Validate your judges (2:15)

Always check your judges against human labels, and beware of a trap. If real failures happen ten percent of the time, a judge that always says pass agrees with humans ninety percent of the time, while catching nothing. Look at what it gets wrong, not just the agreement rate.

### Consistency (2:33)

Also decide what success means. If one success out of several tries is enough, measure pass at k. If every run must succeed, like a customer-facing agent, measure pass to the power k. An agent that succeeds seventy-five percent of the time passes three runs in a row only about forty-two percent of the time.

### Read the transcripts (2:55)

Finally, read the transcripts. Anthropic found Claude Opus 4.5 scoring forty-two percent on one benchmark, until they fixed bugs in the grading and the tasks. Then it scored ninety-five percent. Broken graders hide real ability. And grade the outcome, not the exact path the agent took.

### They know (3:16)

One last twist from Lauren Tan. When she evaluates skills, she runs the agents in neutrally named folders, because agents can tell when they're being evaluated, and when they do, they change their behavior.

### Quick check (3:29)

**Quiz:** Your judge agrees with humans 90% of the time; real failures are ~10%. What do you check?
A. Nothing, 90% agreement is great
B. What it gets wrong: an always-pass judge also scores 90%
C. Switch the judge to a 1–5 scale
D. Add three more judges and average them
Answer: B — With rare failures, agreement is misleading. Check whether it actually catches the failures.


### Try it (3:46)

Build a tiny eval for something you use every day: a skill, a prompt or a memory file. Ten real tasks and a pass or fail check each is enough to start.

```text
Help me build a tiny eval for [skill/prompt]. Collect 10 real past tasks from our history. For each, define a binary pass/fail check, scripted where possible. Run the current setup, report the pass rate, and show me the transcripts of the failures. Save it to evals/[name]/.
```


### Recap (3:57)

Recap. Measure, don't vibe. Start with error analysis and counting. Build twenty to fifty tasks from real failures. Prefer code graders and binary judges, and validate them. And read the transcripts. Next: the security risk every agent user needs to understand.

## Sources

- Mikaela Grace, Jeremy Hadfield, Rodrigo Olivares, Jiri De Jonghe — Demystifying evals for AI agents: https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents
- Hamel Husain, Shreya Shankar — Why AI evals are the hottest new skill for product builders | Hamel Husain & Shreya Shankar (at 4:23, 13:11, 14:09, 19:00, 28:20, 33:30): https://www.youtube.com/watch?v=BsWxPI9UM4c&t=263s
- Hamel Husain, Shreya Shankar — LLM Evals: Common Mistakes (at 12:48, 18:56): https://www.youtube.com/watch?v=GL0XhAj5LPE&t=768s
- Andrew Ng — Andrew Ng: Building Faster with AI (at 36:53): https://www.youtube.com/watch?v=RNJCfif1dPY&t=2213s
- Lauren Tan — SpaceX AI Engineer Lauren Tan: Part 1 (at 19:06, 21:39): https://www.youtube.com/watch?v=PaPpyQocMww&t=1146s
- Hamel Husain (with Shreya Shankar) — AI Evals: Everything You Need to Know – Hamel’s Blog: https://hamel.dev/blog/posts/evals-faq/

License: CC BY 4.0 · https://github.com/Haple/agentic-engineering
