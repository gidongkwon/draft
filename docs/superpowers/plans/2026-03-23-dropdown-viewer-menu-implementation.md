# Dropdown Viewer Menu Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a reusable dropdown primitive and use it for the signed-in viewer account menu in the app shell.

**Architecture:** The dropdown is implemented as a small headless primitive in `src/shared/ui/dropdown.tsx` backed by Solid context and document-level dismissal handlers. `AppShell` consumes the primitive and keeps all current account data rendering while moving logout into dropdown content.

**Tech Stack:** SolidJS, @solidjs/testing-library, vite-plus/test, Tailwind utility classes

---

## Chunk 1: Dropdown Primitive

### Task 1: Add dropdown tests

**Files:**

- Create: `src/shared/ui/dropdown.test.tsx`
- Test: `src/shared/ui/dropdown.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
it("opens, dismisses on outside click, and dismisses on Escape", () => {
  render(() => (
    <Dropdown.Root>
      <Dropdown.Trigger>Open menu</Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item onSelect={vi.fn()}>Log out</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  ));

  expect(screen.queryByRole("menu")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
  expect(screen.getByRole("menu")).toBeTruthy();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `vp test src/shared/ui/dropdown.test.tsx`
Expected: FAIL because the dropdown module does not exist yet.

- [ ] **Step 3: Write minimal implementation**

Create `src/shared/ui/dropdown.tsx` with:

```tsx
export const Dropdown = {
  Root,
  Trigger,
  Content,
  Item,
};
```

and the minimal context-backed behavior needed for toggle and dismissal.

- [ ] **Step 4: Run test to verify it passes**

Run: `vp test src/shared/ui/dropdown.test.tsx`
Expected: PASS

### Task 2: Refine dropdown item behavior

**Files:**

- Modify: `src/shared/ui/dropdown.tsx`
- Modify: `src/shared/ui/dropdown.test.tsx`
- Test: `src/shared/ui/dropdown.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
it("runs item handlers and closes after selection", () => {
  const onSelect = vi.fn();

  render(() => (
    <Dropdown.Root>
      <Dropdown.Trigger>Open menu</Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item onSelect={onSelect}>Log out</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  ));

  fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
  fireEvent.click(screen.getByRole("menuitem", { name: "Log out" }));

  expect(onSelect).toHaveBeenCalled();
  expect(screen.queryByRole("menu")).toBeNull();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `vp test src/shared/ui/dropdown.test.tsx`
Expected: FAIL because item selection does not yet close the menu or invoke the callback correctly.

- [ ] **Step 3: Write minimal implementation**

Update `Dropdown.Item` so it:

```tsx
onClick={() => {
  props.onSelect?.();
  context.setOpen(false);
}}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `vp test src/shared/ui/dropdown.test.tsx`
Expected: PASS

## Chunk 2: App Shell Integration

### Task 3: Replace inline logout button with viewer-triggered dropdown

**Files:**

- Modify: `src/app/ui/app-shell.tsx`
- Modify: `src/app/ui/app-shell.test.tsx`
- Test: `src/app/ui/app-shell.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
it("uses the viewer section as the logout menu trigger", () => {
  const onSignOut = vi.fn();

  render(() => (
    <AppShell onNewPost={vi.fn()} onSignInClick={vi.fn()} onSignOut={onSignOut} viewer={viewer}>
      <div>Page body</div>
    </AppShell>
  ));

  expect(screen.queryByRole("menuitem", { name: "Log out" })).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Lucid @lucid" }));
  fireEvent.click(screen.getByRole("menuitem", { name: "Log out" }));
  expect(onSignOut).toHaveBeenCalled();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `vp test src/app/ui/app-shell.test.tsx`
Expected: FAIL because the shell still renders a direct logout button.

- [ ] **Step 3: Write minimal implementation**

Use the shared dropdown in `src/app/ui/app-shell.tsx` and move the current signed-in viewer row into the dropdown trigger button. Render `Log out` inside the dropdown content.

- [ ] **Step 4: Run test to verify it passes**

Run: `vp test src/app/ui/app-shell.test.tsx`
Expected: PASS

### Task 4: Run verification

**Files:**

- Modify: `src/shared/ui/dropdown.tsx`
- Modify: `src/shared/ui/dropdown.test.tsx`
- Modify: `src/app/ui/app-shell.tsx`
- Modify: `src/app/ui/app-shell.test.tsx`

- [ ] **Step 1: Run focused tests**

Run: `vp test src/shared/ui/dropdown.test.tsx src/app/ui/app-shell.test.tsx`
Expected: PASS

- [ ] **Step 2: Run project checks**

Run: `vp check`
Expected: PASS

- [ ] **Step 3: Run full tests**

Run: `vp test`
Expected: PASS
