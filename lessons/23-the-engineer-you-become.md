# Lesson 23: The engineer you become

> Kent Beck says 90% of his skills went to zero and 10% went up a thousandfold. Which 10%? Vision, judgment, design, domain knowledge, and real understanding. Here's how to keep learning when agents write the code, pay down cognitive debt, and build the skills that compound.

Course: Agentic Engineering — https://learn-agentic-engineering.pages.dev/ · Module 6: The engineer you become · 4 min · Watch: https://learn-agentic-engineering.pages.dev/lessons/the-engineer-you-become/

## Key takeaways

- Syntax and API recall are worth less; vision, judgment, design and domain knowledge are worth far more.
- The things agents can't do are your job now.
- Cognitive debt is real: pay it down by making sure you understand the code, with walkthroughs and explanations.
- Your judgment comes from understanding how things work. Keep building it on purpose.
- Getting good takes practice. No tool made anyone faster in the first hour.

## Practices for coding agents

- When you finish a non-trivial change, offer a short walkthrough of how it works and why.
- Explain trade-offs and alternatives you considered, so the human keeps the design in their head.
- When the user is learning, explain rather than just doing; point to the concept behind the fix.
- Defer to the human on vision, product and taste decisions; surface them clearly instead of deciding silently.

## Lesson transcript


### Intro (0:01)

If agents write most of the code, what's left for you? More than you might think. But it's a different mix of skills than the one that got most of us here.

### 90 and 10 (0:11)

Kent Beck, after decades of shaping how we build software, put it starkly. Ninety percent of my skills just went to zero dollars, and ten percent of my skills just went up a thousand times. The trick is knowing which ten percent.
Here's how the sources sort them. Losing value: syntax and API details, memorizing commands, typing speed, and, as Boris Cherny says, very strong opinions about code style and frameworks. Gaining value: having a vision and setting milestones, controlling design and complexity, deep domain knowledge, being methodical and hypothesis-driven, and knowing what's worth building.

### Your job now (0:54)

Karpathy gives the rule of thumb. The things that agents can't do are your job now. The things agents can do, they can probably do better than you, or very soon. So be strategic about where you spend your effort.

### New core skills (1:09)

Some of those skills are surprising. Mario Zechner says learning to say no is your most valuable capability right now: fewer features, but the ones that matter. Boris Cherny says the best person to write accounting software may be an accountant, because coding is now the easy part. And Martin Fowler reminds us that the core skill was always understanding what to write, which means talking to the people who use your software.

### Cognitive debt (1:36)

Now a risk. When agents write code faster than you can absorb it, you build up cognitive debt: the gap between what the code does and what you understand about it. Simon Willison's answer is to pay it down deliberately, by improving your understanding of how the code works.

### Pay it down (1:54)

His favorite tools for that are made by the agent itself. A linear walkthrough: the agent explains the code in order, pasting real snippets rather than retyping them. And interactive explanations: animated, explorable pages that show how an algorithm works. He says reading one walkthrough taught him a great deal about SwiftUI.

### Keep building judgment (2:17)

Why does understanding matter if you're not typing the code? Because judgment comes from it. One Anthropic engineer explained it in the company's trends report: I mostly use AI where I know what the answer should look like, and I developed that ability by doing software engineering the hard way. DHH adds that seniors gain the most from agents, because they can tell good output from bad.

### Advice for juniors (2:41)

That's a real challenge for people early in their careers. Martin Fowler's advice: use the tools, but find senior mentors, because you can't yet tell whether output is good. Probe the agent; ask why and for its sources. And Mitchell Hashimoto suggests challenging yourself to understand how things work, even when you're not the one writing them, because that knowledge transfers.

### Practice (3:06)

And give yourself time. When Mitchell Hashimoto started, he forced himself to do every task twice: once by hand, and once with an agent, aiming for the same quality. It was excruciating, but it built real skill. As he says, what tool have you ever adopted where you were immediately faster?

### Quick check (3:27)

**Quiz:** As agents write more of the code, which skill becomes MORE valuable?
A. Memorizing standard library APIs
B. Typing speed
C. Judging whether a design will hold up, and what's worth building
D. Strong opinions about tabs versus spaces
Answer: C — Judgment about design and direction is exactly what agents can't do for you.


### Try it (3:40)

Pay down some cognitive debt today. Ask your agent for a linear walkthrough of a recent change, with real snippets, and have it quiz you at the end.

```text
Write a linear walkthrough of [the change / file]: go through the code in order and explain why each part exists and what would break without it. Paste real snippets using grep or cat, don't retype them.
Then quiz me with 3 questions to check I understood it.
```


### Recap (3:49)

Recap. Ninety percent of skills lose value; ten percent compound: vision, judgment, design, domain knowledge. What agents can't do is your job now. Pay down cognitive debt on purpose. And give yourself time to get good. Last lesson next: what comes next.

## Sources

- Kent Beck — TDD, AI agents and coding with Kent Beck (at 12:37, 12:52): https://www.youtube.com/watch?v=aSXaxOdVtAQ&t=757s
- Andrej Karpathy — Skill Issue: Andrej Karpathy on Code Agents, AutoResearch, and the Loopy Era of AI (at 65:25, 3:41): https://www.youtube.com/watch?v=kwSVtQ7dziU&t=3925s
- Boris Cherny — Building Claude Code with Boris Cherny (at 92:37): https://www.youtube.com/watch?v=julbw1JuAz0&t=5557s
- Mario Zechner — Building pi in a World of Slop — Mario Zechner (at 17:02): https://www.youtube.com/watch?v=RjfbvDXpFls&t=1022s
- Boris Cherny — Anthropic's Boris Cherny: Why Coding Is Solved, and What Comes Next (at 17:06): https://www.youtube.com/watch?v=SlGRN8jh2RI&t=1026s
- Simon Willison — Interactive explanations - Agentic Engineering Patterns: https://simonwillison.net/guides/agentic-engineering-patterns/interactive-explanations/
- Simon Willison — Linear walkthroughs - Agentic Engineering Patterns: https://simonwillison.net/guides/agentic-engineering-patterns/linear-walkthroughs/
- Mitchell Hashimoto — Agentic Engineering in Action with Mitchell Hashimoto (at 51:19, 31:10): https://www.youtube.com/watch?v=XyQ4ZTS5dGw&t=3079s
- Anthropic — 2026 Agentic Coding Trends Report: https://resources.anthropic.com/2026-agentic-coding-trends-report
- David Heinemeier Hansson (DHH) — DHH’s new way of writing code (at 55:54): https://www.youtube.com/watch?v=JiWgKRgdgpI&t=3354s
- Martin Fowler — How AI will change software engineering – with Martin Fowler (at 96:50): https://www.youtube.com/watch?v=CQmI4XKTa0U&t=5810s
- Mitchell Hashimoto — My AI Adoption Journey: https://mitchellh.com/writing/my-ai-adoption-journey
- Andrew Ng — Andrew Ng: Building Faster with AI (at 14:49): https://www.youtube.com/watch?v=RNJCfif1dPY&t=889s

License: CC BY 4.0 · https://github.com/Haple/agentic-engineering
