---
title: input
category: 'form'
description: >
  Native form text entry with a styling-only AngularCSS hook.
---

Use `data-input` as the opt-in styling hook. The browser and AngularTS own the
value, events, validation, required state, disabled state, and form behavior;
AngularCSS does not register an Input directive or mirror those values.

```html
<input data-input placeholder="Jane Doe" />
<input data-input placeholder="Disabled" disabled />
```

## Example

{{< example src="examples/components/input.html" title="Input examples" height="220" >}}

## Workflows

{{< example src="examples/components/input-workflows.html" title="Input workflows" height="1900" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS once, load its stylesheet, and include the `ui` module in
your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This component is styling-only and uses the `[data-input]` hook on a native HTML element. AngularCSS registers no runtime directive for it.

## Anatomy

### Root styling selector

- `data-input`

### Styling slots

- `[data-slot="input"]`

Slots are optional unless the usage example or behavior description identifies a required relationship.
Use the named slots as stable Tailwind and CSS selectors.

## API

### Attributes and state

This component has no directive-specific attributes beyond its semantic HTML.

`Input` attributes remain native HTML or AngularTS inputs. AngularCSS does not write component state.

### CSS custom properties

This styling hook does not define component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

Input is a styling-only native HTML component selected by `data-input`. AngularTS and the browser own the value, input events, model synchronization, validation, disabled state, required state, and form submission. AngularCSS registers no Input directive and does not mirror or replace that state.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Use a native input with a visible label. Preserve native type, name, autocomplete, required, disabled, and validation semantics; use AngularTS `ng-model` for application state and `aria-invalid` when application validation must be exposed explicitly.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target `[data-input]`, native state selectors, and authored ARIA attributes from Tailwind or ordinary CSS. Behavior and accessible state remain with native HTML and AngularTS; visual choices belong in the application stylesheet.

Read [Styling with Tailwind]({{< relref
"/docs/get-started/styling-tailwind" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
