// ─── Provider Model Enums ────────────────────────────────────────────────────

export type GeminiModel =
  | "gemini-2.0-flash-lite"
  | "gemini-2.0-flash"
  | "gemini-2.5-pro"
  | "gemini-2.5-flash-lite"
  | "gemini-2.5-flash"
  | "gemini-3-flash-preview"
  | "gemini-3-pro-preview";

export type OpenAIModel =
  | "gpt-4.1"
  | "gpt-4.1-mini"
  | "gpt-4.1-nano"
  | "gpt-4o"
  | "gpt-4o-mini"
  | "gpt-5"
  | "gpt-5.2";

export type AnthropicModel =
  | "claude-haiku-4-5-20251001"
  | "claude-sonnet-4-5"
  | "claude-opus-4-6";

// ─── Provider → Model Mapping ────────────────────────────────────────────────

export interface ProviderModelMap {
  gemini: GeminiModel;
  openai: OpenAIModel;
  anthropic: AnthropicModel;
}

export type ProviderName = keyof ProviderModelMap;

// ─── Configuration ───────────────────────────────────────────────────────────

export interface AIConfig<P extends ProviderName = ProviderName> {
  provider: P;
  apiKey: string;
  model: ProviderModelMap[P];
}

// ─── Chat Types ──────────────────────────────────────────────────────────────

export type ChatRole = "system" | "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ChatResponse {
  message: ChatMessage;
  usage?:
    | {
        inputTokens?: number | undefined;
        outputTokens?: number | undefined;
        totalTokens?: number | undefined;
      }
    | undefined;
}

export type ChatStreamChunk =
  | { type: "delta"; delta: string }
  | { type: "done" };
