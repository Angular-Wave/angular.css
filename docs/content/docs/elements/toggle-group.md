---
title: toggle-group
notoc: true
description: >
  Grouped pressed-state buttons
---

Use `fieldset.toggle-group` with a native legend and labels containing radio or
checkbox inputs.

```html
<fieldset variant="outline" class="toggle-group">
  <legend class="visually-hidden">Alignment</legend>
  <label><input type="radio" name="alignment" value="left" /> Left</label>
  <label><input type="radio" name="alignment" value="center" /> Center</label>
</fieldset>
```

## Example

{{< example src="examples/elements/toggle-group.html" title="Toggle group example" height="180" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint exports no runtime behavior. Native HTML, CSS, and AngularTS own the complete contract.

Read the [complete toggle-group component reference]({{< relref
"/docs/components/toggle-group" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
