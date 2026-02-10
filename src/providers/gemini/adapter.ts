// ** Application Service, Constants, and Type Imports
import { AnyAIProviderError } from "../../core/errors.js";
import type {
  ChatMessage,
  ChatResponse,
  ChatStreamChunk,
} from "../../core/types.js";
import type { ChatAdapter } from "../types.js";

export class GeminiAdapter implements ChatAdapter {
  private client: Promise<import("@google/genai").GoogleGenAI>;

  constructor(private apiKey: string) {
    this.client = this.initClient();
  }

  private async initClient() {
    try {
      const { GoogleGenAI } = await import("@google/genai");
      return new GoogleGenAI({ apiKey: this.apiKey });
    } catch (error: unknown) {
      throw new AnyAIProviderError(
        "Failed to load @google/genai. Install it with: npm install @google/genai",
        "gemini",
        error,
      );
    }
  }

  async send(messages: ChatMessage[], model: string): Promise<ChatResponse> {
    try {
      const client = await this.client;

      const contents = messages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

      const result = await client.models.generateContent({
        model,
        contents,
      });

      const responseText =
        result?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const usage = result?.usageMetadata;

      return {
        message: {
          role: "assistant",
          content: responseText,
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

      const contents = messages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

      const result = await client.models.generateContentStream({
        model,
        contents,
      });

      for await (const chunk of result) {
        const text = chunk.text;
        if (text) {
          yield { type: "delta", delta: text };
        }
      }

      yield { type: "done" };
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
