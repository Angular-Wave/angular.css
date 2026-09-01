import type {} from "@angular-wave/angular.ts";
import EmblaCarousel, {
  type EmblaCarouselType,
  type EmblaOptionsType,
  type EmblaPluginType,
} from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";

import { onDestroy, query, queryAll } from "../../internal/dom";

const ROOT_SELECTOR = ".carousel, [ng-carousel]";
const ITEM_SELECTOR = ".carousel-item";
const DOT_SELECTOR = ".carousel-dot";
const PREVIOUS_SELECTOR = ".carousel-previous";
const NEXT_SELECTOR = ".carousel-next";

export interface CarouselChangeDetail {
  api: EmblaCarouselType;
  count: number;
  index: number;
  item: HTMLElement | null;
  itemCount: number;
  itemIndex: number;
}

const setAttributeIfChanged = (
  element: HTMLElement,
  name: string,
  value: string,
) => {
  if (element.getAttribute(name) !== value) {
    element.setAttribute(name, value);
  }
};

const hasEnabledAttribute = (element: HTMLElement, name: string): boolean => {
  const value = element.getAttribute(name);
  return value !== null && value !== "false";
};

const parsePositiveInteger = (
  element: HTMLElement,
  name: string,
): number | undefined => {
  const value = Number.parseInt(element.getAttribute(name) ?? "", 10);
  return Number.isFinite(value) && value > 0 ? value : undefined;
};

export function carouselDirective(): ng.Directive {
  return {
    link(scope: ng.Scope, element: HTMLElement) {
      const viewport = query(element, ".carousel-content", HTMLElement);
      const track = query(element, ".carousel-track", HTMLElement);

      if (!viewport || track?.parentElement !== viewport) return;

      const belongsToThisCarousel = (candidate: Element): boolean =>
        candidate.closest(ROOT_SELECTOR) === element;
      const getItems = (): HTMLElement[] =>
        queryAll<HTMLElement>(track, ITEM_SELECTOR).filter(
          belongsToThisCarousel,
        );
      const getDots = (): HTMLElement[] =>
        queryAll<HTMLElement>(element, DOT_SELECTOR).filter(
          belongsToThisCarousel,
        );
      const getOrientation = (): "horizontal" | "vertical" =>
        element.getAttribute("orientation") === "vertical" ||
        element.getAttribute("data-orientation") === "vertical"
          ? "vertical"
          : "horizontal";
      const getDirection = (): "ltr" | "rtl" => {
        const direction =
          element.getAttribute("dir") ??
          element.closest<HTMLElement>("[dir]")?.getAttribute("dir");
        return direction === "rtl" ? "rtl" : "ltr";
      };
      const getOptions = (): EmblaOptionsType => {
        const align = element.getAttribute("align");
        const containScroll = element.getAttribute("contain-scroll");

        return {
          align:
            align === "start" || align === "center" || align === "end"
              ? align
              : "center",
          axis: getOrientation() === "vertical" ? "y" : "x",
          containScroll:
            containScroll === "false"
              ? false
              : containScroll === "keepSnaps"
                ? "keepSnaps"
                : "trimSnaps",
          direction: getDirection(),
          dragFree: hasEnabledAttribute(element, "drag-free"),
          loop: hasEnabledAttribute(element, "loop"),
          skipSnaps: hasEnabledAttribute(element, "skip-snaps"),
          slidesToScroll:
            parsePositiveInteger(element, "slides-to-scroll") ?? 1,
          startIndex: Math.max(
            0,
            getItems().findIndex(
              (item) => item.getAttribute("data-active") === "true",
            ),
          ),
          watchDrag: element.getAttribute("draggable") !== "false",
        };
      };
      const getPlugins = (): EmblaPluginType[] => {
        if (!hasEnabledAttribute(element, "autoplay")) return [];

        return [
          Autoplay({
            delay: parsePositiveInteger(element, "autoplay-delay") ?? 2000,
            stopOnFocusIn: true,
            stopOnInteraction: true,
            stopOnMouseEnter: true,
          }),
        ];
      };

      const api = EmblaCarousel(viewport, getOptions(), getPlugins());
      let destroyed = false;
      let reinitializeQueued = false;
      const directionOwner = element.closest<HTMLElement>("[dir]") ?? element;

      const syncStaticSemantics = () => {
        const items = getItems();
        const dots = getDots();
        if (element.tagName !== "SECTION" && !element.hasAttribute("role")) {
          setAttributeIfChanged(element, "role", "region");
        }
        setAttributeIfChanged(element, "aria-roledescription", "carousel");
        setAttributeIfChanged(
          element,
          "tabindex",
          element.getAttribute("tabindex") ?? "0",
        );
        setAttributeIfChanged(element, "data-orientation", getOrientation());
        setAttributeIfChanged(element, "data-direction", getDirection());
        setAttributeIfChanged(element, "data-item-count", String(items.length));

        items.forEach((item, index) => {
          setAttributeIfChanged(item, "role", "group");
          setAttributeIfChanged(item, "aria-roledescription", "slide");
          setAttributeIfChanged(
            item,
            "aria-label",
            item.getAttribute("aria-label") ??
              `${String(index + 1)} of ${String(items.length)}`,
          );
          setAttributeIfChanged(item, "data-index", String(index));
        });
        dots.forEach((dot, index) => {
          setAttributeIfChanged(
            dot,
            "aria-label",
            dot.getAttribute("aria-label") ??
              `Go to slide ${String(index + 1)}`,
          );
          setAttributeIfChanged(dot, "data-index", String(index));
        });
      };

      const getSelectedItemIndex = (): number => {
        const selectedSnap = api.selectedScrollSnap();
        return api.internalEngine().slideRegistry[selectedSnap]?.[0] ?? 0;
      };

      const createDetail = (): CarouselChangeDetail => {
        const items = getItems();
        const itemIndex = Math.min(getSelectedItemIndex(), items.length - 1);
        return {
          api,
          count: api.scrollSnapList().length,
          index: api.selectedScrollSnap(),
          item: items[itemIndex] || null,
          itemCount: items.length,
          itemIndex,
        };
      };

      const syncSelectedState = () => {
        const detail = createDetail();
        const itemsInView = new Set(api.slidesInView());
        const dots = getDots();

        setAttributeIfChanged(element, "data-index", String(detail.index));
        setAttributeIfChanged(element, "data-count", String(detail.count));
        setAttributeIfChanged(
          element,
          "data-can-scroll-previous",
          String(api.canScrollPrev()),
        );
        setAttributeIfChanged(
          element,
          "data-can-scroll-next",
          String(api.canScrollNext()),
        );

        getItems().forEach((item, index) => {
          setAttributeIfChanged(
            item,
            "data-active",
            String(index === detail.itemIndex),
          );
          setAttributeIfChanged(
            item,
            "aria-hidden",
            String(!itemsInView.has(index)),
          );
        });
        dots.forEach((dot, index) => {
          const active = index === detail.index;
          setAttributeIfChanged(dot, "data-active", String(active));
          setAttributeIfChanged(dot, "aria-current", active ? "true" : "false");
          dot.toggleAttribute("hidden", index >= detail.count);
        });

        const previous = query(element, PREVIOUS_SELECTOR, HTMLElement);
        const next = query(element, NEXT_SELECTOR, HTMLElement);
        if (previous && belongsToThisCarousel(previous)) {
          previous.setAttribute("aria-disabled", String(!api.canScrollPrev()));
          previous.toggleAttribute("disabled", !api.canScrollPrev());
        }
        if (next && belongsToThisCarousel(next)) {
          next.setAttribute("aria-disabled", String(!api.canScrollNext()));
          next.toggleAttribute("disabled", !api.canScrollNext());
        }
      };

      const dispatchState = (name: string) => {
        element.dispatchEvent(
          new CustomEvent(name, {
            bubbles: true,
            detail: createDetail(),
          }),
        );
      };
      const handleSelect = () => {
        syncSelectedState();
        dispatchState("angularcss:carousel-change");
      };
      const handleReInit = () => {
        syncStaticSemantics();
        syncSelectedState();
      };
      const handleClick = (event: MouseEvent) => {
        const target = event.target;
        if (!(target instanceof Element)) return;
        const control = target.closest<HTMLElement>(
          `${PREVIOUS_SELECTOR}, ${NEXT_SELECTOR}, ${DOT_SELECTOR}`,
        );
        if (!control || !belongsToThisCarousel(control)) return;

        if (control.matches(PREVIOUS_SELECTOR)) {
          api.scrollPrev();
        } else if (control.matches(NEXT_SELECTOR)) {
          api.scrollNext();
        } else {
          const index = Number.parseInt(
            control.getAttribute("data-index") ?? "",
            10,
          );
          if (Number.isFinite(index)) api.scrollTo(index);
        }
      };
      const handleKeydown = (event: KeyboardEvent) => {
        const vertical = getOrientation() === "vertical";
        const nextKey = vertical ? "ArrowDown" : "ArrowRight";
        const previousKey = vertical ? "ArrowUp" : "ArrowLeft";
        if (event.key !== nextKey && event.key !== previousKey) return;

        event.preventDefault();
        if (event.key === nextKey) api.scrollNext();
        else api.scrollPrev();
      };
      const queueReinitialize = () => {
        if (reinitializeQueued || destroyed) return;
        reinitializeQueued = true;
        queueMicrotask(() => {
          reinitializeQueued = false;
          if (destroyed) return;
          api.reInit(getOptions(), getPlugins());
        });
      };

      api.on("select", handleSelect);
      api.on("reInit", handleReInit);
      api.on("slidesInView", syncSelectedState);
      element.addEventListener("click", handleClick);
      element.addEventListener("keydown", handleKeydown);

      const carouselObserver = new MutationObserver(queueReinitialize);
      carouselObserver.observe(element, {
        attributes: true,
        attributeFilter: [
          "align",
          "autoplay",
          "autoplay-delay",
          "contain-scroll",
          "data-orientation",
          "dir",
          "drag-free",
          "draggable",
          "loop",
          "orientation",
          "skip-snaps",
          "slides-to-scroll",
        ],
        childList: true,
        subtree: true,
      });
      const directionObserver =
        directionOwner === element
          ? null
          : new MutationObserver(queueReinitialize);
      directionObserver?.observe(directionOwner, {
        attributes: true,
        attributeFilter: ["dir"],
      });

      syncStaticSemantics();
      syncSelectedState();
      requestAnimationFrame(() => {
        if (!destroyed) dispatchState("angularcss:carousel-ready");
      });

      onDestroy(scope, () => {
        destroyed = true;
        carouselObserver.disconnect();
        directionObserver?.disconnect();
        element.removeEventListener("click", handleClick);
        element.removeEventListener("keydown", handleKeydown);
        api.destroy();
      });
    },
  };
}
