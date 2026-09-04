---
title: table
category: 'data display'
description: >
  Semantic data table
---

Use native table elements with part classes for styling hooks.

```html
<figure>
  <table class="table">
    <thead>
      <tr>
        <th scope="col">Invoice</th>
      </tr>
    </thead>
  </table>
</figure>
```

## Example

{{< example src="examples/components/table.html" title="Table example" height="340" >}}

## Workflows

{{< example src="examples/components/table-workflows.html" title="Table workflows" height="2400" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS once, load its stylesheet, and include the `ui` module in
your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This is a styling-only HTML element or pattern. AngularCSS registers no runtime directive for it. Native table structure and authored header scopes provide the contract.

## Anatomy

### Root styling selector

- `.table`

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

AngularCSS provides semantic structure and styling hooks. Data loading, formatting, sorting, visualization, and application state remain outside the component.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Keep meaningful labels and table or figure structure in authored HTML. Do not rely on color, position, or generated visual marks as the only representation of data.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target semantic elements, native state selectors, and component classes from Tailwind or ordinary CSS. Behavior and accessible state remain with native HTML and AngularTS; visual choices belong in the application stylesheet.

Read [Styling with Tailwind]({{< relref
"/docs/get-started/styling-tailwind" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
