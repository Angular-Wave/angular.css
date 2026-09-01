---
title: chart
notoc: true
description: >
  Chart layout and legend primitives
---

Use chart parts to frame application-rendered SVG, canvas, or HTML charts. Bars
can use `--value` and `--chart-color` for simple CSS-rendered examples.

```html
<section class="chart">
  <div class="chart-plot">
    <span style="--value: 72%;" class="chart-bar"></span>
  </div>
</section>
```

## Example

{{< example src="examples/elements/chart.html" title="Chart example" height="360" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint exports no runtime behavior. Native HTML, CSS, and AngularTS own the complete contract.

Read the [complete chart component reference]({{< relref
"/docs/components/chart" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
