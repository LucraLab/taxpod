#!/usr/bin/env bash
# run_fetch_irs_rates.sh
# TaxPod Phase 3A — Shell wrapper for fetch_irs_rates.js
#
# Runs the IRS rates fetch script and outputs a human-readable summary.
# Safe to run from any directory.
#
# Usage:
#   bash ops/scripts/run_fetch_irs_rates.sh
#   # Or from repo root:
#   ./ops/scripts/run_fetch_irs_rates.sh

set -euo pipefail

# ─── Resolve repo root ────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

FETCH_SCRIPT="$SCRIPT_DIR/fetch_irs_rates.js"
OUTPUT_FILE="$REPO_ROOT/ops/data/irs_current_rates.json"

# ─── Pre-flight checks ────────────────────────────────────────────────────────
if ! command -v node &>/dev/null; then
  echo "❌ ERROR: Node.js is not installed or not in PATH."
  echo "   Install Node.js from https://nodejs.org and retry."
  exit 1
fi

if [ ! -f "$FETCH_SCRIPT" ]; then
  echo "❌ ERROR: Fetch script not found at: $FETCH_SCRIPT"
  exit 1
fi

# ─── Run ─────────────────────────────────────────────────────────────────────
echo "============================================"
echo "  TaxPod — IRS Rates Fetch"
echo "  $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
echo "============================================"
echo ""

cd "$REPO_ROOT"
node "$FETCH_SCRIPT"
EXIT_CODE=$?

echo ""
echo "============================================"

if [ $EXIT_CODE -eq 0 ]; then
  echo "  ✅ Fetch complete."

  if [ -f "$OUTPUT_FILE" ]; then
    echo ""
    echo "  Output file: $OUTPUT_FILE"
    echo ""

    # Print key rates if jq is available
    if command -v jq &>/dev/null; then
      echo "  Key rates:"
      echo "    Underpayment rate:   $(jq -r '.underpayment_rate_pct' "$OUTPUT_FILE")% ($(jq -r '.underpayment_rate_quarter' "$OUTPUT_FILE"))"
      echo "    OIC app fee:         \$$(jq -r '.oic_application_fee' "$OUTPUT_FILE")"
      echo "    IA fee (online DD):  \$$(jq -r '.installment_setup_fee_online_dd' "$OUTPUT_FILE")"
      echo "    Source:              $(jq -r '.source' "$OUTPUT_FILE")"
      echo "    Fetched:             $(jq -r '.fetched_utc' "$OUTPUT_FILE")"
    else
      echo "  (Install jq for formatted summary output)"
      echo ""
      cat "$OUTPUT_FILE"
    fi
  fi
else
  echo "  ❌ Fetch failed with exit code $EXIT_CODE"
  echo "  Check output above for error details."
  echo "  Fallback values may have been written — verify $OUTPUT_FILE"
fi

echo "============================================"
echo ""
echo "  ⚠️  IMPORTANT: Always verify rates at IRS.gov before"
echo "     using in formal documents or client communications."
echo "============================================"

exit $EXIT_CODE
