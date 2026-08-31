import type {} from "@angular-wave/angular.ts";

import { onDestroy, queryAll } from "../../internal/dom";

const radioSelector = 'input[type="radio"]';

export function radioGroupDirective(): ng.Directive {
  return {
    link(scope: ng.Scope, element: HTMLElement) {
      let radios: HTMLInputElement[] = [];
      const boundRadios = new Set<HTMLInputElement>();
      let initialSyncFrame: number | null = null;

      const sync = () => {
        radios = queryAll<HTMLInputElement>(element, radioSelector);
        radios.forEach((radio) => {
          bindRadio(radio);
          const checked = radio.checked;
          radio.setAttribute("role", radio.getAttribute("role") || "radio");
          radio.setAttribute("data-state", checked ? "checked" : "unchecked");
          radio.setAttribute("aria-checked", String(checked));
        });
      };

      const bindRadio = (radio: HTMLInputElement) => {
        if (boundRadios.has(radio)) return;
        boundRadios.add(radio);
        radio.addEventListener("change", sync);
      };

      element.setAttribute(
        "role",
        element.getAttribute("role") || "radiogroup",
      );

      const handleKeydown = (event: KeyboardEvent) => {
        if (!event.key.startsWith("Arrow")) return;
        queueMicrotask(sync);
      };

      const observer = new MutationObserver(sync);
      observer.observe(element, {
        attributes: true,
        attributeFilter: ["checked", "class"],
        childList: true,
        subtree: true,
      });

      element.addEventListener("keydown", handleKeydown);
      sync();
      initialSyncFrame = requestAnimationFrame(() => {
        initialSyncFrame = null;
        sync();
      });

      onDestroy(scope, () => {
        if (initialSyncFrame !== null) cancelAnimationFrame(initialSyncFrame);
        observer.disconnect();
        boundRadios.forEach((radio) =>
          radio.removeEventListener("change", sync),
        );
        boundRadios.clear();
        element.removeEventListener("keydown", handleKeydown);
      });
    },
  };
}
