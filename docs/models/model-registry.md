# Model Registry

`anyai` uses a static model registry to ensure type safety and consistent model naming.

## What is the Model Registry?

The model registry is a set of `as const` arrays defined in `src/core/types.ts`. Each array is the **single source of truth** for a provider's supported models. TypeScript types are derived from these arrays automatically.

```ts
export const OPENAI_MODELS = [
  "gpt-4.1",
  "gpt-4o",
  // ...
] as const

export type OpenAIModel = (typeof OPENAI_MODELS)[number]
```

The same arrays are used by the `getProviders()` API to expose runtime metadata:

```ts
import { getProviders } from "anyai"

const providers = getProviders()
// Each entry includes: provider, apiKeyReq, baseUrl, models
```

## Why Normalized Models?

1.  **Type Safety**: Your IDE can autocomplete available models for the selected provider.
2.  **Single Source of Truth**: Model names are defined once — types and runtime metadata both derive from the same constant.
3.  **Validation**: `anyai` can reject invalid model names at runtime.
4.  **Consistency**: We ensure users use the canonical IDs (e.g., `gpt-4o` vs `gpt-4o-2024-05-13`) where appropriate.

## Stability Guarantees

- **Additions**: New models are added in minor versions.
- **Removals**: Old models are removed only after a deprecation period (see [Deprecating Models](./deprecating-models.md)).
