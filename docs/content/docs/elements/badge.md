---
title: badge
notoc: true
description: >
  Inline status and metadata labels
---

Use `data-slot="badge"` or `ng-badge` on an inline element. Variants are exposed
through the `variant` attribute.

```html
<span data-slot="badge">Badge</span>
<span data-slot="badge" variant="secondary">Secondary</span>
<span data-slot="badge" variant="outline">Outline</span>
```

## Example

{{< example src="examples/elements/badge.html" title="Badge example" height="170" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint re-exports the canonical `badge` TypeScript
implementation. It does not define separate behavior, state, accessibility, or
CSS APIs.

Read the [complete badge component reference]({{< relref
"/docs/components/badge" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
