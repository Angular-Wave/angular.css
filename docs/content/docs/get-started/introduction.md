---
title: Introduction
weight: 10
description:
  Understand AngularCSS as semantic HTML, focused TypeScript behavior, and
  customizable CSS.
---

AngularCSS provides foundational interface components for AngularTS. A component
is an HTML contract: a root directive, semantic native elements, optional named
slots, observable state attributes, and a stylesheet you can override.

```html
<button ng-button variant="outline">Save changes</button>
```

The HTML remains readable before the directive runs. The native `button` retains
its browser behavior, and `ng-button` adds stable variant and state hooks for
styling.

## Three layers

1. **HTML owns semantics.** Use `button`, `input`, `dialog`, `nav`, `table`, and
   other native elements whenever they fit the interaction.
2. **AngularTS owns application state.** Use `ng-model`, `ng-click`, validation,
   interpolation, and structural directives for values and business behavior.
3. **AngularCSS owns component behavior.** Directives add keyboard navigation,
   focus management, ARIA relationships, and mirrored `data-*` styling state
   when native HTML is not sufficient.

This boundary prevents a component from creating a second form model, template
engine, or validation system over AngularTS.

## HTML-first contracts

Complex components are composed from named parts rather than hidden templates:

```html
<div ng-collapsible>
  <button ng-collapsible-trigger>Account settings</button>
  <section ng-collapsible-content>
    <label for="display-name">Display name</label>
    <input id="display-name" data-input ng-model="profile.name" />
  </section>
</div>
```

You control the elements, content, AngularTS expressions, and Tailwind classes.
The component page lists every supported directive, slot, state, and event.

## What is included

- 55 canonical components covering actions, forms, disclosure, overlays,
  navigation, feedback, layout, and data display.
- TypeScript declarations generated from the canonical source.
- A compiled CSS entrypoint with Radix color tokens and Tailwind-compatible
  selectors.
- Local UMD and ESM builds.
- Browser-tested demos isolated from the documentation shell in iframes.

## Next step

[Install AngularCSS]({{< relref "/docs/get-started/installation" >}}) and
connect the `ui` module to an AngularTS application.
