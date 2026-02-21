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

### Unistyles and craftrn-ui

The project **may use** [react-native-unistyles](https://reactnativeunistyles.vercel.app/) and [craftrn-ui](https://docs.craftreactnative.com) components without restriction.

- **Unistyles:** Use for theme-driven styles (e.g. `StyleSheet.create(theme => ({ ... }))`) where templates or screens rely on it. Prefer aligning the Unistyles theme (colors, spacing, typography) with this document’s tokens so the app stays visually consistent.
- **craftrn-ui:** Use Craft components (e.g. Card, ListItem, Switch, Button, Avatar, BottomSheet, Text) when building from or adapting CraftReactNative templates. Map craftrn-ui theme tokens to this document’s palette and spacing where possible so new screens don’t diverge from the rest of the app.
- **Coexistence:** Existing app screens may keep using the current theme (`app/src/theme`) and shared components (`app/src/components`). New or refactored screens may adopt Unistyles + craftrn-ui; both approaches are valid. When introducing Unistyles/craftrn-ui, document the choice in the feature or in this file if it becomes the default for new work.

### Copying and setting up CraftReactNative templates

To add [CraftReactNative](https://docs.craftreactnative.com) templates into this project, follow the official [Templates setup guide](https://docs.craftreactnative.com/docs/guides/templates-setup).

**Prerequisites (minimum versions):**

- Expo Router 5+ (or React Navigation; templates work with any navigation)
- React 19+
- React Native 0.79+
- Node.js 22+
- TypeScript 5.3+

**1. Copy the template files**

- Go to the [craftrn-templates repository](https://github.com/craftreactnative/templates/tree/main/demo-app/craftrn-templates).
- Download the templates you want.
- At the **root of this project** (e.g. `d:\dev\applia`), create a folder `craftrn-templates`.
- Copy the downloaded template folders into `craftrn-templates`.

**2. Set up routes/screens**

- **If using Expo Router:** from the [demo app folder](https://github.com/craftreactnative/templates/tree/main/demo-app/app), copy the folder for the chosen template into this project’s `app` folder so routes match.
- **If using React Navigation (this app):** import each screen from `craftrn-templates/<template-name>` and wire them into your navigator (e.g. add new stack/drawer screens that render those components). No need to copy into `app`; use the templates as screen components.

**3. Project configuration (when not using Expo defaults)**

- **TypeScript:** if you use path aliases for `@/craftrn-ui`, add to `tsconfig.json` under `compilerOptions`: `"baseUrl": "./app"` and `"paths": { "@/craftrn-ui/*": ["./craftrn-ui/*"] }`.
- **Babel:** for path aliases and Reanimated, the [docs](https://docs.craftreactnative.com/docs/guides/templates-setup) describe `babel-plugin-root-import` and `react-native-reanimated/plugin`. With Expo, path resolution is usually already handled.

**Target structure (conceptual):**

```
app/                    # App screens and navigation (React Navigation / Expo)
  src/
  ...
craftrn-templates/      # Copied CraftReactNative template folders
  discussions/
  settings/
  ...
craftrn-ui/            # If you use Craft UI components (optional)
  components/
  themes/
package.json
```

After copying templates, continue to follow the **Craft React Native Usage** rules above: adapt visuals to this document’s tokens and centralize any new patterns in shared components.

### AI-assisted template customization

Each CraftReactNative template includes an **AI customization guide** so assistants (e.g. Cursor, Copilot, Claude) can understand the template and give better suggestions. See the official [AI assistant guide](https://docs.craftreactnative.com/docs/guides/templates-ai-assistance).

**What’s in each template folder:**

- **`instructions.md`** – Purpose, architecture, component structure, design system usage, patterns (animations, state, data flow), customization guidelines, API integration examples, performance notes. Share this file with the AI when customizing or extending the template.
- **`info.json`** – Dependency and metadata for the template. Use together with `instructions.md` for full context.

**How to use with AI:**

1. **Provide context:** When editing a template, reference the template’s `instructions.md`, e.g. `craftrn-templates/AiConversation/instructions.md`. Paste or point the assistant to its content so it follows the template’s patterns.
2. **Refer to architecture:** The instructions describe component hierarchy, data flow, and conventions; use that to keep new code consistent.

**Example prompts:**

- *Customization:* “I want to add a dark mode toggle to the EditorialFeed template. Here’s the instructions.md: [content]. How do I implement it following the existing patterns?”
- *New feature:* “From this AI Conversation template’s instructions.md: [content], add image attachments in messages while keeping the current animation patterns.”
- *Performance:* “Using this Messaging Inbox instructions.md: [content], optimize the list for 10,000+ conversations.”

Using these instruction files leads to more consistent code, fewer mismatches with the template, and better alignment with craftrn-ui and this project’s design tokens.

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
