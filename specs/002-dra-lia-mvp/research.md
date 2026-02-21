# Research: Dra Lia MVP

**Branch**: 002-dra-lia-mvp | **Date**: 2026-02-20

## Decisions (from docs/architecture.md and docs/design.md)

### Stack

| Area | Decision | Rationale |
|------|----------|-----------|
| Mobile | React Native + Expo | FR-001, FR-002; single codebase for Android/iOS; Expo Go for iteration |
| Auth | Firebase + Google sign-in | FR-004, FR-005; backend validates ID token on protected endpoints |
| API | FastAPI, OpenAPI | BFF for mobile; client generated from OpenAPI (NFR-003) |
| DB (MVP) | SQLite | docs/architecture.md; production PostgreSQL later |
| PDF storage | AWS S3 | docs/architecture.md |
| Extraction | OpenAI Responses API | Two-step: discovery (document_type, exams list) then extraction (exam items, out_of_range) |
| UI baseline | Craft React Native | docs/architecture.md; adapt to design tokens (docs/design.md) |
| Icons | Phosphor Icons | FR-014; outlined default, filled for active |

### Extraction flow

- **Decision**: Two-step (discovery → extraction). Only `document_type=exam` proceeds to extraction.
- **Rationale**: Reduces cost and truncation risk; discovery returns exam list for full extraction.
- **Alternatives considered**: Single-step extraction (rejected: higher truncation risk on large PDFs).

### Duplicate upload (clarification)

- **Decision**: Accept upload, create new document with status `pending`, worker reprocesses normally (AR-006).
- **Rationale**: User may want to re-run extraction (e.g. model update); no deduplication by SHA-256.

### Design tokens

- **Decision**: Centralized theme only (colors, typography, spacing, radii); shared primitives (Button, Input, Card, Badge, List Item, Screen Container).
- **Rationale**: docs/design.md; consistency and single source of truth.

## No NEEDS CLARIFICATION

Technical context is fully defined by docs/mvp.md, docs/architecture.md, and docs/design.md. Implementation can proceed from this plan and data-model/contracts.
