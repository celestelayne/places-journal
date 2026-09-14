# 0002. Identity and timestamp fields are system-managed

**Status:** Accepted
**Date:** 2026-09-14

## Context

Every persisted entity in Places Journal will carry an identifier and
provenance timestamps (`createdAt`, `updatedAt`). These fields exist on the
stored record but do not correspond to user input on any form: a user does
not choose a UUID, and a user does not set the current time. The contract
must draw a boundary between fields the caller supplies and fields the
system assigns.

## Considered options

- **Option A — All fields present on every input.** `CreateInput` and
  `UpdateInput` include `id`, `createdAt`, `updatedAt`. The caller is
  responsible for supplying valid values. Test fixtures and future forms
  invent placeholder UUIDs and timestamps.
- **Option B — Optional on input; system fills in when omitted.**
  Callers may pass system-managed fields or omit them. Ambiguous — the
  contract does not communicate that these fields are not the caller's
  concern.
- **Option C — Excluded from input schemas entirely.** `CreateInput` and
  `UpdateInput` do not have `id`, `createdAt`, or `updatedAt` fields at
  all. Strict schemas reject them if passed. The persisted schema (`Place`)
  keeps them as required.

## Decision

We exclude identity and timestamp fields from every input schema.
`CreateInput` and `UpdateInput` for a given entity omit `id`, `createdAt`,
and `updatedAt` at the type level. The persisted schema retains them as
required fields. In combination with [0003](./0003-strict-schemas.md), the
input schemas reject these fields at runtime if a caller passes them.

Timestamps are ISO 8601 strings in UTC only, validated with
`z.iso.datetime({ offset: false })`. `id` is a UUID validated with
`z.uuid()`.

## Consequences

**Positive**
- The "system-managed" boundary is a real runtime rule, not a comment.
- Test fixtures do not invent placeholder ids or dates on the input side.
- Future forms bind directly to `CreateInput` and `UpdateInput` without
  masking away irrelevant fields.
- Timezone ambiguity in stored timestamps is impossible.

**Negative and trade-offs**
- Sprint 1 does not include the code that actually generates ids or
  timestamps. That responsibility falls to a future persistence layer
  (Sprint 4 for local CRUD, Sprint 7 for typed API boundary).
- Any future need to import records from an external system that supplies
  its own ids and timestamps will need a separate ingestion schema, not
  the primary `CreateInput`.

**Follow-up**
- Where UUID and timestamp generation actually lives is a Sprint 4
  concern.
