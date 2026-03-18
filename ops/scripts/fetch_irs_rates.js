#!/usr/bin/env node
/**
 * fetch_irs_rates.js
 * TaxPod Phase 3A — Fetch current IRS rates and write to ops/data/irs_current_rates.json
 *
 * Attempts to fetch live IRS rate data via DuckDuckGo search (Python subprocess).
 * Falls back to hardcoded values if search fails or returns ambiguous results.
 *
 * Usage:
 *   node ops/scripts/fetch_irs_rates.js
 *   # Or via wrapper:
 *   bash ops/scripts/run_fetch_irs_rates.sh
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ─── Hardcoded fallback values (update quarterly) ────────────────────────────
const FALLBACK = {
  version: 'IrsCurrentRatesV1',
  source: 'hardcoded-fallback',
  underpayment_rate_pct: 7.0,
  underpayment_rate_quarter: 'Q1 2026',
  collection_standards_effective: '20250421',
  collection_standards_expires: '20260601',
  oic_application_fee: 205,
  installment_setup_fee_online_dd: 31,
  installment_setup_fee_online_other: 107,
  installment_setup_fee_offline: 225,
  installment_setup_fee_low_income: 43,
  notes: 'Hardcoded fallback — web search unavailable. Verify before use in formal documents.',
};

// ─── Python DDGS search helper ────────────────────────────────────────────────
/**
 * Run a DuckDuckGo search query via Python (duckduckgo_search library).
 * Returns first N result snippets, or null on failure.
 */
function ddgsSearch(query, maxResults = 3) {
  // Write Python script to a temp file to avoid shell escaping issues
  const tmpScript = path.join(require('os').tmpdir(), `irs_ddgs_${process.pid}.py`);
  const tmpInput = path.join(require('os').tmpdir(), `irs_ddgs_${process.pid}_query.json`);

  const pythonScript = `
import sys
import json

try:
    input_data = json.load(open(sys.argv[1]))
    query = input_data['query']
    max_results = input_data['max_results']
except Exception as e:
    print(json.dumps({"error": f"input error: {e}"}))
    sys.exit(0)

try:
    from ddgs import DDGS
    with DDGS() as ddgs:
        results = list(ddgs.text(query, region='us-en', max_results=max_results))
        print(json.dumps([r.get('body', '') for r in results]))
except ImportError:
    # Try legacy package name
    try:
        from duckduckgo_search import DDGS
        with DDGS() as ddgs:
            results = list(ddgs.text(query, max_results=max_results))
            print(json.dumps([r.get('body', '') for r in results]))
    except ImportError:
        print(json.dumps({"error": "ddgs not installed — run: pip install ddgs"}))
except Exception as e:
    print(json.dumps({"error": str(e)}))
`;

  try {
    require('fs').writeFileSync(tmpScript, pythonScript, 'utf8');
    require('fs').writeFileSync(tmpInput, JSON.stringify({ query, max_results: maxResults }), 'utf8');

    const output = execSync(`python3 "${tmpScript}" "${tmpInput}"`, {
      timeout: 15000,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    const parsed = JSON.parse(output.trim());
    if (Array.isArray(parsed)) {
      return parsed.join(' ');
    }
    return null;
  } catch (err) {
    return null;
  } finally {
    try { require('fs').unlinkSync(tmpScript); } catch (_) {}
    try { require('fs').unlinkSync(tmpInput); } catch (_) {}
  }
}

// ─── Rate extraction helpers ──────────────────────────────────────────────────

/**
 * Try to extract IRS underpayment interest rate from search results.
 * IRS announces quarterly. Typically "X percent" or "X%".
 */
function extractUnderpaymentRate(text) {
  if (!text) return null;

  // Look for patterns like "7 percent", "7%", "8 percent for Q1 2026"
  const patterns = [
    /underpayment.*?(\d+(?:\.\d+)?)\s*(?:percent|%)/i,
    /interest rate.*?(\d+(?:\.\d+)?)\s*(?:percent|%)/i,
    /(\d+(?:\.\d+)?)\s*(?:percent|%)\s*(?:per\s+)?(?:annum|annual|year).*?underpayment/i,
    /IRS.*?(\d+(?:\.\d+)?)\s*(?:percent|%)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const rate = parseFloat(match[1]);
      // Sanity check: IRS underpayment rate is typically 3–10%
      if (rate >= 3 && rate <= 15) {
        return rate;
      }
    }
  }
  return null;
}

/**
 * Try to extract the quarter designation (e.g., "Q1 2026") from search results.
 */
function extractQuarter(text) {
  if (!text) return null;

  const match = text.match(/Q([1-4])\s+(\d{4})/i);
  if (match) {
    return `Q${match[1]} ${match[2]}`;
  }

  // Fallback: look for "first quarter 2026" style
  const quarterWords = {
    first: 'Q1', second: 'Q2', third: 'Q3', fourth: 'Q4',
  };
  const wordMatch = text.match(/(first|second|third|fourth)\s+quarter\s+(\d{4})/i);
  if (wordMatch) {
    return `${quarterWords[wordMatch[1].toLowerCase()]} ${wordMatch[2]}`;
  }

  return null;
}

/**
 * Try to extract Collection Financial Standards effective date from search results.
 * Format: YYYYMMDD
 */
function extractCollectionStandardsDate(text) {
  if (!text) return null;

  // Look for "effective [month] [day], [year]" or date patterns
  const monthMap = {
    january: '01', february: '02', march: '03', april: '04',
    may: '05', june: '06', july: '07', august: '08',
    september: '09', october: '10', november: '11', december: '12',
  };

  const match = text.match(/effective\s+(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2}),?\s+(\d{4})/i);
  if (match) {
    const month = monthMap[match[1].toLowerCase()];
    const day = match[2].padStart(2, '0');
    const year = match[3];
    return `${year}${month}${day}`;
  }

  return null;
}

// ─── Main fetch logic ─────────────────────────────────────────────────────────

async function fetchIrsRates() {
  console.log('[fetch_irs_rates] Starting IRS rates fetch...');

  const result = { ...FALLBACK };
  result.fetched_utc = new Date().toISOString();
  let fetchedViaSearch = false;

  // ── Search 1: IRS underpayment interest rate ──
  console.log('[fetch_irs_rates] Searching: IRS underpayment interest rate quarterly 2026...');
  const rateText = ddgsSearch('IRS underpayment interest rate quarterly 2026 site:irs.gov OR IRS.gov interest rate');

  if (rateText) {
    const rate = extractUnderpaymentRate(rateText);
    const quarter = extractQuarter(rateText);

    if (rate !== null) {
      console.log(`[fetch_irs_rates] Extracted underpayment rate: ${rate}%`);
      result.underpayment_rate_pct = rate;
      fetchedViaSearch = true;
    } else {
      console.log('[fetch_irs_rates] Could not extract rate from search results — using fallback');
    }

    if (quarter) {
      console.log(`[fetch_irs_rates] Extracted quarter: ${quarter}`);
      result.underpayment_rate_quarter = quarter;
    }
  } else {
    console.log('[fetch_irs_rates] Rate search failed or unavailable — using fallback');
  }

  // ── Search 2: Collection Financial Standards effective date ──
  console.log('[fetch_irs_rates] Searching: IRS Collection Financial Standards effective date 2025...');
  const standardsText = ddgsSearch('IRS Collection Financial Standards effective date 2025 2026');

  if (standardsText) {
    const effectiveDate = extractCollectionStandardsDate(standardsText);
    if (effectiveDate) {
      console.log(`[fetch_irs_rates] Extracted collection standards effective: ${effectiveDate}`);
      result.collection_standards_effective = effectiveDate;
      fetchedViaSearch = true;
    } else {
      console.log('[fetch_irs_rates] Could not extract standards date — using fallback');
    }
  } else {
    console.log('[fetch_irs_rates] Standards search failed — using fallback');
  }

  // ── Set source field ──
  result.source = fetchedViaSearch
    ? 'auto-fetched via web search (partial — verify before use)'
    : 'hardcoded-fallback (web search unavailable)';

  result.notes = fetchedViaSearch
    ? 'Rates auto-fetched from web search. Always verify against IRS.gov before use in formal documents.'
    : 'Web search unavailable — using hardcoded fallback values. Verify quarterly at IRS.gov.';

  return result;
}

// ─── Output ───────────────────────────────────────────────────────────────────

async function main() {
  let rates;

  try {
    rates = await fetchIrsRates();
  } catch (err) {
    console.error(`[fetch_irs_rates] Fetch error: ${err.message} — using fallback`);
    rates = {
      ...FALLBACK,
      fetched_utc: new Date().toISOString(),
      source: 'hardcoded-fallback (exception during fetch)',
      notes: `Fallback used due to error: ${err.message}. Verify rates at IRS.gov.`,
    };
  }

  // Determine output path
  const scriptDir = __dirname;
  const repoRoot = path.resolve(scriptDir, '..', '..');
  const outputPath = path.join(repoRoot, 'ops', 'data', 'irs_current_rates.json');

  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write output
  const outputJson = JSON.stringify(rates, null, 2);
  fs.writeFileSync(outputPath, outputJson, 'utf8');

  console.log(`\n[fetch_irs_rates] ✅ Written to: ${outputPath}`);
  console.log('\n--- Summary ---');
  console.log(`  Source:                    ${rates.source}`);
  console.log(`  Fetched UTC:               ${rates.fetched_utc}`);
  console.log(`  Underpayment rate:         ${rates.underpayment_rate_pct}% (${rates.underpayment_rate_quarter})`);
  console.log(`  Collection standards:      Effective ${rates.collection_standards_effective}`);
  console.log(`  OIC application fee:       $${rates.oic_application_fee}`);
  console.log(`  IA fee (online DD):        $${rates.installment_setup_fee_online_dd}`);
  console.log(`  IA fee (online other):     $${rates.installment_setup_fee_online_other}`);
  console.log(`  IA fee (offline):          $${rates.installment_setup_fee_offline}`);
  console.log(`  IA fee (low-income):       $${rates.installment_setup_fee_low_income}`);
  console.log('---------------\n');
}

main().catch((err) => {
  console.error('[fetch_irs_rates] Fatal error:', err.message);
  process.exit(1);
});
