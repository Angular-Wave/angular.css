---
title: accordion
category: 'disclosure'
description: >
  Expandable content sections
---

Use `ng-accordion` on a container whose direct children contain a heading with a
button followed by a panel.

```html
<div ng-accordion>
  <div data-slot="accordion-item">
    <h3>
      <button data-slot="accordion-trigger">
        Section 1
        <svg data-slot="accordion-trigger-icon" aria-hidden="true"></svg>
      </button>
    </h3>
    <div data-slot="accordion-content">Content for section 1</div>
  </div>
</div>
```

Set `multiple` or `type="multiple"` to allow more than one section to remain
open.

## Example

{{< example src="examples/components/accordion.html" title="Accordion example" height="330" >}}

## State Variants

{{< example src="examples/components/accordion-state-workflows.html" title="Accordion state variants" height="800" >}}

## Layout Variants

{{< example src="examples/components/accordion-layout-workflows.html" title="Accordion layout variants" height="1024" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS once, load its stylesheet, and include the `ui` module in
your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This component's root directive is `[ng-accordion]`. Importing the package registers it with the AngularCSS `ui` module; there is no per-component JavaScript registration step.

## Anatomy

### Directive selectors

- `ng-accordion`
- `ng-accordion-item`

### Styling slots

- `[data-slot="accordion"]`
- `[data-slot="accordion-content"]`
- `[data-slot="accordion-header"]`
- `[data-slot="accordion-item"]`
- `[data-slot="accordion-panel"]`
- `[data-slot="accordion-trigger"]`
- `[data-slot="accordion-trigger-icon"]`

Slots are optional unless the usage example or behavior description identifies a required relationship.
Use the named slots as stable Tailwind and CSS selectors.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `aria-controls` | Output | ARIA relationship or state. |
| `aria-disabled` | Input | Semantic disabled state. |
| `aria-expanded` | Input/output | Open or expanded state exposed to assistive technology. |
| `aria-hidden` | Output | ARIA relationship or state. |
| `aria-labelledby` | Output | ARIA relationship or state. |
| `data-disabled` | Input | Stable component state or styling hook. |
| `data-open` | Input/output | Stable component state or styling hook. |
| `data-state` | Input/output | Stable component state or styling hook. |
| `data-type` | Input | Stable component state or styling hook. |
| `disabled` | Input | Disables native or component interaction. |
| `multiple` | Input | Allows more than one item to remain selected or open. |
| `role` | Output | Explicit semantic role when native HTML does not provide one. |
| `type` | Input | Component or native behavior variant. |

`Input` attributes are read from authored HTML. `Output` attributes are maintained by AngularCSS for CSS and testing. `Input/output` attributes may be authored for a controlled initial state and are then synchronized by the directive.

### CSS custom properties

This directive does not write component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

The directive owns disclosure keyboard and open-state synchronization. The content itself and any application state inside a panel remain ordinary HTML and AngularTS scope state.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Triggers and panels are connected with `aria-controls` and `aria-labelledby`. Expanded and hidden state is synchronized as the disclosure changes.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target `[ng-accordion]`, the documented `data-slot` selectors, and generated `data-*` states from Tailwind or ordinary CSS. Keep behavior and accessible state in the TypeScript directive; visual choices belong in the application stylesheet.

Read [Styling with Tailwind]({{< relref
"/docs/get-started/styling-tailwind" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
