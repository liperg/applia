# Dra Lia UX and Design Guidelines

## Purpose

This document defines the UX foundations for the mobile app, including visual language, color palette, icon usage, component composition, and consistency rules.

## UX Principles

- Keep every screen minimal, clean, and focused on one primary action.
- Prioritize readability and hierarchy over decorative elements.
- Reduce cognitive load with clear labels, short copy, and predictable navigation.
- Use progressive disclosure: show details only when needed.
- Maintain consistent interaction patterns across all flows.

## Visual Style

- Style direction: minimal, clean, modern medical-product feel.
- Use generous spacing and clear section separation.
- Prefer simple surfaces and low visual noise.
- Use typography and spacing to create hierarchy instead of heavy effects.

## Color Palette

Use a centralized token-based palette only.

- `primary`: `#2563EB` (main actions, links, active states)
- `primarySoft`: `#DBEAFE` (selected backgrounds, soft highlights)
- `success`: `#16A34A` (positive/normal status)
- `warning`: `#F59E0B` (attention required)
- `danger`: `#DC2626` (errors, destructive actions)
- `background`: `#F8FAFC` (app background)
- `surface`: `#FFFFFF` (cards, sheets, inputs)
- `textPrimary`: `#0F172A` (main text)
- `textSecondary`: `#475569` (supporting text)
- `border`: `#E2E8F0` (dividers and field borders)

## Typography and Spacing

- Use a small, consistent type scale (Title, Subtitle, Body, Caption).
- Keep line length short for key medical values.
- Use a spacing scale (for example: 4, 8, 12, 16, 24, 32).
- Avoid one-off paddings/margins; always use shared spacing tokens.

## Iconography

- Use Phosphor Icons consistently across navigation and actions.
- Prefer outlined icon style for default states.
- Use filled variants only for active or emphasized states when needed.
- Keep icon sizes standardized (for example: 20 for inline, 24 for navigation).

## Craft React Native Usage

- Craft React Native templates are a baseline only; adapt to the app design tokens.
- Do not copy visual styles directly if they conflict with this document.
- Extract reusable patterns from templates into shared app components.
- Normalize spacing, colors, and typography to centralized tokens before shipping.

## Consistency and Centralization Rules

- All colors, typography, spacing, radii, and shadows must be defined in centralized theme tokens.
- Shared UI primitives (Button, Input, Card, Badge, List Item, Screen Container) must be reusable and defined once.
- No duplicated style objects for the same visual pattern across screens.
- Avoid hardcoded visual values in feature screens.
- Common states (loading, empty, error, success) must use the same UI patterns throughout the app.

## Interaction and Feedback

- Buttons must have clear pressed, disabled, and loading states.
- Form fields must show validation messages in a consistent style.
- Long operations (upload/processing) must always show explicit status feedback.
- Critical actions (logout, destructive operations) must include clear confirmation.

## Accessibility Baseline

- Maintain sufficient contrast for text and status indicators.
- Ensure touch targets are comfortable for mobile interaction.
- Support dynamic text scaling where possible.
- Provide meaningful labels for icons used as actionable controls.

## Implementation Guidance

- Keep design decisions in a single source of truth (theme + shared components).
- Add new visual patterns only after checking existing primitives.
- If a new style is required, create a reusable token/component first, then apply it.
- Review every new screen for alignment with these rules before merge.
