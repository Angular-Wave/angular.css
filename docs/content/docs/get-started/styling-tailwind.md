---
title: Styling with Tailwind
weight: 40
description:
  Customize AngularCSS with Tailwind utilities, Radix color tokens, semantic
  parts, and state selectors.
---

AngularCSS ships a usable visual baseline, but its public styling contract is
made for application overrides. Target semantic roots, component classes,
native state, and documented component state from Tailwind or ordinary CSS.

## Load order

Load AngularCSS before application Tailwind and ordinary application overrides.
The bundle declares this low-to-high layer order: `theme`, `base`,
`angularcss.tokens`, `angularcss.components`, `components`, and `utilities`.
This keeps component defaults below application component rules and utilities,
without specificity escalation or `!important` declarations:

```css
@import '@angular-wave/angular.css/dist/angular.css';
@import 'tailwindcss';

@layer components {
  .card {
    @apply border-slate-200 bg-white;
  }
}
```

Unlayered application rules remain above normal layered declarations. Prefer the
public `components` layer for reusable application patterns and Tailwind
utilities for local exceptions. Override semantic custom properties at the
nearest shared ancestor so inherited design decisions continue through nested
components.

## Modern CSS support

AngularCSS uses Baseline features directly when native HTML retains a working
fallback. Newer presentation features remain progressive enhancements behind
`@supports`.

- `@scope` bounds part selectors in compositions that can be nested.
- Size container queries adapt cards and dialogs to their rendered width.
- `:open` styles native `details`, `dialog`, and `select` state.
- Customizable native select pickers use `appearance: base-select` only when
  supported.
- `field-sizing: content` is available through `.input-fit` and is the default
  textarea sizing behavior.
- AngularTS router view transitions remain router-owned; AngularCSS only
  supplies presentation.

Do not replace native behavior or an AngularTS service solely to use a newer CSS
feature. Unsupported enhancements must leave the semantic HTML usable.

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

Use the documented HTML relationships to style parts of a composition:

```css
.dialog > dialog {
  @apply max-w-xl;
}

.dialog > dialog > footer {
  @apply justify-between;
}
```

The wrapper identifies the composition; native elements identify its parts.

## State attributes

Styling-only entries use native state such as `:checked` and `:open`.
Behavioral components expose their documented state through authored attributes,
`data-*`, and ARIA attributes:

```css
[ng-tabs] > menu > button[aria-selected='true'] {
  @apply border-slate-900 text-slate-950;
}

[ng-combobox] li[data-highlighted='true'] {
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
