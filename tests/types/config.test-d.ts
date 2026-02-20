/**
 * Type-level tests for configuration types.
 *
 * These tests verify that the provider-model mapping, config shape,
 * and provider names compile correctly and reject invalid combinations.
 *
 * Run with: npm run test:types
 */

// ** Application Service, Constants, and Type Imports
import type {
  AIConfig,
  AnthropicModel,
  GeminiModel,
  OllamaModel,
  OpenAIModel,
  ProviderModelMap,
  ProviderName,
} from "../../src/core/types.js";

// ─── ProviderName is a union of known providers ──────────────────────────────

function testProviderName() {
  const gemini: ProviderName = "gemini";
  const openai: ProviderName = "openai";
  const anthropic: ProviderName = "anthropic";
  const ollama: ProviderName = "ollama";

  // @ts-expect-error — unknown provider
  const unknown: ProviderName = "mistral";
}

// ─── ProviderModelMap maps to correct model types ────────────────────────────

function testProviderModelMap() {
  const geminiModel: ProviderModelMap["gemini"] = "gemini-2.5-pro";
  const openaiModel: ProviderModelMap["openai"] = "gpt-4o";
  const anthropicModel: ProviderModelMap["anthropic"] = "claude-sonnet-4-5";
  const ollamaModel: ProviderModelMap["ollama"] = "llama3";

  // @ts-expect-error — wrong model for gemini
  const badGemini: ProviderModelMap["gemini"] = "gpt-4o";

  // @ts-expect-error — wrong model for openai
  const badOpenai: ProviderModelMap["openai"] = "gemini-2.5-pro";
}

// ─── Model enums contain expected values ─────────────────────────────────────

function testModelEnums() {
  // Gemini models
  const g1: GeminiModel = "gemini-2.5-pro";
  const g2: GeminiModel = "gemini-2.5-flash";
  const g3: GeminiModel = "gemini-2.0-flash";

  // OpenAI models
  const o1: OpenAIModel = "gpt-4.1";
  const o2: OpenAIModel = "gpt-4o";
  const o3: OpenAIModel = "gpt-5";
  const o4: OpenAIModel = "gpt-4.1-mini";

  // Anthropic models
  const a1: AnthropicModel = "claude-sonnet-4-5";
  const a2: AnthropicModel = "claude-haiku-4-5-20251001";

  // Ollama models — accepts any string
  const ol1: OllamaModel = "llama3";
  const ol2: OllamaModel = "mistral";
  const ol3: OllamaModel = "codellama";

  // @ts-expect-error — nonexistent model
  const bad: GeminiModel = "gemini-99";
}

// ─── AIConfig enforces provider-model coupling ───────────────────────────────

function testAIConfig() {
  // valid configs
  const geminiConfig: AIConfig<"gemini"> = {
    provider: "gemini",
    apiKey: "key",
    model: "gemini-2.5-pro",
  };

  const openaiConfig: AIConfig<"openai"> = {
    provider: "openai",
    apiKey: "key",
    model: "gpt-4o",
  };

  const mismatch: AIConfig<"gemini"> = {
    provider: "gemini",
    apiKey: "key",
    // @ts-expect-error — model doesn't match provider
    model: "gpt-4o",
  };

  // @ts-expect-error — missing apiKey
  const noKey: AIConfig<"gemini"> = {
    provider: "gemini",
    model: "gemini-2.5-pro",
  };

  // @ts-expect-error — missing model
  const noModel: AIConfig<"openai"> = {
    provider: "openai",
    apiKey: "key",
  };

  // ─── Ollama config — apiKey is NOT required ──────────────────────────────

  const ollamaMinimal: AIConfig<"ollama"> = {
    provider: "ollama",
    model: "llama3",
  };

  const ollamaWithBaseURL: AIConfig<"ollama"> = {
    provider: "ollama",
    model: "llama3",
    baseURL: "http://custom:8080",
  };

  const ollamaWithApiKey: AIConfig<"ollama"> = {
    provider: "ollama",
    model: "llama3",
    apiKey: "optional-key",
  };
}
