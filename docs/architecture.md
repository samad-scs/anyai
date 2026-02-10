# Architecture

## Mental Model

`anyai` acts as a unified translation layer between your application code and various AI provider SDKs.

```mermaid
graph TD
    App[Your Application] --> Core[anyai Core]
    Core --> Capabilities[Capabilities (Chat, etc.)]
    Capabilities --> Adapter[Provider Adapter]
    Adapter -.-> SDK[Provider SDK (Optional)]
    SDK -.-> API[Provider API]
```

### Components

#### 1. Core (`src/core`)

- **Responsibility**: Configuration, Error Handling, Types.
- **Role**: The "glue" that holds everything together. It defines the public API contracts (`AIChat`, `ChatMessage`) that all other layers must adhere to.

#### 2. Capabilities (`src/capabilities`)

- **Responsibility**: Feature domain logic (e.g., `ChatCapability`).
- **Role**: The user-facing API. It normalizes inputs (like messages) and delegating execution to the selected provider adapter. It ensures a consistent experience regardless of the underlying provider.

#### 3. Providers (`src/providers`)

- **Responsibility**: Vendor-specific implementation.
- **Role**: Adapters that translate the standardized `anyai` requests into vendor-specific SDK calls, and translate vendor responses back into `anyai` standard objects.

## Key Design Decisions

### Why Adapters?

Providers enable `anyai` to support multiple AI models without your application code needing to know _which_ one uses. You switch providers by changing a config string, not by rewriting code.

### Why SDKs are Optional Dependencies?

To keep install sizes small and preventing vendor lock-in.

- **Standard approach**: A library installs _every_ SDK it supports.
- **Our approach**: You install _only_ the SDKs you use. `anyai` checks for them at runtime.
  See [Tree-Shaking](#tree-shaking) below.

### Why ESM-Only?

The modern JavaScript ecosystem (Vite, Next.js, Cloudflare Workers) relies on ESM for effective tree-shaking and module loading. We publish as ESM to ensure we work natively with these tools.

---

## Tree-Shaking

`anyai` is designed so that **only the AI provider(s) you actually use end up in your final bundle**.

You do **not** install provider SDKs manually.

```bash
npm install anyai
```

### Provider SDKs Are Optional

`anyai` declares provider SDKs (OpenAI, Gemini, etc.) as **optional dependencies**.

This means:

- They are available if needed
- They are **not required** at runtime unless used
- Bundlers are free to remove unused providers

### Lazy, Isolated Provider Adapters

Each provider lives in its own adapter and is loaded **only when selected**.

```ts
// simplified
const providerLoaders = {
  openai: () => import("./providers/openai/adapter"),
  gemini: () => import("./providers/gemini/adapter"),
};

const adapter = await providerLoaders[provider]();
```

Key properties:

- No provider SDKs are imported at the top level
- No side effects during module evaluation
- Each adapter imports **only its own SDK**

This structure allows bundlers to safely eliminate unused providers.

### `sideEffects: false`

`anyai` is published as a **side-effect-free ESM package**:

```json
{
  "type": "module",
  "sideEffects": false
}
```

This tells bundlers:

> Unused exports and unreachable imports can be safely removed.

### What Gets Included in Your Bundle

| Scenario                    | Result                             |
| --------------------------- | ---------------------------------- |
| App uses only OpenAI        | Only OpenAI adapter + SDK included |
| App uses only Gemini        | Only Gemini adapter + SDK included |
| App uses multiple providers | Only those providers included      |
| Provider never referenced   | Fully tree-shaken out              |

### Bundler Requirements

Tree-shaking happens at **build time**, not runtime.

Works best with:

- Next.js (App Router)
- Vite
- Bun
- Modern Webpack
- ESBuild / Rollup

If you run `anyai` **without a bundler** (plain Node.js):

- Optional dependencies may still be installed
- Unused providers are not tree-shaken

This is expected and intentional.

### Missing SDK Errors

If you select a provider whose SDK is not available, `anyai` fails fast with a clear error:

```txt
OpenAI provider selected but the `openai` SDK is not installed.
```

This avoids silent failures or implicit installs.

### Why This Design

This approach ensures:

- Zero manual SDK installs
- Clean dependency graphs
- No vendor lock-in
- Predictable bundle size
- Honest, explicit runtime behavior

Tree-shaking is **not a promise** — it’s a **property of the architecture**.
