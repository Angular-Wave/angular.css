import type {} from "@angular-wave/angular.ts";

import { onDestroy, query, queryAll } from "../../internal/dom";

type ScrollAreaScope = ng.Scope;

/**
 * Enhances a scrollable layout primitive by exposing scroll-state hooks and making
 * the viewport focusable with minimal semantic defaults.
 */
export function scrollAreaDirective(): ng.Directive {
  return {
    link(scope: ScrollAreaScope, element: HTMLElement) {
      const viewport = query(element, ".scroll-area-viewport", HTMLElement);
      if (!viewport) return;

      viewport.setAttribute(
        "tabindex",
        viewport.getAttribute("tabindex") ?? "0",
      );
      viewport.setAttribute("role", "region");
      viewport.setAttribute(
        "aria-label",
        viewport.getAttribute("aria-label") ??
          element.getAttribute("aria-label") ??
          "Scrollable content",
      );

      const getDirection = () =>
        viewport.closest<HTMLElement>("[dir]")?.getAttribute("dir") === "rtl"
          ? "rtl"
          : "ltr";
      const syncDirection = () => {
        const direction = getDirection();
        element.setAttribute("data-direction", direction);
        viewport.setAttribute("data-direction", direction);
      };
      const scrollbarCleanups = new Map<HTMLElement, () => void>();
      const bindScrollbar = (
        scrollbar: HTMLElement,
        orientation: "horizontal" | "vertical",
      ) => {
        if (scrollbarCleanups.has(scrollbar)) return;

        const handlePointerDown = (event: PointerEvent) => {
          if (event.button !== 0) return;
          event.preventDefault();
          scrollbar.setPointerCapture(event.pointerId);

          const updateScroll = (pointerEvent: PointerEvent) => {
            const bounds = scrollbar.getBoundingClientRect();
            const horizontal = orientation === "horizontal";
            const trackSize = horizontal ? bounds.width : bounds.height;
            const viewportSize = horizontal
              ? viewport.clientWidth
              : viewport.clientHeight;
            const scrollSize = horizontal
              ? viewport.scrollWidth
              : viewport.scrollHeight;
            const maxScroll = Math.max(0, scrollSize - viewportSize);
            if (trackSize <= 0 || maxScroll <= 0) return;

            const pointer = horizontal
              ? pointerEvent.clientX - bounds.left
              : pointerEvent.clientY - bounds.top;
            const thumbSize = Math.max(
              18,
              trackSize * Math.min(1, viewportSize / scrollSize),
            );
            const fraction = Math.max(
              0,
              Math.min(1, (pointer - thumbSize / 2) / (trackSize - thumbSize)),
            );
            const nextScroll = fraction * maxScroll;
            if (horizontal) {
              viewport.scrollLeft =
                getDirection() === "rtl" ? -nextScroll : nextScroll;
            } else {
              viewport.scrollTop = nextScroll;
            }
          };

          const handlePointerMove = (pointerEvent: PointerEvent) => {
            if (pointerEvent.pointerId === event.pointerId) {
              updateScroll(pointerEvent);
            }
          };
          const handlePointerUp = (pointerEvent: PointerEvent) => {
            if (pointerEvent.pointerId !== event.pointerId) return;
            scrollbar.removeEventListener("pointermove", handlePointerMove);
            scrollbar.removeEventListener("pointerup", handlePointerUp);
            scrollbar.removeEventListener("pointercancel", handlePointerUp);
          };

          updateScroll(event);
          scrollbar.addEventListener("pointermove", handlePointerMove);
          scrollbar.addEventListener("pointerup", handlePointerUp);
          scrollbar.addEventListener("pointercancel", handlePointerUp);
        };

        scrollbar.addEventListener("pointerdown", handlePointerDown);
        scrollbarCleanups.set(scrollbar, () => {
          scrollbar.removeEventListener("pointerdown", handlePointerDown);
        });
      };
      const syncScrollbar = (
        scrollbar: HTMLElement,
        orientation: "horizontal" | "vertical",
      ) => {
        const horizontal = orientation === "horizontal";
        const viewportSize = horizontal
          ? viewport.clientWidth
          : viewport.clientHeight;
        const scrollSize = horizontal
          ? viewport.scrollWidth
          : viewport.scrollHeight;
        const scrollPosition = horizontal
          ? Math.abs(viewport.scrollLeft)
          : viewport.scrollTop;
        const trackSize = horizontal
          ? scrollbar.clientWidth
          : scrollbar.clientHeight;
        const maxScroll = Math.max(0, scrollSize - viewportSize);
        const thumb = query(scrollbar, ".scroll-area-thumb", HTMLElement);
        if (!thumb || trackSize <= 0 || scrollSize <= 0) return;

        const thumbSize = Math.max(
          18,
          trackSize * Math.min(1, viewportSize / scrollSize),
        );
        const offset =
          maxScroll > 0
            ? (Math.min(maxScroll, scrollPosition) / maxScroll) *
              (trackSize - thumbSize)
            : 0;
        thumb.style.setProperty(
          horizontal ? "width" : "height",
          `${String(thumbSize)}px`,
        );
        thumb.style.setProperty(
          "transform",
          horizontal
            ? `translateX(${String(offset)}px)`
            : `translateY(${String(offset)}px)`,
        );
        thumb.setAttribute("data-size", String(Math.round(thumbSize)));
        thumb.setAttribute("data-offset", String(Math.round(offset)));
        bindScrollbar(scrollbar, orientation);
      };
      const syncState = () => {
        syncDirection();
        element.setAttribute(
          "data-scrollable-y",
          String(viewport.scrollHeight > viewport.clientHeight),
        );
        element.setAttribute(
          "data-scrollable-x",
          String(viewport.scrollWidth > viewport.clientWidth),
        );
        element.setAttribute("data-scroll-top", String(viewport.scrollTop));
        element.setAttribute("data-scroll-left", String(viewport.scrollLeft));
        element.setAttribute(
          "data-scroll-at-top",
          String(viewport.scrollTop <= 0),
        );
        element.setAttribute(
          "data-scroll-at-bottom",
          String(
            viewport.scrollTop + viewport.clientHeight >= viewport.scrollHeight,
          ),
        );
        queryAll<HTMLElement>(element, ".scroll-area-scrollbar").forEach(
          (scrollbar) => {
            const orientation =
              scrollbar.getAttribute("data-orientation") === "horizontal"
                ? "horizontal"
                : "vertical";
            scrollbar.setAttribute("data-orientation", orientation);
            scrollbar.setAttribute("aria-hidden", "true");
            scrollbar.setAttribute(
              "data-visible",
              orientation === "horizontal"
                ? (element.getAttribute("data-scrollable-x") ?? "false")
                : (element.getAttribute("data-scrollable-y") ?? "false"),
            );
            syncScrollbar(scrollbar, orientation);
          },
        );
        queryAll<HTMLElement>(element, ".scroll-area-thumb").forEach(
          (thumb) => {
            thumb.setAttribute("aria-hidden", "true");
          },
        );
      };

      const observedElements = new Set<Element>();
      const resizeObserver =
        typeof ResizeObserver === "function"
          ? new ResizeObserver(syncState)
          : null;
      const observeElementSize = (target: Element) => {
        if (!resizeObserver || observedElements.has(target)) return;
        observedElements.add(target);
        resizeObserver.observe(target);
      };
      const observeContentSize = () => {
        observeElementSize(viewport);
        Array.from(viewport.children).forEach(observeElementSize);
      };
      const mutationObserver = new MutationObserver(() => {
        observeContentSize();
        syncState();
      });
      const directionObserver = new MutationObserver(() => {
        syncDirection();
      });

      viewport.addEventListener("scroll", syncState);
      mutationObserver.observe(viewport, {
        attributes: true,
        attributeFilter: ["class", "dir", "hidden", "style"],
        childList: true,
        subtree: true,
      });
      directionObserver.observe(element, {
        attributes: true,
        attributeFilter: ["dir"],
      });
      observeContentSize();
      syncState();

      onDestroy(scope, () => {
        viewport.removeEventListener("scroll", syncState);
        mutationObserver.disconnect();
        directionObserver.disconnect();
        resizeObserver?.disconnect();
        scrollbarCleanups.forEach((cleanup) => {
          cleanup();
        });
        scrollbarCleanups.clear();
      });
    },
  };
}
