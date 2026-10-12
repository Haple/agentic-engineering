# Evals: measure, don't vibe

Did that new prompt, skill or model actually make things better? Most teams vibe-check. Evals turn that into a measurement. Start by reading traces and counting failure modes, then build small, binary checks from real failures, validate your judges, and read the transcripts before trusting any score.

## Key ideas

- An eval is a test for an AI system: an input plus grading logic for the output.
- Start with error analysis: read traces, note the first failure in each, cluster, and count.
- 20 to 50 tasks drawn from real failures is a great start.
- Prefer code-based graders; use binary LLM judges for subjective checks, and validate them against human labels.
- Read the transcripts. Broken tasks and graders are common, and they hide real capability.

## Practices for agents

- When changing a prompt, skill or model setting, check it against concrete examples before and after, not by impression.
- Express evaluation criteria as binary pass/fail checks, scripted where possible.
- When a test or eval fails, read the actual output before concluding whether the agent or the check is wrong.
- Grade the outcome the user cares about, not whether a specific sequence of steps was followed.

Full lesson (Markdown): https://learn-agentic-engineering.pages.dev/lessons/evals-for-agents.md
Video: https://learn-agentic-engineering.pages.dev/lessons/evals-for-agents/
