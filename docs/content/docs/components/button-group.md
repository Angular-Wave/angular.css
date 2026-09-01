---
title: button-group
category: 'action'
description: >
  Layout primitive for visually connected buttons and form controls.
---

Use `fieldset.button-group` around related commands or form controls. Set
`orientation="vertical"` for stacked groups. Use Toggle Group when the controls
represent one or more selectable values.

```html
<fieldset class="button-group">
  <button class="button">One</button>
  <span class="button-group-separator"></span>
  <button class="button">Two</button>
</fieldset>
```

## Example

{{< example src="examples/components/button-group.html" title="Button group examples" height="480" >}}

## Composition Workflows

Button groups can connect nested groups, inputs, input groups, Select, Dropdown,
and Popover triggers. Each composed component retains its own behavior and
application state.

{{< example src="examples/components/button-group-workflows.html" title="Button group composition workflows" height="1800" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS once, load its stylesheet, and include the `ui` module in
your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This is a styling-only HTML element or pattern. AngularCSS registers no runtime directive for it. Authored group semantics and CSS provide the complete contract.

## Anatomy

### Root styling selector

- `.button-group`

### Semantic structure

Use native elements for authored structure. Component classes are optional visual hooks when an HTML relationship is not specific enough.

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

The directive mirrors interaction state for styling and supplies only the keyboard behavior required by the component contract. Application commands and business state remain in AngularTS expressions.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Use a native `button` whenever the control performs an action. Keep an accessible name, preserve visible focus, and use `disabled` for unavailable native controls.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target semantic elements, native state selectors, and component classes from Tailwind or ordinary CSS. Behavior and accessible state remain with native HTML and AngularTS; visual choices belong in the application stylesheet.

Read [Styling with Tailwind]({{< relref
"/docs/get-started/styling-tailwind" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
