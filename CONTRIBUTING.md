# Contributing to anyai

Thank you for your interest in contributing to anyai.

anyai enables developers to switch AI providers by changing a single configuration string. To maintain this flexibility and stability, we adhere to strict architectural guidelines.

## Documentation Index

We have organized our documentation to assist you in navigating the codebase and understanding our standards.

### Core & Architecture

- [**Mental Model & Architecture**](./docs/architecture.md): Overview of the system, including adapters, tree-shaking, and ESM.
- [**Project Philosophy**](./docs/contributing.md#project-philosophy): Our approach to type safety and zero-magic configuration.

### Providers

- [**Adding a New Provider**](./docs/providers/adding-a-provider.md): Step-by-step guide for implementing new providers.
- [**Provider Guidelines**](./docs/providers/provider-guidelines.md): Strict implementation rules.
- [**PR Checklist**](./docs/providers/provider-checklist.md): Required checklist for Pull Requests.

### Models

- [**Model Registry**](./docs/models/model-registry.md): Type-safe model name registry.
- [**Updating Models**](./docs/models/updating-models.md): Guidelines for adding or updating models.

### Capabilities

- [**Chat Contract**](./docs/capabilities/chat.md): Specification for `ai.chat.send` and `ai.chat.stream`.
- [**Adding a Capability**](./docs/capabilities/adding-a-capability.md): Guidelines for future capabilities (e.g., Embeddings, Images).

### Infrastructure

- [**Error Handling**](./docs/errors.md): Unified error handling system.
- [**Streaming**](./docs/streaming.md): Async iterator normalization.
- [**Testing Strategy**](./docs/testing.md): Contract, type, and smoke testing strategies.

---

## Quick Start

1.  **Clone & Install**

    ```bash
    git clone https://github.com/your-org/anyai.git
    cd anyai
    npm install
    ```

2.  **Build**

    ```bash
    npm run build
    ```

3.  **Run Tests**
    ```bash
    npm test
    ```

## Code of Conduct

Please note that this project is released with a [Code of Conduct](./CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.
