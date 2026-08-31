import type {} from "@angular-wave/angular.ts";

import { query } from "../../internal/dom";

export function cardDirective(): ng.Directive {
  return {
    link(_scope: ng.Scope, element: HTMLElement) {
      const size = element.getAttribute("size") === "sm" ? "sm" : "default";
      element.setAttribute("data-size", size);

      element.setAttribute(
        "data-has-header",
        String(
          Boolean(
            query(element, '[data-slot="card-header"], [ng-card-header]'),
          ),
        ),
      );

      element.setAttribute(
        "data-has-content",
        String(
          Boolean(
            query(element, '[data-slot="card-content"], [ng-card-content]'),
          ),
        ),
      );

      element.setAttribute(
        "data-has-footer",
        String(
          Boolean(
            query(element, '[data-slot="card-footer"], [ng-card-footer]'),
          ),
        ),
      );

      element.setAttribute(
        "data-has-action",
        String(
          Boolean(
            query(element, '[data-slot="card-action"], [ng-card-action]'),
          ),
        ),
      );
    },
  };
}
