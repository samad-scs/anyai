import { describe, it, expect } from "vitest";
import { AI } from "../../src/index.js";
import { ChatCapability } from "../../src/capabilities/chat.js";

describe("AI Contract", () => {
  it("should expose chat capability synchronously", () => {
    const ai = new AI({
      provider: "ollama",
      model: "llama3",
    });

    expect(ai).toBeDefined();
    expect(ai.chat).toBeDefined();
    expect(ai.chat).toBeInstanceOf(ChatCapability);
  });

  it("should fail for invalid provider on first send()", async () => {
    const ai = new AI({
      provider: "invalid" as any,
      apiKey: "test",
      model: "gpt-4o",
    });

    // Error is deferred to first capability use
    await expect(
      ai.chat.send({ messages: [{ role: "user", content: "hello" }] }),
    ).rejects.toThrow();
  });
});

describe("Chat Capability", () => {
  it("should have send and stream methods", () => {
    const mockAdapter = {
      send: () =>
        Promise.resolve({
          message: { role: "assistant", content: "test" },
        } as any),
      stream: () => (async function* () {})(),
    } as any;

    const chat = new ChatCapability(() => Promise.resolve(mockAdapter), "model");
    expect(chat.send).toBeDefined();
    expect(chat.stream).toBeDefined();
  });
});
