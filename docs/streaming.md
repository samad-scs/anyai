# Streaming

Streaming is a first-class citizen in `anyai`.

## Why Async Iterators?

We use standard ES Next `AsyncIterable` (for `for await...of` loops) because:

1.  It is natively supported in Node.js, Deno, and Browsers.
2.  It works seamlessly with generators.
3.  It is easier to mock and test than `EventEmitter` or `ReadableStream`.

## Chunk Types

Streams yield `ChatStreamChunk` objects, not raw strings.

```ts
export type ChatStreamChunk =
  | { type: "delta"; delta: string }
  | { type: "done" };
```

- **delta**: Contains a piece of the generated text.
- **done**: Sentinel value indicating the stream has finished successfully.

## Provider Mapping Rules

Adapters must:

1.  Listen to the provider's stream events.
2.  Yield `{ type: "delta", delta: ... }` for every text fragment.
3.  Yield `{ type: "done" }` at the end.
4.  Handle errors by throwing `AnyAIProviderError` (which terminates the iterator).

## Cancellation Behavior

Iterating code can break the loop to "cancel" consumption. However, whether this actually cancels the underlying HTTP request depends on the provider SDK's support for `AbortSignal` (planned for future standardization in `anyai`).
