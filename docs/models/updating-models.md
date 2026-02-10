# Updating Models

This guide covers how to add or update models in the `anyai` registry.

## When to Add vs Update

- **Add**: When a provider releases a completely new model architecture or generation (e.g., `gpt-5`).
- **Update**: When a model alias points to a new version (handled by the provider), we generally do nothing unless the ID itself changes.

## Naming Conventions

Use the **Provider's Canonical ID** as the TypeScript type.

- **OpenAI**: Use the specific aliases like `gpt-4o`. Avoid dated versions (`gpt-4o-2024-05-13`) unless there is a specific reason to expose them.
- **Gemini**: Use the unstable/versioned names only if they are the primary intended way to access the model (`gemini-1.5-flash`).

## Steps to Add a Model

1.  Open `src/core/types.ts`.
2.  Locate the specific provider type (e.g., `GeminiModel`).
3.  Add the new string literal to the union.
4.  Run `npm test` to ensure no regression.
5.  Update `docs/README.md` if it lists top-tier models.

**Important**: Do not invent your own names. Use the exact string the provider SDK expects.
