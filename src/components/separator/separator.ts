import type {} from "@angular-wave/angular.ts";

export function separatorDirective(): ng.Directive {
  return {
    link(_scope: ng.Scope, element: HTMLElement) {
      const orientation = element.getAttribute("orientation") ?? "horizontal";
      element.setAttribute("role", element.getAttribute("role") ?? "separator");
      element.setAttribute("aria-orientation", orientation);
      element.setAttribute("data-orientation", orientation);
    },
  };
}
