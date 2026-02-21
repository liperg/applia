# Research: Dra Lia Prototype

## Decisions

### 1) Frontend-first delivery with contract-ready backend
- **Decision**: Build app flows first with mocked BFF-compatible payloads, then connect to live API.
- **Rationale**: Matches MVP requirement for frontend-first iteration and accelerates UX validation.
- **Trade-off**: Requires strict payload compatibility checks to avoid rework.

### 2) Async worker processing for PDFs
- **Decision**: Persist uploaded documents as `pending`, process via worker polling/queue loop, and write deterministic status transitions.
- **Rationale**: OpenAI extraction is slow and variable; async processing avoids blocking mobile requests.
- **Trade-off**: Requires robust retry and failure bookkeeping.

### 3) Two-step LLM extraction (discovery + extraction)
- **Decision**: First call classifies `exam|other` and lists exams in JSON; second call extracts all detected exams in JSON.
- **Rationale**: Reduces truncation risk and increases exam coverage.
- **Trade-off**: Additional API cost and latency per document.

### 4) Centralized design tokens and primitives
- **Decision**: Keep colors/spacing/typography/icon sizes in one theme source and expose reusable primitives.
- **Rationale**: Ensures visual consistency and prevents style duplication across screens.
- **Trade-off**: Slight setup overhead before feature screens.

### 5) Minimal infra for MVP
- **Decision**: SQLite + Alembic for MVP; S3 for file storage; production path keeps PostgreSQL target.
- **Rationale**: Low setup complexity while preserving migration path.
- **Trade-off**: Concurrency behavior must be validated when moving to PostgreSQL.

## Open Questions

- Should `document_type=other` map to status `failed` with `error_code=document_not_exam`, or a dedicated `ignored` status?
- Should duplicate SHA-256 documents always reprocess or require explicit user action?
- Should worker orchestration use polling first and queue broker later, or broker from day one?
