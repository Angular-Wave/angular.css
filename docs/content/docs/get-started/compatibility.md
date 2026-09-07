---
title: Compatibility and upgrades
weight: 50
description:
  Understand AngularTS, browser, and Node.js compatibility and upgrade an
  AngularCSS application deliberately.
---

AngularCSS declares `@angular-wave/angular.ts` with the npm `latest` tag and
tests the registry's current release in CI. A daily compatibility run catches a
new AngularTS release even when AngularCSS source has not changed. The package
lock still records the exact version used for a reproducible AngularCSS build.

## Supported environments

- Current Chromium, Firefox, and WebKit engines are required browser projects.
- Node.js 24 or newer is required for development, documentation, and package
  builds.
- The distributed CSS and browser JavaScript are prebuilt. Consumers do not need
  the AngularCSS build toolchain.
- Behavioral components require AngularTS. Styling-only foundations, elements,
  patterns, and recipes can use the compiled stylesheet alone.

AngularCSS uses current platform features including native `dialog`, the Popover
API, CSS custom properties, cascade layers, logical properties, `:has()`, and
`@scope`. Test the final application against its own supported browser policy,
content, localization, zoom, and assistive technology.

## Upgrade both packages

Resolve both current releases together and review the lockfile:

```sh
npm install @angular-wave/angular.ts@latest @angular-wave/angular.css@latest
npm run build
```

Then run the application's keyboard, form, overlay, narrow viewport, and data
workflow tests. Review the AngularCSS changelog for selector, attribute, event,
or custom-property changes. Versions below `0.1.0` may refine public contracts
while the catalog is being stabilized.

## Upgrading from 0.0.1 to 0.0.2

The core package no longer uses Tailwind in its source, build, or distribution.
Continue importing the same compiled CSS entrypoint. Customize semantic CSS
variables directly; Tailwind applications can set those variables from their own
stylesheet without an AngularCSS adapter.

`0.0.2` adds DTCG 2025.10 token files, density and contrast contexts, print
attributes, broader enterprise-state recipes, and stricter accessible HTML.
Re-test any application CSS that depended on undocumented generated selectors or
Tailwind implementation variables.

## Diagnose a compatibility failure

Run the same policy check used by CI:

```sh
npm install --no-save --package-lock=false @angular-wave/angular.ts@latest
npm run check:angular-ts-version -- --registry-latest
npm test
```

The check reports the exact installed AngularTS compatibility target before the
browser suite runs.
