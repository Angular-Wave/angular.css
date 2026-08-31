import type {} from "@angular-wave/angular.ts";

export function aspectRatioDirective(): ng.Directive {
  return {
    link(_scope: ng.Scope, element: HTMLElement) {
      const authoredRatio =
        element.getAttribute("ratio") ??
        element.getAttribute("data-ratio") ??
        element.style.getPropertyValue("--ratio");
      const ratio = authoredRatio === "" ? "16 / 9" : authoredRatio;
      element.style.setProperty("--ratio", ratio);
      element.setAttribute("data-ratio", ratio);
    },
  };
}
