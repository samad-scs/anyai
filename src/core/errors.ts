// ─── Error Codes ─────────────────────────────────────────────────────────────

export const AnyAIErrorCode = {
  PROVIDER_ERROR: "PROVIDER_ERROR",
  CONFIG_ERROR: "CONFIG_ERROR",
  UNSUPPORTED: "UNSUPPORTED",
  RATE_LIMIT: "RATE_LIMIT",
  AUTH_ERROR: "AUTH_ERROR",
  NETWORK_ERROR: "NETWORK_ERROR",
} as const;

export type AnyAIErrorCode =
  (typeof AnyAIErrorCode)[keyof typeof AnyAIErrorCode];

// ─── Base Error ──────────────────────────────────────────────────────────────

export class AnyAIError extends Error {
  public readonly code: AnyAIErrorCode;

  constructor(message: string, code: AnyAIErrorCode) {
    super(message);
    this.name = "AnyAIError";
    this.code = code;
  }
}

// ─── Provider Error (wraps SDK-specific errors) ──────────────────────────────

export class AnyAIProviderError extends AnyAIError {
  public readonly provider: string;
  public readonly cause: unknown;

  constructor(message: string, provider: string, cause?: unknown) {
    super(message, AnyAIErrorCode.PROVIDER_ERROR);
    this.name = "AnyAIProviderError";
    this.provider = provider;
    this.cause = cause;
  }
}

// ─── Config Error ────────────────────────────────────────────────────────────

export class AnyAIConfigError extends AnyAIError {
  constructor(message: string) {
    super(message, AnyAIErrorCode.CONFIG_ERROR);
    this.name = "AnyAIConfigError";
  }
}

// ─── Unsupported Feature Error ───────────────────────────────────────────────

export class AnyAIUnsupportedError extends AnyAIError {
  public readonly feature: string;

  constructor(feature: string) {
    super(`Unsupported feature: ${feature}`, AnyAIErrorCode.UNSUPPORTED);
    this.name = "AnyAIUnsupportedError";
    this.feature = feature;
  }
}
