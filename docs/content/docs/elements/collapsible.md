---
title: collapsible
notoc: true
description: >
  Expandable disclosure region
---

Prefer native `details` and `summary` when possible.

```html
<details data-slot="collapsible">
  <summary data-slot="collapsible-trigger">Order details</summary>
  <div data-slot="collapsible-content">Shipping address and item details.</div>
</details>
```

## Example

{{< example src="examples/elements/collapsible.html" title="Collapsible example" height="260" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint re-exports the canonical `collapsible` TypeScript
implementation. It does not define separate behavior, state, accessibility, or
CSS APIs.

Read the [complete collapsible component reference]({{< relref
"/docs/components/collapsible" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
