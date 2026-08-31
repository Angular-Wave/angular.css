---
title: checkbox
notoc: true
description: >
  Native checkbox control
---

Use a native checkbox input with `ng-checkbox`, preserving form behavior and
label association.

```html
<div data-slot="field" orientation="horizontal">
  <input ng-checkbox id="terms" type="checkbox" ng-model="terms" />
  <label ng-label for="terms">Accept terms and conditions</label>
</div>
<span>Accepted: <span ng-bind="terms"></span></span>
```

## Example

{{< example src="examples/elements/checkbox.html" title="Checkbox example" height="190" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint re-exports the canonical `checkbox` TypeScript
implementation. It does not define separate behavior, state, accessibility, or
CSS APIs.

Read the [complete checkbox component reference]({{< relref
"/docs/components/checkbox" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
