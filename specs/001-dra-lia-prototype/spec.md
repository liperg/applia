# Feature Specification: Dra Lia Prototype

**Feature Branch**: `001-dra-lia-prototype`  
**Created**: 2026-02-20  
**Status**: Draft  
**Input**: User description: "Build Dra Lia prototype from MVP, architecture and design docs"

## Clarifications

### Session 2026-02-20

- Q: For documents classified as `document_type=other` in discovery, what should be the official behavior? → A: Set status to `failed` with `error_code=document_not_exam` and no retries.

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Mobile Foundation and Access (Priority: P1)

As a user, I can authenticate with Google/Firebase, complete onboarding, and navigate a clean drawer-based app shell to reach Home, Exams, and Settings.

**Why this priority**: This is the minimum usable mobile prototype and unlocks all other journeys.

**Independent Test**: Can be fully tested by launching the app, signing in, viewing onboarding, opening drawer, and logging out without backend extraction.

**Acceptance Scenarios**:

1. **Given** a new user opens the app, **When** onboarding completes, **Then** the user can reach login and sign in with Google.
2. **Given** an authenticated user, **When** opening the drawer, **Then** profile/avatar, navigation entries, and logout action are visible and functional.
3. **Given** the design system is applied, **When** moving between screens, **Then** typography, spacing, icons, and colors remain consistent.

---

### User Story 2 - Upload and Exam Visibility (Priority: P2)

As a user, I can upload a PDF exam report and track document status and exam attention indicators from mobile screens.

**Why this priority**: Upload + visibility is the core product value for MVP.

**Independent Test**: Can be tested by uploading supported PDFs and validating document state + counts in Exams and Home dashboard.

**Acceptance Scenarios**:

1. **Given** an authenticated user, **When** the user uploads a PDF, **Then** a document record is created with status `pending` and appears in Exams.
2. **Given** processed exam items, **When** opening Home and Exams, **Then** the UI shows total exam items and out-of-range counts.
3. **Given** a non-exam PDF classified by discovery, **When** processing is evaluated, **Then** extraction is skipped and a clear status/error is recorded.

---

### User Story 3 - Reliable Worker Extraction Pipeline (Priority: P3)

As an operator, I can rely on asynchronous workers to process pending documents, persist extraction artifacts, and recover from failures with retries.

**Why this priority**: Reliability ensures uploaded documents become trustworthy structured data.

**Independent Test**: Can be tested by running workers against pending documents and verifying state transitions, response IDs, and `exam_items` population.

**Acceptance Scenarios**:

1. **Given** pending documents exist, **When** a worker picks one, **Then** status changes to `processing`, worker ID and start time are saved.
2. **Given** discovery/extraction succeed, **When** processing finishes, **Then** status becomes `processed`, raw JSON is stored, and `exam_items` are inserted.
3. **Given** extraction fails or is incomplete, **When** retry policy is applied, **Then** failure metadata is stored in `documents` and status eventually becomes `failed` after max retries.

---

### Edge Cases

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right edge cases.
-->

- Duplicate PDF upload with same SHA-256 for the same user should create a new processing cycle only when explicitly allowed.
- Discovery returns `document_type=other`; extraction should not run, status must be set to `failed` with `error_code=document_not_exam`, and retries must be skipped.
- Discovery lists exams but extraction returns fewer exams than discovered.
- OpenAI API timeout/rate-limit during discovery or extraction.
- Worker crashes after setting `processing` but before completion.
- Corrupted or password-protected PDF upload.

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: Mobile app MUST be implemented with React Native + Expo and run on Android and iOS.
- **FR-002**: Authentication MUST use Firebase and support Google sign-in.
- **FR-003**: App MUST provide onboarding, login, signup, drawer navigation, profile summary, settings entry, and logout.
- **FR-004**: App MUST provide a PDF import entry point (`+`) and an Exams screen listing uploaded documents.
- **FR-005**: Backend MUST expose a BFF REST API optimized for mobile UI responses.
- **FR-006**: Uploaded PDFs MUST be stored in AWS S3 and hashed with SHA-256.
- **FR-007**: Documents MUST start with `pending` status and be processed asynchronously by workers.
- **FR-008**: Worker processing MUST persist `processing_worker_id`, `processing_started_at`, and `processing_finished_at`.
- **FR-009**: Worker MUST execute discovery and extraction using OpenAI Responses API and persist OpenAI response UUID in `responses`.
- **FR-010**: Discovery MUST return JSON containing at least `document_type`, `laboratory`, and detected `exams`.
- **FR-011**: Only documents classified as `exam` in discovery MUST continue to extraction.
- **FR-011a**: Documents classified as `other` in discovery MUST be finalized with status `failed`, `error_code=document_not_exam`, and no retry scheduling.
- **FR-012**: Extraction MUST return JSON containing exam rows with date, result value, references, and out-of-range analysis when possible.
- **FR-013**: On successful processing, system MUST set status `processed`, store raw JSON in `documents`, and populate `exam_items`.
- **FR-014**: Processing failures MUST be saved in `documents` with error metadata (`error_code`, `error_message`, `retry_count`, `last_failed_at`).
- **FR-015**: Retry policy MUST be bounded with backoff and end in `failed` after max retries.
- **FR-016**: Mobile API access MUST be centralized in one TypeScript module and consume an OpenAPI-generated client.
- **FR-017**: Visual system MUST be centralized via shared tokens/components, with no duplicated style patterns across screens.

### Key Entities *(include if feature involves data)*

- **User**: Authenticated mobile user identified by Firebase `uid`, owner of documents and exam items.
- **Document**: Uploaded PDF lifecycle record with storage path, SHA-256, statuses (`pending`, `processing`, `processed`, `failed`), raw extraction JSON, and error metadata.
- **Response**: OpenAI Responses API tracking record linked to a document and request phase (`discovery` or `extraction`).
- **ExamItem**: Structured extracted exam result, including code/name/date/result/unit/reference and `out_of_range` flag.
- **ProcessingAttempt**: Implicit retry metadata stored on `documents` to track attempt count, last failure, and worker ownership.
- **DesignTokenSet**: Centralized UI definitions for colors, typography, spacing, icon sizes, and reusable component variants.

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: 95% of users can complete onboarding + login + drawer navigation in under 3 minutes during usability testing.
- **SC-002**: 95% of valid uploaded exam PDFs transition from `pending` to terminal status (`processed` or `failed`) within 10 minutes in staging.
- **SC-003**: For processed documents, 100% of records include persisted OpenAI response UUID and raw extraction JSON.
- **SC-004**: At least 90% of documents classified as `exam` produce non-empty `exam_items` output in staging test dataset.
- **SC-005**: 100% of main app screens use centralized theme/component primitives without screen-level duplicated style tokens.
