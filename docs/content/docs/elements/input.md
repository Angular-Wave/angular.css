---
title: input
notoc: true
description: >
  Native text input element
---

Use native `input` elements for text-like controls. AngularCSS styles controls
that opt in with `class="input"`.

```html
<input id="email" type="email" placeholder="Email" ng-model="email" class="input" />
<span>Value: <span ng-bind="email"></span></span>
<input id="invalid-email" aria-invalid="true" placeholder="Email" class="input" />
<input id="avatar" type="file" class="input" />
```

## Example

{{< example src="examples/elements/input.html" title="Input example" height="340" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint exports no runtime behavior. Native HTML, CSS, and AngularTS own the complete contract.

Read the [complete input component reference]({{< relref
"/docs/components/input" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
