---
title: toggle-group
notoc: true
description: >
  Grouped pressed-state buttons
---

Use `class="toggle-group"` with `role="group"` and
`class="toggle-group-item"` buttons.

```html
<fieldset variant="outline" class="toggle-group">
  <button aria-pressed="true" class="toggle-group-item toggle">
    Left
  </button>
  <button class="toggle-group-item toggle">Center</button>
</fieldset>
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
