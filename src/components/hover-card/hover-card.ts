import type {} from "@angular-wave/angular.ts";

import { isDisabled, onDestroy, query, setOpenState } from "../../internal/dom";

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
      const trigger = query(element, ".hover-card-trigger", HTMLElement);
      const content = query(element, ".hover-card-content", HTMLElement);

      if (!trigger || !content) return;

      const directionOwner = element.closest<HTMLElement>("[dir]") ?? element;
      const getDirection = () =>
        element.closest<HTMLElement>("[dir]")?.getAttribute("dir") === "rtl"
          ? "rtl"
          : "ltr";
      const syncDirection = () => {
        const direction = getDirection();
        element.setAttribute("data-direction", direction);
        content.setAttribute("data-direction", direction);
      };
      const syncSide = () => {
        const authored =
          content.getAttribute("side") ?? content.getAttribute("data-side");
        const side = authored && sides.has(authored) ? authored : "bottom";
        if (content.getAttribute("data-side") !== side) {
          content.setAttribute("data-side", side);
        }
      };

      const contentId =
        content.id || `hover-card-content-${String(hoverCardIdCounter++)}`;
      content.id = contentId;
      trigger.setAttribute("aria-controls", contentId);
      trigger.setAttribute("aria-expanded", "false");
      let openState =
        element.getAttribute("data-open") === "true" ||
        content.getAttribute("data-open") === "true";
      const setOpen = (open: boolean) => {
        openState = open;
        element.setAttribute("data-open", String(open));
        element.setAttribute("data-state", open ? "open" : "closed");
        trigger.setAttribute("data-state", open ? "open" : "closed");
        trigger.setAttribute("aria-expanded", String(open));
        content.setAttribute("data-open", String(open));
        content.setAttribute("data-state", open ? "open" : "closed");
        content.setAttribute("aria-hidden", String(!open));
        setOpenState(content, open);
      };
      const syncFromAttribute = (source: HTMLElement) => {
        const nextOpen = source.getAttribute("data-open") === "true";
        if (nextOpen === openState) return;
        setOpen(nextOpen);
      };
      const openObserver = new MutationObserver((records) => {
        syncDirection();
        syncSide();
        const record = records.find(
          (entry) => entry.attributeName === "data-open",
        );
        if (!(record?.target instanceof HTMLElement)) return;
        syncFromAttribute(record.target);
      });
      openObserver.observe(content, {
        attributes: true,
        attributeFilter: ["data-open", "data-side", "side"],
      });
      openObserver.observe(element, {
        attributes: true,
        attributeFilter: ["data-open", "dir"],
      });
      const directionObserver =
        directionOwner === element
          ? null
          : new MutationObserver(() => {
              syncDirection();
            });
      directionObserver?.observe(directionOwner, {
        attributes: true,
        attributeFilter: ["dir"],
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

      syncDirection();
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
        directionObserver?.disconnect();
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
