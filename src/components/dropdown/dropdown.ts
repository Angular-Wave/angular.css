import type {} from "@angular-wave/angular.ts";

import { onDestroy, setOpenState } from "../../internal/dom";
import {
  bindSemanticSubmenus,
  getSemanticMenuItemRole,
} from "../../internal/menu";

let dropdownIdCounter = 0;

type DropdownScope = ng.Scope & {};

type DropdownOpenOptions = {
  focusFirst?: boolean;
  restoreFocus?: boolean;
};

type DropdownOpenState = boolean;

const queryMenuItems = (panel: HTMLElement): HTMLElement[] =>
  Array.from(
    panel.querySelectorAll(
      'a, button, [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]',
    ),
  ).filter((item): item is HTMLElement => {
    if (!(item instanceof HTMLElement) || item.closest("menu") !== panel) {
      return false;
    }
    const hiddenAncestor = item.closest<HTMLElement>("[hidden]");
    return (
      (!hiddenAncestor || hiddenAncestor === panel) &&
      !item.hasAttribute("disabled") &&
      item.getAttribute("aria-disabled") !== "true"
    );
  });

export function dropdownDirective(): ng.Directive {
  return {
    link(scope: DropdownScope, element: HTMLElement) {
      const button =
        element.querySelector<HTMLButtonElement>(":scope > button");
      const panel = element.querySelector<HTMLElement>(":scope > menu");

      if (!button || !panel) return;

      const getDirection = () =>
        element.closest<HTMLElement>("[dir]")?.getAttribute("dir") === "rtl"
          ? "rtl"
          : "ltr";
      const cleanupSubmenus = bindSemanticSubmenus(
        element,
        "dropdown-menu",
        getDirection,
      );

      const panelId = panel.id || `menu-${String(dropdownIdCounter++)}`;
      panel.id = panelId;
      if (!button.id) button.id = `dropdown-btn-${String(dropdownIdCounter++)}`;
      button.setAttribute("aria-haspopup", "true");
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-controls", panelId);
      panel.setAttribute("role", "menu");
      panel.setAttribute("tabindex", panel.getAttribute("tabindex") ?? "-1");
      panel.setAttribute("aria-labelledby", button.id);

      const isIconTrigger = button.getAttribute("size")?.startsWith("icon");
      if (!button.querySelector("svg") && !isIconTrigger) {
        button.insertAdjacentHTML(
          "beforeend",
          `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
            <path fill-rule="evenodd" d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"/>
          </svg>
        `,
        );
      }

      let keyboardUser = false;
      const handleFirstTab = (event: KeyboardEvent) => {
        if (event.key !== "Tab") return;
        keyboardUser = true;
        window.removeEventListener("keydown", handleFirstTab);
      };
      window.addEventListener("keydown", handleFirstTab);

      const refreshMenuItemRoles = () => {
        queryMenuItems(panel).forEach((item) => {
          if (!item.hasAttribute("role")) {
            const role = getSemanticMenuItemRole(item);
            item.setAttribute("role", role);
            if (role !== "menuitem" && !item.hasAttribute("aria-checked")) {
              item.setAttribute("aria-checked", "false");
            }
          }
        });
      };

      let openState = element.hasAttribute("open");

      const syncState = (
        open: DropdownOpenState,
        options: { restoreFocus?: boolean } = {},
      ) => {
        openState = open;
        button.setAttribute("aria-expanded", String(open));
        element.toggleAttribute("open", open);
        panel.setAttribute("aria-hidden", String(!open));
        setOpenState(panel, open);
        if (!open && options.restoreFocus) {
          button.focus();
        }
      };

      const setOpen = (
        open: DropdownOpenState,
        options: DropdownOpenOptions = {},
      ) => {
        const nextOpen = open;
        if (openState === nextOpen) {
          if (!nextOpen && options.restoreFocus) button.focus();
          return;
        }

        syncState(nextOpen);

        if (nextOpen && options.focusFirst) {
          requestAnimationFrame(() => {
            const items = queryMenuItems(panel);
            if (items.length) items[0].focus();
            else panel.focus();
          });
        }

        if (!nextOpen && options.restoreFocus) {
          button.focus();
        }
      };

      const openDropdown = () => {
        setOpen(true, { focusFirst: keyboardUser });
      };

      const close = () => {
        setOpen(false, { restoreFocus: true });
      };

      const toggle = () => {
        setOpen(!openState);
      };

      refreshMenuItemRoles();
      syncState(openState);

      const observer = new MutationObserver((records) => {
        if (
          records.some(
            (record) =>
              record.type === "childList" ||
              (record.type === "attributes" && record.attributeName === "role"),
          )
        ) {
          refreshMenuItemRoles();
        }
        if (
          records.some(
            (record) =>
              record.type === "attributes" &&
              (record.attributeName === "dir" ||
                record.attributeName === "disabled" ||
                record.attributeName === "aria-disabled"),
          )
        ) {
          refreshMenuItemRoles();
        }

        const shouldSyncOpen = records.some(
          (record) =>
            record.type === "attributes" &&
            record.target === element &&
            record.attributeName === "open",
        );
        if (!shouldSyncOpen) return;

        const nextOpen = element.hasAttribute("open");
        if (nextOpen !== openState) {
          syncState(nextOpen);
        }
      });
      observer.observe(element, {
        attributes: true,
        attributeFilter: ["aria-disabled", "dir", "disabled", "open", "role"],
        childList: true,
        subtree: true,
      });
      observer.observe(panel, {
        attributes: true,
        attributeFilter: ["dir", "role"],
        childList: true,
        subtree: true,
      });

      const handleButtonClick = () => {
        if (button.disabled || button.getAttribute("aria-disabled") === "true")
          return;
        toggle();
      };

      const handlePanelClick = (event: MouseEvent) => {
        if (!(event.target instanceof Element)) return;

        const item = event.target.closest(
          'a, button, [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]',
        );

        if (!item || !panel.contains(item)) return;
        if (
          item.hasAttribute("disabled") ||
          item.getAttribute("aria-disabled") === "true" ||
          item.getAttribute("aria-haspopup") === "menu"
        ) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();
        close();
      };

      button.addEventListener("click", handleButtonClick);
      panel.addEventListener("click", handlePanelClick);

      const handleClickOutside = (event: MouseEvent) => {
        if (
          event.target instanceof Node &&
          !element.contains(event.target) &&
          openState
        ) {
          close();
        }
      };

      document.addEventListener("click", handleClickOutside);

      const handleKeyDown = (event: KeyboardEvent) => {
        const items = queryMenuItems(panel);
        const activeElement =
          document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null;
        const currentIndex = activeElement ? items.indexOf(activeElement) : -1;

        if (!openState) {
          if (
            document.activeElement === button &&
            (event.key === "ArrowDown" || event.key === "ArrowUp")
          ) {
            event.preventDefault();
            openDropdown();
          }
          return;
        }

        switch (event.key) {
          case "Escape":
            close();
            break;

          case "ArrowDown":
            event.preventDefault();
            if (items.length) {
              const nextIndex =
                currentIndex < items.length - 1 ? currentIndex + 1 : 0;
              items[nextIndex].focus();
            }
            break;

          case "ArrowUp":
            event.preventDefault();
            if (items.length) {
              const prevIndex =
                currentIndex > 0 ? currentIndex - 1 : items.length - 1;
              items[prevIndex].focus();
            }
            break;

          case "Home":
            event.preventDefault();
            if (items.length) items[0].focus();
            break;

          case "End":
            event.preventDefault();
            if (items.length) items[items.length - 1].focus();
            break;

          case "Enter":
          case " ": {
            const active = document.activeElement;
            if (active instanceof HTMLElement) {
              event.preventDefault();
              active.click();
            }
            break;
          }
        }
      };

      document.addEventListener("keydown", handleKeyDown);

      const destroy = () => {
        observer.disconnect();
        button.removeEventListener("click", handleButtonClick);
        panel.removeEventListener("click", handlePanelClick);
        document.removeEventListener("click", handleClickOutside);
        document.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keydown", handleFirstTab);
        cleanupSubmenus();
      };

      onDestroy(scope, destroy);
    },
  };
}
