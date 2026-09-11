# Places Journal — Agent Instructions

## Project purpose

Places Journal is a private application for collecting places, preserving
recommendations and visit notes, and retrieving them later for a relevant
occasion.

This repository is also a learning project: it explores how a traditional
CRUD application can evolve into a trustworthy, AI-assisted workflow product.

## Current milestone

Sprint 0 — Repository foundation.

The only goal of this sprint is a working Vite + React + TypeScript project
with a clear repository structure, documentation, and validation commands.

## Current scope

Allowed:
- Maintain the existing Vite + React + TypeScript setup.
- Configure or verify Tailwind, if it is already part of the chosen template.
- Keep `src/index.css` as the single global stylesheet entry point.
- Add or improve repository documentation.
- Add minimal application-shell UI needed to verify the app runs.
- Repair configuration only when a documented command fails.

Not allowed:
- Do not add domain models, schemas, contracts, seed data, routes, or features.
- Do not add React Router, a data-fetching library, global state, a component
  library, Supabase, a database, authentication, API routes, or an AI SDK.
- Do not add dependencies without explicit user approval.
- Do not refactor template code merely for preference.
- Do not create generic abstractions or a design system.
- Do not modify CI, deployment, environment configuration, or lockfiles unless
  explicitly requested.

## Project structure

Current intended structure:

```text
src/
├── app/            # App composition; intentionally minimal in Sprint 0
├── components/
│   └── ui/         # Empty until a reusable primitive is proven necessary
├── contracts/      # Empty until Sprint 1
├── features/       # Empty until Sprint 2
├── index.css       # Global CSS and Tailwind entry point
└── main.tsx        # Application entry point
```

## Code conventions

- Use TypeScript; do not introduce JavaScript files for application code.
- Prefer named exports for new React components.
- Keep components small and feature-specific.
- Use semantic HTML and accessible labels.
- Do not use `any`.
- Do not introduce a new styling approach. Use the project’s existing
  Tailwind/CSS conventions.
- Do not create a shared component unless it has at least two current,
  independent consumers or the user explicitly requests one.

## Validation

Before saying work is complete, run the narrowest relevant validation first.

Expected commands:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

If any script does not exist, report that fact. Do not silently add a new tool
or dependency in order to make it exist.

## Working with the user

- Inspect relevant files before proposing changes.
- For any change affecting more than 3 files or project configuration, provide
  a concise plan before editing.
- If a requirement is ambiguous, ask a focused question rather than choosing
  an architecture or product behavior.
- Make the smallest valid change that meets the stated acceptance criteria.
- Do not expand a task with "while I am here" refactors.

## Completion report

After every implementation task, report:

1. Files changed
2. What changed in each file
3. Files intentionally not changed
4. Validation commands run and their results
5. Assumptions, limitations, or blocked follow-up work