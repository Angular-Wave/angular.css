---
title: accordion
description: >
  Expandable content sections
---

Use `ng-accordion` on a container whose direct children contain a heading with a
button followed by a panel.

```html
<div ng-accordion>
  <div>
    <h3><button type="button">Section 1</button></h3>
    <div>Content for section 1</div>
  </div>
  <div>
    <h3><button type="button">Section 2</button></h3>
    <div>Content for section 2</div>
  </div>
</div>
```

Set `multiple` or `type="multiple"` to allow more than one section to remain
open.

## Example

{{< example src="examples/elements/accordion.html" title="Accordion element example" height="220" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint re-exports the canonical `accordion` TypeScript
implementation. It does not define separate behavior, state, accessibility, or
CSS APIs.

Read the [complete accordion component reference]({{< relref
"/docs/components/accordion" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
