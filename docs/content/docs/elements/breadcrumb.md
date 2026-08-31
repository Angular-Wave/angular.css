---
title: breadcrumb
notoc: true
description: >
  Page location navigation
---

Use `nav` with `aria-label="breadcrumb"` and slot attributes for list, item,
link, separator, and current page elements.

```html
<nav data-slot="breadcrumb" aria-label="breadcrumb">
  <ol data-slot="breadcrumb-list">
    <li data-slot="breadcrumb-item">
      <a data-slot="breadcrumb-link" href="#">Home</a>
    </li>
    <li data-slot="breadcrumb-separator" aria-hidden="true">/</li>
    <li data-slot="breadcrumb-item">
      <span data-slot="breadcrumb-page" aria-current="page">Docs</span>
    </li>
  </ol>
</nav>
```

## Example

{{< example src="examples/elements/breadcrumb.html" title="Breadcrumb example" height="160" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint re-exports the canonical `breadcrumb` TypeScript
implementation. It does not define separate behavior, state, accessibility, or
CSS APIs.

Read the [complete breadcrumb component reference]({{< relref
"/docs/components/breadcrumb" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
