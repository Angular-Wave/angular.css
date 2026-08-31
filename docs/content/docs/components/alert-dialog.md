---
title: alert-dialog
category: 'overlay'
description: >
  Confirmation dialog structure
---

Use alert dialog slots for destructive or confirmation flows that need a clear
action and cancel target.

```html
<section id="delete-dialog" ng-alert-dialog>
  <button ng-button data-slot="alert-dialog-trigger">Delete project</button>
  <div data-slot="alert-dialog-overlay"></div>
  <div data-slot="alert-dialog-content" data-size="default">
    <h2 data-slot="alert-dialog-title">Delete project?</h2>
  </div>
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
- `ng-alert-dialog-action`
- `ng-alert-dialog-cancel`
- `ng-alert-dialog-content`
- `ng-alert-dialog-description`
- `ng-alert-dialog-overlay`
- `ng-alert-dialog-title`
- `ng-alert-dialog-trigger`

### Styling slots

- `[data-slot="alert-dialog"]`
- `[data-slot="alert-dialog-action"]`
- `[data-slot="alert-dialog-cancel"]`
- `[data-slot="alert-dialog-content"]`
- `[data-slot="alert-dialog-description"]`
- `[data-slot="alert-dialog-footer"]`
- `[data-slot="alert-dialog-header"]`
- `[data-slot="alert-dialog-media"]`
- `[data-slot="alert-dialog-overlay"]`
- `[data-slot="alert-dialog-title"]`
- `[data-slot="alert-dialog-trigger"]`

Slots are optional unless the usage example or behavior description identifies a required relationship.
Use the named slots as stable Tailwind and CSS selectors.

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

Target `[ng-alert-dialog]`, the documented `data-slot` selectors, and generated `data-*` states from Tailwind or ordinary CSS. Keep behavior and accessible state in the TypeScript directive; visual choices belong in the application stylesheet.

Read [Styling with Tailwind]({{< relref
"/docs/get-started/styling-tailwind" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
