import type {} from "@angular-wave/angular.ts";

import { onDestroy } from "../../internal/dom";

let accordionIdCounter = 0;

type AccordionItem = HTMLElement;
type AccordionItemState = "open" | "closed";

const isBooleanAttribute = (value: string | null): boolean =>
  value === "" || value === "true";

const isElementClosed = (value: string | null): boolean =>
  value === "closed" || value === "0" || value === "false";

const setAttributeIfChanged = (
  element: HTMLElement,
  name: string,
  value: string,
): void => {
  if (element.getAttribute(name) !== value) {
    element.setAttribute(name, value);
  }
};

const resolveItems = (element: HTMLElement): AccordionItem[] => {
  const explicit = Array.from(element.children).filter(
    (child): child is AccordionItem =>
      child instanceof HTMLElement &&
      (child.matches(".accordion-item") || child.matches(".accordion-item")),
  );
  if (explicit.length) {
    return explicit;
  }

  return Array.from(element.children).filter(
    (child): child is AccordionItem => child instanceof HTMLElement,
  );
};

const resolveHeader = (item: AccordionItem): HTMLElement | null => {
  return (
    item.querySelector<HTMLElement>(".accordion-header") ??
    (item.firstElementChild instanceof HTMLElement
      ? item.firstElementChild
      : null)
  );
};

const resolvePanel = (
  item: AccordionItem,
  header: Element,
): HTMLElement | null => {
  return (
    item.querySelector<HTMLElement>(".accordion-content") ??
    item.querySelector<HTMLElement>(".accordion-panel") ??
    (header.nextElementSibling instanceof HTMLElement
      ? header.nextElementSibling
      : item.lastElementChild instanceof HTMLElement
        ? item.lastElementChild
        : null)
  );
};

const resolveTrigger = (header: HTMLElement): HTMLButtonElement | null => {
  const slotTrigger =
    header.querySelector<HTMLElement>(".accordion-trigger") ??
    header.querySelector<HTMLElement>("button.accordion-trigger");
  const trigger = slotTrigger ?? header.querySelector("button");
  if (trigger instanceof HTMLButtonElement) return trigger;
  return header instanceof HTMLButtonElement ? header : null;
};

const setItemState = (item: AccordionItem, open: boolean): void => {
  const header = resolveHeader(item);
  const panel = header ? resolvePanel(item, header) : null;
  const trigger = header ? resolveTrigger(header) : null;
  if (!header || !panel || !trigger) return;

  const itemState: AccordionItemState = open ? "open" : "closed";

  setAttributeIfChanged(item, "data-state", itemState);
  setAttributeIfChanged(header, "data-state", itemState);
  setAttributeIfChanged(trigger, "aria-expanded", String(open));
  setAttributeIfChanged(trigger, "data-state", itemState);
  setAttributeIfChanged(panel, "data-open", String(open));
  setAttributeIfChanged(panel, "data-state", itemState);
  setAttributeIfChanged(panel, "aria-hidden", String(!open));
};

export function accordionDirective(): ng.Directive {
  return {
    link(scope: ng.Scope, element: HTMLElement) {
      const items = resolveItems(element);
      const allowsMultiple =
        element.hasAttribute("multiple") ||
        element.getAttribute("type") === "multiple" ||
        element.getAttribute("data-type") === "multiple";
      const isItemDisabled = (item: AccordionItem, button: HTMLButtonElement) =>
        button.disabled ||
        button.getAttribute("aria-disabled") === "true" ||
        isBooleanAttribute(item.getAttribute("data-disabled")) ||
        item.hasAttribute("disabled");

      const isPanelOpen = (item: AccordionItem): boolean => {
        const header = resolveHeader(item);
        if (!header) return false;
        const panel = resolvePanel(item, header);
        const trigger = resolveTrigger(header);
        if (!panel || !trigger) return false;

        const triggerOpen = trigger.getAttribute("aria-expanded") === "true";
        const itemOpen = item.getAttribute("data-state") === "open";
        const panelOpen =
          panel.getAttribute("data-state") === "open" ||
          panel.getAttribute("data-open") === "true";
        return triggerOpen || itemOpen || panelOpen;
      };

      const cleanupButtons: Array<() => void> = [];
      let hasInitialOpen = false;
      let reflectingState = false;

      const setItemStateFromDirective = (
        item: AccordionItem,
        open: boolean,
      ) => {
        reflectingState = true;
        setItemState(item, open);
        queueMicrotask(() => {
          reflectingState = false;
        });
      };

      items.forEach((item) => {
        const header = resolveHeader(item);
        if (!header) return;

        const panel = resolvePanel(item, header);
        const button = resolveTrigger(header);
        if (!button || !panel) return;

        if (!button.querySelector("svg")) {
          button.insertAdjacentHTML(
            "beforeend",
            `
              <svg xmlns="http://www.w3.org/2000/svg"

                   aria-hidden="true"
                   width="24" height="24"
                   fill="none"
                   viewBox="0 0 24 24"
                   stroke-width="2"
                   stroke-linecap="round"
                   stroke-linejoin="round"
                   stroke="currentColor" class="accordion-trigger-icon">
                <path d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            `,
          );
        }

        const id =
          button.id || `accordion-btn-${accordionIdCounter.toString(36)}`;
        const panelId = button.id
          ? `${button.id}-panel`
          : `accordion-panel-${accordionIdCounter.toString(36)}`;
        accordionIdCounter += 1;

        button.id = id;
        panel.id = panelId;
        button.setAttribute("aria-controls", panelId);
        if (panel.tagName !== "SECTION" && !panel.hasAttribute("role")) {
          panel.setAttribute("role", "region");
        }
        panel.setAttribute("aria-labelledby", id);

        const initiallyOpen = isPanelOpen(item);
        const isClosed = isElementClosed(item.getAttribute("data-state"));
        const open = isClosed
          ? false
          : allowsMultiple
            ? initiallyOpen
            : initiallyOpen && !hasInitialOpen;
        if (open) hasInitialOpen = true;
        setItemStateFromDirective(item, open);

        const handleClick = () => {
          if (isItemDisabled(item, button)) return;

          const isOpen = isPanelOpen(item);
          const nextOpen = !isOpen;

          if (!allowsMultiple) {
            items.forEach((otherItem) => {
              setItemStateFromDirective(otherItem, false);
            });
          }

          setItemStateFromDirective(item, nextOpen);
        };

        const handleKeydown = (event: KeyboardEvent) => {
          if (
            event.key !== "ArrowDown" &&
            event.key !== "ArrowUp" &&
            event.key !== "Home" &&
            event.key !== "End"
          ) {
            return;
          }

          event.preventDefault();
          const buttons = items
            .map((nextItem) => {
              const itemHeader = resolveHeader(nextItem);
              if (!itemHeader) return null;
              const itemTrigger = resolveTrigger(itemHeader);
              if (!itemTrigger || isItemDisabled(nextItem, itemTrigger)) {
                return null;
              }
              return itemTrigger;
            })
            .filter((itemTrigger): itemTrigger is HTMLButtonElement =>
              Boolean(itemTrigger),
            );

          const currentIndex = buttons.indexOf(button);
          if (currentIndex === -1) return;

          const nextButton =
            event.key === "Home"
              ? buttons[0]
              : event.key === "End"
                ? buttons[buttons.length - 1]
                : buttons[
                    (currentIndex +
                      (event.key === "ArrowDown" ? 1 : -1) +
                      buttons.length) %
                      buttons.length
                  ];

          nextButton.focus();
        };

        button.addEventListener("click", handleClick);
        button.addEventListener("keydown", handleKeydown);
        cleanupButtons.push(() => {
          button.removeEventListener("click", handleClick);
          button.removeEventListener("keydown", handleKeydown);
        });
      });

      const syncExternalState = () => {
        if (reflectingState) return;

        let opened = false;
        items.forEach((item) => {
          const open = item.getAttribute("data-state") === "open";
          const nextOpen = allowsMultiple ? open : open && !opened;
          if (nextOpen) opened = true;
          setItemStateFromDirective(item, nextOpen);
        });
      };
      const stateObserver = new MutationObserver(syncExternalState);
      stateObserver.observe(element, {
        attributes: true,
        attributeFilter: ["data-state"],
        subtree: true,
      });

      onDestroy(scope, () => {
        stateObserver.disconnect();
        cleanupButtons.forEach((cleanup) => {
          cleanup();
        });
      });
    },
  };
}
