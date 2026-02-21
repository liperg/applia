# Tasks: Dra Lia MVP

**Input**: Design documents from `specs/002-dra-lia-mvp/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not explicitly requested in spec; test tasks omitted. Add in a later pass if needed.

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story (US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **app/**: React Native Expo at repo root (`app/src/`, `app/tests/`)
- **api/**: FastAPI at repo root (`api/app/`, `api/alembic/`, `api/tests/`)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and monorepo structure

- [x] T001 Create app/ and api/ directory structure per plan (app/src/components, screens, navigation, api, theme; api/app/models, services, api, worker; api/alembic)
- [x] T002 Initialize app/ with Expo (React Native), package.json, tsconfig in app/
- [x] T003 Initialize api/ with FastAPI, dependency file (pyproject.toml or requirements.txt), venv in api/
- [x] T004 [P] Add api/.env.example with placeholders (DATABASE_URL, S3, OPENAI, FIREBASE or similar)
- [x] T005 [P] Add app/ env config for API base URL and Firebase (e.g. app/.env.example or app config)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story implementation

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### App foundation

- [x] T006 Create centralized theme tokens (colors, typography, spacing) in app/src/theme/ per docs/design.md
- [x] T007 [P] Create shared UI primitives (Button, Input, Card, Badge, List Item, Screen Container) in app/src/components/
- [x] T008 Configure Firebase in app/ (Google sign-in, init)
- [x] T009 Create drawer navigation layout structure in app/src/navigation/
- [x] T010 Create single API client module in app/src/api/ with mocked responses matching specs/002-dra-lia-mvp/contracts/openapi.yaml

### API foundation

- [x] T011 Setup Alembic and initial migration for users, documents, responses, exam_items in api/alembic/
- [x] T012 Implement Firebase ID token validation middleware in api/app/ (e.g. api/app/middleware/auth.py or api/app/api/deps.py)
- [x] T013 [P] Create SQLAlchemy models User, Document, Response, ExamItem in api/app/models/ per data-model.md
- [x] T014 Setup FastAPI app and API router skeleton (e.g. api/app/main.py, api/app/api/router.py)

**Checkpoint**: Foundation ready — user story implementation can begin

---

## Phase 3: User Story 1 - Mobile Foundation and Access (Priority: P1) 🎯 MVP

**Goal**: User can sign in with Google, complete onboarding, use drawer navigation (profile, Settings, Logout), and reach Home, Exams, Settings screens with consistent design tokens.

**Independent Test**: Launch app, complete onboarding, sign in with Google, open drawer (profile, avatar, edit profile, Settings, Logout), navigate Home/Exams/Settings. No backend extraction required.

### Implementation for User Story 1

- [x] T015 [US1] Implement onboarding screen(s) in app/src/screens/onboarding/
- [x] T016 [US1] Implement Login screen with Google sign-in in app/src/screens/
- [x] T017 [US1] Implement Signup screen in app/src/screens/
- [x] T018 [US1] Implement drawer content (profile, avatar, edit profile action, Settings entry, Logout) in app/src/navigation/ or app/src/components/
- [x] T019 [US1] Implement Home screen (placeholder/dashboard shell) in app/src/screens/
- [x] T020 [US1] Implement Exams screen (placeholder/list shell) in app/src/screens/
- [x] T021 [US1] Implement Settings screen (empty MVP) in app/src/screens/
- [x] T022 [US1] Wire drawer navigation to Home, Exams, Settings; use Phosphor Icons (outlined default, 24 for nav) in app/src/navigation/

**Checkpoint**: User Story 1 is fully functional and independently testable (with mocked API)

---

## Phase 4: User Story 2 - Upload and Exam Visibility (Priority: P2)

**Goal**: User can upload a PDF, see document in Exams list with status and counts (total items, out-of-range); Home dashboard shows relevant exams when data exists.

**Independent Test**: Upload one or more PDFs; document appears in Exams with status; when processed, total item count and out-of-range count visible; Home shows relevant exams.

### Implementation for User Story 2

**API (BFF)**

- [x] T023 [US2] Implement POST /v1/documents (multipart upload) in api/app/api/; store file in S3, compute SHA-256, create document with status pending in api/app/
- [x] T024 [US2] Implement GET /v1/me (user profile by Firebase uid) and user upsert in api/app/api/ and api/app/services/
- [x] T025 [US2] Implement GET /v1/documents (list user documents) with status, totalItems, outOfRangeItems in api/app/api/
- [x] T026 [US2] Implement GET /v1/documents/{documentId} (detail with exam_items) in api/app/api/
- [x] T027 [US2] Implement S3 upload service and document creation in api/app/services/

**App**

- [x] T028 [US2] Add PDF picker and upload flow (e.g. "+" action to import screen) in app/src/screens/
- [x] T029 [US2] Call POST /v1/documents from app/src/api/ client; show new document in Exams list with status
- [x] T030 [US2] Exams list: display document status, totalItems, outOfRangeItems per OpenAPI contract in app/src/screens/
- [x] T031 [US2] Home dashboard: display relevant exams (out-of-range and follow-up) when data exists in app/src/screens/

**Checkpoint**: User Stories 1 and 2 are independently testable; upload and visibility work with real API

---

## Phase 5: User Story 3 - Reliable Background Extraction (Priority: P3)

**Goal**: Worker processes pending documents (discovery → extraction for exam type), persists raw JSON and exam_items, handles failures with bounded retries and error metadata.

**Independent Test**: Run worker against pending documents; status transitions pending→processing→processed/failed; raw JSON and exam_items persisted; failure metadata when max retries reached or document_not_exam.

### Implementation for User Story 3

- [ ] T032 [US3] Implement worker loop: fetch pending documents, set status processing, set processing_worker_id and processing_started_at in api/app/worker/
- [ ] T033 [US3] Implement discovery call (OpenAI Responses API); parse document_type; if other set status failed, error_code document_not_exam, no retries in api/app/worker/
- [ ] T034 [US3] Implement extraction call for document_type=exam; parse exams and out_of_range; persist raw JSON to documents.raw_json in api/app/worker/
- [ ] T035 [US3] Persist OpenAI response UUID(s) in responses table (discovery and extraction) in api/app/worker/
- [ ] T036 [US3] Populate exam_items from extraction JSON in api/app/worker/
- [ ] T037 [US3] On success set status processed, processing_finished_at; on failure persist error_code, error_message, retry_count, last_failed_at; bounded retries with backoff; final status failed after max retries in api/app/worker/

**Checkpoint**: All three user stories are functional; end-to-end upload → processing → visibility works

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final integration and quality

- [ ] T038 [P] Generate OpenAPI client for app from specs/002-dra-lia-mvp/contracts/openapi.yaml and use in app/src/api/
- [ ] T039 Run quickstart.md validation (app, api, worker; sign-in, upload, status transitions, duplicate upload per AR-006)
- [ ] T040 Code cleanup: remove dead code and unused imports per constitution (app/ and api/)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 — BLOCKS all user stories
- **Phase 3 (US1)**: Depends on Phase 2 — MVP
- **Phase 4 (US2)**: Depends on Phase 2; integrates with US1 (drawer, screens)
- **Phase 5 (US3)**: Depends on Phase 2 and document model/API from US2
- **Phase 6 (Polish)**: Depends on completion of desired user stories

### User Story Dependencies

- **US1 (P1)**: After Foundational only; no dependency on US2/US3 (uses mocked API)
- **US2 (P2)**: After Foundational; uses US1 screens/navigation; needs API endpoints and S3
- **US3 (P3)**: After Foundational; needs documents table and API; worker consumes pending documents

### Parallel Opportunities

- T004, T005 (Setup) can run in parallel
- T007, T013 (Foundational) can run in parallel
- Within US2: T023–T027 (API) can be parallelized by endpoint; T028–T031 (app) after API contract stable
- Within US3: T032–T037 are largely sequential (worker flow)
- T038, T40 (Polish) can run in parallel where different files

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup  
2. Complete Phase 2: Foundational  
3. Complete Phase 3: User Story 1  
4. **STOP and VALIDATE**: Test onboarding, login, drawer, navigation with mocks  
5. Demo/deploy app shell if ready  

### Incremental Delivery

1. Setup + Foundational → foundation ready  
2. US1 → test independently (mocked API) → MVP app shell  
3. US2 → real upload and list/detail → full mobile + BFF  
4. US3 → worker extraction → end-to-end flow  
5. Polish → OpenAPI client, quickstart validation, cleanup  

### Suggested MVP Scope

- **Minimum**: Phase 1 + Phase 2 + Phase 3 (User Story 1) for a demoable app with auth, onboarding, drawer, and placeholder screens.

---

## Notes

- [P] = different files, no dependencies; safe to run in parallel
- [USn] = task belongs to that user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Validate at each checkpoint before proceeding
- Paths follow plan: app/src/..., api/app/...
