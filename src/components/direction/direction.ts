import type {} from "@angular-wave/angular.ts";

export function directionDirective(): ng.Directive {
  const normalize = (
    direction: string | null,
  ): "ltr" | "rtl" | "auto" | null => {
    if (direction === "rtl" || direction === "ltr" || direction === "auto") {
      return direction;
    }
    return null;
  };

  const resolveDirection = (element: HTMLElement): "ltr" | "rtl" | "auto" => {
    const own = normalize(element.getAttribute("dir"));
    if (own) return own;

    const fromData = normalize(element.getAttribute("data-direction"));
    if (fromData) return fromData;

    const ancestor = element.parentElement?.closest(
      "[dir], [data-direction], [ng-direction], [data-slot='direction']",
    );
    if (ancestor instanceof HTMLElement) {
      const ancestorDir = normalize(ancestor.getAttribute("dir"));
      if (ancestorDir) return ancestorDir;
      const ancestorData = normalize(ancestor.getAttribute("data-direction"));
      if (ancestorData) return ancestorData;
    }

    return (
      normalize(document.documentElement.getAttribute("dir")) ??
      normalize(document.documentElement.getAttribute("data-direction")) ??
      normalize(document.dir) ??
      "ltr"
    );
  };

  return {
    link(_scope: ng.Scope, element: HTMLElement) {
      const direction = resolveDirection(element);
      element.setAttribute("data-direction", direction);
      element.setAttribute("dir", direction);
      element.style.direction = direction;
    },
  };
}
