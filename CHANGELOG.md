# Changelog

All notable changes to this project are documented here.
This project follows Semantic Versioning.

## [0.4.1] – 2026-02-21

### Added

- `getProviders()` public API for listing supported providers and models

## [0.4.0] – 2026-02-21

### Changed

- AI initialization is now synchronous (no await required)
- Provider adapters are lazily resolved on first capability execution

## [0.3.0] – 2026-02-21

### Added

- Ollama provider (local runtime, no API key required).

## [0.2.0] – 2026-02-10

### Added

- Anthropic provider support (`@anthropic-ai/sdk`).
- `AnthropicAdapter` implementation.

### Changed

- Migrated Gemini provider from `@google/generative-ai` to `@google/genai`.

## [0.1.1] – 2026-02-10

### Changed

- Updated README with clarified installation and streaming examples.

## [0.1.0] – 2026-02-09

### Added

- Initial public release.
- Provider-agnostic chat runtime.
- Unified streaming API (`ai.chat.stream`).
- Gemini adapter.
