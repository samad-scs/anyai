// ** Application Service, Constants, and Type Imports
import type {
  ChatMessage,
  ChatResponse,
  ChatStreamChunk,
} from "../core/types.js";

export interface ChatAdapter {
  send(messages: ChatMessage[], model: string): Promise<ChatResponse>;

  stream(
    messages: ChatMessage[],
    model: string,
  ): AsyncIterable<ChatStreamChunk>;
}
