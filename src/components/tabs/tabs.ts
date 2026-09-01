import type {} from "@angular-wave/angular.ts";

import { nextIndex, onDestroy, queryAll } from "../../internal/dom";

let tabsIdCounter = 0;
const triggerSelector = ".tabs-trigger";
const contentSelector = ".tabs-content";
const listSelector = '.tabs-list, [role="tablist"]';

const setAttribute = (
  element: HTMLElement,
  name: string,
  value: string,
): void => {
  if (element.getAttribute(name) !== value) {
    element.setAttribute(name, value);
  }
};

export function tabsDirective(): ng.Directive {
  return {
    link(scope: ng.Scope, element: HTMLElement) {
      const directionOwner = element.closest<HTMLElement>("[dir]") ?? element;
      let triggers: HTMLElement[] = [];
      let contents: HTMLElement[] = [];
      let orientation = "horizontal";
      let activeIndex = 0;
      const cleanupTriggers = new WeakMap<HTMLElement, () => void>();

      const isTriggerDisabled = (trigger: HTMLElement) =>
        trigger.hasAttribute("disabled") ||
        trigger.getAttribute("aria-disabled") === "true";
      const getDirection = () =>
        element.closest<HTMLElement>("[dir]")?.getAttribute("dir") === "rtl"
          ? "rtl"
          : "ltr";

      const firstEnabledIndex = () =>
        Math.max(
          0,
          triggers.findIndex((trigger) => !isTriggerDisabled(trigger)),
        );

      const lastEnabledIndex = () => {
        for (let index = triggers.length - 1; index >= 0; index -= 1) {
          if (!isTriggerDisabled(triggers[index])) return index;
        }
        return 0;
      };

      const getNextEnabledIndex = (index: number, direction: 1 | -1) => {
        if (!triggers.length) return -1;
        let next = nextIndex(index, triggers.length, direction);
        let safety = 0;
        while (isTriggerDisabled(triggers[next]) && safety < triggers.length) {
          next = nextIndex(next, triggers.length, direction);
          safety += 1;
        }
        return next;
      };

      const activate = (index: number, focus = false) => {
        if (!triggers.length || index < 0) return;
        const nextActiveIndex = Math.min(index, triggers.length - 1);
        activeIndex = nextActiveIndex;
        triggers.forEach((trigger, triggerIndex) => {
          const selected = triggerIndex === nextActiveIndex;
          const disabled = isTriggerDisabled(trigger);
          setAttribute(trigger, "aria-selected", String(selected));
          setAttribute(trigger, "data-active", String(selected));
          setAttribute(trigger, "tabindex", selected && !disabled ? "0" : "-1");
          setAttribute(trigger, "data-disabled", String(disabled));
          if (selected && focus) trigger.focus();
        });

        contents.forEach((content, contentIndex) => {
          const selected = contentIndex === nextActiveIndex;
          content.hidden = !selected;
          setAttribute(content, "data-active", String(selected));
          setAttribute(content, "role", "tabpanel");
          setAttribute(content, "aria-hidden", String(!selected));
          setAttribute(content, "tabindex", selected ? "0" : "-1");
        });
      };

      const bindTrigger = (trigger: HTMLElement) => {
        if (cleanupTriggers.has(trigger)) return;

        const handleClick = () => {
          const index = triggers.indexOf(trigger);
          if (index >= 0 && !isTriggerDisabled(trigger)) activate(index);
        };
        const handleKeydown = (event: KeyboardEvent) => {
          const index = triggers.indexOf(trigger);
          if (index < 0) return;

          if (
            event.key === "Enter" ||
            event.key === " " ||
            event.key === "Spacebar"
          ) {
            event.preventDefault();
            if (!isTriggerDisabled(trigger)) activate(index, true);
            return;
          }

          if (isTriggerDisabled(trigger)) return;

          const nextKey =
            orientation === "vertical" ? "ArrowDown" : "ArrowRight";
          const previousKey =
            orientation === "vertical" ? "ArrowUp" : "ArrowLeft";

          if (event.key === nextKey || event.key === previousKey) {
            event.preventDefault();
            let direction: 1 | -1 = event.key === nextKey ? 1 : -1;
            if (orientation !== "vertical" && getDirection() === "rtl") {
              direction = direction === 1 ? -1 : 1;
            }
            const next = getNextEnabledIndex(index, direction);
            activate(next, true);
            return;
          }

          if (event.key === "Home" || event.key === "End") {
            event.preventDefault();
            activate(
              event.key === "Home" ? firstEnabledIndex() : lastEnabledIndex(),
              true,
            );
          }
        };

        trigger.addEventListener("click", handleClick);
        trigger.addEventListener("keydown", handleKeydown);
        cleanupTriggers.set(trigger, () => {
          trigger.removeEventListener("click", handleClick);
          trigger.removeEventListener("keydown", handleKeydown);
        });
      };

      const sync = () => {
        triggers = queryAll<HTMLElement>(element, triggerSelector);
        contents = queryAll<HTMLElement>(element, contentSelector);

        const list = element.querySelector<HTMLElement>(listSelector);
        orientation =
          element.getAttribute("orientation") ??
          element.getAttribute("aria-orientation") ??
          list?.getAttribute("aria-orientation") ??
          "horizontal";
        orientation = orientation === "vertical" ? "vertical" : "horizontal";
        setAttribute(element, "data-direction", getDirection());
        setAttribute(element, "data-orientation", orientation);
        if (list) {
          setAttribute(list, "role", "tablist");
          setAttribute(list, "aria-orientation", orientation);
        }

        triggers.forEach((trigger, index) => {
          const content = contents.at(index);
          const triggerId =
            trigger.id || `tabs-trigger-${String(tabsIdCounter++)}`;
          trigger.id = triggerId;
          setAttribute(trigger, "role", "tab");
          if (content) {
            const contentId = content.id || `${triggerId}-content`;
            content.id = contentId;
            setAttribute(trigger, "aria-controls", contentId);
            setAttribute(content, "role", "tabpanel");
            setAttribute(content, "aria-labelledby", triggerId);
          }
          bindTrigger(trigger);
        });

        if (!triggers.length) return;

        const selectedIndex = triggers.findIndex(
          (trigger) =>
            !isTriggerDisabled(trigger) &&
            (trigger.getAttribute("aria-selected") === "true" ||
              trigger.getAttribute("data-active") === "true"),
        );
        const nextActiveIndex =
          selectedIndex >= 0
            ? selectedIndex
            : triggers[activeIndex] && !isTriggerDisabled(triggers[activeIndex])
              ? activeIndex
              : firstEnabledIndex();
        activate(nextActiveIndex);
      };

      const observer = new MutationObserver(sync);
      observer.observe(element, {
        attributes: true,
        attributeFilter: [
          "aria-disabled",
          "aria-orientation",
          "aria-selected",
          "data-active",
          "data-disabled",
          "disabled",
          "orientation",
          "dir",
        ],
        childList: true,
        subtree: true,
      });

      sync();

      const directionObserver =
        directionOwner === element ? null : new MutationObserver(sync);
      directionObserver?.observe(directionOwner, {
        attributes: true,
        attributeFilter: ["dir"],
      });

      onDestroy(scope, () => {
        observer.disconnect();
        directionObserver?.disconnect();
        triggers.forEach((trigger) => cleanupTriggers.get(trigger)?.());
      });
    },
  };
}
