# Provider PR Checklist

Copy this into your Pull Request description when adding a new provider.

- [ ] **Interface Implementation**
  - [ ] Implements `ChatAdapter` completely.
  - [ ] `send()` returns normalized `ChatResponse`.
  - [ ] `stream()` yields normalized `ChatStreamChunk`.

- [ ] **Architecture Compliance**
  - [ ] **NO** top-level SDK imports.
  - [ ] SDK is imported dynamically `await import(...)`.
  - [ ] SDK is added to `optionalDependencies` in `package.json`.
  - [ ] `sideEffects: false` confirmed (no global side effects).

- [ ] **Error Handling**
  - [ ] Provider errors are wrapped in `AnyAIProviderError`.
  - [ ] Missing SDK error is clear and suggests `npm install`.

- [ ] **Testing**
  - [ ] Added unit tests for the adapter.
  - [ ] Verified locally with a real API key (smoke test).

- [ ] **Documentation**
  - [ ] Added to `Supported Providers` table in `README.md`.
  - [ ] Added model constant array in `src/core/types.ts`.
  - [ ] Added registry entry in `src/providers/registry.ts`.
