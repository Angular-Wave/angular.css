import type {} from "@angular-wave/angular.ts";

import { onDestroy, queryAll } from "../../internal/dom";

type SidebarScope = ng.Scope;
let sidebarIdCounter = 0;

const selectors = {
  group: ":scope > nav > section",
  groupLabel: ":scope > :is(h1, h2, h3, h4, h5, h6)",
  menuButton:
    ":scope > nav li > :is(a, button, summary), :scope > :is(header, footer) > :is(a, button), :scope > :is(header, footer) > [ng-dropdown] > button",
};

const sidebarOptions = {
  collapsible: new Set(["icon", "none", "offcanvas"]),
  side: new Set(["left", "right"]),
  variant: new Set(["floating", "inset", "sidebar"]),
};

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
        ? `[aria-controls="${element.id}"]`
        : ":not(*)";
      const cleanupTriggers = new Map<HTMLElement, () => void>();
      const getCollapsed = () => element.hasAttribute("collapsed");

      const syncOptions = () => {
        const reflect = (
          name: keyof typeof sidebarOptions,
          fallback: string,
        ) => {
          const authored = element.getAttribute(name);
          setAttributeIfChanged(
            element,
            name,
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
        if (element.getAttribute("collapsible") === "none") {
          collapsed = false;
        }
        const hidden =
          collapsed && element.getAttribute("collapsible") === "offcanvas";
        element.toggleAttribute("collapsed", collapsed);
        setAttributeIfChanged(element, "aria-hidden", String(hidden));
        cleanupTriggers.forEach((_, trigger) => {
          setAttributeIfChanged(trigger, "aria-expanded", String(!collapsed));
        });
        if (hidden && element.contains(document.activeElement)) {
          cleanupTriggers.keys().next().value?.focus();
        }
      };

      const syncFromState = () => {
        syncOptions();
        setCollapsed(getCollapsed());
      };

      const syncStructure = () => {
        queryAll<HTMLElement>(element, selectors.group).forEach((group) => {
          const label = group.querySelector<HTMLElement>(selectors.groupLabel);
          if (!label) return;
          if (!label.id)
            label.id = `sidebar-group-label-${String(sidebarIdCounter++)}`;
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
          },
        );
        queryAll<HTMLButtonElement>(element, "button").forEach((button) => {
          if (!button.hasAttribute("type")) button.type = "button";
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

        if (
          trigger instanceof HTMLButtonElement &&
          !trigger.hasAttribute("type")
        ) {
          trigger.type = "button";
        }

        if (trigger.hasAttribute("ng-click")) {
          cleanupTriggers.set(trigger, () => undefined);
          return;
        }

        const handleClick = () => {
          setCollapsed(!getCollapsed());
        };
        trigger.addEventListener("click", handleClick);
        cleanupTriggers.set(trigger, () => {
          trigger.removeEventListener("click", handleClick);
        });
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

      if (element.tagName !== "ASIDE" && !element.hasAttribute("role")) {
        element.setAttribute("role", "complementary");
      }

      syncFromState();
      syncStructure();
      syncTriggers();

      const stateObserver = new MutationObserver(syncFromState);
      stateObserver.observe(element, {
        attributes: true,
        attributeFilter: ["collapsible", "collapsed", "dir", "side", "variant"],
      });
      const triggerObserver = new MutationObserver(syncTriggers);
      triggerObserver.observe(document.body, {
        attributes: true,
        attributeFilter: ["aria-controls"],
        childList: true,
        subtree: true,
      });
      const structureObserver = new MutationObserver(syncStructure);
      structureObserver.observe(element, {
        attributes: true,
        attributeFilter: ["id"],
        childList: true,
        subtree: true,
      });
      onDestroy(scope, () => {
        stateObserver.disconnect();
        triggerObserver.disconnect();
        structureObserver.disconnect();
        cleanupTriggers.forEach((cleanup) => {
          cleanup();
        });
        cleanupTriggers.clear();
      });
    },
  };
}
