# Feature Specification: Dra Lia MVP

**Feature Branch**: `002-dra-lia-mvp`  
**Created**: 2026-02-20  
**Status**: Draft  
**Input**: User description: "Specify Dra Lia project from docs/mvp.md, docs/architecture.md, and docs/design.md"

## Specification Sources

This specification is derived from and must stay aligned with:

| Document | Purpose |
|----------|---------|
| `docs/mvp.md` | Product scope, functional and non-functional requirements |
| `docs/architecture.md` | Stack, auth, PDF/worker flow, document lifecycle, JSON contracts |
| `docs/design.md` | UX principles, visual tokens, iconography, consistency rules |

Implementation MUST follow SpecKit workflow: specify → clarify (when needed) → plan → tasks → implement.

## Clarifications

### Session 2026-02-20

- Q: When the user uploads a PDF whose SHA-256 already exists for that user, what should the system do by default? → A: Accept the file, mark the document as pending, and let the worker reprocess it normally.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Mobile Foundation and Access (Priority: P1)

As a user, I can sign in with Google, complete onboarding, and use drawer-based navigation to reach Home, Exams, and Settings so that I have a usable app shell and can manage my profile and logout.

**Why this priority**: Minimum viable app and entry point for all other flows.

**Independent Test**: Launch app, complete onboarding, sign in with Google, open drawer (profile, avatar, navigation, logout), navigate to Home/Exams/Settings. No backend extraction required.

**Acceptance Scenarios**:

1. **Given** a new user opens the app, **When** onboarding is shown, **Then** the user can complete it and reach the Login screen.
2. **Given** the user taps Google sign-in, **When** authentication succeeds, **Then** the user reaches the main app with drawer navigation.
3. **Given** an authenticated user, **When** opening the drawer, **Then** profile information, avatar, edit profile action, Settings entry, and Logout are visible and work.
4. **Given** design tokens are applied, **When** moving between screens, **Then** typography, spacing, icons (Phosphor), and colors follow the centralized design system.

---

### User Story 2 - Upload and Exam Visibility (Priority: P2)

As a user, I can upload a PDF lab exam report and see document status and exam attention indicators (total items, out-of-range count) on the Exams screen and Home dashboard.

**Why this priority**: Core product value—import and visibility of exam data.

**Independent Test**: Upload one or more PDFs; verify document appears in Exams with status; when processed, verify total item count and out-of-range count; verify Home dashboard shows relevant exams (out-of-range and follow-up).

**Acceptance Scenarios**:

1. **Given** an authenticated user, **When** the user taps "+" and uploads a PDF, **Then** a document is created (e.g. status `pending`) and appears in the Exams list.
2. **Given** a document is processed, **When** the user views Exams, **Then** each document shows import/processing status, total item count, and count of items requiring attention (out_of_range).
3. **Given** the user opens Home, **When** there are exams with out-of-range values or marked for follow-up, **Then** the dashboard shows those relevant exams.

---

### User Story 3 - Reliable Background Extraction (Priority: P3)

As an operator, I can rely on asynchronous workers to process pending documents, run discovery and extraction via LLM, persist results and errors, and recover with bounded retries so that uploaded PDFs become structured exam data or clear failure state.

**Why this priority**: Ensures uploaded documents become trustworthy, queryable exam data.

**Independent Test**: Run workers against pending documents; verify status transitions (pending → processing → processed/failed), persistence of raw JSON and exam items, and failure metadata when retries are exhausted.

**Acceptance Scenarios**:

1. **Given** pending documents exist, **When** a worker picks one, **Then** status becomes `processing` and worker/timing metadata is stored.
2. **Given** discovery returns `document_type=exam`, **When** extraction completes, **Then** status becomes `processed`, raw JSON is stored, and exam items are populated with out_of_range when possible.
3. **Given** discovery returns `document_type=other`, **When** processing is evaluated, **Then** extraction is skipped and status is set to `failed` with a clear error code (e.g. document_not_exam), no retries.
4. **Given** extraction fails or is incomplete, **When** retry policy runs, **Then** failure metadata is stored; after max retries status is `failed`.

---

### Edge Cases

- Duplicate PDF (same SHA-256) for the same user: system MUST accept the upload, create a new document record with status `pending`, and let the worker reprocess it normally (no automatic reject or deduplication by hash).
- Discovery lists exams but extraction returns fewer: worker validates coverage and may retry or mark incomplete/failed.
- OpenAI timeout or rate limit during discovery or extraction: errors persisted, retries with backoff up to max.
- Worker crashes after setting `processing`: document can remain in `processing` until timeout/cleanup or manual intervention.
- Corrupted or password-protected PDF: upload may succeed; processing should fail with clear error and no unbounded retries.
- Non-exam document: discovery returns `document_type=other`; status `failed`, error_code e.g. `document_not_exam`, no extraction or retries.

## Requirements *(mandatory)*

### Functional Requirements (from docs/mvp.md)

- **FR-001**: The mobile app MUST be implemented using React Native + Expo.
- **FR-002**: The mobile app MUST run on Android and iOS.
- **FR-003**: The app MUST provide a Login screen.
- **FR-004**: Authentication MUST use Firebase.
- **FR-005**: The Login flow MUST support Google social sign-in.
- **FR-006**: The app MUST provide a Signup screen.
- **FR-007**: The app MUST provide an onboarding experience explaining how the app works.
- **FR-008**: The app MUST provide Drawer-based navigation.
- **FR-009**: The Drawer MUST display user profile information and avatar.
- **FR-010**: The Drawer MUST provide an action to edit user information.
- **FR-011**: The Drawer MUST provide a Settings screen entry.
- **FR-012**: The Settings screen MUST be available and can be empty in the MVP.
- **FR-013**: The Drawer MUST provide a Logout action.
- **FR-014**: The app MUST provide side navigation icons using Phosphor Icons.
- **FR-015**: The Home screen MUST display a dashboard with relevant exams.
- **FR-016**: Relevant exams MUST include exams with out-of-range values.
- **FR-017**: Relevant exams MUST include exams marked by users as follow-up.
- **FR-018**: The app MUST provide a "+" action that navigates to a PDF import screen.
- **FR-019**: Users MUST be able to upload PDF files containing laboratory exam results.
- **FR-020**: The app MUST provide an Exams screen listing uploaded documents.
- **FR-021**: Each listed document MUST show import/processing status.
- **FR-022**: The Exams screen MUST show the total item count for each exam document.
- **FR-023**: The Exams screen MUST show how many exam items require attention (out_of_range).
- **FR-024**: Uploaded PDF documents MUST be processed asynchronously in the background.
- **FR-025**: The extraction process MUST use LLM/OpenAI.
- **FR-026**: The backend API MUST be implemented as a BFF.
- **FR-027**: The BFF MUST prioritize response models optimized for mobile UI consumption.

### Non-Functional Requirements (from docs/mvp.md)

- **NFR-001**: API access in the mobile app MUST be centralized in a single TypeScript file.
- **NFR-002**: This file MUST encapsulate all REST API communication logic.
- **NFR-003**: API calls MUST be performed through a client generated automatically from the backend OpenAPI documentation.
- **NFR-004**: Frontend prototyping MUST be delivered first.
- **NFR-005**: During frontend-first delivery, the backend MAY return mocked data structures required by the mobile UI.

### Design and UX Requirements (from docs/design.md)

- **DR-001**: All colors, typography, spacing, radii, and shadows MUST be defined in centralized theme tokens.
- **DR-002**: Shared UI primitives (Button, Input, Card, Badge, List Item, Screen Container) MUST be reusable and defined once.
- **DR-003**: No duplicated style objects for the same visual pattern across screens; no hardcoded visual values in feature screens.
- **DR-004**: Common states (loading, empty, error, success) MUST use the same UI patterns across the app.
- **DR-005**: Buttons MUST have clear pressed, disabled, and loading states; long operations (upload/processing) MUST show explicit status feedback.
- **DR-006**: Critical actions (logout, destructive operations) MUST include clear confirmation.
- **DR-007**: Sufficient contrast and comfortable touch targets; meaningful labels for actionable icons.

### Processing and Data (from docs/architecture.md)

- **AR-001**: Backend MUST store uploaded PDFs (e.g. in object storage), compute SHA-256, and create document records with status `pending`.
- **AR-002**: Workers MUST run discovery (document type, laboratory, exams list) then extraction only for `document_type=exam`; persist OpenAI response UUID and raw JSON; populate exam items with out_of_range when possible.
- **AR-003**: Document status lifecycle MUST support at least: `pending`, `processing`, `processed`, `failed`.
- **AR-004**: On failure, worker MUST persist error metadata (e.g. error_code, error_message, retry_count, last_failed_at); retry policy MUST be bounded with backoff; final status after max retries MUST be `failed`.
- **AR-005**: Auth: mobile sends Firebase ID token in `Authorization: Bearer <token>`; backend validates on protected endpoints; users access only their own documents and exam items.
- **AR-006**: Duplicate upload (same SHA-256 for same user): system MUST accept the upload, create a new document with status `pending`, and allow the worker to reprocess it normally; no reject or deduplication by hash.

### Key Entities

- **User**: Authenticated user identified by Firebase `uid`; owner of documents and exam items.
- **Document**: Uploaded PDF record: storage reference, SHA-256, status (pending/processing/processed/failed), raw extraction JSON, error metadata, timestamps.
- **ExamItem**: Extracted exam result: code, name, date, result_value, unit, reference_range, out_of_range, notes.
- **Response (OpenAI)**: Traceability record linking a document to a discovery or extraction request (e.g. response UUID).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can complete onboarding and sign in with Google, then use drawer navigation (profile, Settings, Logout) in a single session without errors.
- **SC-002**: A user can upload a PDF from the app and see it listed on the Exams screen with a visible status (e.g. pending/processing/processed/failed).
- **SC-003**: For processed documents, the Exams screen shows total item count and count of items requiring attention (out_of_range).
- **SC-004**: Home dashboard shows relevant exams (out-of-range and follow-up) when such data exists.
- **SC-005**: All main screens use centralized theme and shared components; no screen-specific duplicated style tokens for the same pattern.
- **SC-006**: Long operations (upload, processing) show explicit status feedback; critical actions (e.g. logout) require confirmation.

## Assumptions

- PDF uploads in MVP are laboratory exam reports only.
- Settings screen is intentionally empty in the first MVP iteration.
- Frontend-first delivery is acceptable; backend may use mocks until APIs are ready.
- Single social provider (Google) is sufficient for MVP.

## Out of Scope for MVP

- Advanced settings management.
- Multi-provider social login beyond Google.
- Complex analytics and historical trend modules.
