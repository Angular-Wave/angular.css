---
title: scroll-area
category: 'layout'
description: >
  Scrollable content area that exposes viewport state
---

Use `ng-scroll-area` with a focusable `.scroll-area-viewport` child. The parent
directive inspects its descendants; child directives are not required.

```html
<div ng-scroll-area>
  <div class="scroll-area-viewport">
    <p>Scrollable content goes here.</p>
  </div>
</div>
```

The directive sets `data-scrollable-*` and `data-scroll-*` state on the root
element so your style layer can respond to overflow and position. It also
mirrors top and bottom boundaries and RTL direction. Native scrolling remains
the source of truth. Optional `scroll-area-scrollbar` and `scroll-area-thumb`
parts mirror the native position and support pointer dragging; the viewport
retains keyboard, wheel, and touch scrolling.

Horizontal examples use wide content inside the same viewport. Add `dir="rtl"`
to either the root or viewport for RTL content; no separate scrolling model is
introduced.

## Example

{{< example src="examples/components/scroll-area.html" title="Scroll area example" height="300" >}}

## Workflows

{{< example src="examples/components/scroll-area-workflows.html" title="Scroll area layout and state workflows" height="1260" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS once, load its stylesheet, and include the `ui` module in
your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This component's root directive is `[ng-scroll-area]`. Importing the package registers it with the AngularCSS `ui` module; there is no per-component JavaScript registration step.

## Anatomy

### Directive selectors

- `ng-scroll-area`

### Semantic structure

Use native elements for authored structure. Component classes are optional visual hooks when an HTML relationship is not specific enough.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `aria-hidden` | Output | ARIA relationship or state. |
| `aria-label` | Input/output | Accessible name when visible text is insufficient. |
| `data-direction` | Output | Stable component state or styling hook. |
| `data-offset` | Output | Stable component state or styling hook. |
| `data-orientation` | Input/output | Stable component state or styling hook. |
| `data-scroll-at-bottom` | Output | Stable component state or styling hook. |
| `data-scroll-at-top` | Output | Stable component state or styling hook. |
| `data-scroll-left` | Output | Stable component state or styling hook. |
| `data-scroll-top` | Output | Stable component state or styling hook. |
| `data-scrollable-x` | Input/output | Stable component state or styling hook. |
| `data-scrollable-y` | Input/output | Stable component state or styling hook. |
| `data-size` | Output | Stable component state or styling hook. |
| `data-visible` | Output | Stable component state or styling hook. |
| `dir` | Input | Text and interaction direction: `ltr` or `rtl`. |
| `role` | Output | Explicit semantic role when native HTML does not provide one. |
| `tabindex` | Input/output | Keyboard focus order for composite descendants. |

`Input` attributes are read from authored HTML. `Output` attributes are maintained by AngularCSS for CSS and testing. `Input/output` attributes may be authored for a controlled initial state and are then synchronized by the directive.

### CSS custom properties

This directive does not write component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

The component owns layout-specific DOM relationships and CSS state only. Content, persistence, routing, and application state remain with the application.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Prefer semantic landmarks and native elements inside the layout. Any interactive handles or triggers must retain an accessible name and visible focus indicator.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target `[ng-scroll-area]`, semantic descendants, component classes, and generated state from Tailwind or ordinary CSS. Keep behavior and accessible state in the TypeScript directive; visual choices belong in the application stylesheet.

Read [Styling with Tailwind]({{< relref
"/docs/get-started/styling-tailwind" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
