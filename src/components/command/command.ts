import type {} from "@angular-wave/angular.ts";

import { isDisabled, onDestroy, queryAll } from "../../internal/dom";

let commandIdCounter = 0;

const emptySelector = ".command-empty";
const groupHeadingSelector = ".command-group-heading";
const groupSelector = ".command-group";
const inputSelector = ".command-input";
const itemSelector = ".command-item";
const listSelector = ".command-list";
const rootSelector = ".command, [ng-command]";
const separatorSelector = ".command-separator";
const shortcutSelector = ".command-shortcut";

const setAttributeIfChanged = (
  element: HTMLElement,
  name: string,
  value: string,
) => {
  if (element.getAttribute(name) !== value) element.setAttribute(name, value);
};

export function commandDirective(): ng.Directive {
  return {
    link(scope: ng.Scope, element: HTMLElement) {
      const isOwned = (candidate: Element) =>
        candidate.closest(rootSelector) === element;
      const owned = <T extends HTMLElement>(
        selector: string,
        constructor: abstract new (...args: never[]) => T,
      ): T | null => {
        const candidate = queryAll<HTMLElement>(element, selector).find(
          isOwned,
        );
        return candidate instanceof constructor ? candidate : null;
      };
      const ownedAll = <T extends HTMLElement>(selector: string): T[] =>
        queryAll<T>(element, selector).filter(isOwned);

      const input = owned(inputSelector, HTMLInputElement);
      if (!input) return;

      const directionOwner = element.closest<HTMLElement>("[dir]") ?? element;
      const itemCleanups = new Map<HTMLElement, () => void>();
      let items: HTMLElement[] = [];
      let activeItem: HTMLElement | null = null;

      const getDirection = () =>
        element.closest<HTMLElement>("[dir]")?.getAttribute("dir") === "rtl"
          ? "rtl"
          : "ltr";
      const isVisible = (item: HTMLElement) => {
        const hiddenAncestor = item.parentElement?.closest("[hidden]");
        const hiddenInsideCommand = Boolean(
          hiddenAncestor &&
          hiddenAncestor !== element &&
          element.contains(hiddenAncestor),
        );
        return (
          !item.hidden &&
          item.getAttribute("aria-hidden") !== "true" &&
          !hiddenInsideCommand &&
          getComputedStyle(item).display !== "none"
        );
      };
      const renderedItems = () => items.filter(isVisible);
      const enabledItems = () =>
        renderedItems().filter((item) => !isDisabled(item));

      const selectItem = (item: HTMLElement | null, scroll = false): void => {
        if (!item || isDisabled(item) || !isVisible(item)) {
          activeItem = null;
        } else {
          activeItem = item;
        }

        items.forEach((candidate) => {
          const selected = candidate === activeItem;
          setAttributeIfChanged(candidate, "aria-selected", String(selected));
          setAttributeIfChanged(candidate, "data-selected", String(selected));
        });

        if (activeItem) {
          setAttributeIfChanged(input, "aria-activedescendant", activeItem.id);
          if (scroll) activeItem.scrollIntoView({ block: "nearest" });
        } else {
          input.removeAttribute("aria-activedescendant");
        }
      };

      const move = (delta: 1 | -1) => {
        const enabled = enabledItems();
        if (!enabled.length) {
          selectItem(null);
          return;
        }
        const current = activeItem ? enabled.indexOf(activeItem) : -1;
        const next =
          current < 0
            ? delta === 1
              ? 0
              : enabled.length - 1
            : (current + delta + enabled.length) % enabled.length;
        selectItem(enabled[next], true);
      };

      const bindItem = (item: HTMLElement) => {
        if (!item.id) item.id = `command-item-${String(commandIdCounter++)}`;
        setAttributeIfChanged(item, "role", "option");
        setAttributeIfChanged(item, "tabindex", "-1");
        setAttributeIfChanged(item, "data-disabled", String(isDisabled(item)));
        if (isDisabled(item)) {
          setAttributeIfChanged(item, "aria-disabled", "true");
        }
        if (itemCleanups.has(item)) return;

        const handlePointerMove = () => {
          if (!isDisabled(item)) selectItem(item);
        };
        const handleClick = () => {
          if (!isDisabled(item)) selectItem(item);
        };
        item.addEventListener("pointermove", handlePointerMove);
        item.addEventListener("click", handleClick);
        itemCleanups.set(item, () => {
          item.removeEventListener("pointermove", handlePointerMove);
          item.removeEventListener("click", handleClick);
        });
      };

      const syncStructure = () => {
        const previousActive = activeItem;
        items = ownedAll<HTMLElement>(itemSelector);
        items.forEach(bindItem);

        itemCleanups.forEach((cleanup, item) => {
          if (!item.isConnected || !isOwned(item)) {
            cleanup();
            itemCleanups.delete(item);
          }
        });

        const list = owned(listSelector, HTMLElement);
        if (list) {
          if (!list.id) list.id = `command-list-${String(commandIdCounter++)}`;
          setAttributeIfChanged(list, "role", "listbox");
          setAttributeIfChanged(input, "aria-controls", list.id);
        }

        ownedAll<HTMLElement>(groupSelector).forEach((group) => {
          setAttributeIfChanged(group, "role", "group");
          const heading = queryAll<HTMLElement>(
            group,
            groupHeadingSelector,
          ).find((candidate) => candidate.closest(groupSelector) === group);
          if (!heading) return;
          if (!heading.id) {
            heading.id = `command-group-heading-${String(commandIdCounter++)}`;
          }
          setAttributeIfChanged(group, "aria-labelledby", heading.id);
        });
        ownedAll<HTMLElement>(separatorSelector).forEach((separator) => {
          setAttributeIfChanged(separator, "role", "separator");
          setAttributeIfChanged(separator, "aria-orientation", "horizontal");
        });
        ownedAll<HTMLElement>(shortcutSelector).forEach((shortcut) => {
          setAttributeIfChanged(shortcut, "aria-hidden", "true");
        });

        const rendered = renderedItems();
        const empty = rendered.length === 0;
        setAttributeIfChanged(element, "data-direction", getDirection());
        setAttributeIfChanged(element, "data-empty", String(empty));
        setAttributeIfChanged(input, "aria-expanded", String(!empty));
        ownedAll<HTMLElement>(emptySelector).forEach((emptySlot) => {
          setAttributeIfChanged(emptySlot, "role", "status");
          setAttributeIfChanged(emptySlot, "data-visible", String(empty));
        });

        const enabled = enabledItems();
        const authoredSelected = enabled.find(
          (item) =>
            item.getAttribute("aria-selected") === "true" ||
            item.getAttribute("data-selected") === "true",
        );
        if (previousActive && enabled.includes(previousActive)) {
          selectItem(previousActive);
        } else {
          selectItem(authoredSelected ?? enabled.at(0) ?? null);
        }
      };

      const handleKeydown = (event: KeyboardEvent) => {
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          event.preventDefault();
          move(event.key === "ArrowDown" ? 1 : -1);
          return;
        }
        if (event.key === "Home" || event.key === "End") {
          event.preventDefault();
          const enabled = enabledItems();
          selectItem(
            event.key === "Home"
              ? (enabled[0] ?? null)
              : (enabled.at(-1) ?? null),
            true,
          );
          return;
        }
        if (event.key === "Enter" && activeItem) {
          event.preventDefault();
          activeItem.click();
        }
      };

      setAttributeIfChanged(input, "role", "combobox");
      setAttributeIfChanged(
        input,
        "aria-autocomplete",
        input.getAttribute("aria-autocomplete") ?? "list",
      );

      const observer = new MutationObserver(syncStructure);
      observer.observe(element, {
        attributes: true,
        attributeFilter: [
          "aria-disabled",
          "aria-hidden",
          "data-disabled",
          "dir",
          "disabled",
          "hidden",
        ],
        childList: true,
        subtree: true,
      });
      const directionObserver =
        directionOwner === element ? null : new MutationObserver(syncStructure);
      directionObserver?.observe(directionOwner, {
        attributes: true,
        attributeFilter: ["dir"],
      });

      input.addEventListener("keydown", handleKeydown);
      syncStructure();

      onDestroy(scope, () => {
        observer.disconnect();
        directionObserver?.disconnect();
        itemCleanups.forEach((cleanup) => {
          cleanup();
        });
        itemCleanups.clear();
        input.removeEventListener("keydown", handleKeydown);
      });
    },
  };
}
