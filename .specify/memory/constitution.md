<!--
Sync Impact Report
- Version change: 1.2.0 → 1.3.0
- Modified principles: III. Simplicity Over Cleverness, V. Clean Code and No Dead Artifacts
- Added sections: Monorepo Boundaries, Delivery Workflow
- Removed sections: None
- Templates requiring updates:
	- ✅ .specify/templates/plan-template.md (already compatible with constitution checks)
	- ✅ .specify/templates/spec-template.md (already compatible with requirements-first flow)
	- ✅ .specify/templates/tasks-template.md (already compatible with phased execution)
	- ✅ .github/copilot-instructions.md (already aligned)
- Follow-up TODOs: None
-->

# dralia Constitution

## Core Principles

### I. English-Only Engineering Artifacts
All source code, comments, documentation, variable names, method names, class names,
and technical communication inside repository files MUST be written in English.
This ensures consistency across contributors and tools.

### II. SpecKit-First Delivery
Every implementation change MUST follow the SpecKit workflow in this order:
`/speckit.constitution` → `/speckit.specify` → `/speckit.clarify` (when needed)
→ `/speckit.plan` → `/speckit.tasks` → `/speckit.implement`.
Work starts from specification and plan artifacts, not from ad-hoc coding.

### III. Simplicity Over Cleverness
Solutions MUST prioritize the smallest and clearest design that solves the root
problem. Unnecessary abstractions, layers, and dependencies MUST be avoided.
All written code MUST be easily testable, with clear boundaries and low coupling.
Implementations MUST keep dependencies to the minimum necessary to preserve fast,
reliable, and isolated tests.
Complexity requires explicit justification in planning artifacts.
When adding new dependencies in either `app` or `api`, teams MUST select the
latest stable version available at implementation time, unless a documented
exception is approved in the implementation plan.

### IV. MVP Velocity Without Backward Compatibility Constraints
The product is in MVP stage. Backward compatibility is NOT required.
APIs, data contracts, and internal structures MAY be changed when that improves
clarity, speed, or product fit.

### V. Clean Code and No Dead Artifacts
Unused methods, functions, imports, files, and obsolete paths MUST be removed
as part of each change. Change descriptions SHOULD focus on the final state and
MUST NOT include historical behavior narratives unless explicitly requested.
Utility logic MUST be centralized in utility classes to avoid code replication
across the codebase. Before creating any new utility method, developers MUST
check existing utility classes first and reuse available methods whenever
possible. New utility methods SHOULD be added only when no suitable reusable
method exists.

## Monorepo Boundaries

This repository is a monorepo composed of:
- `app`: React Native application
- `api`: Python backend
- `tools`: scripts and task-specific automation utilities
- `docs`: project documentation intended for human readers

Changes MUST stay scoped to the relevant package.
Cross-package coupling is allowed only through explicit interfaces/contracts.
Documentation MUST NOT be generated unless requested, and when requested it MUST
be created under `docs/` only, in an organized and objective format that is easy
for humans to read.

## Delivery Workflow

Before implementation, teams MUST complete specification and planning artifacts
using SpecKit commands. During implementation, tasks should be executed in
dependency order, with clear validation at phase checkpoints.

## Governance
<!-- Example: Constitution supersedes all other practices; Amendments require documentation, approval, migration plan -->

This constitution supersedes informal development habits.

Amendment policy:
- Any principle or governance change MUST update this file directly.
- Versioning follows semantic versioning:
	- MAJOR: incompatible governance or principle changes
	- MINOR: new principle or materially expanded rule
	- PATCH: clarifications without semantic change

Compliance policy:
- All planning and implementation reviews MUST check adherence to this constitution.
- Violations MUST be corrected before implementation proceeds, unless explicitly
	waived by project owners.

**Version**: 1.3.0 | **Ratified**: 2026-02-20 | **Last Amended**: 2026-02-20
