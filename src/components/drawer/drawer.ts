import type {} from "@angular-wave/angular.ts";

import { bindOverlay } from "../../internal/disclosure";
import { onDestroy, queryAll } from "../../internal/dom";

const drawerSides = new Set(["bottom", "left", "right", "top"]);

const setAttributeIfChanged = (
  element: HTMLElement,
  name: string,
  value: string,
): void => {
  if (element.getAttribute(name) !== value) {
    element.setAttribute(name, value);
  }
};

export function drawerDirective(): ng.Directive {
  return {
    link(scope: ng.Scope, element: HTMLElement) {
      const getContent = (): HTMLElement | null =>
        queryAll<HTMLElement>(element, ".drawer-content").find(
          (candidate) => candidate.closest(".drawer, [ng-drawer]") === element,
        ) ?? null;
      const syncSide = (): void => {
        const content = getContent();
        const authoredSide =
          element.getAttribute("side") ??
          element.getAttribute("direction") ??
          content?.getAttribute("side") ??
          content?.getAttribute("direction");
        const side =
          authoredSide && drawerSides.has(authoredSide)
            ? authoredSide
            : "bottom";
        setAttributeIfChanged(element, "data-side", side);
        if (content) setAttributeIfChanged(content, "data-side", side);
      };

      bindOverlay(scope, element, {
        rootSelector: ".drawer, [ng-drawer]",
        closeSelector: ".drawer-close, [data-drawer-close]",
        contentSelector: ".drawer-content",
        descriptionSelector: ".drawer-description",
        overlaySelector: ".drawer-overlay",
        titleSelector: ".drawer-title",
        triggerSelector: ".drawer-trigger",
        closeOnOutsideClick: true,
      });

      const sideObserver = new MutationObserver(syncSide);
      sideObserver.observe(element, {
        attributes: true,
        attributeFilter: ["direction", "side"],
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
