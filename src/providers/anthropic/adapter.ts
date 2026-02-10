// ** Application Service, Constants, and Type Imports
import type { ChatAdapter } from "../types.js";
import type {
  ChatMessage,
  ChatResponse,
  ChatStreamChunk,
} from "../../core/types.js";
import { AnyAIProviderError } from "../../core/errors.js";

// ** Third-Party Library Imports
import type Anthropic from "@anthropic-ai/sdk";

export class AnthropicAdapter implements ChatAdapter {
  private client: Promise<Anthropic>;

  constructor(private apiKey: string) {
    this.client = this.initClient();
  }

  private async initClient() {
    try {
      const { default: Anthropic } = await import("@anthropic-ai/sdk");
      return new Anthropic({ apiKey: this.apiKey });
    } catch (error: unknown) {
      throw new AnyAIProviderError(
        "Failed to load @anthropic-ai/sdk. Install it with: npm install @anthropic-ai/sdk",
        "anthropic",
        error,
      );
    }
  }

  private mapRole(role: ChatMessage["role"]): "user" | "assistant" {
    if (role === "system") {
      throw new AnyAIProviderError(
        "System messages should be passed strictly via the system parameter, not as part of the messages array for Anthropic.",
        "anthropic",
      );
    }
    return role;
  }

  async send(messages: ChatMessage[], model: string): Promise<ChatResponse> {
    try {
      const client = await this.client;

      const systemMessage = messages.find((m) => m.role === "system");
      const conversation = messages.filter((m) => m.role !== "system");

      const anthropicMessages = conversation.map((m) => ({
        role: this.mapRole(m.role),
        content: m.content,
      }));

      const response = await client.messages.create({
        model,
        messages: anthropicMessages,
        ...(systemMessage && { system: systemMessage.content }),
        max_tokens: 4096, // Default max tokens
      });

      const firstBlock = response.content[0];
      const content = firstBlock?.type === "text" ? firstBlock.text : "";

      return {
        message: {
          role: "assistant",
          content,
        },
        usage: {
          inputTokens: response.usage.input_tokens,
          outputTokens: response.usage.output_tokens,
          totalTokens:
            response.usage.input_tokens + response.usage.output_tokens,
        },
      };
    } catch (error: unknown) {
      if (error instanceof AnyAIProviderError) throw error;
      throw new AnyAIProviderError(
        error instanceof Error ? error.message : "Unknown Anthropic error",
        "anthropic",
        error,
      );
    }
  }

  async *stream(
    messages: ChatMessage[],
    model: string,
  ): AsyncIterable<ChatStreamChunk> {
    try {
      const client = await this.client;

      const systemMessage = messages.find((m) => m.role === "system");
      const conversation = messages.filter((m) => m.role !== "system");

      const anthropicMessages = conversation.map((m) => ({
        role: this.mapRole(m.role),
        content: m.content,
      }));

      const stream = await client.messages.create({
        model,
        messages: anthropicMessages,
        ...(systemMessage && { system: systemMessage.content }),
        max_tokens: 4096,
        stream: true,
      });

      for await (const chunk of stream) {
        if (
          chunk.type === "content_block_delta" &&
          chunk.delta.type === "text_delta"
        ) {
          yield { type: "delta" as const, delta: chunk.delta.text };
        }
      }

      yield { type: "done" as const };
    } catch (error: unknown) {
      if (error instanceof AnyAIProviderError) throw error;
      throw new AnyAIProviderError(
        error instanceof Error
          ? error.message
          : "Unknown Anthropic streaming error",
        "anthropic",
        error,
      );
    }
  }
}
