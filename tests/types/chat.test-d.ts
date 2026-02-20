/**
 * Type-level tests for the Chat capability.
 *
 * These tests verify that the public API surface compiles correctly
 * and rejects invalid inputs at the type level.
 *
 * Run with: npm run test:types
 */

// ** Application Service, Constants, and Type Imports
import type {
  ChatMessage,
  ChatResponse,
  ChatStreamChunk,
} from "../../src/core/types.js";

import { AI } from "../../src/ai.js";

// ─── new AI() with valid Gemini config ───────────────────────────────────────

function testGeminiConfig() {
  const ai = new AI({
    provider: "gemini",
    apiKey: "test-key",
    model: "gemini-2.5-pro",
  });

  // chat capability should exist
  const _chat: typeof ai.chat = ai.chat;

  // send should accept valid messages
  const response: Promise<ChatResponse> = ai.chat.send({
    messages: [{ role: "user", content: "hello" }],
  });

  // stream should return AsyncIterable
  const stream: AsyncIterable<ChatStreamChunk> = ai.chat.stream({
    messages: [{ role: "user", content: "hello" }],
  });
}

// ─── new AI() with valid OpenAI config ───────────────────────────────────────

function testOpenAIConfig() {
  const ai = new AI({
    provider: "openai",
    apiKey: "test-key",
    model: "gpt-4o",
  });
}

// ─── Invalid configs should fail ─────────────────────────────────────────────

function testInvalidConfigs() {
  // @ts-expect-error — missing required fields
  new AI({});

  new AI({
    // @ts-expect-error — invalid provider name
    provider: "invalid-provider",
    apiKey: "test-key",
    model: "gpt-4o",
  });

  new AI({
    provider: "gemini",
    apiKey: "test-key",
    // @ts-expect-error — mismatched provider/model combination
    model: "gpt-4o",
  });

  // @ts-expect-error — missing apiKey
  new AI({
    provider: "gemini",
    model: "gemini-2.5-pro",
  });
}

// ─── Invalid send input should fail ──────────────────────────────────────────

function testInvalidSendInput() {
  const ai = new AI({
    provider: "gemini",
    apiKey: "test-key",
    model: "gemini-2.5-pro",
  });

  // @ts-expect-error — invalid input shape
  ai.chat.send({ foo: "bar" });

  // @ts-expect-error — missing messages
  ai.chat.send({});

  ai.chat.send({
    // @ts-expect-error — invalid message role
    messages: [{ role: "invalid", content: "hello" }],
  });
}

// ─── ChatMessage shape validation ────────────────────────────────────────────

function testChatMessageShape() {
  const validMessage: ChatMessage = {
    role: "user",
    content: "hello",
  };

  const assistantMessage: ChatMessage = {
    role: "assistant",
    content: "response",
  };

  const systemMessage: ChatMessage = {
    role: "system",
    content: "you are helpful",
  };

  const invalidMessage: ChatMessage = {
    // @ts-expect-error — invalid role
    role: "bot",
    content: "hello",
  };
}

// ─── ChatResponse shape validation ───────────────────────────────────────────

function testChatResponseShape() {
  // valid response without usage
  const response1: ChatResponse = {
    message: { role: "assistant", content: "hello" },
  };

  // valid response with usage
  const response2: ChatResponse = {
    message: { role: "assistant", content: "hello" },
    usage: {
      inputTokens: 10,
      outputTokens: 20,
      totalTokens: 30,
    },
  };
}

// ─── ChatStreamChunk shape validation ────────────────────────────────────────

function testStreamChunkShape() {
  const delta: ChatStreamChunk = { type: "delta", delta: "hello" };
  const done: ChatStreamChunk = { type: "done" };

  // @ts-expect-error — invalid chunk type
  const invalid: ChatStreamChunk = { type: "error" };
}
