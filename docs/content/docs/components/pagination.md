---
title: pagination
category: 'navigation'
description: >
  Page navigation links
---

Use `nav` with `aria-label="pagination"` and mark the current page with
`aria-current="page"`.

```html
<nav data-slot="pagination" aria-label="pagination">
  <ul data-slot="pagination-content">
    <li data-slot="pagination-item">
      <a data-slot="pagination-link" href="#">1</a>
    </li>
    <li data-slot="pagination-item">
      <a data-slot="pagination-link" aria-current="page" href="#">2</a>
    </li>
  </ul>
</nav>
```

## Example

{{< example src="examples/components/pagination.html" title="Pagination example" height="200" >}}

## Workflows

{{< example src="examples/components/pagination-workflows.html" title="Pagination workflow variants" height="720" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS once, load its stylesheet, and include the `ui` module in
your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This component's root directive is `[ng-pagination]`. Importing the package registers it with the AngularCSS `ui` module; there is no per-component JavaScript registration step.

## Anatomy

### Directive selectors

- `ng-pagination`
- `ng-pagination-content`
- `ng-pagination-ellipsis`
- `ng-pagination-item`
- `ng-pagination-link`
- `ng-pagination-next`
- `ng-pagination-previous`

### Styling slots

- `[data-slot="pagination"]`
- `[data-slot="pagination-content"]`
- `[data-slot="pagination-ellipsis"]`
- `[data-slot="pagination-item"]`
- `[data-slot="pagination-link"]`
- `[data-slot="pagination-next"]`
- `[data-slot="pagination-previous"]`

Use a native `nav` containing a `ul` or `ol` with direct `li` children. Page, previous, and next controls remain native links. Ellipsis is optional. Compose rows-per-page controls beside Pagination with existing native form components; Pagination does not own that model.
Use the named slots as stable Tailwind and CSS selectors.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `aria-current` | Input | Current item or date state. |
| `aria-disabled` | Input | Semantic disabled state. |
| `aria-label` | Input | Accessible name when visible text is insufficient. |
| `data-active` | Input | Stable component state or styling hook. |
| `dir` | Input | Text and interaction direction: `ltr` or `rtl`. |
| `role` | Input | Explicit semantic role when native HTML does not provide one. |

`Input` attributes are read from authored HTML. `Output` attributes are maintained by AngularCSS for CSS and testing. `Input/output` attributes may be authored for a controlled initial state and are then synchronized by the directive.

### CSS custom properties

This directive does not write component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

The directive preserves native navigation, list, list-item, and link semantics while synchronizing authored `aria-current`, `data-active`, `aria-disabled`, and dynamically inserted controls into stable state hooks. Native links own navigation; URLs, routing, page counts, rows-per-page values, and current-page application state remain AngularTS or application concerns.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Use a native `nav` landmark with an accessible label, a native list, and native links. Expose exactly one current destination with `aria-current="page"`. Previous and next links need destination-specific accessible names; ellipsis is decorative and removed from the accessibility tree.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target `[ng-pagination]`, the documented `data-slot` selectors, and generated `data-*` states from Tailwind or ordinary CSS. Keep behavior and accessible state in the TypeScript directive; visual choices belong in the application stylesheet.

Read [Styling with Tailwind]({{< relref
"/docs/get-started/styling-tailwind" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
