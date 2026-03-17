#!/usr/bin/env node
/**
 * IRS Pod Scaffold — Offline Tests
 *
 * Validates:
 *   1. Registry structure and defaults
 *   2. Agent flags default to false
 *   3. Write-intent detection blocks correctly
 *   4. Read-only routing
 *   5. Pod disabled by default
 *
 * No live network calls. No dependencies beyond Node built-ins.
 * Run: node extensions/irs-pod/irs-pod.test.js
 */

"use strict";

const fs = require("fs");
const path = require("path");

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  PASS: ${name}`);
    passed++;
  } catch (e) {
    console.log(`  FAIL: ${name}`);
    console.log(`        ${e.message}`);
    failed++;
  }
}

function assert(condition, msg) {
  if (!condition) throw new Error(msg || "Assertion failed");
}

function assertEqual(a, b, msg) {
  if (a !== b)
    throw new Error(msg || `Expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`);
}

// ── Load registry ──

const registryPath = path.join(__dirname, "registry.json");
const registry = JSON.parse(fs.readFileSync(registryPath, "utf-8"));

console.log("IRS Pod Scaffold Tests");
console.log("======================");
console.log("");

// ── Section 1: Registry Structure ──

console.log("Section 1: Registry Structure");

test("registry has agents object", () => {
  assert(typeof registry.agents === "object", "missing agents");
  assert(!Array.isArray(registry.agents), "agents should be object not array");
});

test("registry has tax-vault-operator agent", () => {
  assert(registry.agents["tax-vault-operator"], "missing tax-vault-operator");
});

test("registry has irs-specialist agent", () => {
  assert(registry.agents["irs-specialist"], "missing irs-specialist");
});

test("registry has exactly 2 agents", () => {
  assertEqual(Object.keys(registry.agents).length, 2, "expected 2 agents");
});

test("registry has pod_config", () => {
  assert(registry.pod_config, "missing pod_config");
});

test("pod_config.write_operations is NONE", () => {
  assertEqual(registry.pod_config.write_operations, "NONE");
});

test("pod_config.kill_switch_required is true", () => {
  assertEqual(registry.pod_config.kill_switch_required, true);
});

console.log("");

// ── Section 2: Agent Defaults ──

console.log("Section 2: Agent Defaults (disabled by default)");

test("tax-vault-operator enabled_default is false", () => {
  assertEqual(registry.agents["tax-vault-operator"].enabled_default, false);
});

test("irs-specialist enabled_default is false", () => {
  assertEqual(registry.agents["irs-specialist"].enabled_default, false);
});

test("tax-vault-operator env flag is IRS_TAX_VAULT_OPERATOR_ENABLED", () => {
  assertEqual(
    registry.agents["tax-vault-operator"].enabled_env,
    "IRS_TAX_VAULT_OPERATOR_ENABLED"
  );
});

test("irs-specialist env flag is IRS_IRS_SPECIALIST_ENABLED", () => {
  assertEqual(
    registry.agents["irs-specialist"].enabled_env,
    "IRS_IRS_SPECIALIST_ENABLED"
  );
});

test("env flags resolve to false when unset", () => {
  // Simulate isAgentEnabled logic
  function isEnabled(agent) {
    const envVal = process.env[agent.enabled_env];
    if (envVal === undefined || envVal === "") return agent.enabled_default;
    return envVal === "true" || envVal === "1";
  }
  // Clear env to be safe
  delete process.env.IRS_TAX_VAULT_OPERATOR_ENABLED;
  delete process.env.IRS_IRS_SPECIALIST_ENABLED;
  assertEqual(isEnabled(registry.agents["tax-vault-operator"]), false);
  assertEqual(isEnabled(registry.agents["irs-specialist"]), false);
});

test("env flags resolve to true when set to 'true'", () => {
  function isEnabled(agent) {
    const envVal = process.env[agent.enabled_env];
    if (envVal === undefined || envVal === "") return agent.enabled_default;
    return envVal === "true" || envVal === "1";
  }
  process.env.IRS_TAX_VAULT_OPERATOR_ENABLED = "true";
  assertEqual(isEnabled(registry.agents["tax-vault-operator"]), true);
  delete process.env.IRS_TAX_VAULT_OPERATOR_ENABLED;
});

test("env flags resolve to false when set to 'false'", () => {
  function isEnabled(agent) {
    const envVal = process.env[agent.enabled_env];
    if (envVal === undefined || envVal === "") return agent.enabled_default;
    return envVal === "true" || envVal === "1";
  }
  process.env.IRS_TAX_VAULT_OPERATOR_ENABLED = "false";
  assertEqual(isEnabled(registry.agents["tax-vault-operator"]), false);
  delete process.env.IRS_TAX_VAULT_OPERATOR_ENABLED;
});

console.log("");

// ── Section 3: Capability Boundaries ──

console.log("Section 3: Capability Boundaries");

test("tax-vault-operator allowed only has dispatch_tax_status", () => {
  const allowed = registry.agents["tax-vault-operator"].capabilities.allowed;
  assertEqual(allowed.length, 1);
  assertEqual(allowed[0], "dispatch_tax_status");
});

test("irs-specialist allowed only has dispatch_tax_status", () => {
  const allowed = registry.agents["irs-specialist"].capabilities.allowed;
  assertEqual(allowed.length, 1);
  assertEqual(allowed[0], "dispatch_tax_status");
});

test("tax-vault-operator explicitly forbids tax-sync dispatch", () => {
  const forbidden = registry.agents["tax-vault-operator"].capabilities.forbidden;
  assert(forbidden.includes("dispatch_tax_sync"), "missing dispatch_tax_sync");
});

test("tax-vault-operator explicitly forbids tax-analyze dispatch", () => {
  const forbidden = registry.agents["tax-vault-operator"].capabilities.forbidden;
  assert(forbidden.includes("dispatch_tax_analyze"), "missing dispatch_tax_analyze");
});

test("both agents forbid sheets_write", () => {
  for (const id of ["tax-vault-operator", "irs-specialist"]) {
    const forbidden = registry.agents[id].capabilities.forbidden;
    assert(forbidden.includes("sheets_write"), `${id} missing sheets_write`);
  }
});

test("both agents forbid drive_write", () => {
  for (const id of ["tax-vault-operator", "irs-specialist"]) {
    const forbidden = registry.agents[id].capabilities.forbidden;
    assert(forbidden.includes("drive_write"), `${id} missing drive_write`);
  }
});

test("irs-specialist forbids efile_submit", () => {
  const forbidden = registry.agents["irs-specialist"].capabilities.forbidden;
  assert(forbidden.includes("efile_submit"), "missing efile_submit");
});

console.log("");

// ── Section 4: Write-Intent Detection ──

console.log("Section 4: Write-Intent Detection");

const WRITE_INTENTS = [
  "tax-sync",
  "tax-analyze",
  "sync",
  "analyze",
  "write",
  "create",
  "update",
  "delete",
  "modify",
  "insert",
  "append",
];

function hasWriteIntent(text) {
  const lower = text.toLowerCase();
  return WRITE_INTENTS.some((w) => lower.includes(w));
}

test("blocks 'tax-sync' intent", () => {
  assert(hasWriteIntent("please run tax-sync"), "should block tax-sync");
});

test("blocks 'tax-analyze' intent", () => {
  assert(hasWriteIntent("run tax-analyze"), "should block tax-analyze");
});

test("blocks 'sync' intent", () => {
  assert(hasWriteIntent("sync the vault"), "should block sync");
});

test("blocks 'write' intent", () => {
  assert(hasWriteIntent("write to sheets"), "should block write");
});

test("blocks 'delete' intent", () => {
  assert(hasWriteIntent("delete case 123"), "should block delete");
});

test("allows 'status' intent (read-only)", () => {
  assert(!hasWriteIntent("check status"), "should allow status");
});

test("allows 'tax-status' intent (read-only)", () => {
  assert(!hasWriteIntent("run tax-status"), "should allow tax-status");
});

test("allows 'list' intent (read-only)", () => {
  assert(!hasWriteIntent("list all cases"), "should allow list");
});

test("allows 'show' intent (read-only)", () => {
  assert(!hasWriteIntent("show vault contents"), "should allow show");
});

console.log("");

// ── Section 5: Extension Files ──

console.log("Section 5: Extension Files");

test("package.json exists and is valid JSON", () => {
  const pkg = JSON.parse(
    fs.readFileSync(path.join(__dirname, "package.json"), "utf-8")
  );
  assertEqual(pkg.name, "@openclaw/irs-pod");
  assert(pkg.openclaw.extensions.includes("./index.ts"));
});

test("openclaw.plugin.json exists and has correct id", () => {
  const plugin = JSON.parse(
    fs.readFileSync(path.join(__dirname, "openclaw.plugin.json"), "utf-8")
  );
  assertEqual(plugin.id, "irs-pod");
});

test("index.ts exists", () => {
  assert(fs.existsSync(path.join(__dirname, "index.ts")));
});

test("index.ts does not import any npm packages", () => {
  const src = fs.readFileSync(path.join(__dirname, "index.ts"), "utf-8");
  // Only allowed imports: openclaw/plugin-sdk, node:*
  const imports = src.match(/from\s+["']([^"']+)["']/g) || [];
  for (const imp of imports) {
    const mod = imp.match(/from\s+["']([^"']+)["']/)[1];
    assert(
      mod.startsWith("openclaw/") || mod.startsWith("node:"),
      `forbidden import: ${mod}`
    );
  }
});

test("index.ts only dispatches tax-status (not tax-sync or tax-analyze)", () => {
  const src = fs.readFileSync(path.join(__dirname, "index.ts"), "utf-8");
  // Find all runDispatch calls with their arguments
  const dispatchCalls = src.match(/runDispatch\(\[([^\]]*)\]\)/g) || [];
  for (const call of dispatchCalls) {
    assert(!call.includes("tax-sync"), `found tax-sync dispatch: ${call}`);
    assert(!call.includes("tax-analyze"), `found tax-analyze dispatch: ${call}`);
  }
  // Verify tax-status IS dispatched
  assert(
    dispatchCalls.some((c) => c.includes("tax-status")),
    "tax-status dispatch not found"
  );
});

test("index.ts references DISPATCH_SCRIPT at correct path", () => {
  const src = fs.readFileSync(path.join(__dirname, "index.ts"), "utf-8");
  assert(
    src.includes('/root/bin/dispatch-to-builder.sh'),
    "missing dispatch script path"
  );
});

test("index.ts has WRITE_INTENTS array with tax-sync and tax-analyze", () => {
  const src = fs.readFileSync(path.join(__dirname, "index.ts"), "utf-8");
  assert(src.includes('"tax-sync"'), "WRITE_INTENTS missing tax-sync");
  assert(src.includes('"tax-analyze"'), "WRITE_INTENTS missing tax-analyze");
});

console.log("");

// ── Summary ──

console.log("======================");
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log("");

if (failed > 0) {
  process.exit(1);
}
