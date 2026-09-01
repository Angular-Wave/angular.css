---
title: Accessibility
weight: 30
description:
  Author names and semantics, understand generated ARIA state, and test complete
  component compositions.
---

AngularCSS supplies component mechanics, but accessibility depends on the final
authored HTML. Every component page documents what the directive generates and
what the application must provide.

## Start with semantic HTML

Use native elements before adding roles. A `button` already supports keyboard
activation, a `label` connects to a form control, and a `nav` exposes a
navigation landmark.

Use `role` only for composite patterns without a suitable native element, such
as tabs, menus, and custom listboxes.

## Provide accessible names

Visible text should name buttons, fields, landmarks, and overlays. Use
`aria-label` only when visible text cannot provide the name. Dialog-like
components should include title and description parts so the directive can
connect `aria-labelledby` and `aria-describedby`.

## Preserve keyboard behavior

- Tab enters and leaves components in normal document order.
- Arrow keys move within composite controls when documented.
- Enter and Space activate buttons and disclosure triggers.
- Escape closes menus and overlays and restores focus where appropriate.
- Disabled items are not activated or selected.

Do not use CSS to visually reorder focusable controls independently of their DOM
order.

## Keep focus visible

Application overrides must retain a visible focus indicator with sufficient
contrast. Modal dialogs, alert dialogs, sheets, and drawers trap focus while
open and restore focus to the invoking trigger after closure.

## Generated state

Directives generate or synchronize ARIA relationships and `data-*` state. Do not
hard-code generated IDs. Authored labels and relationships are preserved when
valid, so applications may supply stable IDs for server rendering and tests.

## Dynamic feedback

Use status and alert semantics according to urgency. Toasts, spinners, progress,
and field errors must not announce the same change through multiple live
regions.

## Test the composition

For every production component:

1. Complete the workflow using only a keyboard.
2. Confirm focus is always visible and restored after overlays close.
3. Inspect the accessibility tree for names, roles, values, and relationships.
4. Test validation and dynamic feedback with a screen reader.
5. Check zoom, reflow, RTL, reduced motion, and high-contrast settings where
   relevant.
