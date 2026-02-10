# 🦅 Contributing to `anyai`

First off, thanks for taking the time to contribute! 🎉

`anyai` allows developers to switch AI providers by changing only a string. To maintain this promise, we have strict architectural guidelines.

## 📚 Documentation Index

We've organized our documentation to help you find exactly what you need:

### 🏗️ Core & Architecture

- [**Mental Model & Architecture**](./docs/architecture.md) - Start here to understand how `anyai` works (adapters, tree-shaking, ESM).
- [**Project Philosophy**](./docs/contributing.md#project-philosophy) - Our zero-magic, type-saftey first approach.

### 🔌 Providers (The most common contribution)

- [**Adding a New Provider**](./docs/providers/adding-a-provider.md) - Step-by-step guide.
- [**Provider Guidelines**](./docs/providers/provider-guidelines.md) - Strict rules for implementation.
- [**PR Checklist**](./docs/providers/provider-checklist.md) - Copy this into your PR!

### 🧠 Models

- [**Model Registry**](./docs/models/model-registry.md) - How we handle type-safe model names.
- [**Updating Models**](./docs/models/updating-models.md) - When to add `gpt-5` or `gemini-1.5-ultra`.

### ⚡ Capabilities

- [**Chat Contract**](./docs/capabilities/chat.md) - The spec for `ai.chat.send` and `ai.chat.stream`.
- [**Adding a Capability**](./docs/capabilities/adding-a-capability.md) - Guidelines for future expansion (Embeddings, Images, etc.).

### 🛠️ Infrastructure

- [**Error Handling**](./docs/errors.md) - Our unified error system.
- [**Streaming**](./docs/streaming.md) - How we normalize async iterators.
- [**Testing Strategy**](./docs/testing.md) - Contract tests, type tests, and smoke tests.

---

## 🚀 Quick Start for Contributors

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

## 🤝 Code of Conduct

Please note that this project is released with a [Code of Conduct](./CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.
