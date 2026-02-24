# Feature Specification: Home Screen and Exam Detail

**Feature Branch**: `003-home-exams-dashboard`  
**Created**: 2026-02-23  
**Status**: Draft  
**Input**: Home screen refinement and Exam Detail: simplified summary, list with above/below/within indicators, ExamDetail with evolution chart and readings list and laboratory; contextual blog cards (future).

## Specification Sources

This specification is derived from and must stay aligned with:

| Document | Purpose |
|----------|---------|
| `docs/mvp.md` | Product scope, FR-015–FR-017 (Home dashboard, relevant exams), NFRs |
| `docs/architecture.md` | Document/exam extraction, laboratory at root level, exam_items structure |
| `docs/design.md` | UX principles, tokens, Phosphor Icons, consistency, loading/empty/error states |

Implementation MUST follow SpecKit workflow: specify → clarify (when needed) → plan → tasks → implement.

## Clarifications

### Session 2026-02-23

- **Aggregation on Home**: "One row per exam type" means one list entry per distinct exam (by code or name); readings from multiple documents are aggregated so the user sees one tap target per exam (e.g. "Glucose", "Creatinine"). Tapping opens Exam Detail for that exam with all readings across documents.
- **Above/below/within**: Determined by comparing the latest reading's numeric value (when parseable) to the reference range. MVP supports parsing: min–max (e.g. "70-100"), "< X" (upper bound only), "> X" (lower bound only). If reference is missing or not parseable, show neutral or "no reference".
- **Education cards**: In MVP, cards can be static text or mock content keyed by exam code/name; structure (title + body, optional link) is defined so a future blog/API can replace content without UI change.
- **Q: How to identify and group exams when extraction returns code = null?** → A: Use **name** as fallback when code is null for grouping and for Exam Detail route param. Single stable key: code when present, otherwise name (code ?? name).
- **Q: Reference range parsing strategy for MVP?** → A: Parse **min–max** (e.g. "70-100"), **< X** (upper bound only), and **> X** (lower bound only). Any other format → no reference; show neutral indicator.
- **Q: In MVP, how do users mark an exam as "follow-up" (FR-017)?** → A: **Deferred.** Home list considers only out-of-range exams (FR-016) for MVP; "follow-up" marking is post-MVP. Spec documents the intent (FR-017) for future implementation.
- **Q: Sort order for "latest" reading per exam (Home indicator)?** → A: By **result date**, most recent first (date descending).
- **Q: Where do education cards appear on Exam Detail?** → A: **Below** the readings list (chart → list → education cards).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Home List with Clear Status Indicators (Priority: P1)

As a user, I can open the Home screen and see a simplified summary plus a list of exams that need attention. Each list item shows whether the latest reading is above the reference limit, below the reference limit, or within the reference range, so I can quickly see what needs follow-up.

**Why this priority**: Core value of the Home dashboard; reduces cognitive load and avoids a heavy top chart.

**Independent Test**: Open app, go to Home; verify summary is simple (e.g. count or short label); verify list shows exams with out-of-range or follow-up relevance; each row shows an indicator (above / below / within) for the last reading. No chart at top or a minimal placeholder.

**Acceptance Scenarios**:

1. **Given** the user is on the Home tab, **When** there are processed documents with out-of-range items, **Then** a list of relevant exams is shown with one row per exam type (or per document, as per design).
2. **Given** a list row, **When** the last reading is above the reference upper bound, **Then** the row shows an indicator meaning "above limit" (e.g. icon/label and color per design tokens: e.g. danger/warning).
3. **Given** a list row, **When** the last reading is below the reference lower bound, **Then** the row shows an indicator meaning "below limit" (distinct from above; color/icon per design).
4. **Given** a list row, **When** the last reading is within the reference range, **Then** the row shows an indicator meaning "within reference" (e.g. success/neutral).
5. **Given** the summary section at the top, **When** the user views it, **Then** it is simplified (no full evolution chart, or a minimal placeholder); primary focus is the list below.
6. **Given** there are no exams needing attention, **When** the user opens Home, **Then** a clear empty state message is shown (e.g. "No exams need attention. Upload PDFs and check back after processing.").

---

### User Story 2 - Navigate to Exam Detail (Priority: P1)

As a user, I can tap an exam in the Home list and open an Exam Detail screen that shows all readings for that exam (across all imported documents), with laboratory identified per reading when available.

**Why this priority**: Required to make the list actionable and to support the next story (chart and blog cards).

**Independent Test**: From Home, tap an exam row; verify Exam Detail screen opens; verify readings are listed (transversal across documents); verify laboratory is shown per reading when the data provides it.

**Acceptance Scenarios**:

1. **Given** the user is on the Home screen with at least one exam in the list, **When** the user taps that exam row, **Then** the app navigates to the Exam Detail screen for that exam (identified by stable key: code when present, otherwise name).
2. **Given** the user is on the Exam Detail screen, **When** the screen loads, **Then** all readings for that exam type from all processed documents are shown in a list (e.g. sorted by date).
3. **Given** a reading in the list, **When** the source document has laboratory information (from extraction JSON), **Then** the reading row or card displays the laboratory name so the user can distinguish results from different labs.
4. **Given** a reading has no laboratory in the data, **When** displayed, **Then** the UI shows a neutral placeholder (e.g. "—" or "Unknown lab") so the layout remains consistent.

---

### User Story 3 - Exam Detail: Evolution Chart and Readings List (Priority: P2)

As a user, when I am on the Exam Detail screen and there are at least two readings over time, I see an evolution chart at the top and below it the full list of readings (date, value, unit, reference range, laboratory). So I can track trend and compare results across labs and dates.

**Why this priority**: High value for understanding trends without overloading the Home screen.

**Independent Test**: Open Exam Detail for an exam that has 2+ readings (from one or more documents); verify a line chart appears at the top (time vs value); verify the list below shows all readings with date, value, unit, reference, laboratory.

**Acceptance Scenarios**:

1. **Given** the Exam Detail screen is open for an exam with two or more readings, **When** the data is loaded, **Then** an evolution chart is displayed at the top (e.g. line chart: time on X, value on Y), using the app design tokens.
2. **Given** the Exam Detail screen is open for an exam with only one reading, **When** the data is loaded, **Then** no chart is shown at the top (or a minimal empty-state message), and the single reading is shown in the list.
3. **Given** the chart is shown, **When** the user views it, **Then** axes and labels are clear (e.g. date range, value with unit); data points correspond to the readings in the list.
4. **Given** the readings list below the chart, **When** the user scrolls, **Then** each reading shows at least: date, result value, unit, reference range, and laboratory (or placeholder).

---

### User Story 4 - Exam Detail: Contextual Education Cards (Priority: P3)

As a user, on the Exam Detail screen I see one or more short cards that explain what the exam is and why it matters. These cards are contextual to the exam and will later be supplied from a blog written by associated doctors.

**Why this priority**: Improves trust and education; can be implemented with static or mock content first.

**Independent Test**: Open Exam Detail for any exam; verify at least one "education" or "about this exam" card is visible (content can be static/mock); structure supports future replacement with blog-driven content.

**Acceptance Scenarios**:

1. **Given** the user is on the Exam Detail screen, **When** the screen is rendered, **Then** a section with contextual cards about the exam is visible below the readings list (e.g. "What is [exam name]?", "Why it matters"). Order: chart (if 2+ readings) → readings list → education cards.
2. **Given** the cards section, **When** content is not yet provided by a backend/blog, **Then** the app MAY show static or mock content per exam type so the layout and UX are in place.
3. **Given** the feature is extended later, **When** blog/content API is available, **Then** the same card component/slot can display content from the blog (associated doctors) without changing the overall Exam Detail layout.

---

### Edge Cases

- **No reference range**: If a reading has no reference range in the data, or the reference range is not parseable (see Clarifications: only min–max, "< X", "> X" are supported in MVP), the "above/below/within" indicator MUST NOT be shown for that reading (or show a neutral "no reference" state); list and detail still show the value and unit.
- **Same exam in multiple documents**: Home list MUST aggregate by exam type (e.g. by code/name) so the user sees one row per exam; Exam Detail MUST show all readings from all documents for that exam.
- **Laboratory missing**: Architecture allows `laboratory` at document root; if extraction does not provide it, show placeholder and do not break layout.
- **Chart with single point**: Do not render a line chart; show list only or empty-state message for chart area.
- **Loading and errors**: Home and Exam Detail MUST show loading state while fetching; on error, show a consistent error state (per design.md) and allow retry or navigation back.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Home screen MUST display a simplified summary section at the top (no full evolution chart, or minimal placeholder only).
- **FR-002**: The Home screen MUST display a list of exams that need attention. For MVP, "need attention" = out-of-range only (FR-016); user-marked follow-up (FR-017) is deferred to post-MVP.
- **FR-003**: Each Home list row MUST show an indicator for the latest reading: above reference limit, below reference limit, or within reference range, using design tokens (e.g. danger, warning, success). "Latest" = reading with most recent result date (date descending). Parsing of reference range in MVP: support min–max (e.g. "70-100"), "< X" (upper bound only), and "> X" (lower bound only); any other format → neutral "no reference".
- **FR-004**: Tapping a Home list row MUST navigate to the Exam Detail screen for that exam (identified by stable key: code when present, otherwise name).
- **FR-005**: The Exam Detail screen MUST list all readings for that exam type across all processed documents (e.g. sorted by date). Education cards section MUST appear below the readings list (order: chart → readings list → education cards).
- **FR-006**: Each reading in Exam Detail MUST display laboratory when available in the extraction data; otherwise a neutral placeholder.
- **FR-007**: When an exam has two or more readings, the Exam Detail screen MUST show an evolution chart at the top (time vs value), using the app design system.
- **FR-008**: When an exam has fewer than two readings, the Exam Detail screen MUST NOT show the evolution chart (or show an empty-state message for the chart area).
- **FR-009**: The Exam Detail screen MUST include a section for contextual education cards about the exam, placed below the readings list; content MAY be static/mock until blog or content API is available.
- **FR-010**: Home and Exam Detail MUST use centralized theme tokens (docs/design.md) and existing shared components where applicable.
- **FR-011**: Home and Exam Detail MUST handle loading and empty states consistently (docs/design.md).

### Key Entities

- **Exam (type)**: Logical exam identified by code when present, otherwise by name (single stable key: code ?? name). May have multiple readings across documents. Used for Home list aggregation and Exam Detail.
- **Reading**: A single result for an exam from one document: date, resultValue, unit, referenceRange, outOfRange, laboratory (from document or extraction). Displayed in Exam Detail list and as points in the evolution chart.
- **Document**: Uploaded PDF; has laboratory at root level (architecture); contains exam_items; used to source readings and laboratory for each reading.
- **Education card**: Contextual content block for Exam Detail (title + body); today static/mock; future from blog/API.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: User can open Home and immediately see how many exams need attention and their status (above/below/within) without scrolling a large chart.
- **SC-002**: User can tap one exam and reach Exam Detail with all readings and laboratory visible; navigation is one tap from Home.
- **SC-003**: When 2+ readings exist, user sees an evolution chart and a chronological list on Exam Detail in one screen.
- **SC-004**: User sees consistent loading and empty states on Home and Exam Detail (no blank or broken screens).
- **SC-005**: Education cards section is present on Exam Detail and ready for future content integration without layout change.
