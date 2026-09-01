---
title: alert-dialog
category: 'overlay'
description: >
  Confirmation dialog structure
---

Use alert dialog parts for destructive or confirmation flows that need a clear
action and cancel target.

```html
<section id="delete-dialog" ng-alert-dialog class="alert-dialog">
  <button class="alert-dialog-trigger button">Delete project</button>
  <div class="alert-dialog-overlay"></div>
  <dialog data-size="default" class="alert-dialog-content">
    <h2 class="alert-dialog-title">Delete project?</h2>
  </dialog>
</section>
```

## Example

{{< example src="examples/components/alert-dialog.html" title="Alert dialog example" height="420" >}}

## Sizes And Composition

{{< example src="examples/components/alert-dialog-workflows.html" title="Alert dialog sizes and composition" height="480" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS once, load its stylesheet, and include the `ui` module in
your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This component's root directive is `[ng-alert-dialog]`. Importing the package registers it with the AngularCSS `ui` module; there is no per-component JavaScript registration step.

## Anatomy

### Directive selectors

- `ng-alert-dialog`

### Semantic structure

Use native elements for authored structure. Component classes are optional visual hooks when an HTML relationship is not specific enough.

## API

### Attributes and state

This component has no directive-specific attributes beyond its semantic HTML.

`Input` attributes are read from authored HTML. `Output` attributes are maintained by AngularCSS for CSS and testing. `Input/output` attributes may be authored for a controlled initial state and are then synchronized by the directive.

### CSS custom properties

This directive does not write component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

The directive owns overlay disclosure, escape and outside-click closure, focus trapping where modal, and focus restoration. The application owns the content and the state that opens the overlay.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Provide a visible title and description when the overlay needs context. Modal overlays trap focus, close on Escape, and restore focus to their trigger.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target `[ng-alert-dialog]`, semantic descendants, component classes, and generated state from Tailwind or ordinary CSS. Keep behavior and accessible state in the TypeScript directive; visual choices belong in the application stylesheet.

Read [Styling with Tailwind]({{< relref
"/docs/get-started/styling-tailwind" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
