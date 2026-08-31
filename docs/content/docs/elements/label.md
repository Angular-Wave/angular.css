---
title: label
notoc: true
description: >
  Native form label
---

Use native `label` elements with `for` whenever possible. AngularCSS styles
opt-in `ng-label` labels and supports `data-slot="label"` for explicit slot
markup.

```html
<label ng-label for="email">Email</label>
<input data-input id="email" type="email" placeholder="Email" />
```

## Example

{{< example src="examples/elements/label.html" title="Label example" height="180" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint re-exports the canonical `label` TypeScript
implementation. It does not define separate behavior, state, accessibility, or
CSS APIs.

Read the [complete label component reference]({{< relref
"/docs/components/label" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
