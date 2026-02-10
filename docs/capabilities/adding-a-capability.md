# Adding a Capability

**Future-facing Document**: This describes the process for v2 and beyond.

## Criteria for New Capabilities

Before adding a new capability (e.g., `Embeddings`, `ImageGeneration`), ask:

1.  **Universal?**: Is this supported by at least 2 major providers?
2.  **Stable?**: Are the provider APIs for this feature stable?
3.  **Distinct?**: Is it different enough from existing capabilities?

## Required Abstractions

1.  **Capability Class**: `src/capabilities/[name].ts`
    - Manages the interface, validation, and delegation.
2.  **Adapter Interface**: `src/providers/types.ts`
    - e.g., `EmbeddingAdapter`.
3.  **Type Definitions**: `src/core/types.ts`
    - Input/Output schemas.

## API Surface

Avoid "Everything is a Capability".

- **Good**: `Chat`, `Embeddings`, `Transcribe`.
- **Bad**: `ChatWithSearch`, `ChatWithVision`. (These are features of `Chat`, not new capabilities).

To adding a capability requires a **Minor Version** bump.
