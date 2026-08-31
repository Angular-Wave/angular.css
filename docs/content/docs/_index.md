---
title: Documentation
linkTitle: Docs
menu: { main: { weight: 20 } }
description:
  Learn AngularCSS from installation through production component composition.
---

AngularCSS is a library of semantic HTML contracts, TypeScript directives, and
Tailwind-friendly CSS for AngularTS applications. These docs assume that you
know basic HTML but do not assume prior AngularCSS experience.

## Start here

1. [Introduction]({{< relref "/docs/get-started/introduction" >}}) explains what
   AngularCSS owns and what remains native HTML or AngularTS behavior.
2. [Installation]({{< relref "/docs/get-started/installation" >}}) adds the
   local npm packages, stylesheet, and `ui` module.
3. [Build your first component]({{< relref
   "/docs/get-started/first-component" >}}) creates an interactive accordion.
4. [Styling with Tailwind]({{< relref
   "/docs/get-started/styling-tailwind" >}}) covers tokens, slots, and state
   selectors.

## Find a component

The [component catalog]({{< relref "/docs/components" >}}) contains a working
iframe demo and complete contract for every canonical component. Each page
documents selectors, slots, authored attributes, generated state, ARIA
relationships, CSS variables, events, behavior ownership, and customization.

The [element entrypoints]({{< relref "/docs/elements" >}}) are compatibility
imports. They re-export canonical TypeScript implementations and do not define a
second behavior model.

## Production guides

- [AngularTS ownership]({{< relref
  "/docs/guides/angular-ts-ownership" >}}) explains where models, validation,
  bindings, and structural state belong.
- [Composition]({{< relref "/docs/guides/composition" >}}) combines primitives
  into forms, menus, date pickers, and overlays.
- [Accessibility]({{< relref "/docs/guides/accessibility" >}}) covers authored
  names, keyboard testing, focus, and generated ARIA state.
- [Testing]({{< relref "/docs/guides/testing" >}}) validates components and
  documentation in a browser.
