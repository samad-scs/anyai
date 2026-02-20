// ** Application Service, Constants, and Type Imports
import type { ProviderName } from "../core/types.js";

// ─── Provider Metadata ───────────────────────────────────────────────────────

export interface ProviderMetadata {
  readonly provider: ProviderName;
  readonly apiKeyReq: boolean;
  readonly baseUrl: boolean;
  readonly models: readonly string[];
}

// ─── Static Provider Registry ────────────────────────────────────────────────

const PROVIDER_REGISTRY: readonly ProviderMetadata[] = [
  {
    provider: "anthropic",
    apiKeyReq: true,
    baseUrl: false,
    models: [
      "claude-haiku-4-5-20251001",
      "claude-sonnet-4-5",
      "claude-opus-4-6",
    ],
  },
  {
    provider: "gemini",
    apiKeyReq: true,
    baseUrl: false,
    models: [
      "gemini-2.0-flash-lite",
      "gemini-2.0-flash",
      "gemini-2.5-pro",
      "gemini-2.5-flash-lite",
      "gemini-2.5-flash",
      "gemini-3-flash-preview",
      "gemini-3-pro-preview",
    ],
  },
  {
    provider: "ollama",
    apiKeyReq: false,
    baseUrl: true,
    models: ["llama3"],
  },
  {
    provider: "openai",
    apiKeyReq: true,
    baseUrl: false,
    models: [
      "gpt-4.1",
      "gpt-4.1-mini",
      "gpt-4.1-nano",
      "gpt-4o",
      "gpt-4o-mini",
      "gpt-5",
      "gpt-5.2",
    ],
  },
] as const;

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Returns metadata about all supported AI providers and their models.
 *
 * Synchronous, tree-shake safe, and requires no provider SDK imports.
 */
export function getProviders(): readonly ProviderMetadata[] {
  return [...PROVIDER_REGISTRY];
}
