# Infinite Personal Timeline Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add infinite scrolling to the personal timeline with 20-item pages, keep the signed-out home surface visible, and open the existing auth modal from the timeline prompt.

**Architecture:** The home feed route continues to server-load the first 20 personal timeline items as serializable data. A dedicated client-side timeline component appends more pages through cursor-based Relay query fetches, driven by an `IntersectionObserver` sentinel. Signed-out users skip feed loading entirely and see a prompt wired through a small auth trigger context provided by the root route.

**Tech Stack:** SolidJS, TanStack Router, Relay runtime, zod, @solidjs/testing-library, vite-plus/test

---

## Chunk 1: Route and Auth Entry Points

### Task 1: Add signed-out timeline loader behavior

**Files:**

- Modify: `src/app/router/route-loaders.test.ts`
- Modify: `src/routes/_feed.index.tsx`
- Test: `src/app/router/route-loaders.test.ts`

- [ ] **Step 1: Write the failing test**

```tsx
it("returns an auth-required home feed state without requesting the timeline for signed-out users", async () => {
  const { Route } = await import("../../routes/_feed.index");

  const result = await Route.options.loader?.(
    createLoaderContext({
      context: { viewer: null },
      search: { timeline: "personal" },
    }),
  );

  expect(fetchHomeFeedMock).not.toHaveBeenCalled();
  expect(result).toEqual({
    data: null,
    requiresAuth: true,
    timeline: "personal",
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `vp test src/app/router/route-loaders.test.ts`
Expected: FAIL because the route still requests feed data even when the viewer is missing.

- [ ] **Step 3: Write minimal implementation**

Branch in the home feed loader:

```tsx
if (timeline === "personal" && !context.viewer) {
  return { data: null, requiresAuth: true, timeline };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `vp test src/app/router/route-loaders.test.ts`
Expected: PASS

### Task 2: Add a root-owned auth trigger context

**Files:**

- Create: `src/features/auth/ui/auth-trigger-context.tsx`
- Modify: `src/routes/__root.tsx`
- Test: `src/routes/-__root.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
it("provides an auth trigger for nested home-feed prompts", async () => {
  // render root and assert nested consumers can call the provided trigger
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `vp test src/routes/-__root.test.tsx`
Expected: FAIL because no shared auth trigger context exists yet.

- [ ] **Step 3: Write minimal implementation**

- Create a provider exposing:

```tsx
{
  openSignIn: () => void;
}
```

- Wrap the app shell children in that provider using `authModal.openDirectly()`.

- [ ] **Step 4: Run test to verify it passes**

Run: `vp test src/routes/-__root.test.tsx`
Expected: PASS

## Chunk 2: Initial Page Shape and Infinite Timeline Component

### Task 3: Expand the personal timeline query to support pagination

**Files:**

- Modify: `src/pages/home-feed/ui/home-feed-page.tsx`
- Modify: `src/shared/api/server-queries.ts`
- Modify: `src/shared/api/server-queries.test.ts`
- Test: `src/shared/api/server-queries.test.ts`

- [ ] **Step 1: Write the failing test**

```tsx
it("requests the first 20 personal timeline items", async () => {
  const relayEnvironment = {} as IEnvironment;
  fetchQueryMock.mockReturnValue({
    toPromise: vi.fn().mockResolvedValue({ personalTimeline: { edges: [], pageInfo: {} } }),
  });

  const { readHomeFeedWithEnvironment } = await import("./server-queries");

  await readHomeFeedWithEnvironment(relayEnvironment, "personal");

  expect(fetchQueryMock).toHaveBeenCalledWith(relayEnvironment, expect.anything(), {
    after: null,
    first: 20,
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `vp test src/shared/api/server-queries.test.ts`
Expected: FAIL because the query variables and pageInfo fields do not yet support pagination.

- [ ] **Step 3: Write minimal implementation**

- Update the query to:

```graphql
query homeFeedPageQuery($first: Int!, $after: String) {
  personalTimeline(first: $first, after: $after) {
    edges { ... }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}
```

- Call it with `{ first: 20, after: null }`.

- [ ] **Step 4: Run test to verify it passes**

Run: `vp test src/shared/api/server-queries.test.ts`
Expected: PASS

### Task 4: Build the infinite personal timeline component

**Files:**

- Create: `src/pages/home-feed/ui/personal-timeline.test.tsx`
- Create: `src/pages/home-feed/ui/personal-timeline.tsx`
- Test: `src/pages/home-feed/ui/personal-timeline.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
it("appends the next 20 posts when the sentinel intersects", async () => {
  // render with one initial page, trigger observer callback, and assert appended items
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `vp test src/pages/home-feed/ui/personal-timeline.test.tsx`
Expected: FAIL because the infinite timeline component does not exist yet.

- [ ] **Step 3: Write minimal implementation**

Create a component that:

- seeds state from the initial `personalTimeline`
- observes a bottom sentinel
- calls `fetchRelayQuery(getRelayEnvironment(), homeFeedPageDocument, { first: 20, after: endCursor })`
- appends new edges
- blocks duplicate loads while a request is active
- renders loading and retry rows

- [ ] **Step 4: Run test to verify it passes**

Run: `vp test src/pages/home-feed/ui/personal-timeline.test.tsx`
Expected: PASS

## Chunk 3: Signed-Out Prompt and Home Feed Integration

### Task 5: Add a signed-out personal timeline prompt

**Files:**

- Modify: `src/pages/home-feed/ui/compose-strip.test.tsx`
- Modify: `src/pages/home-feed/ui/home-feed-page.tsx`
- Test: `src/pages/home-feed/ui/compose-strip.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
it("renders a sign-in prompt for signed-out personal timeline viewers", () => {
  render(() => <HomeFeedFeed data={null} requiresAuth timeline="personal" />);

  expect(screen.getByText("Sign in to view your timeline.")).toBeTruthy();
  expect(screen.getByRole("button", { name: "Sign in" })).toBeTruthy();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `vp test src/pages/home-feed/ui/compose-strip.test.tsx`
Expected: FAIL because the home feed does not yet distinguish signed-out personal timeline state.

- [ ] **Step 3: Write minimal implementation**

- Add a `requiresAuth?: boolean` prop to `HomeFeedFeed`.
- Render a sign-in prompt when `timeline === "personal"` and `requiresAuth`.
- Use the auth trigger context to open the existing modal.

- [ ] **Step 4: Run test to verify it passes**

Run: `vp test src/pages/home-feed/ui/compose-strip.test.tsx`
Expected: PASS

### Task 6: Integrate infinite timeline into the home feed

**Files:**

- Modify: `src/pages/home-feed/ui/home-feed-page.tsx`
- Modify: `src/pages/home-feed/ui/compose-strip.test.tsx`
- Test: `src/pages/home-feed/ui/compose-strip.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
it("renders the infinite personal timeline from initial route data", () => {
  render(() => <HomeFeedFeed data={data} timeline="personal" />);

  expect(screen.getByRole("feed", { name: "Personal timeline" })).toBeTruthy();
  expect(screen.getByText("Load state sentinel")).toBeTruthy();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `vp test src/pages/home-feed/ui/compose-strip.test.tsx`
Expected: FAIL because the home feed still renders a static `FeedList`.

- [ ] **Step 3: Write minimal implementation**

- Replace the personal-timeline `FeedList` path with the new infinite timeline component.
- Keep the public unavailable state unchanged.

- [ ] **Step 4: Run test to verify it passes**

Run: `vp test src/pages/home-feed/ui/compose-strip.test.tsx`
Expected: PASS

## Chunk 4: Verification

### Task 7: Run focused and project verification

**Files:**

- Modify: `src/pages/home-feed/model/timeline-search.ts`
- Modify: `src/routes/_feed.index.tsx`
- Modify: `src/features/auth/ui/auth-trigger-context.tsx`
- Modify: `src/routes/__root.tsx`
- Modify: `src/shared/api/server-queries.ts`
- Modify: `src/pages/home-feed/ui/home-feed-page.tsx`
- Modify: `src/pages/home-feed/ui/personal-timeline.tsx`
- Modify: generated Relay artifacts as needed

- [ ] **Step 1: Run focused tests**

Run: `vp test src/app/router/route-loaders.test.ts src/routes/-__root.test.tsx src/shared/api/server-queries.test.ts src/pages/home-feed/ui/personal-timeline.test.tsx src/pages/home-feed/ui/compose-strip.test.tsx`
Expected: PASS

- [ ] **Step 2: Run project checks**

Run: `vp check`
Expected: PASS

- [ ] **Step 3: Run full tests**

Run: `vp test`
Expected: PASS or, if unrelated branch failures remain, capture them separately from this feature.
