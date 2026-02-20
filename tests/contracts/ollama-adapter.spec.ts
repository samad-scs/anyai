/**
 * Contract tests for OllamaAdapter.
 *
 * Uses mocked fetch — does NOT call a real Ollama server.
 * Tests behavior shape, NDJSON stream parsing, and error wrapping.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// ** Application Service, Constants, and Type Imports
import type { ChatMessage, ChatStreamChunk } from "../../src/core/types.js";
import { AnyAIProviderError } from "../../src/core/errors.js";

// ** Provider Under Test
import { OllamaAdapter } from "../../src/providers/ollama/adapter.js";

// ** Contract Runner
import { runChatAdapterContractTests } from "./chat-adapter.spec.js";

// ─── Mock fetch globally ─────────────────────────────────────────────────────

const mockFetch = vi.fn();

beforeEach(() => {
  vi.stubGlobal("fetch", mockFetch);
});

afterEach(() => {
  mockFetch.mockReset();
  vi.restoreAllMocks();
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

function mockSendResponse(content: string) {
  mockFetch.mockResolvedValueOnce(
    new Response(
      JSON.stringify({
        model: "llama3",
        message: { role: "assistant", content },
        done: true,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    ),
  );
}

function mockStreamResponse(chunks: Array<{ content: string; done: boolean }>) {
  const lines = chunks
    .map((c) =>
      JSON.stringify({
        model: "llama3",
        message: { role: "assistant", content: c.content },
        done: c.done,
      }),
    )
    .join("\n");

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(lines));
      controller.close();
    },
  });

  mockFetch.mockResolvedValueOnce(
    new Response(stream, { status: 200 }),
  );
}

// ─── Run shared contract tests with mock adapter ─────────────────────────────

function createContractAdapter() {
  // Default mock: always return a valid response for contract runner
  mockFetch.mockImplementation(async (_url: string, init: RequestInit) => {
    const body = JSON.parse(init.body as string) as { stream: boolean };

    if (body.stream) {
      // Streaming response
      const lines = [
        JSON.stringify({ model: "llama3", message: { role: "assistant", content: "Hello " }, done: false }),
        JSON.stringify({ model: "llama3", message: { role: "assistant", content: "world" }, done: false }),
        JSON.stringify({ model: "llama3", message: { role: "assistant", content: "" }, done: true }),
      ].join("\n");

      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode(lines));
          controller.close();
        },
      });

      return new Response(stream, { status: 200 });
    }

    // Non-streaming response
    return new Response(
      JSON.stringify({
        model: "llama3",
        message: { role: "assistant", content: "Mock response" },
        done: true,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  });

  return new OllamaAdapter("http://localhost:11434");
}

runChatAdapterContractTests("OllamaAdapter", createContractAdapter);

// ─── Ollama-specific tests ───────────────────────────────────────────────────

describe("OllamaAdapter — specific behavior", () => {
  it("constructs with default baseURL", () => {
    const adapter = new OllamaAdapter();
    expect(adapter).toBeDefined();
  });

  it("constructs with custom baseURL", () => {
    const adapter = new OllamaAdapter("http://custom:8080");
    expect(adapter).toBeDefined();
  });

  it("sends correct request body for non-stream", async () => {
    mockSendResponse("response");
    const adapter = new OllamaAdapter();
    const messages: ChatMessage[] = [{ role: "user", content: "hello" }];

    await adapter.send(messages, "llama3");

    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:11434/api/chat",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          model: "llama3",
          messages: [{ role: "user", content: "hello" }],
          stream: false,
        }),
      }),
    );
  });

  it("send() returns usage as undefined", async () => {
    mockSendResponse("response");
    const adapter = new OllamaAdapter();

    const result = await adapter.send(
      [{ role: "user", content: "hello" }],
      "llama3",
    );

    expect(result.usage).toBeUndefined();
  });

  it("send() wraps HTTP errors", async () => {
    mockFetch.mockResolvedValueOnce(
      new Response("Server Error", { status: 500 }),
    );

    const adapter = new OllamaAdapter();
    await expect(
      adapter.send([{ role: "user", content: "hello" }], "llama3"),
    ).rejects.toThrow(AnyAIProviderError);
  });

  it("send() wraps network errors", async () => {
    mockFetch.mockRejectedValueOnce(new Error("ECONNREFUSED"));

    const adapter = new OllamaAdapter();
    await expect(
      adapter.send([{ role: "user", content: "hello" }], "llama3"),
    ).rejects.toThrow(AnyAIProviderError);
  });

  it("send() wraps JSON parse errors", async () => {
    mockFetch.mockResolvedValueOnce(
      new Response("not json", { status: 200 }),
    );

    const adapter = new OllamaAdapter();
    await expect(
      adapter.send([{ role: "user", content: "hello" }], "llama3"),
    ).rejects.toThrow(AnyAIProviderError);
  });

  it("stream() parses newline-delimited JSON correctly", async () => {
    mockStreamResponse([
      { content: "Hello ", done: false },
      { content: "world", done: false },
      { content: "", done: true },
    ]);

    const adapter = new OllamaAdapter();
    const chunks: ChatStreamChunk[] = [];

    for await (const chunk of adapter.stream(
      [{ role: "user", content: "hi" }],
      "llama3",
    )) {
      chunks.push(chunk);
    }

    expect(chunks).toEqual([
      { type: "delta", delta: "Hello " },
      { type: "delta", delta: "world" },
      { type: "done" },
    ]);
  });

  it("stream() handles empty lines gracefully", async () => {
    const lines = [
      JSON.stringify({ model: "llama3", message: { role: "assistant", content: "hi" }, done: false }),
      "",
      "",
      JSON.stringify({ model: "llama3", message: { role: "assistant", content: "" }, done: true }),
    ].join("\n");

    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(lines));
        controller.close();
      },
    });

    mockFetch.mockResolvedValueOnce(new Response(stream, { status: 200 }));

    const adapter = new OllamaAdapter();
    const chunks: ChatStreamChunk[] = [];

    for await (const chunk of adapter.stream(
      [{ role: "user", content: "hi" }],
      "llama3",
    )) {
      chunks.push(chunk);
    }

    expect(chunks[0]).toEqual({ type: "delta", delta: "hi" });
    expect(chunks[chunks.length - 1]).toEqual({ type: "done" });
  });

  it("stream() wraps HTTP errors", async () => {
    mockFetch.mockResolvedValueOnce(
      new Response("Bad Request", { status: 400 }),
    );

    const adapter = new OllamaAdapter();

    try {
      for await (const _chunk of adapter.stream(
        [{ role: "user", content: "hello" }],
        "llama3",
      )) {
        // consume
      }
      // Should not reach here
      expect.unreachable("Expected AnyAIProviderError");
    } catch (error) {
      expect(error).toBeInstanceOf(AnyAIProviderError);
    }
  });

  it("stream() wraps network errors", async () => {
    mockFetch.mockRejectedValueOnce(new Error("ECONNREFUSED"));

    const adapter = new OllamaAdapter();

    try {
      for await (const _chunk of adapter.stream(
        [{ role: "user", content: "hello" }],
        "llama3",
      )) {
        // consume
      }
      // Should not reach here
      expect.unreachable("Expected AnyAIProviderError");
    } catch (error) {
      expect(error).toBeInstanceOf(AnyAIProviderError);
    }
  });
});
