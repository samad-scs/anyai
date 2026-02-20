// ─── Ollama API Types (Internal Only) ────────────────────────────────────────

/** Request body for Ollama /api/chat endpoint. */
export interface OllamaChatRequest {
  model: string;
  messages: OllamaChatMessage[];
  stream: boolean;
}

export interface OllamaChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/** Non-streaming response from Ollama /api/chat. */
export interface OllamaChatResponse {
  model: string;
  message: {
    role: string;
    content: string;
  };
  done: boolean;
}

/** Single streamed chunk from Ollama /api/chat (newline-delimited JSON). */
export interface OllamaStreamChunk {
  model: string;
  message: {
    role: string;
    content: string;
  };
  done: boolean;
}
