# Dra Lia Architecture

## Stack

### Backend

- **Language**: Python
- **Configuration**: Environment variables loaded from `.env`
- **API Framework**: FastAPI (REST)
- **API Documentation**: OpenAPI
- **LLM/PDF Processing**: OpenAI Responses API for LLM-based PDF extraction and processing
- **Database Migrations**: Alembic
- **Database Strategy**:
  - MVP: SQLite
  - Production: PostgreSQL

### Frontend

- **Mobile Framework**: React Native
- **Runtime/Tooling**: Expo + Expo Go
- **UI Template Source**: https://www.craftreactnative.com/ (copy-paste templates as baseline)

### Infrastructure

- **Backend Hosting**: Railway
- **Domain and CDN**: Cloudways
- **File Storage**: AWS S3 for uploaded PDF storage
- **Error Monitoring**:
  - Sentry
  - Crashlytics

### Development

- **Version Control / Collaboration**: GitHub
- **Cloud Development Environment**: GitHub Codespaces
- **AI Assistants**: GitHub Copilot / Cursor
- **Containerization**: Docker

## Architecture

### Authentication Specification

- Mobile authentication is handled by Firebase Authentication.
- The mobile app sends Firebase ID tokens in the `Authorization: Bearer <token>` header.
- The backend validates Firebase ID tokens on every protected endpoint.
- A local user record is linked by Firebase `uid` for domain data ownership.
- Authorization is resource-based: users can only access their own documents and exam items.

### PDF Import and Worker Processing Flow

1. The API receives a PDF upload request.
2. The backend stores the original PDF in AWS S3 and computes a SHA-256 hash.
3. The backend sends the document to the OpenAI Responses API.
4. The returned OpenAI response UUID is stored in the `responses` table for traceability.
5. The document is created in the `documents` table with status `pending`.
6. The worker with `id = X` fetches records marked as `pending`, sets status `processing`, sets `processing_started_at`, and sets `processing_worker_id = X`.
7. The worker runs extraction through the OpenAI Responses API and waits for completion.
8. On completion, the worker sets status `processed`, sets `processing_finished_at`, stores the raw JSON payload in `documents.raw_json`, and populates `exam_items` with extracted values.

### Document Status Lifecycle

- `pending`: document uploaded and waiting for worker pickup.
- `processing`: document currently being processed by a worker.
- `processed`: extraction completed successfully.
- `failed`: extraction failed after retries.

### Important Rules

- The SHA-256 hash of every uploaded PDF is stored to detect previously processed files.
- If a previously processed document is uploaded again, the system can create a new processing cycle by marking the document as `pending` so workers can process it again.
- The extraction strategy must account for LLM output shortening/truncation risk.
- Extraction should use a two-step flow when needed:
  1. Discovery call: ask the model to list all exams detected in the document, returning JSON.
  2. Extraction call: ask the model to extract every exam found in step 1, returning complete structured output.
- Only documents classified as `exam` in discovery should continue to extraction and worker processing.
- The worker should validate that all discovered exams were extracted and retry/fallback if coverage is incomplete.
- The extraction JSON must contain:
  - Individual exam results
  - `out_of_range` analysis whenever possible
  - Laboratory name at the root level when available

### JSON Contracts

#### Discovery JSON Contract

```json
{
  "schema_version": "1.0",
  "document_type": "exam|other",
  "laboratory": "string|null",
  "exams": [
    {
      "code": "string|null",
      "name": "string",
      "sample_type": "string|null"
    }
  ]
}
```

#### Extraction JSON Contract

```json
{
  "schema_version": "1.0",
  "laboratory": "string|null",
  "exams": [
    {
      "code": "string|null",
      "name": "string",
      "date": "YYYY-MM-DD|null",
      "result_value": "string",
      "unit": "string|null",
      "reference_range": "string|null",
      "out_of_range": true,
      "notes": "string|null"
    }
  ]
}
```

### Processing Error Handling

- Worker errors must be persisted in `documents`.
- On each failure, the worker updates:
  - `status = failed` (or keeps `pending` when retry is scheduled)
  - `processing_finished_at`
  - `error_code`
  - `error_message`
  - `retry_count`
  - `last_failed_at`
- Retry policy should use bounded retries with backoff.
- If the maximum retry count is reached, the final status must be `failed`.
