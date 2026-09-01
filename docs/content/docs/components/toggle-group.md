---
title: toggle-group
category: 'action'
description: >
  Native radio or checkbox groups with a toggle-button presentation.
---

Use radios sharing a name for single selection, or checkboxes for independent
multiple selection.

```html
<fieldset variant="outline" class="toggle-group">
  <legend class="visually-hidden">Alignment</legend>
  <label class="toggle-group-item">
    <input type="radio" name="alignment" value="left" ng-model="alignment" />
    Left
  </label>
  <label class="toggle-group-item">
    <input type="radio" name="alignment" value="center" ng-model="alignment" />
    Center
  </label>
</fieldset>
```

## Example

{{< example src="examples/components/toggle-group.html" title="Toggle group example" height="180" >}}

## Workflows

{{< example src="examples/components/toggle-group-workflows.html" title="Toggle group state and layout workflows" height="1260" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS once, load its stylesheet, and include the `ui` module in
your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This is a styling-only HTML element or pattern. AngularCSS registers no runtime directive for it. Native radio and checkbox groups own single or multiple selection, focus, keyboard behavior, and forms.

## Anatomy

### Root styling selector

- `.toggle-group`

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

Toggle Group is a styling-only native `fieldset`: use radios sharing a `name` for single selection and checkboxes for multiple selection. The browser owns selection, arrow-key radio navigation, disabled state, focus, validation, and form submission; AngularTS `ng-model` owns application state. AngularCSS registers no toggle-group directive.

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
