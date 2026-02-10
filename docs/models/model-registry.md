# Model Registry

`anyai` uses a static model registry to ensure type safety and consistent model naming.

## What is the Model Registry?

The model registry is a set of TypeScript string unions defined in `src/core/types.ts`. It maps provider-specific model IDs to the `ProviderName` they belong to.

```ts
export type OpenAIModel = "gpt-4o" | "gpt-4-turbo" | ...;
export type GeminiModel = "gemini-1.5-pro" | "gemini-1.5-flash" | ...;
```

## Why Normalized Models?

1.  **Type Safety**: Your IDE can autocomplete available models for the selected provider.
2.  **Validation**: `anyai` can reject invalid model names at runtime.
3.  **Consistency**: We ensure users use the canonical IDs (e.g., `gpt-4o` vs `gpt-4o-2024-05-13`) where appropriate.

## Stability Guarantees

- **Additions**: New models are added in minor versions.
- **Removals**: Old models are removed only after a deprecation period (see [Deprecating Models](./deprecating-models.md)).
