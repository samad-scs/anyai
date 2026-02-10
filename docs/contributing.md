# Contributing to `anyai`

Welcome! We appreciate your interest in making `anyai` better. This document outlines how to contribute effectively.

## Prerequisites

- **Node.js**: v18 or later
- **Package Manager**: npm (we use `package-lock.json`)
- **Language**: TypeScript (strict mode)

## Repo Setup

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/your-org/anyai.git
    cd anyai
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    ```

3.  **Build the project**:

    ```bash
    npm run build
    ```

4.  **Run tests**:
    ```bash
    npm test
    ```

## Project Philosophy

- **One API**: Users learn one surface (`ai.chat.send`), not ten.
- **Zero Magic**: No hidden runtimes, no auto-installs.
- **Type Safety**: If it compiles, it should likely work.
- **Provider Agnostic**: No provider is "first-class" or special-cased in the core.

## What Not To Change

- **Public API**: Do not change `src/core/types.ts` or public method signatures without a major discussion. Stability is our primary feature.
- **Strict Types**: Do not introduce `any` or suppress strict null checks.

## Code Review Process

1.  **Passes Tests**: CI must pass.
2.  **Follows Guidelines**: See [Provider Guidelines](./providers/provider-guidelines.md) if adding a provider.
3.  **No Side Effects**: We enforce `sideEffects: false`.
4.  **Readable**: Code should be self-documenting.

## Versioning

We follow [Semantic Versioning](https://semver.org/).

- **Major (BREAKING)**: Changing public interfaces, removing supported providers.
- **Minor (Feature)**: Adding new providers, capabilities, or models.
- **Patch (Fix)**: Bug fixes, internal refactoring, doc updates.
