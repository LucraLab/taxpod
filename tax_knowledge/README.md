# TaxPod Knowledge Module

> **Version:** Phase 2A + 2B + 2C + 2D + 3A  
> **Purpose:** Structured IRS reference documentation for the TaxPod resolution pipeline  
> **Scope:** Federal tax collection, resolution alternatives, taxpayer rights, rental property, small business

---

## What This Is

The `tax_knowledge/` directory is a structured reference library. It contains:

- **Accurate, scannable summaries** of key IRS publications
- **Deep-dive resolution guides** covering all IRS collection alternatives
- **Rental property rules** — depreciation, passive activity, Schedule E, 1031 exchanges
- **Small business rules** — QBI, S-corp, Section 179, SE tax strategy
- **Strategy frameworks** (CSED analysis, penalty abatement scripts, OIC calculation)
- **Live rate data** — current IRS fees and interest rates

These are **reference documents**, not pipeline code.

---

## Directory Structure

```
tax_knowledge/
├── README.md                          ← You are here
│
├── publications/                      ← IRS Publication Summaries
│   ├── pub_1_taxpayer_rights.md       ← Taxpayer Bill of Rights (10 rights)
│   ├── pub_594_collection_process.md  ← Collection timeline, liens, levies
│   └── pub_971_innocent_spouse.md     ← Innocent spouse relief (awareness only)
│
├── resolution/                        ← IRS Debt Resolution Deep Dives
│   ├── collection_alternatives.md     ← All 6 resolution pathways (full detail)
│   ├── csed_deep_dive.md              ← CSED strategy by time horizon
│   └── penalty_abatement_guide.md    ← FTA eligibility, calculation, call script
│
├── rental/                            ← Rental Property Tax Rules (Pub 527)
│   ├── rental_property_overview.md   ← Income rules, 14-day rule, vacation homes
│   ├── deductible_expenses.md        ← All deductible expenses + repairs vs improvements
│   ├── depreciation.md               ← 27.5-year depreciation, bonus, Section 179
│   ├── passive_activity_rules.md     ← PAL rules, $25k exception, real estate pro
│   ├── 1031_exchange.md              ← Like-kind exchange rules and strategy
│   └── schedule_e_guide.md          ← How to complete Schedule E
│
└── business/                          ← Small Business / LucraLab Rules
    ├── small_business_overview.md    ← Entity types, S-corp vs LLC vs sole prop
    ├── qbi_deduction.md              ← Section 199A, 20% deduction, phase-outs
    ├── business_expenses.md          ← Section 162, all deductible categories
    ├── section_179_bonus_depreciation.md ← Equipment write-offs, MACRS
    └── se_tax_planning.md            ← SE tax rates, S-corp strategy, SEP-IRA
```

---

## How to Use

### For IRS Resolution Cases
1. **Start with `collection_alternatives.md`** — all viable resolution paths
2. **Always run CSED check** — `csed_deep_dive.md` — time horizon changes everything
3. **Check FTA first** — `penalty_abatement_guide.md` — low effort, high reward
4. **Taxpayer rights questions** — `pub_1_taxpayer_rights.md`

### For Rental Property Questions
1. `rental_property_overview.md` — income classification, 14-day rule
2. `passive_activity_rules.md` — critical for loss deductibility ($25k exception)
3. `depreciation.md` — biggest deduction, depreciation recapture at sale
4. `1031_exchange.md` — capital gains deferral strategy

### For LucraLab / Business Tax
1. `small_business_overview.md` — entity type determines tax treatment
2. `se_tax_planning.md` — S-corp strategy, SE tax savings calculation
3. `qbi_deduction.md` — 20% pass-through deduction eligibility
4. `business_expenses.md` — what's deductible and how

---

## Live Rate Data

Current IRS rates stored in `ops/data/irs_current_rates.json`. Run **quarterly**:

```bash
bash ops/scripts/run_fetch_irs_rates.sh
```

Includes: underpayment interest rate, OIC application fee, IA setup fees, Collection Standards effective dates.

---

## What's NOT Covered

- State taxes (CA FTB, WA DOR, NC, etc.)
- Court decisions and evolving case law
- Payroll trust fund recovery (§6672 TFRP)
- Foreign accounts (FBAR/FATCA)
- Criminal tax matters
- Bankruptcy law (referenced in collection_alternatives.md only)
- Estate and gift taxes

---

## Sources

- IRS Pub 1 (Taxpayer Rights), Pub 527 (Rental), Pub 535 (Business Expenses), Pub 594 (Collection), Pub 971 (Innocent Spouse), Pub 946 (Depreciation)
- IRC §162, §168, §179, §199A, §469, §1031, §1250
- IRS Collection Financial Standards (April 2025)

---

## Document Update Cadence

| Document | Update Trigger |
|----------|----------------|
| `collection_alternatives.md` | Fee changes, threshold changes — quarterly |
| `csed_deep_dive.md` | Law changes — as needed |
| `penalty_abatement_guide.md` | Policy changes — as needed |
| `depreciation.md` | Bonus depreciation % changes annually |
| `qbi_deduction.md` | Income threshold inflation adjustments — annually |
| `se_tax_planning.md` | SS wage base changes annually |
| `ops/data/irs_current_rates.json` | **Quarterly** — run fetch script |

---

*TaxPod — IRS debt resolution pipeline. Content is for informational purposes and should be verified against current IRS guidance before use in formal documents.*
