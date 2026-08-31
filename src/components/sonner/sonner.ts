import type {} from "@angular-wave/angular.ts";

import { onDestroy, queryAll } from "../../internal/dom";

const toastSelector = '[data-slot="toast"], [ng-toast]';
const closeSelector = '[data-slot="toast-close"], [ng-toast-close]';
const actionSelector = '[data-slot="toast-action"], [ng-toast-action]';
const titleSelector = '[data-slot="toast-title"], [ng-toast-title]';
const descriptionSelector =
  '[data-slot="toast-description"], [ng-toast-description]';
const toasterPositions = new Set([
  "bottom-center",
  "bottom-left",
  "bottom-right",
  "top-center",
  "top-left",
  "top-right",
]);
const toastTypes = new Set([
  "default",
  "error",
  "info",
  "loading",
  "success",
  "warning",
]);
type ToastTypeSource = "data-type" | "default" | "type" | "variant";

let toastIdCounter = 0;

const setAttributeIfChanged = (
  element: HTMLElement,
  name: string,
  value: string,
) => {
  if (element.getAttribute(name) !== value) {
    element.setAttribute(name, value);
  }
};

const getToasterPosition = (element: HTMLElement) => {
  const position = element.getAttribute("position");
  if (position !== null) {
    return toasterPositions.has(position) ? position : "bottom-right";
  }

  const dataPosition = element.getAttribute("data-position");
  return dataPosition && toasterPositions.has(dataPosition)
    ? dataPosition
    : "bottom-right";
};

export function toasterDirective(): ng.Directive {
  return {
    link(scope: ng.Scope, element: HTMLElement) {
      element.setAttribute("data-sonner-toaster", "");

      const cleanupButtons = new Map<HTMLElement, () => void>();
      const generatedRelationships = new WeakMap<
        HTMLElement,
        { describedby?: string; labelledby?: string }
      >();
      const mirroredTypes = new WeakMap<
        HTMLElement,
        { source: ToastTypeSource; value: string }
      >();

      const syncPosition = () => {
        const position = getToasterPosition(element);
        if (element.getAttribute("data-position") !== position) {
          element.setAttribute("data-position", position);
        }
      };

      const bindToast = (toast: HTMLElement) => {
        setAttributeIfChanged(
          toast,
          "role",
          toast.getAttribute("role") ?? "status",
        );
        setAttributeIfChanged(
          toast,
          "aria-live",
          toast.getAttribute("aria-live") ?? "polite",
        );
        setAttributeIfChanged(
          toast,
          "aria-atomic",
          toast.getAttribute("aria-atomic") ?? "true",
        );

        const relationships = generatedRelationships.get(toast) ?? {};
        const title = toast.querySelector<HTMLElement>(titleSelector);
        const description =
          toast.querySelector<HTMLElement>(descriptionSelector);
        const labelledby = toast.getAttribute("aria-labelledby");
        const describedby = toast.getAttribute("aria-describedby");

        if (title) {
          if (!title.id) title.id = `toast-title-${String(toastIdCounter++)}`;
          if (!labelledby || labelledby === relationships.labelledby) {
            setAttributeIfChanged(toast, "aria-labelledby", title.id);
            relationships.labelledby = title.id;
          }
        } else if (
          relationships.labelledby &&
          labelledby === relationships.labelledby
        ) {
          toast.removeAttribute("aria-labelledby");
          delete relationships.labelledby;
        }

        if (description) {
          if (!description.id) {
            description.id = `toast-description-${String(toastIdCounter++)}`;
          }
          if (!describedby || describedby === relationships.describedby) {
            setAttributeIfChanged(toast, "aria-describedby", description.id);
            relationships.describedby = description.id;
          }
        } else if (
          relationships.describedby &&
          describedby === relationships.describedby
        ) {
          toast.removeAttribute("aria-describedby");
          delete relationships.describedby;
        }
        generatedRelationships.set(toast, relationships);

        const type = toast.getAttribute("type");
        const variant = toast.getAttribute("data-variant");
        const dataType = toast.getAttribute("data-type");
        const previousType = mirroredTypes.get(toast);
        let nextType = "default";
        let typeSource: ToastTypeSource = "default";

        if (type && toastTypes.has(type)) {
          nextType = type;
          typeSource = "type";
        } else if (variant && toastTypes.has(variant)) {
          nextType = variant;
          typeSource = "variant";
        } else if (
          dataType &&
          toastTypes.has(dataType) &&
          (!previousType ||
            previousType.source === "data-type" ||
            dataType !== previousType.value)
        ) {
          nextType = dataType;
          typeSource = "data-type";
        }

        setAttributeIfChanged(toast, "data-type", nextType);
        mirroredTypes.set(toast, { source: typeSource, value: nextType });

        const open = !toast.hidden;
        setAttributeIfChanged(toast, "aria-hidden", String(!open));
        setAttributeIfChanged(toast, "data-state", open ? "open" : "closed");
        setAttributeIfChanged(toast, "data-visible", String(open));
      };

      const bindActionButton = (button: HTMLElement) => {
        if (
          button instanceof HTMLButtonElement &&
          !button.hasAttribute("type")
        ) {
          button.type = "button";
        }
      };

      const bindCloseButton = (button: HTMLElement) => {
        if (cleanupButtons.has(button)) return;
        bindActionButton(button);
        setAttributeIfChanged(
          button,
          "aria-label",
          button.getAttribute("aria-label") ?? "Close toast",
        );

        const handleClick = () => {
          const toast = button.closest<HTMLElement>(
            '[data-slot="toast"], [ng-toast]',
          );
          if (toast) {
            toast.hidden = true;
            toast.setAttribute("aria-hidden", "true");
            toast.setAttribute("data-state", "closed");
            toast.setAttribute("data-visible", "false");
          }
        };

        button.addEventListener("click", handleClick);
        cleanupButtons.set(button, () => {
          button.removeEventListener("click", handleClick);
        });
      };

      const bindToaster = () => {
        syncPosition();
        queryAll<HTMLElement>(element, toastSelector).forEach(bindToast);
        queryAll<HTMLElement>(element, actionSelector).forEach(
          bindActionButton,
        );
        queryAll<HTMLElement>(element, closeSelector).forEach(bindCloseButton);
        cleanupButtons.forEach((cleanup, button) => {
          if (!button.isConnected || !element.contains(button)) {
            cleanup();
            cleanupButtons.delete(button);
          }
        });
      };

      const observer = new MutationObserver(bindToaster);
      observer.observe(element, {
        attributes: true,
        attributeFilter: [
          "aria-describedby",
          "aria-labelledby",
          "data-position",
          "data-type",
          "data-variant",
          "hidden",
          "id",
          "position",
          "type",
        ],
        childList: true,
        subtree: true,
      });

      bindToaster();

      onDestroy(scope, () => {
        observer.disconnect();
        cleanupButtons.forEach((cleanup) => {
          cleanup();
        });
        cleanupButtons.clear();
      });
    },
  };
}
