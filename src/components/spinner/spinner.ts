import type {} from "@angular-wave/angular.ts";

export function spinnerDirective(): ng.Directive {
  return {
    link(_scope: ng.Scope, element: HTMLElement) {
      element.setAttribute("role", element.getAttribute("role") ?? "status");
      element.setAttribute(
        "aria-live",
        element.getAttribute("aria-live") ?? "polite",
      );
      element.setAttribute(
        "aria-label",
        element.getAttribute("aria-label") ?? "Loading",
      );
      element.setAttribute("aria-busy", "true");
      element.setAttribute("data-loading", "true");
    },
  };
}
