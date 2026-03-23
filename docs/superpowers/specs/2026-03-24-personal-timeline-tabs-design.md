# Personal Timeline Tabs Design

**Goal:** Replace the current public-timeline-only home feed with a timeline-type surface centered on the real `personalTimeline`, while introducing a reusable base-ui-style tabs primitive.

## Product Direction

The home feed should align with the newer Hackers' Pub behavior: the primary signed-in feed is the personal timeline, not the public timeline. The GraphQL schema already exposes `personalTimeline`, so this is a real data path rather than a placeholder.

The public timeline is currently out of service. The code should stop querying it for the home feed. The timeline switcher should still establish the timeline-type UI affordance so the surface is ready for additional feed modes later.

## Architecture

Introduce a reusable `Tabs` primitive under `src/shared/ui` using a compound-component API similar to the existing dropdown:

- `Tabs.Root`
- `Tabs.List`
- `Tabs.Trigger`

The primitive should be controlled through a selected value and `onValueChange`, expose accessible tab semantics, and provide selected/disabled styling hooks.

The home feed route should own the active timeline type through validated route search state. The default timeline is `personal`. This keeps timeline selection shareable, route-driven, and ready for future server-backed variants.

## Data Flow

- Add a home feed search parser for `timeline`.
- The home feed route reads the parsed search state and uses it as loader input.
- `personal` fetches the real `personalTimeline` query.
- `public` should not hit GraphQL while the backend is out of service. Keep the previous `publicTimeline` query path commented and isolated so the route can surface an unavailable state instead of issuing the broken query.

## UI Structure

The feed column should render:

1. compose surface
2. timeline-type tabs
3. feed body or unavailable state

Tab labels:

- `Personal`
- `Public`

The public tab should remain visible so the type system of the screen is clear, but it should render an out-of-service state instead of attempting the broken query.

## Feed Rendering

`FeedList` should stop assuming the feed is always public. Its aria label and empty-state message should be provided by props so both personal and future feed types can reuse it.

## Testing

- tabs primitive selection and disabled behavior
- home feed search parsing and loader selection
- personal timeline rendering from `personalTimeline`
- public timeline unavailable state without a GraphQL request
- generalized feed labels and empty-state copy
