import type {} from "@angular-wave/angular.ts";

import { onDestroy, query } from "../../internal/dom";

const indicatorSelector =
  '[data-slot="progress-indicator"], [ng-progress-indicator]';
const labelSelector = '[data-slot="progress-label"], [ng-progress-label]';
const valueSelector = '[data-slot="progress-value"], [ng-progress-value]';

let progressId = 0;

const setAttribute = (
  element: HTMLElement,
  name: string,
  value: string,
): void => {
  if (element.getAttribute(name) !== value) {
    element.setAttribute(name, value);
  }
};

const removeAttribute = (element: HTMLElement, name: string): void => {
  if (element.hasAttribute(name)) element.removeAttribute(name);
};

const numericAttribute = (
  element: HTMLElement,
  name: string,
): number | null => {
  const attribute = element.getAttribute(name);
  if (attribute === null) return null;
  const value = Number(attribute);
  return Number.isFinite(value) ? value : null;
};

export function progressDirective(): ng.Directive {
  return {
    link(scope: ng.Scope, element: HTMLElement) {
      let generatedLabelledBy: string | null = null;

      const sync = () => {
        const authoredMax = numericAttribute(element, "max");
        const max = authoredMax !== null && authoredMax > 0 ? authoredMax : 100;
        const authoredValue = numericAttribute(element, "value");
        const determinate = authoredValue !== null;
        const value = determinate
          ? Math.min(max, Math.max(0, authoredValue))
          : 0;
        const rawPercent = max === 0 ? 0 : (value / max) * 100;
        const percent = Math.round(rawPercent * 1_000_000) / 1_000_000;
        const formattedPercent = `${String(percent)}%`;

        element.style.setProperty("--value", formattedPercent);
        setAttribute(
          element,
          "role",
          element.getAttribute("role") ?? "progressbar",
        );
        setAttribute(element, "aria-valuemin", "0");
        setAttribute(element, "aria-valuemax", String(max));
        if (determinate) {
          setAttribute(element, "aria-valuenow", String(value));
          setAttribute(element, "data-value", String(value));
        } else {
          removeAttribute(element, "aria-valuenow");
          removeAttribute(element, "data-value");
        }

        query(element, indicatorSelector, HTMLElement)?.style.setProperty(
          "--value",
          formattedPercent,
        );

        const label = query(element, labelSelector, HTMLElement);
        if (label && !element.hasAttribute("aria-label")) {
          label.id = label.id || `progress-label-${String(progressId++)}`;
          if (
            !element.hasAttribute("aria-labelledby") ||
            element.getAttribute("aria-labelledby") === generatedLabelledBy
          ) {
            generatedLabelledBy = label.id;
            setAttribute(element, "aria-labelledby", label.id);
          }
        } else if (
          generatedLabelledBy &&
          element.getAttribute("aria-labelledby") === generatedLabelledBy
        ) {
          removeAttribute(element, "aria-labelledby");
          generatedLabelledBy = null;
        }

        const valueElement = query(element, valueSelector, HTMLElement);
        if (
          valueElement &&
          !valueElement.hasAttribute("ng-bind") &&
          valueElement.getAttribute("data-value-format") !== "custom"
        ) {
          const text = determinate ? formattedPercent : "";
          if (valueElement.textContent !== text)
            valueElement.textContent = text;
        }
      };

      const observer = new MutationObserver(sync);
      observer.observe(element, {
        attributes: true,
        attributeFilter: ["max", "value"],
        childList: true,
        subtree: true,
      });

      sync();
      queueMicrotask(sync);

      onDestroy(scope, () => {
        observer.disconnect();
      });
    },
  };
}
