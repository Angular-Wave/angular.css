---
title: native-select
notoc: true
description: >
  Native select control
---

Use native `select` for simple option lists. Wrap the select in
`class="native-select-wrapper"` when you want the AngularCSS chevron.

```html
<div class="native-select-wrapper">
  <select aria-label="Status" ng-model="status" class="native-select">
    <option value="">Select status</option>
    <option value="todo">Todo</option>
    <option value="done">Done</option>
  </select>
</div>
<span>Status: <span ng-bind="status"></span></span>
```

## Example

{{< example src="examples/elements/native-select.html" title="Native select example" height="220" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint re-exports the canonical `native-select` TypeScript
implementation. It does not define separate behavior, state, accessibility, or
CSS APIs.

Read the [complete native-select component reference]({{< relref
"/docs/components/native-select" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
