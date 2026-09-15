# Places Journal — Agent Instructions

## Project purpose

Places Journal is a private application for collecting places, preserving
recommendations and visit notes, and retrieving them later for a relevant
occasion.

This repository is also a learning project: it explores how a traditional
CRUD application can evolve into a trustworthy, AI-assisted workflow product.

## Current milestone

Sprint 1 — Domain contracts.

Define and test the canonical runtime schemas and inferred TypeScript types for
a saved `Place`, including create and update inputs. This sprint establishes the
application’s initial domain vocabulary and validation rules.

No UI, seed data, routing, API calls, persistence, authentication, or AI
functionality belongs in this sprint.

## Current scope

Allowed:
- Add runtime schemas and inferred TypeScript types in `src/contracts`.
- Define the initial `Place` contract.
- Define supported `Cuisine` and `PriceTier` values.
- Define create-place and update-place input contracts.
- Define required, nullable, user-editable, and system-managed fields.
- Define the behavior for explicit `null` values in update input.
- Reject an empty update input object.
- Add focused schema-validation tests for valid and invalid data.
- Add explicitly-approved dependencies to `package.json`. Sprint 1 approves `zod` (already installed) and `vitest` (devDependency).
- Add the `test` and `typecheck` npm scripts to `package.json` (Sprint 1 approved).
- Update `package-lock.json` as a consequence of an approved dependency change.

Not allowed:
- Do not create product UI, place lists, detail pages, forms, cards,
  filters, search, favorite controls, or reusable UI primitives.
- Do not add local product seed data.
- Do not add React Router, routes, API clients, `fetch`, server routes,
  database code, Supabase, migrations, authentication, or environment files.
- Do not add state-management, data-fetching, component-library, or AI libraries.
- Do not create `Note`, `Collection`, `AgentProposal`, or other future
  domain contracts unless explicitly approved.
- Do not modify `App.tsx`, `main.tsx`, `index.css`, build configuration,
  CI, or deployment configuration.
- Modify `package.json` and `package-lock.json` only for dependencies and
  scripts explicitly approved in the current sprint brief.
- Do not invent fields beyond the approved `Place` contract.

## Project structure

```text
docs/
├── adr/                 # Architecture Decision Records (MADR-lite)
└── sprints/             # Sprint briefs

src/
├── app/                 # App composition; no routing in Sprint 1
├── components/
│   └── ui/              # Empty until a reusable primitive is proven necessary
├── contracts/
│   ├── places.ts        # Sprint 1 canonical Place schema and types
│   └── places.test.ts   # Sprint 1 focused contract tests
├── features/            # Empty until Sprint 2
├── index.css            # Global CSS and Tailwind entry point
└── main.tsx             # Application entry point
```

## Contract rules

- `src/contracts` is the canonical home for domain schemas and types.
- Runtime schemas are the source of truth. See
  [ADR 0001](./docs/adr/0001-schemas-as-source-of-truth.md).
- Infer TypeScript types from schemas; do not create duplicate handwritten
  interfaces for the same data shape.
- Unknown persisted metadata must use `null`, not invented placeholder values.
- Use `undefined` only for omitted optional input fields.
- Identity fields (UUID) and provenance timestamps (`createdAt`, `updatedAt`)
  are system-managed and excluded from every input schema. Timestamps are
  ISO 8601 UTC-only, validated with `z.iso.datetime({ offset: false })`.
  See [ADR 0002](./docs/adr/0002-system-managed-fields.md).
- All contract schemas use `.strict()`. Unknown keys are rejected, not
  silently stripped. See [ADR 0003](./docs/adr/0003-strict-schemas.md).
- Free-form string fields are trimmed on parse. Empty strings on nullable
  fields coerce to `null`; contracts must not treat `""` as a third
  "unknown" sentinel alongside `null`.
- URL fields accept `http` and `https` schemes only.
- Update-input schemas follow PATCH semantics: omit means leave alone,
  `null` clears (nullable fields only), a value sets. Target `id` is
  passed separately to any future update function, not inside the input.
  See [ADR 0004](./docs/adr/0004-patch-semantics-for-updates.md).
- For each entity, export two type names: `<Verb><Entity>Input` from
  `z.input<...>` (holes allowed) and `<Verb><Entity>` from
  `z.output<...>` (holes filled).
- Contract changes require explicit approval before implementation.
- Do not add API-specific response envelopes or database types in Sprint 1.

## Domain vocabulary

- `Cuisine` — fixed enum. Members: `American`, `Chinese`, `Ethiopian`,
  `French`, `Indian`, `Italian`, `Japanese`, `Korean`, `Mexican`, `Thai`.
  No `"Other"`. Unknown cuisine is represented as `null` on the persisted
  record.
- `PriceTier` — fixed enum: `"$"`, `"$$"`, `"$$$"`, `"$$$$"`. Unknown is
  represented as `null` on the persisted record.

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
- For any change affecting more than 3 files or project configuration, provide a concise plan before editing.
- If a requirement is ambiguous, ask a focused question rather than choosing an architecture or product behavior.
- Make the smallest valid change that meets the stated acceptance criteria.
- Do not expand a task with "while I am here" refactors.

## Completion report

After every implementation task, report:

1. Files changed
2. What changed in each file
3. Files intentionally not changed
4. Validation commands run and their results
5. Assumptions, limitations, or blocked follow-up work

## Documentation

- `docs/adr/` holds Architecture Decision Records in MADR-lite format.
  New ADRs use the next available four-digit number. Template:
  [`0000-template.md`](./docs/adr/0000-template.md).
- `docs/sprints/` holds per-sprint implementation briefs (field tables,
  test outlines, commit plans, verification checklists). One file per
  sprint; frozen once the sprint ships.