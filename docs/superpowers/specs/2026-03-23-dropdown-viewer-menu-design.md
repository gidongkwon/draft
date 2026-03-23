# Dropdown Viewer Menu Design

**Goal:** Replace the signed-in inline logout button with a reusable base-ui-style dropdown that uses the viewer section as its trigger.

## Architecture

Add a small headless dropdown primitive under `src/shared/ui` so menu behavior does not live inside `AppShell`. The primitive owns open state, trigger/content wiring, outside-click dismissal, and `Escape` dismissal. Styling stays with the consuming surface so the primitive remains reusable.

`AppShell` consumes that primitive for the signed-in account area. The existing viewer avatar, name, and handle become the trigger button. Opening the menu reveals a single action item for now: `Log out`. Signed-out behavior remains unchanged.

## Components

- `Dropdown.Root`
  Holds open state and exposes it through context.
- `Dropdown.Trigger`
  Renders a button, toggles the menu, and publishes `aria-haspopup="menu"` and `aria-expanded`.
- `Dropdown.Content`
  Renders anchored content only while open and closes on outside click or `Escape`.
- `Dropdown.Item`
  Renders a button action inside the menu and closes the menu after selection.

## Behavior

- Closed by default.
- Clicking the viewer trigger opens the menu.
- Clicking the trigger again closes the menu.
- Clicking outside the dropdown closes the menu.
- Pressing `Escape` closes the menu.
- Activating `Log out` calls the existing `onSignOut` callback and closes the menu.

## Testing

- Add an `AppShell` integration test that verifies the viewer section acts as the trigger and `Log out` is rendered only after opening.
- Add reusable dropdown tests that verify open/close behavior, outside click handling, and `Escape` dismissal.
