---
title: radio-group
notoc: true
description: >
  Native radio option group
---

Use native radio inputs with a shared name inside a `fieldset` with a `legend`.

```html
<fieldset class="radio-group">
  <div orientation="horizontal" class="field">
    <input

      id="default"
      name="density"
      type="radio"
      value="default"
      ng-model="density"  class="radio-group-item"/>
    <label for="default" class="label">Default</label>
  </div>
</fieldset>
<span>Density: <span ng-bind="density"></span></span>
```

## Example

{{< example src="examples/elements/radio-group.html" title="Radio group example" height="230" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint re-exports the canonical `radio-group` TypeScript
implementation. It does not define separate behavior, state, accessibility, or
CSS APIs.

Read the [complete radio-group component reference]({{< relref
"/docs/components/radio-group" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
