# TanStack Start Login Migration Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the app to TanStack Start and implement modal email/username sign-in with server-managed session cookies, logout, and reusable protected-action gating.

**Architecture:** Keep the existing route and Relay investments, but move the runtime to TanStack Start so request-scoped server functions can own auth cookies and authenticated GraphQL calls. Split Relay environment creation into server and client paths, add a focused auth server module, then layer modal auth UI and protected-action continuation on top of the existing shell.

**Tech Stack:** TanStack Start, TanStack Solid Router, SolidJS, Relay Runtime, solid-relay, Vite+, Vitest via `vite-plus/test`

---

## Chunk 1: Runtime Migration and Request Context

### Task 1: Convert the app bootstrap from client-only Vite to TanStack Start

**Files:**

- Create: `src/router.tsx`
- Create: `src/client.tsx`
- Modify: `package.json`
- Modify: `tsconfig.json`
- Modify: `vite.config.js`
- Modify: `src/routes/__root.tsx`
- Modify: `src/main.tsx` or remove if Start bootstrap replaces it
- Test: `src/app/router/start-router.test.ts`

- [ ] **Step 1: Write the failing router bootstrap test**

```ts
import { describe, expect, it } from "vite-plus/test";

describe("getRouter", () => {
  it("creates a router with the generated route tree", async () => {
    const { getRouter } = await import("./router");
    const router = getRouter();

    expect(router).toBeDefined();
    expect(router.options.routeTree).toBeDefined();
    expect(router.options.scrollRestoration).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `vp test src/app/router/start-router.test.ts`
Expected: FAIL because `src/router.tsx` does not exist yet.

- [ ] **Step 3: Add Start dependencies and Vite plugin wiring**

Update `package.json` to include `@tanstack/solid-start`, keep `@tanstack/solid-router`, and preserve Relay dependencies.

Update `vite.config.js` so the plugin order matches TanStack Start guidance:

```ts
import { tanstackStart } from "@tanstack/solid-start/plugin/vite";
import solid from "vite-plugin-solid";

plugins: [
  devtools(),
  relay(),
  tanstackRouter({ target: "solid" }),
  tanstackStart(),
  solid({ ssr: true }),
];
```

Update scripts to keep using `vp dev`, `vp build`, `vp test`, and `vp check`.

- [ ] **Step 4: Add the Start router and root document**

Create `src/router.tsx`:

```tsx
import { createRouter } from "@tanstack/solid-router";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  return createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultStaleTime: 5_000,
  });
}
```

Refactor `src/routes/__root.tsx` to render a Start document shell:

```tsx
import * as Solid from "solid-js";
import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from "@tanstack/solid-router";
import { HydrationScript } from "solid-js/web";

function RootDocument(props: { children: Solid.JSX.Element }) {
  return (
    <html lang="en">
      <head>
        <HydrationScript />
        <HeadContent />
      </head>
      <body>
        <Solid.Suspense>{props.children}</Solid.Suspense>
        <Scripts />
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Add the Start client entrypoint**

Create `src/client.tsx`:

```tsx
import { StartClient } from "@tanstack/solid-start";
import { mount } from "@solidjs/start/client";
import { getRouter } from "./router";

mount(() => <StartClient router={getRouter()} />);
```

If the installed Start version expects a different client helper, adjust to the official API in the package docs or local types before proceeding.

- [ ] **Step 6: Run the focused test again**

Run: `vp test src/app/router/start-router.test.ts`
Expected: PASS

- [ ] **Step 7: Run the generated app checks**

Run: `vp check`
Expected: PASS or a focused list of migration errors to fix before moving on.

- [ ] **Step 8: Commit**

```bash
git add package.json tsconfig.json vite.config.js src/router.tsx src/client.tsx src/routes/__root.tsx src/app/router/start-router.test.ts
git commit -m "feat: migrate bootstrap to tanstack start"
```

### Task 2: Introduce request-aware app context for loaders and shell rendering

**Files:**

- Modify: `src/app/router/context.ts`
- Modify: `src/app/providers/relay-provider.tsx`
- Modify: `src/routes/__root.tsx`
- Create: `src/app/router/current-request.ts`
- Test: `src/app/router/context.test.ts`

- [ ] **Step 1: Write the failing request-context test**

```ts
import { describe, expect, it } from "vite-plus/test";

describe("app router context", () => {
  it("tracks both relay environment and auth viewer state", async () => {
    const { createAppRouterContext } = await import("./current-request");

    const context = createAppRouterContext({
      sessionToken: "session-123",
      viewer: { id: "viewer-1", name: "Lucid", handle: "@lucid", avatarUrl: null },
    });

    expect(context.sessionToken).toBe("session-123");
    expect(context.viewer?.handle).toBe("@lucid");
    expect(context.relayEnvironment).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `vp test src/app/router/context.test.ts`
Expected: FAIL because `createAppRouterContext` does not exist yet.

- [ ] **Step 3: Add the request-context factory**

Create `src/app/router/current-request.ts`:

```ts
import { createEnvironment } from "../../shared/api/relay";
import type { ViewerSummary } from "../../shared/auth/types";

export function createAppRouterContext(input: {
  sessionToken: string | null;
  viewer: ViewerSummary | null;
}) {
  return {
    sessionToken: input.sessionToken,
    viewer: input.viewer,
    relayEnvironment: createEnvironment({ sessionToken: input.sessionToken }),
  };
}
```

Update `src/app/router/context.ts` so the router context includes:

```ts
type AppRouterContext = {
  relayEnvironment: IEnvironment;
  sessionToken: string | null;
  viewer: ViewerSummary | null;
};
```

- [ ] **Step 4: Thread the richer context into the root route and provider**

Make sure the Relay provider can accept a request-scoped environment rather than importing a single global singleton.

```tsx
export function RelayProvider(props: ParentProps<{ environment: IEnvironment }>) {
  return (
    <RelayEnvironmentProvider environment={props.environment}>
      {props.children}
    </RelayEnvironmentProvider>
  );
}
```

- [ ] **Step 5: Run the focused test again**

Run: `vp test src/app/router/context.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/app/router/context.ts src/app/router/current-request.ts src/app/providers/relay-provider.tsx src/routes/__root.tsx src/app/router/context.test.ts
git commit -m "feat: add request scoped router context"
```

### Task 3: Refactor Relay fetch and environment creation for server-owned session injection

**Files:**

- Modify: `src/shared/api/relay/fetch-graphql.ts`
- Modify: `src/shared/api/relay/environment.ts`
- Modify: `src/shared/api/relay/fetch-graphql.test.ts`
- Test: `src/shared/api/relay/fetch-graphql.test.ts`

- [ ] **Step 1: Extend the fetch test with a failing authenticated-server case**

```ts
it("adds a bearer token when createEnvironment receives a session token", async () => {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ data: { viewer: null } }),
  });
  vi.stubGlobal("fetch", fetchMock);

  const { createEnvironment } = await import("./environment");
  const environment = createEnvironment({ sessionToken: "server-session" });

  await environment
    .getNetwork()
    .execute(
      { text: "query Test { viewer { id } }", name: "Test", operationKind: "query" } as any,
      {},
    )
    .toPromise();

  expect(fetchMock).toHaveBeenCalledWith(
    expect.any(String),
    expect.objectContaining({
      headers: expect.objectContaining({ Authorization: "Bearer server-session" }),
    }),
  );
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `vp test src/shared/api/relay/fetch-graphql.test.ts`
Expected: FAIL because `createEnvironment` does not accept `sessionToken` yet.

- [ ] **Step 3: Refactor environment creation**

Update `src/shared/api/relay/environment.ts`:

```ts
export function createEnvironment(options?: { sessionToken?: string | null }): IEnvironment {
  const fetchGraphQL = createGraphQLFetch({
    apiUrl: resolveApiUrl(),
    getSessionToken: () => options?.sessionToken ?? null,
  });

  return new Environment({
    network: Network.create((params, variables) => fetchGraphQL({ text: params.text, variables })),
    store: new Store(new RecordSource()),
  });
}
```

Keep a client default export only if the Start runtime still needs one in browser-only tests. Prefer explicit environment injection elsewhere.

- [ ] **Step 4: Run the focused test again**

Run: `vp test src/shared/api/relay/fetch-graphql.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/shared/api/relay/environment.ts src/shared/api/relay/fetch-graphql.ts src/shared/api/relay/fetch-graphql.test.ts
git commit -m "feat: support request scoped relay auth"
```

## Chunk 2: Authentication Server Boundary

### Task 4: Add auth types, cookie helpers, and viewer query support

**Files:**

- Create: `src/shared/auth/types.ts`
- Create: `src/shared/auth/session-cookie.ts`
- Create: `src/shared/auth/viewer-query.ts`
- Create: `src/shared/auth/viewer-query.test.ts`
- Test: `src/shared/auth/viewer-query.test.ts`

- [ ] **Step 1: Write the failing viewer-normalization test**

```ts
import { describe, expect, it } from "vite-plus/test";

describe("viewer summary mapping", () => {
  it("maps the graphql viewer into shell auth state", async () => {
    const { toViewerSummary } = await import("./viewer-query");

    const viewer = toViewerSummary({
      id: "viewer-1",
      name: "Lucid",
      username: "lucid",
      avatarUrl: "https://cdn.example/avatar.png",
    });

    expect(viewer).toEqual({
      id: "viewer-1",
      name: "Lucid",
      handle: "@lucid",
      avatarUrl: "https://cdn.example/avatar.png",
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `vp test src/shared/auth/viewer-query.test.ts`
Expected: FAIL because the viewer query module does not exist yet.

- [ ] **Step 3: Add auth types and cookie helpers**

Create `src/shared/auth/types.ts`:

```ts
export type ViewerSummary = {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string | null;
};
```

Create `src/shared/auth/session-cookie.ts`:

```ts
export const SESSION_COOKIE_NAME = "session";
export const SESSION_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;
```

- [ ] **Step 4: Add a reusable viewer query and mapper**

Create `src/shared/auth/viewer-query.ts` with:

```ts
import { graphql } from "relay-runtime";

export const viewerShellQuery = graphql`
  query viewerShellQuery {
    viewer {
      id
      name
      username
      avatarUrl
    }
  }
`;

export function toViewerSummary(viewer: {
  id: string;
  name: string;
  username: string;
  avatarUrl: string | null;
}) {
  return {
    id: viewer.id,
    name: viewer.name,
    handle: `@${viewer.username}`,
    avatarUrl: viewer.avatarUrl,
  };
}
```

- [ ] **Step 5: Run the focused test again**

Run: `vp test src/shared/auth/viewer-query.test.ts`
Expected: PASS

- [ ] **Step 6: Run Relay code generation**

Run: `vp run codegen`
Expected: Relay artifacts generated for `viewerShellQuery`.

- [ ] **Step 7: Commit**

```bash
git add src/shared/auth/types.ts src/shared/auth/session-cookie.ts src/shared/auth/viewer-query.ts src/shared/auth/viewer-query.test.ts src/**/__generated__/
git commit -m "feat: add auth viewer primitives"
```

### Task 5: Implement Start server functions for login challenge, code completion, and logout

**Files:**

- Create: `src/shared/auth/server.ts`
- Create: `src/shared/auth/server.test.ts`
- Modify: `src/shared/api/relay/environment.ts`
- Test: `src/shared/auth/server.test.ts`

- [ ] **Step 1: Write the failing auth server test**

```ts
import { describe, expect, it, vi } from "vite-plus/test";

describe("auth server actions", () => {
  it("stores the session cookie after completing a login challenge", async () => {
    const { completeSignIn } = await import("./server");

    const setCookie = vi.fn();
    const result = await completeSignIn.__executeForTests({
      token: "challenge-token",
      code: "ABC123",
      cookies: { set: setCookie },
      completeLoginChallenge: vi.fn().mockResolvedValue({ id: "session-1" }),
    });

    expect(setCookie).toHaveBeenCalled();
    expect(result.viewer).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `vp test src/shared/auth/server.test.ts`
Expected: FAIL because the auth server module does not exist yet.

- [ ] **Step 3: Implement the auth server module**

Create `src/shared/auth/server.ts` using `createServerFn` for:

- `requestSignInChallenge`
- `completeSignIn`
- `signOut`
- `getCurrentViewer`

Structure:

```ts
const requestSignInChallenge = createServerFn({ method: "POST" })
  .inputValidator((input: { identifier: string }) => input)
  .handler(async ({ data }) => {
    const identifier = data.identifier.trim();
    return isEmail(identifier) ? await loginByEmail(identifier) : await loginByUsername(identifier);
  });
```

For completion:

```ts
const completeSignIn = createServerFn({ method: "POST" })
  .inputValidator((input: { token: string; code: string }) => input)
  .handler(async ({ data }) => {
    const session = await completeLoginChallenge(data);
    setHeader("Set-Cookie", serializeSessionCookie(session.id));
    return { ok: true, viewer: await fetchViewerSummary(session.id) };
  });
```

For logout:

```ts
const signOut = createServerFn({ method: "POST" }).handler(async () => {
  const sessionId = readSessionCookie();
  if (sessionId) {
    await revokeSessionSafely(sessionId);
  }
  clearSessionCookie();
  return { ok: true };
});
```

Use one internal helper to call GraphQL auth mutations against `resolveApiUrl()`.

- [ ] **Step 4: Run the focused test again**

Run: `vp test src/shared/auth/server.test.ts`
Expected: PASS

- [ ] **Step 5: Run Relay code generation if the module added graphql tagged documents**

Run: `vp run codegen`
Expected: Relay artifacts generated for auth server documents.

- [ ] **Step 6: Commit**

```bash
git add src/shared/auth/server.ts src/shared/auth/server.test.ts src/shared/api/relay/environment.ts src/**/__generated__/
git commit -m "feat: add server auth actions"
```

## Chunk 3: Modal Auth UI, Protected Actions, and Shell Integration

### Task 6: Build the auth modal state machine and UI

**Files:**

- Create: `src/features/auth/model/auth-modal-store.ts`
- Create: `src/features/auth/ui/auth-modal.tsx`
- Create: `src/features/auth/ui/auth-modal.test.tsx`
- Test: `src/features/auth/ui/auth-modal.test.tsx`

- [ ] **Step 1: Write the failing modal flow test**

```tsx
import { fireEvent, render, screen } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vite-plus/test";

describe("AuthModal", () => {
  it("moves from identifier entry to code entry after a successful challenge", async () => {
    const requestChallenge = vi.fn().mockResolvedValue({ ok: true, token: "challenge-1" });
    const { AuthModal } = await import("./auth-modal");

    render(() => <AuthModal open requestChallenge={requestChallenge} />);

    fireEvent.input(screen.getByLabelText(/email or username/i), {
      target: { value: "lucid" },
    });
    fireEvent.submit(screen.getByRole("form", { name: /sign in/i }));

    expect(await screen.findByLabelText(/verification code/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `vp test src/features/auth/ui/auth-modal.test.tsx`
Expected: FAIL because the auth modal does not exist yet.

- [ ] **Step 3: Add the auth modal store and UI**

Create a focused store API:

```ts
type PendingAuthAction = { type: "new-post" } | null;

export function createAuthModalStore() {
  const [state, setState] = createStore({
    open: false,
    step: "identifier" as "identifier" | "code",
    identifier: "",
    token: null as string | null,
    pendingAction: null as PendingAuthAction,
    error: null as string | null,
  });

  return {
    state,
    openDirectly: () => setState({ open: true, pendingAction: null }),
    openForAction: (action: PendingAuthAction) => setState({ open: true, pendingAction: action }),
    close: () => setState({ open: false }),
  };
}
```

`AuthModal` should:

- render identifier and code steps
- call `requestSignInChallenge`
- call `completeSignIn`
- close on success
- expose a callback for successful sign-in

- [ ] **Step 4: Run the focused test again**

Run: `vp test src/features/auth/ui/auth-modal.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/features/auth/model/auth-modal-store.ts src/features/auth/ui/auth-modal.tsx src/features/auth/ui/auth-modal.test.tsx
git commit -m "feat: add auth modal flow"
```

### Task 7: Add protected-action gating and shell auth affordances

**Files:**

- Create: `src/features/auth/model/protected-action-gate.ts`
- Create: `src/features/auth/model/protected-action-gate.test.ts`
- Modify: `src/app/ui/top-command-bar.tsx`
- Modify: `src/app/ui/app-shell.tsx`
- Modify: `src/routes/__root.tsx`
- Test: `src/features/auth/model/protected-action-gate.test.ts`
- Test: `src/app/ui/app-shell.test.tsx`

- [ ] **Step 1: Write the failing protected-action test**

```ts
import { describe, expect, it, vi } from "vite-plus/test";

describe("protected action gate", () => {
  it("opens auth when a signed-out user tries to create a post", async () => {
    const { createProtectedActionGate } = await import("./protected-action-gate");

    const openAuth = vi.fn();
    const gate = createProtectedActionGate({
      isAuthenticated: () => false,
      openAuth,
    });

    gate.run({ type: "new-post" }, vi.fn());

    expect(openAuth).toHaveBeenCalledWith({ type: "new-post" });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `vp test src/features/auth/model/protected-action-gate.test.ts`
Expected: FAIL because the gate module does not exist yet.

- [ ] **Step 3: Implement the gate with one-shot continuation semantics**

Create `src/features/auth/model/protected-action-gate.ts`:

```ts
export function createProtectedActionGate(options: {
  isAuthenticated: () => boolean;
  openAuth: (action: { type: "new-post" }) => void;
}) {
  let pending: null | (() => void) = null;

  return {
    run(action: { type: "new-post" }, continuation: () => void) {
      if (options.isAuthenticated()) {
        continuation();
        return;
      }
      pending = () => {
        const next = pending;
        pending = null;
        next?.();
      };
      options.openAuth(action);
    },
    resume() {
      const next = pending;
      pending = null;
      next?.();
    },
  };
}
```

- [ ] **Step 4: Integrate auth UI into the shell**

Update `TopCommandBar` and `AppShell` so they accept:

- `viewer`
- `onSignInClick`
- `onSignOut`
- `onNewPost`

Signed-out state:

```tsx
<button type="button" onClick={props.onSignInClick}>
  Sign in
</button>
```

Signed-in state:

```tsx
<div>
  <span>{props.viewer.name}</span>
  <button type="button" onClick={props.onSignOut}>
    Log out
  </button>
</div>
```

`New post` must go through the protected-action gate.

- [ ] **Step 5: Add or update shell tests**

Assert:

- signed-out shell shows `Sign in`
- signed-in shell shows user name and `Log out`
- `New post` calls the provided protected action handler

- [ ] **Step 6: Run the focused tests again**

Run: `vp test src/features/auth/model/protected-action-gate.test.ts src/app/ui/app-shell.test.tsx`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/features/auth/model/protected-action-gate.ts src/features/auth/model/protected-action-gate.test.ts src/app/ui/top-command-bar.tsx src/app/ui/app-shell.tsx src/app/ui/app-shell.test.tsx src/routes/__root.tsx
git commit -m "feat: gate protected shell actions behind auth"
```

### Task 8: Connect server auth, shell viewer state, and route invalidation end to end

**Files:**

- Modify: `src/routes/__root.tsx`
- Modify: `src/app/providers/relay-provider.tsx`
- Modify: `src/features/auth/ui/auth-modal.tsx`
- Modify: `src/app/ui/top-command-bar.tsx`
- Modify: `src/app/ui/app-shell.tsx`
- Modify: `src/app/router/route-loaders.test.ts`
- Test: `src/app/router/route-loaders.test.ts`
- Test: `src/features/auth/ui/auth-modal.test.tsx`

- [ ] **Step 1: Extend a route or shell test with a failing authenticated-state case**

```ts
it("hydrates shell auth state from the root route context", async () => {
  const { createAppRouterContext } = await import("./current-request");
  const context = createAppRouterContext({
    sessionToken: "session-1",
    viewer: { id: "viewer-1", name: "Lucid", handle: "@lucid", avatarUrl: null },
  });

  expect(context.viewer?.name).toBe("Lucid");
});
```

- [ ] **Step 2: Run the targeted tests to verify the new case fails if not wired yet**

Run: `vp test src/app/router/route-loaders.test.ts src/features/auth/ui/auth-modal.test.tsx`
Expected: FAIL because root integration does not yet expose the server-derived viewer state.

- [ ] **Step 3: Wire the root route to auth server state**

Use a root loader pattern that:

- reads the current viewer through `getCurrentViewer`
- creates a request-scoped Relay environment with the current session
- passes both into the shell and provider tree

Sketch:

```tsx
export const Route = createRootRouteWithContext<AppRouterContext>()({
  loader: async () => {
    const auth = await getCurrentViewer();
    return auth;
  },
  component: RootComponent,
});
```

Then in `RootComponent`:

```tsx
const auth = Route.useLoaderData();
const environment = createEnvironment({ sessionToken: auth.sessionToken });

return (
  <RelayProvider environment={environment}>
    <AppShell viewer={auth.viewer} ...>
      <Outlet />
      <AuthModal ... />
    </AppShell>
  </RelayProvider>
);
```

- [ ] **Step 4: Invalidate router state after sign-in and sign-out**

On success:

```ts
await completeSignIn({ data: { token, code } });
await router.invalidate();
props.onSignedIn?.();
```

On logout:

```ts
await signOut();
await router.invalidate();
```

- [ ] **Step 5: Run focused tests**

Run: `vp test src/app/router/route-loaders.test.ts src/features/auth/ui/auth-modal.test.tsx src/app/ui/app-shell.test.tsx`
Expected: PASS

- [ ] **Step 6: Run code generation and full validation**

Run: `vp run codegen`
Expected: Relay artifacts are current.

Run: `vp check`
Expected: PASS

Run: `vp test`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/routes/__root.tsx src/app/providers/relay-provider.tsx src/features/auth/ui/auth-modal.tsx src/app/ui/top-command-bar.tsx src/app/ui/app-shell.tsx src/app/router/route-loaders.test.ts src/**/__generated__/
git commit -m "feat: complete tanstack start auth integration"
```

## Notes for Execution

- Keep Relay. Do not opportunistically replace route data fetching with ad hoc `fetch` calls unless the call is purely auth-specific and server-only.
- Preserve current page component output unless a Start migration requirement forces a structural change.
- Keep all raw cookie access inside the auth server module.
- If the installed TanStack Start API differs slightly from the current official docs, adjust to the package-local types, but preserve the same architectural boundaries.
- After each task, re-read the affected files before patching to avoid clobbering user changes in this already-dirty worktree.
