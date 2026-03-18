# TaxPod Tax Knowledge Module

Structured IRS tax reference files for the TaxPod pipeline.

## Directory Structure

```
tax_knowledge/
├── README.md                     # This file
├── rental/                       # Rental property tax rules (IRS Pub 527)
│   ├── rental_property_overview.md
│   ├── deductible_expenses.md
│   ├── depreciation.md
│   ├── passive_activity_rules.md
│   ├── 1031_exchange.md
│   └── schedule_e_guide.md
└── business/                     # Small business / S-corp tax rules
    ├── small_business_overview.md
    ├── qbi_deduction.md
    ├── business_expenses.md
    ├── section_179_bonus_depreciation.md
    └── se_tax_planning.md
```

## Phases

| Phase | Directory | Description |
|-------|-----------|-------------|
| 2B    | rental/   | Rental property rules — income, expenses, depreciation, PAL, 1031 |
| 2C    | business/ | Small business / LucraLab rules — entity types, QBI, expenses, SE tax |

## Sources

- IRS Publication 527 — Residential Rental Property
- IRS Publication 535 — Business Expenses
- IRS Publication 946 — How To Depreciate Property
- IRC Section 162 — Trade or business expenses
- IRC Section 168 — MACRS depreciation
- IRC Section 179 — Election to expense certain property
- IRC Section 199A — Qualified Business Income deduction
- IRC Section 469 — Passive activity loss rules
- IRC Section 1031 — Like-kind exchanges
- IRC Section 1250 — Depreciation recapture
