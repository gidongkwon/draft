# Personal Timeline Tabs Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the personal timeline as the home feed, add reusable base-ui-style tabs, and stop querying the out-of-service public timeline.

**Architecture:** A new controlled `Tabs` primitive in `src/shared/ui` handles reusable tab semantics and styling. The home feed route owns timeline type in validated search state, the server query layer fetches `personalTimeline` for the live path, and the old `publicTimeline` path is isolated as an unavailable branch instead of being queried.

**Tech Stack:** SolidJS, TanStack Router, Relay, zod, @solidjs/testing-library, vite-plus/test

---

## Chunk 1: Reusable Tabs Primitive

### Task 1: Add tabs tests

**Files:**

- Create: `src/shared/ui/tabs.test.tsx`
- Test: `src/shared/ui/tabs.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
it("marks the selected tab and changes selection when another enabled tab is chosen", () => {
  const onValueChange = vi.fn();

  render(() => (
    <Tabs.Root value="personal" onValueChange={onValueChange}>
      <Tabs.List aria-label="Timeline type">
        <Tabs.Trigger value="personal">Personal</Tabs.Trigger>
        <Tabs.Trigger value="public">Public</Tabs.Trigger>
      </Tabs.List>
    </Tabs.Root>
  ));

  expect(screen.getByRole("tab", { name: "Personal" })).toHaveAttribute("aria-selected", "true");
  fireEvent.click(screen.getByRole("tab", { name: "Public" }));
  expect(onValueChange).toHaveBeenCalledWith("public");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `vp test src/shared/ui/tabs.test.tsx`
Expected: FAIL because the tabs module does not exist yet.

- [ ] **Step 3: Write minimal implementation**

Create `src/shared/ui/tabs.tsx` with a controlled compound API:

```tsx
export const Tabs = {
  Root,
  List,
  Trigger,
};
```

and implement selected/disabled semantics using context.

- [ ] **Step 4: Run test to verify it passes**

Run: `vp test src/shared/ui/tabs.test.tsx`
Expected: PASS

### Task 2: Add disabled-tab behavior

**Files:**

- Modify: `src/shared/ui/tabs.test.tsx`
- Modify: `src/shared/ui/tabs.tsx`
- Test: `src/shared/ui/tabs.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
it("does not emit changes for disabled tabs", () => {
  const onValueChange = vi.fn();

  render(() => (
    <Tabs.Root value="personal" onValueChange={onValueChange}>
      <Tabs.List aria-label="Timeline type">
        <Tabs.Trigger value="personal">Personal</Tabs.Trigger>
        <Tabs.Trigger disabled value="public">
          Public
        </Tabs.Trigger>
      </Tabs.List>
    </Tabs.Root>
  ));

  fireEvent.click(screen.getByRole("tab", { name: "Public" }));
  expect(onValueChange).not.toHaveBeenCalled();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `vp test src/shared/ui/tabs.test.tsx`
Expected: FAIL because disabled tabs still behave like active buttons.

- [ ] **Step 3: Write minimal implementation**

Respect `disabled` in `Tabs.Trigger`:

```tsx
if (props.disabled) return;
context.onValueChange(props.value);
```

- [ ] **Step 4: Run test to verify it passes**

Run: `vp test src/shared/ui/tabs.test.tsx`
Expected: PASS

## Chunk 2: Home Feed Timeline Selection

### Task 3: Add route search parsing and loader branching

**Files:**

- Create: `src/pages/home-feed/model/timeline-search.ts`
- Modify: `src/routes/_feed.index.tsx`
- Modify: `src/app/router/route-loaders.test.ts`
- Modify: `src/shared/api/server-queries.ts`
- Modify: `src/shared/api/server-queries.test.ts`
- Test: `src/app/router/route-loaders.test.ts`
- Test: `src/shared/api/server-queries.test.ts`

- [ ] **Step 1: Write the failing test**

```tsx
it("loads the personal timeline when the route search requests personal", async () => {
  const feed = { timeline: "personal", data: { personalTimeline: { edges: [] } } };
  fetchHomeFeedMock.mockResolvedValue(feed);
  const { Route } = await import("../../routes/_feed.index");

  const result = await Route.options.loader?.(
    createLoaderContext({
      search: { timeline: "personal" },
    }),
  );

  expect(fetchHomeFeedMock).toHaveBeenCalledWith({ data: { timeline: "personal" } });
  expect(result).toEqual(feed);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `vp test src/app/router/route-loaders.test.ts src/shared/api/server-queries.test.ts`
Expected: FAIL because the route and server query layer do not accept timeline search yet.

- [ ] **Step 3: Write minimal implementation**

- Add a zod-backed parser for:

```ts
timeline: z.enum(["personal", "public"]).default("personal");
```

- Make `fetchHomeFeed` accept `{ timeline }`.
- If timeline is `personal`, fetch the live Relay query.
- If timeline is `public`, return an unavailable payload and leave the old query path commented out.

- [ ] **Step 4: Run test to verify it passes**

Run: `vp test src/app/router/route-loaders.test.ts src/shared/api/server-queries.test.ts`
Expected: PASS

### Task 4: Swap the home feed query to personal timeline

**Files:**

- Modify: `src/pages/home-feed/ui/home-feed-page.tsx`
- Modify: `src/pages/home-feed/ui/compose-strip.test.tsx`
- Test: `src/pages/home-feed/ui/compose-strip.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
it("renders the personal timeline feed from query data", () => {
  render(() => (
    <HomeFeedFeed
      timeline="personal"
      data={{
        personalTimeline: {
          edges: [
            /* one post */
          ],
        },
      }}
    />
  ));

  expect(screen.getByRole("feed", { name: "Personal timeline" })).toBeTruthy();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `vp test src/pages/home-feed/ui/compose-strip.test.tsx`
Expected: FAIL because the page still assumes `publicTimeline`.

- [ ] **Step 3: Write minimal implementation**

- Query `personalTimeline(first: $first)` instead of `publicTimeline`.
- Map `data.personalTimeline.edges`.
- Pass timeline-specific feed labels/messages into `FeedList`.
- Render an unavailable state when timeline is `public`.

- [ ] **Step 4: Run test to verify it passes**

Run: `vp test src/pages/home-feed/ui/compose-strip.test.tsx`
Expected: PASS

## Chunk 3: Tabs Integration and Feed Copy

### Task 5: Add timeline tabs to the home feed surface

**Files:**

- Modify: `src/pages/home-feed/ui/home-feed-layout.tsx`
- Modify: `src/routes/_feed.index.tsx`
- Modify: `src/pages/home-feed/index.ts`
- Modify: `src/pages/home-feed/ui/compose-strip.test.tsx`
- Test: `src/pages/home-feed/ui/compose-strip.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
it("renders timeline type tabs above the home feed", () => {
  render(() => (
    <HomeFeedLayout timeline="personal" onTimelineChange={vi.fn()}>
      <div>Feed slot</div>
    </HomeFeedLayout>
  ));

  expect(screen.getByRole("tablist", { name: "Timeline type" })).toBeTruthy();
  expect(screen.getByRole("tab", { name: "Personal" })).toHaveAttribute("aria-selected", "true");
  expect(screen.getByRole("tab", { name: "Public" })).toBeTruthy();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `vp test src/pages/home-feed/ui/compose-strip.test.tsx`
Expected: FAIL because the layout does not render timeline tabs.

- [ ] **Step 3: Write minimal implementation**

- Render `Tabs` between `ComposeStrip` and feed content.
- Drive selection from route search in `_feed.index.tsx`.
- Navigate on tab changes with router search updates.

- [ ] **Step 4: Run test to verify it passes**

Run: `vp test src/pages/home-feed/ui/compose-strip.test.tsx`
Expected: PASS

### Task 6: Generalize `FeedList` copy

**Files:**

- Modify: `src/widgets/feed-list/ui/feed-list.tsx`
- Modify: `src/widgets/feed-list/ui/feed-list.test.tsx`
- Test: `src/widgets/feed-list/ui/feed-list.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
it("renders caller-provided labels and empty-state copy", () => {
  render(() => (
    <FeedList
      emptyMessage="Nothing in your personal timeline yet."
      label="Personal timeline"
      posts={[]}
    />
  ));

  expect(screen.getByText("Nothing in your personal timeline yet.")).toBeTruthy();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `vp test src/widgets/feed-list/ui/feed-list.test.tsx`
Expected: FAIL because labels are currently hard-coded to public timeline.

- [ ] **Step 3: Write minimal implementation**

Add props:

```tsx
label?: string;
emptyMessage?: string;
```

and default them to generic values.

- [ ] **Step 4: Run test to verify it passes**

Run: `vp test src/widgets/feed-list/ui/feed-list.test.tsx`
Expected: PASS

## Chunk 4: Verification

### Task 7: Run focused and project verification

**Files:**

- Modify: `src/shared/ui/tabs.tsx`
- Modify: `src/shared/ui/tabs.test.tsx`
- Modify: `src/pages/home-feed/model/timeline-search.ts`
- Modify: `src/routes/_feed.index.tsx`
- Modify: `src/shared/api/server-queries.ts`
- Modify: `src/shared/api/server-queries.test.ts`
- Modify: `src/pages/home-feed/ui/home-feed-page.tsx`
- Modify: `src/pages/home-feed/ui/home-feed-layout.tsx`
- Modify: `src/pages/home-feed/ui/compose-strip.test.tsx`
- Modify: `src/widgets/feed-list/ui/feed-list.tsx`
- Modify: `src/widgets/feed-list/ui/feed-list.test.tsx`
- Modify: generated Relay artifacts as needed

- [ ] **Step 1: Run focused tests**

Run: `vp test src/shared/ui/tabs.test.tsx src/app/router/route-loaders.test.ts src/shared/api/server-queries.test.ts src/pages/home-feed/ui/compose-strip.test.tsx src/widgets/feed-list/ui/feed-list.test.tsx`
Expected: PASS

- [ ] **Step 2: Run project checks**

Run: `vp check`
Expected: PASS

- [ ] **Step 3: Run full tests**

Run: `vp test`
Expected: PASS or, if unrelated branch failures remain, capture them separately from this feature.
