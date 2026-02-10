import { describe, it, expect } from "vitest";
import { AI } from "../src/index.js";

describe("anyai smoke test", () => {
  it("should export AI class", () => {
    expect(AI).toBeDefined();
  });

  it("should throw on invalid provider", async () => {
    await expect(
      AI.create({
        provider: "invalid" as any,
        apiKey: "test",
        model: "gpt-4o",
      }),
    ).rejects.toThrow(/Unsupported provider/);
  });
});
