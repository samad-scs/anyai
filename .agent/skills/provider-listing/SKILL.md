---
name: provider-listing
description: Instructions for updating the README when a new provider is implemented.
---

# Provider Listing

## When to use this skill

- When a new AI provider is added to the `anyai` package.
- When existing providers gain new capabilities (e.g., streaming support).
- When asked to list supported providers.

## Instructions

Whenever a new provider (e.g., Anthropic, Mistral, DeepSeek) is added to the codebase, you MUST update the `README.md` file in the root directory to reflect this addition.

1.  **Locate the `Supported Providers` Table**: Find the table under the `## Supported Providers` section in `README.md`.
2.  **Add a New Row**:
    - **Provider**: The name of the provider.
    - **send()**: Mark with `✅` if supported, otherwise `❌` or `🔜`.
    - **stream()**: Mark with `✅` if supported, otherwise `❌` or `🔜`.
    - **SDK**: The npm package name for the provider's SDK (e.g., `openai`, `@google/generative-ai`), or `—` if none is required.
3.  **Maintain Order**: Insert the new row in alphabetical order by provider name.

### Example Table Row

| Provider  | send() | stream() | SDK                 |
| --------- | ------ | -------- | ------------------- |
| Anthropic | ✅     | ✅       | `@anthropic-ai/sdk` |
