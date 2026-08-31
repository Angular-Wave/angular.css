---
title: input
notoc: true
description: >
  Native text input element
---

Use native `input` elements for text-like controls. AngularCSS styles opt-in
`data-input` controls and also supports `data-slot="input"` for explicit
slot-based markup.

```html
<input data-input id="email" type="email" placeholder="Email" ng-model="email" />
<span>Value: <span ng-bind="email"></span></span>
<input data-input id="invalid-email" aria-invalid="true" placeholder="Email" />
<input data-input id="avatar" type="file" />
```

## Example

{{< example src="examples/elements/input.html" title="Input example" height="340" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint re-exports the canonical `input` TypeScript
implementation. It does not define separate behavior, state, accessibility, or
CSS APIs.

Read the [complete input component reference]({{< relref
"/docs/components/input" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
