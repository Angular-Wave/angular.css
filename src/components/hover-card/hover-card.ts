import type {} from "@angular-wave/angular.ts";

import { isDisabled, onDestroy, setOpenState } from "../../internal/dom";

let hoverCardIdCounter = 0;

const sides = new Set(["bottom", "left", "right", "top"]);

const delayFor = (
  element: HTMLElement,
  attribute: "close-delay" | "open-delay",
  fallback: number,
): number => {
  const authored = element.getAttribute(attribute);
  if (authored === null) return fallback;
  const value = Number(authored);
  return Number.isFinite(value) && value >= 0 ? value : fallback;
};

export function hoverCardDirective(): ng.Directive {
  return {
    link(scope: ng.Scope, element: HTMLElement) {
      const trigger = element.querySelector<HTMLElement>(
        ":scope > :is(a, button)",
      );
      const content = element.querySelector<HTMLElement>(
        ":scope > :is(aside, article, section):last-child",
      );

      if (!trigger || !content) return;

      const syncSide = () => {
        const authored = content.getAttribute("side");
        const side = authored && sides.has(authored) ? authored : "bottom";
        if (content.getAttribute("side") !== side) {
          content.setAttribute("side", side);
        }
      };

      const contentId =
        content.id || `hover-card-content-${String(hoverCardIdCounter++)}`;
      content.id = contentId;
      trigger.setAttribute("aria-controls", contentId);
      trigger.setAttribute("aria-expanded", "false");
      let openState = element.hasAttribute("open");
      const setOpen = (open: boolean) => {
        openState = open;
        element.toggleAttribute("open", open);
        trigger.setAttribute("aria-expanded", String(open));
        content.setAttribute("aria-hidden", String(!open));
        setOpenState(content, open);
      };
      const syncFromAttribute = () => {
        const nextOpen = element.hasAttribute("open");
        if (nextOpen === openState) return;
        setOpen(nextOpen);
      };
      const openObserver = new MutationObserver((records) => {
        syncSide();
        const record = records.find((entry) => entry.attributeName === "open");
        if (!(record?.target instanceof HTMLElement)) return;
        syncFromAttribute();
      });
      openObserver.observe(content, {
        attributes: true,
        attributeFilter: ["side"],
      });
      openObserver.observe(element, {
        attributes: true,
        attributeFilter: ["dir", "open"],
      });

      const handleOpen = () => {
        if (isDisabled(trigger)) return;
        setOpen(true);
      };
      let openTimer: ReturnType<typeof setTimeout> | undefined;
      let closeTimer: ReturnType<typeof setTimeout> | undefined;
      const clearOpenTimer = () => {
        if (openTimer !== undefined) clearTimeout(openTimer);
        openTimer = undefined;
      };
      const clearCloseTimer = () => {
        if (closeTimer !== undefined) clearTimeout(closeTimer);
        closeTimer = undefined;
      };
      const scheduleOpen = () => {
        if (isDisabled(trigger)) return;
        clearCloseTimer();
        clearOpenTimer();
        const delay = delayFor(element, "open-delay", 100);
        if (delay === 0) {
          handleOpen();
          return;
        }
        openTimer = setTimeout(() => {
          openTimer = undefined;
          handleOpen();
        }, delay);
      };
      const scheduleClose = () => {
        clearOpenTimer();
        clearCloseTimer();
        const delay = delayFor(element, "close-delay", 100);
        if (delay === 0) {
          setOpen(false);
          return;
        }
        closeTimer = setTimeout(() => {
          closeTimer = undefined;
          setOpen(false);
        }, delay);
      };
      const handleFocus = () => {
        clearOpenTimer();
        clearCloseTimer();
        handleOpen();
      };
      const handleBlur = (event: FocusEvent) => {
        if (
          event.relatedTarget instanceof Node &&
          element.contains(event.relatedTarget)
        ) {
          return;
        }
        scheduleClose();
      };
      const handleEscape = (event: KeyboardEvent) => {
        if (!openState || event.key !== "Escape") return;
        clearOpenTimer();
        clearCloseTimer();
        setOpen(false);
        trigger.focus({ preventScroll: true });
      };

      syncSide();
      setOpen(openState);

      trigger.addEventListener("mouseenter", scheduleOpen);
      trigger.addEventListener("mouseleave", scheduleClose);
      trigger.addEventListener("focus", handleFocus);
      trigger.addEventListener("blur", handleBlur);
      content.addEventListener("mouseenter", clearCloseTimer);
      content.addEventListener("mouseleave", scheduleClose);
      content.addEventListener("focusin", handleFocus);
      content.addEventListener("focusout", handleBlur);
      document.addEventListener("keydown", handleEscape);

      onDestroy(scope, () => {
        clearOpenTimer();
        clearCloseTimer();
        openObserver.disconnect();
        trigger.removeEventListener("mouseenter", scheduleOpen);
        trigger.removeEventListener("mouseleave", scheduleClose);
        trigger.removeEventListener("focus", handleFocus);
        trigger.removeEventListener("blur", handleBlur);
        content.removeEventListener("mouseenter", clearCloseTimer);
        content.removeEventListener("mouseleave", scheduleClose);
        content.removeEventListener("focusin", handleFocus);
        content.removeEventListener("focusout", handleBlur);
        document.removeEventListener("keydown", handleEscape);
      });
    },
  };
}
