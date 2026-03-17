# Fixture: case_oic

## Scenario

A taxpayer owes $80,000 in total IRS liability (2021 TY) but has a monthly disposable income of only $600 and total assets of $5,000. The RCP (Reasonable Collection Potential) is far below the total debt.

**RCP calculation:**
- Income component: $600 × 12 = $7,200
- Quick-sale assets: $5,000 × 0.80 = $4,000
- RCP: $11,200
- Total liability: $80,000
- OIC indicated: $80,000 > $11,200 × 1.10 = $12,320 ✓

## What This Proves

1. `OFFER_IN_COMPROMISE` is selected when `total_liability > rcp × 1.10`
2. `rcp_analysis` block is included in strategy output
3. `recommended_monthly_payment = 0` (negotiated with IRS)
4. `estimated_months_to_payoff = null` (TBD)
5. Strategy `why_this_strategy` and `why_not_others` are OIC-appropriate
6. `REQUIRE_CPA_REVIEW` is implicit (CPA/EA required for Form 656)

## Intentionally Minimal Model

The `model/payment_plan_model.json` fixture is a sparse model containing only the fields PORT2 needs:
- `monthly_capacity.capacity_likely` — for RCP income component
- `intake_summary.total_assets` — for RCP asset component

Liability data comes from `bundle/liability_snapshot.json` (not the model).
Fields like `irs_allowable_expenses`, `csed_analysis`, and `relief_opportunities` are omitted from this fixture to keep it focused on OIC logic testing.

## Key Values

- Total liability: $80,000
- Monthly capacity: $600
- Total assets: $5,000
- RCP: $11,200
- OIC indicated: true
- Strategy type: OFFER_IN_COMPROMISE
