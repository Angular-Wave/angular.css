---
title: kbd
notoc: true
description: >
  Keyboard shortcut hint
---

Use native `kbd` elements with `data-slot="kbd"`. Group shortcuts with
`data-slot="kbd-group"`.

```html
<span data-slot="kbd-group">
  <kbd data-slot="kbd">Ctrl</kbd>
  <kbd data-slot="kbd">K</kbd>
</span>
```

## Example

{{< example src="examples/elements/kbd.html" title="Kbd example" height="150" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint re-exports the canonical `kbd` TypeScript
implementation. It does not define separate behavior, state, accessibility, or
CSS APIs.

Read the [complete kbd component reference]({{< relref
"/docs/components/kbd" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
