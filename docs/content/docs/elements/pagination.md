---
title: pagination
notoc: true
description: >
  Page navigation links
---

Use `nav` with `aria-label="pagination"` and mark the current page with
`aria-current="page"`.

```html
<nav aria-label="pagination" class="pagination">
  <ul class="pagination-content">
    <li class="pagination-item">
      <a href="#" class="pagination-link">1</a>
    </li>
    <li class="pagination-item">
      <a aria-current="page" href="#" class="pagination-link">2</a>
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
