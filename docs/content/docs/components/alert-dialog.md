---
title: alert-dialog
category: 'overlay'
description: >
  Confirmation dialog structure
---

Use alert dialog parts for destructive or confirmation flows that need a clear
action and cancel target.

```html
<section class="alert-dialog">
  <button commandfor="delete-dialog" command="show-modal">Delete project</button>
  <dialog id="delete-dialog" closedby="closerequest" class="alert-dialog-content">
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

This is a styling-only HTML element or pattern. AngularCSS registers no runtime directive for it. Native dialog and declarative invoker commands provide modal behavior.

## Anatomy

### Root styling selector

- `.alert-dialog`

### Semantic structure

Use `.alert-dialog` as an optional composition wrapper, a native button with `command=show-modal`, and `dialog.alert-dialog-content`. Close controls use `command=close`; no overlay element or nested AngularCSS attributes are required.

## API

### Attributes and state

This component has no directive-specific attributes beyond its semantic HTML.

Attributes remain authored HTML, native state, or AngularTS inputs. AngularCSS does not write element state.

### CSS custom properties

This styling hook does not define component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

A native `dialog` opened with `command=show-modal` owns top-layer rendering, modal focus, Escape, background isolation, and trigger focus restoration. Use `closedby=closerequest` when pointer light-dismiss must be disabled. AngularCSS registers no alert-dialog directive.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Connect the native dialog to a concise title and consequence description with `aria-labelledby` and `aria-describedby`. Put the least destructive action first in focus order and use `closedby=closerequest` when outside dismissal would be unsafe.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target semantic elements, native state selectors, and component classes from Tailwind or ordinary CSS. Behavior and accessible state remain with native HTML and AngularTS; visual choices belong in the application stylesheet.

Read [Styling with Tailwind]({{< relref
"/docs/get-started/styling-tailwind" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
