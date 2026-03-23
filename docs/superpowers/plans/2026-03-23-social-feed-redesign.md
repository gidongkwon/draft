# Social Feed Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rework the Hackers' Pub client into a premium "Twitter for developers" product with a feed-first command surface, global search, a developer-native compose strip, and a unified reading experience.

**Architecture:** Keep the existing TanStack Router and Relay query flow intact, and confine the redesign to presentation components, layout structure, and durable UI tests. Introduce a command-bar-first shell, move the home route to a stacked command/feed structure, and align profile and post detail around the same dark system with pale-lager-gold accent states.

**Tech Stack:** SolidJS, TanStack Router, solid-relay, Tailwind CSS v4 via `src/styles.css`, Vite+ (`vp test`, `vp check`)

---

## File Structure

- Modify: `src/styles.css`
  - Replace the current blue glass-token system with the approved dark product tokens and reusable shell/feed utilities.
- Create: `src/app/ui/top-command-bar.tsx`
  - Render the persistent product command bar with brand, search, and primary action.
- Create: `src/app/ui/top-command-bar.test.tsx`
  - Lock down the brand link, search affordance, and primary action in isolation.
- Modify: `src/app/ui/app-shell.tsx`
  - Rebuild the shell around the command bar, a lightweight navigation rail, and responsive content structure.
- Modify: `src/app/ui/app-shell.test.tsx`
  - Assert the new shell contract instead of the old boxed layout assumptions.
- Create: `src/pages/home-feed/ui/compose-strip.tsx`
  - Render the developer-native writing entry point for the home route.
- Create: `src/pages/home-feed/ui/compose-strip.test.tsx`
  - Lock down the compose label, placeholder, and action affordances.
- Modify: `src/pages/home-feed/ui/home-feed-page.tsx`
  - Replace the hero-like header with the stacked command/feed layout and restrained context modules.
- Modify: `src/widgets/feed-list/ui/feed-list.tsx`
  - Convert the stream wrapper to the flatter row-based timeline surface.
- Modify: `src/widgets/feed-list/ui/feed-list.test.tsx`
  - Keep empty and populated feed assertions aligned with the new structure.
- Modify: `src/entities/post/ui/post-preview-card.tsx`
  - Redesign post previews into denser feed rows for fast scan/read behavior.
- Modify: `src/entities/post/ui/post-preview-card.test.tsx`
  - Preserve assertions for title, author, and engagement metadata under the new row design.
- Modify: `src/entities/profile/ui/profile-summary-card.tsx`
  - Integrate the profile summary into the page system rather than a standalone card.
- Modify: `src/entities/profile/ui/profile-summary-card.test.tsx`
  - Keep identity and route-link coverage stable.
- Modify: `src/pages/profile/ui/profile-page.tsx`
  - Rebuild the profile page around the new shell grammar and integrated profile header.
- Modify: `src/entities/post/ui/post-detail-view.tsx`
  - Rework the reading mode to match the new command-surface system.
- Modify: `src/entities/post/ui/post-detail-view.test.tsx`
  - Keep reading-surface assertions aligned with the new layout.
- Modify: `src/pages/post-detail/ui/post-detail-page.tsx`
  - Align loading, error, and not-found states with the redesigned product surface.

## Chunk 1: Tokens, Command Bar, And Shell

### Task 1: Establish the global dark token system

**Files:**

- Modify: `src/styles.css`
- Test: `src/app/ui/app-shell.test.tsx`

- [ ] **Step 1: Write the failing test**

No direct CSS unit test is needed. Use the shell contract as the observable first failure point after test updates in Task 3.

- [ ] **Step 2: Run the current shell test as a baseline**

Run: `vp test --run src/app/ui/app-shell.test.tsx`
Expected: PASS before token changes

- [ ] **Step 3: Write minimal implementation**

Implement the approved token and utility changes in `src/styles.css`:

- dark graphite backgrounds
- warm off-white text colors
- pale-lager-gold accent variables
- reusable utilities for shell surfaces, feed separators, and focus states

- [ ] **Step 4: Re-run the shell test**

Run: `vp test --run src/app/ui/app-shell.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/styles.css
git commit -m "style: establish draft command-surface tokens"
```

### Task 2: Add the reusable top command bar

**Files:**

- Create: `src/app/ui/top-command-bar.tsx`
- Create: `src/app/ui/top-command-bar.test.tsx`

- [ ] **Step 1: Write the failing test**

Create a test that renders `TopCommandBar` and asserts:

- a home/brand link exists
- a search input exists
- a primary action exists

- [ ] **Step 2: Run test to verify it fails**

Run: `vp test --run src/app/ui/top-command-bar.test.tsx`
Expected: FAIL because the component/test contract does not exist yet

- [ ] **Step 3: Write minimal implementation**

Implement `TopCommandBar` with:

- `Draft` brand link to `/`
- global search input with developer-network placeholder
- primary action button or affordance on the right

- [ ] **Step 4: Run test to verify it passes**

Run: `vp test --run src/app/ui/top-command-bar.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/ui/top-command-bar.tsx src/app/ui/top-command-bar.test.tsx
git commit -m "feat: add top command bar"
```

### Task 3: Rebuild the shell around the command surface

**Files:**

- Modify: `src/app/ui/app-shell.tsx`
- Modify: `src/app/ui/app-shell.test.tsx`
- Reference: `src/app/ui/top-command-bar.tsx`

- [ ] **Step 1: Write the failing test**

Update `src/app/ui/app-shell.test.tsx` to assert:

- the `Draft` home link is visible
- the global search input is visible
- the lightweight navigation still renders
- the child page body still renders

- [ ] **Step 2: Run test to verify it fails**

Run: `vp test --run src/app/ui/app-shell.test.tsx`
Expected: FAIL because the current shell does not satisfy the new structure

- [ ] **Step 3: Write minimal implementation**

Implement the new shell with:

- `TopCommandBar` at the top
- reduced left rail
- responsive content grid
- no oversized outer glass container

- [ ] **Step 4: Run test to verify it passes**

Run: `vp test --run src/app/ui/app-shell.test.tsx src/app/ui/top-command-bar.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/ui/app-shell.tsx src/app/ui/app-shell.test.tsx
git commit -m "feat: rebuild app shell for command feed"
```

## Chunk 2: Home Command Feed

### Task 4: Add the developer compose strip

**Files:**

- Create: `src/pages/home-feed/ui/compose-strip.tsx`
- Create: `src/pages/home-feed/ui/compose-strip.test.tsx`

- [ ] **Step 1: Write the failing test**

Create a test that asserts:

- a text input or textarea is visible
- developer-oriented placeholder copy is visible
- one primary publish action is visible

- [ ] **Step 2: Run test to verify it fails**

Run: `vp test --run src/pages/home-feed/ui/compose-strip.test.tsx`
Expected: FAIL because the component/test contract does not exist yet

- [ ] **Step 3: Write minimal implementation**

Implement `ComposeStrip` as a premium entry surface for:

- build updates
- release notes
- links or questions

Keep it presentational only.

- [ ] **Step 4: Run test to verify it passes**

Run: `vp test --run src/pages/home-feed/ui/compose-strip.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/pages/home-feed/ui/compose-strip.tsx src/pages/home-feed/ui/compose-strip.test.tsx
git commit -m "feat: add developer compose strip"
```

### Task 5: Redesign the feed row and stream wrapper

**Files:**

- Modify: `src/entities/post/ui/post-preview-card.tsx`
- Modify: `src/entities/post/ui/post-preview-card.test.tsx`
- Modify: `src/widgets/feed-list/ui/feed-list.tsx`
- Modify: `src/widgets/feed-list/ui/feed-list.test.tsx`

- [ ] **Step 1: Write the failing test**

Update the row and feed-list tests to assert:

- title link still renders
- author link/handle still renders
- engagement metadata still renders
- the feed container still exposes the public timeline role

- [ ] **Step 2: Run test to verify it fails**

Run: `vp test --run src/entities/post/ui/post-preview-card.test.tsx src/widgets/feed-list/ui/feed-list.test.tsx`
Expected: FAIL if old structure assumptions no longer match the row-based surface

- [ ] **Step 3: Write minimal implementation**

Implement:

- flatter feed rows in `post-preview-card.tsx`
- lighter separators and empty state in `feed-list.tsx`
- no oversized card chrome

- [ ] **Step 4: Run test to verify it passes**

Run: `vp test --run src/entities/post/ui/post-preview-card.test.tsx src/widgets/feed-list/ui/feed-list.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/entities/post/ui/post-preview-card.tsx src/entities/post/ui/post-preview-card.test.tsx src/widgets/feed-list/ui/feed-list.tsx src/widgets/feed-list/ui/feed-list.test.tsx
git commit -m "feat: redesign feed rows and stream"
```

### Task 6: Rebuild the home page around search, compose, and feed

**Files:**

- Modify: `src/pages/home-feed/ui/home-feed-page.tsx`
- Reference: `src/pages/home-feed/ui/compose-strip.tsx`
- Test: `src/app/ui/app-shell.test.tsx`
- Test: `src/widgets/feed-list/ui/feed-list.test.tsx`

- [ ] **Step 1: Write the failing test**

Add or update assertions so the home page contract requires:

- the compose strip in the main column
- the feed as the primary surface
- restrained contextual modules instead of a hero block

- [ ] **Step 2: Run test to verify it fails**

Run: `vp test --run src/widgets/feed-list/ui/feed-list.test.tsx src/app/ui/app-shell.test.tsx`
Expected: FAIL if home integration still reflects the superseded hero-like layout

- [ ] **Step 3: Write minimal implementation**

Implement the approved home structure:

- no hero
- compose strip near the top
- feed-first center column
- limited context modules with developer-network framing
- aligned loading and error states

- [ ] **Step 4: Run test to verify it passes**

Run: `vp test --run src/pages/home-feed/ui/compose-strip.test.tsx src/entities/post/ui/post-preview-card.test.tsx src/widgets/feed-list/ui/feed-list.test.tsx src/app/ui/app-shell.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/pages/home-feed/ui/home-feed-page.tsx
git commit -m "feat: rebuild home command feed"
```

## Chunk 3: Profile, Reading Mode, And Verification

### Task 7: Integrate the profile view into the command-surface system

**Files:**

- Modify: `src/entities/profile/ui/profile-summary-card.tsx`
- Modify: `src/entities/profile/ui/profile-summary-card.test.tsx`
- Modify: `src/pages/profile/ui/profile-page.tsx`

- [ ] **Step 1: Write the failing test**

Update the profile summary test so it remains explicit about:

- avatar rendering
- profile link
- handle visibility

Adjust any assertions that depend on the boxed-card layout.

- [ ] **Step 2: Run test to verify it fails**

Run: `vp test --run src/entities/profile/ui/profile-summary-card.test.tsx`
Expected: FAIL if the current profile structure is still coupled to the old layout

- [ ] **Step 3: Write minimal implementation**

Implement:

- integrated profile header
- same shell language as home
- feed continuation directly below the summary
- aligned loading/error states in `profile-page.tsx`

- [ ] **Step 4: Run test to verify it passes**

Run: `vp test --run src/entities/profile/ui/profile-summary-card.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/entities/profile/ui/profile-summary-card.tsx src/entities/profile/ui/profile-summary-card.test.tsx src/pages/profile/ui/profile-page.tsx
git commit -m "feat: redesign profile route"
```

### Task 8: Redesign post detail into reading mode

**Files:**

- Modify: `src/entities/post/ui/post-detail-view.tsx`
- Modify: `src/entities/post/ui/post-detail-view.test.tsx`
- Modify: `src/pages/post-detail/ui/post-detail-page.tsx`

- [ ] **Step 1: Write the failing test**

Update the detail-view test so it explicitly protects:

- title visibility
- author profile link
- summary visibility when present
- canonical-link visibility when present

Adjust any expectations that depend on the old card-heavy structure.

- [ ] **Step 2: Run test to verify it fails**

Run: `vp test --run src/entities/post/ui/post-detail-view.test.tsx`
Expected: FAIL if the old structure no longer satisfies the approved reading mode

- [ ] **Step 3: Write minimal implementation**

Implement:

- more readable detail hierarchy
- same command-surface shell framing
- restrained metadata and author context
- aligned loading/error/not-found states in `post-detail-page.tsx`

- [ ] **Step 4: Run test to verify it passes**

Run: `vp test --run src/entities/post/ui/post-detail-view.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/entities/post/ui/post-detail-view.tsx src/entities/post/ui/post-detail-view.test.tsx src/pages/post-detail/ui/post-detail-page.tsx
git commit -m "feat: redesign post reading mode"
```

### Task 9: Run full verification for the redesign

**Files:**

- Modify: `src/styles.css`
- Modify: `src/app/ui/app-shell.tsx`
- Modify: `src/app/ui/app-shell.test.tsx`
- Modify: `src/app/ui/top-command-bar.tsx`
- Modify: `src/app/ui/top-command-bar.test.tsx`
- Modify: `src/pages/home-feed/ui/compose-strip.tsx`
- Modify: `src/pages/home-feed/ui/compose-strip.test.tsx`
- Modify: `src/pages/home-feed/ui/home-feed-page.tsx`
- Modify: `src/widgets/feed-list/ui/feed-list.tsx`
- Modify: `src/widgets/feed-list/ui/feed-list.test.tsx`
- Modify: `src/entities/post/ui/post-preview-card.tsx`
- Modify: `src/entities/post/ui/post-preview-card.test.tsx`
- Modify: `src/entities/profile/ui/profile-summary-card.tsx`
- Modify: `src/entities/profile/ui/profile-summary-card.test.tsx`
- Modify: `src/pages/profile/ui/profile-page.tsx`
- Modify: `src/entities/post/ui/post-detail-view.tsx`
- Modify: `src/entities/post/ui/post-detail-view.test.tsx`
- Modify: `src/pages/post-detail/ui/post-detail-page.tsx`

- [ ] **Step 1: Run the focused test suite**

Run: `vp test --run src/app/ui/app-shell.test.tsx src/app/ui/top-command-bar.test.tsx src/pages/home-feed/ui/compose-strip.test.tsx src/widgets/feed-list/ui/feed-list.test.tsx src/entities/post/ui/post-preview-card.test.tsx src/entities/profile/ui/profile-summary-card.test.tsx src/entities/post/ui/post-detail-view.test.tsx`
Expected: PASS

- [ ] **Step 2: Run the full repository test suite**

Run: `vp test`
Expected: PASS

- [ ] **Step 3: Run repository checks**

Run: `vp check`
Expected: PASS

- [ ] **Step 4: Review the diff against the approved spec**

Confirm the implementation still matches:

- no hero
- top search and compose
- pale-lager-gold accents
- feed-first product identity

- [ ] **Step 5: Commit**

```bash
git add src/styles.css src/app/ui/app-shell.tsx src/app/ui/app-shell.test.tsx src/app/ui/top-command-bar.tsx src/app/ui/top-command-bar.test.tsx src/pages/home-feed/ui/compose-strip.tsx src/pages/home-feed/ui/compose-strip.test.tsx src/pages/home-feed/ui/home-feed-page.tsx src/widgets/feed-list/ui/feed-list.tsx src/widgets/feed-list/ui/feed-list.test.tsx src/entities/post/ui/post-preview-card.tsx src/entities/post/ui/post-preview-card.test.tsx src/entities/profile/ui/profile-summary-card.tsx src/entities/profile/ui/profile-summary-card.test.tsx src/pages/profile/ui/profile-page.tsx src/entities/post/ui/post-detail-view.tsx src/entities/post/ui/post-detail-view.test.tsx src/pages/post-detail/ui/post-detail-page.tsx
git commit -m "feat: ship draft command-surface redesign"
```

Plan complete and saved to `docs/superpowers/plans/2026-03-23-social-feed-redesign.md`. Ready to execute?
