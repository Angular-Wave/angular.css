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
  <ul>
    <li>
      <a href="#">1</a>
    </li>
    <li>
      <a aria-current="page" href="#">2</a>
    </li>
  </ul>
</nav>
```

## Example

{{< example src="examples/elements/pagination.html" title="Pagination example" height="160" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint exports no runtime behavior. Native HTML, CSS, and AngularTS own the complete contract.

Read the [complete pagination component reference]({{< relref
"/docs/components/pagination" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
