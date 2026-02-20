/**
 * Isolation tests — dependency boundary validation.
 *
 * Verifies that importing anyai core does NOT require
 * provider SDKs to be installed.
 */
import { describe, expect, it } from "vitest";

describe("Dependency isolation", () => {
  it("core types can be imported without provider SDKs", async () => {
    const types = await import("../../src/core/types.js");

    // types module should export type definitions (runtime will be empty,
    // but the import itself must not throw)
    expect(types).toBeDefined();
  });

  it("errors module can be imported without provider SDKs", async () => {
    const errors = await import("../../src/core/errors.js");

    expect(errors.AnyAIError).toBeDefined();
    expect(errors.AnyAIProviderError).toBeDefined();
    expect(errors.AnyAIConfigError).toBeDefined();
    expect(errors.AnyAIUnsupportedError).toBeDefined();
    expect(errors.AnyAIErrorCode).toBeDefined();
  });

  it("capabilities module can be imported without provider SDKs", async () => {
    const chat = await import("../../src/capabilities/chat.js");

    expect(chat.ChatCapability).toBeDefined();
  });

  it("main index can be imported without provider SDKs", async () => {
    const index = await import("../../src/index.js");

    expect(index.AI).toBeDefined();
    expect(index.AnyAIError).toBeDefined();
    expect(index.AnyAIErrorCode).toBeDefined();
  });

  it("provider adapter types can be imported without provider SDKs", async () => {
    const providerTypes = await import("../../src/providers/types.js");

    // This is a types-only module, import should not throw
    expect(providerTypes).toBeDefined();
  });

  it("provider registry can be imported without provider SDKs", async () => {
    const registry = await import("../../src/providers/registry.js");

    expect(registry.getProviders).toBeDefined();
    expect(typeof registry.getProviders).toBe("function");

    const providers = registry.getProviders();
    expect(Array.isArray(providers)).toBe(true);
    expect(providers.length).toBeGreaterThan(0);
  });
});
