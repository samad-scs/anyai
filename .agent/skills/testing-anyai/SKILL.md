---
name: testing-anyai
description: Defines the testing strategy, test layers, and rules for the anyai package. Use when creating tests, running test suites, or validating changes. Enforces contract-based testing — never test AI model outputs.
---

# Testing anyai

## Core Principle

> **Test your contracts, not provider behavior.**
> You are building infrastructure glue, not AI models.

## When to Use This Skill

- Creating new test files
- Running the test suite
- Validating a new adapter or capability
- Reviewing test coverage
- Setting up CI test pipelines

## What NOT to Test (Non-Negotiable)

❌ **Never** do any of the following:

- Snapshot provider responses
- Assert exact model outputs
- Mock SDK internals deeply
- Test token quality / hallucinations
- Write "golden prompt" tests

These are brittle, expensive, and meaningless across providers.

> [!CAUTION]
> **Final Rule**: If a test requires knowing what the AI "should say", it is the **wrong test**.
> anyai tests interfaces, guarantees, and invariants — nothing else.

## What MUST Be Tested

| Area                     | What to verify                                                        |
| ------------------------ | --------------------------------------------------------------------- |
| **Public API contracts** | Types compile, method signatures are stable, capabilities exist       |
| **Adapter compliance**   | Adapters implement required interface, normalized I/O, errors wrapped |
| **Provider isolation**   | Importing core does NOT require provider SDKs, lazy loading works     |
| **Streaming contract**   | Async iterator shape is correct, `delta`/`done` semantics respected   |

## Test Folder Structure

```
tests/
├─ types/                  # Layer 1 — Type-level tests
│  ├─ chat.test-d.ts
│  └─ config.test-d.ts
├─ contracts/              # Layer 2 — Contract tests
│  └─ chat-adapter.spec.ts
├─ providers/              # Layer 3 — Smoke tests (local only)
│  └─ gemini.smoke.ts
└─ isolation/              # Layer 4 — Tree-shaking & dependency
   └─ dependency.spec.ts
```

---

## Testing Layers (Execute in Order)

### Layer 1 — Type-Level Tests (MOST IMPORTANT)

Catches breaking changes before runtime. **Zero runtime cost.**

- **Tool**: `tsc --noEmit` only — no Jest/Vitest required
- **Location**: `tests/types/`

```typescript
// tests/types/chat.test-d.ts
import { AI } from "../../src";

const ai = new AI({
  provider: "gemini",
  apiKey: "test",
  model: "test",
});

// ✅ Valid call
ai.chat.send({
  messages: [{ role: "user", content: "hello" }],
});

// ✅ Should error on invalid input
// @ts-expect-error
ai.chat.send({ foo: "bar" });
```

**Rule**: If this stops compiling → breaking change detected.

---

### Layer 2 — Contract Tests (Adapter-Level)

Tests behavior **shape**, not model output. Uses minimal mocking.

- **Tool**: Vitest (preferred) or Jest
- **Location**: `tests/contracts/`

```typescript
// tests/contracts/chat-adapter.spec.ts
import type { ChatAdapter } from "../../src/providers/types";

export function runChatAdapterTests(createAdapter: () => ChatAdapter) {
  it("returns normalized chat response", async () => {
    const adapter = createAdapter();

    const result = await adapter.send(
      [{ role: "user", content: "hello" }],
      "test-model",
    );

    expect(result.message.role).toBe("assistant");
    expect(typeof result.message.content).toBe("string");
  });
}
```

**Rule**: Reuse `runChatAdapterTests` for every provider adapter.

---

### Layer 3 — Provider Smoke Tests (OPTIONAL, Local Only)

Validates real SDK integration. **Never run in CI.**

- **Location**: `tests/providers/`
- Requires real API keys
- Skipped automatically without env vars

```typescript
// tests/providers/gemini.smoke.ts
if (!process.env.GEMINI_API_KEY) {
  test.skip("no api key", () => {});
}

test("gemini chat works", async () => {
  // real call, minimal assertion
});
```

---

### Layer 4 — Tree-Shaking & Dependency Tests

Unique to anyai — validates provider isolation.

- **Location**: `tests/isolation/`

```typescript
// tests/isolation/dependency.spec.ts
test("core import works without provider deps", async () => {
  await import("../../src/index");
});
```

Also consider:

- Build a tiny Vite project to inspect bundle output
- Verify provider SDKs are optional peer dependencies

---

## Scripts (package.json)

```json
{
  "scripts": {
    "test": "vitest",
    "test:types": "tsc --noEmit",
    "test:smoke": "vitest -t smoke"
  },
  "devDependencies": {
    "vitest": "^1.5.0",
    "typescript": "^5.4.0"
  }
}
```

## Running Tests

### Quick Checklist

- [ ] `npm run test:types` — Type-level tests pass
- [ ] `npm run test` — Contract + isolation tests pass
- [ ] `npm run test:smoke` — (Local only) Smoke tests pass

### CI Pipeline

```yaml
# ✅ Run in CI
- run: npm run test:types
- run: npm run test
# ❌ Skip in CI
# - run: npm run test:smoke
```

## Creating a New Test

1. **Identify the layer** — Is it a type contract, adapter behavior, or isolation concern?
2. **Place in the correct folder** — `types/`, `contracts/`, `providers/`, or `isolation/`
3. **Follow the pattern** — Use the examples above as templates
4. **Assert shape, not content** — Check `role`, `typeof`, existence — never exact strings from AI
5. **Reuse contract runners** — Write once in `contracts/`, parameterize per provider
