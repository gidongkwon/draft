# Fluent Iconify Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply Fluent UI icons across the app with a shared Iconify-backed wrapper and preserve the existing visual system.

**Architecture:** Introduce a single `AppIcon` wrapper that owns icon mapping, sizing, and accessibility defaults. Then thread it through the top bar, shell, auth modal, compose strip, and post/profile presentation components without changing existing behavior.

**Tech Stack:** SolidJS, TanStack Start, Vite+, Iconify, Fluent UI System Icons, Vitest via `vp test`

---

## Chunk 1: Icon Foundation

### Task 1: Add the shared icon wrapper

**Files:**

- Create: `src/shared/ui/app-icon.tsx`
- Modify: `package.json`
- Test: `src/app/ui/top-command-bar.test.tsx`

- [ ] Write a failing test that expects the signed-out top bar actions to render icon markers alongside labels.
- [ ] Run `vp test src/app/ui/top-command-bar.test.tsx` and verify it fails for the missing icons.
- [ ] Add Iconify dependencies and implement `AppIcon`.
- [ ] Re-run the same test and verify it passes.

## Chunk 2: Shell And Auth

### Task 2: Apply icons to shared chrome

**Files:**

- Modify: `src/app/ui/top-command-bar.tsx`
- Modify: `src/app/ui/app-shell.tsx`
- Modify: `src/features/auth/ui/auth-modal.tsx`
- Test: `src/app/ui/app-shell.test.tsx`
- Test: `src/features/auth/ui/auth-modal.test.tsx`

- [ ] Write failing assertions for icon markers in shell and auth modal actions.
- [ ] Run the focused tests and verify they fail.
- [ ] Apply icons to the top bar, sidebar, and auth modal.
- [ ] Re-run the focused tests and verify they pass.

## Chunk 3: Content Surfaces

### Task 3: Apply icons to content and metadata

**Files:**

- Modify: `src/pages/home-feed/ui/compose-strip.tsx`
- Modify: `src/entities/post/ui/post-preview-card.tsx`
- Modify: `src/entities/post/ui/post-detail-view.tsx`
- Modify: `src/entities/profile/ui/profile-summary-card.tsx`

- [ ] Add failing tests where coverage already exists for affected surfaces, and add focused tests if a key iconized surface has no coverage.
- [ ] Run the focused tests and verify they fail.
- [ ] Add icons to compose, post metadata, engagement stats, and profile metadata.
- [ ] Re-run tests and verify they pass.

## Chunk 4: Final Verification

### Task 4: Validate the app

**Files:**

- Modify: `src/*` as needed from previous tasks only

- [ ] Run `vp check`.
- [ ] Run `vp test`.
- [ ] Run `vp build`.
- [ ] Run a browser check for top bar and auth modal icon rendering.
