---
title: input-group
notoc: true
description: >
  Composable input adornments and grouped controls
---

Use `data-slot="input-group"` with `role="group"` to compose native inputs,
textarea controls, text affixes, icons, keyboard hints, and action buttons.
Controls stay native and use `data-slot="input-group-control"`.

```html
<div data-slot="input-group" role="group">
  <input data-input data-slot="input-group-control" placeholder="Search..." />
  <div data-slot="input-group-addon" data-align="inline-start">
    <span data-slot="input-group-text">Search</span>
  </div>
  <div data-slot="input-group-addon" data-align="inline-end">
    <button ng-button data-slot="input-group-button" variant="ghost">Go</button>
  </div>
</div>
```

## Example

{{< example src="examples/elements/input-group.html" title="Input group example" height="510" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint re-exports the canonical `input-group` TypeScript
implementation. It does not define separate behavior, state, accessibility, or
CSS APIs.

Read the [complete input-group component reference]({{< relref
"/docs/components/input-group" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
