import type {} from "@angular-wave/angular.ts";

import { bindOverlay } from "../../internal/disclosure";

export function dialogDirective(): ng.Directive {
  return {
    link(scope: ng.Scope, element: HTMLElement) {
      bindOverlay(scope, element, {
        rootSelector: '[data-slot="dialog"], [ng-dialog]',
        closeSelector:
          '[data-slot="dialog-close"], [ng-dialog-close], [data-dialog-close]',
        contentSelector: '[data-slot="dialog-content"], [ng-dialog-content]',
        descriptionSelector:
          '[data-slot="dialog-description"], [ng-dialog-description]',
        overlaySelector: '[data-slot="dialog-overlay"], [ng-dialog-overlay]',
        titleSelector: '[data-slot="dialog-title"], [ng-dialog-title]',
        triggerSelector: '[data-slot="dialog-trigger"], [ng-dialog-trigger]',
        closeOnOutsideClick: true,
      });
    },
  };
}
