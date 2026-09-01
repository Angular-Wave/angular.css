import type {} from "@angular-wave/angular.ts";

import { bindOverlay } from "../../internal/disclosure";
import { onDestroy, queryAll } from "../../internal/dom";

const sheetSides = new Set(["bottom", "left", "right", "top"]);

const setAttributeIfChanged = (
  element: HTMLElement,
  name: string,
  value: string,
): void => {
  if (element.getAttribute(name) !== value) {
    element.setAttribute(name, value);
  }
};

export function sheetDirective(): ng.Directive {
  return {
    link(scope: ng.Scope, element: HTMLElement) {
      const getContent = (): HTMLElement | null =>
        queryAll<HTMLElement>(element, ".sheet-content").find(
          (candidate) => candidate.closest(".sheet, [ng-sheet]") === element,
        ) ?? null;
      const syncSide = (): void => {
        const content = getContent();
        const authoredSide =
          element.getAttribute("side") ?? content?.getAttribute("side");
        const side =
          authoredSide && sheetSides.has(authoredSide) ? authoredSide : "right";
        setAttributeIfChanged(element, "data-side", side);
        if (content) setAttributeIfChanged(content, "data-side", side);
      };

      bindOverlay(scope, element, {
        rootSelector: ".sheet, [ng-sheet]",
        closeSelector: ".sheet-close, [data-sheet-close]",
        contentSelector: ".sheet-content",
        descriptionSelector: ".sheet-description",
        overlaySelector: ".sheet-overlay",
        titleSelector: ".sheet-title",
        triggerSelector: ".sheet-trigger",
        closeOnOutsideClick: true,
      });

      const sideObserver = new MutationObserver(syncSide);
      sideObserver.observe(element, {
        attributes: true,
        attributeFilter: ["side"],
        childList: true,
        subtree: true,
      });
      syncSide();
      onDestroy(scope, () => {
        sideObserver.disconnect();
      });
    },
  };
}
