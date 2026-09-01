---
title: accordion
description: >
  Expandable content sections
---

Use `.accordion` around native `details` elements. Give sibling items the same
`name` when opening one item should close the others.

```html
<div class="accordion">
  <details name="sections" open>
    <summary>Section 1</summary>
    <div>Content for section 1</div>
  </details>
  <details name="sections">
    <summary>Section 2</summary>
    <div>Content for section 2</div>
  </details>
</div>
```

Omit `name` to allow more than one section to remain open.

## Example

{{< example src="examples/elements/accordion.html" title="Accordion element example" height="220" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint exports no runtime behavior. Native HTML, CSS, and AngularTS own the complete contract.

Read the [complete accordion component reference]({{< relref
"/docs/components/accordion" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
