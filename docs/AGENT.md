# AGENT.md

## Project Name
anyai — Provider-Agnostic AI Runtime for Node.js

## Tagline
One API. Any AI provider.

## Project Description

anyai is a provider-agnostic AI runtime for Node.js that unifies multiple AI providers behind a single, stable API.

It allows developers to switch AI providers by configuration only, without rewriting application logic.

The library abstracts provider SDKs, request/response formats, streaming differences, and error handling, and exposes capability-based APIs such as:

- ai.chat.send()
- ai.chat.stream()

---

## Core Principles

1. Capability-first API
2. Strict normalization
3. Minimal, stable public surface
4. Adapter-based provider integration
5. Streaming as a first-class concern

---

## Supported Capabilities (v1)

Chat:
- Non-streaming responses
- Streaming responses (async iterator)
- Unified message and usage formats

Provider Discovery:
- `getProviders()` for static metadata about supported providers and models

Out of scope:
- tools / functions
- multimodal
- images
- embeddings

---

## Adapter Contract

All providers must implement the same adapter interface.
Provider SDKs must never be exposed directly.

---

## Error & Streaming Rules

- All provider errors are wrapped in a unified error type
- Streaming is normalized into a single async-iterator format

---

## What This Project Is NOT

This is infrastructure, not product logic.
