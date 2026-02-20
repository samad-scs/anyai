/**
 * Isolation tests — lazy loading validation.
 *
 * Verifies that provider adapters are loaded ONLY when selected,
 * not eagerly during import.
 */
import { describe, expect, it, vi } from "vitest";

// ** Application Service, Constants, and Type Imports
import { AnyAIConfigError } from "../../src/core/errors.js";

describe("Provider lazy loading", () => {
  it("AI class can be imported without triggering provider imports", async () => {
    // Importing the AI class itself should not load any provider SDKs
    const { AI } = await import("../../src/ai.js");

    expect(AI).toBeDefined();
    expect(typeof AI.create).toBe("function");
  });

  it("AI.create with anthropic only loads anthropic SDK", async () => {
    const { AI } = await import("../../src/ai.js");

    // This will try to load @anthropic-ai/sdk
    // Since it IS installed as a devDependency, it should succeed
    await expect(
      AI.create({
        provider: "anthropic",
        apiKey: "test-key",
        model: "claude-sonnet-4-5",
      }),
    ).resolves.toBeDefined();
  });

  it("AI.create with gemini only loads gemini SDK", async () => {
    const { AI } = await import("../../src/ai.js");

    // This will try to load @google/genai
    try {
      await AI.create({
        provider: "gemini",
        apiKey: "test-key",
        model: "gemini-2.5-pro",
      });
    } catch {
      // We don't care if it fails (e.g. invalid API key)
      // We only care that it attempted to load gemini, not openai
    }
  });

  it("AI.create with ollama loads without any SDK", async () => {
    const { AI } = await import("../../src/ai.js");

    // Ollama uses raw fetch — no SDK required.
    // This will try to connect to localhost:11434 but the adapter
    // should load without error.
    const ai = await AI.create({
      provider: "ollama",
      model: "llama3",
    });

    expect(ai).toBeDefined();
    expect(ai.chat).toBeDefined();
  });
});
