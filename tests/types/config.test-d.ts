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
  OpenAIModel,
  ProviderModelMap,
  ProviderName,
} from "../../src/core/types.js";

// ─── ProviderName is a union of known providers ──────────────────────────────

function testProviderName() {
  const gemini: ProviderName = "gemini";
  const openai: ProviderName = "openai";
  const anthropic: ProviderName = "anthropic";

  // @ts-expect-error — unknown provider
  const unknown: ProviderName = "mistral";
}

// ─── ProviderModelMap maps to correct model types ────────────────────────────

function testProviderModelMap() {
  const geminiModel: ProviderModelMap["gemini"] = "gemini-2.5-pro";
  const openaiModel: ProviderModelMap["openai"] = "gpt-4o";
  const anthropicModel: ProviderModelMap["anthropic"] =
    "claude-sonnet-4-20250514";

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
  const o3: OpenAIModel = "o3";
  const o4: OpenAIModel = "o4-mini";

  // Anthropic models
  const a1: AnthropicModel = "claude-sonnet-4-20250514";
  const a2: AnthropicModel = "claude-3.5-sonnet-20241022";

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
}
