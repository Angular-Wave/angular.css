import type {} from "@angular-wave/angular.ts";

import { onDestroy, queryAll } from "../../internal/dom";

const DEFAULT_MIN_SIZE = 0.25;
const DEFAULT_MAX_SIZE = 4;
const DEFAULT_STEP = 0.25;
let resizableIdCounter = 0;

const GROUP_SELECTOR =
  '[data-slot="resizable-panel-group"], [ng-resizable-panel-group]';
const PANEL_SELECTOR = '[data-slot="resizable-panel"], [ng-resizable-panel]';
const HANDLE_SELECTOR = '[data-slot="resizable-handle"], [ng-resizable-handle]';

type ResizableOrientation = "horizontal" | "vertical";

const numberAttribute = (
  element: HTMLElement,
  attribute: string,
  fallback: number,
) => {
  const rawValue = element.getAttribute(attribute);
  if (rawValue === null || rawValue === "") return fallback;
  const value = Number(rawValue);
  return Number.isFinite(value) ? value : fallback;
};

const setAttributeIfChanged = (
  element: HTMLElement,
  name: string,
  value: string,
) => {
  if (element.getAttribute(name) !== value) {
    element.setAttribute(name, value);
  }
};

export function resizablePanelGroupDirective(): ng.Directive {
  return {
    link(scope: ng.Scope, element: HTMLElement) {
      const ownedDescendants = <T extends HTMLElement>(selector: string) =>
        queryAll<T>(element, selector).filter(
          (descendant) => descendant.closest(GROUP_SELECTOR) === element,
        );
      let panels = ownedDescendants<HTMLElement>(PANEL_SELECTOR);
      let handles = ownedDescendants<HTMLElement>(HANDLE_SELECTOR);
      const ownedHandleOrientations = new WeakSet<HTMLElement>();
      const cleanupHandles = new WeakMap<HTMLElement, () => void>();
      const knownHandles = new Set<HTMLElement>();
      const directionOwner = element.closest<HTMLElement>("[dir]") || element;

      const panelSize = (panel: HTMLElement) =>
        Number(panel.style.getPropertyValue("--panel-size")) || 1;
      const getGroupOrientation = (): ResizableOrientation => {
        const orientation = element.getAttribute("orientation");
        if (orientation === "vertical") return "vertical";
        if (orientation === "horizontal") return "horizontal";
        return element.getAttribute("data-orientation") === "vertical"
          ? "vertical"
          : "horizontal";
      };
      const getDefaultHandleOrientation = (): ResizableOrientation =>
        getGroupOrientation() === "vertical" ? "horizontal" : "vertical";
      const syncOrientation = () => {
        const groupOrientation = getGroupOrientation();
        setAttributeIfChanged(element, "data-orientation", groupOrientation);
        setAttributeIfChanged(
          element,
          "data-direction",
          element.closest<HTMLElement>("[dir]")?.getAttribute("dir") === "rtl"
            ? "rtl"
            : "ltr",
        );
        handles.forEach((handle) => {
          if (
            !handle.hasAttribute("aria-orientation") ||
            ownedHandleOrientations.has(handle)
          ) {
            setAttributeIfChanged(
              handle,
              "aria-orientation",
              getDefaultHandleOrientation(),
            );
            ownedHandleOrientations.add(handle);
          }
          setAttributeIfChanged(
            handle,
            "data-orientation",
            handle.getAttribute("aria-orientation") || "vertical",
          );
        });
      };
      const syncHandle = (handle: HTMLElement, before: HTMLElement) => {
        const value = panelSize(before);
        const min = numberAttribute(
          handle,
          "data-min-size",
          numberAttribute(before, "data-min-size", DEFAULT_MIN_SIZE),
        );
        const max = numberAttribute(
          handle,
          "data-max-size",
          numberAttribute(before, "data-max-size", DEFAULT_MAX_SIZE),
        );
        handle.setAttribute("aria-valuemin", String(min));
        handle.setAttribute("aria-valuemax", String(max));
        handle.setAttribute("aria-valuenow", String(value));
      };

      const bindHandle = (handle: HTMLElement) => {
        if (cleanupHandles.has(handle)) return;
        handle.setAttribute("tabindex", handle.getAttribute("tabindex") || "0");
        handle.setAttribute("role", handle.getAttribute("role") || "separator");
        let stopPointerResize: (() => void) | null = null;

        const handlePointerDown = (event: PointerEvent) => {
          if (
            event.button !== 0 ||
            handle.getAttribute("aria-disabled") === "true"
          ) {
            return;
          }

          const index = handles.indexOf(handle);
          const before = panels[index];
          const after = panels[index + 1];
          if (!before || !after) return;

          event.preventDefault();
          handle.focus({ preventScroll: true });

          const vertical = getGroupOrientation() === "vertical";
          const beforeSize = panelSize(before);
          const afterSize = panelSize(after);
          const totalSize = beforeSize + afterSize;
          const beforeRect = before.getBoundingClientRect();
          const afterRect = after.getBoundingClientRect();
          const pairPixels = vertical
            ? beforeRect.height + afterRect.height
            : beforeRect.width + afterRect.width;
          if (pairPixels <= 0) return;

          const startPosition = vertical ? event.clientY : event.clientX;
          const min = numberAttribute(
            handle,
            "data-min-size",
            numberAttribute(before, "data-min-size", DEFAULT_MIN_SIZE),
          );
          const max = numberAttribute(
            handle,
            "data-max-size",
            numberAttribute(before, "data-max-size", DEFAULT_MAX_SIZE),
          );
          const afterMin = numberAttribute(
            after,
            "data-min-size",
            DEFAULT_MIN_SIZE,
          );
          const boundedMax = Math.min(max, totalSize - afterMin);
          const rtl =
            !vertical && getComputedStyle(element).direction === "rtl";

          const finish = () => {
            window.removeEventListener("pointermove", move);
            window.removeEventListener("pointerup", finish);
            window.removeEventListener("pointercancel", finish);
            handle.removeAttribute("data-resizing");
            element.removeAttribute("data-resizing");
            stopPointerResize = null;
          };
          const move = (moveEvent: PointerEvent) => {
            const position = vertical ? moveEvent.clientY : moveEvent.clientX;
            const pixelDelta = (position - startPosition) * (rtl ? -1 : 1);
            const sizeDelta = (pixelDelta / pairPixels) * totalSize;
            const nextBeforeSize = Math.min(
              Math.max(beforeSize + sizeDelta, min),
              boundedMax,
            );
            before.style.setProperty("--panel-size", String(nextBeforeSize));
            after.style.setProperty(
              "--panel-size",
              String(totalSize - nextBeforeSize),
            );
            syncHandle(handle, before);
          };

          stopPointerResize?.();
          stopPointerResize = finish;
          handle.setAttribute("data-resizing", "true");
          element.setAttribute("data-resizing", "true");
          window.addEventListener("pointermove", move);
          window.addEventListener("pointerup", finish);
          window.addEventListener("pointercancel", finish);
        };

        const handleKeydown = (event: KeyboardEvent) => {
          const index = handles.indexOf(handle);
          const orientation = handle.getAttribute("aria-orientation");
          const horizontal = orientation === "horizontal";
          const supportedKeys = horizontal
            ? ["ArrowUp", "ArrowDown", "Home", "End"]
            : ["ArrowLeft", "ArrowRight", "Home", "End"];
          if (!supportedKeys.includes(event.key)) return;

          const before = panels[index];
          const after = panels[index + 1];
          if (!before || !after) return;

          event.preventDefault();
          const beforeSize = panelSize(before);
          const afterSize = panelSize(after);
          const totalSize = beforeSize + afterSize;
          const min = numberAttribute(
            handle,
            "data-min-size",
            numberAttribute(before, "data-min-size", DEFAULT_MIN_SIZE),
          );
          const max = numberAttribute(
            handle,
            "data-max-size",
            numberAttribute(before, "data-max-size", DEFAULT_MAX_SIZE),
          );
          const afterMin = numberAttribute(
            after,
            "data-min-size",
            DEFAULT_MIN_SIZE,
          );
          const boundedMax = Math.min(max, totalSize - afterMin);
          const step = numberAttribute(
            handle,
            "data-step",
            numberAttribute(element, "data-step", DEFAULT_STEP),
          );
          const rtl = getComputedStyle(element).direction === "rtl";

          let nextBeforeSize = beforeSize;
          if (event.key === "Home") nextBeforeSize = min;
          if (event.key === "End") nextBeforeSize = boundedMax;
          if (event.key === "ArrowRight") {
            nextBeforeSize = beforeSize + (rtl ? -step : step);
          }
          if (event.key === "ArrowLeft") {
            nextBeforeSize = beforeSize + (rtl ? step : -step);
          }
          if (event.key === "ArrowDown") nextBeforeSize = beforeSize + step;
          if (event.key === "ArrowUp") nextBeforeSize = beforeSize - step;

          nextBeforeSize = Math.min(Math.max(nextBeforeSize, min), boundedMax);
          before.style.setProperty("--panel-size", String(nextBeforeSize));
          after.style.setProperty(
            "--panel-size",
            String(totalSize - nextBeforeSize),
          );
          syncHandle(handle, before);
        };

        handle.addEventListener("keydown", handleKeydown);
        handle.addEventListener("pointerdown", handlePointerDown);
        cleanupHandles.set(handle, () => {
          stopPointerResize?.();
          handle.removeEventListener("keydown", handleKeydown);
          handle.removeEventListener("pointerdown", handlePointerDown);
        });
        knownHandles.add(handle);
      };

      const syncHandles = () => {
        panels = ownedDescendants<HTMLElement>(PANEL_SELECTOR);
        handles = ownedDescendants<HTMLElement>(HANDLE_SELECTOR);
        syncOrientation();
        handles.forEach((handle, index) => {
          bindHandle(handle);
          const before = panels[index];
          const after = panels[index + 1];
          if (before) {
            if (!before.id)
              before.id = `resizable-panel-${resizableIdCounter++}`;
            setAttributeIfChanged(before, "data-index", String(index));
            setAttributeIfChanged(
              before,
              "data-size",
              String(panelSize(before)),
            );
            syncHandle(handle, before);
          }
          if (after) {
            if (!after.id) after.id = `resizable-panel-${resizableIdCounter++}`;
            setAttributeIfChanged(after, "data-index", String(index + 1));
            setAttributeIfChanged(after, "data-size", String(panelSize(after)));
            setAttributeIfChanged(
              handle,
              "aria-controls",
              `${before.id} ${after.id}`,
            );
          }
        });
      };
      const panelObserver = new MutationObserver(syncHandles);
      panelObserver.observe(element, {
        attributes: true,
        attributeFilter: [
          "aria-orientation",
          "data-max-size",
          "data-min-size",
          "data-orientation",
          "orientation",
          "style",
        ],
        childList: true,
        subtree: true,
      });
      const directionObserver =
        directionOwner === element ? null : new MutationObserver(syncHandles);
      directionObserver?.observe(directionOwner, {
        attributes: true,
        attributeFilter: ["dir"],
      });
      syncHandles();

      onDestroy(scope, () => {
        panelObserver.disconnect();
        directionObserver?.disconnect();
        knownHandles.forEach((handle) => {
          cleanupHandles.get(handle)?.();
        });
      });
    },
  };
}
