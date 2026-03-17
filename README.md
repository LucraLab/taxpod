# TaxPod — IRS Resolution Workspace

**Owner:** James McDonald (private)  
**Status:** Active — working IRS case  
**Sensitivity:** 🔴 HIGH — contains personal financial and tax data  

---

## ⚠️ PRIVACY NOTICE

This workspace contains James's personal IRS tax resolution case.
- Case files (`cases/`) are **gitignored** and never committed
- Runtime artifacts (`runtime/`) are **gitignored** and never committed
- Only the pipeline code (`repo/`) is tracked in GitHub

---

## Structure

```
taxpod/
├── README.md (this file)
├── RAIL.md (action items)
├── cases/            ← 🔴 LOCAL ONLY — gitignored
│   └── james_2026/   ← Your active case data
│       ├── bundle/   ← PORT0 output (liability snapshot, transcripts, notices)
│       ├── model/    ← PORT1 output (payment plan model)
│       ├── strategy/ ← PORT2 output (strategy recommendation)
│       ├── package/  ← PORT3 output (CPA handoff package)
│       └── audit/    ← PORT4 apply receipts
├── runtime/          ← 🔴 LOCAL ONLY — gitignored
└── repo/             ← Pipeline code (LucraLab/taxpod on GitHub)
    ├── ops/          ← PORT1-PORT4 scripts
    ├── docs/         ← Specs + schemas
    └── extension/    ← OpenClaw plugin
```

---

## Pipeline (How to Run Your Case)

### PORT0: Bundle (IRS docs intake)
Input: Your IRS transcripts, notices, supporting docs  
Output: `cases/james_2026/bundle/liability_snapshot.json`  
*Manual step — Luke helps structure this*

### PORT1: Payment Model
```bash
cd repo
bash ops/run_port1_payment_capacity.sh <CASE_ID> <BUNDLE_DIR> <INTAKE_JSON> <OUT_DIR>
```
Output: `cases/james_2026/model/payment_plan_model.json`

### PORT2: Strategy Recommendation
```bash
bash ops/run_port2_strategy_recommendation.sh <CASE_ID> <BUNDLE_DIR> <MODEL_DIR> <OUT_DIR>
```
Output: `cases/james_2026/strategy/strategy_recommendation.json`

### PORT3: CPA Package
```bash
bash ops/run_port3_cpa_package.sh <CASE_ID> <BUNDLE_DIR> <MODEL_DIR> <STRATEGY_DIR> <OUT_DIR>
```
Output: `cases/james_2026/package/` — ready to send to CPA/EA

### PORT4: Apply CPA Feedback
*After CPA reviews the package and provides corrections*
```bash
node ops/apply/apply_changeset_v1.js \
  --changeset <path> --case <CASE_ID> \
  --approve-proof <approval.md> --approve-proof-sha256 <hash> \
  --out <receipt_dir>
```

---

## IRS Resolution Strategy Types

| Strategy | When It Applies | Monthly Payment |
|----------|----------------|----------------|
| Short-term plan | Full payoff ≤ 6 months | High |
| Long-term installment | Full payoff 7-72 months | Moderate |
| Partial payment IA | Can't pay in full in 72 months | Lower, negotiated |
| CPA escalation | Complex flags, disputes, OIC | TBD with CPA |

---

## Next Steps

1. **James:** Gather IRS documents (transcripts, notices, any correspondence)
2. **Luke:** Help structure PORT0 bundle from those docs
3. Run PORT1 → PORT2 → PORT3 to get CPA package
4. James reviews strategy recommendation
5. If needed: engage CPA/EA for PORT4 feedback + Apply Door

---

## Discord Channel

**#taxpod** — Updates, strategy decisions, CPA coordination

---

**Created:** 2026-03-17  
**Sensitivity:** Keep case data local. Never commit to git.
