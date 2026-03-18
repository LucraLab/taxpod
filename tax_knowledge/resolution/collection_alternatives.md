# IRS Collection Alternatives: Complete Reference

> **Scope:** All IRS collection resolution options — eligibility, mechanics, costs, pros/cons  
> **Last Reviewed:** 2025 (Q1 2026 rates)  
> **Related:** `csed_deep_dive.md`, `penalty_abatement_guide.md`, `pub_594_collection_process.md`

---

## Overview

When a taxpayer cannot pay their full tax liability, the IRS offers several resolution pathways. Choosing the right one depends on:
- Total amount owed
- Taxpayer's income and expenses
- Asset equity
- Time remaining on the CSED
- Compliance history

---

## 1. Installment Agreement (IA)

An installment agreement allows the taxpayer to pay the debt over time in monthly payments.

### Types of Installment Agreements

#### A. Guaranteed Installment Agreement
| Criteria | Details |
|----------|---------|
| Balance due | ≤ **$10,000** |
| Payoff period | ≤ **3 years (36 months)** |
| Approval | Auto-approved — IRS cannot deny if criteria met |
| Financial docs | **Not required** |
| Prior IAs | Must not have had an IA in prior 5 years |
| Filing status | All required returns must be filed |

#### B. Streamlined Installment Agreement
| Criteria | Details |
|----------|---------|
| Balance due | **$10,001 – $50,000** (individuals); $25,001–$50,000 (businesses) |
| Payoff period | ≤ **72 months** |
| Approval | Streamlined — no financial review required |
| Financial docs | **Not required** |
| NFTL (lien) | IRS may or may not file; generally doesn't for lower balances |

#### C. Non-Streamlined (Financial Disclosure Required)
| Criteria | Details |
|----------|---------|
| Balance due | **> $50,000** or payoff > 72 months |
| Financial docs | **Form 433-A** (individuals) or **Form 433-B** (businesses) |
| Approval | Based on ability to pay per Collection Financial Standards |
| NFTL | Likely to be filed |

### Online Payment Agreement (OPA)
- Available at **irs.gov/OPA**
- Can set up Guaranteed or Streamlined IAs online
- Direct debit option available
- No need to call IRS for qualifying balances

### User Fees (Setup Costs)

| Method | Fee |
|--------|-----|
| Online, Direct Debit (DDIA) | **$31** |
| Online, other payment method | **$107** |
| Non-online (phone/mail/in-person) | **$225** |
| Low-income applicants (≤ 250% poverty) | **$43** (or waived with DDIA) |

> Low-income fee may be reimbursed if IA is completed successfully.

### Costs While on an IA

- **Interest:** Federal short-term rate + 3% (currently **~7% annually** as of Q1 2026), compounded daily
- **Failure-to-Pay (FTP) penalty:** Reduced to **0.25%/month** (from 0.5%) while an installment agreement is in effect
- **FTP maximum:** Still accumulates up to 25% of unpaid tax
- Interest and penalties continue to accrue until the balance is paid in full

### CSED Considerations ⚠️
- An installment agreement **tolls (pauses) the CSED** while the agreement is pending + 30 days after termination/rejection
- > See `csed_deep_dive.md` — if CSED < 3 years, consider whether an IA is strategically optimal

### Pros and Cons
| Pros | Cons |
|------|------|
| Easy to qualify | Interest and penalties keep accruing |
| No upfront lump sum | CSED is tolled (extends IRS window) |
| Stops levies | Does not reduce the principal owed |
| Predictable monthly payment | May require lien filing for >$10K |

---

## 2. Offer in Compromise (OIC)

An OIC allows taxpayers to settle their tax debt for less than the full amount owed if they cannot pay the full liability or it would be inequitable to do so.

### Three Grounds for OIC

| Ground | Description | Frequency |
|--------|-------------|-----------|
| **Doubt as to Liability (DATL)** | Genuine dispute about whether the tax is legally owed | Uncommon |
| **Doubt as to Collectibility (DATC)** | Total liability exceeds Reasonable Collection Potential (RCP) | **Most common** |
| **Effective Tax Administration (ETA)** | Tax is correct and collectible, but collection would cause economic hardship or be unfair | Rare |

### Doubt as to Collectibility — The Core Formula

**The IRS accepts an OIC when:** `Offer Amount ≥ Reasonable Collection Potential (RCP)`

#### RCP Formula
```
RCP = (Monthly Disposable Income × Collection Months) + (Net Realizable Value of Assets × 0.80)
```

**Collection months:**
- Lump sum offer: **12 months** (cash offer, paid in ≤ 5 installments)
- Periodic payment offer: **24 months** (paid monthly during IRS review)

**Monthly Disposable Income:**
- Gross monthly income
- Minus: IRS-allowed expenses (Collection Financial Standards for housing, food, transportation, etc.)
- Minus: Allowable secured debt payments

**Net Realizable Value (NRV) of Assets:**
- Quick-sale value (typically 80% of fair market value)
- Includes: home equity, vehicle equity, bank balances, retirement account balances (at 70% for early withdrawal tax/penalty)

#### Example RCP Calculation
```
Monthly disposable income:    $500
Collection months (lump):     × 12
                              = $6,000

Home equity (NRV):            $20,000 × 0.80 = $16,000
Bank accounts:                $5,000 × 1.00  = $5,000

RCP = $6,000 + $16,000 + $5,000 = $27,000

If total tax liability = $80,000 → OIC could settle for ~$27,000
```

### OIC Payment Options

| Option | Terms | Down Payment |
|--------|-------|--------------|
| **Lump Sum Cash** | Full offer paid in ≤ 5 installments within 5 months of acceptance | **20% of offer with application** |
| **Periodic Payment** | Monthly payments during review + after acceptance | First month's payment with application |

> Lump sum 20% down is **non-refundable** unless the offer is returned as non-processable.

### Application Requirements
- **Form 656** — Offer in Compromise (cover page)
- **Form 433-A (OIC)** — Individual financial statement (more detailed than standard 433-A)
- **Form 433-B (OIC)** — Business financial statement (if applicable)
- **Application fee:** **$205** (as of 2025; waived for low-income applicants ≤ 250% poverty)
- Supporting financial documentation

### Key Facts
- **IRS acceptance rate:** Approximately **35–40%** of submitted offers historically
- **Processing time:** 12–24 months typical
- **During review:** IRS cannot levy (stays collection action)
- **Compliance requirement:** Taxpayer must stay current on all filings and payments for **5 years** after acceptance
- **CSED tolling:** OIC tolls the CSED while pending + 30 days + any Appeals period

### Pros and Cons
| Pros | Cons |
|------|------|
| Can dramatically reduce total debt | Long processing time (12–24 months) |
| Settles interest and penalties too | 20% down required (lump sum) |
| Stops levies during review | Significant financial disclosure required |
| Fresh start on compliance | Tolls CSED (extends IRS window) |
| 5-year compliance window gives fresh start | Rejection delays resolution |

### OIC vs. Installment Agreement Decision Guide
- If RCP < total liability → **OIC is worth exploring**
- If CSED < 2 years → **CNC may be better than OIC** (let clock run)
- If RCP ≈ total liability → **Streamlined IA may be simpler**
- If client has significant assets → **OIC may not reduce balance much**

---

## 3. Currently Not Collectible (CNC)

CNC status places the taxpayer's account in a "hardship" hold. The IRS suspends active collection but does NOT forgive the debt.

### When CNC Applies
- Taxpayer's **gross monthly income** is at or below IRS-allowed expenses
- Paying the tax debt would prevent the taxpayer from meeting basic living expenses
- Verified using **IRS Collection Financial Standards** (national and local standards for housing, food, transportation, health)

### How to Request CNC
1. **Call IRS at 1-800-829-1040** and explain the hardship
2. Submit **Form 433-F** — Collection Information Statement (simplified version)
3. IRS may also request Form 433-A for more detail
4. Revenue Officer may conduct a field visit for complex cases

### What CNC Does
| Effect | Details |
|--------|---------|
| Active collection suspended | No new levies; no new liens initiated |
| Existing liens | **Not released** — remain in place |
| CSED | **Continues to run** ← critical strategy consideration |
| Notices | IRS may still send annual balance due notices |
| Duration | Indefinite, subject to annual review |

### Annual Review Process
- IRS checks the taxpayer's income annually using tax return filings
- If income increases significantly, IRS may remove CNC status and resume collection
- Taxpayer is notified before CNC is removed

### Strategy: CNC + CSED Expiration
> **Key insight:** Because the CSED keeps running during CNC, taxpayers close to their CSED expiration may benefit more from CNC than from OIC or IA (which toll the CSED).

**Example:** Taxpayer owes $50,000. CSED expires in 18 months. If they qualify for CNC, the debt could legally expire without paying anything — compared to an OIC that would toll the clock and require a settlement payment.

### Best Candidates for CNC
- Temporary hardship (job loss, medical crisis, divorce)
- Fixed income (Social Security, disability) that barely covers living expenses
- **CSED within 2–3 years** — may be best strategy
- No significant assets

### Pros and Cons
| Pros | Cons |
|------|------|
| Immediate relief — no monthly payments | Debt still accrues interest and penalties |
| No upfront payment required | Existing liens remain |
| CSED keeps running (strategic) | Can be removed if income rises |
| Preserves options for later resolution | IRS may file NFTL before granting CNC |
| No financial documentation complexity | No debt reduction — just deferral |

---

## 4. Penalty Abatement

Penalty abatement reduces or eliminates penalties assessed on the tax debt. It does not reduce the principal tax owed or interest.

> **See full guide:** `tax_knowledge/resolution/penalty_abatement_guide.md`

### First Time Abatement (FTA)
- **Eligibility:** 3 years of clean penalty compliance prior to the year in question
- **Applies to:** Failure to File (FTF), Failure to Pay (FTP), Failure to Deposit (FTD)
- **Approval rate:** ~75% when properly requested
- **How to request:** Call 1-800-829-1040 or write to IRS in response to a notice

### Reasonable Cause Abatement
- Based on facts and circumstances beyond the taxpayer's control
- Examples: serious illness, death in family, natural disaster, reliance on tax advisor
- Requires documentation

### Statutory Exception
- Based on written advice received from IRS that the taxpayer relied on in good faith
- Rare but powerful when applicable

### Penalty Impact
| Penalty Type | Rate | Maximum |
|-------------|------|---------|
| Failure to File (FTF) | 5%/month of unpaid tax | 25% of unpaid tax |
| Failure to Pay (FTP) | 0.5%/month of unpaid tax | 25% of unpaid tax |
| Combined FTF + FTP | 5%/month combined | 47.5% total (FTF 22.5% + FTP 25%) |

**On a $10,000 tax debt held for 12 months:**
- FTP penalty alone: $600 (6% = 12 × 0.5%)
- FTF penalty (if late filing): $2,500 (25% cap reached at 5 months)

> **Always request FTA first** — it's free, fast, and approved ~75% of the time.

---

## 5. Innocent Spouse Relief

For joint filers where one spouse disputes responsibility for taxes attributable to the other spouse.

> **TaxPod Status:** OUT OF SCOPE — awareness only  
> **See:** `tax_knowledge/publications/pub_971_innocent_spouse.md` for full detail  
> **Form:** 8857 — Request for Innocent Spouse Relief

---

## 6. Bankruptcy Considerations

Bankruptcy can discharge certain federal income tax debts but is complex and has significant consequences.

> **TaxPod Status:** NOT part of the pipeline — refer to bankruptcy attorney

### Chapter 7 Bankruptcy — Tax Discharge Rules

For income taxes to be dischargeable in Chapter 7, **ALL** of the following must be true:

| Rule | Requirement |
|------|-------------|
| **3-Year Rule** | Tax return due date (including extensions) is more than **3 years** before bankruptcy filing |
| **2-Year Rule** | Tax return was actually filed more than **2 years** before bankruptcy filing |
| **240-Day Rule** | Tax was assessed by IRS more than **240 days** before bankruptcy filing |
| **No Fraud** | No fraudulent return or willful tax evasion |
| **No Substitutes** | IRS did not file a Substitute for Return (SFR) — or if they did, taxpayer subsequently filed their own return |

**All rules must be met simultaneously.** If even one fails, the tax is non-dischargeable.

### Chapter 13 Bankruptcy
- Tax debt is treated as a **priority unsecured claim** — must be paid in full through the 3-5 year plan
- Does NOT discharge tax debt in most cases
- Does provide an organized repayment structure with automatic stay
- IRS is bound by the plan

### Bankruptcy and CSED
- Filing for bankruptcy **tolls the CSED** for the entire bankruptcy period **plus 6 months** after discharge/dismissal
- This is a major consideration — bankruptcy may extend the IRS's collection window significantly

### When Clients Mention Bankruptcy
1. Document the inquiry
2. Do not advise on bankruptcy (outside our scope)
3. Refer to a bankruptcy attorney
4. Note the potential CSED impact if they do file

---

## Comparison Matrix

| Alternative | Best For | Reduces Debt? | CSED Impact | Time to Resolve |
|-------------|----------|--------------|-------------|-----------------|
| Guaranteed IA | ≤$10K, can pay | No | Tolls | 1–36 months |
| Streamlined IA | $10K–$50K, steady income | No | Tolls | 1–72 months |
| Non-Streamlined IA | >$50K or complex | No | Tolls | Ongoing |
| OIC | Debt > ability to pay | **Yes** | Tolls | 12–24 months |
| CNC | True hardship, near CSED | No (defers) | Runs! | Until income changes |
| Penalty Abatement | Clean 3-yr history | Penalties only | None | Weeks |
| Innocent Spouse | Joint liability dispute | Yes (your share) | N/A | 6–12 months |
| Bankruptcy | Multi-debt crisis | Sometimes | Tolls +6mo | 3–5 years |

---

*Verify all fees and thresholds at irs.gov — figures current as of Q1 2026. Tax law changes frequently.*
