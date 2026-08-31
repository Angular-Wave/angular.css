import type {} from "@angular-wave/angular.ts";

import { isDisabled } from "../../internal/dom";

type ButtonElement = HTMLButtonElement | HTMLInputElement;

const normalizeVariant = (element: Element): string => {
  return (
    element.getAttribute("variant") ??
    element.getAttribute("data-variant") ??
    "default"
  );
};

const normalizeSize = (element: Element): string => {
  return (
    element.getAttribute("size") ??
    element.getAttribute("data-size") ??
    "default"
  );
};

export function buttonDirective(): ng.Directive {
  return {
    link(_scope: ng.Scope, element: HTMLElement) {
      const target = element as ButtonElement;
      const variant = normalizeVariant(target);
      const size = normalizeSize(target);

      if (target.tagName === "BUTTON" && !target.hasAttribute("type")) {
        target.setAttribute("type", "button");
      }

      element.setAttribute("data-variant", variant);
      element.setAttribute("data-size", size);

      const disabled = isDisabled(element);
      element.setAttribute("data-disabled", String(disabled));

      if (disabled) {
        element.setAttribute("aria-disabled", "true");

        if (target.tagName !== "BUTTON" && target.tagName !== "INPUT") {
          element.setAttribute("tabindex", "-1");
        }
      } else if (!element.hasAttribute("aria-disabled")) {
        element.removeAttribute("aria-disabled");
      }
    },
  };
}
