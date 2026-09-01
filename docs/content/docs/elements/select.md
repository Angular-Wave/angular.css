---
title: select
notoc: true
description: >
  Custom select trigger and option list
---

Use custom select parts when you need an overlay-style select surface. Prefer
`native-select` for native form submission.

```html
<div class="select">
  <button class="select-trigger">Status</button>
  <ul class="select-content">
    <li class="select-item">Active</li>
  </ul>
</div>
```

## Example

{{< example src="examples/elements/select.html" title="Select example" height="300" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint re-exports the canonical `select` TypeScript
implementation. It does not define separate behavior, state, accessibility, or
CSS APIs.

Read the [complete select component reference]({{< relref
"/docs/components/select" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
