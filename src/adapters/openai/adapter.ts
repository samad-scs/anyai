// ** Application Service, Constants, and Type Imports
import type { ChatAdapter } from "../types.js";
import type {
  ChatMessage,
  ChatResponse,
  ChatStreamChunk,
} from "../../core/types.js";
import { AnyAIProviderError } from "../../core/errors.js";

export class OpenAIAdapter implements ChatAdapter {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async getClient(): Promise<
    InstanceType<typeof import("openai").default>
  > {
    try {
      const { default: OpenAI } = await import("openai");
      return new OpenAI({ apiKey: this.apiKey });
    } catch (error: unknown) {
      throw new AnyAIProviderError(
        "Failed to load openai. Install it with: npm install openai",
        "openai",
        error,
      );
    }
  }

  async send(messages: ChatMessage[], model: string): Promise<ChatResponse> {
    try {
      const client = await this.getClient();

      const result = await client.chat.completions.create({
        model,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      });

      const choice = result.choices[0];
      if (!choice) {
        throw new AnyAIProviderError("No response from OpenAI.", "openai");
      }

      return {
        message: {
          role: "assistant" as const,
          content: choice.message.content ?? "",
        },
        usage: result.usage
          ? {
              inputTokens: result.usage.prompt_tokens,
              outputTokens: result.usage.completion_tokens,
              totalTokens: result.usage.total_tokens,
            }
          : undefined,
      };
    } catch (error: unknown) {
      if (error instanceof AnyAIProviderError) throw error;
      throw new AnyAIProviderError(
        error instanceof Error ? error.message : "Unknown OpenAI error",
        "openai",
        error,
      );
    }
  }

  async *stream(
    messages: ChatMessage[],
    model: string,
  ): AsyncIterable<ChatStreamChunk> {
    try {
      const client = await this.getClient();

      const stream = await client.chat.completions.create({
        model,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        stream: true,
      });

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content;
        if (delta) {
          yield { type: "delta" as const, delta };
        }
      }

      yield { type: "done" as const };
    } catch (error: unknown) {
      if (error instanceof AnyAIProviderError) throw error;
      throw new AnyAIProviderError(
        error instanceof Error
          ? error.message
          : "Unknown OpenAI streaming error",
        "openai",
        error,
      );
    }
  }
}
