# Specs agents can execute

A coding agent fills every gap in your request with its best guess, drawn from average code on the internet. A good spec closes the gaps that matter: the goal, what done looks like, the constraints and what's out of scope. Here's how to write one, without writing it yourself.

## Key ideas

- Whatever your spec leaves blank, the model fills in with average patterns from its training data.
- Spec the goal, acceptance criteria, constraints and out-of-scope. Leave low-level decisions to the agent.
- Make 'done' checkable: concrete steps and a pass or fail for each feature.
- Don't hand-write specs. Let the agent interview you, generate the spec, then edit it.
- Keep specs small and current. Prototype to discover what you want, then spec what you'll keep.

## Practices for agents

- Before building a feature, confirm the goal, acceptance criteria, constraints (stack, dependencies, performance) and what's out of scope; ask if any are missing.
- Search for existing patterns and modules to reuse before proposing new ones, and say which you'll reuse.
- Never add a new dependency without stating why and checking that the spec allows it.
- Express acceptance criteria as concrete, checkable steps, and track each as passing or failing.

Full lesson (Markdown): https://learn-agentic-engineering.pages.dev/lessons/writing-specs-for-agents.md
Video: https://learn-agentic-engineering.pages.dev/lessons/writing-specs-for-agents/
