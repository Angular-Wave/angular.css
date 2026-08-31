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
        queryAll<HTMLElement>(
          element,
          '[data-slot="sheet-content"], [ng-sheet-content]',
        ).find(
          (candidate) =>
            candidate.closest('[data-slot="sheet"], [ng-sheet]') === element,
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
        rootSelector: '[data-slot="sheet"], [ng-sheet]',
        closeSelector:
          '[data-slot="sheet-close"], [ng-sheet-close], [data-sheet-close]',
        contentSelector: '[data-slot="sheet-content"], [ng-sheet-content]',
        descriptionSelector:
          '[data-slot="sheet-description"], [ng-sheet-description]',
        overlaySelector: '[data-slot="sheet-overlay"], [ng-sheet-overlay]',
        titleSelector: '[data-slot="sheet-title"], [ng-sheet-title]',
        triggerSelector: '[data-slot="sheet-trigger"], [ng-sheet-trigger]',
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
