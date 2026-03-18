# TaxPod Knowledge Module

> **Version:** Phase 2A + 2D + 3A  
> **Purpose:** Structured IRS reference documentation for the TaxPod resolution pipeline agent  
> **Scope:** Federal tax collection, resolution alternatives, taxpayer rights, and live rate data

---

## What This Is

The `tax_knowledge/` directory is a structured reference library for the TaxPod AI agent. It contains:

- **Accurate, scannable summaries** of key IRS publications
- **Deep-dive resolution guides** covering all IRS collection alternatives
- **Strategy frameworks** (CSED analysis, penalty abatement scripts)
- **Cross-references** between documents for quick navigation

These are **reference documents**, not pipeline code. They inform agent reasoning and can be cited in client-facing outputs.

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
└── resolution/                        ← Collection Alternatives Deep Dives
    ├── collection_alternatives.md     ← All 6 resolution pathways (full detail)
    ├── csed_deep_dive.md              ← CSED strategy by time horizon
    └── penalty_abatement_guide.md    ← FTA eligibility, calculation, call script
```

---

## How to Use This Module

### For the TaxPod Agent

When advising on a client case:

1. **Start with `collection_alternatives.md`** — determines which resolution paths are viable
2. **Always run CSED analysis** — check `csed_deep_dive.md` for time-horizon strategy before recommending IA or OIC
3. **Check penalty abatement first** — `penalty_abatement_guide.md` — FTA is low-effort, high-reward
4. **Reference publication docs** for taxpayer rights questions or innocent spouse flags

### For Human Reviewers

- All documents include citations to IRS publications and IRC sections
- Fees and rates are current as of Q1 2026 — verify quarterly
- Live rates are stored in `ops/data/irs_current_rates.json` (see below)

---

## Live Rate Data

Current IRS rates are stored in:

```
ops/data/irs_current_rates.json
```

This file includes:
- Current underpayment interest rate (quarterly)
- Collection Financial Standards effective dates
- OIC application fees
- Installment Agreement setup fees

### Keeping It Current

Run the fetch script **quarterly** (when IRS announces new rates):

```bash
bash ops/scripts/run_fetch_irs_rates.sh
```

The script attempts to fetch live data via web search and falls back to hardcoded values if unavailable.

**IRS announces rates for each quarter.** Typical announcement schedule:
- Q1 (Jan–Mar): Announced November/December
- Q2 (Apr–Jun): Announced February/March
- Q3 (Jul–Sep): Announced May/June
- Q4 (Oct–Dec): Announced August/September

**Authoritative sources to verify:**
- Underpayment rate: [IRS Interest Rates](https://www.irs.gov/payments/quarterly-interest-rates)
- Collection Financial Standards: [IRS Collection Standards](https://www.irs.gov/businesses/small-businesses-self-employed/collection-financial-standards)
- OIC fees: [IRS OIC page](https://www.irs.gov/payments/offer-in-compromise)

---

## What's NOT in This Module

This knowledge module covers federal tax collection resolution only. It does **not** cover:

- **State taxes** — Each state has its own collection process, statutes, and resolution programs. California FTB, NY DTF, IL DOR, etc. are entirely separate.
- **Court decisions and case law** — Tax Court opinions, Circuit Court decisions, and evolving case law are not tracked here.
- **Estate and gift taxes** — Different rules, forms, and collection timelines.
- **Payroll tax trust fund recovery** — IRC §6672 TFRP has unique rules; not covered.
- **Foreign bank account reporting (FBAR/FATCA)** — Separate FinCEN and IRS reporting regimes.
- **International tax** — Treaties, GILTI, PFIC, etc.
- **Advanced tax planning** — Tax minimization, entity structuring, retirement planning.
- **Criminal tax matters** — Tax evasion, fraud referrals, grand jury matters. These require specialized criminal tax attorneys.
- **Bankruptcy law** — Chapter 7/13 analysis requires a licensed bankruptcy attorney. The `collection_alternatives.md` file notes tax implications only.

---

## Document Maintenance

| Document | Update Trigger | Frequency |
|----------|---------------|-----------|
| `pub_594_collection_process.md` | IRS updates Pub 594 | Annually |
| `pub_971_innocent_spouse.md` | IRS updates Pub 971 | As needed |
| `pub_1_taxpayer_rights.md` | TBOR changes (rare) | As needed |
| `collection_alternatives.md` | Fee changes, threshold changes | Quarterly |
| `csed_deep_dive.md` | Law changes (rare) | As needed |
| `penalty_abatement_guide.md` | Policy changes | As needed |
| `ops/data/irs_current_rates.json` | Quarterly rate announcements | **Quarterly** |

---

## Key IRS Resources

| Resource | URL / Phone |
|----------|------------|
| IRS main site | irs.gov |
| General taxpayer phone | 1-800-829-1040 |
| Business tax phone | 1-800-829-4933 |
| Taxpayer Advocate Service | 1-877-777-4778 |
| Online Payment Agreement | irs.gov/OPA |
| Get Transcripts | irs.gov/transcript |
| Pub 594 (Collection Process) | irs.gov/pub/irs-pdf/p594.pdf |
| Pub 971 (Innocent Spouse) | irs.gov/pub/irs-pdf/p971.pdf |
| Pub 1 (Taxpayer Rights) | irs.gov/pub/irs-pdf/p1.pdf |

---

*This knowledge module is maintained as part of TaxPod — an IRS debt resolution pipeline. Content is for informational purposes and should be verified against current IRS guidance before use in formal client communications.*
