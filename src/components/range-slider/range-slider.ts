import type {} from "@angular-wave/angular.ts";

import { onDestroy, queryAll, setAttributeIfChanged } from "../../internal/dom";

const thumbSelector = ':scope > input[type="range"]';
const orientations = new Set(["horizontal", "vertical"]);

type SliderOrientation = "horizontal" | "vertical";

interface SliderValue {
  _max: number;
  _min: number;
  _percent: number;
  _value: number;
}

const orientationFor = (element: HTMLElement): SliderOrientation => {
  const authored = element.getAttribute("orientation");
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
    _max: max,
    _min: min,
    _percent: Math.min(100, Math.max(0, rawPercent)),
    _value: value,
  };
};

const syncInput = (
  element: HTMLInputElement,
  orientation = orientationFor(element),
): SliderValue => {
  const state = sliderValue(element);

  setAttributeIfChanged(element, "aria-orientation", orientation);
  setAttributeIfChanged(element, "orientation", orientation);
  element.style.setProperty("--value", `${String(state._percent)}%`);

  return state;
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
    const states = thumbs.map((input) => syncInput(input, orientation));
    const minAttribute = element.getAttribute("min");
    const maxAttribute = element.getAttribute("max");
    const authoredMin =
      minAttribute === null ? Number.NaN : Number(minAttribute);
    const authoredMax =
      maxAttribute === null ? Number.NaN : Number(maxAttribute);
    const min = Number.isFinite(authoredMin)
      ? authoredMin
      : states.length
        ? Math.min(...states.map((state) => state._min))
        : 0;
    const max = Number.isFinite(authoredMax)
      ? authoredMax
      : states.length
        ? Math.max(...states.map((state) => state._max))
        : 100;
    const physicalPercents = states.map(({ _value: value }) => {
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

    setAttributeIfChanged(element, "orientation", orientation);
    element.style.setProperty("--range-start", `${String(start)}%`);
    element.style.setProperty("--range-end", `${String(end)}%`);
  };

  const observer = new MutationObserver(sync);
  observer.observe(element, {
    attributes: true,
    attributeFilter: [
      "aria-invalid",
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
  sync();
  queueMicrotask(sync);
  requestAnimationFrame(sync);

  return () => {
    observer.disconnect();
    element.removeEventListener("input", sync);
    element.removeEventListener("change", sync);
  };
};

export function rangeSliderDirective(): ng.Directive {
  return {
    link(_scope: ng.Scope, element: HTMLElement) {
      onDestroy(_scope, bindCompositeSlider(element));
    },
  };
}
