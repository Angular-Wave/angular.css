import { onDestroy } from "../../internal/dom";
import { bindSemanticSubmenus } from "../../internal/menu";
let dropdownIdCounter = 0;
const coerceBoolean = (value) => {
    return value === true || value === "true" || value === 1;
};
const queryMenuItems = (panel) => Array.from(panel.querySelectorAll('a, button, [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]')).filter((item) => item instanceof HTMLElement &&
    !item.closest("[hidden]") &&
    !item.hasAttribute("disabled") &&
    item.getAttribute("aria-disabled") !== "true");
export function dropdownDirective() {
    return {
        link(scope, element) {
            const button = element.querySelector("button");
            const panel = element.querySelector('[role="menu"], [data-slot="dropdown-menu-content"], [ng-dropdown-content]');
            if (!button || !panel)
                return;
            const setAttribute = (target, name, value) => {
                if (target.getAttribute(name) !== value) {
                    target.setAttribute(name, value);
                }
            };
            const directionOwner = element.closest("[dir]") ?? element;
            const getDirection = () => element.closest("[dir]")?.getAttribute("dir") === "rtl"
                ? "rtl"
                : "ltr";
            const syncDirection = () => {
                const direction = getDirection();
                setAttribute(element, "data-direction", direction);
                setAttribute(panel, "data-direction", direction);
            };
            const authoredRootDisabled = element.getAttribute("data-disabled") === "true";
            const syncDisabled = () => {
                const disabled = button.disabled || authoredRootDisabled;
                setAttribute(element, "data-disabled", String(disabled));
                setAttribute(button, "aria-disabled", String(disabled));
            };
            const cleanupSubmenus = bindSemanticSubmenus(element, "dropdown-menu", getDirection);
            const panelId = panel.id || `menu-${String(dropdownIdCounter++)}`;
            panel.id = panelId;
            if (!button.id)
                button.id = `dropdown-btn-${String(dropdownIdCounter++)}`;
            button.setAttribute("aria-haspopup", "true");
            button.setAttribute("aria-expanded", "false");
            button.setAttribute("aria-controls", panelId);
            panel.setAttribute("role", panel.getAttribute("role") ?? "menu");
            panel.setAttribute("tabindex", panel.getAttribute("tabindex") ?? "-1");
            panel.setAttribute("aria-labelledby", button.id);
            const isIconTrigger = button.getAttribute("size")?.startsWith("icon") ??
                button.getAttribute("data-size")?.startsWith("icon");
            if (!button.querySelector("svg") && !isIconTrigger) {
                button.insertAdjacentHTML("beforeend", `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-4">
            <path fill-rule="evenodd" d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"/>
          </svg>
        `);
            }
            let keyboardUser = false;
            const handleFirstTab = (event) => {
                if (event.key !== "Tab")
                    return;
                keyboardUser = true;
                window.removeEventListener("keydown", handleFirstTab);
            };
            window.addEventListener("keydown", handleFirstTab);
            const refreshMenuItemRoles = () => {
                queryMenuItems(panel).forEach((item) => {
                    if (!item.hasAttribute("role")) {
                        item.setAttribute("role", "menuitem");
                    }
                });
            };
            let openState = coerceBoolean(element.getAttribute("data-open") ?? panel.getAttribute("data-open"));
            const syncState = (open, options = {}) => {
                openState = open;
                button.setAttribute("aria-expanded", String(open));
                button.setAttribute("data-state", open ? "open" : "closed");
                element.setAttribute("data-open", String(open));
                element.setAttribute("data-state", open ? "open" : "closed");
                panel.setAttribute("data-open", String(open));
                panel.setAttribute("data-state", open ? "open" : "closed");
                if (!open && options.restoreFocus) {
                    button.focus();
                }
            };
            const setOpen = (open, options = {}) => {
                const nextOpen = coerceBoolean(open);
                if (openState === nextOpen) {
                    if (!nextOpen && options.restoreFocus)
                        button.focus();
                    return;
                }
                syncState(nextOpen);
                if (nextOpen && options.focusFirst) {
                    requestAnimationFrame(() => {
                        const items = queryMenuItems(panel);
                        if (items.length)
                            items[0].focus();
                        else
                            panel.focus();
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
            syncDirection();
            syncDisabled();
            syncState(openState);
            const observer = new MutationObserver((records) => {
                if (records.some((record) => record.type === "childList" ||
                    (record.type === "attributes" && record.attributeName === "role"))) {
                    refreshMenuItemRoles();
                }
                if (records.some((record) => record.type === "attributes" &&
                    (record.attributeName === "dir" ||
                        record.attributeName === "disabled" ||
                        record.attributeName === "aria-disabled" ||
                        record.attributeName === "data-disabled"))) {
                    syncDirection();
                    syncDisabled();
                }
                const shouldSyncOpen = records.some((record) => record.type === "attributes" &&
                    record.attributeName === "data-open");
                if (!shouldSyncOpen)
                    return;
                const nextOpen = coerceBoolean(element.getAttribute("data-open") ?? panel.getAttribute("data-open"));
                if (nextOpen !== openState) {
                    syncState(nextOpen);
                }
            });
            observer.observe(element, {
                attributes: true,
                attributeFilter: [
                    "aria-disabled",
                    "data-disabled",
                    "data-open",
                    "dir",
                    "disabled",
                    "role",
                ],
                childList: true,
                subtree: true,
            });
            observer.observe(panel, {
                attributes: true,
                attributeFilter: ["data-open", "dir", "role"],
                childList: true,
                subtree: true,
            });
            const directionObserver = directionOwner === element
                ? null
                : new MutationObserver(() => {
                    syncDirection();
                });
            directionObserver?.observe(directionOwner, {
                attributes: true,
                attributeFilter: ["dir"],
            });
            const handleButtonClick = () => {
                syncDisabled();
                if (element.getAttribute("data-disabled") === "true")
                    return;
                toggle();
            };
            const handlePanelClick = (event) => {
                if (!(event.target instanceof Element))
                    return;
                const item = event.target.closest('a, button, [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]');
                if (!item || !panel.contains(item))
                    return;
                if (item.hasAttribute("disabled") ||
                    item.getAttribute("aria-disabled") === "true" ||
                    item.getAttribute("aria-haspopup") === "menu") {
                    return;
                }
                event.preventDefault();
                event.stopPropagation();
                close();
            };
            button.addEventListener("click", handleButtonClick);
            panel.addEventListener("click", handlePanelClick);
            const handleClickOutside = (event) => {
                if (event.target instanceof Node &&
                    !element.contains(event.target) &&
                    openState) {
                    close();
                }
            };
            document.addEventListener("click", handleClickOutside);
            const handleKeyDown = (event) => {
                const items = queryMenuItems(panel);
                const activeElement = document.activeElement instanceof HTMLElement
                    ? document.activeElement
                    : null;
                const currentIndex = activeElement ? items.indexOf(activeElement) : -1;
                if (!openState) {
                    if (document.activeElement === button &&
                        (event.key === "ArrowDown" || event.key === "ArrowUp")) {
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
                            const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
                            items[nextIndex].focus();
                        }
                        break;
                    case "ArrowUp":
                        event.preventDefault();
                        if (items.length) {
                            const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
                            items[prevIndex].focus();
                        }
                        break;
                    case "Home":
                        event.preventDefault();
                        if (items.length)
                            items[0].focus();
                        break;
                    case "End":
                        event.preventDefault();
                        if (items.length)
                            items[items.length - 1].focus();
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
                directionObserver?.disconnect();
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
