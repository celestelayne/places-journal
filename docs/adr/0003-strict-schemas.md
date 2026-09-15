# 0003. Contract schemas reject unknown keys

**Status:** Accepted
**Date:** 2026-09-14

## Context

Zod object schemas default to silently stripping keys that are not defined
in the schema. This is a permissive default suited to lenient input
handling. Domain contracts in this project make specific structural
claims — for example, that certain fields are system-managed and excluded
from `CreateInput` (see [0002](./0002-system-managed-fields.md)). If the
schema silently drops unrecognized keys, those structural claims are
documentation, not enforcement.

## Considered options

- **Option A — Default (`.strip()`).** Unknown keys silently removed.
  Tolerant of over-eager callers; hides bugs.
- **Option B — `.strict()`.** Unknown keys throw. Loud early failure;
  the contract's structural claims are runtime rules.
- **Option C — Mixed.** Strict on input schemas (which represent a trust
  boundary) and strip on persisted-record schemas (which describe stored
  data). Defensible but inconsistent.

## Decision

Every domain contract schema uses `.strict()`. This applies uniformly to
persisted-record schemas (e.g., `PlaceSchema`) and to input schemas
(e.g., `CreatePlaceSchema`, `UpdatePlaceSchema`).

## Consequences

**Positive**
- Structural invariants asserted elsewhere (system-managed fields,
  excluded fields on update inputs) are enforced at runtime, not merely
  documented.
- Typos in field names (`updateAt` for `updatedAt`, `wesbsite` for
  `websiteUrl`) surface immediately at the parse call.
- Test suites can assert the invariant directly by expecting a parse
  failure on an unknown key.

**Negative and trade-offs**
- Adding a field to a schema requires updating the schema before callers
  can pass it. This is the correct behavior — contracts evolve
  deliberately — but it is a coordination cost for any change that
  spans schema and consumer.
- If a future feature needs to hydrate a record from an external source
  that carries extra metadata, the ingestion path must select known
  fields before passing to `.parse()`. This is a boundary-layer
  responsibility, not a reason to relax the contract.
- Some Zod idioms (e.g., `.merge()` from a passthrough schema) require
  care to preserve strictness.

**Follow-up**
- None.
