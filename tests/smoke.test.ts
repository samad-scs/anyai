import { describe, it, expect } from "vitest";
import { AI } from "../src/index.js";

describe("anyai smoke test", () => {
  it("should export AI class", () => {
    expect(AI).toBeDefined();
  });

  it("should throw on invalid provider on first send()", async () => {
    const ai = new AI({
      provider: "invalid" as any,
      apiKey: "test",
      model: "gpt-4o",
    });

    await expect(
      ai.chat.send({ messages: [{ role: "user", content: "hello" }] }),
    ).rejects.toThrow(/Unsupported provider/);
  });
});
