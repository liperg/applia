# Tasks: Dra Lia Prototype

**Input**: Design documents from `/specs/001-dra-lia-prototype/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/openapi.yaml

## Phase 1: Setup (Shared Infrastructure)

- [ ] T001 Create package structure for `app/` and `api/` according to plan.
- [ ] T002 Initialize Expo app and baseline navigation in `app/`.
- [ ] T003 Initialize FastAPI service and Alembic in `api/`.
- [ ] T004 [P] Configure environment management for Firebase, S3, and OpenAI keys.

---

## Phase 2: Foundational (Blocking)

- [ ] T005 Implement backend Firebase token validation middleware in `api/src/auth/`.
- [ ] T006 Create database schema and migrations for `users`, `documents`, `responses`, `exam_items`.
- [ ] T007 [P] Implement S3 upload service in `api/src/services/storage/`.
- [ ] T008 [P] Implement centralized design tokens and shared UI primitives in `app/src/theme/` and `app/src/components/`.
- [ ] T009 Implement centralized API access module in `app/src/api/client.ts` using generated OpenAPI client.
- [ ] T010 Implement backend error model and persistence helpers for document processing failures.

**Checkpoint**: Core platform is ready for independent user-story implementation.

---

## Phase 3: User Story 1 - Mobile Foundation and Access (Priority: P1) 🎯 MVP

**Goal**: Deliver onboarding, auth, and consistent drawer-based shell.

**Independent Test**: User can onboard, authenticate, navigate drawer, and logout with consistent visual system.

- [ ] T011 [US1] Build onboarding flow screens in `app/src/screens/onboarding/`.
- [ ] T012 [US1] Build login/signup screens with Firebase auth in `app/src/screens/auth/`.
- [ ] T013 [US1] Build drawer navigation with profile/avatar, Home, Exams, Settings, Logout in `app/src/navigation/`.
- [ ] T014 [US1] Apply design tokens and icon standards across all US1 screens.
- [ ] T015 [US1] Add auth session bootstrap and protected navigation guard.

**Checkpoint**: US1 is independently usable and demonstrable.

---

## Phase 4: User Story 2 - Upload and Exam Visibility (Priority: P2)

**Goal**: Allow PDF upload and show processing/result visibility in mobile UI.

**Independent Test**: User uploads a PDF and sees document status and result counters in UI.

- [ ] T016 [US2] Implement `POST /v1/documents` endpoint with S3 upload + SHA-256 in `api/src/api/documents.py`.
- [ ] T017 [US2] Implement `GET /v1/documents` and `GET /v1/documents/{id}` BFF endpoints.
- [ ] T018 [US2] Build PDF import screen and upload action in `app/src/screens/import/`.
- [ ] T019 [US2] Build Exams list UI with status, total items, and out-of-range counts in `app/src/screens/exams/`.
- [ ] T020 [US2] Build Home dashboard cards for relevant exams in `app/src/screens/home/`.
- [ ] T021 [US2] Implement `document_type=other` handling in API response and UI feedback.

**Checkpoint**: US2 works end-to-end with pending/processing visibility.

---

## Phase 5: User Story 3 - Reliable Worker Extraction Pipeline (Priority: P3)

**Goal**: Process pending documents asynchronously with discovery/extraction and bounded retries.

**Independent Test**: Worker turns pending documents into processed exam items or terminal failures with persisted error metadata.

- [ ] T022 [US3] Implement worker loop for picking `pending` documents in `api/src/workers/document_worker.py`.
- [ ] T023 [US3] Implement OpenAI discovery call returning JSON contract (`document_type`, `laboratory`, `exams`).
- [ ] T024 [US3] Implement extraction call returning full exam JSON contract including exam date.
- [ ] T025 [US3] Persist OpenAI response UUID records in `responses` for both discovery and extraction phases.
- [ ] T026 [US3] Implement exam coverage validation (discovered vs extracted) and retry scheduling.
- [ ] T027 [US3] Persist raw extraction JSON and populate `exam_items` on success.
- [ ] T028 [US3] Persist processing errors (`error_code`, `error_message`, `retry_count`, `last_failed_at`) and terminal `failed` status.

**Checkpoint**: US3 is reliable with clear observability and recovery behavior.

---

## Phase 6: Polish & Cross-Cutting

- [ ] T029 [P] Align app UI with `docs/design.md` consistency rules (no duplicated style patterns).
- [ ] T030 [P] Add baseline tests for auth flow, upload endpoint, and worker pipeline.
- [ ] T031 [P] Add OpenAPI client generation integration into app build workflow.
- [ ] T032 Run end-to-end prototype walkthrough and update quickstart notes if needed.

---

## Dependencies & Execution Order

- Setup (Phase 1) must complete before Foundational (Phase 2).
- Foundational (Phase 2) blocks all user stories.
- US1 (Phase 3) should be delivered first for MVP demo.
- US2 depends on foundational API + mobile shell.
- US3 depends on US2 document upload and data model.
- Polish runs after target user stories are complete.

## Parallel Opportunities

- T004, T007, T008 can run in parallel during setup/foundational work.
- US1 mobile UI tasks can run in parallel by screen area.
- US2 API endpoints and mobile screens can run in parallel after contracts are stable.
- US3 discovery/extraction integration and persistence tasks can run in parallel once worker skeleton is ready.
