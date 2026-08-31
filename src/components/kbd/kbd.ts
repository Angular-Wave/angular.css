import type {} from "@angular-wave/angular.ts";

export function kbdDirective(): ng.Directive {
  return {
    link(_scope: ng.Scope, element: HTMLElement) {
      const label = element.textContent?.trim();
      if (label && !element.hasAttribute("aria-label")) {
        element.setAttribute("aria-label", `Keyboard shortcut ${label}`);
      }
    },
  };
}
