---
title: pagination
notoc: true
description: >
  Page navigation links
---

Use `nav` with `aria-label="pagination"` and mark the current page with
`aria-current="page"`.

```html
<nav data-slot="pagination" aria-label="pagination">
  <ul data-slot="pagination-content">
    <li data-slot="pagination-item">
      <a data-slot="pagination-link" href="#">1</a>
    </li>
    <li data-slot="pagination-item">
      <a data-slot="pagination-link" aria-current="page" href="#">2</a>
    </li>
  </ul>
</nav>
```

## Example

{{< example src="examples/elements/pagination.html" title="Pagination example" height="160" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint re-exports the canonical `pagination` TypeScript
implementation. It does not define separate behavior, state, accessibility, or
CSS APIs.

Read the [complete pagination component reference]({{< relref
"/docs/components/pagination" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
