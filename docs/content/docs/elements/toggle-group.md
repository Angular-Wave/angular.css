---
title: toggle-group
notoc: true
description: >
  Grouped pressed-state buttons
---

Use `data-slot="toggle-group"` with `role="group"` and
`data-slot="toggle-group-item"` buttons.

```html
<div data-slot="toggle-group" role="group" variant="outline">
  <button ng-toggle data-slot="toggle-group-item" aria-pressed="true">
    Left
  </button>
  <button ng-toggle data-slot="toggle-group-item">Center</button>
</div>
```

## Example

{{< example src="examples/elements/toggle-group.html" title="Toggle group example" height="180" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint re-exports the canonical `toggle-group` TypeScript
implementation. It does not define separate behavior, state, accessibility, or
CSS APIs.

Read the [complete toggle-group component reference]({{< relref
"/docs/components/toggle-group" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
