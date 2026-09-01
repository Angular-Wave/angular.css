---
title: avatar
category: 'media'
description: >
  User avatar, fallback, badge, and group primitives.
---

Use `.avatar` with a native image or authored fallback, plus an optional badge.
Wrap multiple avatars with `.avatar-group`.

```html
<span class="avatar" aria-label="Jane Doe">
  <span class="avatar-fallback">JD</span>
  <span class="avatar-badge"></span>
</span>

<span class="avatar-group">
  <span class="avatar"><img src="avatar.jpg" alt="Alex Brown" /></span>
  <span class="avatar-group-count">+3</span>
</span>
```

## Example

{{< example src="examples/components/avatar.html" title="Avatar example" height="180" >}}

## Variants And Composition

Use `size="sm"`, the default size, or `size="lg"`. Badge icons, grouped counts,
RTL layouts, and dropdown triggers compose from the same semantic parts without
changing Avatar behavior.

{{< example src="examples/components/avatar-workflows.html" title="Avatar variants and composition" height="620" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS once, load its stylesheet, and include the `ui` module in
your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This is a styling-only HTML element or pattern. AngularCSS registers no runtime directive for it. Native images, alternative text, authored fallback content, and CSS provide the contract.

## Anatomy

### Root styling selector

- `.avatar`

### Semantic structure

Apply `.avatar` to a wrapper containing either an image or authored fallback content. Badges are optional. Use `.avatar-group` for several avatars and `.avatar-group-count` for a remaining count.

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

Avatar is a styling-only authored HTML pattern. Native `img` loading and alternative text remain browser behavior; use a fallback-only avatar when no image is available, or AngularTS structural directives when application state chooses between sources.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Give meaningful portrait images useful alternative text. Give fallback-only avatars an accessible name when initials are ambiguous, and keep decorative status badges out of repeated announcements.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target semantic elements, native state selectors, and component classes from Tailwind or ordinary CSS. Behavior and accessible state remain with native HTML and AngularTS; visual choices belong in the application stylesheet.

Read [Styling with Tailwind]({{< relref
"/docs/get-started/styling-tailwind" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
