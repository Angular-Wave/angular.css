---
title: toggle
notoc: true
description: >
  Pressed-state button
---

Use native `button` elements with `aria-pressed`. The CSS also accepts
`data-state="on"`.

```html
<button aria-pressed="true" class="toggle">Bold</button>
<button variant="outline" class="toggle">Italic</button>
```

## Example

{{< example src="examples/elements/toggle.html" title="Toggle example" height="360" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint exports no runtime behavior. Native HTML, CSS, and AngularTS own the complete contract.

Read the [complete toggle component reference]({{< relref
"/docs/components/toggle" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
