# CSED Deep Dive: Collection Statute Expiration Date

> **Legal Authority:** IRC §6502  
> **What it is:** The 10-year deadline after which the IRS loses its authority to collect a tax debt  
> **Why it matters:** Strategy changes dramatically based on time remaining on the CSED  
> **Last Reviewed:** 2025

---

## What Is the CSED?

The **Collection Statute Expiration Date (CSED)** is the date on which the IRS's legal authority to collect a specific tax assessment expires. After this date, the IRS:
- **Cannot** levy wages, bank accounts, or property
- **Cannot** initiate new liens
- **Cannot** sue to collect
- Must release any existing lien within 30 days

The debt is **legally uncollectible** after the CSED — even if the full amount was never paid.

**Statutory basis:** IRC §6502 — "Where the assessment of any tax imposed by this title has been made within the period of limitation properly applicable thereto, such tax may be collected by levy or by a proceeding in court, but only if the levy is made or the proceeding begun within **10 years** after the assessment of the tax."

---

## What Triggers the 10-Year Clock

The CSED clock starts on the **assessment date** — the date the IRS formally records the tax liability in their system.

### Common Assessment Dates

| Situation | Assessment Date |
|-----------|----------------|
| **Filed return, tax owed** | The later of: return due date (April 15) or actual filing date |
| **Late-filed return** | Date the return is actually filed |
| **Amended return (1040-X)** | Date the amended return is processed |
| **Audit adjustment** | Date the examination adjustment is assessed (after audit closes) |
| **Substitute for Return (SFR)** | Date IRS files the SFR and assesses the tax |
| **Civil fraud penalty** | Date the penalty is assessed |
| **Additional assessment** | Date of the additional assessment (separate CSED per module) |

> **Key insight:** A taxpayer can have **multiple CSEDs** for different tax years. Each year's assessment is tracked separately.

### How to Find Your CSED

1. **IRS Account Transcript** — Request online at irs.gov/transcript or call 1-800-829-1040
   - Look for the "Assessment Date" field for each tax module
   - CSED = Assessment Date + 10 years
2. **IRS Transcript Delivery System** — Available to practitioners via e-Services
3. **IRS CAF (Central Authorization File)** — With Form 2848 on file, practitioners can request transcripts directly

**Transcript line to look for:** `ASSESSMENT DATE: MM-DD-YYYY`  
**CSED = that date + 10 years exactly**

> ⚠️ **Always verify the CSED from an actual IRS transcript.** Do not rely on client recollections of when they filed.

---

## Tolling Events — What EXTENDS the CSED

Certain events **toll (pause)** the CSED clock. During these periods, the 10-year clock stops running. When the event ends, the clock resumes from where it paused — but additional time is added to account for the tolling.

### Complete Tolling Event Reference

| Event | Tolling Period | Notes |
|-------|---------------|-------|
| **Installment Agreement (IA)** | While IA is pending + 30 days after rejection/termination | Includes time between IA request and IRS decision |
| **Offer in Compromise (OIC)** | While offer is pending + 30 days + any Appeals period | Includes processing + IRS review time |
| **Bankruptcy** | Entire bankruptcy period + **6 months** | Auto-tolled by the automatic stay |
| **CDP Hearing** | Duration of CDP hearing + any Tax Court review | Filing Form 12153 starts tolling |
| **Taxpayer Assistance Order (TAS)** | While TAO is in effect | Less common but applies |
| **Military Service (overseas)** | While on active duty outside the US | IRC §7508 applies |
| **Taxpayer Outside US > 6 months** | Duration of continuous absence | Rare; applies to extended expatriates |
| **Wrongful levy suit** | Duration of litigation | Triggered by third-party wrongful levy claims |
| **Innocent Spouse request (Form 8857)** | While request is pending + 60 days | Applies to requesting spouse's liability |

### Tolling Formula
```
Adjusted CSED = Original CSED + Total Tolling Days
```

**Example:**
- Original assessment: January 1, 2015 → CSED = January 1, 2025
- OIC submitted January 1, 2022, rejected January 1, 2023 (365 days pending) + 30 days
- Total tolling: 395 days
- Adjusted CSED = January 1, 2025 + 395 days ≈ February 1, 2026

---

## Strategic Implications by CSED Horizon

The time remaining on the CSED is one of the **most important factors** in choosing a resolution strategy.

### If CSED < 2 Years Remaining

> **Strategy: CNC (Currently Not Collectible)**

- Entering an OIC would toll the CSED by 12–24+ months, costing the taxpayer a settlement payment AND extending the IRS's collection window
- Entering an IA would toll the CSED while the agreement is active
- **Best move:** Request CNC status, let the CSED run out, debt expires
- If the taxpayer truly qualifies for hardship, this is often the optimal outcome

**Caution:** IRS may file a tax lien before granting CNC — lien remains after CSED but cannot be enforced for new levies

---

### If CSED < 3 Years Remaining

> **Strategy: Avoid IA if possible; consider CNC or OIC carefully**

- An IA tolls the CSED while active — a 36-month IA could extend the IRS window by 36+ months
- If the client cannot qualify for CNC but needs protection from levy, a short-term partial payment plan may be necessary
- OIC is worth exploring if RCP is significantly less than total liability — but weigh the tolling cost
- If OIC processing takes 18 months, that eats into the CSED gap in exchange for a settlement

**Decision framework:**
```
CNC achievable? → CNC and wait
CNC not achievable, RCP << liability? → OIC (accept tolling, still saves money)
CNC not achievable, RCP ≈ liability? → Consider short IA, or appeal
```

---

### If CSED < 5 Years Remaining

> **Strategy: OIC is still worth considering**

- With 5+ years remaining, there's enough time to run an OIC without giving up too much CSED runway
- A 24-month OIC + 30 days tolling leaves ~30 months of CSED remaining — still meaningful leverage
- If the client qualifies for a significant reduction (say, $80K → $15K), the economic benefit of OIC likely outweighs the CSED tolling cost

---

### If CSED > 5 Years Remaining

> **Strategy: Standard installment agreement is usually fine**

- With 5+ years on the clock, IA tolling is less of a concern
- Focus shifts to: choosing the right IA tier, minimizing accruing interest, and achieving compliance
- OIC still worth evaluating if RCP < total liability
- CNC is an option but less strategic since CSED is far out

---

## CSED Decision Matrix

| CSED Remaining | Recommended Strategy | Avoid |
|----------------|---------------------|-------|
| < 2 years | CNC — let clock run | OIC, IA |
| 2–3 years | CNC preferred; short-term IA if forced | Long-term IA, OIC unless compelling |
| 3–5 years | OIC if strong case; IA acceptable | Long IA without CSED analysis |
| 5–7 years | OIC or streamlined IA | Nothing major to avoid |
| > 7 years | Any appropriate resolution | — |

---

## Common CSED Mistakes

### Mistake 1: Not Checking the Transcript
Clients often misremember when they filed. Always pull the Account Transcript and verify the assessment date directly.

### Mistake 2: Assuming CSED = 10 Years from Filing
The CSED runs from the **assessment date**, not the filing date. For late-filed returns, these can differ by years.

### Mistake 3: Ignoring Tolling History
If a client had a prior OIC or IA, the CSED may already be extended. The transcript will show "CSED EXTENDED" notations in some cases. Always calculate from assessment date + all tolling.

### Mistake 4: Entering an IA Without CSED Analysis
Recommending an installment agreement when the CSED < 3 years can cost the client years of unnecessary payments.

### Mistake 5: Multiple Tax Years, Multiple CSEDs
Each year's tax assessment has its own CSED. A client owing for 2015, 2018, and 2022 has three separate CSED clocks running. The 2015 liability may expire while the 2022 liability still has years left.

---

## Practical Example: Full CSED Analysis

**Client profile:**
- 2014 income tax: Assessed 04/15/2015 → Base CSED: 04/15/2025
- 2018 income tax: Assessed 10/01/2019 → Base CSED: 10/01/2029
- Entered IA in 2020, terminated in 2022 (24 months pending + 30 days)

**Adjusted CSEDs:**
- 2014: 04/15/2025 + 750 days ≈ 04/04/2027
- 2018: 10/01/2029 + 750 days ≈ 09/20/2031

**Current date (early 2026):**
- 2014 liability: ~14 months remaining → **CNC candidate**
- 2018 liability: ~5.5 years remaining → **OIC or IA evaluation needed**

**Recommendation:** Request CNC for 2014 liability (let it expire), evaluate OIC for 2018 liability separately.

---

## Key IRS References

| Document | Purpose |
|----------|---------|
| IRS Account Transcript | Find assessment date and CSED |
| Form 4340 (Certificate of Assessments) | Official record of all assessments and CSED |
| IRS Publication 594 | Overview of collection process and rights |
| IRC §6502 | Statutory authority for 10-year collection period |
| IRC §6503 | Statutory list of tolling events |

**To request transcripts:** irs.gov/transcript or 1-800-829-1040

---

*The CSED is one of the most powerful tools in tax resolution. Always analyze it before recommending any resolution strategy.*
