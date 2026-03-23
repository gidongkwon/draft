# Fluent Iconify Design

## Goal

Apply Fluent UI system icons across the app using Iconify, without changing the current layout language.

## Scope

- Top command bar actions and search affordances
- Sidebar navigation and status card accents
- Auth modal actions
- Compose strip actions
- Feed/post/profile metadata and action links

## Rules

- Use Fluent System Icons `Regular` by default.
- Use `Filled` only for primary CTA actions such as `New post`, `Publish`, and `Complete sign in`.
- Put icons to the left of visible labels.
- Keep icon-only controls explicitly labeled with `aria-label`.
- Route all icon rendering through a shared `AppIcon` wrapper.

## Implementation Notes

- Prefer locally bundled icons over runtime API fetching.
- Keep icon sizing and alignment centralized in the wrapper.
- Do not add decorative icons everywhere; only add them where they improve scanability.
