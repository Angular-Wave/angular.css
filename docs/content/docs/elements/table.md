---
title: table
notoc: true
description: >
  Semantic data table
---

Use native table elements with slot attributes for styling hooks.

```html
<div data-slot="table-container">
  <table data-slot="table">
    <thead data-slot="table-header">
      <tr data-slot="table-row">
        <th data-slot="table-head">Invoice</th>
      </tr>
    </thead>
  </table>
</div>
```

## Example

{{< example src="examples/elements/table.html" title="Table example" height="340" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint re-exports the canonical `table` TypeScript
implementation. It does not define separate behavior, state, accessibility, or
CSS APIs.

Read the [complete table component reference]({{< relref
"/docs/components/table" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
