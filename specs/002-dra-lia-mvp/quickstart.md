# Quickstart: Dra Lia MVP

## 1) Preconditions

- Node.js and npm for mobile app (`app/`).
- Python 3.11+ for API and worker (`api/`).
- Firebase project configured (Google sign-in).
- AWS S3 bucket for PDF storage.
- OpenAI API key for Responses API (discovery + extraction).

## 2) Workspace setup

- Ensure monorepo layout: `app/` (React Native Expo), `api/` (FastAPI).
- Configure `.env` in `api/` (DB, S3, OpenAI, Firebase admin if needed).
- Configure environment in `app/` for API base URL and Firebase.

## 3) Run mobile app (frontend-first)

- From repo root: start Expo app in `app/`.
- Implement: onboarding, Login, Signup, drawer (profile, Settings, Logout), Home, Exams, Settings.
- Use centralized theme and shared primitives per docs/design.md; Phosphor Icons.
- Use a single TypeScript module for API access; consume OpenAPI-generated client when backend is ready; until then use mocked responses matching `specs/002-dra-lia-mvp/contracts/openapi.yaml`.

## 4) Run backend API

- From repo root: start FastAPI in `api/`.
- Apply Alembic migrations (users, documents, responses, exam_items).
- Expose BFF endpoints: `GET /v1/me`, `POST /v1/documents`, `GET /v1/documents`, `GET /v1/documents/{id}`.
- Validate Firebase ID token on all protected routes; create/link user by `firebase_uid`.

## 5) Run worker

- Run worker process in `api/` (same codebase).
- Loop: fetch `pending` documents, set `processing`, run discovery then extraction (only if `document_type=exam`), persist raw JSON and exam_items, set `processed` or `failed` with error metadata and retries.

## 6) Verify end-to-end

- Sign in with Google on mobile.
- Upload a lab exam PDF; confirm document appears with status `pending` then `processing` then `processed`.
- Confirm Exams screen shows total items and out-of-range count; Home shows relevant exams when data exists.
- Confirm duplicate upload (same file again): new document created, status `pending`, worker reprocesses (AR-006).
