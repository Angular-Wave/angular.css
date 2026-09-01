---
title: switch
notoc: true
description: >
  Native checkbox rendered as a switch
---

Use a checkbox with `class="switch"`. Keep value ownership with native HTML and
AngularTS `ng-model`.

```html
<div orientation="horizontal" class="field">
  <input

    id="airplane-mode"
    type="checkbox"
    ng-model="airplaneMode" class="switch" />
  <label for="airplane-mode" class="label">Airplane Mode</label>
</div>
<span>Airplane mode: <span ng-bind="airplaneMode"></span></span>
```

## Example

{{< example src="examples/elements/switch.html" title="Switch example" height="210" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint exports no runtime behavior. Native HTML, CSS, and AngularTS own the complete contract.

Read the [complete switch component reference]({{< relref
"/docs/components/switch" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
