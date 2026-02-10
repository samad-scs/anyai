// ─── Provider Model Enums ────────────────────────────────────────────────────

export type GeminiModel =
  | "gemini-2.5-pro"
  | "gemini-2.5-flash"
  | "gemini-2.5-flash-lite-preview-06-17"
  | "gemini-2.0-flash"
  | "gemini-2.0-flash-lite"
  | "gemini-2.0-flash-preview-image-generation"
  | "gemini-2.0-flash-live-001";

export type OpenAIModel =
  | "gpt-4.1"
  | "gpt-4.1-mini"
  | "gpt-4.1-nano"
  | "gpt-4o"
  | "gpt-4o-mini"
  | "o3"
  | "o3-mini"
  | "o4-mini";

export type AnthropicModel =
  | "claude-sonnet-4-20250514"
  | "claude-haiku-4-20250514"
  | "claude-3.5-sonnet-20241022"
  | "claude-3.5-haiku-20241022"
  | "claude-3-opus-20240229";

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
