import type {} from "@angular-wave/angular.ts";

export function emptyDirective(): ng.Directive {
  return {
    link(_scope: ng.Scope, element: HTMLElement) {
      element.setAttribute("role", element.getAttribute("role") ?? "status");
      element.setAttribute(
        "aria-live",
        element.getAttribute("aria-live") ?? "polite",
      );
    },
  };
}
