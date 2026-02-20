// ** Application Service, Constants, and Type Imports
import type { ProviderName } from '../core/types.js'
import {
  ANTHROPIC_MODELS,
  GEMINI_MODELS,
  OLLAMA_MODELS,
  OPENAI_MODELS,
} from '../core/types.js'

// ─── Provider Metadata ───────────────────────────────────────────────────────

export interface ProviderMetadata {
  readonly provider: ProviderName
  readonly apiKeyReq: boolean
  readonly baseUrl: boolean
  readonly models: readonly string[]
}

// ─── Static Provider Registry ────────────────────────────────────────────────

const PROVIDER_REGISTRY: readonly ProviderMetadata[] = [
  {
    provider: 'anthropic',
    apiKeyReq: true,
    baseUrl: false,
    models: ANTHROPIC_MODELS,
  },
  {
    provider: 'gemini',
    apiKeyReq: true,
    baseUrl: false,
    models: GEMINI_MODELS,
  },
  {
    provider: 'ollama',
    apiKeyReq: false,
    baseUrl: true,
    models: OLLAMA_MODELS,
  },
  {
    provider: 'openai',
    apiKeyReq: true,
    baseUrl: false,
    models: OPENAI_MODELS,
  },
] as const

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Returns metadata about all supported AI providers and their models.
 *
 * Synchronous, tree-shake safe, and requires no provider SDK imports.
 */
export function getProviders(): readonly ProviderMetadata[] {
  return [...PROVIDER_REGISTRY]
}
