---
name: navigating-anyai
description: Provides project context, core principles, and mandatory skill workflows for the anyai package. Use this skill as a starting point to understand the project and its development rules.
---

# Navigating anyai

## Project Context

**anyai** is a provider-agnostic AI runtime for Node.js that unifies multiple AI providers behind a single, stable API.

- **Tagline**: One API. Any AI provider.
- **Goal**: Allow developers to switch AI providers by configuration only, without rewriting application logic.
- **Key Feature**: Abstracts provider SDKs, request/response formats, streaming differences, and error handling.
- **Usage**: Can be used in any Node.js-based framework (e.g., React, Node.js, Next.js).
- **Core Principles**:
  1.  Capability-first API
  2.  Strict normalization
  3.  Minimal, stable public surface
  4.  Adapter-based provider integration
  5.  Streaming as a first-class concern

## Project Structure

The project maintains the following directory structure in `src/`:

```
src/
├─ index.ts                # public entry
├─ ai.ts                   # AI class
├─ core/
│  ├─ types.ts             # shared internal types
│  ├─ errors.ts
│  └─ normalize.ts
├─ providers/
│  ├─ gemini/
│  │  ├─ adapter.ts
│  │  └─ types.ts
│  └─ openai/
│     ├─ adapter.ts
│     └─ types.ts
└─ capabilities/
   └─ chat.ts
```

## Mandatory Skills & Workflows

Any feature or task in this repository MUST adhere to the following skill workflows:

### 1. Architecture & Design

> **Skill**: `@[.agent/skills/architecture]`

- **When**: Before writing code for any new feature or major refactor.
- **Action**: Use the `architecture` skill to analyze requirements, evaluate trade-offs, and document decisions (ADRs).
- **Rule**: "Requirements drive architecture. Trade-offs inform decisions."

### 2. Planning

> **Skill**: `@[.agent/skills/concise-planning]`

- **When**: Receiving a new task or user request.
- **Action**: Use the `concise-planning` skill to create a clear, actionable checklist.
- **Rule**: Break down tasks into atomic steps. Plan first, then execute.

### 3. Execution & Improvement

> **Skill**: `@[.agent/skills/kaizen]`

- **When**: Writing code, refactoring, or reviewing.
- **Action**: Apply `kaizen` principles:
  - **Continuous Improvement**: Small, frequent improvements.
  - **Poka-Yoke (Error Proofing)**: Design systems that prevent errors.
  - **Standardized Work**: Follow established patterns.
  - **Just-In-Time**: Build what's needed now, avoid over-engineering.

### 4. Issue Resolution

> **Skill**: `@[.agent/skills/issue-resolver]`

- **When**: Fixing bugs or addressing a list of issues.
- **Action**: Use the `issue-resolver` skill to systematically address issues.
- **Rule**: Contextualize, Plan, Execute, Verify.

### 5. Testing

> **Skill**: `@[.agent/skills/testing-anyai]`

- **When**: Creating tests, running test suites, or validating changes.
- **Action**: Use the `testing-anyai` skill for the correct testing strategy and layer selection.
- **Rule**: Test contracts, not provider behavior. Never test AI model outputs.

## Development Workflow

1.  **Understand**: Read `docs/AGENT.md` (via this skill) to grasp the "What" and "Why".
2.  **Plan**: Use `concise-planning` to break down the "How".
3.  **Design**: If complex, use `architecture` to validate the approach.
4.  **Build**: Implement using `kaizen` principles for quality.
5.  **Test**: Use `testing-anyai` to validate contracts and isolation.
6.  **Verify**: Ensure changes meet requirements and quality standards.

## Related Resources

- `docs/AGENT.md`: Full project documentation.
- `README.md`: Quick start and usage examples.
