# Sprint 1 — Place contract

**Status:** In progress
**Milestone:** Sprint 1 (Domain contracts)

## Goal

Add runtime-validated `Place`, `CreatePlaceInput`, and `UpdatePlaceInput`
contracts to `src/contracts/places.ts`, plus focused schema-validation tests
in `src/contracts/places.test.ts`.

No UI, API, routing, persistence, or AI behavior in this sprint.

## Referenced decisions

- [ADR 0001](../adr/0001-schemas-as-source-of-truth.md) — schemas as source of truth
- [ADR 0002](../adr/0002-system-managed-fields.md) — system-managed fields
- [ADR 0003](../adr/0003-strict-schemas.md) — strict schemas
- [ADR 0004](../adr/0004-patch-semantics-for-updates.md) — PATCH semantics

## Domain vocabulary

### `Cuisine`

Fixed enum, no `"Other"`. Unknown cuisine is represented as `null` on the
persisted record.

```
American, Chinese, Ethiopian, French, Indian, Italian, Japanese, Korean,
Mexican, Thai
```

### `PriceTier`

```
"$" | "$$" | "$$$" | "$$$$"
```

Unknown price tier is represented as `null` on the persisted record.

## `Place` field table

| Field          | Type                        | Notes                                                          |
|----------------|-----------------------------|----------------------------------------------------------------|
| `id`           | `uuid`                      | System-managed. `z.uuid()`.                                    |
| `name`         | `string`                    | Non-nullable. Trimmed. `min(1)`, `max(200)`.                    |
| `neighborhood` | `string \| null`            | Trimmed. `max(120)` when non-null. Empty string coerces to `null`. |
| `cuisine`      | `Cuisine \| null`           | Enum from `Cuisine`.                                           |
| `priceTier`    | `PriceTier \| null`         | Enum from `PriceTier`.                                         |
| `websiteUrl`   | `string \| null`            | Valid `http(s)` URL when non-null. Empty string coerces to `null`. |
| `createdAt`    | `iso-datetime-utc`          | System-managed. `z.iso.datetime({ offset: false })`.           |
| `updatedAt`    | `iso-datetime-utc`          | System-managed. Same format.                                    |

## Input contracts

### `CreatePlaceInput`

- Excludes `id`, `createdAt`, `updatedAt` (see [ADR 0002](../adr/0002-system-managed-fields.md)).
- `name` required.
- `neighborhood`, `cuisine`, `priceTier`, `websiteUrl` are optional inputs;
  omitted inputs produce `null` in the output via `.nullable().default(null)`.
- Whitespace-only strings on `neighborhood` and `websiteUrl` coerce to `null`.
- Uses `.strict()`; unknown keys are rejected.
- Exports two type names: `CreatePlaceInput` (`z.input<...>`) and
  `CreatePlace` (`z.output<...>`).

### `UpdatePlaceInput`

- PATCH semantics per [ADR 0004](../adr/0004-patch-semantics-for-updates.md).
- Excludes `id`, `createdAt`, `updatedAt`.
- `name` optional and non-nullable (cannot be cleared).
- Other nullable fields are optional and nullable (can be cleared with `null`).
- Empty patch (`{}`) is valid.
- Target `id` is passed separately to any future update function.
- Uses `.strict()`.
- Exports two type names: `UpdatePlaceInput` and `UpdatePlace`.

## Test outline

Eighteen focused cases in `src/contracts/places.test.ts`, one behavior per
`it`. Tests use explicit imports (`import { describe, it, expect } from "vitest"`).

### `Place` schema (6)

1. Accepts a fully-populated valid record.
2. Accepts `null` on each nullable field.
3. Rejects missing `id`, `name`, `createdAt`, or `updatedAt`.
4. Rejects a non-UUID `id`.
5. Rejects a `createdAt` with a timezone offset (must end in `Z`).
6. Rejects unknown top-level keys.

### `CreatePlaceInput` schema (7)

7. `{ name }` alone succeeds; output has `null` on all four nullable fields.
8. Trims `name` and rejects the result if empty after trim.
9. `""` and `"   "` on `neighborhood` coerce to `null`.
10. `""` and `"   "` on `websiteUrl` coerce to `null`.
11. Rejects `websiteUrl` with an `ftp:` or `javascript:` scheme.
12. Rejects invalid enum values for `cuisine` and `priceTier`.
13. Rejects passing `id`, `createdAt`, or `updatedAt` (strict-mode invariant).

### `UpdatePlaceInput` schema (5)

14. `{}` is valid.
15. A single-field patch is valid.
16. `null` accepted on nullable fields (clearing).
17. `null` on `name` is rejected.
18. Rejects passing `id`, `createdAt`, or `updatedAt`.

Explicitly out of scope for Sprint 1 tests: boundary tests on `max()` lengths,
type-level assertions, JSON round-trip tests, coverage tooling.

## Files changed

**Added**
- `docs/adr/0000-template.md`
- `docs/adr/0001-schemas-as-source-of-truth.md`
- `docs/adr/0002-system-managed-fields.md`
- `docs/adr/0003-strict-schemas.md`
- `docs/adr/0004-patch-semantics-for-updates.md`
- `docs/sprints/sprint-1-place-contract.md`
- `src/contracts/places.ts`
- `src/contracts/places.test.ts`

**Modified**
- `AGENTS.md` — Current scope refinement, Contract rules expansion, Domain vocabulary section.
- `README.md` — Roadmap and status; pointer to `docs/`.
- `package.json` — Add `vitest` devDependency, `test` and `typecheck` scripts.
- `package-lock.json` — Consequence of the `vitest` install.

**Intentionally not changed**
- `vite.config.ts`, `tsconfig.app.json`, `tsconfig.json`, `tsconfig.node.json`.
- `src/App.tsx`, `src/main.tsx`, `src/index.css`.
- Any file under `src/components/`, `src/features/`, `src/app/`.

## Commit plan

- **Commit 1 — `Adjust Sprint 1 scope and add contract documentation`**
  All documentation (`docs/adr/*`, `docs/sprints/sprint-1-place-contract.md`),
  the `AGENTS.md` amendment, and the `README.md` pointer.
- **Commit 2 — `Add Place contract and validation tests`**
  `package.json` and lockfile changes (vitest install and scripts),
  `src/contracts/places.ts`, `src/contracts/places.test.ts`.

Merge via PR from `sprint-1-contracts` to `main` after verification passes.

## Verification checklist

All four must pass to declare the sprint done, in this order:

1. `npm run lint`
2. `npm run typecheck`
3. `npm run test`
4. `npm run build`

## Assumptions and limitations

- UUID and timestamp *generation* is deferred to Sprint 4 (local CRUD).
  Sprint 1 defines only the shape and validation.
- Tests use explicit imports rather than vitest globals. No `vitest.config.ts`
  is added.
- No coverage tooling is added in Sprint 1.
