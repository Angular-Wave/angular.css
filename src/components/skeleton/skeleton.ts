import type {} from "@angular-wave/angular.ts";

export function skeletonDirective(): ng.Directive {
  return {
    link(_scope: ng.Scope, element: HTMLElement) {
      if (!element.hasAttribute("aria-label")) {
        element.setAttribute(
          "aria-hidden",
          element.getAttribute("aria-hidden") || "true",
        );
      }
      element.setAttribute("data-loading", "true");
    },
  };
}
