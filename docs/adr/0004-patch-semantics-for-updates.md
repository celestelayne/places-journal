# 0004. Update inputs use PATCH semantics with null-to-clear

**Status:** Accepted
**Date:** 2026-09-14

## Context

Every mutable entity in Places Journal will have an update contract. The
project already distinguishes `null` (persisted "unknown") from `undefined`
(omitted input) at the input boundary — see `AGENTS.md`, "Contract rules."
Update inputs specifically need a way to represent three distinct caller
intents on the same field: "do not touch," "clear," and "set to this
value." Without a convention, forms and tests will invent ad hoc
representations that diverge across entities.

## Considered options

- **Option A — PUT semantics.** The caller supplies the full record;
  fields not included are cleared. Any partial form that forgets a field
  silently wipes stored data. Unacceptable for a personal journal where
  users edit one thing at a time.
- **Option B — PATCH with a sentinel value for clearing.** Caller passes
  a special string (`"__CLEAR__"`) or an object (`{ clear: true }`) to
  indicate clearing. Custom vocabulary; requires validators on every
  field.
- **Option C — PATCH with `null` as clear.** Omitting a field leaves the
  stored value alone. Passing `null` clears the field (nullable fields
  only). Passing a value sets it. Reuses the type system to distinguish
  the three intents.

## Decision

Update-input schemas follow PATCH semantics using `null` as the clear
signal:

- Omitting a field (`undefined`) leaves the stored value alone.
- Passing `null` clears the stored value. Only permitted on fields whose
  persisted type includes `null`.
- Passing a value sets the stored value.

Non-nullable persisted fields (for example, a required `name`) appear on
the update input as optional-and-non-nullable: they can be changed to a
new value, but cannot be cleared.

The target `id` of an update is passed separately to any future update
function; it does not live inside `UpdateInput`.

## Consequences

**Positive**
- No update path can silently wipe unrelated fields.
- The three caller intents are distinguishable at the type level.
- The update schema is reusable in any future bulk-update or
  update-where context because it carries no addressing information.

**Negative and trade-offs**
- Callers who genuinely want to clear a value must pass `null`
  explicitly, which is one more character than omission. Small cost.
- A caller who intends to "leave alone" but accidentally passes `null`
  will clear the field. This is the price of using `null` as a signal;
  the same risk exists with any explicit sentinel.
- Empty patches (`{}`) are valid inputs. Whether an empty patch is a
  legitimate call or a bug is context-dependent and must be decided by
  the update function, not the schema. The contract's job is to
  represent the input honestly.

**Follow-up**
- None.
