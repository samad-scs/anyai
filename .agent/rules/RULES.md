# anyai — Project Rules & Engineering Constraints

This document defines **non-negotiable rules** and **design constraints** for building and evolving the `anyai` package.

All contributors (human or AI agents) must follow these rules strictly.

---

## 1. Core Philosophy

- anyai is **infrastructure**, not a product
- The public API must remain **small, stable, and boring**
- Provider-specific complexity must never leak to the user
- Configuration changes must be sufficient to switch providers
- Types are part of the API contract — breaking types is a breaking change

---

## 2. Type Safety (Hard Requirement)

### 2.1 Zero `any` Policy

- `any` is forbidden in production code
- Use `unknown` + narrowing if required
- All external SDK responses must be normalized into internal types

### 2.2 Strict TypeScript Settings

The project **must** compile under:

- `"strict": true`
- `"noUncheckedIndexedAccess": true`
- `"exactOptionalPropertyTypes": true`

Type errors are considered **build failures**, not warnings.

---

## 3. Capability-First API Design

- Capabilities are exposed as **stable surfaces**
  - `ai.chat.send()`
  - `ai.chat.stream()`
- Providers adapt to capabilities — never the other way around
- No provider-specific methods in the public API

❌ Bad:

```ts
ai.openai.chat(...)
```

✅ Correct:

```ts
ai.chat.send(...)
```

---

## 4. Adapter Architecture Rules

### 4.1 Provider Isolation

- Each provider lives in its **own adapter module**
- Adapters must not import from each other
- Shared logic lives only in `/core`

### 4.2 Adapter Contract

Every adapter must:

- Accept normalized input
- Return normalized output
- Translate provider errors into unified errors
- Implement streaming as async iterators

Adapters must **never** expose provider SDK types.

---

## 5. Dependency & Tree-Shaking Strategy

### 5.1 No Forced Dependencies

- anyai **must not force-install all provider SDKs**
- Provider SDKs should be:
  - optional
  - dynamically imported
  - or peer dependencies (where appropriate)

Example intent:

> If a user only uses Gemini, OpenAI packages must never end up in their bundle.

### 5.2 Package Structure Expectations

Preferred structure:

```
src/
├─ index.ts                # public entry
├─ ai.ts                   # AI class
├─ core/
│  ├─ types.ts             # shared internal types
│  ├─ errors.ts
│  └─ normalize.ts
├─ providers/
│  ├─ gemini/
│  │  ├─ adapter.ts
│  │  └─ types.ts
│  └─ openai/
│     ├─ adapter.ts
│     └─ types.ts
└─ capabilities/
   └─ chat.ts
```

Each provider:

- Own `package.json` (optional in v2)
- Own dependency boundary
- No side-effect imports

---

## 6. Tree-Shaking & Bundler Compatibility

- All modules must be **ESM-first**
- Avoid top-level side effects
- Avoid conditional logic that forces bundlers to include all providers
- Dynamic imports are preferred over static imports for providers

```ts
if (provider === "gemini") {
  const { GeminiAdapter } = await import("./providers/gemini");
}
```

Tree-shaking correctness is more important than micro-optimizations.

---

## 7. Versioning Rules

- Public types are part of semver
- Breaking type changes → **major version**
- Adding providers → **minor version**
- Bug fixes / internal refactors → **patch version**

---

## 8. What Can Be Deferred to v2

The following are explicitly allowed to be **simplified or incomplete in v1**:

- Perfect tree-shaking across all bundlers
- Provider sub-packages (`anyai/provider-gemini`)
- Build-time dependency pruning
- Advanced conditional exports

These must be **documented**, not silently ignored.

---

## 9. Error Handling Rules

- All errors must be normalized
- No raw provider errors should escape
- Errors must include:
  - `type`
  - `provider`
  - `message`
  - `cause` (when available)

---

## 10. Non-Goals (Explicit)

anyai will NOT:

- Implement business logic
- Provide UI helpers
- Store data
- Execute user workflows
- Become a framework

---

## 11. AI Agent Rules

When using AI to modify this project:

- Never widen types for convenience
- Never add dependencies without justification
- Never expose provider-specific concepts publicly
- Prefer clarity over cleverness
- If unsure, leave TODOs — do not guess

---

## 12. Final Principle

> If removing or switching a provider requires application code changes, the design is wrong.
