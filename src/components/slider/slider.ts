import type {} from "@angular-wave/angular.ts";

import { onDestroy, queryAll } from "../../internal/dom";
import { syncNativeControlState } from "../../internal/form";

const thumbSelector = 'input[type="range"].slider-thumb';
const orientations = new Set(["horizontal", "vertical"]);

type SliderOrientation = "horizontal" | "vertical";

interface SliderValue {
  max: number;
  min: number;
  percent: number;
  value: number;
}

const setAttributeIfChanged = (
  element: HTMLElement,
  name: string,
  value: string,
): void => {
  if (element.getAttribute(name) !== value) {
    element.setAttribute(name, value);
  }
};

const orientationFor = (element: HTMLElement): SliderOrientation => {
  const authored =
    element.getAttribute("orientation") ??
    element.getAttribute("data-orientation");
  return authored && orientations.has(authored)
    ? (authored as SliderOrientation)
    : "horizontal";
};

const sliderValue = (element: HTMLInputElement): SliderValue => {
  const min = Number.isFinite(Number(element.min)) ? Number(element.min) : 0;
  const max = Number.isFinite(Number(element.max)) ? Number(element.max) : 100;
  const parsed = Number.parseFloat(element.value);
  const value = Number.isFinite(parsed)
    ? Math.max(min, Math.min(max, parsed))
    : min;
  const rawPercent = max === min ? 0 : ((value - min) / (max - min)) * 100;

  return {
    max,
    min,
    percent: Math.min(100, Math.max(0, rawPercent)),
    value,
  };
};

const syncInput = (
  element: HTMLInputElement,
  orientation = orientationFor(element),
): SliderValue => {
  const state = sliderValue(element);

  syncNativeControlState(element);
  setAttributeIfChanged(element, "role", "slider");
  setAttributeIfChanged(element, "aria-orientation", orientation);
  setAttributeIfChanged(element, "data-orientation", orientation);
  setAttributeIfChanged(element, "aria-valuemin", String(state.min));
  setAttributeIfChanged(element, "aria-valuemax", String(state.max));
  setAttributeIfChanged(element, "aria-valuenow", String(state.value));
  setAttributeIfChanged(
    element,
    "data-invalid",
    String(
      element.getAttribute("aria-invalid") === "true" ||
        element.matches(":invalid"),
    ),
  );
  element.style.setProperty("--value", `${String(state.percent)}%`);
  setAttributeIfChanged(element, "data-value", String(state.value));

  return state;
};

const bindNativeSlider = (element: HTMLInputElement): (() => void) => {
  const sync = () => syncInput(element);
  const observer = new MutationObserver(sync);
  observer.observe(element, {
    attributes: true,
    attributeFilter: [
      "aria-invalid",
      "data-orientation",
      "disabled",
      "max",
      "min",
      "orientation",
      "required",
      "value",
    ],
  });

  element.addEventListener("input", sync);
  element.addEventListener("change", sync);
  sync();
  queueMicrotask(sync);

  return () => {
    observer.disconnect();
    element.removeEventListener("input", sync);
    element.removeEventListener("change", sync);
  };
};

const bindCompositeSlider = (element: HTMLElement): (() => void) => {
  const inputs = () => queryAll<HTMLInputElement>(element, thumbSelector);

  const sync = () => {
    const orientation = orientationFor(element);
    const thumbs = inputs();
    const direction =
      element.closest("[dir]")?.getAttribute("dir") === "rtl" ||
      getComputedStyle(element).direction === "rtl"
        ? "rtl"
        : "ltr";
    const states = thumbs.map((input, index) => {
      setAttributeIfChanged(input, "data-index", String(index));
      return syncInput(input, orientation);
    });
    const minAttribute = element.getAttribute("min");
    const maxAttribute = element.getAttribute("max");
    const authoredMin =
      minAttribute === null ? Number.NaN : Number(minAttribute);
    const authoredMax =
      maxAttribute === null ? Number.NaN : Number(maxAttribute);
    const min = Number.isFinite(authoredMin)
      ? authoredMin
      : states.length
        ? Math.min(...states.map((state) => state.min))
        : 0;
    const max = Number.isFinite(authoredMax)
      ? authoredMax
      : states.length
        ? Math.max(...states.map((state) => state.max))
        : 100;
    const physicalPercents = states.map(({ value }) => {
      const percent =
        max === min
          ? 0
          : Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
      return orientation === "horizontal" && direction === "rtl"
        ? 100 - percent
        : percent;
    });
    const start = physicalPercents.length ? Math.min(...physicalPercents) : 0;
    const end = physicalPercents.length ? Math.max(...physicalPercents) : 0;

    setAttributeIfChanged(element, "data-orientation", orientation);
    setAttributeIfChanged(
      element,
      "data-disabled",
      String(thumbs.length > 0 && thumbs.every((input) => input.disabled)),
    );
    setAttributeIfChanged(
      element,
      "data-values",
      states.map(({ value }) => value).join(","),
    );
    element.style.setProperty("--range-start", `${String(start)}%`);
    element.style.setProperty("--range-end", `${String(end)}%`);
  };

  const handleFocus = (event: FocusEvent) => {
    inputs().forEach((input) =>
      input.toggleAttribute("data-active", input === event.target),
    );
  };

  const observer = new MutationObserver(sync);
  observer.observe(element, {
    attributes: true,
    attributeFilter: [
      "aria-invalid",
      "data-orientation",
      "dir",
      "disabled",
      "max",
      "min",
      "orientation",
      "required",
      "value",
    ],
    childList: true,
    subtree: true,
  });
  element.addEventListener("input", sync);
  element.addEventListener("change", sync);
  element.addEventListener("focusin", handleFocus);
  sync();
  queueMicrotask(sync);
  requestAnimationFrame(sync);

  return () => {
    observer.disconnect();
    element.removeEventListener("input", sync);
    element.removeEventListener("change", sync);
    element.removeEventListener("focusin", handleFocus);
  };
};

export function sliderDirective(): ng.Directive {
  return {
    link(_scope: ng.Scope, element: HTMLElement) {
      const cleanup =
        element instanceof HTMLInputElement
          ? bindNativeSlider(element)
          : bindCompositeSlider(element);
      onDestroy(_scope, cleanup);
    },
  };
}
