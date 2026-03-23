# TanStack Start Login Migration Design

**Date:** 2026-03-23

**Goal:** Migrate the app from a client-only TanStack Router setup to TanStack Start, then implement Hackers' Pub-style authentication with modal sign-in, `httpOnly` session cookies, logout, and reusable protected-action gates.

## Scope

This work combines two tightly-coupled changes:

1. migrate the runtime to TanStack Start with server-aware routing and request-scoped data loading
2. implement authentication on top of that runtime using the existing Hackers' Pub GraphQL contract

The target login scope is:

- email or username challenge request
- verification-code completion
- `session` cookie management on the server
- logged-in UI state in the shell
- logout
- protected action gating for `New post` and future authenticated actions
- continuation after sign-in when auth was required for an action

Out of scope for this change:

- passkey login
- account creation
- profile/settings editing
- broad data-layer replacement away from Relay

## Current Context

The current `draft` app is a Vite client app using:

- TanStack Solid Router file routes
- Relay for GraphQL data access
- Solid components for shell and page UI

The GraphQL schema already exposes the required auth operations:

- `loginByEmail`
- `loginByUsername`
- `completeLoginChallenge`
- `revokeSession`

The reference implementation in `~/hackerspub/web-next` shows the desired auth model:

- request a login challenge by email or username
- complete the challenge with a code
- store the resulting session in a `session` cookie
- attach that session to downstream GraphQL calls
- revoke the session on logout

The main gap in `draft` is that there is no server runtime boundary yet, so the app cannot safely issue `httpOnly` cookies or make request-scoped authenticated GraphQL calls.

## Architecture

The app will move to **TanStack Start** while keeping **Relay** as the GraphQL client abstraction.

### Runtime boundary

- **Browser**
  - opens and closes the sign-in modal
  - collects user input
  - triggers auth-related server functions
  - renders logged-in and logged-out UI states
- **TanStack Start server**
  - reads and writes the `session` cookie
  - performs login challenge and completion mutations
  - revokes sessions on logout
  - builds request-scoped Relay environments with the current session
  - evaluates whether a protected action is allowed
- **Relay layer**
  - remains the GraphQL integration surface
  - is split into server-request and client-hydration usage patterns

### Why this shape

This keeps the current GraphQL and Relay investment, while moving the security-sensitive parts of authentication to the server boundary. It also sets up a reusable model for future authenticated features without requiring a second migration later.

## Component Boundaries

The implementation is divided into five responsibility areas.

### 1. TanStack Start migration

Responsible for:

- Start-compatible entry files and router bootstrapping
- request-aware route context
- server-capable data loading
- SSR/hydration-safe app shell rendering

This layer should preserve the existing visual routes and page components as much as possible, while changing how data and request context are acquired.

### 2. Authentication server module

Located under `src/shared/auth` or an equivalent focused auth directory.

Responsible for:

- cookie constants and helpers
- current-session parsing
- challenge request actions
- challenge completion actions
- logout action
- shared auth result typing

This is the only layer allowed to directly read or write the `session` cookie.

### 3. Authentication client feature

Located under `src/features/auth`.

Responsible for:

- sign-in modal state
- email/username step
- verification-code step
- auth error presentation
- client-side refresh after auth changes

This layer must not persist or inspect raw session tokens.

### 4. Protected action gate

Responsible for:

- deciding whether an action requires login
- opening the sign-in modal when unauthenticated
- storing a one-shot continuation for the blocked action
- resuming that action after successful sign-in

The first protected action is `New post`, but the API should support future actions without redesign.

### 5. Shell integration

Responsible for:

- logged-in vs logged-out header actions
- sidebar/account affordances if needed
- logout trigger
- auth-aware initial render and post-auth refresh

## Authentication Flow

### Sign-in step 1: request challenge

1. user opens the modal
2. user enters email or username
3. client calls a Start server function
4. server decides whether the input is an email or username
5. server calls `loginByEmail` or `loginByUsername`
6. server returns a safe challenge result to the client
7. client transitions the modal to code-entry mode

Expected user-facing outcomes:

- success: show verification-code entry state
- account not found: show a targeted error
- unknown failure: show a generic retry message

### Sign-in step 2: complete challenge

1. user enters the code
2. client calls a Start server function with the challenge token and code
3. server calls `completeLoginChallenge`
4. if successful, server sets the `session` cookie as `httpOnly`
5. server returns success and current-user summary, or triggers route refresh
6. client closes the modal or resumes the protected action flow

### Logout

1. user presses logout in the shell
2. client calls a Start server function
3. server reads the current `session` cookie
4. server calls `revokeSession`
5. server clears the cookie even if remote revoke fails after the local session must be invalidated
6. client refreshes auth-aware UI state

### Continuation behavior

When sign-in was opened because a protected action required auth:

- successful sign-in resumes the original action once
- the continuation is cleared after use

When sign-in was opened directly by the user:

- successful sign-in only closes the modal
- the current page stays in place

## Data Flow

### Session propagation

- the browser never reads the `session` cookie directly
- Start request handlers read the cookie from the incoming request
- server-side GraphQL calls attach `Authorization: Bearer <session>`
- client-side auth updates rely on server responses and router invalidation, not on token access

### Relay environments

The app will use two environment modes:

- **server request environment**
  - created per request
  - includes the current session from cookies
  - used in server loaders and auth-related server functions where appropriate
- **client environment**
  - reused in the browser
  - does not own the auth token
  - receives authenticated state through server-rendered data and subsequent requests

This preserves Relay while making authenticated rendering and loader execution consistent with Start.

## Error Handling

Errors should be separated into user-facing cases and internal transport failures.

### User-facing auth errors

- account not found during challenge request
- invalid or expired code during challenge completion
- generic sign-in failure
- logout failure with a non-blocking retry state

### Internal concerns

- malformed GraphQL responses
- cookie write or clear failure
- network failure between app server and GraphQL origin
- stale continuation state

The UI should remain calm and specific. Auth failures belong inside the modal or shell action area, not as full-page crashes.

## Testing Strategy

### Server auth tests

Cover:

- email vs username branching
- challenge completion sets the session cookie
- logout revokes the remote session and clears the cookie
- unauthenticated requests are treated as logged out

### Client auth tests

Cover:

- modal open and close behavior
- transition from identifier entry to code entry
- targeted error states
- direct sign-in vs protected-action continuation behavior

### Protected gate tests

Cover:

- unauthenticated `New post` click opens the modal
- successful sign-in resumes the blocked action
- continuation runs only once

### Migration regression tests

Cover:

- home feed still renders
- profile route still renders
- post detail route still renders
- initial auth-aware shell render does not break SSR/hydration

## Risks and Mitigations

### Risk: migration and auth changes are too entangled

Mitigation:

- keep Start runtime work and auth work separated into focused modules
- preserve current page components where possible
- move only the boundaries first, not every UI component

### Risk: Relay integration becomes inconsistent across server and client

Mitigation:

- centralize environment creation
- make request-scoped auth injection a single responsibility
- test loaders and authenticated shell rendering explicitly

### Risk: continuation logic becomes fragile

Mitigation:

- keep the continuation API minimal
- use one-shot semantics
- test direct-login and gated-login flows separately

## Success Criteria

The work is complete when all of the following are true:

- the app runs on TanStack Start
- existing main routes still render correctly
- users can sign in via email or username challenge from a modal
- verification code completion sets a server-managed `session` cookie
- shell UI reflects login state
- users can log out
- `New post` is protected by a reusable auth gate
- successful sign-in resumes blocked protected actions
- Relay-backed data loading still works under the new runtime
