# Changelog

All notable changes to this project are documented in this file.

The format is based on Keep a Changelog and this project adheres to Semantic Versioning.

## [Unreleased]

### Security

- Pinned transitive `@toon-format/toon` to `2.3.1` to resolve the high-severity
  dependency advisory while awaiting a compatible published `crap-typescript` release.

## [0.0.4] - 2026-08-30

### Maintenance

- Migrated the build toolchain to TypeScript 7 and tsdown with ESM, CommonJS, and declaration output checks.
- Updated GitHub Actions to setup-node 7 and strengthened build-output validation in CI and releases.
- Updated Vitest and CRAP gate development tooling, including the native CRAP default threshold.

## [0.0.3] - 2026-08-29

### Maintenance

- Updated `vitest` and `@vitest/coverage-v8` from 4.1.10 to 4.1.11.

## [0.0.2] - 2026-08-09

### Maintenance

- Validated automated public npm publication through GitHub Actions Trusted Publishing and OIDC.

## [0.0.1] - 2026-08-09

### Added

- Published the initial `@barney-media/utils-typescript` package.
- Added `ByteUnit` and `BitUnit` conversions across binary and decimal storage and transfer units.
- Added cross-conversion helpers and configurable bits-per-byte support.
- Added ESM, CommonJS, and TypeScript declaration build artifacts.

[unreleased]: https://github.com/fabian-barney/utils-typescript/compare/v0.0.4...HEAD
[0.0.4]: https://github.com/fabian-barney/utils-typescript/releases/tag/v0.0.4
[0.0.3]: https://github.com/fabian-barney/utils-typescript/releases/tag/v0.0.3
[0.0.2]: https://github.com/fabian-barney/utils-typescript/releases/tag/v0.0.2
[0.0.1]: https://github.com/fabian-barney/utils-typescript/releases/tag/v0.0.1
