# AngularCSS roadmap

## 0.0.2 — enterprise hardening

The `0.0.2` release turns the existing 67-entry catalog into a dependable
enterprise application foundation. Work is limited to compatibility,
accessibility, release integrity, stable public contracts, shared customization
foundations, measurable performance, and realistic backend-driven workflows.

Catalog expansion resumes after these foundations are enforced.

AngularCSS is a customization system, not a design system. These foundations
expose consistent ways to configure the catalog; applications continue to own
brand identity, product composition, and design decisions.

### CSS customization decision

`0.0.2` removes Tailwind from the AngularCSS core source, build pipeline, and
distribution. The core stylesheet will use standards-based CSS tooling and
will not emit Tailwind implementation variables.

Customization remains a first-class public API through semantic CSS custom
properties and cascade layers. Consumers must be able to override themes,
density, control geometry, spacing, radii, and state colors globally or within
an application subtree using ordinary CSS. Existing `0.0.1` tokens remain
available through compatibility aliases where the new public API introduces a
namespaced token.

Tailwind users can set the same semantic variables from their application CSS.
Any future Tailwind adapter must be an optional export, remain isolated from
the core stylesheet and build, and provide no separate customization model.

Customization tokens use the DTCG 2025.10 format as their canonical interchange
source and compile to CSS custom properties for browser use. Consuming the CSS
variables requires no token tooling.

### Scope guardrails

- Keep native HTML responsible for semantics, activation, form behavior, and
  validation.
- Keep AngularTS responsible for application data, expressions, rendering,
  fetching, authorization, caching, and domain state.
- Add AngularCSS TypeScript only for interaction behavior that the first two
  layers cannot provide.
- Prefer inherited HTML context and CSS custom properties over additional
  component classes.
- Reuse existing tokens, selectors, helpers, directives, tests, and examples
  before adding an abstraction.
- Treat every new class, attribute, directive, event, export, and CSS custom
  property as public API unless it is explicitly documented as internal.

### Wave 1 — contracts and build foundations

- [x] Complete authenticated npm publishing with OIDC provenance and
      post-publish registry verification.
- [x] Test against AngularTS `latest` automatically and report compatibility
      failures with enough detail to act on them.
- [x] Inventory the public selectors, attributes, CSS variables, directives,
      events, and exports; make CI detect accidental drift.
- [x] Replace Tailwind-specific source directives and build dependencies with a
      standards-based CSS pipeline.
- [x] Remove Tailwind implementation variables from the distributed CSS while
      preserving the supported `0.0.1` customization API.
- [x] Define colors, spacing, typography, shadows, radii, sizing, borders,
      focus, and motion as a validated DTCG 2025.10 customization contract.
- [x] Document global, subtree-scoped, dark, and density customization using
      ordinary CSS custom properties.

Wave 1 is complete when publishing uses the repository credential with OIDC
provenance, AngularTS updates produce a tested result, public API drift is
enforced, and the core source and output contain no Tailwind syntax or
implementation variables.

### Wave 2 — platform coverage

- [x] Run required behavior coverage in Chromium, Firefox, and WebKit.
- [x] Add catalog-wide automated accessibility checks and keyboard interaction
      contracts.
- [x] Establish package-size, stylesheet-size, and representative runtime
      performance budgets.
- [x] Test a clean consumer that customizes forms, navigation, overlays, and
      data views without Tailwind or selector copying.

Wave 2 is complete when supported browsers pass, built examples contain no
serious or critical automated accessibility violations, and CI rejects
performance or artifact-size regressions.

### Wave 3 — enterprise application hardening

- [x] Consolidate density, contrast, spacing, control geometry, state colors,
      and print behavior into shared foundations.
- [x] Cover loading, empty, error, permission-limited, stale-data, filtering,
      paging, selection, and bulk-action states in existing recipes.
- [x] Audit every catalog entry for desktop and mobile consistency, code
      quality, code reuse, accessibility, and API usability.
- [x] Resolve catalog-wide CSS drift in spacing, margins, sizing, and
      proportions without adding component-specific exceptions where a shared
      rule can express the contract.

Wave 3 is complete when the existing recipes handle realistic backend-driven
states and all 67 catalog entries satisfy the browser, accessibility, public
API, visual, and performance gates.

### Wave 4 — adoption and release

- [x] Make installation, customization, compatibility, contribution, support,
      and upgrade documentation match the shipped package.
- [x] Build and inspect the exact release tarball from a clean checkout.
- [x] Resolve AngularTS `latest` immediately before tagging.
- [x] Publish `0.0.2` through authenticated npm publishing with provenance.
- [x] Verify that npm `latest`, the immutable Git tag, the GitHub release, and
      the deployed documentation expose the same version and artifacts.

### Release gates

The release is complete only when:

1. Every roadmap checkbox and wave completion condition is satisfied.
2. The release commit passes repository checks, all supported browser projects,
   documentation tests, accessibility checks, and clean-consumer package
   validation.
3. The package audit reports no unexpected production dependencies or files.
4. The published package contents reproduce the locally verified tarball.
5. npm, GitHub, the Git tag, and the documentation site all report `0.0.2`.

### Deferred until after 0.0.2

- New catalog entries
- Additional package entry points without measured consumer benefit
- Data fetching, caching, virtualization, authorization, or domain-state APIs
- Public API stabilization at `0.1.0`
