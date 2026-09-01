import type {} from "@angular-wave/angular.ts";

import { bindOverlay } from "../../internal/disclosure";

export function alertDialogDirective(): ng.Directive {
  return {
    link(scope: ng.Scope, element: HTMLElement) {
      bindOverlay(scope, element, {
        rootSelector: ".alert-dialog, [ng-alert-dialog]",
        closeSelector:
          ".alert-dialog-cancel, .alert-dialog-action, [data-alert-dialog-close]",
        contentSelector: ".alert-dialog-content",
        contentRole: "alertdialog",
        descriptionSelector: ".alert-dialog-description",
        closeOnOverlayClick: false,
        overlaySelector: ".alert-dialog-overlay",
        titleSelector: ".alert-dialog-title",
        triggerSelector: ".alert-dialog-trigger",
        closeOnOutsideClick: false,
      });
    },
  };
}
