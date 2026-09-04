---
title: native-select
notoc: true
description: >
  Native select control
---

Use a native `select` directly. The browser owns the picker, indicator, keyboard
interaction, validation, and form value.

```html
<select aria-label="Status" ng-model="status">
  <option value="">Select status</option>
  <option value="todo">Todo</option>
  <option value="done">Done</option>
</select>
<span>Status: <span ng-bind="status"></span></span>
```

## Example

{{< example src="examples/elements/native-select.html" title="Native select example" height="220" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint exports no runtime behavior. Native HTML, CSS, and AngularTS own the complete contract.

Read the [complete native-select component reference]({{< relref
"/docs/components/native-select" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
