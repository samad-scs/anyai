# Provider Guidelines

These rules must be followed to ensure codebase consistency and prevents architectural decay.

## 1. No Top-Level SDK Imports

- **Why**: To support tree-shaking and optional dependencies.
- **Rule**: All SDK imports must be `await import("...")` inside the adapter class.

## 2. No Provider-Specific Types Leaking

- **Why**: Users should interact with `anyai` types, not vendor types.
- **Rule**: `send()` must return `ChatResponse`, never the raw SDK response object.

## 3. No Feature Creep

- **Why**: We wrap common functionality, we don't expose every niche feature.
- **Rule**: If a feature (e.g., "logprobs") isn't in the `ChatCapability` interface, do not add it to the adapter public signature.

## 4. Capability Parity

- **Why**: Users expect `switch(provider)` to just work.
- **Rule**: If you implement `ChatAdapter`, you must support _at least_ standard text generation.

## 5. unsupported Features

- **Why**: Sometimes a provider genuinely lacks a feature (e.g., streaming).
- **Rule**: Throw `AnyAIUnsupportedError` with a clear message: `"Streaming is not supported by [Provider] yet."`

## 6. Zero `any`

- **Why**: Type safety is a core promise.
- **Rule**: Do not use `any` to bypass SDK typing issues. Use `unknown` and validate/narrow types.
