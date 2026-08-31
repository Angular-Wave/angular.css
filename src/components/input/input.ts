import type {} from "@angular-wave/angular.ts";

/**
 * Compatibility factory for a styling-only component.
 *
 * AngularTS owns native input models, validation, and its input event
 * directive. AngularCSS deliberately registers no Input directive.
 */
export function inputDirective(): ng.Directive {
  return {};
}
