---
title: hover-card
category: 'overlay'
description: >
  Rich hover preview cards
---

Use `ng-hover-card` with a keyboard-focusable trigger and preview content.
Pointer disclosure honors optional `open-delay` and `close-delay` values in
milliseconds. Set `side` on the content to `left`, `top`, `bottom`, or `right`.

```html
<span ng-hover-card open-delay="100" close-delay="100">
  <a ng-hover-card-trigger href="#">@angularcss</a>
  <span ng-hover-card-content side="bottom">Preview</span>
</span>
```

## Example

{{< example src="examples/components/hover-card.html" title="Hover card example" height="260" >}}

## Physical sides

{{< example src="examples/components/hover-card-workflows.html" title="Hover card physical sides" height="1040" >}}

## Right-to-left

Physical `left` and `right` placement stays physical while text direction and
content alignment follow the nearest authored `dir` attribute.

{{< example src="examples/components/hover-card-rtl.html" title="Right-to-left hover cards" height="1040" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS once, load its stylesheet, and include the `ui` module in
your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This component's root directive is `[ng-hover-card]`. Importing the package registers it with the AngularCSS `ui` module; there is no per-component JavaScript registration step.

## Anatomy

### Directive selectors

- `ng-hover-card`
- `ng-hover-card-content`
- `ng-hover-card-trigger`

### Styling slots

- `[data-slot="hover-card"]`
- `[data-slot="hover-card-content"]`
- `[data-slot="hover-card-description"]`
- `[data-slot="hover-card-title"]`
- `[data-slot="hover-card-trigger"]`

A keyboard-focusable trigger and one preview content element are required. Title and description slots are optional semantic styling hooks inside the preview.
Use the named slots as stable Tailwind and CSS selectors.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `aria-controls` | Output | ARIA relationship or state. |
| `aria-expanded` | Output | Open or expanded state exposed to assistive technology. |
| `aria-hidden` | Output | ARIA relationship or state. |
| `close-delay` | Input | Pointer close delay in milliseconds. |
| `data-direction` | Output | Stable component state or styling hook. |
| `data-open` | Input/output | Stable component state or styling hook. |
| `data-side` | Input/output | Stable component state or styling hook. |
| `data-state` | Output | Stable component state or styling hook. |
| `dir` | Input | Text and interaction direction: `ltr` or `rtl`. |
| `open-delay` | Input | Pointer open delay in milliseconds. |
| `role` | Input/output | Explicit semantic role when native HTML does not provide one. |
| `side` | Input | Physical placement: `left`, `top`, `bottom`, or `right`. |

`Input` attributes are read from authored HTML. `Output` attributes are maintained by AngularCSS for CSS and testing. `Input/output` attributes may be authored for a controlled initial state and are then synchronized by the directive.

### CSS custom properties

This directive does not write component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

The directive owns delayed pointer and focus disclosure, physical side placement, Escape closure, and synchronized open state. It is non-modal and does not trap focus. Applications own preview content and may control the authored `data-open` attribute.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

The trigger exposes `aria-controls` and `aria-expanded`; the preview exposes its hidden state without becoming modal. Keep the trigger keyboard focusable, preserve readable content order, and do not place essential information only inside a hover card.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target `[ng-hover-card]`, the documented `data-slot` selectors, and generated `data-*` states from Tailwind or ordinary CSS. Keep behavior and accessible state in the TypeScript directive; visual choices belong in the application stylesheet.

Read [Styling with Tailwind]({{< relref
"/docs/get-started/styling-tailwind" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
