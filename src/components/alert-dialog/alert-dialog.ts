import type {} from "@angular-wave/angular.ts";

import { bindOverlay } from "../../internal/disclosure";

export function alertDialogDirective(): ng.Directive {
  return {
    link(scope: ng.Scope, element: HTMLElement) {
      bindOverlay(scope, element, {
        rootSelector:
          '[data-slot="alert-dialog"], [ng-alert-dialog]',
        closeSelector:
          '[data-slot="alert-dialog-cancel"], [ng-alert-dialog-cancel], [data-slot="alert-dialog-action"], [ng-alert-dialog-action], [data-alert-dialog-close]',
        contentSelector:
          '[data-slot="alert-dialog-content"], [ng-alert-dialog-content]',
        contentRole: "alertdialog",
        descriptionSelector:
          '[data-slot="alert-dialog-description"], [ng-alert-dialog-description]',
        closeOnOverlayClick: false,
        overlaySelector:
          '[data-slot="alert-dialog-overlay"], [ng-alert-dialog-overlay]',
        titleSelector:
          '[data-slot="alert-dialog-title"], [ng-alert-dialog-title]',
        triggerSelector:
          '[data-slot="alert-dialog-trigger"], [ng-alert-dialog-trigger]',
        closeOnOutsideClick: false,
      });
    },
  };
}
