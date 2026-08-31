---
title: Styling with Tailwind
weight: 40
description:
  Customize AngularCSS with Tailwind utilities, Radix color tokens, slots, and
  state selectors.
---

AngularCSS ships a usable visual baseline, but its public styling contract is
made for application overrides. Target semantic roots, named `data-slot`
elements, and generated state attributes from Tailwind or ordinary CSS.

## Load order

Compile Tailwind first, AngularCSS second, and application overrides last:

```css
@import 'tailwindcss';
@import '@angular-wave/angular.css/dist/angular.css';

@layer components {
  [ng-card] {
    @apply border-slate-200 bg-white;
  }
}
```

The documentation iframes follow the same order: Tailwind preflight, AngularCSS,
then demo-specific CSS. This prevents Docsy or another host framework from
changing component box sizing, typography, buttons, and form controls.

## Root selectors

Use directive selectors for component-wide changes:

```css
[ng-button] {
  @apply font-semibold;
}

[ng-button][size='lg'] {
  @apply h-11 px-6;
}
```

The component reference lists the exact root directive for every component.

## Slots

Complex components expose named parts without rendering a hidden template:

```css
[ng-dialog] [data-slot='dialog-content'] {
  @apply max-w-xl;
}

[ng-dialog] [data-slot='dialog-footer'] {
  @apply justify-between;
}
```

Slots remain stable selectors even when you add application classes or nested
content.

## State attributes

Directives mirror behavior into `data-*` and ARIA attributes:

```css
[ng-tabs-trigger][aria-selected='true'] {
  @apply border-slate-900 text-slate-950;
}

[data-slot='combobox-item'][data-highlighted='true'] {
  @apply bg-slate-100;
}
```

Prefer these public states to selectors based on child position or generated
IDs.

## Design tokens

AngularCSS maps Radix colors into semantic custom properties. Override semantic
tokens instead of changing each component:

```css
:root {
  --primary: var(--blue-11);
  --primary-foreground: var(--blue-1);
  --border: var(--slate-7);
  --ring: var(--blue-8);
  --radius: 0.375rem;
}
```

Available groups include background, foreground, card, popover, primary,
secondary, muted, accent, info, success, warning, error, border, input, ring,
chart, and sidebar tokens.

## Dark mode

Add the `dark` class to an ancestor. AngularCSS supplies dark Radix scales and
uses logical properties where direction matters:

```html
<body class="dark">
  <button ng-button>Continue</button>
</body>
```

## Preserve behavior

CSS may change spacing, color, typography, borders, and animation. Do not hide a
focused element, remove visible focus, reorder keyboard controls independently
of DOM order, or override `hidden` and ARIA-driven visibility without an
equivalent accessible interaction.

## Next step

Use the [component catalog]({{< relref "/docs/components" >}}) to find each
component's selectors, states, CSS variables, and live source.
