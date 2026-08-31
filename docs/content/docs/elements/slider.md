---
title: slider
notoc: true
description: >
  Native range input
---

Use native `input[type="range"]` for single-value sliders. Compose several
native range inputs inside an `ng-slider` container for multi-thumb ranges;
AngularTS continues to own each input model.

```html
<label ng-label for="volume">Volume</label>
<input ng-slider id="volume" type="range" min="0" max="100" ng-model="volume" />
<span>Volume: <span ng-bind="volume"></span></span>
```

## Example

{{< example src="examples/elements/slider.html" title="Slider example" height="170" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint re-exports the canonical `slider` TypeScript
implementation. It does not define separate behavior, state, accessibility, or
CSS APIs.

Read the [complete slider component reference]({{< relref
"/docs/components/slider" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
