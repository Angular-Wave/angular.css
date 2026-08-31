import type {} from "@angular-wave/angular.ts";

import { onDestroy } from "../../internal/dom";
import { syncNativeControlState } from "../../internal/form";

export function textareaDirective(): ng.Directive {
  return {
    link(scope: ng.Scope, element: HTMLElement) {
      if (!(element instanceof HTMLTextAreaElement)) return;

      const sync = () => {
        syncNativeControlState(element);
        element.setAttribute("data-empty", String(!element.value));
        element.setAttribute(
          "data-invalid",
          String(
            element.getAttribute("aria-invalid") === "true" ||
              element.matches(":invalid"),
          ),
        );
      };

      const onChange = () => sync();

      element.addEventListener("input", sync);
      element.addEventListener("change", onChange);

      const observer = new MutationObserver(sync);
      observer.observe(element, {
        attributes: true,
        attributeFilter: ["aria-invalid", "disabled", "required", "value"],
      });

      sync();

      onDestroy(scope, () => {
        element.removeEventListener("input", sync);
        element.removeEventListener("change", onChange);
        observer.disconnect();
      });
    },
  };
}
