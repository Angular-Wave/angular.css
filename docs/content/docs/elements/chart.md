---
title: chart
notoc: true
description: >
  Chart layout and legend primitives
---

Use chart slots to frame application-rendered SVG, canvas, or HTML charts. Bars
can use `--value` and `--chart-color` for simple CSS-rendered examples.

```html
<section data-slot="chart">
  <div data-slot="chart-plot">
    <span data-slot="chart-bar" style="--value: 72%;"></span>
  </div>
</section>
```

## Example

{{< example src="examples/elements/chart.html" title="Chart example" height="360" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint re-exports the canonical `chart` TypeScript
implementation. It does not define separate behavior, state, accessibility, or
CSS APIs.

Read the [complete chart component reference]({{< relref
"/docs/components/chart" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
