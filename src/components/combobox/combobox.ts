import type {} from "@angular-wave/angular.ts";

import {
  isDisabled,
  onDestroy,
  queryAll,
  setOpenState,
} from "../../internal/dom";

let comboboxIdCounter = 0;

const anchorSelector =
  '[data-slot="combobox-control"], [ng-combobox-control], [data-slot="combobox-chips"], [ng-combobox-chips]';
const chipSelector = '[data-slot="combobox-chip"], [ng-combobox-chip]';
const clearSelector = '[data-slot="combobox-clear"], [ng-combobox-clear]';
const contentSelector = '[data-slot="combobox-content"], [ng-combobox-content]';
const emptySelector = '[data-slot="combobox-empty"], [ng-combobox-empty]';
const groupLabelSelector =
  '[data-slot="combobox-label"], [ng-combobox-label], [data-slot="combobox-group-label"], [ng-combobox-group-label]';
const groupSelector = '[data-slot="combobox-group"], [ng-combobox-group]';
const inputSelector =
  'input[ng-combobox-input], input[data-slot="combobox-input"], input[ng-combobox-chip-input], input[data-slot="combobox-chip-input"], input[role="combobox"], input[data-input], input[data-slot="input"], input[ng-input-group-input]';
const itemSelector = '[data-slot="combobox-item"], [ng-combobox-item]';
const rootSelector = '[data-slot="combobox"], [ng-combobox]';
const separatorSelector =
  '[data-slot="combobox-separator"], [ng-combobox-separator]';
const triggerSelector = '[data-slot="combobox-trigger"], [ng-combobox-trigger]';

const setAttributeIfChanged = (
  element: HTMLElement,
  name: string,
  value: string,
) => {
  if (element.getAttribute(name) !== value) element.setAttribute(name, value);
};

export function comboboxDirective(): ng.Directive {
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
      const content = owned(contentSelector, HTMLElement);
      if (!input || !content) return;

      const directionOwner = element.closest<HTMLElement>("[dir]") ?? element;
      const contentId =
        content.id || `combobox-content-${String(comboboxIdCounter++)}`;
      const inputId =
        input.id || `combobox-input-${String(comboboxIdCounter++)}`;
      content.id = contentId;
      input.id = inputId;
      setAttributeIfChanged(input, "role", "combobox");
      setAttributeIfChanged(input, "aria-controls", contentId);
      setAttributeIfChanged(input, "aria-haspopup", "listbox");
      setAttributeIfChanged(
        input,
        "aria-autocomplete",
        input.getAttribute("aria-autocomplete") ?? "list",
      );
      setAttributeIfChanged(content, "role", "listbox");
      if (!content.hasAttribute("aria-label")) {
        setAttributeIfChanged(content, "aria-labelledby", inputId);
      }

      const ownsAriaInvalid = !input.hasAttribute("aria-invalid");
      let items: HTMLElement[] = [];
      let activeItem: HTMLElement | null = null;
      let open =
        element.getAttribute("open") === "true" ||
        element.getAttribute("data-open") === "true";
      let openAtPointerDown = false;

      const itemCleanups = new Map<HTMLElement, () => void>();
      const controlCleanups = new Map<HTMLElement, () => void>();

      const isMultiple = () =>
        element.hasAttribute("multiple") ||
        element.getAttribute("data-multiple") === "true";
      const hasAutoHighlight = () =>
        element.hasAttribute("auto-highlight") ||
        element.getAttribute("data-auto-highlight") === "true";
      const getDirection = () =>
        element.closest<HTMLElement>("[dir]")?.getAttribute("dir") === "rtl"
          ? "rtl"
          : "ltr";
      const isInvalid = () =>
        ownsAriaInvalid
          ? !input.validity.valid
          : input.getAttribute("aria-invalid") === "true";
      const isVisible = (item: HTMLElement) =>
        !item.hidden &&
        item.getAttribute("aria-hidden") !== "true" &&
        !item.closest("[hidden]") &&
        getComputedStyle(item).display !== "none";
      const visibleItems = (includeDisabled = false) =>
        items.filter(
          (item) => isVisible(item) && (includeDisabled || !isDisabled(item)),
        );

      const syncChrome = () => {
        const direction = getDirection();
        const disabled = isDisabled(input);
        const invalid = isInvalid();
        const multiple = isMultiple();
        setAttributeIfChanged(element, "data-direction", direction);
        setAttributeIfChanged(content, "data-direction", direction);
        setAttributeIfChanged(element, "data-disabled", String(disabled));
        setAttributeIfChanged(input, "aria-disabled", String(disabled));
        setAttributeIfChanged(element, "data-invalid", String(invalid));
        setAttributeIfChanged(element, "data-multiple", String(multiple));
        setAttributeIfChanged(
          content,
          "aria-multiselectable",
          String(multiple),
        );
        setAttributeIfChanged(
          content,
          "data-chips",
          String(
            Boolean(
              owned(
                '[data-slot="combobox-chips"], [ng-combobox-chips]',
                HTMLElement,
              ),
            ),
          ),
        );
        if (ownsAriaInvalid) {
          setAttributeIfChanged(input, "aria-invalid", String(invalid));
        }
      };

      const positionContent = () => {
        if (!open) return;
        const externalTrigger = ownedAll<HTMLElement>(triggerSelector).find(
          (trigger) =>
            !content.contains(trigger) && !trigger.closest(anchorSelector),
        );
        const anchor =
          externalTrigger ?? owned(anchorSelector, HTMLElement) ?? input;
        const rootBox = element.getBoundingClientRect();
        const anchorBox = anchor.getBoundingClientRect();
        const contentHeight = Math.min(content.scrollHeight, 288);
        let top = anchor.offsetTop + anchorBox.height + 6;
        const projectedBottom = rootBox.top + top + contentHeight;
        if (projectedBottom > window.innerHeight - 4) {
          top = anchor.offsetTop - contentHeight - 6;
          setAttributeIfChanged(content, "data-side", "top");
        } else {
          setAttributeIfChanged(content, "data-side", "bottom");
        }
        content.style.setProperty(
          "--combobox-content-top",
          `${String(Math.round(top))}px`,
        );
        content.style.setProperty(
          "--combobox-anchor-width",
          `${String(Math.round(anchorBox.width))}px`,
        );
      };

      const notifyOpenChange = () => {
        element.dispatchEvent(
          new CustomEvent("angularcss:combobox-open-change", {
            bubbles: true,
            detail: { open },
          }),
        );
      };

      const setOpen = (
        nextOpen: boolean,
        notifyApplication = false,
        focusInput = false,
      ) => {
        if (nextOpen && isDisabled(input)) nextOpen = false;
        open = nextOpen;
        const state = open ? "open" : "closed";
        setAttributeIfChanged(element, "data-open", String(open));
        setAttributeIfChanged(element, "data-state", state);
        setAttributeIfChanged(content, "data-state", state);
        setAttributeIfChanged(content, "aria-hidden", String(!open));
        setAttributeIfChanged(input, "aria-expanded", String(open));
        ownedAll<HTMLElement>(triggerSelector).forEach((trigger) => {
          setAttributeIfChanged(trigger, "data-state", state);
          setAttributeIfChanged(trigger, "aria-expanded", String(open));
        });
        setOpenState(content, open);
        if (open) requestAnimationFrame(positionContent);
        if (focusInput) input.focus({ preventScroll: true });
        if (notifyApplication) notifyOpenChange();
      };

      const clearHighlight = () => {
        activeItem = null;
        items.forEach((item) => {
          setAttributeIfChanged(item, "data-highlighted", "false");
        });
        input.removeAttribute("aria-activedescendant");
      };

      const highlight = (item: HTMLElement | null) => {
        if (!item || isDisabled(item) || !isVisible(item)) {
          clearHighlight();
          return;
        }
        activeItem = item;
        items.forEach((candidate) => {
          setAttributeIfChanged(
            candidate,
            "data-highlighted",
            String(candidate === item),
          );
        });
        setAttributeIfChanged(input, "aria-activedescendant", item.id);
        if (open) item.scrollIntoView({ block: "nearest" });
      };

      const highlightBoundary = (end: "first" | "last") => {
        const visible = visibleItems();
        highlight(end === "first" ? visible[0] : (visible.at(-1) ?? null));
      };

      const moveHighlight = (direction: 1 | -1) => {
        const visible = visibleItems();
        if (!visible.length) {
          clearHighlight();
          return;
        }
        const current = activeItem ? visible.indexOf(activeItem) : -1;
        const next =
          current < 0
            ? direction === 1
              ? 0
              : visible.length - 1
            : (current + direction + visible.length) % visible.length;
        highlight(visible[next]);
      };

      const selectItem = (item: HTMLElement) => {
        if (isDisabled(item)) return;
        const multiple = isMultiple();
        const value =
          item.getAttribute("data-value") ?? item.textContent.trim();
        setAttributeIfChanged(element, "data-value", value);
        element.dispatchEvent(
          new CustomEvent("angularcss:combobox-select", {
            bubbles: true,
            detail: { item, multiple, value },
          }),
        );
        if (!multiple) setOpen(false, true);
        input.focus({ preventScroll: true });
      };

      const bindItem = (item: HTMLElement) => {
        if (!item.id) item.id = `combobox-item-${String(comboboxIdCounter++)}`;
        setAttributeIfChanged(item, "role", "option");
        setAttributeIfChanged(item, "tabindex", "-1");
        setAttributeIfChanged(item, "data-disabled", String(isDisabled(item)));
        if (!item.hasAttribute("aria-selected")) {
          setAttributeIfChanged(item, "aria-selected", "false");
        }
        if (isDisabled(item))
          setAttributeIfChanged(item, "aria-disabled", "true");
        if (itemCleanups.has(item)) return;
        const handleClick = () => {
          selectItem(item);
        };
        item.addEventListener("click", handleClick);
        itemCleanups.set(item, () => {
          item.removeEventListener("click", handleClick);
        });
      };

      const bindControl = (control: HTMLElement, kind: "clear" | "trigger") => {
        if (controlCleanups.has(control)) return;
        if (
          control instanceof HTMLButtonElement &&
          !control.hasAttribute("type")
        ) {
          control.type = "button";
        }
        if (kind === "trigger") {
          setAttributeIfChanged(control, "aria-controls", contentId);
          setAttributeIfChanged(control, "aria-haspopup", "listbox");
          if (
            !control.hasAttribute("aria-label") &&
            !control.textContent.trim()
          ) {
            setAttributeIfChanged(control, "aria-label", "Show options");
          }
          const handleClick = (event: MouseEvent) => {
            event.preventDefault();
            setOpen(!open, true, true);
          };
          control.addEventListener("click", handleClick);
          controlCleanups.set(control, () => {
            control.removeEventListener("click", handleClick);
          });
          return;
        }

        setAttributeIfChanged(
          control,
          "aria-label",
          control.getAttribute("aria-label") ?? "Clear selection",
        );
        const handleClick = () => {
          setAttributeIfChanged(element, "data-value", "");
          element.dispatchEvent(
            new CustomEvent("angularcss:combobox-clear", { bubbles: true }),
          );
          input.focus({ preventScroll: true });
        };
        control.addEventListener("click", handleClick);
        controlCleanups.set(control, () => {
          control.removeEventListener("click", handleClick);
        });
      };

      const syncStructure = () => {
        syncChrome();
        const previousActive = activeItem;
        items = ownedAll<HTMLElement>(itemSelector);
        items.forEach(bindItem);
        ownedAll<HTMLElement>(triggerSelector).forEach((control) => {
          bindControl(control, "trigger");
        });
        ownedAll<HTMLElement>(clearSelector).forEach((control) => {
          bindControl(control, "clear");
        });
        ownedAll<HTMLElement>(groupSelector).forEach((group) => {
          setAttributeIfChanged(group, "role", "group");
          const label = queryAll<HTMLElement>(group, groupLabelSelector).find(
            (candidate) => candidate.closest(groupSelector) === group,
          );
          if (!label) return;
          if (!label.id)
            label.id = `combobox-label-${String(comboboxIdCounter++)}`;
          setAttributeIfChanged(group, "aria-labelledby", label.id);
        });
        ownedAll<HTMLElement>(separatorSelector).forEach((separator) => {
          setAttributeIfChanged(separator, "role", "separator");
          setAttributeIfChanged(separator, "aria-orientation", "horizontal");
        });

        itemCleanups.forEach((cleanup, item) => {
          if (!item.isConnected || !isOwned(item)) {
            cleanup();
            itemCleanups.delete(item);
          }
        });
        controlCleanups.forEach((cleanup, control) => {
          if (!control.isConnected || !isOwned(control)) {
            cleanup();
            controlCleanups.delete(control);
          }
        });

        const visible = visibleItems(true);
        const empty = visible.length === 0;
        setAttributeIfChanged(element, "data-empty", String(empty));
        setAttributeIfChanged(content, "data-empty", String(empty));
        ownedAll<HTMLElement>(emptySelector).forEach((emptySlot) => {
          setAttributeIfChanged(emptySlot, "role", "status");
          setAttributeIfChanged(emptySlot, "data-visible", String(empty));
          if (emptySlot.hidden === empty) emptySlot.hidden = !empty;
        });

        if (
          previousActive &&
          items.includes(previousActive) &&
          isVisible(previousActive)
        ) {
          highlight(previousActive);
        } else {
          const selected = items.find(
            (item) =>
              isVisible(item) && item.getAttribute("aria-selected") === "true",
          );
          if (selected) highlight(selected);
          else if (open && hasAutoHighlight()) highlightBoundary("first");
          else clearHighlight();
        }
        if (open) requestAnimationFrame(positionContent);
      };

      const handleInput = () => {
        syncChrome();
        clearHighlight();
        setOpen(true, true);
        requestAnimationFrame(syncStructure);
      };
      const handleFocus = () => {
        setOpen(true, true);
      };
      const handleInvalid = () => {
        syncChrome();
      };
      const handleKeydown = (event: KeyboardEvent) => {
        if (event.key === "Tab") {
          setOpen(false, true);
          return;
        }
        if (event.key === "Escape" && open) {
          event.preventDefault();
          setOpen(false, true, true);
          return;
        }
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          event.preventDefault();
          if (!open) setOpen(true, true);
          moveHighlight(event.key === "ArrowDown" ? 1 : -1);
          return;
        }
        if ((event.key === "Home" || event.key === "End") && open) {
          event.preventDefault();
          highlightBoundary(event.key === "Home" ? "first" : "last");
          return;
        }
        if (event.key === "Enter" && open && activeItem) {
          event.preventDefault();
          selectItem(activeItem);
          return;
        }
        if (
          event.key === "Backspace" &&
          isMultiple() &&
          input.value.length === 0 &&
          ownedAll<HTMLElement>(chipSelector).length
        ) {
          element.dispatchEvent(
            new CustomEvent("angularcss:combobox-remove-last", {
              bubbles: true,
            }),
          );
        }
      };

      const handlePointerDown = () => {
        openAtPointerDown = open;
      };
      const handleOutsideClick = (event: MouseEvent) => {
        if (
          open &&
          openAtPointerDown &&
          event.target instanceof Node &&
          !element.contains(event.target)
        ) {
          setOpen(false, true);
        }
      };
      const handleOutsideFocus = (event: FocusEvent) => {
        if (
          open &&
          event.target instanceof Node &&
          !element.contains(event.target)
        ) {
          setOpen(false, true);
        }
      };

      const observer = new MutationObserver((records) => {
        syncStructure();
        if (
          records.some(
            (record) =>
              record.target === element &&
              (record.attributeName === "data-open" ||
                record.attributeName === "open"),
          )
        ) {
          const authoredOpen = element.hasAttribute("open")
            ? element.getAttribute("open") === "true"
            : element.getAttribute("data-open") === "true";
          if (authoredOpen !== open) setOpen(authoredOpen);
        }
      });
      observer.observe(element, {
        attributes: true,
        attributeFilter: [
          "aria-disabled",
          "aria-hidden",
          "aria-invalid",
          "aria-selected",
          "auto-highlight",
          "data-auto-highlight",
          "data-disabled",
          "data-multiple",
          "data-open",
          "dir",
          "disabled",
          "hidden",
          "multiple",
          "open",
          "required",
        ],
        childList: true,
        subtree: true,
      });
      const directionObserver =
        directionOwner === element
          ? null
          : new MutationObserver(() => {
              syncChrome();
              requestAnimationFrame(positionContent);
            });
      directionObserver?.observe(directionOwner, {
        attributes: true,
        attributeFilter: ["dir"],
      });

      input.addEventListener("input", handleInput);
      input.addEventListener("focus", handleFocus);
      input.addEventListener("invalid", handleInvalid);
      element.addEventListener("keydown", handleKeydown);
      document.addEventListener("pointerdown", handlePointerDown, true);
      document.addEventListener("click", handleOutsideClick);
      document.addEventListener("focusin", handleOutsideFocus);
      window.addEventListener("resize", positionContent);
      syncStructure();
      setOpen(open);

      onDestroy(scope, () => {
        observer.disconnect();
        directionObserver?.disconnect();
        input.removeEventListener("input", handleInput);
        input.removeEventListener("focus", handleFocus);
        input.removeEventListener("invalid", handleInvalid);
        element.removeEventListener("keydown", handleKeydown);
        document.removeEventListener("pointerdown", handlePointerDown, true);
        document.removeEventListener("click", handleOutsideClick);
        document.removeEventListener("focusin", handleOutsideFocus);
        window.removeEventListener("resize", positionContent);
        itemCleanups.forEach((cleanup) => {
          cleanup();
        });
        itemCleanups.clear();
        controlCleanups.forEach((cleanup) => {
          cleanup();
        });
        controlCleanups.clear();
      });
    },
  };
}
