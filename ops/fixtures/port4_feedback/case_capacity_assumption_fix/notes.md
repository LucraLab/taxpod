# Fixture: case_capacity_assumption_fix

## Scenario

A CPA reviews a PORT3 package for `case_demo_package` and identifies that the taxpayer's rental income was omitted from the original intake. The verified monthly income is $7,500, not $6,000. This changes the payment capacity and may alter the strategy recommendation.

## What This Proves

1. **PAYMENT_CAPACITY_ASSUMPTION_FIX** feedback type produces a `PATCH_JSON` action on the `PAYMENT_MODEL` artifact
2. `target.path` maps to an allowed PAYMENT_MODEL path (`intake_summary.total_monthly_income`)
3. `proposed_change` uses `old_value` / `new_value` format
4. Full cascade triggered: `REQUIRE_RERUN_PORT1` → `REQUIRE_RERUN_PORT2` → `REQUIRE_REBUILD_PORT3`
5. Total: 4 actions (PATCH_JSON + REQUIRE_RERUN_PORT1 + REQUIRE_RERUN_PORT2 + REQUIRE_REBUILD_PORT3)
6. 3 derived impacts: `REQUIRE_RERUN_PORT1`, `REQUIRE_RERUN_PORT2`, `REQUIRE_REBUILD_PORT3`

## Key Values

- Artifact: PAYMENT_MODEL
- Path: intake_summary.total_monthly_income
- Old: 6000, New: 7500
- Full downstream cascade (most impactful feedback type)

## Determinism Check

Same input + same `--created-utc 20260222T180100Z` → identical changeset output.
