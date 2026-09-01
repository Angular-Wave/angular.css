---
title: breadcrumb
notoc: true
description: >
  Page location navigation
---

Use `nav` with `aria-label="breadcrumb"` and part classes for list, item,
link, separator, and current page elements.

```html
<nav aria-label="breadcrumb" class="breadcrumb">
  <ol class="breadcrumb-list">
    <li class="breadcrumb-item">
      <a href="#" class="breadcrumb-link">Home</a>
    </li>
    <li aria-hidden="true" class="breadcrumb-separator">/</li>
    <li class="breadcrumb-item">
      <span aria-current="page" class="breadcrumb-page">Docs</span>
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
