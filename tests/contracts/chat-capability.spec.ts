/**
 * Contract tests for ChatCapability.
 *
 * Verifies that ChatCapability correctly delegates to the underlying
 * ChatAdapter without altering the contract shape.
 */
import { describe, expect, it, vi } from "vitest";

// ** Application Service, Constants, and Type Imports
import type {
  ChatMessage,
  ChatResponse,
  ChatStreamChunk,
} from "../../src/core/types.js";
import type { ChatAdapter } from "../../src/adapters/types.js";

// ** Custom Component Imports
import { ChatCapability } from "../../src/chat/index.js";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function createMockAdapter(): ChatAdapter {
  return {
    send: vi.fn(
      async (
        _messages: ChatMessage[],
        _model: string,
      ): Promise<ChatResponse> => ({
        message: { role: "assistant", content: "mock response" },
        usage: { inputTokens: 5, outputTokens: 10, totalTokens: 15 },
      }),
    ),

    stream: vi.fn(async function* (
      _messages: ChatMessage[],
      _model: string,
    ): AsyncIterable<ChatStreamChunk> {
      yield { type: "delta", delta: "mock " };
      yield { type: "delta", delta: "stream" };
      yield { type: "done" };
    }),
  };
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("ChatCapability", () => {
  it("send() delegates to adapter with correct arguments", async () => {
    const adapter = createMockAdapter();
    const capability = new ChatCapability(adapter, "test-model");

    const messages: ChatMessage[] = [{ role: "user", content: "hello" }];
    const result = await capability.send({ messages });

    expect(adapter.send).toHaveBeenCalledWith(messages, "test-model");
    expect(result.message.role).toBe("assistant");
    expect(typeof result.message.content).toBe("string");
  });

  it("send() passes the configured model to adapter", async () => {
    const adapter = createMockAdapter();
    const capability = new ChatCapability(adapter, "gemini-2.5-pro");

    await capability.send({
      messages: [{ role: "user", content: "test" }],
    });

    expect(adapter.send).toHaveBeenCalledWith(
      expect.any(Array),
      "gemini-2.5-pro",
    );
  });

  it("stream() delegates to adapter and returns AsyncIterable", async () => {
    const adapter = createMockAdapter();
    const capability = new ChatCapability(adapter, "test-model");

    const messages: ChatMessage[] = [{ role: "user", content: "hello" }];
    const chunks: ChatStreamChunk[] = [];

    for await (const chunk of capability.stream({ messages })) {
      chunks.push(chunk);
    }

    expect(adapter.stream).toHaveBeenCalledWith(messages, "test-model");
    expect(chunks.length).toBe(3);

    // deltas come first
    expect(chunks[0]).toEqual({ type: "delta", delta: "mock " });
    expect(chunks[1]).toEqual({ type: "delta", delta: "stream" });

    // done is last
    expect(chunks[2]).toEqual({ type: "done" });
  });

  it("send() returns ChatResponse with usage when adapter provides it", async () => {
    const adapter = createMockAdapter();
    const capability = new ChatCapability(adapter, "test-model");

    const result = await capability.send({
      messages: [{ role: "user", content: "hello" }],
    });

    expect(result.usage).toBeDefined();
    expect(result.usage?.inputTokens).toBe(5);
    expect(result.usage?.outputTokens).toBe(10);
    expect(result.usage?.totalTokens).toBe(15);
  });
});
