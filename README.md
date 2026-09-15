# Places Journal

A private places journal for saving restaurants and other places, preserving
recommendations and visit notes, and retrieving them later for the right
occasion.

This is also a design-engineering exploration of how a classic CRUD application
can evolve into a workflow-oriented, AI-assisted product without giving an AI
system unbounded authority over user data.

## Current status

**Sprint 2 — Read the static collection**

Sprint 1 shipped the canonical `Place` schema and validation. Sprint 2 is
the first Read operation: a small set of typed seed records rendered
through the Sprint 1 contract. No editing, persistence, routing, or AI
functionality yet.

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
docs/
├── adr/            # Architecture Decision Records (MADR-lite)
└── sprints/        # Sprint briefs

src/
├── app/            # App-level composition and future routing
├── components/
│   └── ui/         # Reusable, presentational primitives only
├── contracts/      # Domain/API schemas
├── features/       # Product-specific code
├── index.css       # Global CSS and Tailwind entry point
└── main.tsx        # React application entry point
```

## Roadmap

| Sprint | Focus | Status |
|---:|---|---|
| 0 | Repository foundation | Complete |
| 1 | Place contract | Complete |
| 2 | Read the static collection | Current |
| 3 | Read a single place (routing and detail) | Planned |
| 4 | Create, update, delete (local) | Planned |
| 5 | Notes and visits (child records) | Planned |
| 6 | Read at scale (search, filters, favorites) | Planned |
| 7 | Persistence and typed API boundary | Planned |
| 8 | Authentication and record ownership | Planned |
| 9 | AI capture inbox and reviewable drafts | Planned |
| 10 | Read-only “ask your collection” agent | Planned |
| 11 | Human-approved agent actions | Planned |

## Working with AI coding agents

Repository-level instructions for coding agents live in [`AGENTS.md`](./AGENTS.md).

1. `AGENTS.md` defines persistent repository rules.
2. The current task prompt defines the narrow goal, allowed files, acceptance criteria, and explicit out-of-scope work.

Do not ask an agent to “build the app.” Work in scoped vertical slices.

## Design documentation

- [`docs/adr/`](./docs/adr) — Architecture Decision Records. Durable
  design decisions with rationale, in MADR-lite format.
- [`docs/sprints/`](./docs/sprints) — Per-sprint implementation briefs.
  Field tables, test outlines, and verification checklists for each
  sprint.

## License

Private and experimental. No license granted.