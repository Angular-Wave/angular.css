---
title: input-group
notoc: true
description: >
  Composable input adornments and grouped controls
---

Use `class="input-group"` with `role="group"` to compose native inputs,
textarea controls, text affixes, icons, keyboard hints, and action buttons.
Controls stay native and use `class="input-group-control"`.

```html
<fieldset class="input-group">
  <input placeholder="Search..."  class="input-group-control input" />
  <div data-align="inline-start" class="input-group-addon">
    <span class="input-group-text">Search</span>
  </div>
  <div data-align="inline-end" class="input-group-addon">
    <button variant="ghost" class="input-group-button button">Go</button>
  </div>
</fieldset>
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
