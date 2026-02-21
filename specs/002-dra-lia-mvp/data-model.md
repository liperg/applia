# Data Model: Dra Lia MVP

## Entity: users

- `id` (uuid, pk)
- `firebase_uid` (string, unique, required)
- `email` (string, nullable)
- `display_name` (string, nullable)
- `avatar_url` (string, nullable)
- `created_at` (datetime, required)
- `updated_at` (datetime, required)

## Entity: documents

- `id` (uuid, pk)
- `user_id` (uuid, fk users.id, required)
- `s3_key` (string, required)
- `file_name` (string, required)
- `sha256` (string[64], required, indexed)
- `status` (enum: `pending` | `processing` | `processed` | `failed`, required)
- `processing_worker_id` (string, nullable)
- `processing_started_at` (datetime, nullable)
- `processing_finished_at` (datetime, nullable)
- `raw_json` (json, nullable)
- `error_code` (string, nullable)
- `error_message` (text, nullable)
- `retry_count` (int, default 0)
- `last_failed_at` (datetime, nullable)
- `created_at` (datetime, required)
- `updated_at` (datetime, required)

## Entity: responses

- `id` (uuid, pk)
- `document_id` (uuid, fk documents.id, required)
- `phase` (enum: `discovery` | `extraction`, required)
- `provider` (string, default `openai`)
- `response_uuid` (string, required)
- `request_payload` (json, nullable)
- `response_payload` (json, nullable)
- `created_at` (datetime, required)

## Entity: exam_items

- `id` (uuid, pk)
- `document_id` (uuid, fk documents.id, required)
- `code` (string, nullable)
- `name` (string, required)
- `date` (date, nullable)
- `result_value` (string, required)
- `unit` (string, nullable)
- `reference_range` (string, nullable)
- `out_of_range` (boolean, required)
- `notes` (text, nullable)
- `created_at` (datetime, required)

## Relationships

- `users` 1:N `documents`
- `documents` 1:N `responses`
- `documents` 1:N `exam_items`

## State Transitions: documents.status

- `pending` → `processing` (worker pickup)
- `processing` → `processed` (extraction success)
- `processing` → `pending` (retry scheduled)
- `processing` → `failed` (max retries or document_not_exam)

## Validation Rules

- Worker only picks `pending` documents.
- Duplicate SHA-256 for same user: new document created as `pending` (AR-006); no reject.
- `processing_worker_id` and `processing_started_at` required when status is `processing`.
- `processing_finished_at` required when status is `processed` or `failed`.
- Extraction only when discovery returns `document_type=exam`; otherwise status `failed`, `error_code=document_not_exam`, no retries.
