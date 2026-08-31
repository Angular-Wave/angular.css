import type {} from "@angular-wave/angular.ts";

export function badgeDirective(): ng.Directive {
  return {
    link(_scope: ng.Scope, element: HTMLElement) {
      const variant =
        element.getAttribute("variant") ||
        element.getAttribute("data-variant") ||
        "default";
      element.setAttribute("data-variant", variant);
    },
  };
}
