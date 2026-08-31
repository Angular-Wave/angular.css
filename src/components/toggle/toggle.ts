import type {} from "@angular-wave/angular.ts";

import { onDestroy } from "../../internal/dom";

export function toggleDirective(): ng.Directive {
  return {
    link(scope: ng.Scope, element: HTMLElement) {
      const pressedSource = element.hasAttribute("aria-pressed")
        ? "aria-pressed"
        : "data-state";
      const isElementDisabled = () =>
        element.hasAttribute("disabled") ||
        element.getAttribute("aria-disabled") === "true";
      const setPressed = (pressed: boolean) => {
        const state = pressed ? "on" : "off";
        if (element.getAttribute("aria-pressed") !== String(pressed)) {
          element.setAttribute("aria-pressed", String(pressed));
        }
        if (element.getAttribute("data-state") !== state) {
          element.setAttribute("data-state", state);
        }
      };
      const syncDisabled = () => {
        const disabled = isElementDisabled();
        if (element.getAttribute("data-disabled") !== String(disabled)) {
          element.setAttribute("data-disabled", String(disabled));
        }
      };
      const syncPressed = () => {
        const pressed =
          pressedSource === "aria-pressed"
            ? element.getAttribute("aria-pressed") === "true"
            : element.getAttribute("data-state") === "on";
        setPressed(pressed);
      };

      syncPressed();
      syncDisabled();

      const handleClick = () => {
        if (isElementDisabled()) return;
        setPressed(element.getAttribute("aria-pressed") !== "true");
      };
      const observer = new MutationObserver(() => {
        syncPressed();
        syncDisabled();
      });
      observer.observe(element, {
        attributes: true,
        attributeFilter: [
          "aria-disabled",
          "aria-pressed",
          "data-disabled",
          "data-state",
          "disabled",
        ],
      });

      element.addEventListener("click", handleClick);

      onDestroy(scope, () => {
        observer.disconnect();
        element.removeEventListener("click", handleClick);
      });
    },
  };
}
