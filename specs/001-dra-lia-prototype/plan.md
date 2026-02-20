# Implementation Plan: Dra Lia Prototype

**Branch**: `001-dra-lia-prototype` | **Date**: 2026-02-20 | **Spec**: /specs/001-dra-lia-prototype/spec.md
**Input**: Feature specification from `/specs/001-dra-lia-prototype/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Build the Dra Lia MVP prototype using a frontend-first strategy with React Native + Expo and a FastAPI BFF. The prototype supports Firebase authentication, PDF upload, asynchronous worker-based extraction through OpenAI Responses API, and consistent minimal UX with centralized design tokens and reusable primitives.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript (React Native/Expo), Python 3.11+  
**Primary Dependencies**: Expo, React Navigation (Drawer), Firebase Auth, Phosphor Icons, FastAPI, Alembic, OpenAI SDK, boto3  
**Storage**: SQLite (MVP), PostgreSQL (production target), AWS S3 for PDFs  
**Testing**: Jest + React Native Testing Library (app), pytest (api)  
**Target Platform**: iOS and Android mobile clients, Linux containerized backend/workers  
**Project Type**: Mobile + API monorepo (`app` + `api`)  
**Performance Goals**: Document status visible in app quickly after upload; 95% of valid PDFs reach terminal state within 10 minutes in staging  
**Constraints**: Frontend-first delivery, centralized API client in one TypeScript module, centralized visual tokens/components, bounded retries for worker failures  
**Scale/Scope**: MVP prototype with authentication, upload, async extraction, dashboard, and exams list

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. English-Only Engineering Artifacts**: PASS. All generated artifacts in `specs/001-dra-lia-prototype` are written in English.
- **II. SpecKit-First Delivery**: PASS. Flow executed with SpecKit scripts (`create-new-feature`, `setup-plan`) before implementation.
- **III. Simplicity Over Cleverness**: PASS. Prototype design uses minimal stack and clear boundaries; complexity reserved for required async extraction reliability.
- **IV. MVP Velocity Without Backward Compatibility Constraints**: PASS. No backward-compat constraints assumed; contracts can evolve for MVP fit.
- **V. Clean Code and No Dead Artifacts**: PASS. Plan enforces centralized reusable UI/API primitives and avoids duplicated patterns.
- **Monorepo Boundaries**: PASS. Scope explicitly split into `app` and `api` with contract-based coupling only.

## Project Structure

### Documentation (this feature)

```text
specs/001-dra-lia-prototype/
├── plan.md
├── spec.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md
```

### Source Code (repository root)

```text
app/
├── src/
│   ├── screens/
│   ├── components/
│   ├── navigation/
│   ├── theme/
│   └── api/
└── tests/

api/
├── src/
│   ├── api/
│   ├── auth/
│   ├── workers/
│   ├── models/
│   ├── services/
│   └── db/
└── tests/

docs/
└── *.md
```

**Structure Decision**: Use `app` and `api` as isolated packages with explicit contract coupling via OpenAPI and shared JSON contracts documented in feature artifacts.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
