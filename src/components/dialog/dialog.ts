import type {} from "@angular-wave/angular.ts";

import { bindOverlay } from "../../internal/disclosure";

export function dialogDirective(): ng.Directive {
  return {
    link(scope: ng.Scope, element: HTMLElement) {
      bindOverlay(scope, element, {
        rootSelector: ".dialog, [ng-dialog]",
        closeSelector: ".dialog-close, [data-dialog-close]",
        contentSelector: ".dialog-content",
        descriptionSelector: ".dialog-description",
        overlaySelector: ".dialog-overlay",
        titleSelector: ".dialog-title",
        triggerSelector: ".dialog-trigger",
        closeOnOutsideClick: true,
      });
    },
  };
}
