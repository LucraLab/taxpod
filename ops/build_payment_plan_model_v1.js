#!/usr/bin/env node
// build_payment_plan_model_v1.js — Deterministic PaymentPlanModelV1 builder
// Reads liability_snapshot.json from a frozen bundle + financial intake JSON.
// Produces payment_plan_model.json with stable key ordering.
// No network calls. No external deps beyond Node.js built-ins.
//
// Usage:
//   node build_payment_plan_model_v1.js \
//     --case <CASE_ID> \
//     --bundle <PATH_TO_payment_plan_bundle_v1_DIR> \
//     --intake <PATH_TO_financial_intake.json> \
//     --out <OUTPUT_DIR> \
//     [--as-of-utc <UTC>] \
//     [--force]
//
// Exit codes: 0=success, 1=input error, 2=computation error, 3=output exists

'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const os = require('os');

// ── Load IRS Collection Standards ──
const IRS_STANDARDS = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'data/irs_collection_standards_2025.json'), 'utf8')
);

// ── Helpers ──

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--case' && argv[i + 1]) { args.caseId = argv[++i]; }
    else if (argv[i] === '--bundle' && argv[i + 1]) { args.bundlePath = argv[++i]; }
    else if (argv[i] === '--intake' && argv[i + 1]) { args.intakePath = argv[++i]; }
    else if (argv[i] === '--out' && argv[i + 1]) { args.outDir = argv[++i]; }
    else if (argv[i] === '--as-of-utc' && argv[i + 1]) { args.asOfUtc = argv[++i]; }
    else if (argv[i] === '--force') { args.force = true; }
    else { console.error(`Unknown arg: ${argv[i]}`); process.exit(1); }
  }
  return args;
}

function roundCents(v) {
  return Math.round(v * 100) / 100;
}

function sha256(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

function deterministicJson(obj) {
  return JSON.stringify(obj, null, 2) + '\n';
}

function die(msg, code) {
  console.error(`ERROR: ${msg}`);
  process.exit(code || 1);
}

// Parse YYYYMMDD string as UTC Date
function parseYmd(s) {
  const y = parseInt(s.slice(0, 4), 10);
  const m = parseInt(s.slice(4, 6), 10) - 1;
  const d = parseInt(s.slice(6, 8), 10);
  return new Date(Date.UTC(y, m, d));
}

// Parse as_of_utc string (e.g. "20260220T000000Z") — only the date portion is used
function parseAsOfUtc(s) {
  return parseYmd(s.slice(0, 8));
}

// Format a UTC Date as YYYYMMDD (internal compact format, matches existing UTC strings)
function formatYmd(date) {
  const y = date.getUTCFullYear().toString().padStart(4, '0');
  const m = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const d = date.getUTCDate().toString().padStart(2, '0');
  return `${y}${m}${d}`;
}

// Format a UTC Date as YYYY-MM-DD (human-readable)
function formatYmdReadable(date) {
  const y = date.getUTCFullYear().toString().padStart(4, '0');
  const m = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const d = date.getUTCDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// ── Validation ──

function validateIntake(intake) {
  const errors = [];

  if (!intake.case_id || typeof intake.case_id !== 'string') {
    errors.push('case_id is required (non-empty string)');
  }
  if (!intake.as_of_date || typeof intake.as_of_date !== 'string') {
    errors.push('as_of_date is required (non-empty string)');
  }
  if (!intake.income || !Array.isArray(intake.income.sources) || intake.income.sources.length === 0) {
    errors.push('income.sources must be a non-empty array');
  }

  // Validate income sources
  if (intake.income && Array.isArray(intake.income.sources)) {
    for (let i = 0; i < intake.income.sources.length; i++) {
      const s = intake.income.sources[i];
      if (typeof s.monthly_amount !== 'number' || s.monthly_amount < 0 || isNaN(s.monthly_amount)) {
        errors.push(`income.sources[${i}].monthly_amount must be a number >= 0`);
      }
    }
  }

  // Validate expense categories
  const expCats = ['housing', 'transportation', 'insurance_medical', 'other_essential'];
  if (!intake.expenses) {
    errors.push('expenses object is required');
  } else {
    for (const cat of expCats) {
      if (intake.expenses[cat] && Array.isArray(intake.expenses[cat])) {
        for (let i = 0; i < intake.expenses[cat].length; i++) {
          const e = intake.expenses[cat][i];
          if (typeof e.monthly_amount !== 'number' || e.monthly_amount < 0 || isNaN(e.monthly_amount)) {
            errors.push(`expenses.${cat}[${i}].monthly_amount must be a number >= 0`);
          }
        }
      }
    }
  }

  // Validate debts
  if (intake.debts && Array.isArray(intake.debts)) {
    for (let i = 0; i < intake.debts.length; i++) {
      const d = intake.debts[i];
      if (typeof d.monthly_payment !== 'number' || d.monthly_payment < 0 || isNaN(d.monthly_payment)) {
        errors.push(`debts[${i}].monthly_payment must be a number >= 0`);
      }
      if (typeof d.balance !== 'number' || d.balance < 0 || isNaN(d.balance)) {
        errors.push(`debts[${i}].balance must be a number >= 0`);
      }
    }
  }

  // Validate dependents
  if (typeof intake.dependents !== 'number' || intake.dependents < 0 || !Number.isInteger(intake.dependents)) {
    errors.push('dependents must be a non-negative integer');
  }

  // Validate assets
  if (!intake.assets || typeof intake.assets !== 'object') {
    errors.push('assets object is required');
  } else {
    const assetFields = ['checking', 'savings', 'retirement', 'home_equity', 'other_value'];
    for (const f of assetFields) {
      if (intake.assets[f] !== undefined) {
        if (typeof intake.assets[f] !== 'number' || intake.assets[f] < 0 || isNaN(intake.assets[f])) {
          errors.push(`assets.${f} must be a number >= 0`);
        }
      }
    }
  }

  return errors;
}

// ── Main ──

function main() {
  const args = parseArgs(process.argv);

  if (!args.caseId) die('--case required');
  if (!args.bundlePath) die('--bundle required');
  if (!args.intakePath) die('--intake required');
  if (!args.outDir) {
    args.outDir = `/home/openclaw/.openclaw/tax_work/${args.caseId}/models`;
  }

  const asOfUtc = args.asOfUtc || new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z/, 'Z');

  // ── Read liability snapshot ──
  const liabilityPath = path.join(args.bundlePath, 'liability_snapshot.json');
  let liability;
  try {
    liability = JSON.parse(fs.readFileSync(liabilityPath, 'utf8'));
  } catch (e) {
    die(`Cannot read liability_snapshot.json: ${liabilityPath}: ${e.message}`);
  }

  // ── Read intake ──
  let intake;
  try {
    intake = JSON.parse(fs.readFileSync(args.intakePath, 'utf8'));
  } catch (e) {
    die(`Cannot read intake: ${args.intakePath}: ${e.message}`);
  }

  // ── Validate intake ──
  const validationErrors = validateIntake(intake);
  if (validationErrors.length > 0) {
    console.error('VALIDATION ERRORS:');
    for (const err of validationErrors) {
      console.error(`  - ${err}`);
    }
    die(`Intake validation failed with ${validationErrors.length} error(s)`);
  }

  // ── Compute liability summary ──
  const taxYears = liability.tax_years || [];
  let totalTaxOwed = 0;
  let totalPenalty = 0;
  let totalInterest = 0;
  let totalLiability = 0;
  let hasIncompleteData = false;

  for (const yr of taxYears) {
    totalTaxOwed += (yr.tax_owed || 0);
    totalPenalty += (yr.penalty || 0);
    totalInterest += (yr.interest || 0);
    totalLiability += (yr.total_liability || 0);
    if (yr.flags && yr.flags.includes('incomplete_data')) {
      hasIncompleteData = true;
    }
  }

  totalTaxOwed = roundCents(totalTaxOwed);
  totalPenalty = roundCents(totalPenalty);
  totalInterest = roundCents(totalInterest);
  totalLiability = roundCents(totalLiability);

  // ── Compute income ──
  const incomeSources = intake.income.sources || [];
  let totalMonthlyIncome = 0;
  const incomeBreakdown = {};
  let hasSelfEmployment = false;

  for (const s of incomeSources) {
    totalMonthlyIncome += s.monthly_amount;
    const key = s.type || 'other';
    incomeBreakdown[key] = (incomeBreakdown[key] || 0) + s.monthly_amount;
    if (s.type === 'self_employment') {
      hasSelfEmployment = true;
    }
  }
  totalMonthlyIncome = roundCents(totalMonthlyIncome);

  // Round income breakdown values
  const sortedIncomeKeys = Object.keys(incomeBreakdown).sort();
  const roundedIncomeBreakdown = {};
  for (const k of sortedIncomeKeys) {
    roundedIncomeBreakdown[k] = roundCents(incomeBreakdown[k]);
  }

  // ── Compute expenses ──
  const expCats = ['housing', 'transportation', 'insurance_medical', 'other_essential'];
  const expenseBreakdown = {};
  let totalMonthlyExpenses = 0;

  for (const cat of expCats) {
    let catTotal = 0;
    const items = (intake.expenses && intake.expenses[cat]) || [];
    for (const e of items) {
      catTotal += e.monthly_amount;
    }
    expenseBreakdown[cat] = roundCents(catTotal);
    totalMonthlyExpenses += catTotal;
  }
  totalMonthlyExpenses = roundCents(totalMonthlyExpenses);

  // ── Compute debts ──
  const debts = intake.debts || [];
  let totalDebtPayments = 0;
  for (const d of debts) {
    totalDebtPayments += d.monthly_payment;
  }
  totalDebtPayments = roundCents(totalDebtPayments);

  // ── Compute assets ──
  const assets = intake.assets || {};
  const totalAssets = roundCents(
    (assets.checking || 0) +
    (assets.savings || 0) +
    (assets.retirement || 0) +
    (assets.home_equity || 0) +
    (assets.other_value || 0)
  );

  // ── Compute monthly capacity ──
  const disposable = roundCents(totalMonthlyIncome - totalMonthlyExpenses - totalDebtPayments);
  const capacityBest = roundCents(disposable * 1.10);
  const capacityLikely = disposable;
  const capacityWorst = roundCents(disposable * 0.90);

  // ── NaN guard ──
  const allValues = [totalMonthlyIncome, totalMonthlyExpenses, totalDebtPayments, disposable, capacityBest, capacityWorst, totalAssets, totalLiability];
  for (const v of allValues) {
    if (isNaN(v)) {
      die('Computation produced NaN — check intake values', 2);
    }
  }

  // ── IRS Allowable Expenses (Phase 1A) ──
  const householdSize = (typeof intake.household_size === 'number' && intake.household_size >= 1)
    ? intake.household_size
    : 1;
  const vehiclesRaw = (typeof intake.vehicles === 'number' && intake.vehicles >= 0)
    ? intake.vehicles
    : 0;
  const vehicles = Math.min(vehiclesRaw, 2);
  const age65plus = intake.taxpayer_age_65_plus === true;

  // National standard by household size
  const ns = IRS_STANDARDS.national_standards;
  let nationalStd;
  if (householdSize === 1) nationalStd = ns.household_size_1;
  else if (householdSize === 2) nationalStd = ns.household_size_2;
  else if (householdSize === 3) nationalStd = ns.household_size_3;
  else if (householdSize === 4) nationalStd = ns.household_size_4;
  else nationalStd = ns.household_size_4 + (householdSize - 4) * ns.additional_person;

  const transportOwnership = IRS_STANDARDS.transportation_ownership[`vehicles_${vehicles}`];
  const transportOperating = IRS_STANDARDS.transportation_operating[`vehicles_${vehicles}`];
  const healthCare = age65plus
    ? IRS_STANDARDS.health_care.age_65_plus
    : IRS_STANDARDS.health_care.under_65;

  const totalIrsAllowable = roundCents(nationalStd + transportOwnership + transportOperating + healthCare);
  const selfReportedExpenses = totalMonthlyExpenses;
  const variance = roundCents(selfReportedExpenses - totalIrsAllowable);

  let varianceNote;
  if (variance > 0) {
    varianceNote = `Self-reported expenses exceed IRS national standard by $${variance.toFixed(2)}/month. IRS may only allow $${totalIrsAllowable.toFixed(2)}/month in installment agreement or OIC calculations.`;
  } else if (variance < 0) {
    varianceNote = `Self-reported expenses are $${Math.abs(variance).toFixed(2)}/month below IRS national standard.`;
  } else {
    varianceNote = `Self-reported expenses match IRS national standard.`;
  }

  const irsAllowableExpenses = {
    national_standard: roundCents(nationalStd),
    transportation_ownership: roundCents(transportOwnership),
    transportation_operating: roundCents(transportOperating),
    health_care: roundCents(healthCare),
    total_irs_allowable: totalIrsAllowable,
    self_reported_essential_expenses: selfReportedExpenses,
    variance: variance,
    variance_note: varianceNote,
    household_size_used: householdSize,
    vehicles_used: vehicles,
    taxpayer_age_65_plus: age65plus
  };

  // ── CSED Analysis (Phase 1B) ──
  const assessmentDates = liability.assessment_dates || [];
  let csedAnalysis;

  if (assessmentDates.length === 0) {
    csedAnalysis = {
      computed: false,
      reason: 'No assessment dates provided in liability snapshot.'
    };
  } else {
    const asOfDate = parseAsOfUtc(asOfUtc);

    const taxYearsCsed = assessmentDates.map(ad => {
      const assessDate = parseYmd(ad.assessment_date);
      const expiryDate = new Date(Date.UTC(
        assessDate.getUTCFullYear() + 10,
        assessDate.getUTCMonth(),
        assessDate.getUTCDate()
      ));
      const expiryStr = formatYmd(expiryDate);
      const expiryReadable = formatYmdReadable(expiryDate);
      const daysRemaining = Math.floor((expiryDate - asOfDate) / (1000 * 60 * 60 * 24));
      return {
        year: ad.year,
        assessment_date: ad.assessment_date,
        csed_expires_utc: expiryStr,
        csed_expires_readable: expiryReadable,
        csed_days_remaining: daysRemaining,
        csed_expired: daysRemaining <= 0,
        _expiryDate: expiryDate
      };
    });

    // Sort by expiry to find earliest
    const sorted = [...taxYearsCsed].sort((a, b) =>
      a.csed_expires_utc.localeCompare(b.csed_expires_utc)
    );
    const earliestExpiry = sorted[0].csed_expires_utc;
    const nearThreshold = 730;
    const anyNearExpiry = taxYearsCsed.some(
      y => y.csed_days_remaining > 0 && y.csed_days_remaining <= nearThreshold
    );
    const anyExpired = taxYearsCsed.some(y => y.csed_expired);

    // Capture human-readable date before stripping internal helper field
    const earliestExpiryReadable = formatYmdReadable(sorted[0]._expiryDate);
    taxYearsCsed.forEach(y => delete y._expiryDate);

    csedAnalysis = {
      computed: true,
      as_of_utc: asOfUtc,
      tax_years: taxYearsCsed,
      earliest_expiry_utc: earliestExpiry,
      any_near_expiry: anyNearExpiry,
      near_expiry_threshold_days: nearThreshold,
      any_expired: anyExpired,
      collection_window_note: `IRS has until ${earliestExpiryReadable} to collect the earliest-assessed year.`
    };

    // CSED risk flags added below after base flags
    if (anyNearExpiry) {
      csedAnalysis._flag_near_expiry = true;
    }
    if (anyExpired) {
      csedAnalysis._flag_expired = true;
    }
  }

  // ── Risk flags ──
  const riskFlags = [];
  if (disposable < 0) riskFlags.push('NEGATIVE_CASHFLOW');
  if (disposable < 200 && disposable >= 0) riskFlags.push('LOW_DISPOSABLE');
  if (totalLiability > 50000) riskFlags.push('HIGH_LIABILITY');
  if (hasSelfEmployment) riskFlags.push('SELF_EMPLOYMENT_COMPLEXITY');
  if (hasIncompleteData) riskFlags.push('INCOMPLETE_TAX_DATA');
  if (totalAssets < 1000) riskFlags.push('LOW_ASSETS');
  // Phase 1A
  if (selfReportedExpenses - totalIrsAllowable > 500) riskFlags.push('EXPENSES_EXCEED_IRS_STANDARDS');
  // Phase 1B CSED flags
  if (csedAnalysis.computed) {
    if (csedAnalysis.any_near_expiry) riskFlags.push('CSED_NEAR_EXPIRY');
    if (csedAnalysis.any_expired) riskFlags.push('CSED_EXPIRED');
  }

  // Clean up internal markers
  if (csedAnalysis._flag_near_expiry !== undefined) delete csedAnalysis._flag_near_expiry;
  if (csedAnalysis._flag_expired !== undefined) delete csedAnalysis._flag_expired;

  // ── Assumptions ──
  const assumptions = [
    'Income and expenses as reported by taxpayer on intake form',
    'Sensitivity range: best +10%, worst -10% of disposable',
    'No adjustment for seasonality or future income changes',
    'Liability totals from TaxVault as of bundle export date'
  ];

  // ── Relief opportunities (FTA) ──
  const priorCompliance = intake.prior_compliance || null;
  const cleanFilingYearsRaw = (priorCompliance && typeof priorCompliance.clean_filing_years === 'number')
    ? priorCompliance.clean_filing_years
    : null;
  const cleanFilingYears = cleanFilingYearsRaw !== null ? cleanFilingYearsRaw : 0;
  const ftaEligible = cleanFilingYears >= 3;

  let ftaNote;
  if (ftaEligible) {
    ftaNote = 'Taxpayer has 3+ years of clean compliance. Eligible to request First Time Penalty Abatement for failure-to-file and failure-to-pay penalties. This could significantly reduce total liability.';
  } else if (cleanFilingYearsRaw === null) {
    ftaNote = 'FTA eligibility unknown — add prior_compliance.clean_filing_years to intake to check.';
  } else {
    ftaNote = `Not eligible: ${cleanFilingYears} year(s) clean compliance on file (3 required for FTA).`;
  }

  const reliefOpportunities = {
    fta_eligible: ftaEligible,
    fta_clean_years: cleanFilingYearsRaw,
    fta_note: ftaNote
  };

  // ── Build model ──
  const model = {
    version: 'PaymentPlanModelV1',
    case_id: args.caseId,
    as_of_utc: asOfUtc,
    liability_summary: {
      tax_years: taxYears,
      total_tax_owed: totalTaxOwed,
      total_penalty: totalPenalty,
      total_interest: totalInterest,
      total_liability: totalLiability
    },
    intake_summary: {
      total_monthly_income: totalMonthlyIncome,
      total_monthly_expenses: totalMonthlyExpenses,
      total_monthly_debt_payments: totalDebtPayments,
      dependents: intake.dependents,
      total_assets: totalAssets,
      income_source_count: incomeSources.length,
      has_self_employment: hasSelfEmployment
    },
    monthly_capacity: {
      net_income_monthly: totalMonthlyIncome,
      essential_expenses_monthly: totalMonthlyExpenses,
      debt_payments_monthly: totalDebtPayments,
      estimated_disposable_monthly: disposable,
      capacity_best: capacityBest,
      capacity_likely: capacityLikely,
      capacity_worst: capacityWorst
    },
    irs_allowable_expenses: irsAllowableExpenses,
    csed_analysis: csedAnalysis,
    risk_flags: riskFlags,
    assumptions: assumptions,
    relief_opportunities: reliefOpportunities,
    derived: {
      expense_breakdown: {
        housing: expenseBreakdown.housing,
        insurance_medical: expenseBreakdown.insurance_medical,
        other_essential: expenseBreakdown.other_essential,
        transportation: expenseBreakdown.transportation
      },
      income_breakdown: roundedIncomeBreakdown
    }
  };

  // ── Write atomically ──
  const outFile = path.join(args.outDir, 'payment_plan_model.json');

  if (fs.existsSync(outFile) && !args.force) {
    die(`Output already exists: ${outFile}. Use --force to overwrite.`, 3);
  }

  const content = deterministicJson(model);
  const tmpFile = path.join(os.tmpdir(), `ppm_v1_${args.caseId}_${process.pid}.json`);

  try {
    fs.mkdirSync(args.outDir, { recursive: true });
    fs.writeFileSync(tmpFile, content);
    fs.renameSync(tmpFile, outFile);
  } catch (e) {
    try { fs.unlinkSync(tmpFile); } catch (_) {}
    die(`Write failed: ${e.message}`);
  }

  const hash = sha256(Buffer.from(content));
  console.log(`MODEL_OK: ${outFile}`);
  console.log(`SHA256: ${hash}`);
  console.log(`DISPOSABLE: ${disposable}`);
  console.log(`FLAGS: ${riskFlags.length > 0 ? riskFlags.join(',') : 'none'}`);
}

main();
