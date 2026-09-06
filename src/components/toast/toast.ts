import type {} from "@angular-wave/angular.ts";
import {
  CircleCheck,
  CircleX,
  createElement,
  Info,
  LoaderCircle,
  type IconNode,
  TriangleAlert,
  X,
} from "lucide";

import { onDestroy, queryAll, setAttributeIfChanged } from "../../internal/dom";

const toastSelector = ":scope > article";
const closeSelector = ':scope > article > button[value="close"]';
const actionSelector = ':scope > article > button:not([value="close"])';
const titleSelector =
  ":scope > :is(header, section) > :is(h1, h2, h3, h4, h5, h6), :scope > :is(h1, h2, h3, h4, h5, h6)";
const descriptionSelector = ":scope > :is(header, section) > p, :scope > p";
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
const toastIcons: Partial<Record<string, IconNode>> = {
  error: CircleX,
  info: Info,
  loading: LoaderCircle,
  success: CircleCheck,
  warning: TriangleAlert,
};
let toastIdCounter = 0;

const getToasterPosition = (element: HTMLElement) => {
  const position = element.getAttribute("position");
  return position && toasterPositions.has(position) ? position : "bottom-right";
};

export function toastDirective(): ng.Directive {
  return {
    link(scope: ng.Scope, element: HTMLElement) {
      const cleanupButtons = new Map<HTMLElement, () => void>();
      const generatedRelationships = new WeakMap<
        HTMLElement,
        { describedby?: string; labelledby?: string }
      >();
      const generatedIcons = new WeakMap<HTMLElement, string>();

      const syncGeneratedIcon = (container: HTMLElement, iconName: string) => {
        const icon = toastIcons[iconName] ?? (iconName === "close" ? X : null);
        if (!icon || generatedIcons.get(container) === iconName) return;
        if (container.childElementCount > 0 && !generatedIcons.has(container)) {
          return;
        }
        container.replaceChildren(
          createElement(icon, {
            "aria-hidden": "true",
            focusable: "false",
            height: 16,
            width: 16,
          }),
        );
        generatedIcons.set(container, iconName);
      };

      const syncPosition = () => {
        const position = getToasterPosition(element);
        setAttributeIfChanged(element, "position", position);
      };

      const bindToast = (toast: HTMLElement) => {
        setAttributeIfChanged(toast, "role", "status");
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

        const authoredType = toast.getAttribute("type");
        const nextType =
          authoredType && toastTypes.has(authoredType)
            ? authoredType
            : "default";
        setAttributeIfChanged(toast, "type", nextType);
        const icon = toast.querySelector<HTMLElement>(":scope > figure");
        if (icon && nextType !== "default") {
          syncGeneratedIcon(icon, nextType);
        }
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
        syncGeneratedIcon(button, "close");

        const handleClick = () => {
          const toast = button.closest<HTMLElement>("article");
          if (toast) toast.hidden = true;
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
