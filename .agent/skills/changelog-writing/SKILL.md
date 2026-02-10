---
description: Standardized procedure for writing and updating the generic CHANGELOG.md file.
---

# Changelog Guidelines

This project follows the "Keep a Changelog" format but in a trimmed-down version.
The project also adheres to Semantic Versioning.

## Structure

The `CHANGELOG.md` file should maintain the following structure:

```markdown
# Changelog

All notable changes to this project are documented here.
This project follows Semantic Versioning.

## [Version] – YYYY-MM-DD

### Added

- New features.

### Changed

- Changes in existing functionality.

### Deprecated

- Features that will be removed in future releases.

### Removed

- Features that have been removed.

### Fixed

- Bug fixes.

### Security

- Security vulnerabilities fixes.
```

## Rules of Thumb

### ✅ Include

- **Public API changes**: Modifications to the exposed API.
- **Behavior changes**: Changes in how the improved code behaves from a user's perspective.
- **New providers / capabilities**: Additions of new AI providers or capabilities.
- **Docs changes**: Only includes documentation updates that significantly impact usage.

### ❌ Exclude

- **Internal refactors**: Code changes that do not affect the public API or behavior.
- **Test changes**: Modifications to tests or test infrastructure.
- **Formatting-only commits**: Changes to code style or formatting (e.g., prettier).
- **CI tweaks**: Adjustments to CI/CD pipelines.

## Versioning Discipline

- **Docs-only**: Increment patch version (e.g., 0.1.0 -> 0.1.1).
- **Backward-compatible API changes**: Increment minor version (e.g., 0.1.0 -> 0.2.0).
- **Breaking changes**: Increment major version (e.g., 0.1.0 -> 1.0.0).

**Key Principle**: If a change affects code that someone imports, it belongs in the changelog.
