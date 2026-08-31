import type {} from "@angular-wave/angular.ts";

import { onDestroy, queryAll } from "../../internal/dom";

type SidebarScope = ng.Scope;
let sidebarIdCounter = 0;

const selectors = {
  group: '[data-slot="sidebar-group"], [ng-sidebar-group]',
  groupAction: '[data-slot="sidebar-group-action"], [ng-sidebar-group-action]',
  groupLabel: '[data-slot="sidebar-group-label"], [ng-sidebar-group-label]',
  menuAction: '[data-slot="sidebar-menu-action"], [ng-sidebar-menu-action]',
  menuButton: '[data-slot="sidebar-menu-button"], [ng-sidebar-menu-button]',
};

const sidebarOptions = {
  collapsible: new Set(["icon", "none", "offcanvas"]),
  side: new Set(["left", "right"]),
  variant: new Set(["floating", "inset", "sidebar"]),
};

const getDataState = (collapsed: boolean): "collapsed" | "expanded" =>
  collapsed ? "collapsed" : "expanded";

const setAttributeIfChanged = (
  element: HTMLElement,
  name: string,
  value: string,
) => {
  if (element.getAttribute(name) !== value) {
    element.setAttribute(name, value);
  }
};

/**
 * Binds open/closed state to sidebar-related triggers and manages ARIA state.
 */
export function sidebarDirective(): ng.Directive {
  return {
    link(scope: SidebarScope, element: HTMLElement) {
      const triggerSelector = element.id
        ? `[aria-controls="${element.id}"], [data-sidebar-target="${element.id}"]`
        : "[ng-sidebar-trigger], [data-slot='sidebar-trigger']";
      const cleanupTriggers = new Map<HTMLElement, () => void>();
      const directionOwner = element.closest<HTMLElement>("[dir]") || element;
      const mobileQuery = window.matchMedia("(max-width: 767px)");
      const ownedCurrent = new WeakSet<HTMLElement>();
      const getDirection = () =>
        element.closest<HTMLElement>("[dir]")?.getAttribute("dir") === "rtl"
          ? "rtl"
          : "ltr";
      const syncDirection = () => {
        setAttributeIfChanged(element, "data-direction", getDirection());
      };
      const syncResponsive = () => {
        setAttributeIfChanged(
          element,
          "data-mobile",
          String(mobileQuery.matches),
        );
      };
      const getCollapsed = () =>
        element.getAttribute("data-state") === getDataState(true);

      const syncOptions = () => {
        const reflect = (
          name: keyof typeof sidebarOptions,
          fallback: string,
        ) => {
          const authored = element.getAttribute(name);
          setAttributeIfChanged(
            element,
            `data-${name}`,
            authored && sidebarOptions[name].has(authored)
              ? authored
              : fallback,
          );
        };
        reflect("collapsible", "offcanvas");
        reflect("side", "left");
        reflect("variant", "sidebar");
      };

      const setCollapsed = (collapsed: boolean) => {
        if (element.getAttribute("data-collapsible") === "none") {
          collapsed = false;
        }
        const hidden =
          collapsed && element.getAttribute("data-collapsible") === "offcanvas";
        const nextState = getDataState(collapsed);
        setAttributeIfChanged(element, "data-open", String(!collapsed));
        setAttributeIfChanged(element, "data-state", nextState);
        setAttributeIfChanged(element, "aria-hidden", String(hidden));
        cleanupTriggers.forEach((_, trigger) => {
          setAttributeIfChanged(trigger, "aria-expanded", String(!collapsed));
          setAttributeIfChanged(
            trigger,
            "data-state",
            collapsed ? "closed" : "open",
          );
        });
        if (hidden && element.contains(document.activeElement)) {
          cleanupTriggers.keys().next().value?.focus();
        }
      };

      const syncFromState = () => {
        syncOptions();
        syncDirection();
        syncResponsive();
        setCollapsed(getCollapsed());
      };

      const syncStructure = () => {
        queryAll<HTMLElement>(element, selectors.group).forEach((group) => {
          const label = group.querySelector<HTMLElement>(selectors.groupLabel);
          if (!label) return;
          if (!label.id) label.id = `sidebar-group-label-${sidebarIdCounter++}`;
          setAttributeIfChanged(group, "aria-labelledby", label.id);
        });
        queryAll<HTMLElement>(element, selectors.menuButton).forEach(
          (button) => {
            if (
              button instanceof HTMLButtonElement &&
              !button.hasAttribute("type")
            ) {
              button.type = "button";
            }
            const dataActive = button.getAttribute("data-active");
            const active =
              dataActive === null
                ? button.getAttribute("aria-current") === "page"
                : dataActive === "true";
            setAttributeIfChanged(button, "data-active", String(active));
            if (active && !button.hasAttribute("aria-current")) {
              button.setAttribute("aria-current", "page");
              ownedCurrent.add(button);
            } else if (!active && ownedCurrent.has(button)) {
              button.removeAttribute("aria-current");
              ownedCurrent.delete(button);
            }
          },
        );
        queryAll<HTMLElement>(
          element,
          `${selectors.groupAction}, ${selectors.menuAction}`,
        ).forEach((action) => {
          if (
            action instanceof HTMLButtonElement &&
            !action.hasAttribute("type")
          ) {
            action.type = "button";
          }
        });
      };

      const bindTrigger = (trigger: HTMLElement) => {
        if (cleanupTriggers.has(trigger)) return;

        if (element.id) {
          setAttributeIfChanged(trigger, "aria-controls", element.id);
        }
        setAttributeIfChanged(
          trigger,
          "aria-expanded",
          String(!getCollapsed()),
        );
        setAttributeIfChanged(
          trigger,
          "data-state",
          getCollapsed() ? "closed" : "open",
        );

        if (
          trigger instanceof HTMLButtonElement &&
          !trigger.hasAttribute("type")
        ) {
          trigger.type = "button";
        }

        if (trigger.hasAttribute("data-sidebar-controlled")) {
          cleanupTriggers.set(trigger, () => undefined);
          return;
        }

        const handleClick = () => {
          setCollapsed(!getCollapsed());
        };
        trigger.addEventListener("click", handleClick);
        cleanupTriggers.set(trigger, () =>
          trigger.removeEventListener("click", handleClick),
        );
      };

      const syncTriggers = () => {
        queryAll<HTMLElement>(document, triggerSelector).forEach(bindTrigger);
        cleanupTriggers.forEach((cleanup, trigger) => {
          if (!trigger.isConnected || !trigger.matches(triggerSelector)) {
            cleanup();
            cleanupTriggers.delete(trigger);
          }
        });
        setCollapsed(getCollapsed());
      };

      element.setAttribute(
        "role",
        element.getAttribute("role") || "complementary",
      );

      syncFromState();
      syncStructure();
      syncTriggers();

      const stateObserver = new MutationObserver(syncFromState);
      stateObserver.observe(element, {
        attributes: true,
        attributeFilter: [
          "collapsible",
          "data-state",
          "dir",
          "side",
          "variant",
        ],
      });
      const directionObserver =
        directionOwner === element ? null : new MutationObserver(syncFromState);
      directionObserver?.observe(directionOwner, {
        attributes: true,
        attributeFilter: ["dir"],
      });
      const triggerObserver = new MutationObserver(syncTriggers);
      triggerObserver.observe(document.body, {
        attributes: true,
        attributeFilter: ["aria-controls", "data-sidebar-target"],
        childList: true,
        subtree: true,
      });
      const structureObserver = new MutationObserver(syncStructure);
      structureObserver.observe(element, {
        attributes: true,
        attributeFilter: ["aria-current", "data-active", "id"],
        childList: true,
        subtree: true,
      });
      mobileQuery.addEventListener("change", syncResponsive);

      onDestroy(scope, () => {
        stateObserver.disconnect();
        directionObserver?.disconnect();
        triggerObserver.disconnect();
        structureObserver.disconnect();
        mobileQuery.removeEventListener("change", syncResponsive);
        cleanupTriggers.forEach((cleanup) => cleanup());
        cleanupTriggers.clear();
      });
    },
  };
}
