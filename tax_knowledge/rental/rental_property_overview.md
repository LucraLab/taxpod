# Rental Property Overview

**Primary IRS Reference:** Publication 527 (Residential Rental Property), Section 280A

---

## What Counts as Rental Income

All payments received for the use of property are rental income, including:

- **Rent payments** — regular monthly or periodic payments
- **Advance rent** — any amount received before the period it covers (taxable in year received, not the period covered)
- **Security deposits kept** — if you keep all or part of a security deposit because a tenant damaged the property or broke the lease, it is rental income in the year you keep it
- **Payments for canceling a lease** — if a tenant pays to break a lease early, that payment is rental income
- **Expenses paid by the tenant** — if a tenant pays your expenses (e.g., utility bills) instead of paying rent, include those amounts as rental income (you may deduct the expense separately)
- **Services received in lieu of rent** — if a tenant performs services instead of paying rent, include the fair market value of those services as rental income
- **Property or goods received** — fair market value of property received instead of rent is rental income

---

## What Is NOT Rental Income

- **Security deposits returned** — if you return the full deposit at the end of the tenancy, it is never income (it is a liability while you hold it)
- **Security deposits held in a separate trust account** — not income until you have an unrestricted right to use it
- **Refundable deposits** — not income until conditions for forfeiture occur

---

## Rental Days vs. Personal Use Days — The 14-Day / 10% Rule

### Counting Rental Days

A day counts as a **rental day** when the property is rented at fair market rental price. A day counts as **personal use** when:

- You or a family member uses it (spouse, siblings, parents, grandparents, children, grandchildren)
- You rent it to anyone at below-market rates
- Anyone uses it under a time-share or reciprocal arrangement

> **Note:** Days spent doing repairs and maintenance (working substantially full-time) do NOT count as personal use days.

### The 14-Day / 10% Test (Section 280A)

| Personal Use | Property Classification |
|---|---|
| ≤ 14 days AND ≤ 10% of rental days | **Pure rental / investment property** — all rental expenses fully deductible |
| > 14 days OR > 10% of rental days | **Mixed-use / vacation home** — expenses must be allocated |

**Example:**
- Property rented 200 days → 10% = 20 days
- If personal use = 15 days → exceeds 14-day threshold → mixed use
- If personal use = 10 days → does not exceed either threshold → pure rental

### Pure Rental Property (Personal Use ≤ 14 Days)

- All ordinary and necessary rental expenses are **fully deductible** on Schedule E
- Losses may be limited by passive activity loss rules (see `passive_activity_rules.md`)
- No allocation required

### Mixed-Use Property (Personal Use > 14 Days or > 10% of Rental Days)

- Expenses must be **allocated** between rental and personal portions
- Allocation ratio: Rental Days ÷ Total Days Used (rental + personal)
- **Deduction ordering rules apply:**
  1. Mortgage interest and property taxes — deductible in full (personal portion on Schedule A)
  2. Other rental expenses — deductible only to the extent of rental income after step 1
  3. Depreciation — last; cannot create a rental loss on a mixed-use property
- Net rental income cannot be negative for a vacation home (losses are suspended)

**Example:**
- 180 rental days, 30 personal use days → total 210 days
- Rental allocation: 180 ÷ 210 = 85.7%
- 85.7% of operating expenses are deductible on Schedule E

---

## Vacation Home Rules — Section 280A

Section 280A applies specifically to dwelling units used personally for more than the greater of:
- 14 days, OR
- 10% of the number of days the unit was rented at a fair rental price

**Key Consequences of Vacation Home Status:**

1. **No rental loss deduction** — deductions are capped at gross rental income
2. **Expenses deducted in a specific order** (see allocation rules above)
3. **Disallowed losses do not carry forward** (unlike passive activity losses from pure rentals)
4. **IRS scrutiny** — vacation homes with personal use trigger Schedule E audit flags

**Special rule — Minimal rental (14 days or fewer):**
If you rent the property for **14 days or fewer** in the year, rental income is entirely **tax-free** (not reported), and no rental expenses are deductible. This is sometimes called the "Augusta Rule" or "Masters Rule."

---

## Key IRS References

- **Publication 527** — Residential Rental Property (full guidance)
- **Section 280A** — Disallowance of certain expenses in connection with business use of home, rental of vacation homes
- **Schedule E (Form 1040)** — Supplemental Income and Loss
