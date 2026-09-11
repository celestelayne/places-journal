# Places Journal

A private places journal for saving restaurants and other places, preserving
recommendations and visit notes, and retrieving them later for the right
occasion.

This is also a design-engineering exploration of how a classic CRUD application
can evolve into a workflow-oriented, AI-assisted product without giving an AI
system unbounded authority over user data.

## Current status

**Sprint 0 — Repository foundation**

The app is not functional yet. This sprint establishes the React project,
documentation, validation workflow, and scope rules that later sprints will use.

## Product direction

The eventual product will help a person:

- Save a place and preserve why it matters
- Add notes, recommendations, and visit memories
- Filter and retrieve a personal collection
- Build shortlists for occasions
- Turn messy input into reviewable drafts
- Use AI for retrieval and structured proposals, with human approval required before persistent changes

## Guiding principles

- CRUD is the system of record, not the entire product experience.
- The user should be able to work through normal interfaces and forms.
- AI should help interpret, retrieve, and draft—not silently write or invent facts.
- Facts, inferences, proposals, and completed actions must be distinguishable.
- Consequential changes require explicit human review.
- Build the smallest useful vertical slice before adding infrastructure.

## Tech stack

- React
- TypeScript
- Vite
- Tailwind CSS
- npm

Additional tools will be added only when a current product requirement justifies
them.

## Getting started

### Prerequisites

- Node.js
- npm

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Open the local URL printed by Vite.

### Validate

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Some commands may not exist until the template’s validation tooling is finalized.
Check `package.json` for the currently available scripts.

## Repository structure

```text
src/
├── app/            # App-level composition and future routing
├── components/
│   └── ui/         # Reusable, presentational primitives only
├── contracts/      # Domain/API schemas
├── features/       # Product-specific code
├── index.css       # Global CSS and Tailwind entry point
└── main.tsx        # React application entry point
```

## Working with AI coding agents

Repository-level instructions for coding agents live in [`AGENTS.md`](./AGENTS.md).

1. `AGENTS.md` defines persistent repository rules.
2. The current task prompt defines the narrow goal, allowed files, acceptance criteria, and explicit out-of-scope work.

Do not ask an agent to “build the app.” Work in scoped vertical slices.

## License

Private and experimental. No license granted.