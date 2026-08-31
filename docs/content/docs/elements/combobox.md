---
title: combobox
notoc: true
description: >
  Search input with selectable options
---

Compose comboboxes from a control, input, content, and option items.

```html
<div data-slot="combobox">
  <div data-slot="combobox-control">
    <input data-slot="input" role="combobox" />
  </div>
  <div data-slot="combobox-content" role="listbox">
    <div data-slot="combobox-item" role="option">AngularCSS</div>
  </div>
</div>
```

## Example

{{< example src="examples/elements/combobox.html" title="Combobox example" height="620" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint re-exports the canonical `combobox` TypeScript
implementation. It does not define separate behavior, state, accessibility, or
CSS APIs.

Read the [complete combobox component reference]({{< relref
"/docs/components/combobox" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
