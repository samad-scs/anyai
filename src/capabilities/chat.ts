// ** Application Service, Constants, and Type Imports
import type {
  ChatMessage,
  ChatResponse,
  ChatStreamChunk,
} from "../core/types.js";
import type { ChatAdapter } from "../providers/types.js";

export class ChatCapability {
  constructor(
    private getAdapter: () => Promise<ChatAdapter>,
    private model: string,
  ) {}

  async send(input: { messages: ChatMessage[] }): Promise<ChatResponse> {
    const adapter = await this.getAdapter();
    return adapter.send(input.messages, this.model);
  }

  async *stream(
    input: { messages: ChatMessage[] },
  ): AsyncIterable<ChatStreamChunk> {
    const adapter = await this.getAdapter();
    yield* adapter.stream(input.messages, this.model);
  }
}
