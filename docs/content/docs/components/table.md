---
title: table
category: 'data display'
description: >
  Semantic data table
---

Use native table elements with slot attributes for styling hooks.

```html
<div data-slot="table-container">
  <table data-slot="table">
    <thead data-slot="table-header">
      <tr data-slot="table-row">
        <th data-slot="table-head">Invoice</th>
      </tr>
    </thead>
  </table>
</div>
```

## Example

{{< example src="examples/components/table.html" title="Table example" height="340" >}}

## Workflows

{{< example src="examples/components/table-workflows.html" title="Table workflows" height="2400" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS once, load its stylesheet, and include the `ui` module in
your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This component's root directive is `[ng-table]`. Importing the package registers it with the AngularCSS `ui` module; there is no per-component JavaScript registration step.

## Anatomy

### Directive selectors

- `ng-table`

### Styling slots

- `[data-slot="table"]`
- `[data-slot="table-body"]`
- `[data-slot="table-caption"]`
- `[data-slot="table-cell"]`
- `[data-slot="table-container"]`
- `[data-slot="table-footer"]`
- `[data-slot="table-head"]`
- `[data-slot="table-row"]`

Slots are optional unless the usage example or behavior description identifies a required relationship.
Use the named slots as stable Tailwind and CSS selectors.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `data-column-count` | Output | Stable component state or styling hook. |
| `data-row-count` | Output | Stable component state or styling hook. |
| `scope` | Input/output | Authored option or semantic HTML attribute observed by the directive. |

`Input` attributes are read from authored HTML. `Output` attributes are maintained by AngularCSS for CSS and testing. `Input/output` attributes may be authored for a controlled initial state and are then synchronized by the directive.

### CSS custom properties

This directive does not write component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

AngularCSS provides semantic structure and styling hooks. Data loading, formatting, sorting, visualization, and application state remain outside the component.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Keep meaningful labels and table or figure structure in authored HTML. Do not rely on color, position, or generated visual marks as the only representation of data.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target `[ng-table]`, the documented `data-slot` selectors, and generated `data-*` states from Tailwind or ordinary CSS. Keep behavior and accessible state in the TypeScript directive; visual choices belong in the application stylesheet.

Read [Styling with Tailwind]({{< relref
"/docs/get-started/styling-tailwind" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
