---
title: checkbox
notoc: true
description: >
  Native checkbox control
---

Use a native checkbox input with `class="checkbox"`, preserving form behavior
and label association.

```html
<div orientation="horizontal" class="field">
  <input id="terms" type="checkbox" ng-model="terms" class="checkbox" />
  <label for="terms">Accept terms and conditions</label>
</div>
<span>Accepted: <span ng-bind="terms"></span></span>
```

## Example

{{< example src="examples/elements/checkbox.html" title="Checkbox example" height="190" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint exports no runtime behavior. Native HTML, CSS, and AngularTS own the complete contract.

Read the [complete checkbox component reference]({{< relref
"/docs/components/checkbox" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
