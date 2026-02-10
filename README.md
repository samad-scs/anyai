# anyai

> One API. Any AI provider.

A provider-agnostic AI runtime for Node.js. Switch providers by configuration, not code changes.

## Installation

```bash
npm install anyai
```

That's it. You don't need to install individual provider SDKs like `@google/generative-ai` or `openai` separately. `anyai` manages these dependencies internally.

## Tree-Shaking Architecture

The package is built with a tree-shakeable architecture. Despite having multiple provider SDKs as optional dependencies, your final application bundle will only include the code for the providers you actually initialize.

If you only use Gemini, the OpenAI and Anthropic logic will be automatically excluded from your production build.

## Quick Start

```ts
import { AI } from "anyai";

const ai = await AI.create({
  provider: "gemini",
  apiKey: process.env.GEMINI_API_KEY!,
  model: "gemini-2.0-flash", // Fully type-safe, autocompletes Gemini models
});

const response = await ai.chat.send({
  messages: [{ role: "user", content: "Hello!" }],
});

console.log(response.message.content);
```

## Type-Safe Provider Models

When you set the `provider`, the `model` field is strictly constrained to that provider's models:

```ts
// Valid: only Gemini models are suggested and allowed
await AI.create({
  provider: "gemini",
  model: "gemini-2.0-flash",
  apiKey: "...",
});

// Valid: only OpenAI models are suggested and allowed
await AI.create({
  provider: "openai",
  model: "gpt-4o",
  apiKey: "...",
});

// Error: "gpt-4o" is not a Gemini model
await AI.create({
  provider: "gemini",
  model: "gpt-4o",
  apiKey: "...",
});
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

| Provider  | Status      | Capabilities    |
| --------- | ----------- | --------------- |
| Gemini    | Available   | Chat, Streaming |
| OpenAI    | Available   | Chat, Streaming |
| Anthropic | Coming Soon | —               |

## Error Handling

Standardized error types across all providers:

```ts
import { AnyAIProviderError, AnyAIConfigError } from "anyai";

try {
  await ai.chat.send({ messages: [{ role: "user", content: "Hello" }] });
} catch (error) {
  if (error instanceof AnyAIProviderError) {
    console.error(`Provider ${error.provider} failed: ${error.message}`);
  }
}
```

## Non-Goals

To keep the core runtime lean and fast, `anyai` explicitly avoids:

- Adding product-level utility functions or helpers.
- Implicit provider shortcuts like `ai.gemini()`.
- Middleware or plugin systems.
- Multimodal features (images, audio) in the v1 core.
