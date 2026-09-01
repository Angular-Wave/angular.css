---
title: popover
category: 'overlay'
description: >
  Floating rich content panels
---

Use a native button trigger and semantic content. Set `data-open="true"` when an
AngularTS controller should render the panel open.

```html
<span ng-popover>
  <button class="popover-trigger">Open</button>
  <aside side="bottom" class="popover-content">Content</aside>
</span>
```

## Example

{{< example src="examples/components/popover.html" title="Popover example" height="390" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS once, load its stylesheet, and include the `ui` module in
your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This component's root directive is `[ng-popover]`. Importing the package registers it with the AngularCSS `ui` module; there is no per-component JavaScript registration step.

## Anatomy

### Directive selectors

- `ng-popover`

### Semantic structure

A native button trigger and one content element are required. Header, title, and description selectors are optional semantic styling hooks. Use native form controls inside the content; AngularTS owns their values and validation.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `align` | Input | Cross-axis alignment: `start`, `center`, or `end`. |
| `aria-controls` | Output | ARIA relationship or state. |
| `aria-expanded` | Output | Open or expanded state exposed to assistive technology. |
| `aria-haspopup` | Output | ARIA relationship or state. |
| `aria-hidden` | Output | ARIA relationship or state. |
| `aria-modal` | Input/output | ARIA relationship or state. |
| `data-align` | Input/output | Stable component state or styling hook. |
| `data-direction` | Output | Stable component state or styling hook. |
| `data-open` | Input/output | Stable component state or styling hook. |
| `data-side` | Input/output | Stable component state or styling hook. |
| `data-state` | Output | Stable component state or styling hook. |
| `dir` | Input | Text and interaction direction: `ltr` or `rtl`. |
| `role` | Output | Explicit semantic role when native HTML does not provide one. |
| `side` | Input | Physical placement: `left`, `top`, `bottom`, or `right`. |
| `tabindex` | Input/output | Keyboard focus order for composite descendants. |

`Input` attributes are read from authored HTML. `Output` attributes are maintained by AngularCSS for CSS and testing. `Input/output` attributes may be authored for a controlled initial state and are then synchronized by the directive.

### CSS custom properties

This directive does not write component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

The directive owns non-modal disclosure, initial focus into the first interactive descendant, outside pointer and focus dismissal, Escape closure, focus restoration, physical side placement, and cross-axis alignment. It does not trap focus. AngularTS remains responsible for authored content, form values, and application state, including controlled `data-open` state.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Use a native button trigger and give the non-modal dialog an accessible name through a visible title or `aria-label`. Focus enters the first interactive descendant, outside focus and Escape dismiss the panel, and Escape restores trigger focus.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target `[ng-popover]`, semantic descendants, component classes, and generated state from Tailwind or ordinary CSS. Keep behavior and accessible state in the TypeScript directive; visual choices belong in the application stylesheet.

Read [Styling with Tailwind]({{< relref
"/docs/get-started/styling-tailwind" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
