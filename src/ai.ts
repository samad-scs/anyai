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
    const providerLoaders: Record<
      ProviderName,
      () => Promise<new (apiKey: string) => ChatAdapter>
    > = {
      gemini: async () => {
        const { GeminiAdapter } = await import("./providers/gemini/adapter.js");
        return GeminiAdapter;
      },
      openai: async () => {
        const { OpenAIAdapter } = await import("./providers/openai/adapter.js");
        return OpenAIAdapter;
      },
      anthropic: async () => {
        const { AnthropicAdapter } =
          await import("./providers/anthropic/adapter.js");
        return AnthropicAdapter;
      },
    };

    const loader = providerLoaders[config.provider];

    if (!loader) {
      throw new AnyAIConfigError(`Unsupported provider: ${config.provider}`);
    }

    const AdapterClass = await loader();
    return new AdapterClass(config.apiKey);
  }
}
