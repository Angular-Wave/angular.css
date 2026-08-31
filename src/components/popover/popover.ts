import type {} from "@angular-wave/angular.ts";

import { bindEscapeClose, restoreFocus } from "../../internal/disclosure";
import { isDisabled, onDestroy, query, setOpenState } from "../../internal/dom";

let popoverIdCounter = 0;

const alignments = new Set(["center", "end", "start"]);
const sides = new Set(["bottom", "left", "right", "top"]);
const focusableSelector =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';

const setAttributeIfChanged = (
  element: HTMLElement,
  name: string,
  value: string,
) => {
  if (element.getAttribute(name) !== value) {
    element.setAttribute(name, value);
  }
};

export function popoverDirective(): ng.Directive {
  return {
    link(scope: ng.Scope, element: HTMLElement) {
      const directionOwner = element.closest<HTMLElement>("[dir]") ?? element;
      const trigger = query(
        element,
        '[data-slot="popover-trigger"], [ng-popover-trigger]',
        HTMLElement,
      );
      const content = query(
        element,
        '[data-slot="popover-content"], [ng-popover-content]',
        HTMLElement,
      );

      if (!trigger || !content) return;

      const getDirection = () =>
        element.closest<HTMLElement>("[dir]")?.getAttribute("dir") === "rtl"
          ? "rtl"
          : "ltr";
      const syncDirection = () => {
        const direction = getDirection();
        setAttributeIfChanged(element, "data-direction", direction);
        setAttributeIfChanged(content, "data-direction", direction);
      };
      const syncPlacement = () => {
        const authoredSide =
          content.getAttribute("side") ?? content.getAttribute("data-side");
        const side =
          authoredSide && sides.has(authoredSide) ? authoredSide : "bottom";
        const authoredAlign =
          content.getAttribute("align") ?? content.getAttribute("data-align");
        const align =
          authoredAlign && alignments.has(authoredAlign)
            ? authoredAlign
            : "center";
        setAttributeIfChanged(content, "data-side", side);
        setAttributeIfChanged(content, "data-align", align);
      };
      const contentId =
        content.id || `popover-content-${String(popoverIdCounter++)}`;
      content.id = contentId;
      trigger.setAttribute("aria-haspopup", "dialog");
      trigger.setAttribute("aria-controls", contentId);
      content.setAttribute("role", content.getAttribute("role") ?? "dialog");
      content.setAttribute(
        "aria-modal",
        content.getAttribute("aria-modal") ?? "false",
      );
      content.setAttribute(
        "tabindex",
        content.getAttribute("tabindex") ?? "-1",
      );

      let open =
        element.getAttribute("data-open") === "true" ||
        content.getAttribute("data-open") === "true";
      let initialized = false;

      const focusContent = () => {
        const firstFocusable =
          content.querySelector<HTMLElement>(focusableSelector);
        (firstFocusable ?? content).focus({ preventScroll: true });
      };

      const setOpen = (nextOpen: boolean, restoreOnClose = true) => {
        const wasOpen = open;
        const shouldFocus = nextOpen && (!wasOpen || !initialized);
        const state = nextOpen ? "open" : "closed";
        open = nextOpen;
        setAttributeIfChanged(element, "data-open", String(nextOpen));
        setAttributeIfChanged(element, "data-state", state);
        setAttributeIfChanged(trigger, "data-state", state);
        setAttributeIfChanged(trigger, "aria-expanded", String(nextOpen));
        setAttributeIfChanged(trigger, "aria-controls", contentId);
        setAttributeIfChanged(content, "data-state", state);
        setAttributeIfChanged(content, "aria-hidden", String(!nextOpen));
        setOpenState(content, nextOpen);
        if (!nextOpen && wasOpen && restoreOnClose) {
          restoreFocus(trigger);
        } else if (shouldFocus) {
          focusContent();
        }
        initialized = true;
      };

      const handleTriggerClick = (event: MouseEvent) => {
        event.preventDefault();
        if (isDisabled(trigger)) return;
        setOpen(!open);
      };

      const closeOnOutsideClick = (event: MouseEvent) => {
        if (
          open &&
          event.target instanceof Node &&
          !element.contains(event.target)
        ) {
          setOpen(false, false);
        }
      };

      const closeOnFocusOutside = (event: FocusEvent) => {
        if (
          open &&
          event.target instanceof Node &&
          !element.contains(event.target)
        ) {
          setOpen(false, false);
        }
      };

      const syncFromAttribute = (source: HTMLElement) => {
        const nextOpen = source.getAttribute("data-open") === "true";
        if (nextOpen !== open) {
          setOpen(nextOpen);
        }
      };
      const openObserver = new MutationObserver((records) => {
        syncPlacement();
        if (records.some((record) => record.attributeName === "data-open")) {
          syncFromAttribute(content);
        }
      });
      openObserver.observe(content, {
        attributes: true,
        attributeFilter: [
          "align",
          "data-align",
          "data-open",
          "data-side",
          "side",
        ],
      });
      const rootOpenObserver = new MutationObserver(() => {
        syncDirection();
        syncFromAttribute(element);
      });
      rootOpenObserver.observe(element, {
        attributes: true,
        attributeFilter: ["data-open", "dir"],
      });
      const directionObserver =
        directionOwner === element ? null : new MutationObserver(syncDirection);
      directionObserver?.observe(directionOwner, {
        attributes: true,
        attributeFilter: ["dir"],
      });

      syncDirection();
      syncPlacement();
      setOpen(open);
      const cleanupEscapeClose = bindEscapeClose(
        [trigger, content],
        () => open,
        () => {
          setOpen(false);
        },
      );

      trigger.addEventListener("click", handleTriggerClick);
      document.addEventListener("click", closeOnOutsideClick);
      document.addEventListener("focusin", closeOnFocusOutside);

      onDestroy(scope, () => {
        openObserver.disconnect();
        rootOpenObserver.disconnect();
        directionObserver?.disconnect();
        cleanupEscapeClose();
        trigger.removeEventListener("click", handleTriggerClick);
        document.removeEventListener("click", closeOnOutsideClick);
        document.removeEventListener("focusin", closeOnFocusOutside);
      });
    },
  };
}
