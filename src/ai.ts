// ** Application Service, Constants, and Type Imports
import type { AIConfig, ProviderName } from "./core/types.js";
import type { ChatAdapter } from "./providers/types.js";
import { AnyAIConfigError } from "./core/errors.js";

// ** Custom Component Imports
import { ChatCapability } from "./capabilities/chat.js";

export class AI<P extends ProviderName = ProviderName> {
  public readonly chat: ChatCapability;

  private constructor(adapter: ChatAdapter, model: string) {
    this.chat = new ChatCapability(adapter, model);
  }

  static async create<P extends ProviderName>(
    config: AIConfig<P>,
  ): Promise<AI<P>> {
    const adapter = await AI.loadAdapter(config);
    return new AI<P>(adapter, config.model);
  }

  private static async loadAdapter<P extends ProviderName>(
    config: AIConfig<P>,
  ): Promise<ChatAdapter> {
    // ** Provider Registry for Lazy Loading
    // Each loader returns a factory that creates a ChatAdapter from config.
    const providerLoaders: Record<
      ProviderName,
      () => Promise<(config: AIConfig<any>) => ChatAdapter>
    > = {
      gemini: async () => {
        const { GeminiAdapter } = await import("./providers/gemini/adapter.js");
        return (cfg) => new GeminiAdapter(cfg.apiKey as string);
      },
      openai: async () => {
        const { OpenAIAdapter } = await import("./providers/openai/adapter.js");
        return (cfg) => new OpenAIAdapter(cfg.apiKey as string);
      },
      anthropic: async () => {
        const { AnthropicAdapter } =
          await import("./providers/anthropic/adapter.js");
        return (cfg) => new AnthropicAdapter(cfg.apiKey as string);
      },
      ollama: async () => {
        const { OllamaAdapter } =
          await import("./providers/ollama/adapter.js");
        return (cfg) => new OllamaAdapter(cfg.baseURL);
      },
    };

    const loader = providerLoaders[config.provider];

    if (!loader) {
      throw new AnyAIConfigError(`Unsupported provider: ${config.provider}`);
    }

    const factory = await loader();
    return factory(config);
  }
}
