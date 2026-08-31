---
title: direction
notoc: true
description: >
  Logical direction helpers
---

Use `dir`, logical alignment attributes, and optional flip markers for
direction-aware layouts.

```html
<section data-slot="direction" dir="rtl">
  <p data-logical-align="start">Start aligned text</p>
</section>
```

## Example

{{< example src="examples/elements/direction.html" title="Direction example" height="360" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint re-exports the canonical `direction` TypeScript
implementation. It does not define separate behavior, state, accessibility, or
CSS APIs.

Read the [complete direction component reference]({{< relref
"/docs/components/direction" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
