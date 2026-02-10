# anyai

> One API. Any AI provider.

A provider-agnostic AI runtime for Node.js. Switch providers by configuration, not code changes.

## Installation

```bash
npm install anyai
```

Install the provider SDK you need (optional):

```bash
# For Gemini
npm install @google/generative-ai

# For OpenAI
npm install openai
```

**Note**: `anyai` uses a [tree-shakeable architecture](./docs/architecture.md#tree-shaking). You only need to install the SDKs for the providers you actually use. Unused providers will not be included in your final bundle.

## Quick Start

```ts
import { AI } from "anyai";

const ai = await AI.create({
  provider: "gemini",
  apiKey: process.env.GEMINI_API_KEY!,
  model: "gemini-2.5-flash", // ← fully type-safe, autocompletes Gemini models only
});

const response = await ai.chat.send({
  messages: [{ role: "user", content: "Hello!" }],
});

console.log(response.message.content);
```

## Type-Safe Provider Models

When you set `provider`, the `model` field is constrained to only that provider's models:

```ts
// ✅ Type-safe — only Gemini models allowed
await AI.create({
  provider: "gemini",
  model: "gemini-2.5-flash",
  apiKey: "...",
});

// ✅ Type-safe — only OpenAI models allowed
await AI.create({ provider: "openai", model: "gpt-4o", apiKey: "..." });

// ❌ Type error — "gpt-4o" is not a Gemini model
await AI.create({ provider: "gemini", model: "gpt-4o", apiKey: "..." });
```

## Streaming

```ts
const stream = ai.chat.stream({
  messages: [{ role: "user", content: "Tell me a story" }],
});

for await (const chunk of stream) {
  if (chunk.type === "delta") {
    process.stdout.write(chunk.delta);
  }
}
```

## Supported Providers

| Provider  | `send()` | `stream()` | SDK                     |
| --------- | -------- | ---------- | ----------------------- |
| Gemini    | ✅       | ✅         | `@google/generative-ai` |
| OpenAI    | ✅       | ✅         | `openai`                |
| Anthropic | 🔜       | 🔜         | —                       |

## Error Handling

```ts
import { AnyAIProviderError, AnyAIConfigError } from "anyai";

try {
  await ai.chat.send({ messages: [{ role: "user", content: "Hello" }] });
} catch (error) {
  if (error instanceof AnyAIProviderError) {
    console.error(`Provider ${error.provider} failed:`, error.message);
  }
}
```

## Non-Goals

This is infrastructure, not product logic. anyai does **not** provide:

- Utility functions or helpers
- Provider shortcuts (`ai.gemini()`)
- Middleware or plugins
- Multimodal, images, tools, or embeddings (v1)
