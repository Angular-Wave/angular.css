---
title: spinner
notoc: true
description: >
  Loading status indicator
---

Use `data-slot="spinner"` or `ng-spinner` on an SVG with `role="status"`.

```html
<svg data-slot="spinner" role="status" aria-label="Loading" viewBox="0 0 24 24">
  <circle cx="12" cy="12" r="10" />
</svg>
```

## Example

{{< example src="examples/elements/spinner.html" title="Spinner example" height="160" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint re-exports the canonical `spinner` TypeScript
implementation. It does not define separate behavior, state, accessibility, or
CSS APIs.

Read the [complete spinner component reference]({{< relref
"/docs/components/spinner" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
