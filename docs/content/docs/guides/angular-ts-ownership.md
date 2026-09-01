---
title: AngularTS Ownership
weight: 10
description:
  Keep models, validation, bindings, and structural behavior in AngularTS
  instead of duplicating them in components.
---

AngularCSS extends AngularTS; it does not replace framework behavior. This rule
keeps components predictable and prevents two state systems from disagreeing.

## AngularTS owns application state

Use AngularTS for values, commands, collections, and conditional rendering:

```html
<label for="volume">Volume</label>
<input id="volume" ng-slider type="range" min="0" max="100" ng-model="volume" />
<output>{{ volume }}</output>
```

`ng-model` owns the value. The slider directive mirrors native min, max,
orientation, invalid state, and the current value into accessibility and styling
attributes.

## Native HTML owns platform behavior

Prefer native controls for text, checkboxes, radios, ranges, selects, progress,
tables, and labels. Their form submission, browser validation, autofill, mobile
input, and accessibility behavior should remain intact.

## AngularCSS owns component mechanics

AngularCSS may manage:

- Trigger and panel relationships.
- Composite keyboard navigation and roving focus.
- Modal focus trapping, Escape closure, and focus restoration.
- Mirrored `data-*` and ARIA state.
- Component-specific DOM events.

AngularCSS does not own:

- Interpolation or expression parsing.
- `ng-model`, form controllers, or validation rules.
- `ng-if`, `ng-repeat`, or other structural rendering.
- Routing, data fetching, persistence, or business commands.

## Controlled state

Some components observe authored `data-open`, `aria-selected`, or related state.
Use AngularTS bindings to update those attributes when application code must
control the component. The component reference marks attributes as input,
output, or input/output.

## Directive names

AngularCSS avoids collisions with AngularTS. Styling-only elements use native
HTML and classes, so the switch presentation is `input.switch`; AngularTS keeps
ownership of structural switch rendering.
