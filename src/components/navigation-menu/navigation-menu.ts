import type {} from "@angular-wave/angular.ts";

import {
  isDisabled,
  nextIndex,
  onDestroy,
  query,
  queryAll,
  setOpenState,
} from "../../internal/dom";

type NavigationMenuEntry = {
  item: HTMLElement;
  trigger: HTMLElement;
  content: HTMLElement;
  controlledBy: "data-open" | "data-state" | null;
  open: boolean;
  disconnect: () => void;
};

const itemSelector =
  '[data-slot="navigation-menu-item"], [ng-navigation-menu-item]';
const triggerSelector =
  '[data-slot="navigation-menu-trigger"], [ng-navigation-menu-trigger]';
const contentSelector =
  '[data-slot="navigation-menu-content"], [ng-navigation-menu-content]';
const linkSelector =
  '[data-slot="navigation-menu-link"], [ng-navigation-menu-link]';
const listSelector =
  '[data-slot="navigation-menu-list"], [ng-navigation-menu-list]';

let navigationMenuId = 0;

const setAttribute = (
  element: HTMLElement,
  name: string,
  value: string,
): void => {
  if (element.getAttribute(name) !== value) {
    element.setAttribute(name, value);
  }
};

const directChild = (
  element: HTMLElement,
  selector: string,
): HTMLElement | null =>
  Array.from(element.children).find(
    (child): child is HTMLElement =>
      child instanceof HTMLElement && child.matches(selector),
  ) ?? null;

export function navigationMenuDirective(): ng.Directive {
  return {
    link(scope: ng.Scope, element: HTMLElement) {
      const list = query<HTMLElement>(element, listSelector);
      const entries: NavigationMenuEntry[] = [];
      const triggers: HTMLElement[] = [];
      const topLevelControls: HTMLElement[] = [];
      const boundEntries = new Map<HTMLElement, NavigationMenuEntry>();
      const directionOwner = element.closest<HTMLElement>("[dir]") || element;
      let initialized = false;

      const getDirection = () =>
        element.closest<HTMLElement>("[dir]")?.getAttribute("dir") === "rtl"
          ? "rtl"
          : "ltr";

      const getHorizontalDirection = (key: string): 1 | -1 =>
        (key === "ArrowRight") === (getDirection() === "ltr") ? 1 : -1;

      const syncDirection = () => {
        const direction = getDirection();
        setAttribute(element, "data-direction", direction);
        entries.forEach(({ content }) =>
          setAttribute(content, "data-direction", direction),
        );
      };

      const syncRootState = () => {
        const open = entries.some((entry) => entry.open);
        setAttribute(element, "data-open", String(open));
        setAttribute(element, "data-state", open ? "open" : "closed");
      };

      const getContentItems = (content: HTMLElement): HTMLElement[] =>
        Array.from(
          content.querySelectorAll<HTMLElement>(
            `${linkSelector}, button, [tabindex]`,
          ),
        ).filter(
          (item) =>
            !isDisabled(item) &&
            !item.hidden &&
            item.getAttribute("aria-hidden") !== "true",
        );

      const positionContent = (content: HTMLElement) => {
        content.style.removeProperty("--navigation-menu-content-offset");
        const bounds = content.getBoundingClientRect();
        const viewportPadding = 12;
        const offset =
          bounds.left < viewportPadding
            ? viewportPadding - bounds.left
            : bounds.right > window.innerWidth - viewportPadding
              ? window.innerWidth - viewportPadding - bounds.right
              : 0;
        content.style.setProperty(
          "--navigation-menu-content-offset",
          `${offset}px`,
        );
      };

      const setMenuState = (index: number, open: boolean, focus = false) => {
        const entry = entries[index];
        if (!entry) return;

        entry.open = open;
        const state = open ? "open" : "closed";
        setAttribute(entry.item, "data-state", state);
        setAttribute(entry.trigger, "data-state", state);
        setAttribute(entry.trigger, "aria-expanded", String(open));
        if (entry.controlledBy !== "data-state") {
          setAttribute(entry.content, "data-state", state);
        }
        setAttribute(entry.content, "aria-hidden", String(!open));
        if (entry.controlledBy === "data-open") {
          entry.content.hidden = !open;
        } else {
          setOpenState(entry.content, open);
        }
        syncRootState();

        if (open) positionContent(entry.content);
        if (open && focus) {
          getContentItems(entry.content)[0]?.focus({ preventScroll: true });
        }
      };

      const closeAll = () =>
        entries.forEach((entry, index) => {
          if (!entry.controlledBy) setMenuState(index, false);
        });

      const openMenu = (index: number, focus = false) => {
        if (index < 0 || isDisabled(entries[index]?.trigger)) return;
        closeAll();
        setMenuState(index, true, focus);
      };

      const getEntryIndex = (entry: NavigationMenuEntry) =>
        entries.indexOf(entry);

      const getEntryForControl = (
        control: HTMLElement,
      ): NavigationMenuEntry | undefined =>
        entries.find((entry) => entry.trigger === control);

      const getEntryForContent = (
        content: HTMLElement,
      ): NavigationMenuEntry | undefined =>
        entries.find((entry) => entry.content === content);

      const getEnabledControlIndex = (index: number, direction: 1 | -1) => {
        if (!topLevelControls.length) return -1;
        let candidate = nextIndex(index, topLevelControls.length, direction);
        let safety = 0;
        while (
          isDisabled(topLevelControls[candidate]) &&
          safety < topLevelControls.length
        ) {
          candidate = nextIndex(candidate, topLevelControls.length, direction);
          safety += 1;
        }
        return isDisabled(topLevelControls[candidate]) ? -1 : candidate;
      };

      const getBoundaryControlIndex = (fromEnd: boolean) => {
        const indexes = topLevelControls.map((_, index) => index);
        if (fromEnd) indexes.reverse();
        return (
          indexes.find((index) => !isDisabled(topLevelControls[index])) ?? -1
        );
      };

      const activateTopLevelControl = (
        control: HTMLElement,
        keepDisclosureOpen: boolean,
      ) => {
        control.focus({ preventScroll: true });
        if (!keepDisclosureOpen) return;

        const entry = getEntryForControl(control);
        if (entry) {
          openMenu(getEntryIndex(entry));
        } else {
          closeAll();
        }
      };

      const bindItem = (item: HTMLElement) => {
        if (boundEntries.has(item)) return;

        const trigger = directChild(item, triggerSelector);
        const content = directChild(item, contentSelector);
        if (!trigger || !content) return;

        const triggerId =
          trigger.id || `navigation-menu-trigger-${navigationMenuId++}`;
        const contentId = content.id || `${triggerId}-content`;
        trigger.id = triggerId;
        content.id = contentId;
        setAttribute(trigger, "aria-haspopup", "true");
        setAttribute(trigger, "aria-controls", contentId);
        setAttribute(content, "aria-labelledby", triggerId);

        const controlledBy = content.hasAttribute("data-open")
          ? "data-open"
          : content.hasAttribute("data-state")
            ? "data-state"
            : null;
        const entry: NavigationMenuEntry = {
          item,
          trigger,
          content,
          controlledBy,
          open:
            content.getAttribute("data-open") === "true" ||
            content.getAttribute("data-state") === "open",
          disconnect: () => void 0,
        };
        entries.push(entry);
        triggers.push(trigger);
        boundEntries.set(item, entry);

        const syncFromAttribute = () => {
          if (!entry.controlledBy) return;
          const nextOpen =
            entry.controlledBy === "data-open"
              ? content.getAttribute("data-open") === "true"
              : content.getAttribute("data-state") === "open";
          if (nextOpen === entry.open) return;
          if (nextOpen) {
            openMenu(getEntryIndex(entry));
          } else {
            setMenuState(getEntryIndex(entry), false);
          }
        };

        const observer = entry.controlledBy
          ? new MutationObserver(syncFromAttribute)
          : null;
        if (entry.controlledBy) {
          observer?.observe(content, {
            attributes: true,
            attributeFilter: [entry.controlledBy],
          });
        }

        let closeTimer = 0;
        let openedByPointer = false;
        const cancelClose = () => {
          window.clearTimeout(closeTimer);
          closeTimer = 0;
        };
        const scheduleClose = () => {
          cancelClose();
          closeTimer = window.setTimeout(() => {
            if (
              entry.open &&
              !item.matches(":hover") &&
              !item.contains(document.activeElement)
            ) {
              setMenuState(getEntryIndex(entry), false);
            }
          }, 100);
        };
        const handleTriggerClick = () => {
          if (isDisabled(trigger) || entry.controlledBy) return;
          if (entry.open && !openedByPointer) {
            closeAll();
          } else if (entry.open) {
            openedByPointer = false;
          } else {
            openMenu(getEntryIndex(entry));
          }
        };
        const handleTriggerKeydown = (event: KeyboardEvent) => {
          if (
            isDisabled(trigger) ||
            entry.controlledBy ||
            event.key !== "ArrowDown"
          ) {
            return;
          }
          event.preventDefault();
          event.stopPropagation();
          openMenu(getEntryIndex(entry), true);
        };
        const handlePointerEnter = () => {
          cancelClose();
          if (!isDisabled(trigger) && !entry.open) {
            openedByPointer = true;
            openMenu(getEntryIndex(entry));
          }
        };
        const handlePointerLeave = () => scheduleClose();

        trigger.addEventListener("click", handleTriggerClick);
        trigger.addEventListener("keydown", handleTriggerKeydown);
        item.addEventListener("pointerenter", handlePointerEnter);
        item.addEventListener("pointerleave", handlePointerLeave);

        entry.disconnect = () => {
          cancelClose();
          observer?.disconnect();
          trigger.removeEventListener("click", handleTriggerClick);
          trigger.removeEventListener("keydown", handleTriggerKeydown);
          item.removeEventListener("pointerenter", handlePointerEnter);
          item.removeEventListener("pointerleave", handlePointerLeave);
        };

        if (initialized) {
          if (entry.open) {
            openMenu(getEntryIndex(entry));
          } else {
            setMenuState(getEntryIndex(entry), false);
          }
        }
      };

      const syncTopLevelControls = () => {
        if (!list) return;
        const controls = Array.from(list.children).flatMap((child) => {
          if (!(child instanceof HTMLElement) || !child.matches(itemSelector)) {
            return [];
          }
          const control =
            directChild(child, triggerSelector) ||
            directChild(child, linkSelector);
          return control ? [control] : [];
        });
        topLevelControls.splice(0, topLevelControls.length, ...controls);
      };

      const syncStructure = () => {
        boundEntries.forEach((entry, item) => {
          const replaced =
            directChild(item, triggerSelector) !== entry.trigger ||
            directChild(item, contentSelector) !== entry.content;
          if (!item.isConnected || !element.contains(item) || replaced) {
            entry.disconnect();
            boundEntries.delete(item);
            const index = entries.indexOf(entry);
            if (index >= 0) entries.splice(index, 1);
          }
        });

        queryAll<HTMLElement>(element, itemSelector).forEach(bindItem);
        entries.sort((left, right) => {
          const position = left.item.compareDocumentPosition(right.item);
          return position & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
        });
        triggers.splice(
          0,
          triggers.length,
          ...entries.map(({ trigger }) => trigger),
        );
        syncTopLevelControls();
        syncDirection();
        syncRootState();
      };

      const handleKeydown = (event: KeyboardEvent) => {
        const active =
          document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null;
        if (!active || !element.contains(active)) return;

        const activeContent = active.closest<HTMLElement>(contentSelector);
        if (event.key === "Escape") {
          if (!entries.some((entry) => entry.open)) return;
          event.preventDefault();
          const entry = activeContent
            ? getEntryForContent(activeContent)
            : entries.find((candidate) => candidate.open);
          closeAll();
          entry?.trigger.focus({ preventScroll: true });
          return;
        }

        if (activeContent) {
          const contentItems = getContentItems(activeContent);
          const activeIndex = contentItems.indexOf(active);
          if (
            event.key === "ArrowDown" ||
            event.key === "ArrowUp" ||
            event.key === "Home" ||
            event.key === "End"
          ) {
            if (!contentItems.length) return;
            event.preventDefault();
            const targetIndex =
              event.key === "Home"
                ? 0
                : event.key === "End"
                  ? contentItems.length - 1
                  : nextIndex(
                      activeIndex,
                      contentItems.length,
                      event.key === "ArrowDown" ? 1 : -1,
                    );
            contentItems[targetIndex].focus({ preventScroll: true });
            return;
          }

          if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            const entry = getEntryForContent(activeContent);
            if (!entry) return;
            const controlIndex = topLevelControls.indexOf(entry.trigger);
            const targetIndex = getEnabledControlIndex(
              controlIndex,
              getHorizontalDirection(event.key),
            );
            if (targetIndex < 0) return;
            event.preventDefault();
            activateTopLevelControl(topLevelControls[targetIndex], true);
          }
          return;
        }

        const currentIndex = topLevelControls.indexOf(active);
        if (currentIndex < 0) return;
        if (
          event.key !== "ArrowRight" &&
          event.key !== "ArrowLeft" &&
          event.key !== "Home" &&
          event.key !== "End"
        ) {
          return;
        }

        event.preventDefault();
        const targetIndex =
          event.key === "Home" || event.key === "End"
            ? getBoundaryControlIndex(event.key === "End")
            : getEnabledControlIndex(
                currentIndex,
                getHorizontalDirection(event.key),
              );
        if (targetIndex < 0) return;
        activateTopLevelControl(
          topLevelControls[targetIndex],
          entries.some((entry) => entry.open),
        );
      };

      const handleClick = (event: MouseEvent) => {
        const target =
          event.target instanceof Element
            ? event.target.closest<HTMLElement>(linkSelector)
            : null;
        if (target && element.contains(target)) closeAll();
      };

      const handleDocumentClick = (event: MouseEvent) => {
        if (event.target instanceof Node && !element.contains(event.target)) {
          closeAll();
        }
      };

      const handleDocumentFocus = (event: FocusEvent) => {
        if (event.target instanceof Node && !element.contains(event.target)) {
          closeAll();
        }
      };

      const handleResize = () => {
        entries
          .filter((entry) => entry.open)
          .forEach((entry) => positionContent(entry.content));
      };

      if (element.tagName !== "NAV" && !element.hasAttribute("role")) {
        setAttribute(element, "role", "navigation");
      }
      element.addEventListener("keydown", handleKeydown);
      element.addEventListener("click", handleClick);
      document.addEventListener("click", handleDocumentClick);
      document.addEventListener("focusin", handleDocumentFocus);
      window.addEventListener("resize", handleResize);

      const structureObserver = new MutationObserver(syncStructure);
      structureObserver.observe(element, {
        attributes: true,
        attributeFilter: ["data-slot", "dir"],
        childList: true,
        subtree: true,
      });
      const directionObserver =
        directionOwner === element ? null : new MutationObserver(syncDirection);
      directionObserver?.observe(directionOwner, {
        attributes: true,
        attributeFilter: ["dir"],
      });

      syncStructure();
      let foundInitialOpen = false;
      entries.forEach((entry, index) => {
        const keepOpen = entry.open && !foundInitialOpen;
        if (keepOpen) foundInitialOpen = true;
        setMenuState(index, keepOpen);
      });
      initialized = true;

      onDestroy(scope, () => {
        structureObserver.disconnect();
        directionObserver?.disconnect();
        element.removeEventListener("keydown", handleKeydown);
        element.removeEventListener("click", handleClick);
        document.removeEventListener("click", handleDocumentClick);
        document.removeEventListener("focusin", handleDocumentFocus);
        window.removeEventListener("resize", handleResize);
        entries.forEach((entry) => entry.disconnect());
      });
    },
  };
}
