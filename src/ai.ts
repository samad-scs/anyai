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
    switch (config.provider) {
      case "gemini": {
        const { GeminiAdapter } = await import("./providers/gemini/adapter.js");
        return new GeminiAdapter(config.apiKey);
      }

      case "openai": {
        const { OpenAIAdapter } = await import("./providers/openai/adapter.js");
        return new OpenAIAdapter(config.apiKey);
      }

      case "anthropic": {
        throw new AnyAIConfigError("Anthropic adapter not implemented yet.");
      }

      default: {
        const exhaustive = config.provider as never;
        throw new AnyAIConfigError(
          `Unsupported provider: ${exhaustive as string}`,
        );
      }
    }
  }
}
