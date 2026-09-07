# Documentation style guide

AngularCSS documentation follows the sibling AngularTS documentation standard.
Assume the reader knows basic HTML but has not used AngularCSS.

## Write for a first-time reader

- Define AngularCSS-specific terms before using them.
- State which layer owns each behavior: native HTML, AngularTS, AngularCSS, or
  application code.
- Explain what each example changes and what the reader should observe.
- Prefer short sentences, active voice, and concrete element or attribute names.
- Do not refer readers to AngularJS behavior for an AngularTS or AngularCSS API.
- End learning pages with one explicit next step.

## Separate content by purpose

- Getting-started pages teach one complete path in order.
- Guides explain decisions shared by several components.
- Component pages describe exact selectors, attributes, state, events, behavior,
  accessibility, and customization.
- Element pages describe compatibility entrypoints and link to the canonical
  component contract.

## Keep examples executable

- Serve AngularTS and AngularCSS from local assets, never a CDN.
- Render demos in isolated, non-scrollable iframes.
- Load the project reset stylesheet before AngularCSS in every iframe.
- Use AngularTS bindings for model, validation, event, and structural state.
- Use native HTML behavior before adding a component directive.

## Validate changes

Run `npm run check`, `PLAYWRIGHT_PORT=4101 npm run test:docs`, and a Hugo build.
The component reference generator must be current before documentation is ready.
