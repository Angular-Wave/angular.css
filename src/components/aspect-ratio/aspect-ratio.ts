import type {} from "@angular-wave/angular.ts";

export function aspectRatioDirective(): ng.Directive {
  return {
    link(_scope: ng.Scope, element: HTMLElement) {
      const ratio =
        element.getAttribute("ratio") ||
        element.getAttribute("data-ratio") ||
        element.style.getPropertyValue("--ratio") ||
        "16 / 9";
      element.style.setProperty("--ratio", ratio);
      element.setAttribute("data-ratio", ratio);
    },
  };
}
