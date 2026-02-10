/**
 * Contract tests for the error hierarchy.
 *
 * Verifies error classes, codes, inheritance chain,
 * and proper wrapping behavior.
 */
import { describe, expect, it } from "vitest";

// ** Application Service, Constants, and Type Imports
import {
  AnyAIConfigError,
  AnyAIError,
  AnyAIErrorCode,
  AnyAIProviderError,
  AnyAIUnsupportedError,
} from "../../src/core/errors.js";

// ─── Error Code Constants ────────────────────────────────────────────────────

describe("AnyAIErrorCode", () => {
  it("contains all expected error codes", () => {
    expect(AnyAIErrorCode.PROVIDER_ERROR).toBe("PROVIDER_ERROR");
    expect(AnyAIErrorCode.CONFIG_ERROR).toBe("CONFIG_ERROR");
    expect(AnyAIErrorCode.UNSUPPORTED).toBe("UNSUPPORTED");
    expect(AnyAIErrorCode.RATE_LIMIT).toBe("RATE_LIMIT");
    expect(AnyAIErrorCode.AUTH_ERROR).toBe("AUTH_ERROR");
    expect(AnyAIErrorCode.NETWORK_ERROR).toBe("NETWORK_ERROR");
  });
});

// ─── Base Error ──────────────────────────────────────────────────────────────

describe("AnyAIError", () => {
  it("extends Error", () => {
    const err = new AnyAIError("test", AnyAIErrorCode.PROVIDER_ERROR);
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(AnyAIError);
  });

  it("has correct name, message, and code", () => {
    const err = new AnyAIError("something failed", AnyAIErrorCode.AUTH_ERROR);
    expect(err.name).toBe("AnyAIError");
    expect(err.message).toBe("something failed");
    expect(err.code).toBe("AUTH_ERROR");
  });
});

// ─── Provider Error ──────────────────────────────────────────────────────────

describe("AnyAIProviderError", () => {
  it("extends AnyAIError", () => {
    const err = new AnyAIProviderError("fail", "gemini");
    expect(err).toBeInstanceOf(AnyAIError);
    expect(err).toBeInstanceOf(AnyAIProviderError);
  });

  it("has correct code, name, provider, and cause", () => {
    const originalError = new Error("SDK broke");
    const err = new AnyAIProviderError("wrapped", "openai", originalError);

    expect(err.name).toBe("AnyAIProviderError");
    expect(err.code).toBe("PROVIDER_ERROR");
    expect(err.provider).toBe("openai");
    expect(err.cause).toBe(originalError);
  });

  it("cause is undefined when not provided", () => {
    const err = new AnyAIProviderError("no cause", "gemini");
    expect(err.cause).toBeUndefined();
  });
});

// ─── Config Error ────────────────────────────────────────────────────────────

describe("AnyAIConfigError", () => {
  it("extends AnyAIError with CONFIG_ERROR code", () => {
    const err = new AnyAIConfigError("bad config");
    expect(err).toBeInstanceOf(AnyAIError);
    expect(err).toBeInstanceOf(AnyAIConfigError);
    expect(err.name).toBe("AnyAIConfigError");
    expect(err.code).toBe("CONFIG_ERROR");
    expect(err.message).toBe("bad config");
  });
});

// ─── Unsupported Error ───────────────────────────────────────────────────────

describe("AnyAIUnsupportedError", () => {
  it("extends AnyAIError with UNSUPPORTED code", () => {
    const err = new AnyAIUnsupportedError("vision");
    expect(err).toBeInstanceOf(AnyAIError);
    expect(err).toBeInstanceOf(AnyAIUnsupportedError);
    expect(err.name).toBe("AnyAIUnsupportedError");
    expect(err.code).toBe("UNSUPPORTED");
    expect(err.feature).toBe("vision");
  });

  it("includes feature name in message", () => {
    const err = new AnyAIUnsupportedError("image-gen");
    expect(err.message).toContain("image-gen");
  });
});
