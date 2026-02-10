# Chat Capability Contract

The `ChatCapability` is the primary interface for text generation.

## Input Schema

```ts
interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}
```

- **Roles**:
  - `system`: Instructions for the model behavior.
  - `user`: Human input.
  - `assistant`: Model response.
- **Content**: Currently supports text-only. Multimodal support is planned for v2.

## Output Schema

```ts
interface ChatResponse {
  message: ChatMessage; // Role is always 'assistant'
  usage?: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };
}
```

## Streaming Contract

`ai.chat.stream()` returns an `AsyncIterable<ChatStreamChunk>`.

### Chunk Types

1.  **Delta**: `{ type: "delta", delta: string }`
    - Contains a fragment of the text generation.
2.  **Done**: `{ type: "done" }`
    - Signals completion. No more chunks will follow.

### Provider Requirements

All providers implementing `ChatAdapter` **MUST** support:

1.  System instructions (if provider doesn't support them natively, prepend to user prompt).
2.  Streaming text responses.
3.  Token usage (if provided by SDK).

## Unsupported in v1

- Function calling / Tools
- JSON Mode enforcement
- Image inputs
