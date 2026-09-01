---
title: spinner
notoc: true
description: >
  Loading status indicator
---

Use `class="spinner"` on an SVG with an accessible label. Place it in an
`output` when status semantics are needed.

```html
<svg aria-label="Loading" viewBox="0 0 24 24" class="spinner">
  <circle cx="12" cy="12" r="10" />
</svg>
```

## Example

{{< example src="examples/elements/spinner.html" title="Spinner example" height="160" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint exports no runtime behavior. Native HTML, CSS, and AngularTS own the complete contract.

Read the [complete spinner component reference]({{< relref
"/docs/components/spinner" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
