// ─── Provider Model Constants (Single Source of Truth) ───────────────────────

export const GEMINI_MODELS = [
  'gemini-2.0-flash-lite',
  'gemini-2.0-flash',
  'gemini-2.5-pro',
  'gemini-2.5-flash-lite',
  'gemini-2.5-flash',
  'gemini-3-flash-preview',
  'gemini-3-pro-preview',
] as const

export const OPENAI_MODELS = [
  'gpt-4.1',
  'gpt-4.1-mini',
  'gpt-4.1-nano',
  'gpt-4o',
  'gpt-4o-mini',
  'gpt-5',
  'gpt-5.2',
] as const

export const ANTHROPIC_MODELS = [
  'claude-haiku-4-5-20251001',
  'claude-sonnet-4-5',
  'claude-opus-4-6',
] as const

export const OLLAMA_MODELS = ['llama3'] as const

// ─── Derived Model Types ─────────────────────────────────────────────────────

export type GeminiModel = (typeof GEMINI_MODELS)[number]
export type OpenAIModel = (typeof OPENAI_MODELS)[number]
export type AnthropicModel = (typeof ANTHROPIC_MODELS)[number]
export type OllamaModel = string

// ─── Provider → Model Mapping ────────────────────────────────────────────────

export interface ProviderModelMap {
  gemini: GeminiModel
  openai: OpenAIModel
  anthropic: AnthropicModel
  ollama: OllamaModel
}

export type ProviderName = keyof ProviderModelMap

// ─── Configuration ───────────────────────────────────────────────────────────

export type AIConfig<P extends ProviderName = ProviderName> = P extends 'ollama'
  ? {
      provider: P
      model: ProviderModelMap[P]
      apiKey?: string | undefined
      baseURL?: string | undefined
    }
  : {
      provider: P
      model: ProviderModelMap[P]
      apiKey: string
      baseURL?: string | undefined
    }

// ─── Chat Types ──────────────────────────────────────────────────────────────

export type ChatRole = 'system' | 'user' | 'assistant'

export interface ChatMessage {
  role: ChatRole
  content: string
}

export interface ChatResponse {
  message: ChatMessage
  usage?:
    | {
        inputTokens?: number | undefined
        outputTokens?: number | undefined
        totalTokens?: number | undefined
      }
    | undefined
}

export type ChatStreamChunk =
  | { type: 'delta'; delta: string }
  | { type: 'done' }
