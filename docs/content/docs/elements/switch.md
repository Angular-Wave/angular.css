---
title: switch
notoc: true
description: >
  Native checkbox rendered as a switch
---

Use a checkbox with `ng-switch-control` when you need switch ARIA and styling
hooks. Keep value ownership with native HTML and AngularTS `ng-model`.

```html
<div data-slot="field" orientation="horizontal">
  <input
    ng-switch-control
    id="airplane-mode"
    type="checkbox"
    ng-model="airplaneMode"
  />
  <label ng-label for="airplane-mode">Airplane Mode</label>
</div>
<span>Airplane mode: <span ng-bind="airplaneMode"></span></span>
```

## Example

{{< example src="examples/elements/switch.html" title="Switch example" height="210" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint re-exports the canonical `switch` TypeScript
implementation. It does not define separate behavior, state, accessibility, or
CSS APIs.

Read the [complete switch component reference]({{< relref
"/docs/components/switch" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
