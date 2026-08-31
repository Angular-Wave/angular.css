import type {} from "@angular-wave/angular.ts";

import { onDestroy, query } from "../../internal/dom";

const resolveControl = (label: HTMLElement): HTMLElement | null => {
  const htmlFor = label.getAttribute("for");
  const control = htmlFor
    ? document.getElementById(htmlFor)
    : query<HTMLElement>(label, "input, textarea, select");

  return control instanceof HTMLElement ? control : null;
};

const syncState = (label: HTMLElement, control: HTMLElement | null): void => {
  label.setAttribute("data-associated", String(Boolean(control)));
  label.setAttribute(
    "data-required",
    String(
      Boolean(
        control?.hasAttribute("required") ||
        control?.getAttribute("aria-required") === "true",
      ),
    ),
  );
  label.setAttribute(
    "data-disabled",
    String(
      Boolean(
        control?.hasAttribute("disabled") ||
        control?.getAttribute("aria-disabled") === "true",
      ),
    ),
  );
};

export function labelDirective(): ng.Directive {
  return {
    link(_scope: ng.Scope, element: HTMLElement) {
      let control: HTMLElement | null = null;
      let controlObserver: MutationObserver | null = null;

      const sync = () => {
        const nextControl = resolveControl(element);

        if (nextControl !== control) {
          controlObserver?.disconnect();
          control = nextControl;

          if (control) {
            controlObserver = new MutationObserver(sync);
            controlObserver.observe(control, {
              attributes: true,
              attributeFilter: [
                "required",
                "disabled",
                "aria-required",
                "aria-disabled",
              ],
            });
          } else {
            controlObserver = null;
          }
        }

        syncState(element, control);
      };

      const labelObserver = new MutationObserver(sync);
      labelObserver.observe(element, {
        attributes: true,
        childList: true,
        subtree: true,
        attributeFilter: ["for"],
      });
      const associationObserver = new MutationObserver(sync);
      associationObserver.observe(
        element.parentElement ?? element.ownerDocument,
        {
          childList: true,
          subtree: true,
        },
      );

      sync();

      onDestroy(_scope, () => {
        controlObserver?.disconnect();
        labelObserver.disconnect();
        associationObserver.disconnect();
      });
    },
  };
}
