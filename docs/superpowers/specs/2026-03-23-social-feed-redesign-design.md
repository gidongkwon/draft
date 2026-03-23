# Social Feed Redesign Design

**Date:** 2026-03-23

## Summary

Transform the current Hackers' Pub client into a production-grade developer network that reads like a premium "Twitter for developers" product rather than a demo reader or a marketing landing page.

The approved direction is:

- layout direction: `Stacked Command Feed`
- product identity: `Twitter for developers`
- top-of-page behavior: `No hero, search first, compose first`
- accent system: `Pale Lager Gold`

That combination means the redesign must feel product-native from the first viewport: a command bar, a fast publishing entry point, and a dense feed surface built for scanning and opening posts.

## Goals

- Make the home route feel like the main console of a live developer publishing network.
- Keep feed exploration and post reading as the core product actions.
- Redesign the app shell, home, profile, and post detail into one coherent system.
- Use Vercel-level restraint and polish without turning the app into a marketing site.
- Preserve the existing route and Relay data contracts.

## Non-Goals

- No GraphQL schema changes.
- No loader contract changes.
- No authentication, following, or real compose backend.
- No hero section or landing-page marketing narrative.
- No bright consumer-social palette or literal pub/beer branding.

## Visual Thesis

The interface should feel like a dark developer network surface with warm metallic signal accents inspired by draft beer taps, interpreted as premium product polish rather than food or hospitality branding.

Key visual properties:

- deep graphite and near-black structural surfaces
- warm off-white typography with high contrast
- pale lager gold reserved for focus, active, and priority states
- minimal borders, minimal shadows, and strong spacing discipline
- app-first composition with brand expressed through shell, hierarchy, and motion

## Product Structure

### App Shell

The shell becomes a persistent product frame instead of a boxed demo layout.

Responsibilities:

- maintain the global command bar across routes
- establish product identity through typography and layout
- provide lightweight navigation for feed-first exploration
- keep every route inside the same product grammar

Composition:

- top command bar with brand, global search, and primary action
- lightweight left rail for route or mode switching
- dominant center workspace
- restrained right context on desktop only, reduced on smaller screens

The shell should feel stable and precise, not decorative.

### Home

The home route becomes the primary operating surface.

Responsibilities:

- surface search and publishing immediately
- present the public timeline as the main content body
- support fast scanning of posts and fast entry into post detail
- provide minimal secondary context without weakening the feed

Composition:

- command bar at the very top
- compose strip directly under the top chrome
- uninterrupted feed stream in the main column
- secondary modules such as active discussions, saved reads, or trending topics in a subdued context area

There is no hero. The compose strip is the top-of-page focal unit.

### Profile

The profile route should feel like the same product, narrowed to one publisher.

Responsibilities:

- foreground identity without becoming a vanity profile page
- keep recent posts central
- preserve fast movement between person and posts

Composition:

- integrated profile summary in the main workspace
- recent posts immediately below
- same command bar, spacing, and metadata system as home

### Post Detail

The post detail route should feel like a reading mode inside the same network.

Responsibilities:

- make the post easy to read
- preserve the author, timestamp, and engagement context
- keep movement back to the feed easy and intuitive

Composition:

- stronger reading column
- restrained supporting context for author and metadata
- same shell and top command bar as the feed view

## Component Design

### `AppShell`

Keep `AppShell` responsible for:

- top command bar
- route-level navigation
- layout frame for page content
- optional desktop context structure

It should not contain route-specific marketing copy or a large decorative container.

### `TopCommandBar`

This becomes the most important new shell element.

Required elements:

- brand/home link
- global search input
- primary action on the right

The search field is the central control. Pale lager gold should appear first in search focus and selected states.

### `ComposeStrip`

This is the top content unit on the home page.

Responsibilities:

- feel like a fast publishing prompt for developers
- provide a compact but premium writing entry surface
- hint at developer-native post types such as build updates, links, release notes, and questions

It should feel like an expandable command input, not a generic social textarea.

### `FeedList`

`FeedList` stays responsible for the stream boundary and empty-state boundary.

Its presentation changes from a stacked panel list to a denser stream:

- flatter container logic
- tighter vertical rhythm
- row separators instead of boxed cards

### `PostPreviewCard`

This becomes a feed row rather than a standalone card.

Required reading order:

- author
- timestamp
- title or core statement
- excerpt
- low-priority engagement metadata

Hover and active states should signal affordance through contrast and background, not heavy elevation.

### `ContextRail`

The context rail should be quiet and useful, not central.

Possible content:

- active discussions
- trending repos or topics
- saved reads

If it competes visually with the feed, it is too strong.

### `ProfileSummaryCard`

This component should stop reading like an isolated card and instead become a profile header section integrated into the page flow.

### `PostDetailView`

This component owns the reading-mode hierarchy:

- title
- metadata
- summary
- content body
- author context
- canonical link and engagement data

It should feel expanded and readable, but still belong to the same product system as the feed.

## Motion Thesis

Motion should reinforce product quality and focus:

- the command bar remains mostly stable on page entry
- the compose strip and first feed rows can lift in with a short entrance sequence
- search focus gets a restrained pale-gold glow
- the compose strip expands smoothly when active
- feed rows sharpen on hover through subtle background and contrast shifts

No large parallax, no ornamental reveal choreography, and no marketing-style hero motion.

## Data Flow

The redesign remains presentation-layer focused.

- current route loaders continue to fetch the same query references
- current page-level mapping functions continue to shape route data
- redesigned components consume the same mapped data

This keeps the effort on product quality and minimizes behavioral risk.

## Loading, Empty, and Error States

### Loading

- home: skeleton command/feed layout aligned to the new compose-and-stream structure
- profile: integrated profile header skeleton plus feed skeleton
- detail: title/body skeleton aligned with the reading column

### Empty

- preserve explicit empty states
- style them as part of the product surface, not as detached alerts

### Error

- keep copy operational and direct
- render errors inline in the relevant workspace
- preserve useful hints such as `VITE_API_URL` where they help debugging

## Testing Strategy

Testing should protect the information architecture and key product controls.

Required coverage:

- app shell exposes the brand link, global search, and page slot
- home route exposes compose input and feed stream structure
- feed rows still render author, title, and engagement metadata
- profile summary still exposes identity and route linkage
- post detail still exposes title, author, and canonical metadata

Where old tests assert superseded copy or layout language, update them to assert the new durable structure instead.

## Risks

- Over-stylizing the shell could weaken feed scan speed.
- Overusing the gold accent could make the product feel themed rather than premium.
- Adding too much home-page context could dilute the feed-first product promise.
- Treating the compose strip as a marketing banner instead of a product control would break the chosen direction.

## Acceptance Criteria

- The first viewport reads as a premium developer network, not a landing page.
- Search and compose are immediately visible on the home route.
- The home route centers feed exploration and fast post entry.
- Profile and post detail clearly belong to the same product system.
- The redesign ships without changing the existing data contract.
- `vp check` and `vp test` pass after implementation.
