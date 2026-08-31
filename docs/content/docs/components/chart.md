---
title: chart
category: 'data display'
description: >
  HTML-first chart container, legend, axis, and tooltip primitives
---

Use Chart to frame application-rendered HTML, SVG, canvas, or a locally bundled
chart library with a consistent container, axis, legend, and tooltip contract.
For simple authored HTML plots, `data-value` and `data-color` synchronize to
`--value` and `--chart-color`.

```html
<section ng-chart aria-label="Monthly visitors">
  <div data-slot="chart-plot">
    <div data-slot="chart-grid"></div>
    <div data-slot="chart-bar-groups">
      <div data-slot="chart-bar-group">
        <span
          data-slot="chart-bar"
          data-label="January desktop"
          data-value="72%"
          data-color="var(--chart-1)"
        ></span>
      </div>
    </div>
  </div>
  <div data-slot="chart-axis"><span data-slot="chart-axis-item">Jan</span></div>
</section>
```

AngularCSS does not implement a chart engine. Plotting, scales, data,
formatting, hover selection, and active-series state remain with authored HTML,
the application's selected chart library, and AngularTS. This keeps Chart from
covering AngularTS application behavior while providing stable semantic and
Tailwind hooks.

## Example

{{< example src="examples/components/chart.html" title="Basic grouped bar chart" height="360" >}}

## Axis, grid, tooltip, and legend

{{< example src="examples/components/chart-workflows.html" title="Chart composition workflows" height="1280" >}}

## Interactive, RTL, and tooltip variants

{{< example src="examples/components/chart-compositions.html" title="Chart reference compositions" height="1200" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS once, load its stylesheet, and include the `ui` module in
your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This component's root directive is `[ng-chart]`. Importing the package registers it with the AngularCSS `ui` module; there is no per-component JavaScript registration step.

## Anatomy

### Directive selectors

- `ng-chart`
- `ng-chart-axis`
- `ng-chart-axis-item`
- `ng-chart-bar`
- `ng-chart-grid`
- `ng-chart-legend`
- `ng-chart-legend-item`
- `ng-chart-swatch`
- `ng-chart-tooltip`
- `ng-chart-tooltip-indicator`
- `ng-chart-tooltip-item`
- `ng-chart-tooltip-items`

### Styling slots

- `[data-slot="chart"]`
- `[data-slot="chart-axis"]`
- `[data-slot="chart-axis-item"]`
- `[data-slot="chart-bar"]`
- `[data-slot="chart-bar-group"]`
- `[data-slot="chart-bar-groups"]`
- `[data-slot="chart-bars"]`
- `[data-slot="chart-description"]`
- `[data-slot="chart-grid"]`
- `[data-slot="chart-header"]`
- `[data-slot="chart-legend"]`
- `[data-slot="chart-legend-item"]`
- `[data-slot="chart-plot"]`
- `[data-slot="chart-swatch"]`
- `[data-slot="chart-title"]`
- `[data-slot="chart-tooltip"]`
- `[data-slot="chart-tooltip-indicator"]`
- `[data-slot="chart-tooltip-item"]`
- `[data-slot="chart-tooltip-items"]`
- `[data-slot="chart-tooltip-label"]`
- `[data-slot="chart-tooltip-name"]`
- `[data-slot="chart-tooltip-value"]`

The chart root requires an accessible name. Plot, bar, axis, grid, legend, and tooltip slots are optional composition primitives; place them inside the chart root so synchronized CSS properties and semantics apply.
Use the named slots as stable Tailwind and CSS selectors.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `aria-hidden` | Input/output | ARIA relationship or state. |
| `aria-label` | Input/output | Accessible name when visible text is insufficient. |
| `data-color` | Input | Stable component state or styling hook. |
| `data-direction` | Input/output | Stable component state or styling hook. |
| `data-label` | Input | Stable component state or styling hook. |
| `data-value` | Input | Stable component state or styling hook. |
| `data-visible` | Output | Stable component state or styling hook. |
| `dir` | Input | Text and interaction direction: `ltr` or `rtl`. |
| `role` | Input/output | Explicit semantic role when native HTML does not provide one. |

`Input` attributes are read from authored HTML. `Output` attributes are maintained by AngularCSS for CSS and testing. `Input/output` attributes may be authored for a controlled initial state and are then synchronized by the directive.

### CSS custom properties

- `--chart-color`
- `--value`

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

The directive synchronizes authored values and colors into CSS custom properties and supplies chart, axis, legend, bar, and tooltip semantics. Authored HTML, SVG, canvas, or an application-selected chart library owns plotting, scales, data, formatting, hover selection, and active-series state; AngularTS remains the source of truth for reactive application state.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Give every chart root a useful accessible name and provide a textual or tabular equivalent when exact values matter. Bars expose authored labels and values; axes and legends are lists; grid decoration is hidden; visible tooltips are status regions. Never use color as the only distinction between series.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target `[ng-chart]`, the documented `data-slot` selectors, and generated `data-*` states from Tailwind or ordinary CSS. Keep behavior and accessible state in the TypeScript directive; visual choices belong in the application stylesheet.

Read [Styling with Tailwind]({{< relref
"/docs/get-started/styling-tailwind" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
