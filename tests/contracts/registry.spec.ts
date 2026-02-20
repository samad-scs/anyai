/**
 * Contract tests — provider registry validation.
 *
 * Validates the shape, accuracy, and safety of the
 * static provider metadata returned by getProviders().
 */
import { describe, expect, it } from "vitest";
import { getProviders } from "../../src/providers/registry.js";
import type { ProviderMetadata } from "../../src/providers/registry.js";
import type { ProviderName } from "../../src/core/types.js";

// Known providers from the ProviderName union
const KNOWN_PROVIDERS: readonly ProviderName[] = [
  "anthropic",
  "gemini",
  "ollama",
  "openai",
];

describe("Provider registry", () => {
  it("returns an array of ProviderMetadata objects", () => {
    const providers = getProviders();

    expect(Array.isArray(providers)).toBe(true);
    expect(providers.length).toBeGreaterThan(0);

    for (const entry of providers) {
      expect(typeof entry.provider).toBe("string");
      expect(typeof entry.apiKeyReq).toBe("boolean");
      expect(typeof entry.baseUrl).toBe("boolean");
      expect(Array.isArray(entry.models)).toBe(true);
    }
  });

  it("every provider matches a valid ProviderName", () => {
    const providers = getProviders();

    for (const entry of providers) {
      expect(KNOWN_PROVIDERS).toContain(entry.provider);
    }
  });

  it("covers all known providers", () => {
    const providers = getProviders();
    const providerNames = providers.map((p) => p.provider);

    for (const name of KNOWN_PROVIDERS) {
      expect(providerNames).toContain(name);
    }
  });

  it("every provider has a non-empty models list", () => {
    const providers = getProviders();

    for (const entry of providers) {
      expect(entry.models.length).toBeGreaterThan(0);
      for (const model of entry.models) {
        expect(typeof model).toBe("string");
        expect(model.length).toBeGreaterThan(0);
      }
    }
  });

  it("apiKeyReq and baseUrl flags are correct per provider", () => {
    const providers = getProviders();
    const byName = Object.fromEntries(
      providers.map((p) => [p.provider, p]),
    ) as Record<ProviderName, ProviderMetadata>;

    // API-key-required providers
    expect(byName.gemini.apiKeyReq).toBe(true);
    expect(byName.openai.apiKeyReq).toBe(true);
    expect(byName.anthropic.apiKeyReq).toBe(true);

    // Ollama — no API key, uses baseUrl
    expect(byName.ollama.apiKeyReq).toBe(false);
    expect(byName.ollama.baseUrl).toBe(true);

    // Cloud providers don't require baseUrl
    expect(byName.gemini.baseUrl).toBe(false);
    expect(byName.openai.baseUrl).toBe(false);
    expect(byName.anthropic.baseUrl).toBe(false);
  });

  it("returns a shallow copy — mutations do not affect internal state", () => {
    const first = getProviders();
    const second = getProviders();

    // Different array references
    expect(first).not.toBe(second);

    // Same content
    expect(first).toEqual(second);
  });
});
