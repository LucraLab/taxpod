# Fixture: case_strategy_override_note

## Scenario

An EA (Enrolled Agent) reviews a PORT3 package for `case_demo_package` and adds an important advisory note to the strategy recommendation. The taxpayer's short-term payment plan is still recommended, but the EA wants to flag that any active federal tax lien must be verified before initiating the payment plan setup.

This is NOT a numeric correction — it's a qualitative addition to the strategy reasoning. The EA appends one item to the `why_this_strategy` array.

## What This Proves

1. **STRATEGY_OVERRIDE_NOTE** feedback type produces a `PATCH_JSON` action on the `STRATEGY` artifact
2. `target.path` must be a valid STRATEGY allowlist path (here: `strategy.why_this_strategy`)
3. `proposed_change` uses `old_value` / `new_value` format (consistent with PATCH_JSON)
4. Cascade: STRATEGY change triggers `REQUIRE_REBUILD_PORT3` only (no PORT1/PORT2 rerun needed)
5. Total: 2 actions (PATCH_JSON + REQUIRE_REBUILD_PORT3)
6. Only 1 derived impact: `REQUIRE_REBUILD_PORT3`

## Key Values

- Artifact: STRATEGY
- Path: strategy.why_this_strategy
- Op: replace (replaces array with updated array)
- Cascade: REQUIRE_REBUILD_PORT3 only
- No PORT1 or PORT2 rerun (upstream data unchanged)

## Determinism Check

Same input + same `--created-utc 20260222T170100Z` → identical changeset output.
