# Implementation Plan: Dra Lia MVP

**Branch**: `002-dra-lia-mvp` | **Date**: 2026-02-20 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `specs/002-dra-lia-mvp/spec.md`

## Summary

Build the Dra Lia MVP: a React Native + Expo mobile app for uploading lab exam PDFs, with Firebase auth, drawer navigation, Home dashboard (relevant exams), Exams list (document status and item counts), and a BFF API plus async worker that runs OpenAI discovery/extraction and persists results. Frontend-first delivery with mocked data until backend is ready; design follows centralized tokens and Phosphor Icons per docs/design.md.

## Technical Context

**Language/Version**: Python 3.11+ (api), TypeScript/Node (app via Expo)  
**Primary Dependencies**: FastAPI, React Native, Expo, Firebase Auth, OpenAI Responses API, Alembic, AWS S3  
**Storage**: MVP SQLite (api); production PostgreSQL; PDF files in AWS S3  
**Testing**: pytest (api), Jest/Expo testing (app)  
**Target Platform**: Android and iOS (Expo); API on Linux (Railway)  
**Project Type**: Mobile + API (monorepo: `app`, `api`, `tools`, `docs`)  
**Performance Goals**: Upload accepted in &lt;2s; document list/detail &lt;1s; extraction completion within 10 min for typical PDF  
**Constraints**: BFF responses optimized for mobile; single API client file in app; OpenAPI-generated client  
**Scale/Scope**: MVP single-tenant; PDF uploads and exam visibility as primary scope

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. English-Only Engineering Artifacts | PASS | All code and docs in English |
| II. SpecKit-First Delivery | PASS | specify → clarify → plan → tasks → implement |
| III. Simplicity Over Cleverness | PASS | Minimal layers; BFF + worker; no extra abstractions |
| IV. MVP Velocity | PASS | No backward compatibility required |
| V. Clean Code and No Dead Artifacts | PASS | Remove unused code; centralize utilities |
| Monorepo Boundaries | PASS | Changes scoped to `app` or `api`; contracts at boundaries |
| Delivery Workflow | PASS | Plan and tasks before implementation |

## Project Structure

### Documentation (this feature)

```text
specs/002-dra-lia-mvp/
├── plan.md              # This file
├── research.md          # Phase 0
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1
├── contracts/           # Phase 1 (OpenAPI)
└── tasks.md             # Phase 2 (/speckit.tasks)
```

### Source Code (repository root)

```text
app/                     # React Native + Expo
├── src/
│   ├── components/     # Shared UI primitives, theme
│   ├── screens/        # Onboarding, Login, Signup, Home, Exams, Settings
│   ├── navigation/     # Drawer layout
│   ├── api/            # Single file + OpenAPI-generated client
│   └── theme/          # Tokens (colors, typography, spacing)
└── tests/

api/                     # Python FastAPI + worker
├── app/
│   ├── models/
│   ├── services/
│   ├── api/
│   └── worker/
├── alembic/
└── tests/

tools/                   # Scripts (if needed)
docs/                    # Project documentation
```

**Structure Decision**: Monorepo with `app` (mobile) and `api` (BFF + worker) per constitution. Cross-package coupling only via BFF API contract (OpenAPI). No shared code package for MVP.

## Complexity Tracking

No constitution violations requiring justification.
