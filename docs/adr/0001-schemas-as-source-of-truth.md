# 0001. Zod schemas are the source of truth for domain contracts

**Status:** Accepted
**Date:** 2026-09-14

## Context

Places Journal will accumulate domain entities (`Place` first; later `Note`,
`Collection`, `AgentProposal`, and others). Each entity needs a shape that is
consistent across UI, storage, and any future API boundary. The project has
one principle in tension: "Runtime schemas are the source of truth" (from
`AGENTS.md`), which needs an operational answer to how types and schemas
relate.

## Considered options

- **Option A — Handwritten TypeScript interfaces, no runtime validation.**
  Interfaces describe the shape; runtime validity is trusted or checked
  ad hoc. Cheap up front; unsafe at any boundary that touches user input,
  storage, or an external system.
- **Option B — Handwritten interfaces plus separate Zod schemas.**
  Two definitions of the same shape kept in sync by convention. Doubles the
  maintenance surface; drift is easy and silent.
- **Option C — Zod schemas as source of truth; TypeScript types inferred.**
  One definition. Types come from `z.infer`, `z.input`, or `z.output`.
  Runtime and compile-time shapes cannot diverge.

## Decision

We use Zod schemas as the single source of truth for every domain contract.
TypeScript types are inferred with `z.input<typeof Schema>` or
`z.output<typeof Schema>`. Handwritten interfaces that duplicate a schema's
shape are not permitted.

## Consequences

**Positive**
- One definition per contract. Zero drift risk between runtime and compile
  time.
- Every trust boundary (user input, future API responses, imported data)
  can validate against the same object that defines the type.
- Contract changes are one edit, not two.

**Negative and trade-offs**
- Inferred type names are less discoverable in an IDE than named interfaces.
  Consumers rely on the schema's exports to know what types exist.
- Zod is now a load-bearing dependency. A future desire to drop Zod would
  require replacing every contract, not just the validators.
- Some Zod idioms (transforms, preprocess, defaults) produce input and
  output types that differ. Consumers must pick the correct side (see
  [0002](./0002-system-managed-fields.md) and
  [0004](./0004-patch-semantics-for-updates.md) for cases where this
  matters).

**Follow-up**
- Naming conventions for the input-vs-output type pair are set out in
  `AGENTS.md` under "Contract rules."
