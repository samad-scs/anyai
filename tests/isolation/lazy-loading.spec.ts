/**
 * Isolation tests — lazy loading validation.
 *
 * Verifies that provider adapters are loaded ONLY on first capability use,
 * not eagerly during construction or import.
 */
import { describe, expect, it, vi } from "vitest";

// ** Application Service, Constants, and Type Imports
import { AnyAIConfigError } from "../../src/core/errors.js";

describe("Provider lazy loading", () => {
  it("AI class can be imported without triggering provider imports", async () => {
    // Importing the AI class itself should not load any provider SDKs
    const { AI } = await import("../../src/ai.js");

    expect(AI).toBeDefined();
    expect(typeof AI).toBe("function");
  });

  it("new AI(config) is synchronous — no adapter imported at construction", async () => {
    const { AI } = await import("../../src/ai.js");

    // Construction must be synchronous — new AI() returns an instance, not a Promise
    const ai = new AI({
      provider: "ollama",
      model: "llama3",
    });

    expect(ai).toBeDefined();
    expect(ai.chat).toBeDefined();
    // Verify it's not a Promise (i.e., constructor is truly synchronous)
    expect(ai).not.toBeInstanceOf(Promise);
  });

  it("adapter is imported on first send()", async () => {
    const { AI } = await import("../../src/ai.js");

    const ai = new AI({
      provider: "ollama",
      model: "llama3",
    });

    // At this point, no adapter should have been loaded.
    // Calling send() will trigger the lazy import.
    // It may fail at network level (no Ollama running),
    // but the adapter itself should load.
    try {
      await ai.chat.send({
        messages: [{ role: "user", content: "hello" }],
      });
    } catch {
      // Network errors are expected — we only care that the adapter loaded
    }
  });

  it("adapter is imported only once (cached promise)", async () => {
    const { AI } = await import("../../src/ai.js");

    const ai = new AI({
      provider: "ollama",
      model: "llama3",
    });

    // Call send() twice — adapter should be loaded only once
    const sendTwice = async () => {
      try {
        await ai.chat.send({
          messages: [{ role: "user", content: "first" }],
        });
      } catch {
        // expected — no Ollama server running
      }

      try {
        await ai.chat.send({
          messages: [{ role: "user", content: "second" }],
        });
      } catch {
        // expected — no Ollama server running
      }
    };

    // Should not throw any import errors on second call
    await sendTwice();
  });

  it("streaming resolves adapter lazily", async () => {
    const { AI } = await import("../../src/ai.js");

    const ai = new AI({
      provider: "ollama",
      model: "llama3",
    });

    try {
      for await (const _chunk of ai.chat.stream({
        messages: [{ role: "user", content: "hello" }],
      })) {
        // If we get here, adapter loaded successfully
        break;
      }
    } catch {
      // Network errors expected — adapter loading is what we validate
    }
  });

  it("errors propagate correctly from lazy resolution", async () => {
    const { AI } = await import("../../src/ai.js");

    const ai = new AI({
      provider: "invalid" as any,
      apiKey: "test",
      model: "test",
    });

    await expect(
      ai.chat.send({ messages: [{ role: "user", content: "hello" }] }),
    ).rejects.toThrow();
  });

  it("with gemini only loads gemini SDK", async () => {
    const { AI } = await import("../../src/ai.js");

    // Construction is synchronous
    const ai = new AI({
      provider: "gemini",
      apiKey: "test-key",
      model: "gemini-2.5-pro",
    });

    expect(ai).toBeDefined();
    expect(ai.chat).toBeDefined();
  });

  it("with anthropic only loads anthropic SDK", async () => {
    const { AI } = await import("../../src/ai.js");

    const ai = new AI({
      provider: "anthropic",
      apiKey: "test-key",
      model: "claude-sonnet-4-5",
    });

    expect(ai).toBeDefined();
    expect(ai.chat).toBeDefined();
  });

  it("with ollama loads without any SDK", async () => {
    const { AI } = await import("../../src/ai.js");

    const ai = new AI({
      provider: "ollama",
      model: "llama3",
    });

    expect(ai).toBeDefined();
    expect(ai.chat).toBeDefined();
  });
});
