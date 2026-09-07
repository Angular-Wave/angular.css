# Contributing to AngularCSS

AngularCSS is an HTML-first customization layer for AngularTS enterprise
applications. Contributions should preserve the ownership boundary between the
browser, AngularTS, and AngularCSS.

## Before changing a catalog entry

Use this order:

1. Native HTML owns semantics, activation, form state, validation, and platform
   behavior.
2. CSS owns presentation and consumes native or authored attributes.
3. AngularTS owns application data, expressions, rendering, fetching,
   authorization, caching, and domain state.
4. AngularCSS TypeScript handles only remaining composite interaction such as
   coordinated keyboard navigation, focus, disclosure, or geometry.

Reuse existing tokens, semantic selectors, helpers, directives, and recipes
before introducing an API. Keep component classes to the minimum needed to
identify a reusable root. Do not add classes for parts that semantic descendants
or native attributes can identify.

AngularCSS is a customization system, not a product design system. New
presentation controls must work through the shared CSS custom-property contract.
Update the DTCG 2025.10 source under `tokens/`, regenerate it with
`npm run tokens:build`, and review public API drift explicitly.

## Local setup

Use Node.js 24 or newer, the npm version declared in `package.json`, and Hugo
Extended 0.146 or newer:

```sh
npm install
npm --prefix docs install
npx playwright install chromium firefox webkit
```

Run the static and generated-file gates:

```sh
npm run release:build
npm run check
```

Run focused tests while developing, followed by the complete browser suite for
changes that affect shared CSS, behavior, or generated examples:

```sh
npm run test:components
npm test
```

Browser tests must open built standalone HTML. They must not import source files
into the page or construct AngularCSS directives directly.

## Catalog and public API changes

Add catalog entries to `scripts/component-policy.ts` with an ownership rationale.
Every entry needs canonical HTML, CSS, a test, and generated reference content.
Run these commands after an intentional contract change:

```sh
npm run generate-docs:components
npm run sync:catalog-examples
npm run update:public-api
```

Review the resulting `contracts/public-api.json` diff. Selectors, attributes,
custom properties, events, directives, and exports are public unless documented
as internal.

## Pull requests and support

Open bug reports and feature proposals in the
[AngularCSS issue tracker](https://github.com/angular-wave/angular.css/issues).
Include a reduced HTML example, AngularCSS and AngularTS versions, browser, and
expected behavior. Keep pull requests focused and explain the user-visible
trigger, resulting behavior, and validation performed.

For usage questions, start a
[GitHub Discussion](https://github.com/angular-wave/angular.css/discussions).
Security reports should use the repository's private GitHub security advisory
flow rather than a public issue.
