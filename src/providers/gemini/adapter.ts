// ** Application Service, Constants, and Type Imports
import type { ChatAdapter } from "../types.js";
import type {
  ChatMessage,
  ChatResponse,
  ChatStreamChunk,
} from "../../core/types.js";
import { AnyAIProviderError } from "../../core/errors.js";

export class GeminiAdapter implements ChatAdapter {
  private client: Promise<import("@google/generative-ai").GoogleGenerativeAI>;

  constructor(private apiKey: string) {
    this.client = this.initClient();
  }

  private async initClient() {
    try {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      return new GoogleGenerativeAI(this.apiKey);
    } catch (error: unknown) {
      throw new AnyAIProviderError(
        "Failed to load @google/generative-ai. Install it with: npm install @google/generative-ai",
        "gemini",
        error,
      );
    }
  }

  async send(messages: ChatMessage[], model: string): Promise<ChatResponse> {
    try {
      const client = await this.client;
      const genModel = client.getGenerativeModel({ model });

      const history = messages.slice(0, -1).map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

      const lastMessage = messages[messages.length - 1];
      if (!lastMessage) {
        throw new AnyAIProviderError("No messages provided.", "gemini");
      }

      const chat = genModel.startChat({ history });
      const result = await chat.sendMessage(lastMessage.content);

      const usage = result.response.usageMetadata;

      return {
        message: {
          role: "assistant" as const,
          content: result.response.text(),
        },
        usage: usage
          ? {
              inputTokens: usage.promptTokenCount,
              outputTokens: usage.candidatesTokenCount,
              totalTokens: usage.totalTokenCount,
            }
          : undefined,
      };
    } catch (error: unknown) {
      if (error instanceof AnyAIProviderError) throw error;
      throw new AnyAIProviderError(
        error instanceof Error ? error.message : "Unknown Gemini error",
        "gemini",
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
      const genModel = client.getGenerativeModel({ model });

      const history = messages.slice(0, -1).map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

      const lastMessage = messages[messages.length - 1];
      if (!lastMessage) {
        throw new AnyAIProviderError("No messages provided.", "gemini");
      }

      const chat = genModel.startChat({ history });
      const result = await chat.sendMessageStream(lastMessage.content);

      for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) {
          yield { type: "delta" as const, delta: text };
        }
      }

      yield { type: "done" as const };
    } catch (error: unknown) {
      if (error instanceof AnyAIProviderError) throw error;
      throw new AnyAIProviderError(
        error instanceof Error
          ? error.message
          : "Unknown Gemini streaming error",
        "gemini",
        error,
      );
    }
  }
}
