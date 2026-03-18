# Self-Employment Tax Planning

**Primary IRS References:** Section 1401, Section 1402, Publication 334, Schedule SE, Form 941

---

## Overview

Self-employment (SE) tax is how sole proprietors and partners pay into Social Security and Medicare — the equivalent of the combined employer and employee FICA contributions that W-2 employees and their employers split. Because SE taxpayers pay both halves, the effective rate is higher than most employees realize.

---

## SE Tax Rate — 2025

| Income Level | SE Tax Rate | Tax |
|---|---|---|
| Net SE income up to $176,100 | **15.3%** | 12.4% Social Security + 2.9% Medicare |
| Net SE income above $176,100 | **2.9%** | Medicare only (no SS above wage base) |
| Modified AGI above $200k (single) / $250k (MFJ) | **+0.9%** | Additional Medicare Tax |

### Social Security Wage Base

- 2025: **$176,100** (adjusted annually for inflation)
- 2024: $168,600
- Only earnings up to the wage base are subject to the 12.4% Social Security portion
- The 2.9% Medicare tax applies to ALL net SE income (no cap)

### Net SE Income Calculation

SE tax applies to **92.35%** of net self-employment income (a quirk of the tax code — you reduce net profit by half the SE tax before calculating the SE tax itself).

```
Net SE income = Net profit × 92.35%
SE tax = Net SE income × 15.3% (up to SS wage base)
```

**Example:**
- Schedule C net profit: $100,000
- Net SE income: $100,000 × 92.35% = $92,350
- SE tax: $92,350 × 15.3% = **$14,130**

---

## Above-the-Line SE Tax Deduction

You can deduct **50% of SE tax** as an above-the-line deduction on Form 1040, Schedule 1 (Line 15).

**Example (continued):**
- SE tax: $14,130
- SE tax deduction: $14,130 × 50% = **$7,065**
- This reduces AGI and taxable income (but not SE income in the same year)

---

## S-Corp Strategy for SE Tax Savings

The most effective tool for reducing SE tax is the **S-corporation structure**. See also `small_business_overview.md`.

### How It Works

In an S-corp:
- Owner-employee pays themselves a **W-2 salary** (subject to FICA payroll taxes)
- Additional profits taken as **distributions** (not subject to FICA)
- Total tax savings: FICA on the distribution portion

### Reasonable Compensation Requirement

The IRS requires that S-corp owner-employees receive a **"reasonable salary"** for services performed.

**IRS enforcement:** Unreasonably low salaries are the #1 audit trigger for S-corps. The IRS can reclassify distributions as wages and assess back payroll taxes, penalties, and interest.

**What is "reasonable"?**
- What would you pay a third-party employee to do your same job?
- Consider: industry norms, job duties, hours worked, experience level, geographic market

**Safe salary benchmarks for tech/SaaS principals:**
- Early stage, founder-operator: $60,000–$80,000
- Growth stage, executive-level role: $100,000–$150,000
- Benchmark tool: BLS Occupational Employment Statistics, industry salary surveys

### SE Tax Savings Calculation

**Example:**
- S-corp net profit: $200,000
- Reasonable W-2 salary: $100,000
- Distribution: $100,000

| Item | Sole Prop | S-Corp |
|---|---|---|
| SE/FICA tax base | $200,000 | $100,000 |
| SE/FICA rate | 15.3% | 15.3% |
| SE/FICA tax | ~$30,600 | ~$15,300 |
| **Annual savings** | — | **~$15,300** |

### Break-Even Analysis

S-corp election introduces compliance costs:
- Payroll processing service: ~$500–$2,000/year
- Form 1120-S preparation: ~$1,000–$3,000/year (CPA)
- State registration, annual reports: varies by state

**Break-even rule of thumb:** S-corp generally makes financial sense when **net business profit exceeds $80,000–$100,000/year**.

---

## S-Corp Payroll Compliance Obligations

Electing S-corp status requires ongoing payroll compliance:

| Obligation | Frequency | Form |
|---|---|---|
| Federal income tax withholding + FICA | Per payroll | — |
| Employer quarterly payroll tax return | Quarterly | **Form 941** |
| Annual federal unemployment tax | Annual | **Form 940** |
| W-2 to employees | January 31 | **Form W-2** |
| W-3 transmittal to SSA | January 31 | **Form W-3** |
| State withholding and unemployment | Varies by state | State forms |

**Quarterly deposit schedule:**
- If total quarterly tax liability < $2,500: pay with Form 941
- If ≥ $2,500: deposit semi-weekly or monthly depending on lookback period

---

## Health Insurance Deduction — S-Corp Owners

S-corp owner-employees (>2% shareholders) receive favorable health insurance treatment:

- The S-corp pays or reimburses health insurance premiums
- The premium is included in the owner's W-2 wages (Box 1, not Box 3/5)
- The owner deducts 100% of the premium as a **self-employed health insurance deduction** (Schedule 1, Line 17) — above-the-line
- Net result: premiums are effectively pre-income-tax (but not pre-FICA)

> **Sole proprietors** also get the 100% health insurance deduction (same Schedule 1, Line 17) — no S-corp required for this deduction.

---

## Retirement Contributions — SE Tax Reduction Strategies

Retirement plan contributions reduce AGI and income tax, though not SE tax itself. They are a critical part of overall tax planning.

### SEP-IRA (Simplified Employee Pension)

- Contribution limit: up to **25% of net self-employment income** (sole prop) or 25% of W-2 salary (S-corp)
- 2024 maximum: $69,000
- Simple setup, no annual filing requirements
- Contributions deductible above-the-line

### Solo 401(k) (Individual 401k)

Available to self-employed individuals with no full-time employees (other than a spouse).

| Component | Limit (2024) |
|---|---|
| Employee elective deferral | $23,000 ($30,500 if age 50+) |
| Employer profit-sharing | 25% of compensation |
| Total combined limit | $69,000 ($76,500 if age 50+) |

**Advantage over SEP-IRA:** The employee deferral component allows much higher contributions at lower income levels.

**Example:**
- S-corp W-2 salary: $60,000
- Solo 401(k) employee deferral: $23,000
- Employer profit-sharing: 25% × $60,000 = $15,000
- Total contribution: **$38,000** (vs. SEP-IRA max of $15,000 at this salary)

### SIMPLE IRA

- Employee deferral limit: $16,000 (2024; $19,500 if age 50+)
- Employer must match up to 3% of compensation
- Requires at least 2 years of operation before modifying

---

## Additional Medicare Tax — High-Income Planning

For high earners, an additional **0.9% Medicare tax** applies:

| Filing Status | Threshold |
|---|---|
| Single / Head of Household | $200,000 |
| Married Filing Jointly | $250,000 |
| Married Filing Separately | $125,000 |

Applies to:
- W-2 wages above the threshold
- Net SE income above the threshold
- Combined W-2 + SE income above the threshold

The additional 0.9% is not split with the employer — it is entirely the employee/self-employed person's burden.

---

## Net Investment Income Tax (NIIT) — 3.8%

The **3.8% NIIT** applies to the lesser of:
- Net investment income, OR
- The amount by which MAGI exceeds the same thresholds as Additional Medicare Tax

SE income and active business income are generally NOT subject to NIIT. But S-corp distributions **may** be subject to NIIT if the shareholder does not materially participate.

---

## Key IRS References

- **Section 1401** — Rate of tax (SE tax rates)
- **Section 1402** — Definitions (net earnings from self-employment)
- **Section 3111** — Employer FICA obligations
- **Publication 334** — Tax Guide for Small Business
- **Publication 15** — Employer's Tax Guide (payroll)
- **Schedule SE (Form 1040)** — Self-Employment Tax
- **Form 941** — Employer's Quarterly Federal Tax Return
- **Form 940** — Employer's Annual Federal Unemployment (FUTA) Tax Return
