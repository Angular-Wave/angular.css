---
title: breadcrumb
category: 'navigation'
description: >
  Page location navigation
---

Use `nav` with `aria-label="breadcrumb"` and slot attributes for list, item,
link, separator, and current page elements.

```html
<nav data-slot="breadcrumb" aria-label="breadcrumb">
  <ol data-slot="breadcrumb-list">
    <li data-slot="breadcrumb-item">
      <a data-slot="breadcrumb-link" href="#">Home</a>
    </li>
    <li data-slot="breadcrumb-separator" aria-hidden="true">/</li>
    <li data-slot="breadcrumb-item">
      <span data-slot="breadcrumb-page" aria-current="page">Docs</span>
    </li>
  </ol>
</nav>
```

## Example

{{< example src="examples/components/breadcrumb.html" title="Breadcrumb example" height="160" >}}

## Variants And Composition

Empty separator and ellipsis slots receive their standard icons. Author custom
separator content directly, and compose dropdowns with the existing semantic
Dropdown component.

{{< example src="examples/components/breadcrumb-workflows.html" title="Breadcrumb variants and composition" height="1024" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS once, load its stylesheet, and include the `ui` module in
your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This is a styling-only HTML element or pattern. AngularCSS registers no runtime directive for it. Native navigation, lists, links, and authored aria-current are sufficient.

## Anatomy

### Root styling selector

- `data-slot="breadcrumb"`

### Styling slots

- `[data-slot="breadcrumb"]`
- `[data-slot="breadcrumb-ellipsis"]`
- `[data-slot="breadcrumb-item"]`
- `[data-slot="breadcrumb-link"]`
- `[data-slot="breadcrumb-list"]`
- `[data-slot="breadcrumb-page"]`
- `[data-slot="breadcrumb-separator"]`

Slots are optional unless the usage example or behavior description identifies a required relationship.
Use the named slots as stable Tailwind and CSS selectors.

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

The directive supplies navigation semantics and keyboard state where required. URLs, routing, current-page state, and navigation side effects remain application-owned.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Use semantic navigation landmarks and links. Expose the current destination with `aria-current` and keep keyboard order consistent with visual order.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target semantic elements, styling slots, native state selectors, and authored ARIA attributes from Tailwind or ordinary CSS. Behavior and accessible state remain with native HTML and AngularTS; visual choices belong in the application stylesheet.

Read [Styling with Tailwind]({{< relref
"/docs/get-started/styling-tailwind" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
