---
title: popover
notoc: true
description: >
  Floating rich content panels
---

Use the native Popover API. Connect a button to semantic content with
`popovertarget`, `id`, and `popover`.

```html
<span class="popover">
  <button popovertarget="details-popover">Open</button>
  <aside id="details-popover" popover>Content</aside>
</span>
```

## Example

{{< example src="examples/elements/popover.html" title="Popover example" height="270" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint exports no runtime behavior. Native HTML, CSS, and AngularTS own the complete contract.

Read the [complete popover component reference]({{< relref
"/docs/components/popover" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
