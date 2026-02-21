# Quickstart: Dra Lia Prototype

## 1) Preconditions
- Node.js and npm installed for mobile app.
- Python 3.11+ installed for API.
- Firebase project configured for mobile auth.
- AWS S3 bucket configured for PDF storage.
- OpenAI API key configured for Responses API.

## 2) Workspace setup
- Create `app/` React Native Expo project.
- Create `api/` FastAPI project.
- Configure environment variables in each package.

## 3) Run mobile prototype (frontend-first)
- Start Expo app in `app/`.
- Implement onboarding, login/signup, drawer, Home, Exams, Settings screens.
- Use centralized `theme` and shared primitives.
- Use mocked API responses matching OpenAPI contracts until backend endpoints are live.

## 4) Run backend API
- Start FastAPI in `api/`.
- Apply migrations for `users`, `documents`, `responses`, `exam_items`.
- Expose BFF endpoints for auth identity, upload, document list/detail, and exam summaries.

## 5) Run worker
- Start worker process in `api/`.
- Worker loop fetches `pending` documents, executes discovery/extraction, and updates statuses.
- Persist failures and retries in `documents`.

## 6) Verify end-to-end flow
- Sign in via Firebase on mobile.
- Upload an exam PDF.
- Confirm status transitions `pending -> processing -> processed`.
- Confirm `responses` records with OpenAI response UUIDs.
- Confirm `exam_items` populated and visible in Home/Exams UI.
