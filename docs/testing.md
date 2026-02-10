# Testing

We rely on a mix of contract tests, type tests, and smoke tests.

## 1. Adapter Contract Tests

We define a "Contract Test Suite" that runs against **every** adapter.

- **Location**: `tests/contracts/`
- **Purpose**: Ensures every adapter implements the standard behavior (e.g., "throws error on empty messages", "returns expected structure").

## 2. Type-Level Tests

We use `tsc --noEmit` to verify type definitions.

- **Check**: `npm run test:types`
- **Purpose**: Ensures that `AIConfig` correctly narrows model types based on the provider.

## 3. Local Smoke Tests

We encourage adding a `tests/smoke/[provider].test.ts` that hits the _real_ API (skipped in CI unless keys are present).

- **Purpose**: Verifies that the SDK integration actually works with the live vendor API.

## CI Enforcement

GitHub Actions runs:

1.  `npm run lint` (ESLint + Prettier)
2.  `npm run build` (TypeScript compilation)
3.  `npm test` (Unit/Contract logic tests)

We do **not** use `any` in tests. Mock types should be precise.
