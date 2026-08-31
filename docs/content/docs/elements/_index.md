---
title: Element Entrypoints
weight: 40
description:
  Compatibility entrypoints that re-export canonical AngularCSS TypeScript
  components.
---

Element entrypoints are compatibility imports. Each one re-exports the matching
canonical implementation from `src/components`; it does not create a second
directive, state model, or CSS contract.

Use the [component catalog]({{< relref "/docs/components" >}}) as the normative
API and behavior reference. Element pages retain separate locally bundled demos
so package entrypoint and documentation inventory remain testable.

For new application code, prefer the package's canonical root import unless a
documented build integration requires a compatibility entrypoint.
