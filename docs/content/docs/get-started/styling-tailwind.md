---
title: Styling with Tailwind
weight: 40
description:
  Customize AngularCSS with Tailwind utilities, Radix color tokens, semantic
  parts, and state selectors.
---

AngularCSS ships a usable visual baseline, but its public styling contract is
made for application overrides. Target semantic roots, named `class`
elements, and generated state attributes from Tailwind or ordinary CSS.

## Load order

Compile Tailwind first, AngularCSS second, and application overrides last:

```css
@import 'tailwindcss';
@import '@angular-wave/angular.css/dist/angular.css';

@layer components {
  .card {
    @apply border-slate-200 bg-white;
  }
}
```

The documentation iframes follow the same order: Tailwind preflight, AngularCSS,
then demo-specific CSS. This prevents Docsy or another host framework from
changing component box sizing, typography, buttons, and form controls.

## Root selectors

Use classes for styling-only elements and root directives for behavioral
components:

```css
.button {
  @apply font-semibold;
}

.button[size='lg'] {
  @apply h-11 px-6;
}
```

The component reference lists the exact root selector for every entry.

## Semantic parts

Complex components expose named parts without rendering a hidden template:

```css
.dialog-content {
  @apply max-w-xl;
}

.dialog-footer {
  @apply justify-between;
}
```

Part classes remain stable selectors while the elements retain native meaning.

## State attributes

Directives mirror behavior into `data-*` and ARIA attributes:

```css
[ng-tabs] .tabs-trigger[aria-selected='true'] {
  @apply border-slate-900 text-slate-950;
}

.combobox-item[data-highlighted='true'] {
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
  <button class="button">Continue</button>
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
