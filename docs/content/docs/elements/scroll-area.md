---
title: scroll-area
notoc: true
description: >
  Contained scrollable region
---

Use a root and viewport slot to contain overflow without scrolling the page.

```html
<div data-slot="scroll-area">
  <div data-slot="scroll-area-viewport">Scrollable content</div>
</div>
```

## Example

{{< example src="examples/elements/scroll-area.html" title="Scroll area example" height="360" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint re-exports the canonical `scroll-area` TypeScript
implementation. It does not define separate behavior, state, accessibility, or
CSS APIs.

Read the [complete scroll-area component reference]({{< relref
"/docs/components/scroll-area" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
