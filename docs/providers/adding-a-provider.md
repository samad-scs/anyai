# Adding a Provider

This guide covers how to add a new AI provider (e.g., Anthropic, Cohere, Mistral) to `anyai`.

## 1. Folder Structure

Create a new directory in `src/providers/[provider-name]`:

```bash
src/providers/anthropic/
├── adapter.ts    # The implementation
├── types.ts      # (Optional) Provider-specific types if needed internally
└── index.ts      # (Optional) Export adapter
```

## 2. Implement the Adapter Interface

Your adapter must implement `ChatAdapter` from `src/providers/types.ts`.

```ts
import type { ChatAdapter } from "../types.js";
import type {
  ChatMessage,
  ChatResponse,
  ChatStreamChunk,
} from "../../core/types.js";
import { AnyAIProviderError } from "../../core/errors.js";

export class AnthropicAdapter implements ChatAdapter {
  constructor(private apiKey: string) {}

  async send(messages: ChatMessage[], model: string): Promise<ChatResponse> {
    // ... implementation
  }

  async *stream(
    messages: ChatMessage[],
    model: string,
  ): AsyncIterable<ChatStreamChunk> {
    // ... implementation
  }
}
```

## 3. SDK Import Rules (Lazy Only)

**CRITICAL**: You must NOT import the provider SDK at the top level. Use dynamic imports inside methods or a private initialization method.

### ❌ Incorrect

```ts
import Anthropic from "@anthropic-ai/sdk"; // This breaks tree-shaking!
```

### ✅ Correct

```ts
private async getClient() {
    try {
        const { default: Anthropic } = await import('@anthropic-ai/sdk');
        return new Anthropic({ apiKey: this.apiKey });
    } catch (error) {
         throw new AnyAIProviderError(
            "Failed to load @anthropic-ai/sdk. Install it using npm.",
            "anthropic",
            error
        );
    }
}
```

## 4. Normalization Rules

- **Role Mapping**: Map `anyai` roles (`user`, `assistant`, `system`) to the provider's expected roles.
- **Content Mapping**: Ensure text content is extracted correctly from the provider's response.
- **Usage Metrics**: If available, map usage tokens to `inputTokens`, `outputTokens`, and `totalTokens`.

## 5. Error Wrapping

Wrap all provider errors in `AnyAIProviderError`. This ensures users catch a consistent error type.

```ts
try {
  // ... SDK call
} catch (error) {
  if (error instanceof AnyAIProviderError) throw error;
  throw new AnyAIProviderError(
    error instanceof Error ? error.message : "Unknown error",
    "anthropic",
    error,
  );
}
```

## 6. Registration

1.  Add the provider name to `ProviderName` in `src/core/types.ts`.
2.  Add the loader to `src/ai.ts` in the `providerLoaders` object.

```ts
anthropic: async () => {
    const { AnthropicAdapter } = await import("./providers/anthropic/adapter.js");
    return AnthropicAdapter;
},
```

3.  Add the SDK to `optionalDependencies` in `package.json`.
4.  Update the root `README.md` file to include the new provider in the "Supported Providers" table. Follow the `provider-listing` skill instructions.
