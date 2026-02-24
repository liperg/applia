# Tasks: Home Screen and Exam Detail

**Input**: Design documents from `specs/003-home-exams-dashboard/`  
**Prerequisites**: plan.md, spec.md

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story (US1, US2, US3, US4)

## Path Conventions

- **App**: `app/src/screens/`, `app/src/navigation/`, `app/src/api/`

---

## Phase 1: Home Simplification and Indicators (User Story 1 – P1)

**Goal**: Simplified Home summary and list with above/below/within indicators for the latest reading per exam.

**Independent Test**: Open Home; see simple summary and list; each row shows correct indicator (above/below/within); no full chart at top.

- [ ] T001 [US1] Simplify Home summary section in `app/src/screens/HomeScreen.tsx`: remove or replace full evolution chart with a minimal summary (e.g. count + short label only), per spec FR-001.
- [ ] T002 [US1] Add helper in `app/src/screens/home/types.ts` (or utils): parse reference range string to derive min/max — support min–max (e.g. "70-100"), "< X" (upper bound only), and "> X" (lower bound only) per spec; compare numeric result value to derive "above" | "below" | "within"; handle missing or unparseable reference (neutral).
- [ ] T003 [US1] Update `ExamHighlightItem` (or equivalent) in `app/src/screens/home/types.ts` to include a status field: `aboveLimit` | `belowLimit` | `withinReference` (or equivalent) for the latest reading.
- [ ] T004 [US1] Aggregate Home data by exam type (code/name) in `app/src/screens/HomeScreen.tsx`: one row per exam; for MVP include only out-of-range exams (FR-016; follow-up FR-017 deferred); "latest" reading per exam = sort by result date descending; build list from getDocuments + getDocument details.
- [ ] T005 [US1] Update `app/src/screens/home/ExamHighlightRow.tsx` to display the above/below/within indicator (icon + color per design tokens: danger/warning for above, distinct for below, success/neutral for within).
- [ ] T006 [US1] Ensure empty state and loading state on Home per docs/design.md (FR-011).

**Checkpoint**: Home shows simplified summary and list with correct indicators; no heavy chart at top.

---

## Phase 2: Exam Detail Screen and Navigation (User Story 2 – P1)

**Goal**: Tapping an exam on Home opens Exam Detail; screen lists all readings for that exam across documents and shows laboratory per reading when available.

**Independent Test**: Tap exam on Home → Exam Detail opens; list shows all readings; laboratory visible or placeholder.

- [ ] T007 [US2] Add `ExamDetailScreen` in `app/src/screens/ExamDetailScreen.tsx`: accept exam identifier (code/name) via route params; fetch all documents and collect readings for that exam; sort by date.
- [ ] T008 [US2] In Exam Detail, display readings list: each row shows date, result value, unit, reference range, and laboratory (from document root or extraction); use placeholder when laboratory missing (FR-006).
- [ ] T009 [US2] Wire navigation: from Home list row, navigate to Exam Detail with exam code/name (e.g. React Navigation stack or param); ensure back returns to Home (FR-004).
- [ ] T010 [US2] Add route/screen for Exam Detail in `app/App.tsx` (or navigator that contains Home): e.g. new stack screen or modal; pass exam id/code/name.

**Checkpoint**: User can tap an exam on Home and see Exam Detail with all readings and laboratory.

---

## Phase 3: Exam Detail Evolution Chart (User Story 3 – P2)

**Goal**: When an exam has 2+ readings, show an evolution chart at the top of Exam Detail; list remains below.

**Independent Test**: Open Exam Detail for exam with 2+ readings; chart visible at top; list below with all readings.

- [ ] T011 [US3] In `ExamDetailScreen.tsx`, when readings length ≥ 2, build chart data (time vs value) from readings; reuse `LineChart` and `chartUtils` from `app/src/screens/home/` (or move to shared place).
- [ ] T012 [US3] Render evolution chart at top of Exam Detail only when readings.length ≥ 2; otherwise omit chart or show empty-state message (FR-007, FR-008).
- [ ] T013 [US3] Ensure chart uses app design tokens (colors, spacing) and is readable (axes/labels with date and value+unit).

**Checkpoint**: Exam Detail shows chart when 2+ readings; list below with date, value, unit, reference, laboratory.

---

## Phase 4: Education Cards on Exam Detail (User Story 4 – P3)

**Goal**: Exam Detail includes a section with contextual cards explaining the exam; content static/mock in MVP, structure ready for future blog.

**Independent Test**: Open Exam Detail; see at least one education card (e.g. "What is [exam]?"); layout supports future content swap.

- [ ] T014 [US4] Add education cards section to `ExamDetailScreen.tsx` below the readings list (order: chart → list → cards): component or inline block with title + body; keyed by exam code/name (FR-009).
- [ ] T015 [US4] Provide static or mock content for at least one exam type (e.g. Glucose or Creatinine) so the section is visible; other exams can show generic placeholder or "Content coming soon."
- [ ] T016 [US4] Document or type the card structure (title, body, optional link) so a future blog/API can replace content without changing layout.

**Checkpoint**: Exam Detail shows education cards section; MVP content in place; structure ready for blog.

---

## Phase 5: Polish and Consistency

**Purpose**: Cross-cutting checks and cleanup.

- [ ] T017 Remove or refactor unused Home chart code (SummaryCard/LineChart) if fully replaced by simplified summary; keep chart components for Exam Detail reuse.
- [ ] T018 Ensure loading and error states on Exam Detail per docs/design.md.
- [ ] T019 Run through all acceptance scenarios in spec (US1–US4) and edge cases (no reference, single reading, missing laboratory).

---

## Dependencies & Execution Order

- **Phase 1 (US1)**: Can start immediately; no dependency on new screen.
- **Phase 2 (US2)**: Depends on T004 (aggregation) so that "exam" tap target exists; can start after or in parallel with Phase 1 completion.
- **Phase 3 (US3)**: Depends on Exam Detail screen (T007–T010); implement after Phase 2.
- **Phase 4 (US4)**: Depends on Exam Detail screen; can be after Phase 2 or in parallel with Phase 3.
- **Phase 5**: After Phases 1–4.

## Implementation Strategy

1. Complete Phase 1 → validate Home simplified and indicators work.
2. Complete Phase 2 → validate navigation and Exam Detail list with laboratory.
3. Complete Phase 3 → add chart when 2+ readings.
4. Complete Phase 4 → add education cards.
5. Complete Phase 5 → cleanup and full spec check.
