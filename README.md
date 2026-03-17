# openclaw-taxpod

IRS Resolution Pod for the OpenClaw agent system.

## Structure

- `extension/` — OpenClaw plugin (`@openclaw/irs-pod`)
- `ops/` — Pipeline scripts (PORT0-PORT4), fixtures, tests, schemas
- `docs/` — Specification documents and schemas

## Ports

- PORT0: Export payment plan bundle from TaxVault index + facts ledger
- PORT1: Payment capacity model
- PORT2: Strategy recommendation
- PORT3: CPA package builder
- PORT4.1: Feedback-to-changeset (FeedbackV1 → ChangeSetV1)
- PORT4.2: Apply door (human-gated write system)

## Setup

Copy `extension/` into your OpenClaw extensions directory.
Copy `ops/` and `docs/` into your staging workspace.
