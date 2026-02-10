# anyai — Project Rules

## 1. Type Safety

- `strict: true` — no exceptions
- `exactOptionalPropertyTypes: true`
- `noUncheckedIndexedAccess: true`
- Zero `any` — use `unknown` and narrow
- All public types are semver-protected

## 2. API Design

- Capability-first: `ai.chat.send()`, not `ai.gemini.chat()`
- No provider-specific types in public API
- No SDK types leak to consumers
- `AIConfig<P>` is generic — `provider` constrains `model`

## 3. Provider Adapters

- One adapter per provider, implements `ChatAdapter`
- All SDK imports via dynamic `import()` — never top-level
- All SDK errors wrapped in `AnyAIProviderError`
- No shared mutable state between adapters

## 4. Tree-Shaking

- `sideEffects: false` in `package.json`
- Dynamic imports prevent unused SDK bundling
- Consumers install only the provider SDK they use

## 5. Dependencies

- Provider SDKs are **optional peer dependencies**
- Zero runtime dependencies
- Dev dependencies for type-checking only

## 6. Versioning

- Public types are semver-protected
- Internal types can change freely
- Adapters are private implementation details

## 7. Non-Goals

- No utility functions
- No provider shortcuts (`ai.gemini()`)
- No middleware or plugins
- No multimodal, images, tools, or embeddings (v1)
- No "nice to have" APIs — stay small, boring, invisible
