import { describe, it, expect } from "vitest";
import { AI } from "../../src/index.js";
import { ChatCapability } from "../../src/capabilities/chat.js";

describe("AI Contract", () => {
  it("should expose chat capability", async () => {
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
    // We use a cast here because we don't want to create a full mock adapter for this simple check
    // and we are just checking the class definition prototype or instantiation
    const mockAdapter = {
      send: () =>
        Promise.resolve({
          message: { role: "assistant", content: "test" },
        } as any),
      stream: () => (async function* () {})(),
    } as any;

    const chat = new ChatCapability(mockAdapter, "model");
    expect(chat.send).toBeDefined();
    expect(chat.stream).toBeDefined();
  });
});
