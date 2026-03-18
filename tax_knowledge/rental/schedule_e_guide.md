# Schedule E — Supplemental Income and Loss (Rental Property)

**Primary IRS Reference:** Schedule E (Form 1040), Form 4562, Publication 527

---

## Overview

**Schedule E, Part I** reports rental real estate income and expenses. It is filed as an attachment to Form 1040.

- One row (or one column) per rental property, up to 3 properties per Schedule E
- Additional properties require additional Schedule E forms
- Net income or loss flows to **Form 1040, Schedule 1, Line 5**

---

## Part I — Rental Real Estate and Royalties

### Property Information (Top of Schedule E)

For each property, you must provide:
- **Physical address** — street, city, state, ZIP
- **Type of property** — single family, multi-family, vacation home, commercial, etc.
- **Rental days** — number of days rented at fair market price
- **Personal use days** — number of days used personally (critical for vacation homes — see `rental_property_overview.md`)
- **QJV checkbox** — if you and your spouse are both owners and elect Qualified Joint Venture treatment

---

## Income Lines

| Line | Description |
|---|---|
| 3 | **Rents received** — total gross rent collected during the year |

Include all rental income: advance rent, lease cancellation payments, expenses paid by tenant.

---

## Expense Lines (Lines 5–19)

| Line | Expense Category |
|---|---|
| 5 | Advertising |
| 6 | Auto and travel |
| 7 | Cleaning and maintenance |
| 8 | Commissions |
| 9 | Insurance |
| 10 | Legal and professional fees |
| 11 | Management fees |
| 12 | Mortgage interest paid to banks (from Form 1098) |
| 13 | Other interest |
| 14 | Repairs |
| 15 | Supplies |
| 16 | Taxes (property taxes) |
| 17 | Utilities |
| 18 | Depreciation expense or depletion (from Form 4562) |
| 19 | Other (itemize) |

> **Line 18 — Depreciation:** Do NOT enter depreciation directly. It must be calculated and reported on **Form 4562** first, then the total flows to Line 18 of Schedule E.

---

## Form 4562 — Required for Depreciation

**Form 4562 (Depreciation and Amortization)** must be filed whenever you:
- Place new property in service (first year of depreciation)
- Claim Section 179 expensing
- Claim bonus depreciation under Section 168(k)

**If no new property placed in service**, you may use the depreciation from a prior-year Form 4562 without refiling (the IRS permits continuing depreciation without a new Form 4562 for established properties, though tax software typically generates it automatically).

**Key sections of Form 4562:**
- **Part I:** Section 179 election
- **Part II:** Bonus depreciation (Section 168(k))
- **Part III:** MACRS depreciation for property placed in service current year
- **Part IV:** Summary
- **Part V:** Listed property (vehicles, computers — requires business use % documentation)

---

## Calculating Net Income or Loss

```
Gross Rent Received
− Total Deductible Expenses (Lines 5–19)
= Net Rental Income (Loss)
```

**If Net Income (positive):** Subject to income tax; flows to Schedule 1, Line 5.
- Note: Rental income is generally **NOT** subject to self-employment tax.
- May be subject to **Net Investment Income Tax (NIIT)** at 3.8% if total investment income exceeds thresholds ($200k single / $250k MFJ).

**If Net Loss (negative):** Subject to passive activity loss limitations:
- If AGI ≤ $100,000 and actively participate → up to $25,000 deductible
- If AGI > $100,000 → phase-out applies (see `passive_activity_rules.md`)
- Suspended losses carry forward on Form 8582

---

## Multiple Properties

- Columns A, B, C on a single Schedule E (up to 3 properties)
- **Column D** (Line 23): Total income across all properties
- **Column E** (Line 24): Total losses across all properties
- If more than 3 properties: use additional Schedule E forms, combine totals on first page

---

## Loss Limitation — Schedule E and Form 8582

Schedule E losses are limited by:

1. **Passive Activity Loss Rules (Section 469)** — Form 8582 calculates the allowable loss
2. **At-Risk Rules (Section 465)** — Losses limited to amounts "at risk" in the activity (rarely a practical limit for direct real estate ownership)

The net allowable loss (after PAL limitations) flows to Schedule 1, Line 5.

---

## Common Mistakes to Avoid

| Mistake | Correct Approach |
|---|---|
| Entering depreciation directly on Line 18 without Form 4562 | Always use Form 4562 for depreciation |
| Deducting mortgage principal payments | Only interest is deductible |
| Deducting full security deposit received | Only non-refundable deposits are income |
| Failing to allocate expenses for vacation home | Must allocate rental vs. personal portion |
| Depreciating the land value | Only the building/structure is depreciable |
| Failing to report rental income in years of small losses | All rental income must be reported |
| Deducting capital improvements as repairs | Improvements must be capitalized and depreciated |

---

## Where Schedule E Flows on Form 1040

```
Schedule E, Part I (Rental) → net income/loss
  → Form 1040, Schedule 1, Line 5 (Rental real estate...)
  → Form 1040, Schedule 1, Part II, Line 10 (Total other income/adjustments)
  → Form 1040, Line 8 (Additional income and adjustments)
```

Net Investment Income from rentals may also flow to **Form 8960** (NIIT calculation).

---

## Key IRS References

- **Schedule E (Form 1040)** — Supplemental Income and Loss
- **Form 4562** — Depreciation and Amortization
- **Form 8582** — Passive Activity Loss Limitations
- **Form 8960** — Net Investment Income Tax
- **Publication 527** — Residential Rental Property
- **Section 469** — Passive activity loss rules
