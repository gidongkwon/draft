# Infinite Personal Timeline Design

**Goal:** Turn the personal timeline into an infinite-scrolling feed that loads 20 items at a time, while keeping the signed-out home surface visible and replacing the timeline with a sign-in prompt.

## Product Direction

The home feed should continue to default to the personal timeline. The first page should contain 20 posts. As the user approaches the bottom of the list, the next 20 should load automatically without a visible "Load more" trigger.

Signed-out users should still see the home layout, compose-adjacent shell, and timeline tabs, but the personal timeline area should be replaced with a sign-in prompt that opens the existing authentication modal. The public timeline remains visible as an unavailable tab.

## Architecture

Although `solid-relay` exposes pagination fragments, the current app does not hydrate the home feed as a preloaded Relay query/fragment-ref flow. The home route currently serializes plain server data into the page. The least risky architecture is:

1. route loader fetches the initial 20 personal timeline items on the server
2. home feed renders from that serializable initial payload
3. a dedicated client-side pagination component uses the same query document and cursor variables to fetch additional pages through Relay runtime on the client

This preserves SSR for the initial feed while adding infinite loading without converting the entire route to a new Relay preloading pattern.

## Data Flow

The personal timeline query should include:

- `first`
- `after`
- `edges`
- `pageInfo { endCursor hasNextPage }`

The server route requests `first: 20` with no cursor. The pagination component keeps local state for:

- accumulated edges
- current `endCursor`
- `hasNextPage`
- loading state
- error state

When the bottom sentinel intersects and there is another page available, the component fetches the next page with `after: endCursor` and appends the new edges.

## UI Structure

The feed column should render:

1. compose surface
2. timeline tabs
3. one of:
   - infinite personal timeline
   - signed-out sign-in prompt
   - public timeline unavailable state

The infinite timeline should show:

- the current post list
- a subtle loading row while fetching
- a retry row if a pagination request fails

## Auth Prompt

The existing sign-in modal should stay the single auth entrypoint. To let nested home-feed components open it, add a small auth trigger context owned by the root route and consumed by the signed-out timeline prompt.

## Testing

- parser/loader defaults still work with no search params
- route loader fetches the first 20 only when a viewer is present
- signed-out personal timeline renders a sign-in prompt instead of requesting feed data
- infinite timeline appends the next page on sentinel intersection
- repeated intersections while loading do not trigger duplicate requests
- error state renders when a page request fails
