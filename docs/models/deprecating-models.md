# Deprecating Models

Models come and go. `anyai` balances stability with keeping the registry clean.

## Soft Deprecation

When a provider announces a model is "legacy" or "deprecated" but it still works:

1.  Add a comment next to the model string in the provider's `*_MODELS` array in `src/core/types.ts` (e.g., `// deprecated`).
2.  Ideally, move it to a separate `DEPRECATED_*_MODELS` array if we want to hide it from autocomplete but allow it for backward compatibility. Note: Current implementation keeps them in the main array until removal.

## Removal Policy

We remove models when:

1.  The provider shuts them down.
2.  They have been superseded for > 6 months and have very low usage.

## Warning Strategy

If a user selects a model that is known to be deprecated, `anyai` core does _not_ currently warn at runtime (to keep logs clean), but we rely on TypeScript and Release Notes to inform users.

## Versioning Impact

- Removing a model from the constant array is a **BREAKING CHANGE** (it changes the derived type union).
- It must happen in a **Major Version** update of `anyai`.
