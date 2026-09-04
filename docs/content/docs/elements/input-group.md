---
title: input-group
notoc: true
description: >
  Composable input adornments and grouped controls
---

Use `class="input-group"` to compose native inputs, textarea controls, text
affixes, icons, keyboard hints, and action buttons. Direct children supply the
complete structure without part classes.

```html
<fieldset class="input-group">
  <input placeholder="Search..." class="input" />
  <div align="inline-start">
    <span>Search</span>
  </div>
  <div align="inline-end">
    <button variant="ghost" class="button">Go</button>
  </div>
</fieldset>
```

## Example

{{< example src="examples/elements/input-group.html" title="Input group example" height="510" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint exports no runtime behavior. Native HTML, CSS, and AngularTS own the complete contract.

Read the [complete input-group component reference]({{< relref
"/docs/components/input-group" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
