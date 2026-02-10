# Deprecating Models

Models come and go. `anyai` balances stability with keeping the registry clean.

## Soft Deprecation

When a provider announces a model is "legacy" or "deprecated" but it still works:

1.  Add a `@deprecated` TSDoc comment to the type definition in `src/core/types.ts` if possible (TypeScript support for deprecating union members is limited, so usually we just document it).
2.  Ideally, move it to a `Deprecated*Model` union if we want to hide it from autocomplete but allow it for backward compatibility. Note: Current implementation keeps them in the main union until removal.

## Removal Policy

We remove models when:

1.  The provider shuts them down.
2.  They have been superseded for > 6 months and have very low usage.

## Warning Strategy

If a user selects a model that is known to be deprecated, `anyai` core does _not_ currently warn at runtime (to keep logs clean), but we rely on TypeScript and Release Notes to inform users.

## Versioning Impact

- Removing a model from the type union is a **BREAKING CHANGE**.
- It must happen in a **Major Version** update of `anyai`.
