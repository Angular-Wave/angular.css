---
title: breadcrumb
notoc: true
description: >
  Page location navigation
---

Use a `.breadcrumb` navigation landmark with a native ordered list, links,
separators, and `aria-current="page"` for the current location.

```html
<nav aria-label="breadcrumb" class="breadcrumb">
  <ol>
    <li>
      <a href="#">Home</a>
    </li>
    <li aria-hidden="true">/</li>
    <li>
      <span aria-current="page">Docs</span>
    </li>
  </ol>
</nav>
```

## Example

{{< example src="examples/elements/breadcrumb.html" title="Breadcrumb example" height="160" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint exports no runtime behavior. Native HTML, CSS, and AngularTS own the complete contract.

Read the [complete breadcrumb component reference]({{< relref
"/docs/components/breadcrumb" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
