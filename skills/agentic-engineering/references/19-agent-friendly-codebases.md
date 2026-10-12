# Codebases agents can work in

Bad codebases make bad agents, and agents can make a codebase bad fast: they copy whatever patterns they find, good or bad. Learn the principles that keep a codebase agent-friendly: make the shortest path the right path, deep modules, one way to do each thing, enforced architecture, simple code, and continuous cleanup.

## Key ideas

- Agents copy the patterns they find. Garbage codebase in, garbage code out.
- Without steering, agent-built codebases decay fast, sometimes within weeks.
- Make the shortest path the right path: conventional structure, one way to do each thing.
- Deep modules with thin interfaces, strong types and fast, reliable tests are agent superpowers.
- Clean continuously: encode golden rules and let background agents open small refactor PRs.

## Practices for agents

- Before writing new code, find and follow the existing pattern for this kind of change; if there are several, ask which is canonical.
- Prefer simple, explicit code over clever abstractions; don't add a dependency when a few lines will do.
- Don't introduce a new way of doing something the codebase already does one way.
- Leave the code slightly cleaner: remove dead code you created and flag duplication you notice.

Full lesson (Markdown): https://learn-agentic-engineering.pages.dev/lessons/agent-friendly-codebases.md
Video: https://learn-agentic-engineering.pages.dev/lessons/agent-friendly-codebases/
