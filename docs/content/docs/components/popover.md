---
title: popover
category: 'overlay'
description: >
  Floating rich content panels
---

Connect a native button to semantic popover content with `popovertarget` and
`popover`. The browser owns top-layer rendering, Escape, and light dismissal.

```html
<span class="popover">
  <button popovertarget="dimensions">Open</button>
  <aside id="dimensions" popover class="popover-content">Content</aside>
</span>
```

## Example

{{< example src="examples/components/popover.html" title="Popover example" height="390" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS once, load its stylesheet, and include the `ui` module in
your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This is a styling-only HTML element or pattern. AngularCSS registers no runtime directive for it. The Popover API owns disclosure, top-layer rendering, and light dismissal.

## Anatomy

### Root styling selector

- `.popover`

### Semantic structure

Connect a native button's `popovertarget` to one element with the matching `id` and `popover`. Header, title, and description selectors are optional styling hooks. Use native form controls inside the content; AngularTS owns their values and validation.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `data-align` | Input | Stable component state or styling hook. |
| `data-side` | Input | Stable component state or styling hook. |
| `popover` | Input | Authored option or semantic HTML attribute observed by the directive. |
| `popovertarget` | Input | Authored option or semantic HTML attribute observed by the directive. |

Attributes remain authored HTML, native state, or AngularTS inputs. AngularCSS does not write element state.

### CSS custom properties

This styling hook does not define component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

The native Popover API owns non-modal disclosure, top-layer rendering, outside pointer dismissal, and Escape closure. `popovertarget` connects the invoker to the `popover` element. AngularTS remains responsible for authored content, form values, and application state.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Use a native button invoker and give the popover content a useful accessible name when its context is not otherwise clear. Escape and pointer light-dismiss are browser behavior; add `autofocus` only when moving focus into the content is appropriate.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target semantic elements, native state selectors, and component classes from Tailwind or ordinary CSS. Behavior and accessible state remain with native HTML and AngularTS; visual choices belong in the application stylesheet.

Read [Styling with Tailwind]({{< relref
"/docs/get-started/styling-tailwind" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
