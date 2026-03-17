# PORT4 Pipeline — CPA Feedback to ChangeSet

**Version:** 1.0.0
**Created:** 2026-02-22
**Status:** Active — PORT4.1 (FeedbackV1 → ChangeSetV1) and PORT4.2 (Apply Door) fully implemented and tested. Markdown intake (Stage 1) and automated Regenerate (Stage 7) not yet implemented.
**Depends on:** CPA_FEEDBACK_V1 contract

## Overview

PORT4 is the first TaxPod stage that receives **external human input** (CPA/EA feedback) rather than deterministic computation from upstream data. This introduces new risks: data drift, conflicting corrections, and partial/ambiguous instructions. The pipeline is designed to be fail-closed at every gate.

```
                    ┌─────────────┐
                    │  CPA Reviews │
                    │  PORT3 Pkg   │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
            Stage 1 │   INTAKE    │  Receive JSON or markdown
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
            Stage 2 │  NORMALIZE  │  → FeedbackV1 JSON
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
            Stage 3 │  VALIDATE   │  Schema + hash + target checks
                    └──────┬──────┘
                           │ fail → EXIT non-zero, no output
                    ┌──────▼──────┐
            Stage 4 │  TRANSFORM  │  FeedbackV1 → ChangeSetV1
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
            Stage 5 │  HUMAN GATE │  Explicit approval required
                    └──────┬──────┘
                           │ (future)
                    ┌──────▼──────┐
            Stage 6 │   APPLY     │  Write changes to artifacts
                    └──────┬──────┘
                           │ (future)
                    ┌──────▼──────┐
            Stage 7 │  REGENERATE │  Cascade: PORT1 → PORT2 → PORT3
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
            Stage 8 │   AUDIT     │  Append-only log
                    └─────────────┘
```

---

## Stage Details

### Stage 1: Intake

**Input:** JSON file or markdown file from CPA/EA.

**Rules:**
- Accept only files from local filesystem (no network fetch)
- File must be readable and non-empty
- File extension determines mode: `.json` → structured, `.md` → human notes

**Fail-closed:** Missing file, empty file, or unrecognized extension → exit 1.

### Stage 2: Normalize

**Input:** Raw intake file.
**Output:** FeedbackV1 JSON object in memory.

**Rules:**
- If JSON: parse and validate against FeedbackV1 schema
- If markdown: **(V1: NOT IMPLEMENTED)** — exit 1 with "markdown normalization not yet supported"
- Normalize whitespace in all string fields (trim, collapse spaces)
- Sort items by `item_id`

**Fail-closed:** Parse error, schema violation, or markdown input → exit 1.

### Stage 3: Validate

**Input:** FeedbackV1 JSON object.
**Output:** Validated FeedbackV1 (pass-through if valid).

**Checks (all must pass):**

| # | Check | Exit Code on Fail |
|---|-------|-------------------|
| V1 | `version` = "FeedbackV1" | 1 |
| V2 | `case_id` non-empty | 1 |
| V3 | `feedback_id` non-empty and matches pattern `<case_id>_fb_<utc>` | 1 |
| V4 | `source` is valid enum value | 1 |
| V5 | `received_utc` is valid UTC format | 1 |
| V6 | `package_manifest_sha256` non-empty (64 hex chars) | 1 |
| V7 | `package_manifest_sha256` matches actual manifest.json from package dir | 4 |
| V8 | `items` is non-empty array | 1 |
| V9 | All `item_id` values are unique | 1 |
| V10 | Each item has valid `type` enum | 1 |
| V11 | Each item has valid `target.artifact` enum | 1 |
| V12 | `PATCH_JSON`-producing items have non-empty `proposed_change` | 1 |
| V13 | `LIABILITY_CORRECTION` items have `old_value` that matches current artifact | 2 |
| V14 | `PAYMENT_CAPACITY_ASSUMPTION_FIX` items have `old_value` that matches | 2 |

**Fail-closed:** Any check fails → exit with specified code, no output.

### Stage 4: Transform (FeedbackV1 → ChangeSetV1)

**Input:** Validated FeedbackV1.
**Output:** ChangeSetV1 JSON.

**Mapping rules:**

| Feedback Type | Generated Actions |
|---------------|-------------------|
| `LIABILITY_CORRECTION` | `PATCH_JSON` on liability_snapshot + `REQUIRE_RERUN_PORT2` + `REQUIRE_REBUILD_PORT3` |
| `MISSING_DOC` | `ADD_DOC_REFERENCE` + `REQUIRE_REEXPORT_BUNDLE` + `REQUIRE_REBUILD_PORT3` |
| `DOC_CLASSIFICATION_FIX` | `RECLASSIFY_DOC` + `REQUIRE_REEXPORT_BUNDLE` + `REQUIRE_REBUILD_PORT3` |
| `PAYMENT_CAPACITY_ASSUMPTION_FIX` | `PATCH_JSON` on payment_model + `REQUIRE_RERUN_PORT1` + `REQUIRE_RERUN_PORT2` + `REQUIRE_REBUILD_PORT3` |
| `STRATEGY_OVERRIDE_NOTE` | `ADD_FLAG` (STRATEGY_OVERRIDE) on strategy + `REQUIRE_REBUILD_PORT3` |
| `DISPUTE_OR_UNCERTAIN` | `ADD_FLAG` (per dispute flag) on target artifact + cascade per artifact |

**Action ID generation:** `act_<3-digit-zero-padded-index>` (e.g., `act_001`, `act_002`)

**Derived impacts:** Union of all triggered cascades, sorted alphabetically, deduplicated.

**Determinism:** Same input → identical output. Actions sorted by `action_id`.

### Stage 5: Human Approval Gate

PORT4.1 stops here: the ChangeSet is written to disk. A human must review `changeset.json` and produce an approval proof file before the Apply Door can execute.

### Stage 6: Apply (IMPLEMENTED — ops/apply/apply_changeset_v1.js)

**The Apply Door** is the single authorized writer for all TaxPod runtime artifacts:
- Exactly ONE script is authorized to write changes to artifacts
- Enforces 9-gate validation sequence (schema → case match → approval proof → allowlist → drift check)
- Re-validates all `old_value` fields against current state before writing
- Records before-hash and after-hash for every modified file (apply receipt)
- Atomic writes only (temp file → rename; no partial state)
- Append-only audit log at `audit/taxpod_apply.jsonl`

CLI:
```bash
node ops/apply/apply_changeset_v1.js \
  --changeset <path> --case <CASE_ID> \
  --approve-proof <path_to_approval.md> \
  --approve-proof-sha256 <hex> \
  [--dry-run] [--runtime-root <path>]
```

### Stage 7: Regenerate (FUTURE — automated orchestration not yet implemented)

After apply, the cascade markers written by the Apply Door signal which ports need rerunning. Future orchestration will handle this automatically. For now, run manually based on `derived_impacts`:

```
If derived_impacts includes REQUIRE_REEXPORT_BUNDLE:
  → rerun PORT0: bash ops/export_payment_plan_bundle_v1.sh --case <case>

If derived_impacts includes REQUIRE_RERUN_PORT1:
  → rerun PORT1: bash ops/run_port1_payment_capacity.sh --case <case> --bundle <dir> --intake <file> --force

If derived_impacts includes REQUIRE_RERUN_PORT2:
  → rerun PORT2: bash ops/run_port2_strategy_recommendation.sh --case <case> --bundle <dir> --model <file> --force

If derived_impacts includes REQUIRE_REBUILD_PORT3:
  → rerun PORT3: bash ops/run_port3_cpa_package.sh --case <case> --force
```

Each rerun produces a new timestamped output — originals are never overwritten.

### Stage 8: Audit Logging

**Every changeset is an audit artifact.** Written to:

```
<out_root>/<CASE_ID>/<UTC>/changeset_v1/
├── changeset.json
└── feedback_input.json  (frozen copy of the input)
```

**Append-only:** Old changesets are never deleted or modified. Each new feedback cycle creates a new timestamped directory.

**Audit fields in changeset.json:**
- `input_feedback_sha256`: hash of the frozen feedback input
- `changeset_sha256`: hash of the changeset itself (self-referential integrity)

---

## Integration Points

### Inputs

| Source | File | Used By |
|--------|------|---------|
| PORT3 package | `manifest.json` | SHA verification (V7 check) |
| PORT3 package | `01_LIABILITY_SNAPSHOT.json` | Drift detection for liability corrections |
| PORT3 package | `02_PAYMENT_PLAN_MODEL.json` | Drift detection for capacity fixes |
| PORT3 package | `03_STRATEGY_RECOMMENDATION.json` | Drift detection for strategy notes |
| CPA/EA | `feedback.json` | Primary input |

### Outputs

| Output | Consumed By |
|--------|-------------|
| `changeset.json` | Human review → future Apply stage |
| `feedback_input.json` | Audit trail |
| `derived_impacts` | Future regeneration orchestrator |

---

## Error Handling Summary

| Scenario | Behavior | Exit Code |
|----------|----------|-----------|
| Missing or malformed feedback file | Reject, no output | 1 |
| Schema validation failure | Reject, no output | 1 |
| Drift detected (old_value mismatch) | Reject, no output | 2 |
| Output directory exists (no --force) | Reject, no output | 3 |
| Package manifest SHA mismatch | Reject, no output | 4 |
| Markdown input (V1) | Reject with "not yet supported" | 1 |
| Empty items array | Reject, no output | 1 |
| Duplicate item_ids | Reject, no output | 1 |

---

## What PORT4 Does NOT Do (V1 Scope)

- Does NOT modify any artifact files
- Does NOT execute PORT0/PORT1/PORT2/PORT3 reruns
- Does NOT parse markdown feedback (future)
- Does NOT send notifications or emails
- Does NOT interact with any external API
- Does NOT auto-approve any change

PORT4 V1 is a **pure function**: FeedbackV1 JSON in → ChangeSetV1 JSON out.

---

*Version: PORT4_PIPELINE 1.0.0 | Status: Draft | Created: 2026-02-22*
