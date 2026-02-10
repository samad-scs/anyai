/**
 * Contract tests for ChatAdapter implementations.
 *
 * Tests behavior SHAPE, not model output.
 * Verifies adapters implement the required interface correctly.
 */
import { describe, expect, it } from "vitest";

// ** Application Service, Constants, and Type Imports
import type {
  ChatMessage,
  ChatResponse,
  ChatStreamChunk,
} from "../../src/core/types.js";
import type { ChatAdapter } from "../../src/adapters/types.js";

// ─── Reusable contract runner ────────────────────────────────────────────────

export function runChatAdapterContractTests(
  name: string,
  createAdapter: () => ChatAdapter,
) {
  describe(`ChatAdapter contract: ${name}`, () => {
    it("send() returns a normalized ChatResponse shape", async () => {
      const adapter = createAdapter();
      const messages: ChatMessage[] = [{ role: "user", content: "hello" }];

      const result: ChatResponse = await adapter.send(messages, "test-model");

      // Response message must have correct shape
      expect(result).toHaveProperty("message");
      expect(result.message).toHaveProperty("role");
      expect(result.message).toHaveProperty("content");
      expect(result.message.role).toBe("assistant");
      expect(typeof result.message.content).toBe("string");
    });

    it("send() handles system + user message history", async () => {
      const adapter = createAdapter();
      const messages: ChatMessage[] = [
        { role: "system", content: "you are helpful" },
        { role: "user", content: "hello" },
      ];

      const result = await adapter.send(messages, "test-model");

      expect(result.message.role).toBe("assistant");
      expect(typeof result.message.content).toBe("string");
    });

    it("send() returns usage when available", async () => {
      const adapter = createAdapter();
      const result = await adapter.send(
        [{ role: "user", content: "hello" }],
        "test-model",
      );

      // usage is optional but when present must have correct shape
      if (result.usage !== undefined) {
        if (result.usage.inputTokens !== undefined) {
          expect(typeof result.usage.inputTokens).toBe("number");
        }
        if (result.usage.outputTokens !== undefined) {
          expect(typeof result.usage.outputTokens).toBe("number");
        }
        if (result.usage.totalTokens !== undefined) {
          expect(typeof result.usage.totalTokens).toBe("number");
        }
      }
    });

    it("stream() yields ChatStreamChunk with correct semantics", async () => {
      const adapter = createAdapter();
      const messages: ChatMessage[] = [{ role: "user", content: "hello" }];

      const chunks: ChatStreamChunk[] = [];

      for await (const chunk of adapter.stream(messages, "test-model")) {
        chunks.push(chunk);
      }

      // Must have at least one chunk
      expect(chunks.length).toBeGreaterThan(0);

      // Last chunk must be { type: "done" }
      const lastChunk = chunks[chunks.length - 1];
      expect(lastChunk).toEqual({ type: "done" });

      // All non-done chunks must be deltas with string content
      const deltas = chunks.filter((c) => c.type === "delta");
      for (const d of deltas) {
        if (d.type === "delta") {
          expect(typeof d.delta).toBe("string");
          expect(d.delta.length).toBeGreaterThan(0);
        }
      }
    });
  });
}

// ─── Run contract tests with a mock adapter ──────────────────────────────────

function createMockAdapter(): ChatAdapter {
  return {
    async send(messages: ChatMessage[], _model: string): Promise<ChatResponse> {
      return {
        message: {
          role: "assistant",
          content: `Mock response to: ${messages[messages.length - 1]?.content ?? ""}`,
        },
        usage: {
          inputTokens: 10,
          outputTokens: 20,
          totalTokens: 30,
        },
      };
    },

    async *stream(
      messages: ChatMessage[],
      _model: string,
    ): AsyncIterable<ChatStreamChunk> {
      const content = `Mock response to: ${messages[messages.length - 1]?.content ?? ""}`;
      const words = content.split(" ");
      for (const word of words) {
        yield { type: "delta", delta: word + " " };
      }
      yield { type: "done" };
    },
  };
}

runChatAdapterContractTests("MockAdapter", createMockAdapter);
