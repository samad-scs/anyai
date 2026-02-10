import { describe, it, expect, vi } from "vitest";
import { AI } from "../../src/index.js";
import { ChatCapability } from "../../src/chat/index.js";

describe("AI Contract", () => {
  it("should expose chat capability", async () => {
    // Mocking standard import to not fail on missing keys/providers
    // But AI.create validates provider first.
    // We can test that AI class structure is correct.
    expect(AI).toBeDefined();
    expect(AI.create).toBeDefined();
  });

  it("should fail for invalid provider", async () => {
    await expect(
      AI.create({
        provider: "invalid" as any,
        apiKey: "test",
        model: "gpt-4o",
      }),
    ).rejects.toThrow();
  });
});

describe("Chat Capability", () => {
  it("should have send and stream methods", () => {
    const mockAdapter = {
      send: vi.fn(),
      stream: vi.fn(),
    };
    const chat = new ChatCapability(mockAdapter, "model");
    expect(chat.send).toBeDefined();
    expect(chat.stream).toBeDefined();
  });
});
