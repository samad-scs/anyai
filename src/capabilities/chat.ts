// ** Application Service, Constants, and Type Imports
import type {
  ChatMessage,
  ChatResponse,
  ChatStreamChunk,
} from "../core/types.js";
import type { ChatAdapter } from "../providers/types.js";

export class ChatCapability {
  constructor(
    private adapter: ChatAdapter,
    private model: string,
  ) {}

  send(input: { messages: ChatMessage[] }): Promise<ChatResponse> {
    return this.adapter.send(input.messages, this.model);
  }

  stream(input: { messages: ChatMessage[] }): AsyncIterable<ChatStreamChunk> {
    return this.adapter.stream(input.messages, this.model);
  }
}
