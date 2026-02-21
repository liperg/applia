# Copilot Instructions for This Repository

## Scope
- This repository is a monorepo with:
  - `app`: React Native application
  - `api`: Python backend

## Language Rules
- Write all code, comments, documentation, variable names, method names, class names, commit messages, and any technical artifacts in English.
- Do not introduce Portuguese (or any non-English language) inside source code or technical docs.

## Documentation Rules
- Do not generate documentation unless explicitly requested.
- When documentation is requested, place it only under the `docs/` directory.
- Do not create ad-hoc docs in other locations.

## Implementation Principles
- Prioritize simplicity over cleverness.
- Prefer the smallest, clearest solution that solves the root problem.
- Avoid unnecessary abstractions, layers, and dependencies.

## Mandatory Workflow
- Before implementing any change, follow the SpecKit workflow:
  - References:
    - https://github.com/github/spec-kit
    - https://github.com/github/spec-kit?tab=readme-ov-file#-detailed-process
- Treat this workflow as mandatory for planning and execution.

## Product Stage and Compatibility
- The app is not in production yet.
- Backward compatibility is not required.
- You may change APIs, contracts, and structures freely when it improves the codebase.

## Change Logging and History
- When making changes, do not document how things worked before.
- Focus only on the intended final state.

## Code Cleanliness
- Do not leave dead code.
- Remove unused methods, functions, imports, and files when identified.
- Keep the codebase clean and consistent after each change.

## Monorepo Conventions
- Keep changes scoped to the relevant package (`app` or `api`).
- Avoid coupling between `app` and `api` beyond explicit interfaces/contracts.
- Keep tooling and scripts straightforward and package-focused.