---
title: select
notoc: true
description: >
  Native select styling for AngularTS forms
---

Use native `select` directly. AngularTS owns models, option registration,
validation, and form state; AngularCSS only supplies styling.

```html
<select ng-model="status">
  <option>Active</option>
  <option>Paused</option>
</select>
```

## Example

{{< example src="examples/elements/select.html" title="Select example" height="300" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint exports no runtime behavior. Native HTML, CSS, and AngularTS own the complete contract.

Read the [complete select component reference]({{< relref
"/docs/components/select" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
