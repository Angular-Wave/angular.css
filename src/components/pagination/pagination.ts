import type {} from "@angular-wave/angular.ts";

import { onDestroy, queryAll } from "../../internal/dom";

const contentSelector =
  '[data-slot="pagination-content"], [ng-pagination-content]';
const linkSelector = '[data-slot="pagination-link"], [ng-pagination-link]';
const itemSelector = '[data-slot="pagination-item"], [ng-pagination-item]';
const previousNextSelector =
  '[data-slot="pagination-previous"], [ng-pagination-previous], [data-slot="pagination-next"], [ng-pagination-next]';
const ellipsisSelector =
  '[data-slot="pagination-ellipsis"], [ng-pagination-ellipsis]';
const interactiveSelector = `${linkSelector}, ${previousNextSelector}`;
const controlSelector = `${previousNextSelector}, ${ellipsisSelector}`;

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
  if (element.hasAttribute(name)) {
    element.removeAttribute(name);
  }
};

export function paginationDirective(): ng.Directive {
  return {
    link(scope: ng.Scope, element: HTMLElement) {
      const activeSources = new WeakMap<HTMLElement, "aria" | "data">();
      setAttribute(
        element,
        "aria-label",
        element.getAttribute("aria-label") ?? "pagination",
      );
      if (element.tagName !== "NAV" && !element.hasAttribute("role")) {
        setAttribute(element, "role", "navigation");
      }

      const sync = () => {
        queryAll<HTMLElement>(element, contentSelector).forEach(
          (paginationContent) => {
            if (
              paginationContent.tagName !== "UL" &&
              paginationContent.tagName !== "OL" &&
              !paginationContent.hasAttribute("role")
            ) {
              setAttribute(paginationContent, "role", "list");
            }
          },
        );

        queryAll<HTMLElement>(element, itemSelector).forEach((item) => {
          if (item.tagName !== "LI" && !item.hasAttribute("role")) {
            setAttribute(item, "role", "listitem");
          }
        });

        queryAll<HTMLElement>(element, interactiveSelector).forEach((link) => {
          let source = activeSources.get(link);
          if (
            !source ||
            (source === "aria" && link.hasAttribute("data-active"))
          ) {
            source = link.hasAttribute("data-active") ? "data" : "aria";
            activeSources.set(link, source);
          }
          const active =
            source === "data"
              ? link.getAttribute("data-active") === "true"
              : link.getAttribute("aria-current") === "page";
          if (active) setAttribute(link, "aria-current", "page");
          else removeAttribute(link, "aria-current");
        });

        queryAll<HTMLElement>(element, controlSelector).forEach((link) => {
          setAttribute(
            link,
            "data-disabled",
            String(link.getAttribute("aria-disabled") === "true"),
          );
          if (link.matches(ellipsisSelector)) {
            setAttribute(link, "aria-hidden", "true");
          }
        });
      };

      const observer = new MutationObserver(sync);
      observer.observe(element, {
        attributes: true,
        attributeFilter: [
          "aria-current",
          "aria-disabled",
          "data-active",
          "data-slot",
        ],
        childList: true,
        subtree: true,
      });

      sync();

      onDestroy(scope, () => {
        observer.disconnect();
      });
    },
  };
}
