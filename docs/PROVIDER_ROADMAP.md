# Provider Roadmap

> **Status**: Saved for next patch development  
> **Last updated**: 2026-02-10

---

## Guiding Principle

> If adding a provider requires changing public types, the provider is added too early.

---

## ✅ v1 — Core Providers (Must-Have)

These validate the architecture and cover most real-world usage.

| Provider      | Why                                                  |
| ------------- | ---------------------------------------------------- |
| Google Gemini | Clean SDK, strong baseline, good normalization tests |
| OpenAI        | Industry default, forces good error + streaming      |

**v1 rule:** At least one provider must work perfectly. Two is ideal.

**Version target:** `v0.1.x`

---

## 🔶 v2 — Expansion Providers (After v1 is stable)

These stress-test differences without breaking the core.

| Provider   | Why                                                    |
| ---------- | ------------------------------------------------------ |
| Anthropic  | Different message semantics, strict normalization test |
| Mistral AI | Open + commercial blend, popular in EU / OSS           |

**Version target:** `v0.2.x`

---

## 🔷 v3 — Inference & Aggregators (Advanced)

Optional but powerful once the runtime matures.

| Provider    | Why                                           |
| ----------- | --------------------------------------------- |
| Groq        | Ultra-fast inference, streaming-heavy         |
| Together AI | Many open models, "meta-provider" stress test |

**Version target:** `v0.3.x`

---

## 🧪 v4 — Local & Self-Hosted (Power Users)

Unlock offline and self-hosted scenarios.

| Provider  | Why                                    |
| --------- | -------------------------------------- |
| Ollama    | Local-first, forces clean HTTP adapter |
| LM Studio | Developer-friendly, OpenAI-compatible  |

**Version target:** `v0.4.x`

---

## ❌ Explicitly NOT in Scope

Do not add these early — they add noise without architectural value:

- **Azure OpenAI** — wraps OpenAI, adds noise
- **AWS Bedrock** — huge surface area
- **Hugging Face Inference API** — too many model quirks
- **Perplexity** — product-first, not infra-first
