# Contributing to anyai

**anyai** is infrastructure. It is designed to be boring, stable, and invisible.

We welcome contributions that align with our core philosophy:

> One API. Any AI provider.

## Before You Contribute

Please read our [Project Rules](./.agent/rules/RULES.md) and [Architecture Guide](./AGENT.md).
Specifically:

1.  **Strict Types**: No `any`. Strict TS config.
2.  **Capability-First**: Add capabilities (e.g., `chat`), not provider-specific methods.
3.  **Tests**: All changes must pass strict contract tests.

## Development Setup

```bash
npm install
npm run test
```

## Pull Request Process

1.  Create a feature branch.
2.  Ensure strict type checking passes (`npm run build`).
3.  Ensure all tests pass (`npm run test`).
4.  Update documentation if public API changes.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
