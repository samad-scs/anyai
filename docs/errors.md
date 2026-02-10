# Error Handling

`anyai` provides a unified error hierarchy to ensure consistent error handling across all providers.

## Error Hierarchy

All errors extend `AnyAIError`.

1.  **AnyAIError**: Base class.
2.  **AnyAIConfigError**: Invalid configuration (e.g., missing API key, unsupported provider).
3.  **AnyAIProviderError**: Errors originating from the provider SDK or API.
4.  **AnyAIUnsupportedError**: Feature not supported by the selected provider.

## Provider Error Wrapping

Adapters **MUST** wrap all SDK errors in `AnyAIProviderError`.

```ts
try {
  // SDK call
} catch (e) {
  throw new AnyAIProviderError(e.message, "openai", e);
}
```

This ensures that `error.cause` preserves the original error for debugging, while `error.message` provides a readable summary.

## Exposed vs Internal

- **Exposed**: `message`, `provider`, `code` (if available).
- **Internal**: `cause` (stack traces from SDKs).

## Stack Trace Policy

We generally preserve stack traces in `cause` but clean them up in the main error object to avoid leaking internal implementation details of the adapter structure.
