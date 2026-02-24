# Implementation Plan: Home Screen and Exam Detail

**Branch**: `003-home-exams-dashboard` | **Date**: 2026-02-23 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `specs/003-home-exams-dashboard/spec.md`

## Summary

Refine the Home screen by simplifying the top section (remove or minimize the evolution chart), add clear status indicators on each exam row (above limit / below limit / within reference), and introduce an Exam Detail screen. Exam Detail shows all readings for that exam across documents, with laboratory per reading when available; when there are 2+ readings, show an evolution chart at the top; include a section for contextual education cards (static/mock in MVP, blog-ready later). All UI follows docs/design.md tokens and existing app structure; data comes from existing getDocuments/getDocument API and aggregation in the app.

## Technical Context

**Language/Version**: TypeScript (app); existing React Native + Expo  
**Primary Dependencies**: React Navigation, react-native-svg (existing), Phosphor Icons, app theme and components  
**Storage**: No new persistence; uses existing BFF/document/exam_items data  
**Testing**: Manual / existing app test flow; optional Jest for new screens  
**Target Platform**: Android and iOS (Expo)  
**Project Type**: Mobile (app only for this feature)  
**Performance Goals**: Home list and Exam Detail load in &lt;1s with mocked or real API  
**Constraints**: Single API client module; design tokens only; no new backend endpoints for MVP  
**Scale/Scope**: One new screen (Exam Detail); Home refactor; aggregation and chart in app

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. English-Only Engineering Artifacts | PASS | Spec and code in English |
| II. SpecKit-First Delivery | PASS | specify → plan → tasks → implement |
| III. Simplicity Over Cleverness | PASS | Reuse existing chart utils and components; no extra layers |
| IV. MVP Velocity | PASS | Mock/static education cards; chart only when 2+ readings |
| V. Clean Code and No Dead Artifacts | PASS | Remove or simplify unused Home chart; centralize indicator logic |
| Monorepo Boundaries | PASS | Changes scoped to `app` |
| Delivery Workflow | PASS | Plan and tasks before implementation |

## Project Structure

### Documentation (this feature)

```text
specs/003-home-exams-dashboard/
├── spec.md
├── plan.md              # This file
└── tasks.md             # From /speckit.tasks
```

### Source Code (app only)

```text
app/
├── src/
│   ├── screens/
│   │   ├── HomeScreen.tsx           # Refactor: simplified summary, list with indicators
│   │   ├── home/                    # Keep or simplify: SummaryCard, LineChart, types, chartUtils
│   │   │   ├── types.ts             # ExamHighlightItem, above/below/within, aggregation types
│   │   │   ├── SummaryCard.tsx      # Simplify: remove chart or minimal placeholder
│   │   │   ├── ExamHighlightRow.tsx # Add indicator: above / below / within (design tokens)
│   │   │   ├── LineChart.tsx        # Optional: remove from Home or keep minimal
│   │   │   └── chartUtils.ts        # Keep if chart used in Exam Detail
│   │   └── ExamDetailScreen.tsx     # NEW: chart (2+ readings), readings list, laboratory, education cards
│   ├── navigation/                  # Wire Exam Detail into stack (e.g. from MainTabs or Home)
│   ├── api/
│   │   └── client.ts                # No change or optional: getExamReadings aggregation helper
│   ├── components/                  # Reuse ListItem, Card, Badge, etc.
│   └── theme/
```

**Structure Decision**: All work in `app`. Home remains under `screens/home/` with simplified summary and updated row component. New `ExamDetailScreen` can live next to other screens; navigation adds one stack screen or modal for Exam Detail. Chart logic reused in Exam Detail when 2+ readings.

## Data and API

- **Home**: Continue using `getDocuments()` then `getDocument(id)` for relevant docs; aggregate exam items by exam code/name to build one row per exam; compute "last reading" per exam and derive above/below/within from reference range.
- **Exam Detail**: Same data source; for selected exam, collect all readings from all processed documents that have that exam (code/name match); sort by date; pass `laboratory` from document root (architecture) into each reading row. No new API endpoint for MVP.
- **Education cards**: In-app static map (exam code → { title, body }) or placeholder component; no API until blog exists.

## Complexity Tracking

No constitution violations. Chart on Exam Detail is optional when &lt;2 readings; education cards are simple placeholders.
