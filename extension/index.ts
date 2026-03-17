/**
 * IRS Resolution Pod — OpenClaw Extension
 *
 * Provides a read-only "irs_pod_status" tool that delegates to the existing
 * builder_dispatch → dispatch-to-builder.sh → tax-status pipeline.
 *
 * Hard constraints:
 *   - Both agents default to DISABLED (env flags)
 *   - Only read-only tax-status is callable; tax-sync and tax-analyze are blocked
 *   - Kill switch is checked by dispatch-to-builder.sh (not bypassed)
 *   - No new npm dependencies; Node built-ins only
 *   - No Drive/Sheets writes; no new network operations
 */

import type { OpenClawPluginApi } from "openclaw/plugin-sdk";
import { emptyPluginConfigSchema } from "openclaw/plugin-sdk";
import { execFile } from "node:child_process";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const DISPATCH_SCRIPT = "/root/bin/dispatch-to-builder.sh";
const TIMEOUT_MS = 60_000;

// ── Registry ──

interface AgentEntry {
  display_name: string;
  pod: string;
  role: string;
  enabled_env: string;
  enabled_default: boolean;
  description: string;
  capabilities: {
    allowed: string[];
    forbidden: string[];
  };
}

interface Registry {
  agents: Record<string, AgentEntry>;
  pod_config: {
    kill_switch_required: boolean;
    write_operations: string;
  };
}

function loadRegistry(): Registry {
  const raw = readFileSync(join(__dirname, "registry.json"), "utf-8");
  return JSON.parse(raw);
}

function isAgentEnabled(agent: AgentEntry): boolean {
  const envVal = process.env[agent.enabled_env];
  if (envVal === undefined || envVal === "") return agent.enabled_default;
  return envVal === "true" || envVal === "1";
}

function isPodEnabled(): boolean {
  const reg = loadRegistry();
  return Object.values(reg.agents).some((a) => isAgentEnabled(a));
}

// ── Write-intent detection ──

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

function hasWriteIntent(text: string): boolean {
  const lower = text.toLowerCase();
  return WRITE_INTENTS.some((w) => lower.includes(w));
}

// ── Dispatch helper (reuses same sudo pattern as builder-dispatch) ──

function runDispatch(
  args: string[]
): Promise<{ exitCode: number; stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    execFile(
      "sudo",
      [DISPATCH_SCRIPT, ...args],
      { timeout: TIMEOUT_MS },
      (err, stdout, stderr) => {
        const exitCode =
          err && "code" in err ? ((err as any).code ?? 1) : err ? 1 : 0;
        resolve({
          exitCode,
          stdout: stdout ?? "",
          stderr: stderr ?? "",
        });
      }
    );
  });
}

function redact(s: string): string {
  return s
    .replace(/Bearer\s+\S+/g, "Bearer [REDACTED]")
    .replace(/token[\"']?\s*[:=]\s*[\"']?\S+/gi, "token: [REDACTED]");
}

// ── Audit event helper ──

function auditEvent(
  action: string,
  details: Record<string, unknown>
): Record<string, unknown> {
  return {
    timestamp: new Date().toISOString(),
    pod: "irs-resolution",
    action,
    ...details,
  };
}

// ── Plugin ──

const plugin = {
  id: "irs-pod",
  name: "IRS Resolution Pod",
  description:
    "Read-only scaffolding for IRS Resolution Pod agents (tax-vault-operator, irs-specialist). Both agents are DISABLED by default.",
  configSchema: emptyPluginConfigSchema(),

  register(api: OpenClawPluginApi) {
    // ── Tool: irs_pod_status ──
    api.registerTool({
      name: "irs_pod_status",
      label: "IRS Pod Status",
      description:
        "Check IRS Resolution Pod status and Tax Module health. Read-only. " +
        "Returns: pod enable/disable state, agent registry, and Tax Module status from Builder. " +
        "This tool ONLY calls tax-status (read-only). It cannot invoke tax-sync or tax-analyze.",
      parameters: {
        type: "object" as const,
        properties: {
          action: {
            type: "string" as const,
            enum: ["pod_status", "tax_module_status", "registry"],
            description:
              "Action: 'pod_status' for full pod state, 'tax_module_status' for Builder tax-status, 'registry' for agent config",
          },
        },
        required: ["action"],
      },
      async execute(
        _toolCallId: string,
        params: { action: string }
      ) {
        const { action } = params;
        const reg = loadRegistry();
        const audit = auditEvent("tool_call", {
          tool: "irs_pod_status",
          action,
        });

        // ── Action: registry ──
        if (action === "registry") {
          const agentStates: Record<string, unknown> = {};
          for (const [id, agent] of Object.entries(reg.agents)) {
            agentStates[id] = {
              display_name: agent.display_name,
              role: agent.role,
              enabled: isAgentEnabled(agent),
              enabled_env: agent.enabled_env,
              allowed_capabilities: agent.capabilities.allowed,
              forbidden_capabilities: agent.capabilities.forbidden,
            };
          }
          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify(
                  {
                    ok: true,
                    action: "registry",
                    pod: "irs-resolution",
                    write_operations: reg.pod_config.write_operations,
                    agents: agentStates,
                    audit,
                  },
                  null,
                  2
                ),
              },
            ],
          };
        }

        // ── Action: tax_module_status ──
        if (action === "tax_module_status") {
          const { exitCode, stdout, stderr } = await runDispatch([
            "tax-status",
          ]);
          if (exitCode !== 0) {
            return {
              content: [
                {
                  type: "text" as const,
                  text: JSON.stringify({
                    ok: false,
                    action: "tax_module_status",
                    error_code: `exit_${exitCode}`,
                    error_message: redact(stderr || stdout).substring(0, 500),
                    note: "dispatch-to-builder.sh may be unavailable or kill switch is active",
                    audit,
                  }),
                },
              ],
            };
          }
          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify({
                  ok: true,
                  action: "tax_module_status",
                  source: "dispatch-to-builder.sh tax-status",
                  output: redact(stdout).substring(0, 3000),
                  audit,
                }),
              },
            ],
          };
        }

        // ── Action: pod_status (default) ──
        if (action === "pod_status") {
          const podEnabled = isPodEnabled();
          const agentStates: Record<string, unknown> = {};
          for (const [id, agent] of Object.entries(reg.agents)) {
            agentStates[id] = {
              enabled: isAgentEnabled(agent),
              role: agent.role,
            };
          }

          // Also get live tax-status if pod is enabled
          let taxStatus: Record<string, unknown> | null = null;
          if (podEnabled) {
            try {
              const { exitCode, stdout, stderr } = await runDispatch([
                "tax-status",
              ]);
              taxStatus = {
                ok: exitCode === 0,
                exit_code: exitCode,
                output: exitCode === 0
                  ? redact(stdout).substring(0, 2000)
                  : redact(stderr || stdout).substring(0, 500),
              };
            } catch {
              taxStatus = { ok: false, error: "dispatch unavailable" };
            }
          }

          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify(
                  {
                    ok: true,
                    action: "pod_status",
                    pod: "irs-resolution",
                    pod_enabled: podEnabled,
                    write_operations: reg.pod_config.write_operations,
                    kill_switch_required: reg.pod_config.kill_switch_required,
                    agents: agentStates,
                    tax_module: podEnabled
                      ? taxStatus
                      : "SKIPPED (pod disabled — no live dispatch)",
                    audit,
                  },
                  null,
                  2
                ),
              },
            ],
          };
        }

        // ── Unknown action ──
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                ok: false,
                action,
                error_code: "unknown_action",
                error_message: `Unknown action '${action}'. Use 'pod_status', 'tax_module_status', or 'registry'.`,
                audit,
              }),
            },
          ],
        };
      },
    });

    // ── Tool: irs_pod_query (write-blocked query tool) ──
    api.registerTool({
      name: "irs_pod_query",
      label: "IRS Pod Query",
      description:
        "Query the IRS Resolution Pod. Currently read-only only. " +
        "Any request containing write intents (sync, analyze, write, create, update, delete) " +
        "will be BLOCKED. This is by design — write operations are not yet implemented.",
      parameters: {
        type: "object" as const,
        properties: {
          query: {
            type: "string" as const,
            description: "The query to execute against the IRS pod",
          },
        },
        required: ["query"],
      },
      async execute(
        _toolCallId: string,
        params: { query: string }
      ) {
        const { query } = params;
        const audit = auditEvent("tool_call", {
          tool: "irs_pod_query",
          query_length: query.length,
        });

        // Block write intents
        if (hasWriteIntent(query)) {
          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify({
                  ok: false,
                  blocked: true,
                  reason: "WRITE_INTENT_DETECTED",
                  message:
                    "Write operations are not implemented in the IRS Pod scaffold. " +
                    "Only read-only queries (tax-status) are available. " +
                    "Write capabilities require a separate implementation port with approval.",
                  detected_intents: WRITE_INTENTS.filter((w) =>
                    query.toLowerCase().includes(w)
                  ),
                  audit,
                }),
              },
            ],
          };
        }

        // Check pod enabled
        if (!isPodEnabled()) {
          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify({
                  ok: false,
                  reason: "POD_DISABLED",
                  message:
                    "IRS Resolution Pod agents are disabled. " +
                    "Set IRS_TAX_VAULT_OPERATOR_ENABLED=true and/or IRS_IRS_SPECIALIST_ENABLED=true to enable.",
                  audit,
                }),
              },
            ],
          };
        }

        // For now, all read queries route through tax-status
        const { exitCode, stdout, stderr } = await runDispatch(["tax-status"]);
        if (exitCode !== 0) {
          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify({
                  ok: false,
                  error_code: `exit_${exitCode}`,
                  error_message: redact(stderr || stdout).substring(0, 500),
                  audit,
                }),
              },
            ],
          };
        }
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                ok: true,
                source: "tax-status (read-only)",
                output: redact(stdout).substring(0, 3000),
                audit,
              }),
            },
          ],
        };
      },
    });
  },
};

export default plugin;
