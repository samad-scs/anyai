// ** Application Service, Constants, and Type Imports
import { AnyAIProviderError } from "../../core/errors.js";
import type {
  ChatMessage,
  ChatResponse,
  ChatStreamChunk,
} from "../../core/types.js";
import type { ChatAdapter } from "../types.js";

// ** Internal Provider Types
import type {
  OllamaChatRequest,
  OllamaChatResponse,
  OllamaStreamChunk,
} from "./types.js";

const DEFAULT_BASE_URL = "http://localhost:11434";

export class OllamaAdapter implements ChatAdapter {
  private readonly baseURL: string;

  constructor(baseURL: string = DEFAULT_BASE_URL) {
    // Strip trailing slash for consistent URL construction
    this.baseURL = baseURL.replace(/\/+$/, "");
  }

  async send(messages: ChatMessage[], model: string): Promise<ChatResponse> {
    try {
      const body: OllamaChatRequest = {
        model,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        stream: false,
      };

      const response = await fetch(`${this.baseURL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        throw new AnyAIProviderError(
          `Ollama HTTP ${response.status}: ${errorText}`,
          "ollama",
        );
      }

      let data: OllamaChatResponse;
      try {
        data = (await response.json()) as OllamaChatResponse;
      } catch (cause: unknown) {
        throw new AnyAIProviderError(
          "Failed to parse Ollama response as JSON",
          "ollama",
          cause,
        );
      }

      return {
        message: {
          role: "assistant",
          content: data.message?.content ?? "",
        },
        usage: undefined,
      };
    } catch (error: unknown) {
      if (error instanceof AnyAIProviderError) throw error;
      throw new AnyAIProviderError(
        error instanceof Error ? error.message : "Unknown Ollama error",
        "ollama",
        error,
      );
    }
  }

  async *stream(
    messages: ChatMessage[],
    model: string,
  ): AsyncIterable<ChatStreamChunk> {
    let response: Response;

    try {
      const body: OllamaChatRequest = {
        model,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        stream: true,
      };

      response = await fetch(`${this.baseURL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        throw new AnyAIProviderError(
          `Ollama HTTP ${response.status}: ${errorText}`,
          "ollama",
        );
      }
    } catch (error: unknown) {
      if (error instanceof AnyAIProviderError) throw error;
      throw new AnyAIProviderError(
        error instanceof Error ? error.message : "Ollama connection failed",
        "ollama",
        error,
      );
    }

    // Stream body must exist for streaming responses
    if (!response.body) {
      throw new AnyAIProviderError(
        "Ollama response body is empty",
        "ollama",
      );
    }

    try {
      yield* this.parseNDJSONStream(response.body);
    } catch (error: unknown) {
      if (error instanceof AnyAIProviderError) throw error;
      throw new AnyAIProviderError(
        error instanceof Error
          ? error.message
          : "Unknown Ollama streaming error",
        "ollama",
        error,
      );
    }
  }

  /**
   * Parses a newline-delimited JSON stream from Ollama.
   * Handles partial chunks, empty lines, and malformed JSON safely.
   */
  private async *parseNDJSONStream(
    body: ReadableStream<Uint8Array>,
  ): AsyncIterable<ChatStreamChunk> {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Process complete lines
        const lines = buffer.split("\n");
        // Keep the last (potentially incomplete) segment in the buffer
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          let chunk: OllamaStreamChunk;
          try {
            chunk = JSON.parse(trimmed) as OllamaStreamChunk;
          } catch {
            // Skip malformed JSON lines — Ollama may send partial data
            continue;
          }

          if (chunk.done) {
            yield { type: "done" };
            return;
          }

          const content = chunk.message?.content;
          if (content) {
            yield { type: "delta", delta: content };
          }
        }
      }

      // Process remaining buffer content
      if (buffer.trim()) {
        try {
          const chunk = JSON.parse(buffer.trim()) as OllamaStreamChunk;
          if (!chunk.done && chunk.message?.content) {
            yield { type: "delta", delta: chunk.message.content };
          }
        } catch {
          // Ignore trailing partial data
        }
      }

      // Ensure done is always emitted
      yield { type: "done" };
    } finally {
      reader.releaseLock();
    }
  }
}
