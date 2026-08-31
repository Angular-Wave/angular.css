/* Version: 0.0.1 - September 1, 2026 02:53:42 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.angularCss = {}));
})(this, (function (exports) { 'use strict';

    function query(root, selector, constructor) {
        const result = root.querySelector(selector);
        return constructor && !(result instanceof constructor) ? null : result;
    }
    function queryAll(root, selector) {
        return Array.from(root.querySelectorAll(selector));
    }
    function setOpenState(element, open) {
        const nextOpen = String(open);
        if (element.getAttribute("data-open") !== nextOpen) {
            element.setAttribute("data-open", nextOpen);
        }
        if (element.hidden === open) {
            element.hidden = !open;
        }
    }
    function isDisabled(element) {
        return (element.hasAttribute("disabled") ||
            element.getAttribute("aria-disabled") === "true" ||
            element.getAttribute("data-disabled") === "true");
    }
    function nextIndex(currentIndex, length, direction) {
        if (length <= 0)
            return -1;
        if (currentIndex < 0)
            return direction === 1 ? 0 : length - 1;
        return (currentIndex + direction + length) % length;
    }
    function onDestroy(scope, cleanup) {
        if (typeof scope?.$on === "function") {
            scope.$on("$destroy", cleanup);
        }
    }

    let accordionIdCounter = 0;
    const isBooleanAttribute = (value) => value === "" || value === "true";
    const isElementClosed = (value) => value === "closed" || value === "0" || value === "false";
    const setAttributeIfChanged$h = (element, name, value) => {
        if (element.getAttribute(name) !== value) {
            element.setAttribute(name, value);
        }
    };
    const resolveItems = (element) => {
        const explicit = Array.from(element.children).filter((child) => child instanceof HTMLElement &&
            (child.matches("[data-slot='accordion-item']") ||
                child.matches("[ng-accordion-item]")));
        if (explicit.length) {
            return explicit;
        }
        return Array.from(element.children).filter((child) => child instanceof HTMLElement);
    };
    const resolveHeader = (item) => {
        return (item.querySelector("[data-slot='accordion-header']") ??
            (item.firstElementChild instanceof HTMLElement
                ? item.firstElementChild
                : null));
    };
    const resolvePanel = (item, header) => {
        return (item.querySelector("[data-slot='accordion-content']") ??
            item.querySelector("[data-slot='accordion-panel']") ??
            (header.nextElementSibling instanceof HTMLElement
                ? header.nextElementSibling
                : item.lastElementChild instanceof HTMLElement
                    ? item.lastElementChild
                    : null));
    };
    const resolveTrigger = (header) => {
        const slotTrigger = header.querySelector("[data-slot='accordion-trigger']") ??
            header.querySelector("button[data-slot='accordion-trigger']");
        const trigger = slotTrigger ?? header.querySelector("button");
        if (trigger instanceof HTMLButtonElement)
            return trigger;
        return header instanceof HTMLButtonElement ? header : null;
    };
    const setItemState = (item, open) => {
        const header = resolveHeader(item);
        const panel = header ? resolvePanel(item, header) : null;
        const trigger = header ? resolveTrigger(header) : null;
        if (!header || !panel || !trigger)
            return;
        const itemState = open ? "open" : "closed";
        setAttributeIfChanged$h(item, "data-state", itemState);
        setAttributeIfChanged$h(header, "data-state", itemState);
        setAttributeIfChanged$h(trigger, "aria-expanded", String(open));
        setAttributeIfChanged$h(trigger, "data-state", itemState);
        setAttributeIfChanged$h(panel, "data-open", String(open));
        setAttributeIfChanged$h(panel, "data-state", itemState);
        setAttributeIfChanged$h(panel, "aria-hidden", String(!open));
    };
    function accordionDirective() {
        return {
            link(scope, element) {
                const items = resolveItems(element);
                const allowsMultiple = element.hasAttribute("multiple") ||
                    element.getAttribute("type") === "multiple" ||
                    element.getAttribute("data-type") === "multiple";
                const isItemDisabled = (item, button) => button.disabled ||
                    button.getAttribute("aria-disabled") === "true" ||
                    isBooleanAttribute(item.getAttribute("data-disabled")) ||
                    item.hasAttribute("disabled");
                const isPanelOpen = (item) => {
                    const header = resolveHeader(item);
                    if (!header)
                        return false;
                    const panel = resolvePanel(item, header);
                    const trigger = resolveTrigger(header);
                    if (!panel || !trigger)
                        return false;
                    const triggerOpen = trigger.getAttribute("aria-expanded") === "true";
                    const itemOpen = item.getAttribute("data-state") === "open";
                    const panelOpen = panel.getAttribute("data-state") === "open" ||
                        panel.getAttribute("data-open") === "true";
                    return triggerOpen || itemOpen || panelOpen;
                };
                const cleanupButtons = [];
                let hasInitialOpen = false;
                let reflectingState = false;
                const setItemStateFromDirective = (item, open) => {
                    reflectingState = true;
                    setItemState(item, open);
                    queueMicrotask(() => {
                        reflectingState = false;
                    });
                };
                items.forEach((item) => {
                    const header = resolveHeader(item);
                    if (!header)
                        return;
                    const panel = resolvePanel(item, header);
                    const button = resolveTrigger(header);
                    if (!button || !panel)
                        return;
                    if (!button.querySelector("svg")) {
                        button.insertAdjacentHTML("beforeend", `
              <svg xmlns="http://www.w3.org/2000/svg"
                   data-slot="accordion-trigger-icon"
                   aria-hidden="true"
                   width="24" height="24"
                   fill="none"
                   viewBox="0 0 24 24"
                   stroke-width="2"
                   stroke-linecap="round"
                   stroke-linejoin="round"
                   stroke="currentColor">
                <path d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            `);
                    }
                    const id = button.id || `accordion-btn-${accordionIdCounter.toString(36)}`;
                    const panelId = button.id
                        ? `${button.id}-panel`
                        : `accordion-panel-${accordionIdCounter.toString(36)}`;
                    accordionIdCounter += 1;
                    button.id = id;
                    panel.id = panelId;
                    button.setAttribute("aria-controls", panelId);
                    panel.setAttribute("role", "region");
                    panel.setAttribute("aria-labelledby", id);
                    item.setAttribute("data-slot", item.getAttribute("data-slot") ?? "accordion-item");
                    const initiallyOpen = isPanelOpen(item);
                    const isClosed = isElementClosed(item.getAttribute("data-state"));
                    const open = isClosed
                        ? false
                        : allowsMultiple
                            ? initiallyOpen
                            : initiallyOpen && !hasInitialOpen;
                    if (open)
                        hasInitialOpen = true;
                    setItemStateFromDirective(item, open);
                    const handleClick = () => {
                        if (isItemDisabled(item, button))
                            return;
                        const isOpen = isPanelOpen(item);
                        const nextOpen = !isOpen;
                        if (!allowsMultiple) {
                            items.forEach((otherItem) => {
                                setItemStateFromDirective(otherItem, false);
                            });
                        }
                        setItemStateFromDirective(item, nextOpen);
                    };
                    const handleKeydown = (event) => {
                        if (event.key !== "ArrowDown" &&
                            event.key !== "ArrowUp" &&
                            event.key !== "Home" &&
                            event.key !== "End") {
                            return;
                        }
                        event.preventDefault();
                        const buttons = items
                            .map((nextItem) => {
                            const itemHeader = resolveHeader(nextItem);
                            if (!itemHeader)
                                return null;
                            const itemTrigger = resolveTrigger(itemHeader);
                            if (!itemTrigger || isItemDisabled(nextItem, itemTrigger)) {
                                return null;
                            }
                            return itemTrigger;
                        })
                            .filter((itemTrigger) => Boolean(itemTrigger));
                        const currentIndex = buttons.indexOf(button);
                        if (currentIndex === -1)
                            return;
                        const nextButton = event.key === "Home"
                            ? buttons[0]
                            : event.key === "End"
                                ? buttons[buttons.length - 1]
                                : buttons[(currentIndex +
                                    (event.key === "ArrowDown" ? 1 : -1) +
                                    buttons.length) %
                                    buttons.length];
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
                    if (reflectingState)
                        return;
                    let opened = false;
                    items.forEach((item) => {
                        const open = item.getAttribute("data-state") === "open";
                        const nextOpen = allowsMultiple ? open : open && !opened;
                        if (nextOpen)
                            opened = true;
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

    const itemSelector$8 = 'a[href], button, [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]';
    function bindSemanticSubmenus(root, prefix, getDirection) {
        const subSelector = `[data-slot="${prefix}-sub"], [ng-${prefix}-sub]`;
        const triggerSelector = `[data-slot="${prefix}-sub-trigger"], [ng-${prefix}-sub-trigger]`;
        const contentSelector = `[data-slot="${prefix}-sub-content"], [ng-${prefix}-sub-content]`;
        const cleanups = new Map();
        let submenuId = 0;
        const bindSubmenu = (submenu) => {
            if (cleanups.has(submenu))
                return;
            const trigger = query(submenu, triggerSelector, HTMLElement);
            const content = query(submenu, contentSelector, HTMLElement);
            if (!trigger || !content)
                return;
            const contentId = content.id || `${prefix}-sub-content-${String(submenuId++)}`;
            content.id = contentId;
            trigger.setAttribute("aria-controls", contentId);
            trigger.setAttribute("aria-haspopup", "menu");
            content.setAttribute("role", content.getAttribute("role") ?? "menu");
            const getItems = () => queryAll(content, itemSelector$8).filter((item) => !isDisabled(item));
            const syncItems = () => {
                getItems().forEach((item) => {
                    if (!item.hasAttribute("role"))
                        item.setAttribute("role", "menuitem");
                });
            };
            let open = submenu.getAttribute("data-open") === "true" ||
                submenu.getAttribute("data-state") === "open";
            const setOpen = (nextOpen, focus = false) => {
                open = nextOpen;
                const state = open ? "open" : "closed";
                submenu.setAttribute("data-open", String(open));
                submenu.setAttribute("data-state", state);
                trigger.setAttribute("aria-expanded", String(open));
                trigger.setAttribute("data-state", state);
                content.setAttribute("data-state", state);
                content.setAttribute("aria-hidden", String(!open));
                setOpenState(content, open);
                syncItems();
                if (!focus)
                    return;
                if (!open) {
                    trigger.focus({ preventScroll: true });
                    return;
                }
                const firstItem = getItems().find((item) => !item.closest("[hidden]"));
                (firstItem ?? content).focus({ preventScroll: true });
            };
            const handleClick = (event) => {
                if (isDisabled(trigger))
                    return;
                event.preventDefault();
                event.stopPropagation();
                setOpen(!open, open);
            };
            const handlePointerEnter = () => {
                if (!isDisabled(trigger))
                    setOpen(true);
            };
            const handlePointerLeave = () => {
                setOpen(false);
            };
            const handleKeydown = (event) => {
                const openKey = getDirection() === "rtl" ? "ArrowLeft" : "ArrowRight";
                const closeKey = getDirection() === "rtl" ? "ArrowRight" : "ArrowLeft";
                const target = event.target instanceof HTMLElement ? event.target : null;
                if (target === trigger && event.key === openKey) {
                    event.preventDefault();
                    event.stopPropagation();
                    setOpen(true, true);
                    return;
                }
                if (open && content.contains(target) && event.key === closeKey) {
                    event.preventDefault();
                    event.stopPropagation();
                    setOpen(false, true);
                    return;
                }
                if (open && event.key === "Escape") {
                    setOpen(false, true);
                }
            };
            const syncAuthoredState = () => {
                const authoredOpen = submenu.getAttribute("data-open");
                if (authoredOpen !== null && (authoredOpen === "true") !== open) {
                    setOpen(authoredOpen === "true");
                }
            };
            trigger.addEventListener("click", handleClick);
            submenu.addEventListener("pointerenter", handlePointerEnter);
            submenu.addEventListener("pointerleave", handlePointerLeave);
            submenu.addEventListener("keydown", handleKeydown, true);
            const stateObserver = new MutationObserver(syncAuthoredState);
            stateObserver.observe(submenu, {
                attributes: true,
                attributeFilter: ["data-open"],
            });
            syncItems();
            setOpen(open);
            cleanups.set(submenu, () => {
                trigger.removeEventListener("click", handleClick);
                submenu.removeEventListener("pointerenter", handlePointerEnter);
                submenu.removeEventListener("pointerleave", handlePointerLeave);
                submenu.removeEventListener("keydown", handleKeydown, true);
                stateObserver.disconnect();
            });
        };
        const sync = () => {
            queryAll(root, subSelector).forEach(bindSubmenu);
            cleanups.forEach((cleanup, submenu) => {
                if (!submenu.isConnected || !root.contains(submenu)) {
                    cleanup();
                    cleanups.delete(submenu);
                }
            });
            if (root.getAttribute("data-state") === "closed") {
                queryAll(root, subSelector).forEach((submenu) => {
                    if (submenu.getAttribute("data-open") !== "false") {
                        submenu.setAttribute("data-open", "false");
                    }
                });
            }
        };
        const observer = new MutationObserver(sync);
        observer.observe(root, {
            attributes: true,
            attributeFilter: ["data-state"],
            childList: true,
            subtree: true,
        });
        sync();
        return () => {
            observer.disconnect();
            cleanups.forEach((cleanup) => {
                cleanup();
            });
            cleanups.clear();
        };
    }

    let dropdownIdCounter = 0;
    const coerceBoolean = (value) => {
        return value === true || value === "true" || value === 1;
    };
    const queryMenuItems = (panel) => Array.from(panel.querySelectorAll('a, button, [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]')).filter((item) => item instanceof HTMLElement &&
        !item.closest("[hidden]") &&
        !item.hasAttribute("disabled") &&
        item.getAttribute("aria-disabled") !== "true");
    function dropdownDirective() {
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

    function alertDirective() {
        return {
            link(_scope, element) {
                const variant = element.getAttribute("variant") ??
                    element.getAttribute("data-variant") ??
                    "default";
                element.setAttribute("data-variant", variant);
                const role = element.getAttribute("role") ?? "alert";
                element.setAttribute("role", role);
                if (!element.hasAttribute("aria-live")) {
                    element.setAttribute("aria-live", role === "alert" ? "assertive" : "polite");
                }
                if (!element.hasAttribute("aria-atomic")) {
                    element.setAttribute("aria-atomic", "true");
                }
            },
        };
    }

    let overlayIdCounter = 0;
    let scrollLockCount = 0;
    let documentElementOverflow = "";
    let bodyOverflow = "";
    const openOverlayStack = [];
    const focusableSelector$1 = [
        "a[href]",
        "button",
        "input",
        "select",
        "textarea",
        '[tabindex]:not([tabindex="-1"])',
        '[contenteditable="true"]',
    ].join(", ");
    const setAttributeIfChanged$g = (element, name, value) => {
        if (element.getAttribute(name) !== value) {
            element.setAttribute(name, value);
        }
    };
    function restoreFocus(element) {
        if (element?.isConnected && !isDisabled(element)) {
            element.focus({ preventScroll: true });
        }
    }
    function bindEscapeClose(elements, isOpen, close) {
        const handleKeydown = (event) => {
            if (event.key !== "Escape" || !isOpen())
                return;
            event.preventDefault();
            close();
        };
        elements.forEach((element) => {
            element.addEventListener("keydown", handleKeydown);
        });
        return () => {
            elements.forEach((element) => {
                element.removeEventListener("keydown", handleKeydown);
            });
        };
    }
    const lockDocumentScroll = () => {
        if (scrollLockCount === 0) {
            documentElementOverflow = document.documentElement.style.overflow;
            bodyOverflow = document.body.style.overflow;
            document.documentElement.style.overflow = "hidden";
            document.body.style.overflow = "hidden";
        }
        scrollLockCount += 1;
    };
    const unlockDocumentScroll = () => {
        scrollLockCount = Math.max(0, scrollLockCount - 1);
        if (scrollLockCount === 0) {
            document.documentElement.style.overflow = documentElementOverflow;
            document.body.style.overflow = bodyOverflow;
        }
    };
    function bindOverlay(scope, element, parts) {
        const rootSelector = parts.rootSelector;
        const isOwned = (candidate) => !rootSelector || candidate.closest(rootSelector) === element;
        const ownedAll = (selector) => queryAll(element, selector).filter(isOwned);
        const owned = (selector) => selector ? (ownedAll(selector)[0] ?? null) : null;
        if (!element.id) {
            element.id = `overlay-${String(overlayIdCounter++)}`;
        }
        const directionOwner = element.closest("[dir]") ?? element;
        const boundTriggers = new Set();
        const boundCloseButtons = new Set();
        const boundOverlays = new Set();
        const inertSnapshots = new Map();
        let internalOpen = element.getAttribute("data-open") === "true" ||
            owned(parts.contentSelector)?.getAttribute("data-open") === "true";
        let initialized = false;
        let isolated = false;
        let activeTrigger = null;
        let redirectingFocus = false;
        const getContent = () => owned(parts.contentSelector);
        const getOverlay = () => owned(parts.overlaySelector);
        const getInternalTriggers = () => parts.triggerSelector ? ownedAll(parts.triggerSelector) : [];
        const getExternalTriggers = () => [
            ...new Set([
                ...queryAll(document, `[aria-controls="${CSS.escape(element.id)}"]`),
                ...queryAll(document, `[data-overlay-target="${CSS.escape(element.id)}"]`),
            ]),
        ].filter((trigger) => !element.contains(trigger));
        const getTriggers = () => [
            ...getInternalTriggers(),
            ...getExternalTriggers(),
        ];
        const isTopmost = () => openOverlayStack[openOverlayStack.length - 1] === element;
        const removeFromStack = () => {
            const index = openOverlayStack.lastIndexOf(element);
            if (index >= 0)
                openOverlayStack.splice(index, 1);
        };
        const isolateBackground = () => {
            if (isolated)
                return;
            let branch = element;
            let parent = branch.parentElement;
            while (parent) {
                Array.from(parent.children).forEach((sibling) => {
                    if (sibling === branch ||
                        !(sibling instanceof HTMLElement) ||
                        /^(LINK|SCRIPT|STYLE)$/.test(sibling.tagName) ||
                        inertSnapshots.has(sibling)) {
                        return;
                    }
                    inertSnapshots.set(sibling, {
                        ariaHidden: sibling.getAttribute("aria-hidden"),
                        inert: sibling.inert,
                    });
                    sibling.inert = true;
                    sibling.setAttribute("aria-hidden", "true");
                });
                if (parent === document.body)
                    break;
                branch = parent;
                parent = parent.parentElement;
            }
            lockDocumentScroll();
            isolated = true;
        };
        const restoreBackground = () => {
            if (!isolated)
                return;
            inertSnapshots.forEach((snapshot, sibling) => {
                sibling.inert = snapshot.inert;
                if (snapshot.ariaHidden === null) {
                    sibling.removeAttribute("aria-hidden");
                }
                else {
                    sibling.setAttribute("aria-hidden", snapshot.ariaHidden);
                }
            });
            inertSnapshots.clear();
            unlockDocumentScroll();
            isolated = false;
        };
        const getFocusableItems = () => {
            const content = getContent();
            if (!content)
                return [];
            return queryAll(content, focusableSelector$1).filter((item) => {
                if (!isOwned(item) ||
                    isDisabled(item) ||
                    item.closest("[hidden], [inert]")) {
                    return false;
                }
                const style = getComputedStyle(item);
                return style.display !== "none" && style.visibility !== "hidden";
            });
        };
        const focusClosest = () => {
            const content = getContent();
            if (!content)
                return;
            const autofocus = ownedAll("[autofocus]").find((candidate) => content.contains(candidate));
            (autofocus ?? getFocusableItems().at(0) ?? content).focus({
                preventScroll: true,
            });
        };
        const reflectState = () => {
            const content = getContent();
            const overlay = getOverlay();
            const state = internalOpen ? "open" : "closed";
            setAttributeIfChanged$g(element, "data-open", String(internalOpen));
            setAttributeIfChanged$g(element, "data-state", state);
            if (content) {
                setAttributeIfChanged$g(content, "data-open", String(internalOpen));
                setAttributeIfChanged$g(content, "data-state", state);
                setAttributeIfChanged$g(content, "aria-hidden", String(!internalOpen));
                setOpenState(content, internalOpen);
            }
            if (overlay) {
                setAttributeIfChanged$g(overlay, "data-state", state);
                setAttributeIfChanged$g(overlay, "aria-hidden", String(!internalOpen));
                setOpenState(overlay, internalOpen);
            }
            getTriggers().forEach((trigger) => {
                setAttributeIfChanged$g(trigger, "data-state", state);
                setAttributeIfChanged$g(trigger, "aria-expanded", String(internalOpen));
            });
        };
        const setOpen = (nextOpen, restoreOnClose = true) => {
            const wasOpen = initialized && internalOpen;
            const opening = nextOpen && !wasOpen;
            const closing = !nextOpen && wasOpen;
            internalOpen = nextOpen;
            reflectState();
            if (opening) {
                removeFromStack();
                openOverlayStack.push(element);
                isolateBackground();
                focusClosest();
            }
            else if (closing) {
                removeFromStack();
                restoreBackground();
                if (restoreOnClose) {
                    restoreFocus(activeTrigger ?? getTriggers().at(0) ?? null);
                }
            }
            initialized = true;
        };
        const handleTriggerClick = (event) => {
            const trigger = event.currentTarget;
            if (!(trigger instanceof HTMLElement) || isDisabled(trigger))
                return;
            event.preventDefault();
            activeTrigger = trigger;
            setOpen(!internalOpen);
        };
        const handleCloseClick = (event) => {
            const closeButton = event.currentTarget;
            if (!(closeButton instanceof HTMLElement) || isDisabled(closeButton))
                return;
            event.preventDefault();
            setOpen(false);
        };
        const handleOverlayClick = (event) => {
            if (parts.closeOnOverlayClick === false ||
                event.target !== event.currentTarget) {
                return;
            }
            setOpen(false);
        };
        const syncDirection = () => {
            const direction = element.closest("[dir]")?.getAttribute("dir") === "rtl"
                ? "rtl"
                : "ltr";
            setAttributeIfChanged$g(element, "data-direction", direction);
            const content = getContent();
            if (content)
                setAttributeIfChanged$g(content, "data-direction", direction);
            const overlay = getOverlay();
            if (overlay)
                setAttributeIfChanged$g(overlay, "data-direction", direction);
        };
        const syncInteractiveParts = () => {
            const content = getContent();
            if (content) {
                if (!content.id)
                    content.id = `${element.id}-content`;
                setAttributeIfChanged$g(content, "role", parts.contentRole ?? "dialog");
                setAttributeIfChanged$g(content, "aria-modal", "true");
                if (!content.hasAttribute("tabindex"))
                    content.tabIndex = -1;
                const title = owned(parts.titleSelector);
                if (title) {
                    if (!title.id)
                        title.id = `${element.id}-title`;
                    setAttributeIfChanged$g(content, "aria-labelledby", title.id);
                }
                const description = owned(parts.descriptionSelector);
                if (description) {
                    if (!description.id)
                        description.id = `${element.id}-description`;
                    setAttributeIfChanged$g(content, "aria-describedby", description.id);
                }
            }
            getInternalTriggers().forEach((trigger) => {
                if (content)
                    setAttributeIfChanged$g(trigger, "aria-controls", content.id);
                setAttributeIfChanged$g(trigger, "aria-haspopup", "dialog");
                if (trigger instanceof HTMLButtonElement &&
                    !trigger.hasAttribute("type")) {
                    trigger.type = "button";
                }
            });
            getTriggers().forEach((trigger) => {
                if (trigger.getAttribute("data-overlay-target") === element.id) {
                    setAttributeIfChanged$g(trigger, "aria-controls", element.id);
                }
                setAttributeIfChanged$g(trigger, "aria-haspopup", "dialog");
                if (trigger instanceof HTMLButtonElement &&
                    !trigger.hasAttribute("type")) {
                    trigger.type = "button";
                }
                if (!boundTriggers.has(trigger)) {
                    trigger.addEventListener("click", handleTriggerClick);
                    boundTriggers.add(trigger);
                }
            });
            ownedAll(parts.closeSelector).forEach((closeButton) => {
                if (closeButton instanceof HTMLButtonElement &&
                    !closeButton.hasAttribute("type")) {
                    closeButton.type = "button";
                }
                if (!boundCloseButtons.has(closeButton)) {
                    closeButton.addEventListener("click", handleCloseClick);
                    boundCloseButtons.add(closeButton);
                }
            });
            ownedAll(parts.overlaySelector).forEach((overlay) => {
                if (!boundOverlays.has(overlay)) {
                    overlay.addEventListener("click", handleOverlayClick);
                    boundOverlays.add(overlay);
                }
            });
            reflectState();
        };
        const handleDocumentClick = (event) => {
            if (!internalOpen ||
                !isTopmost() ||
                parts.closeOnOutsideClick !== true ||
                !(event.target instanceof Node) ||
                element.contains(event.target) ||
                getTriggers().some((trigger) => trigger.contains(event.target))) {
                return;
            }
            setOpen(false, false);
        };
        const handleDocumentKeydown = (event) => {
            if (!internalOpen || !isTopmost())
                return;
            if (event.key === "Escape") {
                event.preventDefault();
                setOpen(false);
                return;
            }
            if (event.key !== "Tab")
                return;
            const content = getContent();
            const focusableItems = getFocusableItems();
            if (!content || focusableItems.length === 0) {
                event.preventDefault();
                content?.focus({ preventScroll: true });
                return;
            }
            const currentIndex = focusableItems.indexOf(document.activeElement);
            const nextIndex = event.shiftKey
                ? currentIndex <= 0
                    ? focusableItems.length - 1
                    : currentIndex - 1
                : currentIndex < 0 || currentIndex === focusableItems.length - 1
                    ? 0
                    : currentIndex + 1;
            event.preventDefault();
            focusableItems[nextIndex].focus({ preventScroll: true });
        };
        const handleDocumentFocus = (event) => {
            const content = getContent();
            if (redirectingFocus ||
                !internalOpen ||
                !isTopmost() ||
                !content ||
                !(event.target instanceof Node) ||
                content.contains(event.target)) {
                return;
            }
            redirectingFocus = true;
            focusClosest();
            redirectingFocus = false;
        };
        const openObserver = new MutationObserver((records) => {
            if (records.some((record) => record.target === element && record.attributeName === "data-open")) {
                const nextOpen = element.getAttribute("data-open") === "true";
                if (nextOpen !== internalOpen)
                    setOpen(nextOpen);
            }
            syncDirection();
        });
        openObserver.observe(element, {
            attributes: true,
            attributeFilter: ["data-open", "dir"],
        });
        const partsObserver = new MutationObserver(syncInteractiveParts);
        partsObserver.observe(document.body, { childList: true, subtree: true });
        const directionObserver = directionOwner === element ? null : new MutationObserver(syncDirection);
        directionObserver?.observe(directionOwner, {
            attributes: true,
            attributeFilter: ["dir"],
        });
        syncDirection();
        syncInteractiveParts();
        setOpen(internalOpen);
        document.addEventListener("click", handleDocumentClick);
        document.addEventListener("keydown", handleDocumentKeydown);
        document.addEventListener("focusin", handleDocumentFocus);
        onDestroy(scope, () => {
            openObserver.disconnect();
            partsObserver.disconnect();
            directionObserver?.disconnect();
            boundTriggers.forEach((trigger) => {
                trigger.removeEventListener("click", handleTriggerClick);
            });
            boundCloseButtons.forEach((closeButton) => {
                closeButton.removeEventListener("click", handleCloseClick);
            });
            boundOverlays.forEach((overlay) => {
                overlay.removeEventListener("click", handleOverlayClick);
            });
            document.removeEventListener("click", handleDocumentClick);
            document.removeEventListener("keydown", handleDocumentKeydown);
            document.removeEventListener("focusin", handleDocumentFocus);
            removeFromStack();
            restoreBackground();
        });
    }

    function alertDialogDirective() {
        return {
            link(scope, element) {
                bindOverlay(scope, element, {
                    rootSelector: '[data-slot="alert-dialog"], [ng-alert-dialog]',
                    closeSelector: '[data-slot="alert-dialog-cancel"], [ng-alert-dialog-cancel], [data-slot="alert-dialog-action"], [ng-alert-dialog-action], [data-alert-dialog-close]',
                    contentSelector: '[data-slot="alert-dialog-content"], [ng-alert-dialog-content]',
                    contentRole: "alertdialog",
                    descriptionSelector: '[data-slot="alert-dialog-description"], [ng-alert-dialog-description]',
                    closeOnOverlayClick: false,
                    overlaySelector: '[data-slot="alert-dialog-overlay"], [ng-alert-dialog-overlay]',
                    titleSelector: '[data-slot="alert-dialog-title"], [ng-alert-dialog-title]',
                    triggerSelector: '[data-slot="alert-dialog-trigger"], [ng-alert-dialog-trigger]',
                    closeOnOutsideClick: false,
                });
            },
        };
    }

    function aspectRatioDirective() {
        return {
            link(_scope, element) {
                const authoredRatio = element.getAttribute("ratio") ??
                    element.getAttribute("data-ratio") ??
                    element.style.getPropertyValue("--ratio");
                const ratio = authoredRatio === "" ? "16 / 9" : authoredRatio;
                element.style.setProperty("--ratio", ratio);
                element.setAttribute("data-ratio", ratio);
            },
        };
    }

    function avatarDirective() {
        return {
            link(scope, element) {
                const size = element.getAttribute("size") ??
                    element.getAttribute("data-size") ??
                    "default";
                element.setAttribute("data-size", size);
                const image = query(element, '[data-slot="avatar-image"], [ng-avatar-image]', HTMLImageElement);
                const fallback = query(element, '[data-slot="avatar-fallback"], [ng-avatar-fallback]', HTMLElement);
                const setState = (state) => {
                    element.setAttribute("data-state", state);
                    if (image)
                        image.hidden = state === "fallback";
                    if (fallback)
                        fallback.hidden = state === "loaded";
                };
                if (!image) {
                    setState("fallback");
                    return;
                }
                const handleLoad = () => {
                    setState("loaded");
                };
                const handleError = () => {
                    setState("fallback");
                };
                image.addEventListener("load", handleLoad);
                image.addEventListener("error", handleError);
                setState(image.complete && image.naturalWidth > 0 ? "loaded" : "fallback");
                onDestroy(scope, () => {
                    image.removeEventListener("load", handleLoad);
                    image.removeEventListener("error", handleError);
                });
            },
        };
    }

    function badgeDirective() {
        return {
            link(_scope, element) {
                const variant = element.getAttribute("variant") ??
                    element.getAttribute("data-variant") ??
                    "default";
                element.setAttribute("data-variant", variant);
            },
        };
    }

    const pageSelector = '[data-slot="breadcrumb-page"], [ng-breadcrumb-page]';
    const listSelector$3 = '[data-slot="breadcrumb-list"], [ng-breadcrumb-list]';
    const itemSelector$7 = '[data-slot="breadcrumb-item"], [ng-breadcrumb-item]';
    const separatorSelector$5 = '[data-slot="breadcrumb-separator"], [ng-breadcrumb-separator]';
    const ellipsisSelector$1 = '[data-slot="breadcrumb-ellipsis"], [ng-breadcrumb-ellipsis]';
    const defaultSeparatorIcon = `
  <svg data-breadcrumb-generated="separator" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="m9 18 6-6-6-6"></path>
  </svg>
`;
    const defaultEllipsisIcon = `
  <svg data-breadcrumb-generated="ellipsis" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="1"></circle>
    <circle cx="19" cy="12" r="1"></circle>
    <circle cx="5" cy="12" r="1"></circle>
  </svg>
`;
    const setAttribute$5 = (element, name, value) => {
        if (element.getAttribute(name) !== value) {
            element.setAttribute(name, value);
        }
    };
    const removeAttribute$2 = (element, name) => {
        if (element.hasAttribute(name)) {
            element.removeAttribute(name);
        }
    };
    function breadcrumbDirective() {
        return {
            link(scope, element) {
                const ownedCurrentPages = new WeakSet();
                setAttribute$5(element, "aria-label", element.getAttribute("aria-label") ?? "breadcrumb");
                const sync = () => {
                    const pages = queryAll(element, pageSelector);
                    const lists = queryAll(element, listSelector$3);
                    const items = queryAll(element, itemSelector$7);
                    const separators = queryAll(element, separatorSelector$5);
                    const ellipses = queryAll(element, ellipsisSelector$1);
                    const lastPage = pages.at(-1);
                    const userCurrentPages = pages.filter((page) => page.hasAttribute("aria-current") && !ownedCurrentPages.has(page));
                    lists.forEach((list) => {
                        setAttribute$5(list, "role", list.getAttribute("role") ?? "list");
                    });
                    items.forEach((item) => {
                        setAttribute$5(item, "role", item.getAttribute("role") ?? "listitem");
                    });
                    separators.forEach((separator) => {
                        setAttribute$5(separator, "role", separator.getAttribute("role") ?? "presentation");
                        setAttribute$5(separator, "aria-hidden", "true");
                        if (!separator.textContent.trim() &&
                            separator.childElementCount === 0) {
                            separator.insertAdjacentHTML("beforeend", defaultSeparatorIcon);
                        }
                    });
                    ellipses.forEach((ellipsis) => {
                        setAttribute$5(ellipsis, "role", ellipsis.getAttribute("role") ?? "presentation");
                        setAttribute$5(ellipsis, "aria-hidden", "true");
                        if (!ellipsis.querySelector("svg")) {
                            ellipsis.insertAdjacentHTML("afterbegin", defaultEllipsisIcon);
                        }
                    });
                    pages.forEach((page) => {
                        setAttribute$5(page, "role", page.getAttribute("role") ?? "link");
                        setAttribute$5(page, "aria-disabled", page.getAttribute("aria-disabled") ?? "true");
                        if (ownedCurrentPages.has(page) &&
                            (page !== lastPage || userCurrentPages.length > 0)) {
                            removeAttribute$2(page, "aria-current");
                            ownedCurrentPages.delete(page);
                        }
                    });
                    if (userCurrentPages.length > 0)
                        return;
                    if (lastPage && !lastPage.hasAttribute("aria-current")) {
                        setAttribute$5(lastPage, "aria-current", "page");
                        ownedCurrentPages.add(lastPage);
                    }
                };
                const observer = new MutationObserver(sync);
                observer.observe(element, {
                    attributes: true,
                    attributeFilter: ["aria-current", "data-slot"],
                    childList: true,
                    subtree: true,
                });
                sync();
                onDestroy(scope, () => {
                    observer.disconnect();
                });
            },
        };
    }

    const normalizeVariant = (element) => {
        return (element.getAttribute("variant") ??
            element.getAttribute("data-variant") ??
            "default");
    };
    const normalizeSize = (element) => {
        return (element.getAttribute("size") ??
            element.getAttribute("data-size") ??
            "default");
    };
    function buttonDirective() {
        return {
            link(_scope, element) {
                const target = element;
                const variant = normalizeVariant(target);
                const size = normalizeSize(target);
                if (target.tagName === "BUTTON" && !target.hasAttribute("type")) {
                    target.setAttribute("type", "button");
                }
                element.setAttribute("data-variant", variant);
                element.setAttribute("data-size", size);
                const disabled = isDisabled(element);
                element.setAttribute("data-disabled", String(disabled));
                if (disabled) {
                    element.setAttribute("aria-disabled", "true");
                    if (target.tagName !== "BUTTON" && target.tagName !== "INPUT") {
                        element.setAttribute("tabindex", "-1");
                    }
                }
                else if (!element.hasAttribute("aria-disabled")) {
                    element.removeAttribute("aria-disabled");
                }
            },
        };
    }

    const separatorSelector$4 = '[data-slot="button-group-separator"], [ng-button-group-separator]';
    const normalizeOrientation = (value, fallback) => {
        if (value === "vertical" || value === "column")
            return "vertical";
        if (value === "horizontal" || value === "row")
            return "horizontal";
        return fallback;
    };
    function buttonGroupDirective() {
        return {
            link(_scope, element) {
                const orientation = normalizeOrientation(element.getAttribute("orientation") ??
                    element.getAttribute("data-orientation"), "horizontal");
                element.setAttribute("role", element.getAttribute("role") ?? "group");
                element.setAttribute("data-orientation", orientation);
                element
                    .querySelectorAll(separatorSelector$4)
                    .forEach((separator) => {
                    const separatorOrientation = normalizeOrientation(separator.getAttribute("orientation") ??
                        separator.getAttribute("data-orientation"), "vertical");
                    separator.setAttribute("role", separator.getAttribute("role") ?? "separator");
                    separator.setAttribute("data-orientation", separatorOrientation);
                    separator.setAttribute("aria-orientation", separatorOrientation);
                });
            },
        };
    }

    /**
     * @module constants
     * @summary Useful constants
     * @description
     * Collection of useful date constants.
     *
     * The constants could be imported from `date-fns/constants`:
     *
     * ```ts
     * import { maxTime, minTime } from "./constants/date-fns/constants";
     *
     * function isAllowedTime(time) {
     *   return time <= maxTime && time >= minTime;
     * }
     * ```
     */


    /**
     * @constant
     * @name millisecondsInWeek
     * @summary Milliseconds in 1 week.
     */
    const millisecondsInWeek = 604800000;

    /**
     * @constant
     * @name millisecondsInDay
     * @summary Milliseconds in 1 day.
     */
    const millisecondsInDay = 86400000;

    /**
     * @constant
     * @name constructFromSymbol
     * @summary Symbol enabling Date extensions to inherit properties from the reference date.
     *
     * The symbol is used to enable the `constructFrom` function to construct a date
     * using a reference date and a value. It allows to transfer extra properties
     * from the reference date to the new date. It's useful for extensions like
     * [`TZDate`](https://github.com/date-fns/tz) that accept a time zone as
     * a constructor argument.
     */
    const constructFromSymbol = Symbol.for("constructDateFrom");

    /**
     * @name constructFrom
     * @category Generic Helpers
     * @summary Constructs a date using the reference date and the value
     *
     * @description
     * The function constructs a new date using the constructor from the reference
     * date and the given value. It helps to build generic functions that accept
     * date extensions.
     *
     * It defaults to `Date` if the passed reference date is a number or a string.
     *
     * Starting from v3.7.0, it allows to construct a date using `[Symbol.for("constructDateFrom")]`
     * enabling to transfer extra properties from the reference date to the new date.
     * It's useful for extensions like [`TZDate`](https://github.com/date-fns/tz)
     * that accept a time zone as a constructor argument.
     *
     * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
     *
     * @param date - The reference date to take constructor from
     * @param value - The value to create the date
     *
     * @returns Date initialized using the given date and value
     *
     * @example
     * import { constructFrom } from "./constructFrom/date-fns";
     *
     * // A function that clones a date preserving the original type
     * function cloneDate<DateType extends Date>(date: DateType): DateType {
     *   return constructFrom(
     *     date, // Use constructor from the given date
     *     date.getTime() // Use the date value to create a new date
     *   );
     * }
     */
    function constructFrom(date, value) {
      if (typeof date === "function") return date(value);

      if (date && typeof date === "object" && constructFromSymbol in date)
        return date[constructFromSymbol](value);

      if (date instanceof Date) return new date.constructor(value);

      return new Date(value);
    }

    /**
     * @name toDate
     * @category Common Helpers
     * @summary Convert the given argument to an instance of Date.
     *
     * @description
     * Convert the given argument to an instance of Date.
     *
     * If the argument is an instance of Date, the function returns its clone.
     *
     * If the argument is a number, it is treated as a timestamp.
     *
     * If the argument is none of the above, the function returns Invalid Date.
     *
     * Starting from v3.7.0, it clones a date using `[Symbol.for("constructDateFrom")]`
     * enabling to transfer extra properties from the reference date to the new date.
     * It's useful for extensions like [`TZDate`](https://github.com/date-fns/tz)
     * that accept a time zone as a constructor argument.
     *
     * **Note**: *all* Date arguments passed to any *date-fns* function is processed by `toDate`.
     *
     * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
     * @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
     *
     * @param argument - The value to convert
     *
     * @returns The parsed date in the local time zone
     *
     * @example
     * // Clone the date:
     * const result = toDate(new Date(2014, 1, 11, 11, 30, 30))
     * //=> Tue Feb 11 2014 11:30:30
     *
     * @example
     * // Convert the timestamp to date:
     * const result = toDate(1392098430000)
     * //=> Tue Feb 11 2014 11:30:30
     */
    function toDate(argument, context) {
      // [TODO] Get rid of `toDate` or `constructFrom`?
      return constructFrom(context || argument, argument);
    }

    /**
     * The {@link addDays} function options.
     */

    /**
     * @name addDays
     * @category Day Helpers
     * @summary Add the specified number of days to the given date.
     *
     * @description
     * Add the specified number of days to the given date.
     *
     * **You don't need date-fns\***:
     *
     * Temporal has a built-in `add` method on all its classes:
     *
     * - [`Temporal.Instant.prototype.add()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/Instant/add)
     * - [`Temporal.PlainDate.prototype.add()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/PlainDate/add)
     * - [`Temporal.PlainDateTime.prototype.add()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/PlainDateTime/add)
     * - [`Temporal.PlainTime.prototype.add()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/PlainTime/add)
     * - [`Temporal.PlainYearMonth.prototype.add()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/PlainYearMonth/add)
     * - [`Temporal.ZonedDateTime.prototype.add()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/ZonedDateTime/add)
     *
     * \* **Not really**, see: https://date-fns.org/you-dont-need-date-fns
     *
     * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
     * @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
     *
     * @param date - The date to be changed
     * @param amount - The amount of days to be added.
     * @param options - An object with options
     *
     * @returns The new date with the days added
     *
     * @example
     * // Add 10 days to 1 September 2014:
     * const result = addDays(new Date(2014, 8, 1), 10)
     * //=> Thu Sep 11 2014 00:00:00
     *
     * @example
     * // Using Temporal:
     * // Add 10 days to 1 September 2014:
     * Temporal.PlainDate.from("2014-09-01").add({ days: 10 }).toString();
     * //=> "2014-09-11"
     */
    function addDays(date, amount, options) {
      const _date = toDate(date, options?.in);
      if (isNaN(amount)) return constructFrom(date, NaN);

      // If 0 days, no-op to avoid changing times in the hour before end of DST
      if (!amount) return _date;

      _date.setDate(_date.getDate() + amount);
      return _date;
    }

    /**
     * The {@link addMonths} function options.
     */

    /**
     * @name addMonths
     * @category Month Helpers
     * @summary Add the specified number of months to the given date.
     *
     * @description
     * Add the specified number of months to the given date.
     *
     * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
     * @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
     *
     * @param date - The date to be changed
     * @param amount - The amount of months to be added.
     * @param options - The options object
     *
     * @returns The new date with the months added
     *
     * @example
     * // Add 5 months to 1 September 2014:
     * const result = addMonths(new Date(2014, 8, 1), 5)
     * //=> Sun Feb 01 2015 00:00:00
     *
     * // Add one month to 30 January 2023:
     * const result = addMonths(new Date(2023, 0, 30), 1)
     * //=> Tue Feb 28 2023 00:00:00
     */
    function addMonths(date, amount, options) {
      const _date = toDate(date, options?.in);
      if (isNaN(amount)) return constructFrom(date, NaN);
      if (!amount) {
        // If 0 months, no-op to avoid changing times in the hour before end of DST
        return _date;
      }
      const dayOfMonth = _date.getDate();

      // The JS Date object supports date math by accepting out-of-bounds values for
      // month, day, etc. For example, new Date(2020, 0, 0) returns 31 Dec 2019 and
      // new Date(2020, 13, 1) returns 1 Feb 2021.  This is *almost* the behavior we
      // want except that dates will wrap around the end of a month, meaning that
      // new Date(2020, 13, 31) will return 3 Mar 2021 not 28 Feb 2021 as desired. So
      // we'll default to the end of the desired month by adding 1 to the desired
      // month and using a date of 0 to back up one day to the end of the desired
      // month.
      const endOfDesiredMonth = constructFrom(date, _date.getTime());
      endOfDesiredMonth.setMonth(_date.getMonth() + amount + 1, 0);
      const daysInMonth = endOfDesiredMonth.getDate();
      if (dayOfMonth >= daysInMonth) {
        // If we're already at the end of the month, then this is the correct date
        // and we're done.
        return endOfDesiredMonth;
      } else {
        // Otherwise, we now know that setting the original day-of-month value won't
        // cause an overflow, so set the desired day-of-month. Note that we can't
        // just set the date of `endOfDesiredMonth` because that object may have had
        // its time changed in the unusual case where where a DST transition was on
        // the last day of the month and its local time was in the hour skipped or
        // repeated next to a DST transition.  So we use `date` instead which is
        // guaranteed to still have the original time.
        _date.setFullYear(
          endOfDesiredMonth.getFullYear(),
          endOfDesiredMonth.getMonth(),
          dayOfMonth,
        );
        return _date;
      }
    }

    /**
     * Google Chrome as of 67.0.3396.87 introduced timezones with offset that includes seconds.
     * They usually appear for dates that denote time before the timezones were introduced
     * (e.g. for 'Europe/Prague' timezone the offset is GMT+00:57:44 before 1 October 1891
     * and GMT+01:00:00 after that date)
     *
     * Date#getTimezoneOffset returns the offset in minutes and would return 57 for the example above,
     * which would lead to incorrect calculations.
     *
     * This function returns the timezone offset in milliseconds that takes seconds in account.
     */
    function getTimezoneOffsetInMilliseconds(date) {
      const _date = toDate(date);
      const utcDate = new Date(
        Date.UTC(
          _date.getFullYear(),
          _date.getMonth(),
          _date.getDate(),
          _date.getHours(),
          _date.getMinutes(),
          _date.getSeconds(),
          _date.getMilliseconds(),
        ),
      );
      utcDate.setUTCFullYear(_date.getFullYear());
      return +date - +utcDate;
    }

    function normalizeDates(context, ...dates) {
      const normalize = constructFrom.bind(
        null,
        dates.find((date) => typeof date === "object"),
      );
      return dates.map(normalize);
    }

    /**
     * The {@link startOfDay} function options.
     */

    /**
     * @name startOfDay
     * @category Day Helpers
     * @summary Return the start of a day for the given date.
     *
     * @description
     * Return the start of a day for the given date.
     * The result will be in the local timezone.
     *
     * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
     * @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
     *
     * @param date - The original date
     * @param options - The options
     *
     * @returns The start of a day
     *
     * @example
     * // The start of a day for 2 September 2014 11:55:00:
     * const result = startOfDay(new Date(2014, 8, 2, 11, 55, 0))
     * //=> Tue Sep 02 2014 00:00:00
     */
    function startOfDay(date, options) {
      const _date = toDate(date, options?.in);
      _date.setHours(0, 0, 0, 0);
      return _date;
    }

    /**
     * The {@link differenceInCalendarDays} function options.
     */

    /**
     * @name differenceInCalendarDays
     * @category Day Helpers
     * @summary Get the number of calendar days between the given dates.
     *
     * @description
     * Get the number of calendar days between the given dates. This means that the times are removed
     * from the dates and then the difference in days is calculated.
     *
     * @param laterDate - The later date
     * @param earlierDate - The earlier date
     * @param options - The options object
     *
     * @returns The number of calendar days
     *
     * @example
     * // How many calendar days are between
     * // 2 July 2011 23:00:00 and 2 July 2012 00:00:00?
     * const result = differenceInCalendarDays(
     *   new Date(2012, 6, 2, 0, 0),
     *   new Date(2011, 6, 2, 23, 0)
     * )
     * //=> 366
     * // How many calendar days are between
     * // 2 July 2011 23:59:00 and 3 July 2011 00:01:00?
     * const result = differenceInCalendarDays(
     *   new Date(2011, 6, 3, 0, 1),
     *   new Date(2011, 6, 2, 23, 59)
     * )
     * //=> 1
     */
    function differenceInCalendarDays(laterDate, earlierDate, options) {
      const [laterDate_, earlierDate_] = normalizeDates(
        options?.in,
        laterDate,
        earlierDate,
      );

      const laterStartOfDay = startOfDay(laterDate_);
      const earlierStartOfDay = startOfDay(earlierDate_);

      const laterTimestamp =
        +laterStartOfDay - getTimezoneOffsetInMilliseconds(laterStartOfDay);
      const earlierTimestamp =
        +earlierStartOfDay - getTimezoneOffsetInMilliseconds(earlierStartOfDay);

      // Round the number of days to the nearest integer because the number of
      // milliseconds in a day is not constant (e.g. it's different in the week of
      // the daylight saving time clock shift).
      return Math.round((laterTimestamp - earlierTimestamp) / millisecondsInDay);
    }

    let defaultOptions$2 = {};

    function getDefaultOptions() {
      return defaultOptions$2;
    }

    /**
     * The {@link startOfWeek} function options.
     */

    /**
     * @name startOfWeek
     * @category Week Helpers
     * @summary Return the start of a week for the given date.
     *
     * @description
     * Return the start of a week for the given date.
     * The result will be in the local timezone.
     *
     * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
     * @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
     *
     * @param date - The original date
     * @param options - An object with options
     *
     * @returns The start of a week
     *
     * @example
     * // The start of a week for 2 September 2014 11:55:00:
     * const result = startOfWeek(new Date(2014, 8, 2, 11, 55, 0))
     * //=> Sun Aug 31 2014 00:00:00
     *
     * @example
     * // If the week starts on Monday, the start of the week for 2 September 2014 11:55:00:
     * const result = startOfWeek(new Date(2014, 8, 2, 11, 55, 0), { weekStartsOn: 1 })
     * //=> Mon Sep 01 2014 00:00:00
     */
    function startOfWeek(date, options) {
      const defaultOptions = getDefaultOptions();
      const weekStartsOn =
        options?.weekStartsOn ??
        options?.locale?.options?.weekStartsOn ??
        defaultOptions.weekStartsOn ??
        defaultOptions.locale?.options?.weekStartsOn ??
        0;

      const _date = toDate(date, options?.in);
      const day = _date.getDay();
      const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;

      _date.setDate(_date.getDate() - diff);
      _date.setHours(0, 0, 0, 0);
      return _date;
    }

    /**
     * The {@link getWeekYear} function options.
     */

    /**
     * @name getWeekYear
     * @category Week-Numbering Year Helpers
     * @summary Get the local week-numbering year of the given date.
     *
     * @description
     * Get the local week-numbering year of the given date.
     * The exact calculation depends on the values of
     * `options.weekStartsOn` (which is the index of the first day of the week)
     * and `options.firstWeekContainsDate` (which is the day of January, which is always in
     * the first week of the week-numbering year)
     *
     * Week numbering: https://en.wikipedia.org/wiki/Week#The_ISO_week_date_system
     *
     * @param date - The given date
     * @param options - An object with options.
     *
     * @returns The local week-numbering year
     *
     * @example
     * // Which week numbering year is 26 December 2004 with the default settings?
     * const result = getWeekYear(new Date(2004, 11, 26))
     * //=> 2005
     *
     * @example
     * // Which week numbering year is 26 December 2004 if week starts on Saturday?
     * const result = getWeekYear(new Date(2004, 11, 26), { weekStartsOn: 6 })
     * //=> 2004
     *
     * @example
     * // Which week numbering year is 26 December 2004 if the first week contains 4 January?
     * const result = getWeekYear(new Date(2004, 11, 26), { firstWeekContainsDate: 4 })
     * //=> 2004
     */
    function getWeekYear(date, options) {
      const _date = toDate(date, options?.in);
      const year = _date.getFullYear();

      const defaultOptions = getDefaultOptions();
      const firstWeekContainsDate =
        options?.firstWeekContainsDate ??
        options?.locale?.options?.firstWeekContainsDate ??
        defaultOptions.firstWeekContainsDate ??
        defaultOptions.locale?.options?.firstWeekContainsDate ??
        1;

      const firstWeekOfNextYear = constructFrom(options?.in || date, 0);
      firstWeekOfNextYear.setFullYear(year + 1, 0, firstWeekContainsDate);
      firstWeekOfNextYear.setHours(0, 0, 0, 0);
      const startOfNextYear = startOfWeek(firstWeekOfNextYear, options);

      const firstWeekOfThisYear = constructFrom(options?.in || date, 0);
      firstWeekOfThisYear.setFullYear(year, 0, firstWeekContainsDate);
      firstWeekOfThisYear.setHours(0, 0, 0, 0);
      const startOfThisYear = startOfWeek(firstWeekOfThisYear, options);

      if (+_date >= +startOfNextYear) {
        return year + 1;
      } else if (+_date >= +startOfThisYear) {
        return year;
      } else {
        return year - 1;
      }
    }

    /**
     * The {@link startOfWeekYear} function options.
     */

    /**
     * @name startOfWeekYear
     * @category Week-Numbering Year Helpers
     * @summary Return the start of a local week-numbering year for the given date.
     *
     * @description
     * Return the start of a local week-numbering year.
     * The exact calculation depends on the values of
     * `options.weekStartsOn` (which is the index of the first day of the week)
     * and `options.firstWeekContainsDate` (which is the day of January, which is always in
     * the first week of the week-numbering year)
     *
     * Week numbering: https://en.wikipedia.org/wiki/Week#The_ISO_week_date_system
     *
     * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
     * @typeParam ResultDate - The result `Date` type.
     *
     * @param date - The original date
     * @param options - An object with options
     *
     * @returns The start of a week-numbering year
     *
     * @example
     * // The start of an a week-numbering year for 2 July 2005 with default settings:
     * const result = startOfWeekYear(new Date(2005, 6, 2))
     * //=> Sun Dec 26 2004 00:00:00
     *
     * @example
     * // The start of a week-numbering year for 2 July 2005
     * // if Monday is the first day of week
     * // and 4 January is always in the first week of the year:
     * const result = startOfWeekYear(new Date(2005, 6, 2), {
     *   weekStartsOn: 1,
     *   firstWeekContainsDate: 4
     * })
     * //=> Mon Jan 03 2005 00:00:00
     */
    function startOfWeekYear(date, options) {
      const defaultOptions = getDefaultOptions();
      const firstWeekContainsDate =
        options?.firstWeekContainsDate ??
        options?.locale?.options?.firstWeekContainsDate ??
        defaultOptions.firstWeekContainsDate ??
        defaultOptions.locale?.options?.firstWeekContainsDate ??
        1;

      const year = getWeekYear(date, options);
      const firstWeek = constructFrom(options?.in || date, 0);
      firstWeek.setFullYear(year, 0, firstWeekContainsDate);
      firstWeek.setHours(0, 0, 0, 0);
      const _date = startOfWeek(firstWeek, options);
      return _date;
    }

    /**
     * The {@link getWeek} function options.
     */

    /**
     * @name getWeek
     * @category Week Helpers
     * @summary Get the local week index of the given date.
     *
     * @description
     * Get the local week index of the given date.
     * The exact calculation depends on the values of
     * `options.weekStartsOn` (which is the index of the first day of the week)
     * and `options.firstWeekContainsDate` (which is the day of January, which is always in
     * the first week of the week-numbering year)
     *
     * Week numbering: https://en.wikipedia.org/wiki/Week#The_ISO_week_date_system
     *
     * @param date - The given date
     * @param options - An object with options
     *
     * @returns The week
     *
     * @example
     * // Which week of the local week numbering year is 2 January 2005 with default options?
     * const result = getWeek(new Date(2005, 0, 2))
     * //=> 2
     *
     * @example
     * // Which week of the local week numbering year is 2 January 2005,
     * // if Monday is the first day of the week,
     * // and the first week of the year always contains 4 January?
     * const result = getWeek(new Date(2005, 0, 2), {
     *   weekStartsOn: 1,
     *   firstWeekContainsDate: 4
     * })
     * //=> 53
     */
    function getWeek(date, options) {
      const _date = toDate(date, options?.in);
      const diff = +startOfWeek(_date, options) - +startOfWeekYear(_date, options);

      // Round the number of weeks to the nearest integer because the number of
      // milliseconds in a week is not constant (e.g. it's different in the week of
      // the daylight saving time clock shift).
      return Math.round(diff / millisecondsInWeek) + 1;
    }

    /**
     * The {@link isSameMonth} function options.
     */

    /**
     * @name isSameMonth
     * @category Month Helpers
     * @summary Are the given dates in the same month (and year)?
     *
     * @description
     * Are the given dates in the same month (and year)?
     *
     * @param laterDate - The first date to check
     * @param earlierDate - The second date to check
     * @param options - An object with options
     *
     * @returns The dates are in the same month (and year)
     *
     * @example
     * // Are 2 September 2014 and 25 September 2014 in the same month?
     * const result = isSameMonth(new Date(2014, 8, 2), new Date(2014, 8, 25))
     * //=> true
     *
     * @example
     * // Are 2 September 2014 and 25 September 2015 in the same month?
     * const result = isSameMonth(new Date(2014, 8, 2), new Date(2015, 8, 25))
     * //=> false
     */
    function isSameMonth(laterDate, earlierDate, options) {
      const [laterDate_, earlierDate_] = normalizeDates(
        options?.in,
        laterDate,
        earlierDate,
      );
      return (
        laterDate_.getFullYear() === earlierDate_.getFullYear() &&
        laterDate_.getMonth() === earlierDate_.getMonth()
      );
    }

    /**
     * The {@link startOfMonth} function options.
     */

    /**
     * @name startOfMonth
     * @category Month Helpers
     * @summary Return the start of a month for the given date.
     *
     * @description
     * Return the start of a month for the given date. The result will be in the local timezone.
     *
     * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments.
     * Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
     * @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed,
     * or inferred from the arguments.
     *
     * @param date - The original date
     * @param options - An object with options
     *
     * @returns The start of a month
     *
     * @example
     * // The start of a month for 2 September 2014 11:55:00:
     * const result = startOfMonth(new Date(2014, 8, 2, 11, 55, 0))
     * //=> Mon Sep 01 2014 00:00:00
     */
    function startOfMonth(date, options) {
      const _date = toDate(date, options?.in);
      _date.setDate(1);
      _date.setHours(0, 0, 0, 0);
      return _date;
    }

    let calendarIdCounter = 0;
    const setAttributeIfChanged$f = (element, name, value) => {
        if (element.getAttribute(name) !== value) {
            element.setAttribute(name, value);
        }
    };
    const padDatePart = (value) => String(value).padStart(2, "0");
    const formatDateValue = (date) => `${String(date.getFullYear())}-${padDatePart(date.getMonth() + 1)}-${padDatePart(date.getDate())}`;
    const parseDateValue = (value) => {
        const match = value?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (!match)
            return null;
        const [, yearPart, monthPart, dayPart] = match;
        const year = Number(yearPart);
        const month = Number(monthPart) - 1;
        const day = Number(dayPart);
        const date = new Date(year, month, day);
        return date.getFullYear() === year &&
            date.getMonth() === month &&
            date.getDate() === day
            ? date
            : null;
    };
    const parseDateList = (value) => new Set((value ?? "")
        .split(",")
        .map((entry) => entry.trim())
        .filter((entry) => parseDateValue(entry)));
    function calendarDirective() {
        return {
            link(scope, element) {
                const directionOwner = element.closest("[dir]") ?? element;
                const getDirection = () => element.closest("[dir]")?.getAttribute("dir") === "rtl"
                    ? "rtl"
                    : "ltr";
                const syncDirection = () => {
                    const direction = getDirection();
                    if (element.getAttribute("data-direction") !== direction) {
                        element.setAttribute("data-direction", direction);
                    }
                };
                let days = queryAll(element, '[data-slot="calendar-day"], [ng-calendar-day]');
                const columns = Number(element.getAttribute("data-columns") ?? 7);
                const cleanupDays = new WeakMap();
                const cleanupControls = new WeakMap();
                const generatedLabels = new WeakMap();
                const generatedCurrent = new WeakSet();
                let renderedMonth = "";
                element.setAttribute("role", element.getAttribute("role") ?? "grid");
                syncDirection();
                const getLocale = () => (element.closest("[lang]")?.getAttribute("lang") ??
                    document.documentElement.lang) ||
                    undefined;
                const createFormatter = (options) => {
                    try {
                        return new Intl.DateTimeFormat(getLocale(), options);
                    }
                    catch {
                        return new Intl.DateTimeFormat(undefined, options);
                    }
                };
                const createNumberFormatter = () => {
                    try {
                        return new Intl.NumberFormat(getLocale(), { useGrouping: false });
                    }
                    catch {
                        return new Intl.NumberFormat(undefined, { useGrouping: false });
                    }
                };
                const renderGeneratedMonth = () => {
                    if (!element.hasAttribute("data-calendar-generated"))
                        return;
                    const grid = element.querySelector('[data-slot="calendar-grid"], [ng-calendar-grid]');
                    if (!grid)
                        return;
                    const selectedDate = parseDateValue(element.getAttribute("data-value"));
                    const requestedMonth = parseDateValue(`${element.getAttribute("data-month") ?? ""}-01`);
                    const month = startOfMonth(requestedMonth ?? selectedDate ?? new Date());
                    const monthValue = formatDateValue(month).slice(0, 7);
                    const numberOfMonths = Math.max(1, Math.min(3, Number(element.getAttribute("data-number-of-months") ?? 1)));
                    const showWeekNumbers = element.getAttribute("data-show-week-numbers") === "true";
                    const renderKey = [
                        monthValue,
                        numberOfMonths,
                        showWeekNumbers,
                        element.getAttribute("data-caption-layout") ?? "label",
                        element.getAttribute("data-disabled-dates") ?? "",
                        element.getAttribute("data-booked-dates") ?? "",
                        element.getAttribute("data-disabled-before") ?? "",
                        element.getAttribute("data-disabled-after") ?? "",
                        element.getAttribute("data-show-outside-days") ?? "",
                        element.getAttribute("data-week-start") ?? "",
                    ].join("|");
                    if (renderKey === renderedMonth && grid.childElementCount > 0)
                        return;
                    renderedMonth = renderKey;
                    setAttributeIfChanged$f(element, "data-month", monthValue);
                    const title = element.querySelector('[data-slot="calendar-title"], [ng-calendar-title]');
                    if (title) {
                        const captionLayout = element.getAttribute("data-caption-layout") ?? "label";
                        if (captionLayout === "dropdown") {
                            const monthSelect = document.createElement("select");
                            const yearSelect = document.createElement("select");
                            monthSelect.setAttribute("data-slot", "calendar-month-select");
                            yearSelect.setAttribute("data-slot", "calendar-year-select");
                            monthSelect.setAttribute("aria-label", "Month");
                            yearSelect.setAttribute("aria-label", "Year");
                            const monthFormatter = createFormatter({ month: "short" });
                            for (let monthIndex = 0; monthIndex < 12; monthIndex += 1) {
                                const option = document.createElement("option");
                                option.setAttribute("value", String(monthIndex));
                                option.textContent = monthFormatter.format(new Date(month.getFullYear(), monthIndex, 1));
                                if (monthIndex === month.getMonth()) {
                                    option.setAttribute("selected", "");
                                }
                                monthSelect.append(option);
                            }
                            const startYear = Number(element.getAttribute("data-start-year") ??
                                month.getFullYear() - 10);
                            const endYear = Number(element.getAttribute("data-end-year") ?? month.getFullYear() + 10);
                            for (let year = startYear; year <= endYear; year += 1) {
                                const option = document.createElement("option");
                                option.setAttribute("value", String(year));
                                option.textContent = String(year);
                                if (year === month.getFullYear()) {
                                    option.setAttribute("selected", "");
                                }
                                yearSelect.append(option);
                            }
                            const changeCaption = () => {
                                showMonth(new Date(Number(yearSelect.value), Number(monthSelect.value), 1));
                            };
                            monthSelect.addEventListener("change", changeCaption);
                            yearSelect.addEventListener("change", changeCaption);
                            title.replaceChildren(monthSelect, yearSelect);
                        }
                        else {
                            const lastMonth = addMonths(month, numberOfMonths - 1);
                            const formatter = createFormatter({
                                month: "long",
                                year: "numeric",
                            });
                            if (numberOfMonths === 1) {
                                title.removeAttribute("aria-label");
                                title.textContent = formatter.format(month);
                            }
                            else {
                                title.textContent = "";
                                title.setAttribute("aria-label", `${formatter.format(month)} - ${formatter.format(lastMonth)}`);
                            }
                        }
                        title.setAttribute("aria-live", "polite");
                    }
                    const configuredWeekStart = Number(element.getAttribute("data-week-start") ?? "0");
                    const weekStartsOn = (Number.isInteger(configuredWeekStart) &&
                        configuredWeekStart >= 0 &&
                        configuredWeekStart <= 6
                        ? configuredWeekStart
                        : 0);
                    const weekdayFormatter = createFormatter({ weekday: "short" });
                    const narrowWeekdayFormatter = createFormatter({ weekday: "narrow" });
                    const dateFormatter = createFormatter({ dateStyle: "long" });
                    const numberFormatter = createNumberFormatter();
                    const language = getLocale()?.split("-")[0]?.toLowerCase();
                    const useNarrowWeekdays = ["ar", "fa", "ur"].includes(language ?? "");
                    const todayValue = formatDateValue(new Date());
                    const selectedValue = element.getAttribute("data-value");
                    const selectedValues = parseDateList(element.getAttribute("data-values"));
                    const rangeStart = element.getAttribute("data-range-start-value") ?? "";
                    const rangeEnd = element.getAttribute("data-range-end-value") ?? "";
                    const disabledDates = parseDateList(element.getAttribute("data-disabled-dates"));
                    const bookedDates = parseDateList(element.getAttribute("data-booked-dates"));
                    const disabledBefore = element.getAttribute("data-disabled-before") ?? "";
                    const disabledAfter = element.getAttribute("data-disabled-after") ?? "";
                    const showOutsideDays = element.getAttribute("data-show-outside-days") !== "false";
                    const buildMonthGrid = (visibleMonth) => {
                        const monthGrid = document.createElement("div");
                        monthGrid.setAttribute("data-slot", "calendar-month-grid");
                        monthGrid.setAttribute("data-show-week-numbers", String(showWeekNumbers));
                        const firstVisibleDate = startOfWeek(visibleMonth, { weekStartsOn });
                        if (showWeekNumbers) {
                            const header = document.createElement("span");
                            header.setAttribute("data-slot", "calendar-week-number-header");
                            header.setAttribute("aria-label", "Week number");
                            header.textContent = "Wk";
                            monthGrid.append(header);
                        }
                        for (let index = 0; index < 7; index += 1) {
                            const date = addDays(firstVisibleDate, index);
                            const weekday = document.createElement("span");
                            const weekdayLabel = weekdayFormatter.format(date);
                            weekday.setAttribute("data-slot", "calendar-weekday");
                            weekday.setAttribute("aria-label", weekdayLabel);
                            weekday.textContent = useNarrowWeekdays
                                ? narrowWeekdayFormatter.format(date)
                                : weekdayLabel.slice(0, 2);
                            monthGrid.append(weekday);
                        }
                        for (let index = 0; index < 42; index += 1) {
                            const date = addDays(firstVisibleDate, index);
                            const value = formatDateValue(date);
                            if (showWeekNumbers && index % 7 === 0) {
                                const weekNumber = document.createElement("span");
                                weekNumber.setAttribute("data-slot", "calendar-week-number");
                                weekNumber.textContent = numberFormatter.format(getWeek(date, { weekStartsOn }));
                                monthGrid.append(weekNumber);
                            }
                            const outside = !isSameMonth(date, visibleMonth);
                            const day = document.createElement("button");
                            day.type = "button";
                            day.setAttribute("data-slot", "calendar-day");
                            day.setAttribute("data-value", value);
                            day.setAttribute("data-label", dateFormatter.format(date));
                            day.setAttribute("data-outside", String(outside));
                            day.textContent = numberFormatter.format(date.getDate());
                            if (value === selectedValue ||
                                selectedValues.has(value) ||
                                value === rangeStart ||
                                value === rangeEnd) {
                                day.setAttribute("aria-selected", "true");
                            }
                            if (value === rangeStart)
                                day.setAttribute("data-range-start", "true");
                            if (value === rangeEnd)
                                day.setAttribute("data-range-end", "true");
                            if (rangeStart &&
                                rangeEnd &&
                                value > rangeStart &&
                                value < rangeEnd) {
                                day.setAttribute("data-range-middle", "true");
                                day.setAttribute("aria-selected", "true");
                            }
                            if (value === todayValue)
                                day.setAttribute("data-today", "true");
                            if (bookedDates.has(value))
                                day.setAttribute("data-booked", "true");
                            const constrained = disabledDates.has(value) ||
                                bookedDates.has(value) ||
                                (disabledBefore && value < disabledBefore) ||
                                (disabledAfter && value > disabledAfter);
                            if (constrained)
                                day.disabled = true;
                            if (outside && !showOutsideDays) {
                                day.hidden = true;
                                day.disabled = true;
                            }
                            monthGrid.append(day);
                        }
                        return monthGrid;
                    };
                    const fragment = document.createDocumentFragment();
                    for (let offset = 0; offset < numberOfMonths; offset += 1) {
                        const visibleMonth = addMonths(month, offset);
                        if (numberOfMonths === 1) {
                            fragment.append(...buildMonthGrid(visibleMonth).childNodes);
                            continue;
                        }
                        const monthSection = document.createElement("section");
                        monthSection.setAttribute("data-slot", "calendar-month");
                        const monthTitle = document.createElement("h3");
                        monthTitle.setAttribute("data-slot", "calendar-month-title");
                        monthTitle.textContent = createFormatter({
                            month: "long",
                            year: "numeric",
                        }).format(visibleMonth);
                        monthSection.append(monthTitle, buildMonthGrid(visibleMonth));
                        fragment.append(monthSection);
                    }
                    grid.setAttribute("data-months", String(numberOfMonths));
                    grid.setAttribute("data-show-week-numbers", String(showWeekNumbers));
                    grid.replaceChildren(fragment);
                };
                const syncSelectionState = (selectionMode, values, rangeStart, rangeEnd, activeDay) => {
                    const singleValue = activeDay?.getAttribute("data-value") ??
                        element.getAttribute("data-value") ??
                        "";
                    const focusedDay = activeDay ??
                        days.find((day) => day === document.activeElement) ??
                        days.find((day) => day.getAttribute("tabindex") === "0");
                    days.forEach((day) => {
                        const value = day.getAttribute("data-value") ?? "";
                        const selected = selectionMode === "multiple"
                            ? values.includes(value)
                            : selectionMode === "range"
                                ? value === rangeStart ||
                                    value === rangeEnd ||
                                    Boolean(rangeStart &&
                                        rangeEnd &&
                                        value > rangeStart &&
                                        value < rangeEnd)
                                : value === singleValue;
                        setAttributeIfChanged$f(day, "aria-selected", String(selected));
                        setAttributeIfChanged$f(day, "data-selected", String(selected));
                        setAttributeIfChanged$f(day, "data-state", selected ? "selected" : "idle");
                        if (selectionMode === "range") {
                            setAttributeIfChanged$f(day, "data-range-start", String(value === rangeStart));
                            setAttributeIfChanged$f(day, "data-range-end", String(value === rangeEnd));
                            setAttributeIfChanged$f(day, "data-range-middle", String(Boolean(rangeStart &&
                                rangeEnd &&
                                value > rangeStart &&
                                value < rangeEnd)));
                            setAttributeIfChanged$f(day, "data-range", value === rangeStart
                                ? "start"
                                : value === rangeEnd
                                    ? "end"
                                    : rangeStart &&
                                        rangeEnd &&
                                        value > rangeStart &&
                                        value < rangeEnd
                                        ? "middle"
                                        : "none");
                        }
                        setAttributeIfChanged$f(day, "tabindex", day === focusedDay ? "0" : "-1");
                    });
                };
                const selectDay = (selectedDay, emit = true) => {
                    const selectionMode = element.getAttribute("data-selection-mode") ?? "single";
                    const selectedValue = (selectedDay.getAttribute("data-value") ??
                        selectedDay.textContent.trim()) ||
                        "";
                    let values = [];
                    let rangeStart = element.getAttribute("data-range-start-value") ?? "";
                    let rangeEnd = element.getAttribute("data-range-end-value") ?? "";
                    if (selectionMode === "multiple") {
                        const selectedValues = parseDateList(element.getAttribute("data-values"));
                        if (selectedValues.has(selectedValue)) {
                            selectedValues.delete(selectedValue);
                        }
                        else {
                            selectedValues.add(selectedValue);
                        }
                        values = [...selectedValues].sort();
                        setAttributeIfChanged$f(element, "data-values", values.join(","));
                    }
                    else if (selectionMode === "range") {
                        const selectedDate = parseDateValue(selectedValue);
                        const startDate = parseDateValue(rangeStart);
                        if (!startDate ||
                            rangeEnd ||
                            !selectedDate ||
                            selectedDate < startDate) {
                            rangeStart = selectedValue;
                            rangeEnd = "";
                        }
                        else {
                            const minNights = Math.max(0, Number(element.getAttribute("data-min-nights") ?? 0));
                            if (differenceInCalendarDays(selectedDate, startDate) < minNights) {
                                setAttributeIfChanged$f(element, "data-range-invalid", "true");
                                element.dispatchEvent(new CustomEvent("angularcss:calendar-range-invalid", {
                                    bubbles: true,
                                    detail: {
                                        minNights,
                                        start: rangeStart,
                                        value: selectedValue,
                                    },
                                }));
                                selectedDay.focus({ preventScroll: true });
                                return;
                            }
                            rangeEnd = selectedValue;
                        }
                        setAttributeIfChanged$f(element, "data-range-invalid", "false");
                        setAttributeIfChanged$f(element, "data-range-start-value", rangeStart);
                        setAttributeIfChanged$f(element, "data-range-end-value", rangeEnd);
                        values = [rangeStart, rangeEnd].filter(Boolean);
                    }
                    syncSelectionState(selectionMode, values, rangeStart, rangeEnd, selectedDay);
                    setAttributeIfChanged$f(element, "data-value", selectedValue);
                    if (emit) {
                        element.dispatchEvent(new CustomEvent("angularcss:calendar-select", {
                            bubbles: true,
                            detail: {
                                day: selectedDay,
                                value: element.getAttribute("data-value") ?? "",
                                values,
                                range: { start: rangeStart, end: rangeEnd },
                                selectionMode,
                            },
                        }));
                    }
                };
                const bindDay = (day) => {
                    setAttributeIfChanged$f(day, "role", day.getAttribute("role") ?? "gridcell");
                    setAttributeIfChanged$f(day, "tabindex", day.getAttribute("tabindex") ?? "-1");
                    const disabled = isDisabled(day);
                    setAttributeIfChanged$f(day, "data-disabled", String(disabled));
                    setAttributeIfChanged$f(day, "aria-disabled", String(disabled));
                    const outside = day.getAttribute("data-outside") === "true";
                    setAttributeIfChanged$f(day, "data-outside", String(outside));
                    const range = day.getAttribute("data-range-start") === "true"
                        ? "start"
                        : day.getAttribute("data-range-end") === "true"
                            ? "end"
                            : day.getAttribute("data-range-middle") === "true"
                                ? "middle"
                                : "none";
                    setAttributeIfChanged$f(day, "data-range", range);
                    setAttributeIfChanged$f(day, "data-state", day.getAttribute("aria-selected") === "true" ||
                        day.getAttribute("data-selected") === "true"
                        ? "selected"
                        : "idle");
                    const label = day.getAttribute("data-label") ?? day.getAttribute("data-value");
                    const currentLabel = day.getAttribute("aria-label");
                    if (label &&
                        (!currentLabel || currentLabel === generatedLabels.get(day))) {
                        setAttributeIfChanged$f(day, "aria-label", label);
                        generatedLabels.set(day, label);
                    }
                    if (day.getAttribute("data-today") === "true") {
                        if (!day.hasAttribute("aria-current"))
                            generatedCurrent.add(day);
                        setAttributeIfChanged$f(day, "aria-current", day.getAttribute("aria-current") ?? "date");
                    }
                    else if (generatedCurrent.has(day)) {
                        day.removeAttribute("aria-current");
                        generatedCurrent.delete(day);
                    }
                    if (cleanupDays.has(day))
                        return;
                    const handleClick = () => {
                        if (isDisabled(day))
                            return;
                        selectDay(day);
                        if (element.hasAttribute("data-calendar-generated") &&
                            day.getAttribute("data-outside") === "true") {
                            const value = day.getAttribute("data-value");
                            const date = parseDateValue(value);
                            if (date)
                                showMonth(date, value ?? undefined);
                        }
                    };
                    const handleKeydown = (event) => {
                        const index = days.indexOf(day);
                        if (event.key !== "ArrowRight" &&
                            event.key !== "ArrowLeft" &&
                            event.key !== "ArrowDown" &&
                            event.key !== "ArrowUp" &&
                            event.key !== "Home" &&
                            event.key !== "End" &&
                            event.key !== "PageUp" &&
                            event.key !== "PageDown") {
                            return;
                        }
                        event.preventDefault();
                        if ((event.key === "PageUp" || event.key === "PageDown") &&
                            element.hasAttribute("data-calendar-generated")) {
                            const date = parseDateValue(day.getAttribute("data-value"));
                            if (date) {
                                const target = addMonths(date, event.key === "PageUp" ? -1 : 1);
                                showMonth(target, formatDateValue(target), true);
                            }
                            return;
                        }
                        if (event.key === "Home" || event.key === "End") {
                            const rowStart = Math.floor(index / columns) * columns;
                            const rowEnd = Math.min(rowStart + columns - 1, days.length - 1);
                            const direction = event.key === "Home" ? 1 : -1;
                            const startIndex = event.key === "Home" ? rowStart : rowEnd;
                            for (let nextIndex = startIndex; nextIndex >= rowStart && nextIndex <= rowEnd; nextIndex += direction) {
                                const nextDay = days[nextIndex];
                                if (isDisabled(nextDay))
                                    continue;
                                selectDay(nextDay);
                                nextDay.focus();
                                break;
                            }
                            return;
                        }
                        const direction = event.key === "ArrowRight"
                            ? getDirection() === "rtl"
                                ? -1
                                : 1
                            : event.key === "ArrowLeft"
                                ? getDirection() === "rtl"
                                    ? 1
                                    : -1
                                : event.key === "ArrowDown"
                                    ? columns
                                    : -columns;
                        for (let nextIndex = index + direction; nextIndex >= 0 && nextIndex < days.length; nextIndex += direction) {
                            const nextDay = days[nextIndex];
                            if (isDisabled(nextDay))
                                continue;
                            selectDay(nextDay);
                            nextDay.focus();
                            break;
                        }
                    };
                    day.addEventListener("click", handleClick);
                    day.addEventListener("keydown", handleKeydown);
                    cleanupDays.set(day, () => {
                        day.removeEventListener("click", handleClick);
                        day.removeEventListener("keydown", handleKeydown);
                    });
                };
                const showMonth = (month, focusedValue, selectFocused = false) => {
                    const monthValue = formatDateValue(startOfMonth(month)).slice(0, 7);
                    setAttributeIfChanged$f(element, "data-month", monthValue);
                    renderedMonth = "";
                    renderGeneratedMonth();
                    syncCalendar();
                    element.dispatchEvent(new CustomEvent("angularcss:calendar-month-change", {
                        bubbles: true,
                        detail: { month: monthValue },
                    }));
                    if (!focusedValue)
                        return;
                    const focusedDay = days.find((day) => day.getAttribute("data-value") === focusedValue);
                    if (!focusedDay || isDisabled(focusedDay))
                        return;
                    if (selectFocused)
                        selectDay(focusedDay);
                    focusedDay.focus();
                };
                const bindMonthControl = (control, direction) => {
                    if (cleanupControls.has(control))
                        return;
                    const handleClick = () => {
                        if (isDisabled(control))
                            return;
                        const month = parseDateValue(`${element.getAttribute("data-month") ?? ""}-01`);
                        showMonth(addMonths(month ?? new Date(), direction));
                    };
                    control.addEventListener("click", handleClick);
                    cleanupControls.set(control, () => {
                        control.removeEventListener("click", handleClick);
                    });
                };
                const bindPresetControl = (control) => {
                    if (cleanupControls.has(control))
                        return;
                    const handleClick = () => {
                        if (isDisabled(control))
                            return;
                        const value = control.getAttribute("data-calendar-preset");
                        const date = parseDateValue(value);
                        if (!date || !value)
                            return;
                        showMonth(date, value, true);
                    };
                    control.addEventListener("click", handleClick);
                    cleanupControls.set(control, () => {
                        control.removeEventListener("click", handleClick);
                    });
                };
                function syncCalendar() {
                    renderGeneratedMonth();
                    const title = element.querySelector('[data-slot="calendar-title"], [ng-calendar-title]');
                    if (title && !element.hasAttribute("aria-label")) {
                        if (!title.id)
                            title.id = `calendar-title-${String(calendarIdCounter++)}`;
                        setAttributeIfChanged$f(element, "aria-labelledby", title.id);
                    }
                    queryAll(element, '[data-slot="calendar-row"], [ng-calendar-row]').forEach((row) => {
                        row.setAttribute("role", row.getAttribute("role") ?? "row");
                    });
                    queryAll(element, '[data-slot="calendar-weekday"], [ng-calendar-weekday]').forEach((weekday) => {
                        weekday.setAttribute("role", weekday.getAttribute("role") ?? "columnheader");
                    });
                    queryAll(element, '[data-slot="calendar-week-number"], [ng-calendar-week-number]').forEach((weekNumber) => {
                        setAttributeIfChanged$f(weekNumber, "role", weekNumber.getAttribute("role") ?? "rowheader");
                    });
                    days = queryAll(element, '[data-slot="calendar-day"], [ng-calendar-day]');
                    days.forEach(bindDay);
                    const selectionMode = element.getAttribute("data-selection-mode") ?? "single";
                    const hasRootSelection = selectionMode === "multiple"
                        ? element.hasAttribute("data-values")
                        : selectionMode === "range"
                            ? element.hasAttribute("data-range-start-value") ||
                                element.hasAttribute("data-range-end-value")
                            : element.hasAttribute("data-value");
                    if (hasRootSelection) {
                        syncSelectionState(selectionMode, [...parseDateList(element.getAttribute("data-values"))], element.getAttribute("data-range-start-value") ?? "", element.getAttribute("data-range-end-value") ?? "");
                    }
                    queryAll(element, '[data-slot="calendar-previous"], [ng-calendar-previous]').forEach((control) => {
                        bindMonthControl(control, -1);
                    });
                    queryAll(element, '[data-slot="calendar-next"], [ng-calendar-next]').forEach((control) => {
                        bindMonthControl(control, 1);
                    });
                    queryAll(element, "[data-calendar-preset]").forEach(bindPresetControl);
                    const requestedValue = element.getAttribute("data-value");
                    const selected = days.find((day) => day.getAttribute("data-value") === requestedValue) ??
                        days.find((day) => day.getAttribute("aria-selected") === "true" ||
                            day.getAttribute("data-selected") === "true");
                    if (selected && selectionMode === "single") {
                        selectDay(selected, false);
                    }
                    else if (!days.some((day) => day.getAttribute("tabindex") === "0")) {
                        (selected ??
                            days.find((day) => day.getAttribute("data-outside") !== "true" && !isDisabled(day)) ??
                            days.find((day) => !isDisabled(day)))?.setAttribute("tabindex", "0");
                    }
                }
                syncCalendar();
                const directionObserver = directionOwner === element
                    ? null
                    : new MutationObserver(() => {
                        syncDirection();
                    });
                directionObserver?.observe(directionOwner, {
                    attributes: true,
                    attributeFilter: ["dir"],
                });
                const elementObserver = new MutationObserver(() => {
                    syncDirection();
                    syncCalendar();
                });
                elementObserver.observe(element, {
                    attributes: true,
                    attributeFilter: [
                        "aria-disabled",
                        "aria-selected",
                        "data-disabled",
                        "data-disabled-after",
                        "data-disabled-before",
                        "data-disabled-dates",
                        "data-booked-dates",
                        "data-caption-layout",
                        "data-end-year",
                        "data-label",
                        "data-min-nights",
                        "data-month",
                        "data-number-of-months",
                        "data-outside",
                        "data-range-end",
                        "data-range-end-value",
                        "data-range-middle",
                        "data-range-start",
                        "data-range-start-value",
                        "data-selected",
                        "data-selection-mode",
                        "data-show-outside-days",
                        "data-show-week-numbers",
                        "data-start-year",
                        "data-today",
                        "data-value",
                        "data-values",
                        "data-week-start",
                        "dir",
                        "disabled",
                        "hidden",
                    ],
                    childList: true,
                    subtree: true,
                });
                onDestroy(scope, () => {
                    directionObserver?.disconnect();
                    elementObserver.disconnect();
                    days.forEach((day) => {
                        cleanupDays.get(day)?.();
                    });
                    queryAll(element, '[data-slot="calendar-previous"], [ng-calendar-previous], [data-slot="calendar-next"], [ng-calendar-next]').forEach((control) => cleanupControls.get(control)?.());
                    queryAll(element, "[data-calendar-preset]").forEach((control) => cleanupControls.get(control)?.());
                });
            },
        };
    }

    function isNumber(subject) {
      return typeof subject === 'number';
    }
    function isString(subject) {
      return typeof subject === 'string';
    }
    function isBoolean(subject) {
      return typeof subject === 'boolean';
    }
    function isObject(subject) {
      return Object.prototype.toString.call(subject) === '[object Object]';
    }
    function mathAbs(n) {
      return Math.abs(n);
    }
    function mathSign(n) {
      return Math.sign(n);
    }
    function deltaAbs(valueB, valueA) {
      return mathAbs(valueB - valueA);
    }
    function factorAbs(valueB, valueA) {
      if (valueB === 0 || valueA === 0) return 0;
      if (mathAbs(valueB) <= mathAbs(valueA)) return 0;
      const diff = deltaAbs(mathAbs(valueB), mathAbs(valueA));
      return mathAbs(diff / valueB);
    }
    function roundToTwoDecimals(num) {
      return Math.round(num * 100) / 100;
    }
    function arrayKeys(array) {
      return objectKeys(array).map(Number);
    }
    function arrayLast(array) {
      return array[arrayLastIndex(array)];
    }
    function arrayLastIndex(array) {
      return Math.max(0, array.length - 1);
    }
    function arrayIsLastIndex(array, index) {
      return index === arrayLastIndex(array);
    }
    function arrayFromNumber(n, startAt = 0) {
      return Array.from(Array(n), (_, i) => startAt + i);
    }
    function objectKeys(object) {
      return Object.keys(object);
    }
    function objectsMergeDeep(objectA, objectB) {
      return [objectA, objectB].reduce((mergedObjects, currentObject) => {
        objectKeys(currentObject).forEach(key => {
          const valueA = mergedObjects[key];
          const valueB = currentObject[key];
          const areObjects = isObject(valueA) && isObject(valueB);
          mergedObjects[key] = areObjects ? objectsMergeDeep(valueA, valueB) : valueB;
        });
        return mergedObjects;
      }, {});
    }
    function isMouseEvent(evt, ownerWindow) {
      return typeof ownerWindow.MouseEvent !== 'undefined' && evt instanceof ownerWindow.MouseEvent;
    }

    function Alignment(align, viewSize) {
      const predefined = {
        start,
        center,
        end
      };
      function start() {
        return 0;
      }
      function center(n) {
        return end(n) / 2;
      }
      function end(n) {
        return viewSize - n;
      }
      function measure(n, index) {
        if (isString(align)) return predefined[align](n);
        return align(viewSize, n, index);
      }
      const self = {
        measure
      };
      return self;
    }

    function EventStore() {
      let listeners = [];
      function add(node, type, handler, options = {
        passive: true
      }) {
        let removeListener;
        if ('addEventListener' in node) {
          node.addEventListener(type, handler, options);
          removeListener = () => node.removeEventListener(type, handler, options);
        } else {
          const legacyMediaQueryList = node;
          legacyMediaQueryList.addListener(handler);
          removeListener = () => legacyMediaQueryList.removeListener(handler);
        }
        listeners.push(removeListener);
        return self;
      }
      function clear() {
        listeners = listeners.filter(remove => remove());
      }
      const self = {
        add,
        clear
      };
      return self;
    }

    function Animations(ownerDocument, ownerWindow, update, render) {
      const documentVisibleHandler = EventStore();
      const fixedTimeStep = 1000 / 60;
      let lastTimeStamp = null;
      let accumulatedTime = 0;
      let animationId = 0;
      function init() {
        documentVisibleHandler.add(ownerDocument, 'visibilitychange', () => {
          if (ownerDocument.hidden) reset();
        });
      }
      function destroy() {
        stop();
        documentVisibleHandler.clear();
      }
      function animate(timeStamp) {
        if (!animationId) return;
        if (!lastTimeStamp) {
          lastTimeStamp = timeStamp;
          update();
          update();
        }
        const timeElapsed = timeStamp - lastTimeStamp;
        lastTimeStamp = timeStamp;
        accumulatedTime += timeElapsed;
        while (accumulatedTime >= fixedTimeStep) {
          update();
          accumulatedTime -= fixedTimeStep;
        }
        const alpha = accumulatedTime / fixedTimeStep;
        render(alpha);
        if (animationId) {
          animationId = ownerWindow.requestAnimationFrame(animate);
        }
      }
      function start() {
        if (animationId) return;
        animationId = ownerWindow.requestAnimationFrame(animate);
      }
      function stop() {
        ownerWindow.cancelAnimationFrame(animationId);
        lastTimeStamp = null;
        accumulatedTime = 0;
        animationId = 0;
      }
      function reset() {
        lastTimeStamp = null;
        accumulatedTime = 0;
      }
      const self = {
        init,
        destroy,
        start,
        stop,
        update,
        render
      };
      return self;
    }

    function Axis(axis, contentDirection) {
      const isRightToLeft = contentDirection === 'rtl';
      const isVertical = axis === 'y';
      const scroll = isVertical ? 'y' : 'x';
      const cross = isVertical ? 'x' : 'y';
      const sign = !isVertical && isRightToLeft ? -1 : 1;
      const startEdge = getStartEdge();
      const endEdge = getEndEdge();
      function measureSize(nodeRect) {
        const {
          height,
          width
        } = nodeRect;
        return isVertical ? height : width;
      }
      function getStartEdge() {
        if (isVertical) return 'top';
        return isRightToLeft ? 'right' : 'left';
      }
      function getEndEdge() {
        if (isVertical) return 'bottom';
        return isRightToLeft ? 'left' : 'right';
      }
      function direction(n) {
        return n * sign;
      }
      const self = {
        scroll,
        cross,
        startEdge,
        endEdge,
        measureSize,
        direction
      };
      return self;
    }

    function Limit(min = 0, max = 0) {
      const length = mathAbs(min - max);
      function reachedMin(n) {
        return n < min;
      }
      function reachedMax(n) {
        return n > max;
      }
      function reachedAny(n) {
        return reachedMin(n) || reachedMax(n);
      }
      function constrain(n) {
        if (!reachedAny(n)) return n;
        return reachedMin(n) ? min : max;
      }
      function removeOffset(n) {
        if (!length) return n;
        return n - length * Math.ceil((n - max) / length);
      }
      const self = {
        length,
        max,
        min,
        constrain,
        reachedAny,
        reachedMax,
        reachedMin,
        removeOffset
      };
      return self;
    }

    function Counter(max, start, loop) {
      const {
        constrain
      } = Limit(0, max);
      const loopEnd = max + 1;
      let counter = withinLimit(start);
      function withinLimit(n) {
        return !loop ? constrain(n) : mathAbs((loopEnd + n) % loopEnd);
      }
      function get() {
        return counter;
      }
      function set(n) {
        counter = withinLimit(n);
        return self;
      }
      function add(n) {
        return clone().set(get() + n);
      }
      function clone() {
        return Counter(max, get(), loop);
      }
      const self = {
        get,
        set,
        add,
        clone
      };
      return self;
    }

    function DragHandler(axis, rootNode, ownerDocument, ownerWindow, target, dragTracker, location, animation, scrollTo, scrollBody, scrollTarget, index, eventHandler, percentOfView, dragFree, dragThreshold, skipSnaps, baseFriction, watchDrag) {
      const {
        cross: crossAxis,
        direction
      } = axis;
      const focusNodes = ['INPUT', 'SELECT', 'TEXTAREA'];
      const nonPassiveEvent = {
        passive: false
      };
      const initEvents = EventStore();
      const dragEvents = EventStore();
      const goToNextThreshold = Limit(50, 225).constrain(percentOfView.measure(20));
      const snapForceBoost = {
        mouse: 300,
        touch: 400
      };
      const freeForceBoost = {
        mouse: 500,
        touch: 600
      };
      const baseSpeed = dragFree ? 43 : 25;
      let isMoving = false;
      let startScroll = 0;
      let startCross = 0;
      let pointerIsDown = false;
      let preventScroll = false;
      let preventClick = false;
      let isMouse = false;
      function init(emblaApi) {
        if (!watchDrag) return;
        function downIfAllowed(evt) {
          if (isBoolean(watchDrag) || watchDrag(emblaApi, evt)) down(evt);
        }
        const node = rootNode;
        initEvents.add(node, 'dragstart', evt => evt.preventDefault(), nonPassiveEvent).add(node, 'touchmove', () => undefined, nonPassiveEvent).add(node, 'touchend', () => undefined).add(node, 'touchstart', downIfAllowed).add(node, 'mousedown', downIfAllowed).add(node, 'touchcancel', up).add(node, 'contextmenu', up).add(node, 'click', click, true);
      }
      function destroy() {
        initEvents.clear();
        dragEvents.clear();
      }
      function addDragEvents() {
        const node = isMouse ? ownerDocument : rootNode;
        dragEvents.add(node, 'touchmove', move, nonPassiveEvent).add(node, 'touchend', up).add(node, 'mousemove', move, nonPassiveEvent).add(node, 'mouseup', up);
      }
      function isFocusNode(node) {
        const nodeName = node.nodeName || '';
        return focusNodes.includes(nodeName);
      }
      function forceBoost() {
        const boost = dragFree ? freeForceBoost : snapForceBoost;
        const type = isMouse ? 'mouse' : 'touch';
        return boost[type];
      }
      function allowedForce(force, targetChanged) {
        const next = index.add(mathSign(force) * -1);
        const baseForce = scrollTarget.byDistance(force, !dragFree).distance;
        if (dragFree || mathAbs(force) < goToNextThreshold) return baseForce;
        if (skipSnaps && targetChanged) return baseForce * 0.5;
        return scrollTarget.byIndex(next.get(), 0).distance;
      }
      function down(evt) {
        const isMouseEvt = isMouseEvent(evt, ownerWindow);
        isMouse = isMouseEvt;
        preventClick = dragFree && isMouseEvt && !evt.buttons && isMoving;
        isMoving = deltaAbs(target.get(), location.get()) >= 2;
        if (isMouseEvt && evt.button !== 0) return;
        if (isFocusNode(evt.target)) return;
        pointerIsDown = true;
        dragTracker.pointerDown(evt);
        scrollBody.useFriction(0).useDuration(0);
        target.set(location);
        addDragEvents();
        startScroll = dragTracker.readPoint(evt);
        startCross = dragTracker.readPoint(evt, crossAxis);
        eventHandler.emit('pointerDown');
      }
      function move(evt) {
        const isTouchEvt = !isMouseEvent(evt, ownerWindow);
        if (isTouchEvt && evt.touches.length >= 2) return up(evt);
        const lastScroll = dragTracker.readPoint(evt);
        const lastCross = dragTracker.readPoint(evt, crossAxis);
        const diffScroll = deltaAbs(lastScroll, startScroll);
        const diffCross = deltaAbs(lastCross, startCross);
        if (!preventScroll && !isMouse) {
          if (!evt.cancelable) return up(evt);
          preventScroll = diffScroll > diffCross;
          if (!preventScroll) return up(evt);
        }
        const diff = dragTracker.pointerMove(evt);
        if (diffScroll > dragThreshold) preventClick = true;
        scrollBody.useFriction(0.3).useDuration(0.75);
        animation.start();
        target.add(direction(diff));
        evt.preventDefault();
      }
      function up(evt) {
        const currentLocation = scrollTarget.byDistance(0, false);
        const targetChanged = currentLocation.index !== index.get();
        const rawForce = dragTracker.pointerUp(evt) * forceBoost();
        const force = allowedForce(direction(rawForce), targetChanged);
        const forceFactor = factorAbs(rawForce, force);
        const speed = baseSpeed - 10 * forceFactor;
        const friction = baseFriction + forceFactor / 50;
        preventScroll = false;
        pointerIsDown = false;
        dragEvents.clear();
        scrollBody.useDuration(speed).useFriction(friction);
        scrollTo.distance(force, !dragFree);
        isMouse = false;
        eventHandler.emit('pointerUp');
      }
      function click(evt) {
        if (preventClick) {
          evt.stopPropagation();
          evt.preventDefault();
          preventClick = false;
        }
      }
      function pointerDown() {
        return pointerIsDown;
      }
      const self = {
        init,
        destroy,
        pointerDown
      };
      return self;
    }

    function DragTracker(axis, ownerWindow) {
      const logInterval = 170;
      let startEvent;
      let lastEvent;
      function readTime(evt) {
        return evt.timeStamp;
      }
      function readPoint(evt, evtAxis) {
        const property = evtAxis || axis.scroll;
        const coord = `client${property === 'x' ? 'X' : 'Y'}`;
        return (isMouseEvent(evt, ownerWindow) ? evt : evt.touches[0])[coord];
      }
      function pointerDown(evt) {
        startEvent = evt;
        lastEvent = evt;
        return readPoint(evt);
      }
      function pointerMove(evt) {
        const diff = readPoint(evt) - readPoint(lastEvent);
        const expired = readTime(evt) - readTime(startEvent) > logInterval;
        lastEvent = evt;
        if (expired) startEvent = evt;
        return diff;
      }
      function pointerUp(evt) {
        if (!startEvent || !lastEvent) return 0;
        const diffDrag = readPoint(lastEvent) - readPoint(startEvent);
        const diffTime = readTime(evt) - readTime(startEvent);
        const expired = readTime(evt) - readTime(lastEvent) > logInterval;
        const force = diffDrag / diffTime;
        const isFlick = diffTime && !expired && mathAbs(force) > 0.1;
        return isFlick ? force : 0;
      }
      const self = {
        pointerDown,
        pointerMove,
        pointerUp,
        readPoint
      };
      return self;
    }

    function NodeRects() {
      function measure(node) {
        const {
          offsetTop,
          offsetLeft,
          offsetWidth,
          offsetHeight
        } = node;
        const offset = {
          top: offsetTop,
          right: offsetLeft + offsetWidth,
          bottom: offsetTop + offsetHeight,
          left: offsetLeft,
          width: offsetWidth,
          height: offsetHeight
        };
        return offset;
      }
      const self = {
        measure
      };
      return self;
    }

    function PercentOfView(viewSize) {
      function measure(n) {
        return viewSize * (n / 100);
      }
      const self = {
        measure
      };
      return self;
    }

    function ResizeHandler(container, eventHandler, ownerWindow, slides, axis, watchResize, nodeRects) {
      const observeNodes = [container].concat(slides);
      let resizeObserver;
      let containerSize;
      let slideSizes = [];
      let destroyed = false;
      function readSize(node) {
        return axis.measureSize(nodeRects.measure(node));
      }
      function init(emblaApi) {
        if (!watchResize) return;
        containerSize = readSize(container);
        slideSizes = slides.map(readSize);
        function defaultCallback(entries) {
          for (const entry of entries) {
            if (destroyed) return;
            const isContainer = entry.target === container;
            const slideIndex = slides.indexOf(entry.target);
            const lastSize = isContainer ? containerSize : slideSizes[slideIndex];
            const newSize = readSize(isContainer ? container : slides[slideIndex]);
            const diffSize = mathAbs(newSize - lastSize);
            if (diffSize >= 0.5) {
              emblaApi.reInit();
              eventHandler.emit('resize');
              break;
            }
          }
        }
        resizeObserver = new ResizeObserver(entries => {
          if (isBoolean(watchResize) || watchResize(emblaApi, entries)) {
            defaultCallback(entries);
          }
        });
        ownerWindow.requestAnimationFrame(() => {
          observeNodes.forEach(node => resizeObserver.observe(node));
        });
      }
      function destroy() {
        destroyed = true;
        if (resizeObserver) resizeObserver.disconnect();
      }
      const self = {
        init,
        destroy
      };
      return self;
    }

    function ScrollBody(location, offsetLocation, previousLocation, target, baseDuration, baseFriction) {
      let scrollVelocity = 0;
      let scrollDirection = 0;
      let scrollDuration = baseDuration;
      let scrollFriction = baseFriction;
      let rawLocation = location.get();
      let rawLocationPrevious = 0;
      function seek() {
        const displacement = target.get() - location.get();
        const isInstant = !scrollDuration;
        let scrollDistance = 0;
        if (isInstant) {
          scrollVelocity = 0;
          previousLocation.set(target);
          location.set(target);
          scrollDistance = displacement;
        } else {
          previousLocation.set(location);
          scrollVelocity += displacement / scrollDuration;
          scrollVelocity *= scrollFriction;
          rawLocation += scrollVelocity;
          location.add(scrollVelocity);
          scrollDistance = rawLocation - rawLocationPrevious;
        }
        scrollDirection = mathSign(scrollDistance);
        rawLocationPrevious = rawLocation;
        return self;
      }
      function settled() {
        const diff = target.get() - offsetLocation.get();
        return mathAbs(diff) < 0.001;
      }
      function duration() {
        return scrollDuration;
      }
      function direction() {
        return scrollDirection;
      }
      function velocity() {
        return scrollVelocity;
      }
      function useBaseDuration() {
        return useDuration(baseDuration);
      }
      function useBaseFriction() {
        return useFriction(baseFriction);
      }
      function useDuration(n) {
        scrollDuration = n;
        return self;
      }
      function useFriction(n) {
        scrollFriction = n;
        return self;
      }
      const self = {
        direction,
        duration,
        velocity,
        seek,
        settled,
        useBaseFriction,
        useBaseDuration,
        useFriction,
        useDuration
      };
      return self;
    }

    function ScrollBounds(limit, location, target, scrollBody, percentOfView) {
      const pullBackThreshold = percentOfView.measure(10);
      const edgeOffsetTolerance = percentOfView.measure(50);
      const frictionLimit = Limit(0.1, 0.99);
      let disabled = false;
      function shouldConstrain() {
        if (disabled) return false;
        if (!limit.reachedAny(target.get())) return false;
        if (!limit.reachedAny(location.get())) return false;
        return true;
      }
      function constrain(pointerDown) {
        if (!shouldConstrain()) return;
        const edge = limit.reachedMin(location.get()) ? 'min' : 'max';
        const diffToEdge = mathAbs(limit[edge] - location.get());
        const diffToTarget = target.get() - location.get();
        const friction = frictionLimit.constrain(diffToEdge / edgeOffsetTolerance);
        target.subtract(diffToTarget * friction);
        if (!pointerDown && mathAbs(diffToTarget) < pullBackThreshold) {
          target.set(limit.constrain(target.get()));
          scrollBody.useDuration(25).useBaseFriction();
        }
      }
      function toggleActive(active) {
        disabled = !active;
      }
      const self = {
        shouldConstrain,
        constrain,
        toggleActive
      };
      return self;
    }

    function ScrollContain(viewSize, contentSize, snapsAligned, containScroll, pixelTolerance) {
      const scrollBounds = Limit(-contentSize + viewSize, 0);
      const snapsBounded = measureBounded();
      const scrollContainLimit = findScrollContainLimit();
      const snapsContained = measureContained();
      function usePixelTolerance(bound, snap) {
        return deltaAbs(bound, snap) <= 1;
      }
      function findScrollContainLimit() {
        const startSnap = snapsBounded[0];
        const endSnap = arrayLast(snapsBounded);
        const min = snapsBounded.lastIndexOf(startSnap);
        const max = snapsBounded.indexOf(endSnap) + 1;
        return Limit(min, max);
      }
      function measureBounded() {
        return snapsAligned.map((snapAligned, index) => {
          const {
            min,
            max
          } = scrollBounds;
          const snap = scrollBounds.constrain(snapAligned);
          const isFirst = !index;
          const isLast = arrayIsLastIndex(snapsAligned, index);
          if (isFirst) return max;
          if (isLast) return min;
          if (usePixelTolerance(min, snap)) return min;
          if (usePixelTolerance(max, snap)) return max;
          return snap;
        }).map(scrollBound => parseFloat(scrollBound.toFixed(3)));
      }
      function measureContained() {
        if (contentSize <= viewSize + pixelTolerance) return [scrollBounds.max];
        if (containScroll === 'keepSnaps') return snapsBounded;
        const {
          min,
          max
        } = scrollContainLimit;
        return snapsBounded.slice(min, max);
      }
      const self = {
        snapsContained,
        scrollContainLimit
      };
      return self;
    }

    function ScrollLimit(contentSize, scrollSnaps, loop) {
      const max = scrollSnaps[0];
      const min = loop ? max - contentSize : arrayLast(scrollSnaps);
      const limit = Limit(min, max);
      const self = {
        limit
      };
      return self;
    }

    function ScrollLooper(contentSize, limit, location, vectors) {
      const jointSafety = 0.1;
      const min = limit.min + jointSafety;
      const max = limit.max + jointSafety;
      const {
        reachedMin,
        reachedMax
      } = Limit(min, max);
      function shouldLoop(direction) {
        if (direction === 1) return reachedMax(location.get());
        if (direction === -1) return reachedMin(location.get());
        return false;
      }
      function loop(direction) {
        if (!shouldLoop(direction)) return;
        const loopDistance = contentSize * (direction * -1);
        vectors.forEach(v => v.add(loopDistance));
      }
      const self = {
        loop
      };
      return self;
    }

    function ScrollProgress(limit) {
      const {
        max,
        length
      } = limit;
      function get(n) {
        const currentLocation = n - max;
        return length ? currentLocation / -length : 0;
      }
      const self = {
        get
      };
      return self;
    }

    function ScrollSnaps(axis, alignment, containerRect, slideRects, slidesToScroll) {
      const {
        startEdge,
        endEdge
      } = axis;
      const {
        groupSlides
      } = slidesToScroll;
      const alignments = measureSizes().map(alignment.measure);
      const snaps = measureUnaligned();
      const snapsAligned = measureAligned();
      function measureSizes() {
        return groupSlides(slideRects).map(rects => arrayLast(rects)[endEdge] - rects[0][startEdge]).map(mathAbs);
      }
      function measureUnaligned() {
        return slideRects.map(rect => containerRect[startEdge] - rect[startEdge]).map(snap => -mathAbs(snap));
      }
      function measureAligned() {
        return groupSlides(snaps).map(g => g[0]).map((snap, index) => snap + alignments[index]);
      }
      const self = {
        snaps,
        snapsAligned
      };
      return self;
    }

    function SlideRegistry(containSnaps, containScroll, scrollSnaps, scrollContainLimit, slidesToScroll, slideIndexes) {
      const {
        groupSlides
      } = slidesToScroll;
      const {
        min,
        max
      } = scrollContainLimit;
      const slideRegistry = createSlideRegistry();
      function createSlideRegistry() {
        const groupedSlideIndexes = groupSlides(slideIndexes);
        const doNotContain = !containSnaps || containScroll === 'keepSnaps';
        if (scrollSnaps.length === 1) return [slideIndexes];
        if (doNotContain) return groupedSlideIndexes;
        return groupedSlideIndexes.slice(min, max).map((group, index, groups) => {
          const isFirst = !index;
          const isLast = arrayIsLastIndex(groups, index);
          if (isFirst) {
            const range = arrayLast(groups[0]) + 1;
            return arrayFromNumber(range);
          }
          if (isLast) {
            const range = arrayLastIndex(slideIndexes) - arrayLast(groups)[0] + 1;
            return arrayFromNumber(range, arrayLast(groups)[0]);
          }
          return group;
        });
      }
      const self = {
        slideRegistry
      };
      return self;
    }

    function ScrollTarget(loop, scrollSnaps, contentSize, limit, targetVector) {
      const {
        reachedAny,
        removeOffset,
        constrain
      } = limit;
      function minDistance(distances) {
        return distances.concat().sort((a, b) => mathAbs(a) - mathAbs(b))[0];
      }
      function findTargetSnap(target) {
        const distance = loop ? removeOffset(target) : constrain(target);
        const ascDiffsToSnaps = scrollSnaps.map((snap, index) => ({
          diff: shortcut(snap - distance, 0),
          index
        })).sort((d1, d2) => mathAbs(d1.diff) - mathAbs(d2.diff));
        const {
          index
        } = ascDiffsToSnaps[0];
        return {
          index,
          distance
        };
      }
      function shortcut(target, direction) {
        const targets = [target, target + contentSize, target - contentSize];
        if (!loop) return target;
        if (!direction) return minDistance(targets);
        const matchingTargets = targets.filter(t => mathSign(t) === direction);
        if (matchingTargets.length) return minDistance(matchingTargets);
        return arrayLast(targets) - contentSize;
      }
      function byIndex(index, direction) {
        const diffToSnap = scrollSnaps[index] - targetVector.get();
        const distance = shortcut(diffToSnap, direction);
        return {
          index,
          distance
        };
      }
      function byDistance(distance, snap) {
        const target = targetVector.get() + distance;
        const {
          index,
          distance: targetSnapDistance
        } = findTargetSnap(target);
        const reachedBound = !loop && reachedAny(target);
        if (!snap || reachedBound) return {
          index,
          distance
        };
        const diffToSnap = scrollSnaps[index] - targetSnapDistance;
        const snapDistance = distance + shortcut(diffToSnap, 0);
        return {
          index,
          distance: snapDistance
        };
      }
      const self = {
        byDistance,
        byIndex,
        shortcut
      };
      return self;
    }

    function ScrollTo(animation, indexCurrent, indexPrevious, scrollBody, scrollTarget, targetVector, eventHandler) {
      function scrollTo(target) {
        const distanceDiff = target.distance;
        const indexDiff = target.index !== indexCurrent.get();
        targetVector.add(distanceDiff);
        if (distanceDiff) {
          if (scrollBody.duration()) {
            animation.start();
          } else {
            animation.update();
            animation.render(1);
            animation.update();
          }
        }
        if (indexDiff) {
          indexPrevious.set(indexCurrent.get());
          indexCurrent.set(target.index);
          eventHandler.emit('select');
        }
      }
      function distance(n, snap) {
        const target = scrollTarget.byDistance(n, snap);
        scrollTo(target);
      }
      function index(n, direction) {
        const targetIndex = indexCurrent.clone().set(n);
        const target = scrollTarget.byIndex(targetIndex.get(), direction);
        scrollTo(target);
      }
      const self = {
        distance,
        index
      };
      return self;
    }

    function SlideFocus(root, slides, slideRegistry, scrollTo, scrollBody, eventStore, eventHandler, watchFocus) {
      const focusListenerOptions = {
        passive: true,
        capture: true
      };
      let lastTabPressTime = 0;
      function init(emblaApi) {
        if (!watchFocus) return;
        function defaultCallback(index) {
          const nowTime = new Date().getTime();
          const diffTime = nowTime - lastTabPressTime;
          if (diffTime > 10) return;
          eventHandler.emit('slideFocusStart');
          root.scrollLeft = 0;
          const group = slideRegistry.findIndex(group => group.includes(index));
          if (!isNumber(group)) return;
          scrollBody.useDuration(0);
          scrollTo.index(group, 0);
          eventHandler.emit('slideFocus');
        }
        eventStore.add(document, 'keydown', registerTabPress, false);
        slides.forEach((slide, slideIndex) => {
          eventStore.add(slide, 'focus', evt => {
            if (isBoolean(watchFocus) || watchFocus(emblaApi, evt)) {
              defaultCallback(slideIndex);
            }
          }, focusListenerOptions);
        });
      }
      function registerTabPress(event) {
        if (event.code === 'Tab') lastTabPressTime = new Date().getTime();
      }
      const self = {
        init
      };
      return self;
    }

    function Vector1D(initialValue) {
      let value = initialValue;
      function get() {
        return value;
      }
      function set(n) {
        value = normalizeInput(n);
      }
      function add(n) {
        value += normalizeInput(n);
      }
      function subtract(n) {
        value -= normalizeInput(n);
      }
      function normalizeInput(n) {
        return isNumber(n) ? n : n.get();
      }
      const self = {
        get,
        set,
        add,
        subtract
      };
      return self;
    }

    function Translate(axis, container) {
      const translate = axis.scroll === 'x' ? x : y;
      const containerStyle = container.style;
      let previousTarget = null;
      let disabled = false;
      function x(n) {
        return `translate3d(${n}px,0px,0px)`;
      }
      function y(n) {
        return `translate3d(0px,${n}px,0px)`;
      }
      function to(target) {
        if (disabled) return;
        const newTarget = roundToTwoDecimals(axis.direction(target));
        if (newTarget === previousTarget) return;
        containerStyle.transform = translate(newTarget);
        previousTarget = newTarget;
      }
      function toggleActive(active) {
        disabled = !active;
      }
      function clear() {
        if (disabled) return;
        containerStyle.transform = '';
        if (!container.getAttribute('style')) container.removeAttribute('style');
      }
      const self = {
        clear,
        to,
        toggleActive
      };
      return self;
    }

    function SlideLooper(axis, viewSize, contentSize, slideSizes, slideSizesWithGaps, snaps, scrollSnaps, location, slides) {
      const roundingSafety = 0.5;
      const ascItems = arrayKeys(slideSizesWithGaps);
      const descItems = arrayKeys(slideSizesWithGaps).reverse();
      const loopPoints = startPoints().concat(endPoints());
      function removeSlideSizes(indexes, from) {
        return indexes.reduce((a, i) => {
          return a - slideSizesWithGaps[i];
        }, from);
      }
      function slidesInGap(indexes, gap) {
        return indexes.reduce((a, i) => {
          const remainingGap = removeSlideSizes(a, gap);
          return remainingGap > 0 ? a.concat([i]) : a;
        }, []);
      }
      function findSlideBounds(offset) {
        return snaps.map((snap, index) => ({
          start: snap - slideSizes[index] + roundingSafety + offset,
          end: snap + viewSize - roundingSafety + offset
        }));
      }
      function findLoopPoints(indexes, offset, isEndEdge) {
        const slideBounds = findSlideBounds(offset);
        return indexes.map(index => {
          const initial = isEndEdge ? 0 : -contentSize;
          const altered = isEndEdge ? contentSize : 0;
          const boundEdge = isEndEdge ? 'end' : 'start';
          const loopPoint = slideBounds[index][boundEdge];
          return {
            index,
            loopPoint,
            slideLocation: Vector1D(-1),
            translate: Translate(axis, slides[index]),
            target: () => location.get() > loopPoint ? initial : altered
          };
        });
      }
      function startPoints() {
        const gap = scrollSnaps[0];
        const indexes = slidesInGap(descItems, gap);
        return findLoopPoints(indexes, contentSize, false);
      }
      function endPoints() {
        const gap = viewSize - scrollSnaps[0] - 1;
        const indexes = slidesInGap(ascItems, gap);
        return findLoopPoints(indexes, -contentSize, true);
      }
      function canLoop() {
        return loopPoints.every(({
          index
        }) => {
          const otherIndexes = ascItems.filter(i => i !== index);
          return removeSlideSizes(otherIndexes, viewSize) <= 0.1;
        });
      }
      function loop() {
        loopPoints.forEach(loopPoint => {
          const {
            target,
            translate,
            slideLocation
          } = loopPoint;
          const shiftLocation = target();
          if (shiftLocation === slideLocation.get()) return;
          translate.to(shiftLocation);
          slideLocation.set(shiftLocation);
        });
      }
      function clear() {
        loopPoints.forEach(loopPoint => loopPoint.translate.clear());
      }
      const self = {
        canLoop,
        clear,
        loop,
        loopPoints
      };
      return self;
    }

    function SlidesHandler(container, eventHandler, watchSlides) {
      let mutationObserver;
      let destroyed = false;
      function init(emblaApi) {
        if (!watchSlides) return;
        function defaultCallback(mutations) {
          for (const mutation of mutations) {
            if (mutation.type === 'childList') {
              emblaApi.reInit();
              eventHandler.emit('slidesChanged');
              break;
            }
          }
        }
        mutationObserver = new MutationObserver(mutations => {
          if (destroyed) return;
          if (isBoolean(watchSlides) || watchSlides(emblaApi, mutations)) {
            defaultCallback(mutations);
          }
        });
        mutationObserver.observe(container, {
          childList: true
        });
      }
      function destroy() {
        if (mutationObserver) mutationObserver.disconnect();
        destroyed = true;
      }
      const self = {
        init,
        destroy
      };
      return self;
    }

    function SlidesInView(container, slides, eventHandler, threshold) {
      const intersectionEntryMap = {};
      let inViewCache = null;
      let notInViewCache = null;
      let intersectionObserver;
      let destroyed = false;
      function init() {
        intersectionObserver = new IntersectionObserver(entries => {
          if (destroyed) return;
          entries.forEach(entry => {
            const index = slides.indexOf(entry.target);
            intersectionEntryMap[index] = entry;
          });
          inViewCache = null;
          notInViewCache = null;
          eventHandler.emit('slidesInView');
        }, {
          root: container.parentElement,
          threshold
        });
        slides.forEach(slide => intersectionObserver.observe(slide));
      }
      function destroy() {
        if (intersectionObserver) intersectionObserver.disconnect();
        destroyed = true;
      }
      function createInViewList(inView) {
        return objectKeys(intersectionEntryMap).reduce((list, slideIndex) => {
          const index = parseInt(slideIndex);
          const {
            isIntersecting
          } = intersectionEntryMap[index];
          const inViewMatch = inView && isIntersecting;
          const notInViewMatch = !inView && !isIntersecting;
          if (inViewMatch || notInViewMatch) list.push(index);
          return list;
        }, []);
      }
      function get(inView = true) {
        if (inView && inViewCache) return inViewCache;
        if (!inView && notInViewCache) return notInViewCache;
        const slideIndexes = createInViewList(inView);
        if (inView) inViewCache = slideIndexes;
        if (!inView) notInViewCache = slideIndexes;
        return slideIndexes;
      }
      const self = {
        init,
        destroy,
        get
      };
      return self;
    }

    function SlideSizes(axis, containerRect, slideRects, slides, readEdgeGap, ownerWindow) {
      const {
        measureSize,
        startEdge,
        endEdge
      } = axis;
      const withEdgeGap = slideRects[0] && readEdgeGap;
      const startGap = measureStartGap();
      const endGap = measureEndGap();
      const slideSizes = slideRects.map(measureSize);
      const slideSizesWithGaps = measureWithGaps();
      function measureStartGap() {
        if (!withEdgeGap) return 0;
        const slideRect = slideRects[0];
        return mathAbs(containerRect[startEdge] - slideRect[startEdge]);
      }
      function measureEndGap() {
        if (!withEdgeGap) return 0;
        const style = ownerWindow.getComputedStyle(arrayLast(slides));
        return parseFloat(style.getPropertyValue(`margin-${endEdge}`));
      }
      function measureWithGaps() {
        return slideRects.map((rect, index, rects) => {
          const isFirst = !index;
          const isLast = arrayIsLastIndex(rects, index);
          if (isFirst) return slideSizes[index] + startGap;
          if (isLast) return slideSizes[index] + endGap;
          return rects[index + 1][startEdge] - rect[startEdge];
        }).map(mathAbs);
      }
      const self = {
        slideSizes,
        slideSizesWithGaps,
        startGap,
        endGap
      };
      return self;
    }

    function SlidesToScroll(axis, viewSize, slidesToScroll, loop, containerRect, slideRects, startGap, endGap, pixelTolerance) {
      const {
        startEdge,
        endEdge,
        direction
      } = axis;
      const groupByNumber = isNumber(slidesToScroll);
      function byNumber(array, groupSize) {
        return arrayKeys(array).filter(i => i % groupSize === 0).map(i => array.slice(i, i + groupSize));
      }
      function bySize(array) {
        if (!array.length) return [];
        return arrayKeys(array).reduce((groups, rectB, index) => {
          const rectA = arrayLast(groups) || 0;
          const isFirst = rectA === 0;
          const isLast = rectB === arrayLastIndex(array);
          const edgeA = containerRect[startEdge] - slideRects[rectA][startEdge];
          const edgeB = containerRect[startEdge] - slideRects[rectB][endEdge];
          const gapA = !loop && isFirst ? direction(startGap) : 0;
          const gapB = !loop && isLast ? direction(endGap) : 0;
          const chunkSize = mathAbs(edgeB - gapB - (edgeA + gapA));
          if (index && chunkSize > viewSize + pixelTolerance) groups.push(rectB);
          if (isLast) groups.push(array.length);
          return groups;
        }, []).map((currentSize, index, groups) => {
          const previousSize = Math.max(groups[index - 1] || 0);
          return array.slice(previousSize, currentSize);
        });
      }
      function groupSlides(array) {
        return groupByNumber ? byNumber(array, slidesToScroll) : bySize(array);
      }
      const self = {
        groupSlides
      };
      return self;
    }

    function Engine(root, container, slides, ownerDocument, ownerWindow, options, eventHandler) {
      // Options
      const {
        align,
        axis: scrollAxis,
        direction,
        startIndex,
        loop,
        duration,
        dragFree,
        dragThreshold,
        inViewThreshold,
        slidesToScroll: groupSlides,
        skipSnaps,
        containScroll,
        watchResize,
        watchSlides,
        watchDrag,
        watchFocus
      } = options;
      // Measurements
      const pixelTolerance = 2;
      const nodeRects = NodeRects();
      const containerRect = nodeRects.measure(container);
      const slideRects = slides.map(nodeRects.measure);
      const axis = Axis(scrollAxis, direction);
      const viewSize = axis.measureSize(containerRect);
      const percentOfView = PercentOfView(viewSize);
      const alignment = Alignment(align, viewSize);
      const containSnaps = !loop && !!containScroll;
      const readEdgeGap = loop || !!containScroll;
      const {
        slideSizes,
        slideSizesWithGaps,
        startGap,
        endGap
      } = SlideSizes(axis, containerRect, slideRects, slides, readEdgeGap, ownerWindow);
      const slidesToScroll = SlidesToScroll(axis, viewSize, groupSlides, loop, containerRect, slideRects, startGap, endGap, pixelTolerance);
      const {
        snaps,
        snapsAligned
      } = ScrollSnaps(axis, alignment, containerRect, slideRects, slidesToScroll);
      const contentSize = -arrayLast(snaps) + arrayLast(slideSizesWithGaps);
      const {
        snapsContained,
        scrollContainLimit
      } = ScrollContain(viewSize, contentSize, snapsAligned, containScroll, pixelTolerance);
      const scrollSnaps = containSnaps ? snapsContained : snapsAligned;
      const {
        limit
      } = ScrollLimit(contentSize, scrollSnaps, loop);
      // Indexes
      const index = Counter(arrayLastIndex(scrollSnaps), startIndex, loop);
      const indexPrevious = index.clone();
      const slideIndexes = arrayKeys(slides);
      // Animation
      const update = ({
        dragHandler,
        scrollBody,
        scrollBounds,
        options: {
          loop
        }
      }) => {
        if (!loop) scrollBounds.constrain(dragHandler.pointerDown());
        scrollBody.seek();
      };
      const render = ({
        scrollBody,
        translate,
        location,
        offsetLocation,
        previousLocation,
        scrollLooper,
        slideLooper,
        dragHandler,
        animation,
        eventHandler,
        scrollBounds,
        options: {
          loop
        }
      }, alpha) => {
        const shouldSettle = scrollBody.settled();
        const withinBounds = !scrollBounds.shouldConstrain();
        const hasSettled = loop ? shouldSettle : shouldSettle && withinBounds;
        if (hasSettled && !dragHandler.pointerDown()) {
          animation.stop();
          eventHandler.emit('settle');
        }
        if (!hasSettled) eventHandler.emit('scroll');
        const interpolatedLocation = location.get() * alpha + previousLocation.get() * (1 - alpha);
        offsetLocation.set(interpolatedLocation);
        if (loop) {
          scrollLooper.loop(scrollBody.direction());
          slideLooper.loop();
        }
        translate.to(offsetLocation.get());
      };
      const animation = Animations(ownerDocument, ownerWindow, () => update(engine), alpha => render(engine, alpha));
      // Shared
      const friction = 0.68;
      const startLocation = scrollSnaps[index.get()];
      const location = Vector1D(startLocation);
      const previousLocation = Vector1D(startLocation);
      const offsetLocation = Vector1D(startLocation);
      const target = Vector1D(startLocation);
      const scrollBody = ScrollBody(location, offsetLocation, previousLocation, target, duration, friction);
      const scrollTarget = ScrollTarget(loop, scrollSnaps, contentSize, limit, target);
      const scrollTo = ScrollTo(animation, index, indexPrevious, scrollBody, scrollTarget, target, eventHandler);
      const scrollProgress = ScrollProgress(limit);
      const eventStore = EventStore();
      const slidesInView = SlidesInView(container, slides, eventHandler, inViewThreshold);
      const {
        slideRegistry
      } = SlideRegistry(containSnaps, containScroll, scrollSnaps, scrollContainLimit, slidesToScroll, slideIndexes);
      const slideFocus = SlideFocus(root, slides, slideRegistry, scrollTo, scrollBody, eventStore, eventHandler, watchFocus);
      // Engine
      const engine = {
        ownerDocument,
        ownerWindow,
        eventHandler,
        containerRect,
        slideRects,
        animation,
        axis,
        dragHandler: DragHandler(axis, root, ownerDocument, ownerWindow, target, DragTracker(axis, ownerWindow), location, animation, scrollTo, scrollBody, scrollTarget, index, eventHandler, percentOfView, dragFree, dragThreshold, skipSnaps, friction, watchDrag),
        eventStore,
        percentOfView,
        index,
        indexPrevious,
        limit,
        location,
        offsetLocation,
        previousLocation,
        options,
        resizeHandler: ResizeHandler(container, eventHandler, ownerWindow, slides, axis, watchResize, nodeRects),
        scrollBody,
        scrollBounds: ScrollBounds(limit, offsetLocation, target, scrollBody, percentOfView),
        scrollLooper: ScrollLooper(contentSize, limit, offsetLocation, [location, offsetLocation, previousLocation, target]),
        scrollProgress,
        scrollSnapList: scrollSnaps.map(scrollProgress.get),
        scrollSnaps,
        scrollTarget,
        scrollTo,
        slideLooper: SlideLooper(axis, viewSize, contentSize, slideSizes, slideSizesWithGaps, snaps, scrollSnaps, offsetLocation, slides),
        slideFocus,
        slidesHandler: SlidesHandler(container, eventHandler, watchSlides),
        slidesInView,
        slideIndexes,
        slideRegistry,
        slidesToScroll,
        target,
        translate: Translate(axis, container)
      };
      return engine;
    }

    function EventHandler() {
      let listeners = {};
      let api;
      function init(emblaApi) {
        api = emblaApi;
      }
      function getListeners(evt) {
        return listeners[evt] || [];
      }
      function emit(evt) {
        getListeners(evt).forEach(e => e(api, evt));
        return self;
      }
      function on(evt, cb) {
        listeners[evt] = getListeners(evt).concat([cb]);
        return self;
      }
      function off(evt, cb) {
        listeners[evt] = getListeners(evt).filter(e => e !== cb);
        return self;
      }
      function clear() {
        listeners = {};
      }
      const self = {
        init,
        emit,
        off,
        on,
        clear
      };
      return self;
    }

    const defaultOptions$1 = {
      align: 'center',
      axis: 'x',
      container: null,
      slides: null,
      containScroll: 'trimSnaps',
      direction: 'ltr',
      slidesToScroll: 1,
      inViewThreshold: 0,
      breakpoints: {},
      dragFree: false,
      dragThreshold: 10,
      loop: false,
      skipSnaps: false,
      duration: 25,
      startIndex: 0,
      active: true,
      watchDrag: true,
      watchResize: true,
      watchSlides: true,
      watchFocus: true
    };

    function OptionsHandler(ownerWindow) {
      function mergeOptions(optionsA, optionsB) {
        return objectsMergeDeep(optionsA, optionsB || {});
      }
      function optionsAtMedia(options) {
        const optionsAtMedia = options.breakpoints || {};
        const matchedMediaOptions = objectKeys(optionsAtMedia).filter(media => ownerWindow.matchMedia(media).matches).map(media => optionsAtMedia[media]).reduce((a, mediaOption) => mergeOptions(a, mediaOption), {});
        return mergeOptions(options, matchedMediaOptions);
      }
      function optionsMediaQueries(optionsList) {
        return optionsList.map(options => objectKeys(options.breakpoints || {})).reduce((acc, mediaQueries) => acc.concat(mediaQueries), []).map(ownerWindow.matchMedia);
      }
      const self = {
        mergeOptions,
        optionsAtMedia,
        optionsMediaQueries
      };
      return self;
    }

    function PluginsHandler(optionsHandler) {
      let activePlugins = [];
      function init(emblaApi, plugins) {
        activePlugins = plugins.filter(({
          options
        }) => optionsHandler.optionsAtMedia(options).active !== false);
        activePlugins.forEach(plugin => plugin.init(emblaApi, optionsHandler));
        return plugins.reduce((map, plugin) => Object.assign(map, {
          [plugin.name]: plugin
        }), {});
      }
      function destroy() {
        activePlugins = activePlugins.filter(plugin => plugin.destroy());
      }
      const self = {
        init,
        destroy
      };
      return self;
    }

    function EmblaCarousel(root, userOptions, userPlugins) {
      const ownerDocument = root.ownerDocument;
      const ownerWindow = ownerDocument.defaultView;
      const optionsHandler = OptionsHandler(ownerWindow);
      const pluginsHandler = PluginsHandler(optionsHandler);
      const mediaHandlers = EventStore();
      const eventHandler = EventHandler();
      const {
        mergeOptions,
        optionsAtMedia,
        optionsMediaQueries
      } = optionsHandler;
      const {
        on,
        off,
        emit
      } = eventHandler;
      const reInit = reActivate;
      let destroyed = false;
      let engine;
      let optionsBase = mergeOptions(defaultOptions$1, EmblaCarousel.globalOptions);
      let options = mergeOptions(optionsBase);
      let pluginList = [];
      let pluginApis;
      let container;
      let slides;
      function storeElements() {
        const {
          container: userContainer,
          slides: userSlides
        } = options;
        const customContainer = isString(userContainer) ? root.querySelector(userContainer) : userContainer;
        container = customContainer || root.children[0];
        const customSlides = isString(userSlides) ? container.querySelectorAll(userSlides) : userSlides;
        slides = [].slice.call(customSlides || container.children);
      }
      function createEngine(options) {
        const engine = Engine(root, container, slides, ownerDocument, ownerWindow, options, eventHandler);
        if (options.loop && !engine.slideLooper.canLoop()) {
          const optionsWithoutLoop = Object.assign({}, options, {
            loop: false
          });
          return createEngine(optionsWithoutLoop);
        }
        return engine;
      }
      function activate(withOptions, withPlugins) {
        if (destroyed) return;
        optionsBase = mergeOptions(optionsBase, withOptions);
        options = optionsAtMedia(optionsBase);
        pluginList = withPlugins || pluginList;
        storeElements();
        engine = createEngine(options);
        optionsMediaQueries([optionsBase, ...pluginList.map(({
          options
        }) => options)]).forEach(query => mediaHandlers.add(query, 'change', reActivate));
        if (!options.active) return;
        engine.translate.to(engine.location.get());
        engine.animation.init();
        engine.slidesInView.init();
        engine.slideFocus.init(self);
        engine.eventHandler.init(self);
        engine.resizeHandler.init(self);
        engine.slidesHandler.init(self);
        if (engine.options.loop) engine.slideLooper.loop();
        if (container.offsetParent && slides.length) engine.dragHandler.init(self);
        pluginApis = pluginsHandler.init(self, pluginList);
      }
      function reActivate(withOptions, withPlugins) {
        const startIndex = selectedScrollSnap();
        deActivate();
        activate(mergeOptions({
          startIndex
        }, withOptions), withPlugins);
        eventHandler.emit('reInit');
      }
      function deActivate() {
        engine.dragHandler.destroy();
        engine.eventStore.clear();
        engine.translate.clear();
        engine.slideLooper.clear();
        engine.resizeHandler.destroy();
        engine.slidesHandler.destroy();
        engine.slidesInView.destroy();
        engine.animation.destroy();
        pluginsHandler.destroy();
        mediaHandlers.clear();
      }
      function destroy() {
        if (destroyed) return;
        destroyed = true;
        mediaHandlers.clear();
        deActivate();
        eventHandler.emit('destroy');
        eventHandler.clear();
      }
      function scrollTo(index, jump, direction) {
        if (!options.active || destroyed) return;
        engine.scrollBody.useBaseFriction().useDuration(jump === true ? 0 : options.duration);
        engine.scrollTo.index(index, direction || 0);
      }
      function scrollNext(jump) {
        const next = engine.index.add(1).get();
        scrollTo(next, jump, -1);
      }
      function scrollPrev(jump) {
        const prev = engine.index.add(-1).get();
        scrollTo(prev, jump, 1);
      }
      function canScrollNext() {
        const next = engine.index.add(1).get();
        return next !== selectedScrollSnap();
      }
      function canScrollPrev() {
        const prev = engine.index.add(-1).get();
        return prev !== selectedScrollSnap();
      }
      function scrollSnapList() {
        return engine.scrollSnapList;
      }
      function scrollProgress() {
        return engine.scrollProgress.get(engine.location.get());
      }
      function selectedScrollSnap() {
        return engine.index.get();
      }
      function previousScrollSnap() {
        return engine.indexPrevious.get();
      }
      function slidesInView() {
        return engine.slidesInView.get();
      }
      function slidesNotInView() {
        return engine.slidesInView.get(false);
      }
      function plugins() {
        return pluginApis;
      }
      function internalEngine() {
        return engine;
      }
      function rootNode() {
        return root;
      }
      function containerNode() {
        return container;
      }
      function slideNodes() {
        return slides;
      }
      const self = {
        canScrollNext,
        canScrollPrev,
        containerNode,
        internalEngine,
        destroy,
        off,
        on,
        emit,
        plugins,
        previousScrollSnap,
        reInit,
        rootNode,
        scrollNext,
        scrollPrev,
        scrollProgress,
        scrollSnapList,
        scrollTo,
        selectedScrollSnap,
        slideNodes,
        slidesInView,
        slidesNotInView
      };
      activate(userOptions, userPlugins);
      setTimeout(() => eventHandler.emit('init'), 0);
      return self;
    }
    EmblaCarousel.globalOptions = undefined;

    const defaultOptions = {
      active: true,
      breakpoints: {},
      delay: 4000,
      jump: false,
      playOnInit: true,
      stopOnFocusIn: true,
      stopOnInteraction: true,
      stopOnMouseEnter: false,
      stopOnLastSnap: false,
      rootNode: null
    };

    function normalizeDelay(emblaApi, delay) {
      const scrollSnaps = emblaApi.scrollSnapList();
      if (typeof delay === 'number') {
        return scrollSnaps.map(() => delay);
      }
      return delay(scrollSnaps, emblaApi);
    }
    function getAutoplayRootNode(emblaApi, rootNode) {
      const emblaRootNode = emblaApi.rootNode();
      return rootNode && rootNode(emblaRootNode) || emblaRootNode;
    }

    function Autoplay(userOptions = {}) {
      let options;
      let emblaApi;
      let destroyed;
      let delay;
      let timerStartTime = null;
      let timerId = 0;
      let autoplayActive = false;
      let mouseIsOver = false;
      let playOnDocumentVisible = false;
      let jump = false;
      function init(emblaApiInstance, optionsHandler) {
        emblaApi = emblaApiInstance;
        const {
          mergeOptions,
          optionsAtMedia
        } = optionsHandler;
        const optionsBase = mergeOptions(defaultOptions, Autoplay.globalOptions);
        const allOptions = mergeOptions(optionsBase, userOptions);
        options = optionsAtMedia(allOptions);
        if (emblaApi.scrollSnapList().length <= 1) return;
        jump = options.jump;
        destroyed = false;
        delay = normalizeDelay(emblaApi, options.delay);
        const {
          eventStore,
          ownerDocument
        } = emblaApi.internalEngine();
        const isDraggable = !!emblaApi.internalEngine().options.watchDrag;
        const root = getAutoplayRootNode(emblaApi, options.rootNode);
        eventStore.add(ownerDocument, 'visibilitychange', visibilityChange);
        if (isDraggable) {
          emblaApi.on('pointerDown', pointerDown);
        }
        if (isDraggable && !options.stopOnInteraction) {
          emblaApi.on('pointerUp', pointerUp);
        }
        if (options.stopOnMouseEnter) {
          eventStore.add(root, 'mouseenter', mouseEnter);
        }
        if (options.stopOnMouseEnter && !options.stopOnInteraction) {
          eventStore.add(root, 'mouseleave', mouseLeave);
        }
        if (options.stopOnFocusIn) {
          emblaApi.on('slideFocusStart', stopAutoplay);
        }
        if (options.stopOnFocusIn && !options.stopOnInteraction) {
          eventStore.add(emblaApi.containerNode(), 'focusout', startAutoplay);
        }
        if (options.playOnInit) startAutoplay();
      }
      function destroy() {
        emblaApi.off('pointerDown', pointerDown).off('pointerUp', pointerUp).off('slideFocusStart', stopAutoplay);
        stopAutoplay();
        destroyed = true;
        autoplayActive = false;
      }
      function setTimer() {
        const {
          ownerWindow
        } = emblaApi.internalEngine();
        ownerWindow.clearTimeout(timerId);
        timerId = ownerWindow.setTimeout(next, delay[emblaApi.selectedScrollSnap()]);
        timerStartTime = new Date().getTime();
        emblaApi.emit('autoplay:timerset');
      }
      function clearTimer() {
        const {
          ownerWindow
        } = emblaApi.internalEngine();
        ownerWindow.clearTimeout(timerId);
        timerId = 0;
        timerStartTime = null;
        emblaApi.emit('autoplay:timerstopped');
      }
      function startAutoplay() {
        if (destroyed) return;
        if (documentIsHidden()) {
          playOnDocumentVisible = true;
          return;
        }
        if (!autoplayActive) emblaApi.emit('autoplay:play');
        setTimer();
        autoplayActive = true;
      }
      function stopAutoplay() {
        if (destroyed) return;
        if (autoplayActive) emblaApi.emit('autoplay:stop');
        clearTimer();
        autoplayActive = false;
      }
      function visibilityChange() {
        if (documentIsHidden()) {
          playOnDocumentVisible = autoplayActive;
          return stopAutoplay();
        }
        if (playOnDocumentVisible) startAutoplay();
      }
      function documentIsHidden() {
        const {
          ownerDocument
        } = emblaApi.internalEngine();
        return ownerDocument.visibilityState === 'hidden';
      }
      function pointerDown() {
        if (!mouseIsOver) stopAutoplay();
      }
      function pointerUp() {
        if (!mouseIsOver) startAutoplay();
      }
      function mouseEnter() {
        mouseIsOver = true;
        stopAutoplay();
      }
      function mouseLeave() {
        mouseIsOver = false;
        startAutoplay();
      }
      function play(jumpOverride) {
        if (typeof jumpOverride !== 'undefined') jump = jumpOverride;
        startAutoplay();
      }
      function stop() {
        if (autoplayActive) stopAutoplay();
      }
      function reset() {
        if (autoplayActive) startAutoplay();
      }
      function isPlaying() {
        return autoplayActive;
      }
      function next() {
        const {
          index
        } = emblaApi.internalEngine();
        const nextIndex = index.clone().add(1).get();
        const lastIndex = emblaApi.scrollSnapList().length - 1;
        const kill = options.stopOnLastSnap && nextIndex === lastIndex;
        if (emblaApi.canScrollNext()) {
          emblaApi.scrollNext(jump);
        } else {
          emblaApi.scrollTo(0, jump);
        }
        emblaApi.emit('autoplay:select');
        if (kill) return stopAutoplay();
        startAutoplay();
      }
      function timeUntilNext() {
        if (!timerStartTime) return null;
        const currentDelay = delay[emblaApi.selectedScrollSnap()];
        const timePastSinceStart = new Date().getTime() - timerStartTime;
        return currentDelay - timePastSinceStart;
      }
      const self = {
        name: 'autoplay',
        options: userOptions,
        init,
        destroy,
        play,
        stop,
        reset,
        isPlaying,
        timeUntilNext
      };
      return self;
    }
    Autoplay.globalOptions = undefined;

    const ROOT_SELECTOR = '[data-slot="carousel"], [ng-carousel]';
    const ITEM_SELECTOR = '[data-slot="carousel-item"], [ng-carousel-item]';
    const DOT_SELECTOR = '[data-slot="carousel-dot"], [ng-carousel-dot]';
    const PREVIOUS_SELECTOR = '[data-slot="carousel-previous"], [ng-carousel-previous]';
    const NEXT_SELECTOR = '[data-slot="carousel-next"], [ng-carousel-next]';
    const setAttributeIfChanged$e = (element, name, value) => {
        if (element.getAttribute(name) !== value) {
            element.setAttribute(name, value);
        }
    };
    const hasEnabledAttribute = (element, name) => {
        const value = element.getAttribute(name);
        return value !== null && value !== "false";
    };
    const parsePositiveInteger = (element, name) => {
        const value = Number.parseInt(element.getAttribute(name) ?? "", 10);
        return Number.isFinite(value) && value > 0 ? value : undefined;
    };
    function carouselDirective() {
        return {
            link(scope, element) {
                const viewport = query(element, '[data-slot="carousel-content"], [ng-carousel-content]', HTMLElement);
                const track = query(element, '[data-slot="carousel-track"], [ng-carousel-track]', HTMLElement);
                if (!viewport || track?.parentElement !== viewport)
                    return;
                const belongsToThisCarousel = (candidate) => candidate.closest(ROOT_SELECTOR) === element;
                const getItems = () => queryAll(track, ITEM_SELECTOR).filter(belongsToThisCarousel);
                const getDots = () => queryAll(element, DOT_SELECTOR).filter(belongsToThisCarousel);
                const getOrientation = () => element.getAttribute("orientation") === "vertical" ||
                    element.getAttribute("data-orientation") === "vertical"
                    ? "vertical"
                    : "horizontal";
                const getDirection = () => {
                    const direction = element.getAttribute("dir") ??
                        element.closest("[dir]")?.getAttribute("dir");
                    return direction === "rtl" ? "rtl" : "ltr";
                };
                const getOptions = () => {
                    const align = element.getAttribute("align");
                    const containScroll = element.getAttribute("contain-scroll");
                    return {
                        align: align === "start" || align === "center" || align === "end"
                            ? align
                            : "center",
                        axis: getOrientation() === "vertical" ? "y" : "x",
                        containScroll: containScroll === "false"
                            ? false
                            : containScroll === "keepSnaps"
                                ? "keepSnaps"
                                : "trimSnaps",
                        direction: getDirection(),
                        dragFree: hasEnabledAttribute(element, "drag-free"),
                        loop: hasEnabledAttribute(element, "loop"),
                        skipSnaps: hasEnabledAttribute(element, "skip-snaps"),
                        slidesToScroll: parsePositiveInteger(element, "slides-to-scroll") ?? 1,
                        startIndex: Math.max(0, getItems().findIndex((item) => item.getAttribute("data-active") === "true")),
                        watchDrag: element.getAttribute("draggable") !== "false",
                    };
                };
                const getPlugins = () => {
                    if (!hasEnabledAttribute(element, "autoplay"))
                        return [];
                    return [
                        Autoplay({
                            delay: parsePositiveInteger(element, "autoplay-delay") ?? 2000,
                            stopOnFocusIn: true,
                            stopOnInteraction: true,
                            stopOnMouseEnter: true,
                        }),
                    ];
                };
                const api = EmblaCarousel(viewport, getOptions(), getPlugins());
                let destroyed = false;
                let reinitializeQueued = false;
                const directionOwner = element.closest("[dir]") ?? element;
                const syncStaticSemantics = () => {
                    const items = getItems();
                    const dots = getDots();
                    setAttributeIfChanged$e(element, "role", element.getAttribute("role") ?? "region");
                    setAttributeIfChanged$e(element, "aria-roledescription", "carousel");
                    setAttributeIfChanged$e(element, "tabindex", element.getAttribute("tabindex") ?? "0");
                    setAttributeIfChanged$e(element, "data-orientation", getOrientation());
                    setAttributeIfChanged$e(element, "data-direction", getDirection());
                    setAttributeIfChanged$e(element, "data-item-count", String(items.length));
                    items.forEach((item, index) => {
                        setAttributeIfChanged$e(item, "role", item.getAttribute("role") ?? "group");
                        setAttributeIfChanged$e(item, "aria-roledescription", "slide");
                        setAttributeIfChanged$e(item, "aria-label", item.getAttribute("aria-label") ??
                            `${String(index + 1)} of ${String(items.length)}`);
                        setAttributeIfChanged$e(item, "data-index", String(index));
                    });
                    dots.forEach((dot, index) => {
                        setAttributeIfChanged$e(dot, "aria-label", dot.getAttribute("aria-label") ??
                            `Go to slide ${String(index + 1)}`);
                        setAttributeIfChanged$e(dot, "data-index", String(index));
                    });
                };
                const getSelectedItemIndex = () => {
                    const selectedSnap = api.selectedScrollSnap();
                    return api.internalEngine().slideRegistry[selectedSnap]?.[0] ?? 0;
                };
                const createDetail = () => {
                    const items = getItems();
                    const itemIndex = Math.min(getSelectedItemIndex(), items.length - 1);
                    return {
                        api,
                        count: api.scrollSnapList().length,
                        index: api.selectedScrollSnap(),
                        item: items[itemIndex] || null,
                        itemCount: items.length,
                        itemIndex,
                    };
                };
                const syncSelectedState = () => {
                    const detail = createDetail();
                    const itemsInView = new Set(api.slidesInView());
                    const dots = getDots();
                    setAttributeIfChanged$e(element, "data-index", String(detail.index));
                    setAttributeIfChanged$e(element, "data-count", String(detail.count));
                    setAttributeIfChanged$e(element, "data-can-scroll-previous", String(api.canScrollPrev()));
                    setAttributeIfChanged$e(element, "data-can-scroll-next", String(api.canScrollNext()));
                    getItems().forEach((item, index) => {
                        setAttributeIfChanged$e(item, "data-active", String(index === detail.itemIndex));
                        setAttributeIfChanged$e(item, "aria-hidden", String(!itemsInView.has(index)));
                    });
                    dots.forEach((dot, index) => {
                        const active = index === detail.index;
                        setAttributeIfChanged$e(dot, "data-active", String(active));
                        setAttributeIfChanged$e(dot, "aria-current", active ? "true" : "false");
                        dot.toggleAttribute("hidden", index >= detail.count);
                    });
                    const previous = query(element, PREVIOUS_SELECTOR, HTMLElement);
                    const next = query(element, NEXT_SELECTOR, HTMLElement);
                    if (previous && belongsToThisCarousel(previous)) {
                        previous.setAttribute("aria-disabled", String(!api.canScrollPrev()));
                        previous.toggleAttribute("disabled", !api.canScrollPrev());
                    }
                    if (next && belongsToThisCarousel(next)) {
                        next.setAttribute("aria-disabled", String(!api.canScrollNext()));
                        next.toggleAttribute("disabled", !api.canScrollNext());
                    }
                };
                const dispatchState = (name) => {
                    element.dispatchEvent(new CustomEvent(name, {
                        bubbles: true,
                        detail: createDetail(),
                    }));
                };
                const handleSelect = () => {
                    syncSelectedState();
                    dispatchState("angularcss:carousel-change");
                };
                const handleReInit = () => {
                    syncStaticSemantics();
                    syncSelectedState();
                };
                const handleClick = (event) => {
                    const target = event.target;
                    if (!(target instanceof Element))
                        return;
                    const control = target.closest(`${PREVIOUS_SELECTOR}, ${NEXT_SELECTOR}, ${DOT_SELECTOR}`);
                    if (!control || !belongsToThisCarousel(control))
                        return;
                    if (control.matches(PREVIOUS_SELECTOR)) {
                        api.scrollPrev();
                    }
                    else if (control.matches(NEXT_SELECTOR)) {
                        api.scrollNext();
                    }
                    else {
                        const index = Number.parseInt(control.getAttribute("data-index") ?? "", 10);
                        if (Number.isFinite(index))
                            api.scrollTo(index);
                    }
                };
                const handleKeydown = (event) => {
                    const vertical = getOrientation() === "vertical";
                    const nextKey = vertical ? "ArrowDown" : "ArrowRight";
                    const previousKey = vertical ? "ArrowUp" : "ArrowLeft";
                    if (event.key !== nextKey && event.key !== previousKey)
                        return;
                    event.preventDefault();
                    if (event.key === nextKey)
                        api.scrollNext();
                    else
                        api.scrollPrev();
                };
                const queueReinitialize = () => {
                    if (reinitializeQueued || destroyed)
                        return;
                    reinitializeQueued = true;
                    queueMicrotask(() => {
                        reinitializeQueued = false;
                        if (destroyed)
                            return;
                        api.reInit(getOptions(), getPlugins());
                    });
                };
                api.on("select", handleSelect);
                api.on("reInit", handleReInit);
                api.on("slidesInView", syncSelectedState);
                element.addEventListener("click", handleClick);
                element.addEventListener("keydown", handleKeydown);
                const carouselObserver = new MutationObserver(queueReinitialize);
                carouselObserver.observe(element, {
                    attributes: true,
                    attributeFilter: [
                        "align",
                        "autoplay",
                        "autoplay-delay",
                        "contain-scroll",
                        "data-orientation",
                        "dir",
                        "drag-free",
                        "draggable",
                        "loop",
                        "orientation",
                        "skip-snaps",
                        "slides-to-scroll",
                    ],
                    childList: true,
                    subtree: true,
                });
                const directionObserver = directionOwner === element
                    ? null
                    : new MutationObserver(queueReinitialize);
                directionObserver?.observe(directionOwner, {
                    attributes: true,
                    attributeFilter: ["dir"],
                });
                syncStaticSemantics();
                syncSelectedState();
                requestAnimationFrame(() => {
                    if (!destroyed)
                        dispatchState("angularcss:carousel-ready");
                });
                onDestroy(scope, () => {
                    destroyed = true;
                    carouselObserver.disconnect();
                    directionObserver?.disconnect();
                    element.removeEventListener("click", handleClick);
                    element.removeEventListener("keydown", handleKeydown);
                    api.destroy();
                });
            },
        };
    }

    function cardDirective() {
        return {
            link(_scope, element) {
                const size = element.getAttribute("size") === "sm" ? "sm" : "default";
                element.setAttribute("data-size", size);
                element.setAttribute("data-has-header", String(Boolean(query(element, '[data-slot="card-header"], [ng-card-header]'))));
                element.setAttribute("data-has-content", String(Boolean(query(element, '[data-slot="card-content"], [ng-card-content]'))));
                element.setAttribute("data-has-footer", String(Boolean(query(element, '[data-slot="card-footer"], [ng-card-footer]'))));
                element.setAttribute("data-has-action", String(Boolean(query(element, '[data-slot="card-action"], [ng-card-action]'))));
            },
        };
    }

    const valueSelector$2 = '[data-slot="chart-bar"], [ng-chart-bar]';
    const colorSelector = '[data-slot="chart-bar"], [ng-chart-bar], [data-slot="chart-swatch"], [ng-chart-swatch], [data-slot="chart-tooltip-indicator"], [ng-chart-tooltip-indicator]';
    const semanticSlots = {
        axis: '[data-slot="chart-axis"], [ng-chart-axis]',
        axisItem: '[data-slot="chart-axis-item"], [ng-chart-axis-item]',
        grid: '[data-slot="chart-grid"], [ng-chart-grid]',
        legend: '[data-slot="chart-legend"], [ng-chart-legend]',
        legendItem: '[data-slot="chart-legend-item"], [ng-chart-legend-item]',
        tooltip: '[data-slot="chart-tooltip"], [ng-chart-tooltip]',
        tooltipIndicator: '[data-slot="chart-tooltip-indicator"], [ng-chart-tooltip-indicator]',
        tooltipItem: '[data-slot="chart-tooltip-item"], [ng-chart-tooltip-item]',
        tooltipItems: '[data-slot="chart-tooltip-items"], [ng-chart-tooltip-items]',
    };
    const syncValue = (element) => {
        const value = element.getAttribute("data-value");
        if (value)
            element.style.setProperty("--value", value);
        else
            element.style.removeProperty("--value");
    };
    const syncColor = (element) => {
        const color = element.getAttribute("data-color");
        if (color)
            element.style.setProperty("--chart-color", color);
        else
            element.style.removeProperty("--chart-color");
    };
    const syncDirection = (element) => {
        const direction = element.closest("[dir]")?.getAttribute("dir") === "rtl"
            ? "rtl"
            : "ltr";
        if (element.getAttribute("data-direction") !== direction) {
            element.setAttribute("data-direction", direction);
        }
    };
    const syncChartSemantics = (element) => {
        if (!element.getAttribute("role"))
            element.setAttribute("role", "img");
        if (!element.getAttribute("aria-label")) {
            element.setAttribute("aria-label", "Chart");
        }
    };
    const barLabel = (element) => {
        const label = element.getAttribute("data-label");
        const value = element.getAttribute("data-value");
        if (label && value)
            return `${label}: ${value}`;
        return label ?? value;
    };
    const syncBarSemantics = (element, generatedLabels) => {
        if (!element.getAttribute("role"))
            element.setAttribute("role", "img");
        const current = element.getAttribute("aria-label");
        const previousGenerated = generatedLabels.get(element);
        if (current && current !== previousGenerated) {
            generatedLabels.delete(element);
            return;
        }
        const next = barLabel(element);
        if (next) {
            if (current !== next)
                element.setAttribute("aria-label", next);
            generatedLabels.set(element, next);
        }
        else if (previousGenerated && current === previousGenerated) {
            element.removeAttribute("aria-label");
            generatedLabels.delete(element);
        }
    };
    function chartDirective() {
        return {
            link(scope, element) {
                const directionOwner = element.closest("[dir]") ?? element;
                const generatedLabels = new WeakMap();
                const sync = () => {
                    syncChartSemantics(element);
                    syncDirection(element);
                    queryAll(element, valueSelector$2).forEach(syncValue);
                    queryAll(element, colorSelector).forEach(syncColor);
                    queryAll(element, valueSelector$2).forEach((bar) => {
                        syncBarSemantics(bar, generatedLabels);
                    });
                    queryAll(element, semanticSlots.axis).forEach((axis) => {
                        if (!axis.hasAttribute("role"))
                            axis.setAttribute("role", "list");
                    });
                    queryAll(element, semanticSlots.axisItem).forEach((item) => {
                        if (!item.hasAttribute("role"))
                            item.setAttribute("role", "listitem");
                    });
                    queryAll(element, semanticSlots.grid).forEach((grid) => {
                        if (!grid.hasAttribute("aria-hidden")) {
                            grid.setAttribute("aria-hidden", "true");
                        }
                    });
                    queryAll(element, semanticSlots.legend).forEach((legend) => {
                        if (!legend.hasAttribute("role"))
                            legend.setAttribute("role", "list");
                    });
                    queryAll(element, semanticSlots.legendItem).forEach((item) => {
                        if (!item.hasAttribute("role"))
                            item.setAttribute("role", "listitem");
                    });
                    queryAll(element, semanticSlots.tooltip).forEach((tooltip) => {
                        if (!tooltip.hasAttribute("role"))
                            tooltip.setAttribute("role", "status");
                        const visible = !tooltip.hidden;
                        tooltip.setAttribute("aria-hidden", String(!visible));
                        tooltip.setAttribute("data-visible", String(visible));
                    });
                    queryAll(element, semanticSlots.tooltipItems).forEach((items) => {
                        if (!items.hasAttribute("role"))
                            items.setAttribute("role", "list");
                    });
                    queryAll(element, semanticSlots.tooltipItem).forEach((item) => {
                        if (!item.hasAttribute("role"))
                            item.setAttribute("role", "listitem");
                    });
                    queryAll(element, semanticSlots.tooltipIndicator).forEach((indicator) => {
                        if (!indicator.hasAttribute("aria-hidden")) {
                            indicator.setAttribute("aria-hidden", "true");
                        }
                    });
                };
                const observer = new MutationObserver(sync);
                observer.observe(element, {
                    attributes: true,
                    attributeFilter: [
                        "aria-label",
                        "data-color",
                        "data-label",
                        "data-value",
                        "dir",
                        "hidden",
                        "role",
                    ],
                    childList: true,
                    subtree: true,
                });
                const directionObserver = directionOwner === element ? null : new MutationObserver(sync);
                directionObserver?.observe(directionOwner, {
                    attributes: true,
                    attributeFilter: ["dir"],
                });
                sync();
                onDestroy(scope, () => {
                    observer.disconnect();
                    directionObserver?.disconnect();
                });
            },
        };
    }

    function syncNativeControlState(element) {
        element.setAttribute("data-disabled", String(element.disabled));
        element.setAttribute("data-required", String(element.required));
        if (element.disabled)
            element.setAttribute("aria-disabled", "true");
        else
            element.removeAttribute("aria-disabled");
        if (element.required)
            element.setAttribute("aria-required", "true");
        else
            element.removeAttribute("aria-required");
    }

    function checkboxDirective() {
        return {
            link(scope, element) {
                if (!(element instanceof HTMLInputElement))
                    return;
                const sync = () => {
                    const checked = element.checked;
                    const state = element.indeterminate
                        ? "indeterminate"
                        : checked
                            ? "checked"
                            : "unchecked";
                    syncNativeControlState(element);
                    element.setAttribute("data-state", state);
                    element.setAttribute("aria-checked", element.indeterminate ? "mixed" : String(checked));
                    element.setAttribute("data-invalid", String(element.getAttribute("aria-invalid") === "true" ||
                        element.matches(":invalid")));
                };
                const observer = new MutationObserver(sync);
                observer.observe(element, {
                    attributes: true,
                    attributeFilter: [
                        "aria-invalid",
                        "checked",
                        "disabled",
                        "required",
                        "value",
                    ],
                });
                element.addEventListener("input", sync);
                element.addEventListener("change", sync);
                sync();
                onDestroy(scope, () => {
                    observer.disconnect();
                    element.removeEventListener("input", sync);
                    element.removeEventListener("change", sync);
                });
            },
        };
    }

    let collapsibleIdCounter = 0;
    function collapsibleDirective() {
        return {
            link(scope, element) {
                const trigger = query(element, '[data-slot="collapsible-trigger"], [ng-collapsible-trigger], button', HTMLElement);
                const content = query(element, '[data-slot="collapsible-content"], [ng-collapsible-content]', HTMLElement);
                if (!trigger || !content)
                    return;
                const contentId = content.id || `collapsible-content-${String(collapsibleIdCounter++)}`;
                const triggerId = trigger.id || `collapsible-trigger-${String(collapsibleIdCounter++)}`;
                content.id = contentId;
                trigger.id = triggerId;
                trigger.setAttribute("aria-controls", contentId);
                if (!content.hasAttribute("aria-labelledby")) {
                    content.setAttribute("aria-labelledby", triggerId);
                }
                const setOpen = (open) => {
                    element.setAttribute("data-state", open ? "open" : "closed");
                    if (element instanceof HTMLDetailsElement && element.open !== open) {
                        element.open = open;
                    }
                    trigger.setAttribute("aria-expanded", String(open));
                    trigger.setAttribute("data-state", open ? "open" : "closed");
                    content.setAttribute("data-state", open ? "open" : "closed");
                    setOpenState(content, open);
                };
                const readOpenState = () => {
                    const controlledOpen = element.getAttribute("data-open");
                    if (controlledOpen !== null)
                        return controlledOpen === "true";
                    return (element.getAttribute("open") === "true" ||
                        element.hasAttribute("open"));
                };
                setOpen(readOpenState());
                const observer = new MutationObserver(() => {
                    setOpen(readOpenState());
                });
                observer.observe(element, {
                    attributes: true,
                    attributeFilter: ["data-open", "open"],
                });
                const details = element instanceof HTMLDetailsElement ? element : null;
                const handleToggle = () => {
                    if (details)
                        setOpen(details.open);
                };
                const handleClick = () => {
                    if (!details)
                        setOpen(Boolean(content.hidden));
                };
                if (details) {
                    details.addEventListener("toggle", handleToggle);
                }
                else {
                    trigger.addEventListener("click", handleClick);
                }
                onDestroy(scope, () => {
                    observer.disconnect();
                    details?.removeEventListener("toggle", handleToggle);
                    if (!details)
                        trigger.removeEventListener("click", handleClick);
                });
            },
        };
    }

    let comboboxIdCounter = 0;
    const anchorSelector = '[data-slot="combobox-control"], [ng-combobox-control], [data-slot="combobox-chips"], [ng-combobox-chips]';
    const chipSelector = '[data-slot="combobox-chip"], [ng-combobox-chip]';
    const clearSelector = '[data-slot="combobox-clear"], [ng-combobox-clear]';
    const contentSelector$6 = '[data-slot="combobox-content"], [ng-combobox-content]';
    const emptySelector$1 = '[data-slot="combobox-empty"], [ng-combobox-empty]';
    const groupLabelSelector = '[data-slot="combobox-label"], [ng-combobox-label], [data-slot="combobox-group-label"], [ng-combobox-group-label]';
    const groupSelector$3 = '[data-slot="combobox-group"], [ng-combobox-group]';
    const inputSelector$1 = 'input[ng-combobox-input], input[data-slot="combobox-input"], input[ng-combobox-chip-input], input[data-slot="combobox-chip-input"], input[role="combobox"], input[data-input], input[data-slot="input"], input[ng-input-group-input]';
    const itemSelector$6 = '[data-slot="combobox-item"], [ng-combobox-item]';
    const rootSelector$3 = '[data-slot="combobox"], [ng-combobox]';
    const separatorSelector$3 = '[data-slot="combobox-separator"], [ng-combobox-separator]';
    const triggerSelector$5 = '[data-slot="combobox-trigger"], [ng-combobox-trigger]';
    const setAttributeIfChanged$d = (element, name, value) => {
        if (element.getAttribute(name) !== value)
            element.setAttribute(name, value);
    };
    function comboboxDirective() {
        return {
            link(scope, element) {
                const isOwned = (candidate) => candidate.closest(rootSelector$3) === element;
                const owned = (selector, constructor) => {
                    const candidate = queryAll(element, selector).find(isOwned);
                    return candidate instanceof constructor ? candidate : null;
                };
                const ownedAll = (selector) => queryAll(element, selector).filter(isOwned);
                const input = owned(inputSelector$1, HTMLInputElement);
                const content = owned(contentSelector$6, HTMLElement);
                if (!input || !content)
                    return;
                const directionOwner = element.closest("[dir]") ?? element;
                const contentId = content.id || `combobox-content-${String(comboboxIdCounter++)}`;
                const inputId = input.id || `combobox-input-${String(comboboxIdCounter++)}`;
                content.id = contentId;
                input.id = inputId;
                setAttributeIfChanged$d(input, "role", "combobox");
                setAttributeIfChanged$d(input, "aria-controls", contentId);
                setAttributeIfChanged$d(input, "aria-haspopup", "listbox");
                setAttributeIfChanged$d(input, "aria-autocomplete", input.getAttribute("aria-autocomplete") ?? "list");
                setAttributeIfChanged$d(content, "role", "listbox");
                if (!content.hasAttribute("aria-label")) {
                    setAttributeIfChanged$d(content, "aria-labelledby", inputId);
                }
                const ownsAriaInvalid = !input.hasAttribute("aria-invalid");
                let items = [];
                let activeItem = null;
                let open = element.getAttribute("open") === "true" ||
                    element.getAttribute("data-open") === "true";
                let openAtPointerDown = false;
                const itemCleanups = new Map();
                const controlCleanups = new Map();
                const isMultiple = () => element.hasAttribute("multiple") ||
                    element.getAttribute("data-multiple") === "true";
                const hasAutoHighlight = () => element.hasAttribute("auto-highlight") ||
                    element.getAttribute("data-auto-highlight") === "true";
                const getDirection = () => element.closest("[dir]")?.getAttribute("dir") === "rtl"
                    ? "rtl"
                    : "ltr";
                const isInvalid = () => ownsAriaInvalid
                    ? !input.validity.valid
                    : input.getAttribute("aria-invalid") === "true";
                const isVisible = (item) => !item.hidden &&
                    item.getAttribute("aria-hidden") !== "true" &&
                    !item.closest("[hidden]") &&
                    getComputedStyle(item).display !== "none";
                const visibleItems = (includeDisabled = false) => items.filter((item) => isVisible(item) && (includeDisabled || !isDisabled(item)));
                const syncChrome = () => {
                    const direction = getDirection();
                    const disabled = isDisabled(input);
                    const invalid = isInvalid();
                    const multiple = isMultiple();
                    setAttributeIfChanged$d(element, "data-direction", direction);
                    setAttributeIfChanged$d(content, "data-direction", direction);
                    setAttributeIfChanged$d(element, "data-disabled", String(disabled));
                    setAttributeIfChanged$d(input, "aria-disabled", String(disabled));
                    setAttributeIfChanged$d(element, "data-invalid", String(invalid));
                    setAttributeIfChanged$d(element, "data-multiple", String(multiple));
                    setAttributeIfChanged$d(content, "aria-multiselectable", String(multiple));
                    setAttributeIfChanged$d(content, "data-chips", String(Boolean(owned('[data-slot="combobox-chips"], [ng-combobox-chips]', HTMLElement))));
                    if (ownsAriaInvalid) {
                        setAttributeIfChanged$d(input, "aria-invalid", String(invalid));
                    }
                };
                const positionContent = () => {
                    if (!open)
                        return;
                    const externalTrigger = ownedAll(triggerSelector$5).find((trigger) => !content.contains(trigger) && !trigger.closest(anchorSelector));
                    const anchor = externalTrigger ?? owned(anchorSelector, HTMLElement) ?? input;
                    const rootBox = element.getBoundingClientRect();
                    const anchorBox = anchor.getBoundingClientRect();
                    const contentHeight = Math.min(content.scrollHeight, 288);
                    let top = anchor.offsetTop + anchorBox.height + 6;
                    const projectedBottom = rootBox.top + top + contentHeight;
                    if (projectedBottom > window.innerHeight - 4) {
                        top = anchor.offsetTop - contentHeight - 6;
                        setAttributeIfChanged$d(content, "data-side", "top");
                    }
                    else {
                        setAttributeIfChanged$d(content, "data-side", "bottom");
                    }
                    content.style.setProperty("--combobox-content-top", `${String(Math.round(top))}px`);
                    content.style.setProperty("--combobox-anchor-width", `${String(Math.round(anchorBox.width))}px`);
                };
                const notifyOpenChange = () => {
                    element.dispatchEvent(new CustomEvent("angularcss:combobox-open-change", {
                        bubbles: true,
                        detail: { open },
                    }));
                };
                const setOpen = (nextOpen, notifyApplication = false, focusInput = false) => {
                    if (nextOpen && isDisabled(input))
                        nextOpen = false;
                    open = nextOpen;
                    const state = open ? "open" : "closed";
                    setAttributeIfChanged$d(element, "data-open", String(open));
                    setAttributeIfChanged$d(element, "data-state", state);
                    setAttributeIfChanged$d(content, "data-state", state);
                    setAttributeIfChanged$d(content, "aria-hidden", String(!open));
                    setAttributeIfChanged$d(input, "aria-expanded", String(open));
                    ownedAll(triggerSelector$5).forEach((trigger) => {
                        setAttributeIfChanged$d(trigger, "data-state", state);
                        setAttributeIfChanged$d(trigger, "aria-expanded", String(open));
                    });
                    setOpenState(content, open);
                    if (open)
                        requestAnimationFrame(positionContent);
                    if (focusInput)
                        input.focus({ preventScroll: true });
                    if (notifyApplication)
                        notifyOpenChange();
                };
                const clearHighlight = () => {
                    activeItem = null;
                    items.forEach((item) => {
                        setAttributeIfChanged$d(item, "data-highlighted", "false");
                    });
                    input.removeAttribute("aria-activedescendant");
                };
                const highlight = (item) => {
                    if (!item || isDisabled(item) || !isVisible(item)) {
                        clearHighlight();
                        return;
                    }
                    activeItem = item;
                    items.forEach((candidate) => {
                        setAttributeIfChanged$d(candidate, "data-highlighted", String(candidate === item));
                    });
                    setAttributeIfChanged$d(input, "aria-activedescendant", item.id);
                    if (open)
                        item.scrollIntoView({ block: "nearest" });
                };
                const highlightBoundary = (end) => {
                    const visible = visibleItems();
                    highlight(end === "first" ? visible[0] : (visible.at(-1) ?? null));
                };
                const moveHighlight = (direction) => {
                    const visible = visibleItems();
                    if (!visible.length) {
                        clearHighlight();
                        return;
                    }
                    const current = activeItem ? visible.indexOf(activeItem) : -1;
                    const next = current < 0
                        ? direction === 1
                            ? 0
                            : visible.length - 1
                        : (current + direction + visible.length) % visible.length;
                    highlight(visible[next]);
                };
                const selectItem = (item) => {
                    if (isDisabled(item))
                        return;
                    const multiple = isMultiple();
                    const value = item.getAttribute("data-value") ?? item.textContent.trim();
                    setAttributeIfChanged$d(element, "data-value", value);
                    element.dispatchEvent(new CustomEvent("angularcss:combobox-select", {
                        bubbles: true,
                        detail: { item, multiple, value },
                    }));
                    if (!multiple)
                        setOpen(false, true);
                    input.focus({ preventScroll: true });
                };
                const bindItem = (item) => {
                    if (!item.id)
                        item.id = `combobox-item-${String(comboboxIdCounter++)}`;
                    setAttributeIfChanged$d(item, "role", "option");
                    setAttributeIfChanged$d(item, "tabindex", "-1");
                    setAttributeIfChanged$d(item, "data-disabled", String(isDisabled(item)));
                    if (!item.hasAttribute("aria-selected")) {
                        setAttributeIfChanged$d(item, "aria-selected", "false");
                    }
                    if (isDisabled(item))
                        setAttributeIfChanged$d(item, "aria-disabled", "true");
                    if (itemCleanups.has(item))
                        return;
                    const handleClick = () => {
                        selectItem(item);
                    };
                    item.addEventListener("click", handleClick);
                    itemCleanups.set(item, () => {
                        item.removeEventListener("click", handleClick);
                    });
                };
                const bindControl = (control, kind) => {
                    if (controlCleanups.has(control))
                        return;
                    if (control instanceof HTMLButtonElement &&
                        !control.hasAttribute("type")) {
                        control.type = "button";
                    }
                    if (kind === "trigger") {
                        setAttributeIfChanged$d(control, "aria-controls", contentId);
                        setAttributeIfChanged$d(control, "aria-haspopup", "listbox");
                        if (!control.hasAttribute("aria-label") &&
                            !control.textContent.trim()) {
                            setAttributeIfChanged$d(control, "aria-label", "Show options");
                        }
                        const handleClick = (event) => {
                            event.preventDefault();
                            setOpen(!open, true, true);
                        };
                        control.addEventListener("click", handleClick);
                        controlCleanups.set(control, () => {
                            control.removeEventListener("click", handleClick);
                        });
                        return;
                    }
                    setAttributeIfChanged$d(control, "aria-label", control.getAttribute("aria-label") ?? "Clear selection");
                    const handleClick = () => {
                        setAttributeIfChanged$d(element, "data-value", "");
                        element.dispatchEvent(new CustomEvent("angularcss:combobox-clear", { bubbles: true }));
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
                    items = ownedAll(itemSelector$6);
                    items.forEach(bindItem);
                    ownedAll(triggerSelector$5).forEach((control) => {
                        bindControl(control, "trigger");
                    });
                    ownedAll(clearSelector).forEach((control) => {
                        bindControl(control, "clear");
                    });
                    ownedAll(groupSelector$3).forEach((group) => {
                        setAttributeIfChanged$d(group, "role", "group");
                        const label = queryAll(group, groupLabelSelector).find((candidate) => candidate.closest(groupSelector$3) === group);
                        if (!label)
                            return;
                        if (!label.id)
                            label.id = `combobox-label-${String(comboboxIdCounter++)}`;
                        setAttributeIfChanged$d(group, "aria-labelledby", label.id);
                    });
                    ownedAll(separatorSelector$3).forEach((separator) => {
                        setAttributeIfChanged$d(separator, "role", "separator");
                        setAttributeIfChanged$d(separator, "aria-orientation", "horizontal");
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
                    setAttributeIfChanged$d(element, "data-empty", String(empty));
                    setAttributeIfChanged$d(content, "data-empty", String(empty));
                    ownedAll(emptySelector$1).forEach((emptySlot) => {
                        setAttributeIfChanged$d(emptySlot, "role", "status");
                        setAttributeIfChanged$d(emptySlot, "data-visible", String(empty));
                        if (emptySlot.hidden === empty)
                            emptySlot.hidden = !empty;
                    });
                    if (previousActive &&
                        items.includes(previousActive) &&
                        isVisible(previousActive)) {
                        highlight(previousActive);
                    }
                    else {
                        const selected = items.find((item) => isVisible(item) && item.getAttribute("aria-selected") === "true");
                        if (selected)
                            highlight(selected);
                        else if (open && hasAutoHighlight())
                            highlightBoundary("first");
                        else
                            clearHighlight();
                    }
                    if (open)
                        requestAnimationFrame(positionContent);
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
                const handleKeydown = (event) => {
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
                        if (!open)
                            setOpen(true, true);
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
                    if (event.key === "Backspace" &&
                        isMultiple() &&
                        input.value.length === 0 &&
                        ownedAll(chipSelector).length) {
                        element.dispatchEvent(new CustomEvent("angularcss:combobox-remove-last", {
                            bubbles: true,
                        }));
                    }
                };
                const handlePointerDown = () => {
                    openAtPointerDown = open;
                };
                const handleOutsideClick = (event) => {
                    if (open &&
                        openAtPointerDown &&
                        event.target instanceof Node &&
                        !element.contains(event.target)) {
                        setOpen(false, true);
                    }
                };
                const handleOutsideFocus = (event) => {
                    if (open &&
                        event.target instanceof Node &&
                        !element.contains(event.target)) {
                        setOpen(false, true);
                    }
                };
                const observer = new MutationObserver((records) => {
                    syncStructure();
                    if (records.some((record) => record.target === element &&
                        (record.attributeName === "data-open" ||
                            record.attributeName === "open"))) {
                        const authoredOpen = element.hasAttribute("open")
                            ? element.getAttribute("open") === "true"
                            : element.getAttribute("data-open") === "true";
                        if (authoredOpen !== open)
                            setOpen(authoredOpen);
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
                const directionObserver = directionOwner === element
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

    let commandIdCounter = 0;
    const emptySelector = '[data-slot="command-empty"], [ng-command-empty]';
    const groupHeadingSelector = '[data-slot="command-group-heading"], [ng-command-group-heading]';
    const groupSelector$2 = '[data-slot="command-group"], [ng-command-group]';
    const inputSelector = '[data-slot="command-input"], [ng-command-input]';
    const itemSelector$5 = '[data-slot="command-item"], [ng-command-item]';
    const listSelector$2 = '[data-slot="command-list"], [ng-command-list]';
    const rootSelector$2 = '[data-slot="command"], [ng-command]';
    const separatorSelector$2 = '[data-slot="command-separator"], [ng-command-separator]';
    const shortcutSelector = '[data-slot="command-shortcut"], [ng-command-shortcut]';
    const setAttributeIfChanged$c = (element, name, value) => {
        if (element.getAttribute(name) !== value)
            element.setAttribute(name, value);
    };
    function commandDirective() {
        return {
            link(scope, element) {
                const isOwned = (candidate) => candidate.closest(rootSelector$2) === element;
                const owned = (selector, constructor) => {
                    const candidate = queryAll(element, selector).find(isOwned);
                    return candidate instanceof constructor ? candidate : null;
                };
                const ownedAll = (selector) => queryAll(element, selector).filter(isOwned);
                const input = owned(inputSelector, HTMLInputElement);
                if (!input)
                    return;
                const directionOwner = element.closest("[dir]") ?? element;
                const itemCleanups = new Map();
                let items = [];
                let activeItem = null;
                const getDirection = () => element.closest("[dir]")?.getAttribute("dir") === "rtl"
                    ? "rtl"
                    : "ltr";
                const isVisible = (item) => {
                    const hiddenAncestor = item.parentElement?.closest("[hidden]");
                    const hiddenInsideCommand = Boolean(hiddenAncestor &&
                        hiddenAncestor !== element &&
                        element.contains(hiddenAncestor));
                    return (!item.hidden &&
                        item.getAttribute("aria-hidden") !== "true" &&
                        !hiddenInsideCommand &&
                        getComputedStyle(item).display !== "none");
                };
                const renderedItems = () => items.filter(isVisible);
                const enabledItems = () => renderedItems().filter((item) => !isDisabled(item));
                const selectItem = (item, scroll = false) => {
                    if (!item || isDisabled(item) || !isVisible(item)) {
                        activeItem = null;
                    }
                    else {
                        activeItem = item;
                    }
                    items.forEach((candidate) => {
                        const selected = candidate === activeItem;
                        setAttributeIfChanged$c(candidate, "aria-selected", String(selected));
                        setAttributeIfChanged$c(candidate, "data-selected", String(selected));
                    });
                    if (activeItem) {
                        setAttributeIfChanged$c(input, "aria-activedescendant", activeItem.id);
                        if (scroll)
                            activeItem.scrollIntoView({ block: "nearest" });
                    }
                    else {
                        input.removeAttribute("aria-activedescendant");
                    }
                };
                const move = (delta) => {
                    const enabled = enabledItems();
                    if (!enabled.length) {
                        selectItem(null);
                        return;
                    }
                    const current = activeItem ? enabled.indexOf(activeItem) : -1;
                    const next = current < 0
                        ? delta === 1
                            ? 0
                            : enabled.length - 1
                        : (current + delta + enabled.length) % enabled.length;
                    selectItem(enabled[next], true);
                };
                const bindItem = (item) => {
                    if (!item.id)
                        item.id = `command-item-${String(commandIdCounter++)}`;
                    setAttributeIfChanged$c(item, "role", "option");
                    setAttributeIfChanged$c(item, "tabindex", "-1");
                    setAttributeIfChanged$c(item, "data-disabled", String(isDisabled(item)));
                    if (isDisabled(item)) {
                        setAttributeIfChanged$c(item, "aria-disabled", "true");
                    }
                    if (itemCleanups.has(item))
                        return;
                    const handlePointerMove = () => {
                        if (!isDisabled(item))
                            selectItem(item);
                    };
                    const handleClick = () => {
                        if (!isDisabled(item))
                            selectItem(item);
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
                    items = ownedAll(itemSelector$5);
                    items.forEach(bindItem);
                    itemCleanups.forEach((cleanup, item) => {
                        if (!item.isConnected || !isOwned(item)) {
                            cleanup();
                            itemCleanups.delete(item);
                        }
                    });
                    const list = owned(listSelector$2, HTMLElement);
                    if (list) {
                        if (!list.id)
                            list.id = `command-list-${String(commandIdCounter++)}`;
                        setAttributeIfChanged$c(list, "role", "listbox");
                        setAttributeIfChanged$c(input, "aria-controls", list.id);
                    }
                    ownedAll(groupSelector$2).forEach((group) => {
                        setAttributeIfChanged$c(group, "role", "group");
                        const heading = queryAll(group, groupHeadingSelector).find((candidate) => candidate.closest(groupSelector$2) === group);
                        if (!heading)
                            return;
                        if (!heading.id) {
                            heading.id = `command-group-heading-${String(commandIdCounter++)}`;
                        }
                        setAttributeIfChanged$c(group, "aria-labelledby", heading.id);
                    });
                    ownedAll(separatorSelector$2).forEach((separator) => {
                        setAttributeIfChanged$c(separator, "role", "separator");
                        setAttributeIfChanged$c(separator, "aria-orientation", "horizontal");
                    });
                    ownedAll(shortcutSelector).forEach((shortcut) => {
                        setAttributeIfChanged$c(shortcut, "aria-hidden", "true");
                    });
                    const rendered = renderedItems();
                    const empty = rendered.length === 0;
                    setAttributeIfChanged$c(element, "data-direction", getDirection());
                    setAttributeIfChanged$c(element, "data-empty", String(empty));
                    setAttributeIfChanged$c(input, "aria-expanded", String(!empty));
                    ownedAll(emptySelector).forEach((emptySlot) => {
                        setAttributeIfChanged$c(emptySlot, "role", "status");
                        setAttributeIfChanged$c(emptySlot, "data-visible", String(empty));
                    });
                    const enabled = enabledItems();
                    const authoredSelected = enabled.find((item) => item.getAttribute("aria-selected") === "true" ||
                        item.getAttribute("data-selected") === "true");
                    if (previousActive && enabled.includes(previousActive)) {
                        selectItem(previousActive);
                    }
                    else {
                        selectItem(authoredSelected ?? enabled.at(0) ?? null);
                    }
                };
                const handleKeydown = (event) => {
                    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                        event.preventDefault();
                        move(event.key === "ArrowDown" ? 1 : -1);
                        return;
                    }
                    if (event.key === "Home" || event.key === "End") {
                        event.preventDefault();
                        const enabled = enabledItems();
                        selectItem(event.key === "Home"
                            ? (enabled[0] ?? null)
                            : (enabled.at(-1) ?? null), true);
                        return;
                    }
                    if (event.key === "Enter" && activeItem) {
                        event.preventDefault();
                        activeItem.click();
                    }
                };
                setAttributeIfChanged$c(input, "role", "combobox");
                setAttributeIfChanged$c(input, "aria-autocomplete", input.getAttribute("aria-autocomplete") ?? "list");
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
                const directionObserver = directionOwner === element ? null : new MutationObserver(syncStructure);
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

    let contextMenuIdCounter = 0;
    const rootSelector$1 = '[data-slot="context-menu"], [ng-context-menu]';
    const triggerSelector$4 = '[data-slot="context-menu-trigger"], [ng-context-menu-trigger]';
    const contentSelector$5 = '[data-slot="context-menu-content"], [ng-context-menu-content]';
    const subContentSelector = '[data-slot="context-menu-sub-content"], [ng-context-menu-sub-content]';
    const menuSurfaceSelector = `${contentSelector$5}, ${subContentSelector}`;
    const itemSelector$4 = [
        '[data-slot="context-menu-item"]',
        "[ng-context-menu-item]",
        '[data-slot="context-menu-checkbox-item"]',
        "[ng-context-menu-checkbox-item]",
        '[data-slot="context-menu-radio-item"]',
        "[ng-context-menu-radio-item]",
        '[data-slot="context-menu-sub-trigger"]',
        "[ng-context-menu-sub-trigger]",
        '[role="menuitem"]',
        '[role="menuitemcheckbox"]',
        '[role="menuitemradio"]',
    ].join(", ");
    const checkboxSelector = '[data-slot="context-menu-checkbox-item"], [ng-context-menu-checkbox-item]';
    const radioSelector$1 = '[data-slot="context-menu-radio-item"], [ng-context-menu-radio-item]';
    const subTriggerSelector = '[data-slot="context-menu-sub-trigger"], [ng-context-menu-sub-trigger]';
    const groupSelector$1 = '[data-slot="context-menu-group"], [ng-context-menu-group], [data-slot="context-menu-radio-group"], [ng-context-menu-radio-group]';
    const labelSelector$2 = '[data-slot="context-menu-label"], [ng-context-menu-label]';
    const separatorSelector$1 = '[data-slot="context-menu-separator"], [ng-context-menu-separator]';
    const sides$3 = new Set([
        "bottom",
        "inline-end",
        "inline-start",
        "left",
        "right",
        "top",
    ]);
    const alignments$1 = new Set(["center", "end", "start"]);
    const setAttributeIfChanged$b = (element, name, value) => {
        if (element.getAttribute(name) !== value)
            element.setAttribute(name, value);
    };
    function contextMenuDirective() {
        return {
            link(scope, element) {
                const isOwned = (candidate) => candidate.closest(rootSelector$1) === element;
                const owned = (selector, constructor) => {
                    const candidate = queryAll(element, selector).find(isOwned);
                    return candidate instanceof constructor ? candidate : null;
                };
                const ownedAll = (selector) => queryAll(element, selector).filter(isOwned);
                const trigger = owned(triggerSelector$4, HTMLElement);
                const content = owned(contentSelector$5, HTMLElement);
                if (!trigger || !content)
                    return;
                const directionOwner = element.closest("[dir]") ?? element;
                const getDirection = () => element.closest("[dir]")?.getAttribute("dir") === "rtl"
                    ? "rtl"
                    : "ltr";
                const getPhysicalSide = (side) => {
                    if (side === "inline-start") {
                        return getDirection() === "rtl" ? "right" : "left";
                    }
                    if (side === "inline-end") {
                        return getDirection() === "rtl" ? "left" : "right";
                    }
                    return side;
                };
                const getAuthoredSide = () => {
                    const value = content.getAttribute("side") ?? content.dataset.side;
                    return value && sides$3.has(value)
                        ? value
                        : "right";
                };
                const getAlign = () => {
                    const value = content.getAttribute("align") ?? content.dataset.align;
                    return value && alignments$1.has(value)
                        ? value
                        : "start";
                };
                const contentId = content.id || `context-menu-content-${String(contextMenuIdCounter++)}`;
                content.id = contentId;
                trigger.setAttribute("aria-haspopup", "menu");
                trigger.setAttribute("aria-controls", contentId);
                if (!trigger.hasAttribute("tabindex"))
                    trigger.tabIndex = 0;
                setAttributeIfChanged$b(content, "role", content.getAttribute("role") ?? "menu");
                setAttributeIfChanged$b(content, "tabindex", content.getAttribute("tabindex") ?? "-1");
                const menuItems = (surface) => queryAll(surface, itemSelector$4).filter((item) => {
                    if (!isOwned(item))
                        return false;
                    return item.closest(menuSurfaceSelector) === surface;
                });
                const visibleEnabledItems = (surface) => menuItems(surface).filter((item) => !isDisabled(item) &&
                    !item.hidden &&
                    !item.closest("[hidden]") &&
                    getComputedStyle(item).display !== "none");
                const syncSemantics = () => {
                    ownedAll(menuSurfaceSelector).forEach((surface) => {
                        setAttributeIfChanged$b(surface, "role", "menu");
                        if (!surface.hasAttribute("tabindex"))
                            surface.tabIndex = -1;
                    });
                    ownedAll(groupSelector$1).forEach((group) => {
                        setAttributeIfChanged$b(group, "role", "group");
                    });
                    ownedAll(labelSelector$2).forEach((label) => {
                        setAttributeIfChanged$b(label, "role", "presentation");
                    });
                    ownedAll(separatorSelector$1).forEach((separator) => {
                        setAttributeIfChanged$b(separator, "role", "separator");
                    });
                    ownedAll(itemSelector$4).forEach((item) => {
                        const role = item.matches(checkboxSelector)
                            ? "menuitemcheckbox"
                            : item.matches(radioSelector$1)
                                ? "menuitemradio"
                                : "menuitem";
                        setAttributeIfChanged$b(item, "role", role);
                        if (!item.hasAttribute("tabindex"))
                            item.tabIndex = -1;
                        if ((role === "menuitemcheckbox" || role === "menuitemradio") &&
                            !item.hasAttribute("aria-checked")) {
                            setAttributeIfChanged$b(item, "aria-checked", "false");
                        }
                        if (isDisabled(item)) {
                            setAttributeIfChanged$b(item, "aria-disabled", "true");
                            setAttributeIfChanged$b(item, "data-disabled", "true");
                        }
                    });
                };
                const syncDirection = () => {
                    const direction = getDirection();
                    setAttributeIfChanged$b(element, "data-direction", direction);
                    setAttributeIfChanged$b(content, "data-direction", direction);
                };
                let anchorPoint = null;
                let open = element.getAttribute("data-open") === "true" ||
                    content.getAttribute("data-open") === "true" ||
                    content.getAttribute("data-state") === "open";
                const keyboardAnchor = () => {
                    const rect = trigger.getBoundingClientRect();
                    return {
                        x: getDirection() === "rtl" ? rect.right : rect.left,
                        y: rect.bottom,
                    };
                };
                const positionContent = () => {
                    if (!open)
                        return;
                    const point = anchorPoint ?? keyboardAnchor();
                    const rootRect = element.getBoundingClientRect();
                    const menuRect = content.getBoundingClientRect();
                    const authoredSide = getAuthoredSide();
                    const side = getPhysicalSide(authoredSide);
                    const align = getAlign();
                    const offset = Number(content.getAttribute("side-offset") ?? 4) || 0;
                    const alignOffset = Number(content.getAttribute("align-offset") ?? 0) || 0;
                    const margin = 4;
                    let left = point.x;
                    let top = point.y;
                    if (side === "left")
                        left -= menuRect.width + offset;
                    if (side === "right")
                        left += offset;
                    if (side === "top")
                        top -= menuRect.height + offset;
                    if (side === "bottom")
                        top += offset;
                    if (side === "left" || side === "right") {
                        if (align === "center")
                            top -= menuRect.height / 2;
                        if (align === "end")
                            top -= menuRect.height;
                        top += alignOffset;
                    }
                    else {
                        if (align === "center")
                            left -= menuRect.width / 2;
                        if (align === "end")
                            left -= menuRect.width;
                        left += getDirection() === "rtl" ? -alignOffset : alignOffset;
                    }
                    left = Math.min(Math.max(left, margin), Math.max(margin, window.innerWidth - menuRect.width - margin));
                    top = Math.min(Math.max(top, margin), Math.max(margin, window.innerHeight - menuRect.height - margin));
                    content.style.setProperty("--context-menu-left", `${String(Math.round(left - rootRect.left + element.scrollLeft))}px`);
                    content.style.setProperty("--context-menu-top", `${String(Math.round(top - rootRect.top + element.scrollTop))}px`);
                    content.style.setProperty("--context-menu-available-height", `${String(Math.max(0, Math.round(window.innerHeight - margin * 2)))}px`);
                    setAttributeIfChanged$b(content, "data-side", authoredSide);
                    setAttributeIfChanged$b(content, "data-align", align);
                };
                const focusItem = (item, surface) => {
                    menuItems(surface).forEach((candidate) => {
                        candidate.tabIndex = candidate === item ? 0 : -1;
                        setAttributeIfChanged$b(candidate, "data-highlighted", String(candidate === item));
                    });
                    item.focus({ preventScroll: true });
                };
                const focusBoundary = (surface, boundary) => {
                    const items = visibleEnabledItems(surface);
                    const item = boundary === "first" ? items[0] : items.at(-1);
                    if (item)
                        focusItem(item, surface);
                };
                const moveFocus = (surface, direction) => {
                    const items = visibleEnabledItems(surface);
                    if (!items.length)
                        return;
                    const current = document.activeElement instanceof HTMLElement
                        ? items.indexOf(document.activeElement)
                        : -1;
                    const next = current < 0
                        ? direction === 1
                            ? 0
                            : items.length - 1
                        : (current + direction + items.length) % items.length;
                    focusItem(items[next], surface);
                };
                const setOpen = (nextOpen, options = {}) => {
                    if (nextOpen && isDisabled(trigger))
                        nextOpen = false;
                    const wasOpen = open;
                    open = nextOpen;
                    const state = open ? "open" : "closed";
                    setAttributeIfChanged$b(element, "data-open", String(open));
                    setAttributeIfChanged$b(element, "data-state", state);
                    setAttributeIfChanged$b(trigger, "aria-expanded", String(open));
                    setAttributeIfChanged$b(trigger, "data-state", state);
                    setAttributeIfChanged$b(content, "data-open", String(open));
                    setAttributeIfChanged$b(content, "data-state", state);
                    setAttributeIfChanged$b(content, "aria-hidden", String(!open));
                    setOpenState(content, open);
                    if (open) {
                        requestAnimationFrame(() => {
                            positionContent();
                            if (options.focusFirst)
                                focusBoundary(content, "first");
                        });
                    }
                    else {
                        menuItems(content).forEach((item) => {
                            item.tabIndex = -1;
                            setAttributeIfChanged$b(item, "data-highlighted", "false");
                        });
                        if (wasOpen && options.restoreFocus) {
                            trigger.focus({ preventScroll: true });
                        }
                    }
                };
                const openAt = (point, focusFirst = true) => {
                    anchorPoint = point;
                    syncSemantics();
                    setOpen(true, { focusFirst });
                };
                const close = (restoreFocus = false) => {
                    setOpen(false, { restoreFocus });
                };
                const handleContextMenu = (event) => {
                    if (isDisabled(trigger))
                        return;
                    event.preventDefault();
                    openAt({ x: event.clientX, y: event.clientY });
                };
                const handleKeydown = (event) => {
                    const target = event.target instanceof HTMLElement ? event.target : null;
                    if (target === trigger &&
                        (event.key === "ContextMenu" ||
                            (event.key === "F10" && event.shiftKey))) {
                        if (isDisabled(trigger))
                            return;
                        event.preventDefault();
                        openAt(keyboardAnchor());
                        return;
                    }
                    if (!open)
                        return;
                    if (event.key === "Escape") {
                        event.preventDefault();
                        close(true);
                        return;
                    }
                    if (event.key === "Tab") {
                        event.preventDefault();
                        close(true);
                        return;
                    }
                    const surface = target?.closest(menuSurfaceSelector);
                    if (!surface || !isOwned(surface))
                        return;
                    if (event.key === "ArrowDown") {
                        event.preventDefault();
                        moveFocus(surface, 1);
                    }
                    else if (event.key === "ArrowUp") {
                        event.preventDefault();
                        moveFocus(surface, -1);
                    }
                    else if (event.key === "Home") {
                        event.preventDefault();
                        focusBoundary(surface, "first");
                    }
                    else if (event.key === "End") {
                        event.preventDefault();
                        focusBoundary(surface, "last");
                    }
                    else if ((event.key === "Enter" || event.key === " ") &&
                        target?.matches(itemSelector$4)) {
                        event.preventDefault();
                        target.click();
                    }
                };
                const handleItemClick = (event) => {
                    const target = event.target instanceof Element ? event.target : null;
                    const item = target?.closest(itemSelector$4);
                    if (!item || !isOwned(item) || isDisabled(item))
                        return;
                    if (item.matches(subTriggerSelector))
                        return;
                    element.dispatchEvent(new CustomEvent("angularcss:context-menu-select", {
                        bubbles: true,
                        detail: { item },
                    }));
                    close(true);
                };
                const handlePointerMove = (event) => {
                    const target = event.target instanceof Element ? event.target : null;
                    const item = target?.closest(itemSelector$4);
                    const surface = item?.closest(menuSurfaceSelector);
                    if (!item || !surface || !isOwned(item) || isDisabled(item))
                        return;
                    menuItems(surface).forEach((candidate) => {
                        setAttributeIfChanged$b(candidate, "data-highlighted", String(candidate === item));
                    });
                };
                const handlePointerDownOutside = (event) => {
                    if (open &&
                        event.target instanceof Node &&
                        !element.contains(event.target)) {
                        close(false);
                    }
                };
                const cleanupSubmenus = bindSemanticSubmenus(element, "context-menu", getDirection);
                const observer = new MutationObserver((records) => {
                    if (records.some((record) => record.type === "childList")) {
                        syncSemantics();
                    }
                    if (records.some((record) => record.type === "attributes" &&
                        (record.attributeName === "dir" ||
                            record.attributeName === "side" ||
                            record.attributeName === "align" ||
                            record.attributeName === "data-side" ||
                            record.attributeName === "data-align"))) {
                        syncDirection();
                        if (open)
                            requestAnimationFrame(positionContent);
                    }
                    if (records.some((record) => record.type === "attributes" &&
                        record.attributeName === "data-open" &&
                        (record.target === element || record.target === content))) {
                        const source = records
                            .filter((record) => record.type === "attributes" &&
                            record.attributeName === "data-open" &&
                            (record.target === element || record.target === content))
                            .at(-1)?.target;
                        const nextOpen = source instanceof HTMLElement &&
                            source.getAttribute("data-open") === "true";
                        if (nextOpen !== open)
                            setOpen(nextOpen);
                    }
                });
                observer.observe(element, {
                    attributes: true,
                    attributeFilter: ["data-open", "dir"],
                    childList: true,
                    subtree: true,
                });
                observer.observe(content, {
                    attributes: true,
                    attributeFilter: [
                        "align",
                        "data-align",
                        "data-open",
                        "data-side",
                        "side",
                    ],
                });
                const directionObserver = directionOwner === element ? null : new MutationObserver(syncDirection);
                directionObserver?.observe(directionOwner, {
                    attributes: true,
                    attributeFilter: ["dir"],
                });
                syncDirection();
                syncSemantics();
                setOpen(open);
                trigger.addEventListener("contextmenu", handleContextMenu);
                element.addEventListener("keydown", handleKeydown);
                content.addEventListener("click", handleItemClick);
                content.addEventListener("pointermove", handlePointerMove);
                document.addEventListener("pointerdown", handlePointerDownOutside);
                window.addEventListener("resize", positionContent);
                window.addEventListener("scroll", positionContent, true);
                onDestroy(scope, () => {
                    cleanupSubmenus();
                    observer.disconnect();
                    directionObserver?.disconnect();
                    trigger.removeEventListener("contextmenu", handleContextMenu);
                    element.removeEventListener("keydown", handleKeydown);
                    content.removeEventListener("click", handleItemClick);
                    content.removeEventListener("pointermove", handlePointerMove);
                    document.removeEventListener("pointerdown", handlePointerDownOutside);
                    window.removeEventListener("resize", positionContent);
                    window.removeEventListener("scroll", positionContent, true);
                });
            },
        };
    }

    function dialogDirective() {
        return {
            link(scope, element) {
                bindOverlay(scope, element, {
                    rootSelector: '[data-slot="dialog"], [ng-dialog]',
                    closeSelector: '[data-slot="dialog-close"], [ng-dialog-close], [data-dialog-close]',
                    contentSelector: '[data-slot="dialog-content"], [ng-dialog-content]',
                    descriptionSelector: '[data-slot="dialog-description"], [ng-dialog-description]',
                    overlaySelector: '[data-slot="dialog-overlay"], [ng-dialog-overlay]',
                    titleSelector: '[data-slot="dialog-title"], [ng-dialog-title]',
                    triggerSelector: '[data-slot="dialog-trigger"], [ng-dialog-trigger]',
                    closeOnOutsideClick: true,
                });
            },
        };
    }

    function directionDirective() {
        const normalize = (direction) => {
            if (direction === "rtl" || direction === "ltr" || direction === "auto") {
                return direction;
            }
            return null;
        };
        const resolveDirection = (element) => {
            const own = normalize(element.getAttribute("dir"));
            if (own)
                return own;
            const fromData = normalize(element.getAttribute("data-direction"));
            if (fromData)
                return fromData;
            const ancestor = element.parentElement?.closest("[dir], [data-direction], [ng-direction], [data-slot='direction']");
            if (ancestor instanceof HTMLElement) {
                const ancestorDir = normalize(ancestor.getAttribute("dir"));
                if (ancestorDir)
                    return ancestorDir;
                const ancestorData = normalize(ancestor.getAttribute("data-direction"));
                if (ancestorData)
                    return ancestorData;
            }
            return (normalize(document.documentElement.getAttribute("dir")) ??
                normalize(document.documentElement.getAttribute("data-direction")) ??
                normalize(document.dir) ??
                "ltr");
        };
        return {
            link(_scope, element) {
                const direction = resolveDirection(element);
                element.setAttribute("data-direction", direction);
                element.setAttribute("dir", direction);
                element.style.direction = direction;
            },
        };
    }

    const drawerSides = new Set(["bottom", "left", "right", "top"]);
    const setAttributeIfChanged$a = (element, name, value) => {
        if (element.getAttribute(name) !== value) {
            element.setAttribute(name, value);
        }
    };
    function drawerDirective() {
        return {
            link(scope, element) {
                const getContent = () => queryAll(element, '[data-slot="drawer-content"], [ng-drawer-content]').find((candidate) => candidate.closest('[data-slot="drawer"], [ng-drawer]') === element) ?? null;
                const syncSide = () => {
                    const content = getContent();
                    const authoredSide = element.getAttribute("side") ??
                        element.getAttribute("direction") ??
                        content?.getAttribute("side") ??
                        content?.getAttribute("direction");
                    const side = authoredSide && drawerSides.has(authoredSide)
                        ? authoredSide
                        : "bottom";
                    setAttributeIfChanged$a(element, "data-side", side);
                    if (content)
                        setAttributeIfChanged$a(content, "data-side", side);
                };
                bindOverlay(scope, element, {
                    rootSelector: '[data-slot="drawer"], [ng-drawer]',
                    closeSelector: '[data-slot="drawer-close"], [ng-drawer-close], [data-drawer-close]',
                    contentSelector: '[data-slot="drawer-content"], [ng-drawer-content]',
                    descriptionSelector: '[data-slot="drawer-description"], [ng-drawer-description]',
                    overlaySelector: '[data-slot="drawer-overlay"], [ng-drawer-overlay]',
                    titleSelector: '[data-slot="drawer-title"], [ng-drawer-title]',
                    triggerSelector: '[data-slot="drawer-trigger"], [ng-drawer-trigger]',
                    closeOnOutsideClick: true,
                });
                const sideObserver = new MutationObserver(syncSide);
                sideObserver.observe(element, {
                    attributes: true,
                    attributeFilter: ["direction", "side"],
                    childList: true,
                    subtree: true,
                });
                syncSide();
                onDestroy(scope, () => {
                    sideObserver.disconnect();
                });
            },
        };
    }

    function emptyDirective() {
        return {
            link(_scope, element) {
                element.setAttribute("role", element.getAttribute("role") ?? "status");
                element.setAttribute("aria-live", element.getAttribute("aria-live") ?? "polite");
            },
        };
    }

    let fieldIdCounter = 0;
    const findControl = (element) => {
        return query(element, "input, textarea, select, button, [role='combobox'], [role='switch']", HTMLElement);
    };
    const findDescription = (element) => {
        return query(element, '[data-slot="field-description"], [ng-field-description]', HTMLElement);
    };
    const findError = (element) => {
        return query(element, '[data-slot="field-error"], [ng-field-error]', HTMLElement);
    };
    const isElementVisible = (node) => {
        return node instanceof HTMLElement && !node.hidden;
    };
    function fieldDirective() {
        return {
            link(_scope, element) {
                if (!element.hasAttribute("role")) {
                    element.setAttribute("role", "group");
                }
                const resolveControl = () => findControl(element);
                let currentControl = null;
                const handleFormStateChange = () => {
                    sync();
                };
                const bindControl = (control) => {
                    if (control === currentControl)
                        return;
                    currentControl?.removeEventListener("input", handleFormStateChange);
                    currentControl?.removeEventListener("change", handleFormStateChange);
                    currentControl = control;
                    currentControl?.addEventListener("input", handleFormStateChange);
                    currentControl?.addEventListener("change", handleFormStateChange);
                };
                const sync = () => {
                    const control = resolveControl();
                    bindControl(control);
                    const description = findDescription(element);
                    const error = findError(element);
                    const visibleError = isElementVisible(error);
                    const nativeInvalid = control?.matches(":invalid") ?? false;
                    const invalid = visibleError ||
                        nativeInvalid ||
                        control?.getAttribute("aria-invalid") === "true";
                    element.setAttribute("data-invalid", String(invalid));
                    if (!control)
                        return;
                    const describedBy = [description, error]
                        .filter(isElementVisible)
                        .map((part) => {
                        part.id = part.id || `field-message-${String(fieldIdCounter++)}`;
                        return part.id;
                    });
                    const nextAriaDescribedBy = describedBy.join(" ");
                    if (nextAriaDescribedBy.length > 0) {
                        if (control.getAttribute("aria-describedby") !== nextAriaDescribedBy) {
                            control.setAttribute("aria-describedby", nextAriaDescribedBy);
                        }
                    }
                    else {
                        control.removeAttribute("aria-describedby");
                    }
                };
                const observer = new MutationObserver(() => {
                    sync();
                });
                observer.observe(element, {
                    childList: true,
                    attributes: true,
                    subtree: true,
                    attributeFilter: [
                        "aria-invalid",
                        "class",
                        "disabled",
                        "hidden",
                        "required",
                    ],
                });
                sync();
                onDestroy(_scope, () => {
                    observer.disconnect();
                    bindControl(null);
                });
            },
        };
    }

    let hoverCardIdCounter = 0;
    const sides$2 = new Set(["bottom", "left", "right", "top"]);
    const delayFor = (element, attribute, fallback) => {
        const authored = element.getAttribute(attribute);
        if (authored === null)
            return fallback;
        const value = Number(authored);
        return Number.isFinite(value) && value >= 0 ? value : fallback;
    };
    function hoverCardDirective() {
        return {
            link(scope, element) {
                const trigger = query(element, '[data-slot="hover-card-trigger"], [ng-hover-card-trigger]', HTMLElement);
                const content = query(element, '[data-slot="hover-card-content"], [ng-hover-card-content]', HTMLElement);
                if (!trigger || !content)
                    return;
                const directionOwner = element.closest("[dir]") ?? element;
                const getDirection = () => element.closest("[dir]")?.getAttribute("dir") === "rtl"
                    ? "rtl"
                    : "ltr";
                const syncDirection = () => {
                    const direction = getDirection();
                    element.setAttribute("data-direction", direction);
                    content.setAttribute("data-direction", direction);
                };
                const syncSide = () => {
                    const authored = content.getAttribute("side") ?? content.getAttribute("data-side");
                    const side = authored && sides$2.has(authored) ? authored : "bottom";
                    if (content.getAttribute("data-side") !== side) {
                        content.setAttribute("data-side", side);
                    }
                };
                const contentId = content.id || `hover-card-content-${String(hoverCardIdCounter++)}`;
                content.id = contentId;
                trigger.setAttribute("aria-controls", contentId);
                trigger.setAttribute("aria-expanded", "false");
                content.setAttribute("role", content.getAttribute("role") ?? "dialog");
                let openState = element.getAttribute("data-open") === "true" ||
                    content.getAttribute("data-open") === "true";
                const setOpen = (open) => {
                    openState = open;
                    element.setAttribute("data-open", String(open));
                    element.setAttribute("data-state", open ? "open" : "closed");
                    trigger.setAttribute("data-state", open ? "open" : "closed");
                    trigger.setAttribute("aria-expanded", String(open));
                    content.setAttribute("data-open", String(open));
                    content.setAttribute("data-state", open ? "open" : "closed");
                    content.setAttribute("aria-hidden", String(!open));
                    setOpenState(content, open);
                };
                const syncFromAttribute = (source) => {
                    const nextOpen = source.getAttribute("data-open") === "true";
                    if (nextOpen === openState)
                        return;
                    setOpen(nextOpen);
                };
                const openObserver = new MutationObserver((records) => {
                    syncDirection();
                    syncSide();
                    const record = records.find((entry) => entry.attributeName === "data-open");
                    if (!(record?.target instanceof HTMLElement))
                        return;
                    syncFromAttribute(record.target);
                });
                openObserver.observe(content, {
                    attributes: true,
                    attributeFilter: ["data-open", "data-side", "side"],
                });
                openObserver.observe(element, {
                    attributes: true,
                    attributeFilter: ["data-open", "dir"],
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
                const handleOpen = () => {
                    if (isDisabled(trigger))
                        return;
                    setOpen(true);
                };
                let openTimer;
                let closeTimer;
                const clearOpenTimer = () => {
                    if (openTimer !== undefined)
                        clearTimeout(openTimer);
                    openTimer = undefined;
                };
                const clearCloseTimer = () => {
                    if (closeTimer !== undefined)
                        clearTimeout(closeTimer);
                    closeTimer = undefined;
                };
                const scheduleOpen = () => {
                    if (isDisabled(trigger))
                        return;
                    clearCloseTimer();
                    clearOpenTimer();
                    const delay = delayFor(element, "open-delay", 100);
                    if (delay === 0) {
                        handleOpen();
                        return;
                    }
                    openTimer = setTimeout(() => {
                        openTimer = undefined;
                        handleOpen();
                    }, delay);
                };
                const scheduleClose = () => {
                    clearOpenTimer();
                    clearCloseTimer();
                    const delay = delayFor(element, "close-delay", 100);
                    if (delay === 0) {
                        setOpen(false);
                        return;
                    }
                    closeTimer = setTimeout(() => {
                        closeTimer = undefined;
                        setOpen(false);
                    }, delay);
                };
                const handleFocus = () => {
                    clearOpenTimer();
                    clearCloseTimer();
                    handleOpen();
                };
                const handleBlur = (event) => {
                    if (event.relatedTarget instanceof Node &&
                        element.contains(event.relatedTarget)) {
                        return;
                    }
                    scheduleClose();
                };
                const handleEscape = (event) => {
                    if (!openState || event.key !== "Escape")
                        return;
                    clearOpenTimer();
                    clearCloseTimer();
                    setOpen(false);
                    trigger.focus({ preventScroll: true });
                };
                syncDirection();
                syncSide();
                setOpen(openState);
                trigger.addEventListener("mouseenter", scheduleOpen);
                trigger.addEventListener("mouseleave", scheduleClose);
                trigger.addEventListener("focus", handleFocus);
                trigger.addEventListener("blur", handleBlur);
                content.addEventListener("mouseenter", clearCloseTimer);
                content.addEventListener("mouseleave", scheduleClose);
                content.addEventListener("focusin", handleFocus);
                content.addEventListener("focusout", handleBlur);
                document.addEventListener("keydown", handleEscape);
                onDestroy(scope, () => {
                    clearOpenTimer();
                    clearCloseTimer();
                    openObserver.disconnect();
                    directionObserver?.disconnect();
                    trigger.removeEventListener("mouseenter", scheduleOpen);
                    trigger.removeEventListener("mouseleave", scheduleClose);
                    trigger.removeEventListener("focus", handleFocus);
                    trigger.removeEventListener("blur", handleBlur);
                    content.removeEventListener("mouseenter", clearCloseTimer);
                    content.removeEventListener("mouseleave", scheduleClose);
                    content.removeEventListener("focusin", handleFocus);
                    content.removeEventListener("focusout", handleBlur);
                    document.removeEventListener("keydown", handleEscape);
                });
            },
        };
    }

    let inputGroupIdCounter = 0;
    const addonSelector = '[data-slot="input-group-addon"], [ng-input-group-addon]';
    const buttonSelector = '[data-slot="input-group-button"], [ng-input-group-button]';
    const controlSelector$1 = 'input, textarea, select, [role="combobox"], [role="spinbutton"]';
    function inputGroupDirective() {
        return {
            link(scope, element) {
                let describedControl = null;
                let managedDescriptionIds = new Set();
                if (!element.hasAttribute("role")) {
                    element.setAttribute("role", "group");
                }
                const removeManagedDescriptions = (control) => {
                    if (!control || managedDescriptionIds.size === 0)
                        return;
                    const remaining = (control.getAttribute("aria-describedby") ?? "")
                        .split(/\s+/)
                        .filter((id) => id && !managedDescriptionIds.has(id));
                    if (remaining.length) {
                        control.setAttribute("aria-describedby", remaining.join(" "));
                    }
                    else {
                        control.removeAttribute("aria-describedby");
                    }
                };
                const sync = () => {
                    const addons = queryAll(element, addonSelector);
                    const control = query(element, controlSelector$1, HTMLElement);
                    const visibleAddonIds = addons
                        .filter((addon) => addon.getAttribute("aria-hidden") !== "true")
                        .map((addon) => {
                        addon.id =
                            addon.id || `input-group-addon-${String(inputGroupIdCounter++)}`;
                        return addon.id;
                    });
                    element.setAttribute("data-has-addon", String(addons.length > 0));
                    element.setAttribute("data-has-button", String(Boolean(query(element, buttonSelector))));
                    element.setAttribute("data-addon-count", String(addons.length));
                    if (control !== describedControl) {
                        removeManagedDescriptions(describedControl);
                        describedControl = control;
                        managedDescriptionIds = new Set();
                    }
                    if (!control)
                        return;
                    const current = control.getAttribute("aria-describedby");
                    const tokens = new Set((current ?? "").split(/\s+/).filter(Boolean));
                    managedDescriptionIds.forEach((id) => tokens.delete(id));
                    visibleAddonIds.forEach((id) => tokens.add(id));
                    managedDescriptionIds = new Set(visibleAddonIds);
                    if (tokens.size) {
                        control.setAttribute("aria-describedby", Array.from(tokens).join(" "));
                    }
                    else {
                        control.removeAttribute("aria-describedby");
                    }
                };
                const observer = new MutationObserver(sync);
                observer.observe(element, {
                    attributes: true,
                    attributeFilter: ["aria-hidden"],
                    childList: true,
                    subtree: true,
                });
                sync();
                const focusControlFromAddon = (event) => {
                    const target = event.target;
                    if (!(target instanceof Element))
                        return;
                    const addon = target.closest(addonSelector);
                    if (!addon || !element.contains(addon) || target.closest("button")) {
                        return;
                    }
                    query(element, controlSelector$1, HTMLElement)?.focus();
                };
                element.addEventListener("click", focusControlFromAddon);
                onDestroy(scope, () => {
                    observer.disconnect();
                    element.removeEventListener("click", focusControlFromAddon);
                    removeManagedDescriptions(describedControl);
                });
            },
        };
    }

    const setAttributeIfChanged$9 = (element, name, value) => {
        if (element.getAttribute(name) !== value) {
            element.setAttribute(name, value);
        }
    };
    function inputOtpDirective() {
        return {
            link(scope, element) {
                let inputs = queryAll(element, "input");
                const cleanupInputs = new WeakMap();
                const focusInput = (index) => {
                    const input = inputs.at(index);
                    if (input)
                        input.focus();
                };
                const syncValue = () => {
                    const value = inputs.map((input) => input.value).join("");
                    element.setAttribute("data-value", value);
                    setAttributeIfChanged$9(element, "data-complete", String(inputs.length > 0 && inputs.every((input) => input.value)));
                    setAttributeIfChanged$9(element, "data-disabled", String(inputs.some((input) => input.disabled)));
                    setAttributeIfChanged$9(element, "data-invalid", String(inputs.some((input) => input.getAttribute("aria-invalid") === "true" ||
                        !input.validity.valid)));
                };
                const bindInput = (input) => {
                    if (cleanupInputs.has(input))
                        return;
                    input.setAttribute("autocomplete", input.autocomplete || "one-time-code");
                    input.setAttribute("inputmode", input.getAttribute("inputmode") ?? "numeric");
                    if (!input.hasAttribute("maxlength")) {
                        input.setAttribute("maxlength", "1");
                    }
                    input.setAttribute("aria-label", input.getAttribute("aria-label") ??
                        `Digit ${String(inputs.indexOf(input) + 1)}`);
                    const handleInput = () => {
                        input.value = input.value.slice(-1);
                        syncValue();
                        if (input.value)
                            focusInput(inputs.indexOf(input) + 1);
                    };
                    const handleKeydown = (event) => {
                        if (event.key === "Backspace" && !input.value) {
                            focusInput(inputs.indexOf(input) - 1);
                        }
                    };
                    const handlePaste = (event) => {
                        const pasted = event.clipboardData?.getData("text").trim();
                        if (!pasted)
                            return;
                        event.preventDefault();
                        const startIndex = inputs.indexOf(input);
                        pasted
                            .slice(0, inputs.length - startIndex)
                            .split("")
                            .forEach((character, offset) => {
                            const target = inputs[startIndex + offset];
                            target.value = character;
                            target.dispatchEvent(new Event("input", { bubbles: true }));
                        });
                        syncValue();
                        focusInput(Math.min(startIndex + pasted.length, inputs.length - 1));
                    };
                    const handleFocus = () => {
                        queryAll(element, '[data-slot="input-otp-slot"], [ng-input-otp-slot]').forEach((slot) => {
                            setAttributeIfChanged$9(slot, "data-active", String(slot.contains(input)));
                        });
                    };
                    const handleBlur = () => {
                        const slot = input.closest('[data-slot="input-otp-slot"], [ng-input-otp-slot]');
                        if (slot)
                            setAttributeIfChanged$9(slot, "data-active", "false");
                    };
                    input.addEventListener("input", handleInput);
                    input.addEventListener("keydown", handleKeydown);
                    input.addEventListener("paste", handlePaste);
                    input.addEventListener("focus", handleFocus);
                    input.addEventListener("blur", handleBlur);
                    cleanupInputs.set(input, () => {
                        input.removeEventListener("input", handleInput);
                        input.removeEventListener("keydown", handleKeydown);
                        input.removeEventListener("paste", handlePaste);
                        input.removeEventListener("focus", handleFocus);
                        input.removeEventListener("blur", handleBlur);
                    });
                };
                const syncInputs = () => {
                    inputs = queryAll(element, "input");
                    inputs.forEach((input, index) => {
                        bindInput(input);
                        input.setAttribute("aria-label", input.getAttribute("aria-label") ?? `Digit ${String(index + 1)}`);
                    });
                    syncValue();
                };
                const observer = new MutationObserver(syncInputs);
                observer.observe(element, {
                    attributes: true,
                    attributeFilter: [
                        "aria-invalid",
                        "data-invalid",
                        "disabled",
                        "maxlength",
                        "required",
                        "value",
                    ],
                    childList: true,
                    subtree: true,
                });
                syncInputs();
                onDestroy(scope, () => {
                    observer.disconnect();
                    queryAll(element, "input").forEach((input) => {
                        cleanupInputs.get(input)?.();
                    });
                });
            },
        };
    }

    function itemDirective() {
        return {
            link(_scope, element) {
                const variant = element.getAttribute("variant") ??
                    element.getAttribute("data-variant") ??
                    "default";
                element.setAttribute("data-variant", variant);
                const size = element.getAttribute("size") ??
                    element.getAttribute("data-size") ??
                    "default";
                element.setAttribute("data-size", size);
                element.setAttribute("data-disabled", String(element.hasAttribute("disabled") ||
                    element.getAttribute("aria-disabled") === "true"));
                if (element.getAttribute("data-disabled") === "true") {
                    element.setAttribute("aria-disabled", "true");
                    if (element.tabIndex >= 0)
                        element.tabIndex = -1;
                }
            },
        };
    }

    function kbdDirective() {
        return {
            link(_scope, element) {
                const label = element.textContent.trim();
                if (label && !element.hasAttribute("aria-label")) {
                    element.setAttribute("aria-label", `Keyboard shortcut ${label}`);
                }
            },
        };
    }

    const resolveControl = (label) => {
        const htmlFor = label.getAttribute("for");
        const control = htmlFor
            ? document.getElementById(htmlFor)
            : query(label, "input, textarea, select", HTMLElement);
        return control instanceof HTMLElement ? control : null;
    };
    const syncState = (label, control) => {
        label.setAttribute("data-associated", String(Boolean(control)));
        label.setAttribute("data-required", String(control?.hasAttribute("required") ??
            control?.getAttribute("aria-required") === "true"));
        label.setAttribute("data-disabled", String(control?.hasAttribute("disabled") ??
            control?.getAttribute("aria-disabled") === "true"));
    };
    function labelDirective() {
        return {
            link(_scope, element) {
                let control = null;
                let controlObserver = null;
                const sync = () => {
                    const nextControl = resolveControl(element);
                    if (nextControl !== control) {
                        controlObserver?.disconnect();
                        control = nextControl;
                        if (control) {
                            controlObserver = new MutationObserver(sync);
                            controlObserver.observe(control, {
                                attributes: true,
                                attributeFilter: [
                                    "required",
                                    "disabled",
                                    "aria-required",
                                    "aria-disabled",
                                ],
                            });
                        }
                        else {
                            controlObserver = null;
                        }
                    }
                    syncState(element, control);
                };
                const labelObserver = new MutationObserver(sync);
                labelObserver.observe(element, {
                    attributes: true,
                    childList: true,
                    subtree: true,
                    attributeFilter: ["for"],
                });
                const associationObserver = new MutationObserver(sync);
                associationObserver.observe(element.parentElement ?? element.ownerDocument, {
                    childList: true,
                    subtree: true,
                });
                sync();
                onDestroy(_scope, () => {
                    controlObserver?.disconnect();
                    labelObserver.disconnect();
                    associationObserver.disconnect();
                });
            },
        };
    }

    let menubarIdCounter = 0;
    const menuSelector = '[data-slot="menubar-menu"], [ng-menubar-menu]';
    const triggerSelector$3 = '[data-slot="menubar-trigger"], [ng-menubar-trigger]';
    const contentSelector$4 = '[data-slot="menubar-content"], [ng-menubar-content]';
    const itemSelector$3 = '[data-slot="menubar-item"], [ng-menubar-item], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], a, button';
    const setAttribute$4 = (element, name, value) => {
        if (element.getAttribute(name) !== value) {
            element.setAttribute(name, value);
        }
    };
    function menubarDirective() {
        return {
            link(scope, element) {
                const entries = [];
                const triggers = [];
                const boundMenus = new WeakSet();
                const directionOwner = element.closest("[dir]") ?? element;
                const getDirection = () => element.closest("[dir]")?.getAttribute("dir") === "rtl"
                    ? "rtl"
                    : "ltr";
                const getHorizontalDirection = (key) => (key === "ArrowRight") === (getDirection() === "ltr") ? 1 : -1;
                const syncDirection = () => {
                    const direction = getDirection();
                    setAttribute$4(element, "data-direction", direction);
                    entries.forEach((entry) => {
                        setAttribute$4(entry.content, "data-direction", direction);
                    });
                };
                const syncRootState = () => {
                    const open = entries.some((entry) => entry.open);
                    setAttribute$4(element, "data-open", String(open));
                    setAttribute$4(element, "data-state", open ? "open" : "closed");
                };
                const cleanupSubmenus = bindSemanticSubmenus(element, "menubar", getDirection);
                const getAllContentItems = (content) => queryAll(content, itemSelector$3).filter((item) => {
                    const hiddenAncestor = item.closest("[hidden]");
                    return !hiddenAncestor || hiddenAncestor === content;
                });
                const getContentItems = (content) => getAllContentItems(content).filter((item) => !isDisabled(item));
                const syncContentItems = () => {
                    queryAll(element, contentSelector$4).forEach((content) => {
                        getAllContentItems(content).forEach((item) => {
                            setAttribute$4(item, "role", item.getAttribute("role") ?? "menuitem");
                        });
                    });
                };
                const setActiveTrigger = (index, focus = false) => {
                    triggers.forEach((trigger, triggerIndex) => {
                        setAttribute$4(trigger, "tabindex", triggerIndex === index ? "0" : "-1");
                    });
                    if (focus)
                        triggers[index]?.focus({ preventScroll: true });
                };
                const syncActiveTrigger = () => {
                    const current = triggers.findIndex((trigger) => trigger.getAttribute("tabindex") === "0" && !isDisabled(trigger));
                    const firstEnabled = triggers.findIndex((trigger) => !isDisabled(trigger));
                    setActiveTrigger(current >= 0 ? current : firstEnabled);
                };
                const setMenuState = (index, open, focus = false) => {
                    const entry = entries.at(index);
                    if (!entry)
                        return;
                    const wasOpen = entry.open;
                    entry.open = open;
                    if (open)
                        setActiveTrigger(index);
                    setAttribute$4(entry.menu, "data-state", open ? "open" : "closed");
                    setAttribute$4(entry.trigger, "data-state", open ? "open" : "closed");
                    setAttribute$4(entry.trigger, "aria-expanded", String(open));
                    setAttribute$4(entry.content, "data-state", open ? "open" : "closed");
                    setAttribute$4(entry.content, "aria-hidden", String(!open));
                    setOpenState(entry.content, open);
                    syncRootState();
                    if (wasOpen === open) {
                        if (open && focus) {
                            const focusTarget = getContentItems(entry.content).at(0);
                            if (focusTarget) {
                                focusTarget.focus();
                            }
                            else {
                                entry.trigger.focus();
                            }
                        }
                        return;
                    }
                    if (open && focus) {
                        const focusTarget = getContentItems(entry.content).at(0);
                        if (focusTarget) {
                            focusTarget.focus();
                        }
                        else {
                            entry.trigger.focus();
                        }
                        return;
                    }
                    if (!open && focus) {
                        entry.trigger.focus();
                    }
                };
                const closeAll = () => {
                    entries.forEach((_, index) => {
                        setMenuState(index, false);
                    });
                };
                const openMenu = (index, focus = false) => {
                    if (index < 0)
                        return;
                    closeAll();
                    setMenuState(index, true, focus);
                };
                const getEnabledTriggerIndex = (index, direction) => {
                    if (!triggers.length)
                        return -1;
                    let next = nextIndex(index, triggers.length, direction);
                    let safety = 0;
                    while (isDisabled(triggers[next]) && safety < triggers.length) {
                        next = nextIndex(next, triggers.length, direction);
                        safety += 1;
                    }
                    return isDisabled(triggers[next]) ? -1 : next;
                };
                const getBoundaryTriggerIndex = (fromEnd) => {
                    const indexes = triggers.map((_, index) => index);
                    if (fromEnd)
                        indexes.reverse();
                    return indexes.find((index) => !isDisabled(triggers[index])) ?? -1;
                };
                const cleanupEntries = [];
                const bindMenu = (menu) => {
                    if (boundMenus.has(menu))
                        return;
                    const trigger = query(menu, triggerSelector$3, HTMLElement);
                    const content = query(menu, contentSelector$4, HTMLElement);
                    if (!trigger || !content)
                        return;
                    boundMenus.add(menu);
                    const triggerId = trigger.id || `menubar-trigger-${String(menubarIdCounter++)}`;
                    const contentId = content.id || `${triggerId}-content`;
                    trigger.id = triggerId;
                    content.id = contentId;
                    setAttribute$4(trigger, "role", trigger.getAttribute("role") ?? "menuitem");
                    setAttribute$4(trigger, "aria-haspopup", "menu");
                    setAttribute$4(trigger, "aria-controls", contentId);
                    setAttribute$4(content, "role", content.getAttribute("role") ?? "menu");
                    setAttribute$4(content, "aria-labelledby", triggerId);
                    setAttribute$4(content, "aria-hidden", "true");
                    if (!content.hasAttribute("tabindex")) {
                        setAttribute$4(content, "tabindex", "-1");
                    }
                    getContentItems(content).forEach((item) => {
                        setAttribute$4(item, "role", item.getAttribute("role") ?? "menuitem");
                    });
                    const entry = {
                        menu,
                        trigger,
                        content,
                        open: content.getAttribute("data-open") === "true" ||
                            content.getAttribute("data-state") === "open",
                        disconnect: () => void 0,
                    };
                    entries.push(entry);
                    triggers.push(trigger);
                    setAttribute$4(trigger, "tabindex", "-1");
                    const getEntryIndex = () => entries.indexOf(entry);
                    const syncFromAttribute = () => {
                        const dataOpen = content.getAttribute("data-open");
                        const nextOpen = dataOpen !== null
                            ? dataOpen === "true"
                            : content.getAttribute("data-state") === "open";
                        setMenuState(getEntryIndex(), nextOpen);
                    };
                    const openObserver = new MutationObserver(() => {
                        syncFromAttribute();
                    });
                    openObserver.observe(content, {
                        attributes: true,
                        attributeFilter: ["data-open", "data-state"],
                    });
                    cleanupEntries.push(() => {
                        openObserver.disconnect();
                    });
                    setMenuState(getEntryIndex(), entry.open, false);
                    const handleTriggerClick = () => {
                        if (isDisabled(trigger))
                            return;
                        const currentIndex = getEntryIndex();
                        setActiveTrigger(currentIndex);
                        if (entry.open) {
                            closeAll();
                        }
                        else {
                            openMenu(currentIndex, true);
                        }
                    };
                    const handleTriggerKeydown = (event) => {
                        if (isDisabled(trigger))
                            return;
                        if (event.key === "ArrowDown" ||
                            event.key === "Enter" ||
                            event.key === " " ||
                            event.key === "Spacebar") {
                            event.preventDefault();
                            openMenu(getEntryIndex(), true);
                            return;
                        }
                        if (event.key !== "ArrowRight" &&
                            event.key !== "ArrowLeft" &&
                            event.key !== "Home" &&
                            event.key !== "End") {
                            return;
                        }
                        event.preventDefault();
                        event.stopPropagation();
                        if (event.key === "Home" || event.key === "End") {
                            const targetIndex = getBoundaryTriggerIndex(event.key === "End");
                            if (entries.some((nextEntry) => nextEntry.open)) {
                                openMenu(targetIndex, true);
                            }
                            else {
                                setActiveTrigger(targetIndex, true);
                            }
                        }
                        else {
                            const targetIndex = getEnabledTriggerIndex(getEntryIndex(), getHorizontalDirection(event.key));
                            if (entries.some((nextEntry) => nextEntry.open)) {
                                openMenu(targetIndex, true);
                            }
                            else {
                                setActiveTrigger(targetIndex, true);
                            }
                        }
                    };
                    const handleTriggerFocus = () => {
                        setActiveTrigger(getEntryIndex());
                    };
                    trigger.addEventListener("click", handleTriggerClick);
                    trigger.addEventListener("keydown", handleTriggerKeydown);
                    trigger.addEventListener("focus", handleTriggerFocus);
                    cleanupEntries.push(() => {
                        trigger.removeEventListener("click", handleTriggerClick);
                        trigger.removeEventListener("keydown", handleTriggerKeydown);
                        trigger.removeEventListener("focus", handleTriggerFocus);
                    });
                };
                const syncStructure = () => {
                    queryAll(element, menuSelector).forEach(bindMenu);
                    entries.sort((left, right) => {
                        const position = left.menu.compareDocumentPosition(right.menu);
                        return position & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
                    });
                    triggers.splice(0, triggers.length, ...entries.map(({ trigger }) => trigger));
                    syncContentItems();
                    syncDirection();
                    syncActiveTrigger();
                    syncRootState();
                };
                const handleKeydown = (event) => {
                    const activeElement = document.activeElement instanceof HTMLElement
                        ? document.activeElement
                        : null;
                    const activeTrigger = activeElement
                        ? triggers.find((trigger) => trigger === activeElement)
                        : null;
                    const activeContent = activeElement
                        ? activeElement.closest('[data-slot="menubar-content"], [ng-menubar-content]')
                        : null;
                    if (!activeTrigger && !activeContent)
                        return;
                    if (event.key === "Escape") {
                        event.preventDefault();
                        if (activeContent) {
                            const currentMenu = activeContent.closest('[data-slot="menubar-menu"], [ng-menubar-menu]');
                            const currentIndex = currentMenu
                                ? entries.findIndex((entry) => entry.menu === currentMenu)
                                : -1;
                            if (currentIndex >= 0) {
                                entries[currentIndex].trigger.focus();
                            }
                        }
                        closeAll();
                        if (activeTrigger) {
                            activeTrigger.focus();
                        }
                        return;
                    }
                    if (activeContent) {
                        const contentRoot = activeContent;
                        const contentItems = getContentItems(contentRoot);
                        const activeContentIndex = activeElement
                            ? contentItems.indexOf(activeElement)
                            : -1;
                        if (event.key === "ArrowDown" ||
                            event.key === "ArrowUp" ||
                            event.key === "Home" ||
                            event.key === "End") {
                            if (!contentItems.length)
                                return;
                            event.preventDefault();
                            const nextContentIndex = event.key === "Home"
                                ? 0
                                : event.key === "End"
                                    ? contentItems.length - 1
                                    : nextIndex(activeContentIndex, contentItems.length, event.key === "ArrowDown" ? 1 : -1);
                            contentItems[nextContentIndex].focus();
                            return;
                        }
                        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                            event.preventDefault();
                            const currentMenu = activeContent.closest('[data-slot="menubar-menu"], [ng-menubar-menu]');
                            const currentIndex = currentMenu
                                ? entries.findIndex((entry) => entry.menu === currentMenu)
                                : -1;
                            const nextMenuIndex = getEnabledTriggerIndex(currentIndex, getHorizontalDirection(event.key));
                            if (nextMenuIndex >= 0) {
                                openMenu(nextMenuIndex, true);
                            }
                            return;
                        }
                    }
                    if (activeTrigger &&
                        (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
                        const currentIndex = triggers.indexOf(activeTrigger);
                        event.preventDefault();
                        const nextIndexValue = getEnabledTriggerIndex(currentIndex, getHorizontalDirection(event.key));
                        if (nextIndexValue >= 0) {
                            openMenu(nextIndexValue, true);
                        }
                    }
                };
                setAttribute$4(element, "role", element.getAttribute("role") ?? "menubar");
                const handleDocumentClick = (event) => {
                    if (event.target instanceof Node && !element.contains(event.target)) {
                        closeAll();
                    }
                };
                const handleItemClick = (event) => {
                    const target = event.target instanceof Element
                        ? event.target.closest(itemSelector$3)
                        : null;
                    if (!target?.closest(contentSelector$4) ||
                        target.matches('[data-slot="menubar-sub-trigger"], [ng-menubar-sub-trigger]') ||
                        isDisabled(target)) {
                        return;
                    }
                    closeAll();
                };
                element.addEventListener("keydown", handleKeydown);
                element.addEventListener("click", handleItemClick);
                document.addEventListener("click", handleDocumentClick);
                const structureObserver = new MutationObserver(syncStructure);
                structureObserver.observe(element, {
                    attributes: true,
                    attributeFilter: ["data-slot", "dir"],
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
                syncStructure();
                let foundInitialOpen = false;
                entries.forEach((entry, index) => {
                    const keepOpen = entry.open && !foundInitialOpen;
                    if (keepOpen)
                        foundInitialOpen = true;
                    setMenuState(index, keepOpen);
                });
                onDestroy(scope, () => {
                    structureObserver.disconnect();
                    directionObserver?.disconnect();
                    element.removeEventListener("keydown", handleKeydown);
                    element.removeEventListener("click", handleItemClick);
                    document.removeEventListener("click", handleDocumentClick);
                    cleanupEntries.forEach((cleanup) => {
                        cleanup();
                    });
                    cleanupSubmenus();
                });
            },
        };
    }

    function nativeSelectDirective() {
        return {
            link(scope, element) {
                if (!(element instanceof HTMLSelectElement))
                    return;
                const sync = () => {
                    syncNativeControlState(element);
                    element.setAttribute("data-empty", String(!element.value));
                    element.setAttribute("data-value", element.value);
                    element.setAttribute("data-invalid", String(element.getAttribute("aria-invalid") === "true" ||
                        element.matches(":invalid")));
                };
                const observer = new MutationObserver(sync);
                observer.observe(element, {
                    attributes: true,
                    attributeFilter: [
                        "aria-invalid",
                        "disabled",
                        "required",
                        "selected",
                        "value",
                    ],
                    childList: true,
                    subtree: true,
                });
                element.addEventListener("input", sync);
                element.addEventListener("change", sync);
                sync();
                onDestroy(scope, () => {
                    element.removeEventListener("input", sync);
                    element.removeEventListener("change", sync);
                    observer.disconnect();
                });
            },
        };
    }

    let selectIdCounter = 0;
    const contentSelector$3 = '[data-slot="select-content"], [ng-select-content]';
    const groupSelector = '[data-slot="select-group"], [ng-select-group]';
    const itemSelector$2 = '[data-slot="select-item"], [ng-select-item]';
    const labelSelector$1 = '[data-slot="select-label"], [ng-select-label]';
    const rootSelector = '[data-slot="select"], [ng-select]';
    const scrollDownSelector = '[data-slot="select-scroll-down-button"], [ng-select-scroll-down-button]';
    const scrollUpSelector = '[data-slot="select-scroll-up-button"], [ng-select-scroll-up-button]';
    const separatorSelector = '[data-slot="select-separator"], [ng-select-separator]';
    const triggerSelector$2 = '[data-slot="select-trigger"], [ng-select-trigger]';
    const valueSelector$1 = '[data-slot="select-value"], [ng-select-value]';
    const setAttributeIfChanged$8 = (element, name, value) => {
        if (element.getAttribute(name) !== value) {
            element.setAttribute(name, value);
        }
    };
    const setHiddenIfChanged = (element, hidden) => {
        if (element.hidden !== hidden)
            element.hidden = hidden;
    };
    function selectDirective() {
        return {
            link(scope, element) {
                const isOwned = (candidate) => candidate.closest(rootSelector) === element;
                const owned = (selector, constructor) => {
                    const candidate = queryAll(element, selector).find(isOwned);
                    return candidate instanceof constructor ? candidate : null;
                };
                const ownedAll = (selector) => queryAll(element, selector).filter(isOwned);
                const directionOwner = element.closest("[dir]") ?? element;
                const trigger = owned(triggerSelector$2, HTMLElement);
                const content = owned(contentSelector$3, HTMLElement);
                if (!trigger || !content)
                    return;
                const contentId = content.id || `select-content-${String(selectIdCounter++)}`;
                const triggerId = trigger.id || `select-trigger-${String(selectIdCounter++)}`;
                content.id = contentId;
                trigger.id = triggerId;
                setAttributeIfChanged$8(trigger, "role", trigger.getAttribute("role") ?? "combobox");
                setAttributeIfChanged$8(trigger, "aria-haspopup", "listbox");
                setAttributeIfChanged$8(trigger, "aria-controls", contentId);
                setAttributeIfChanged$8(trigger, "aria-autocomplete", "none");
                setAttributeIfChanged$8(content, "role", content.getAttribute("role") ?? "listbox");
                setAttributeIfChanged$8(content, "aria-labelledby", triggerId);
                setAttributeIfChanged$8(content, "tabindex", "-1");
                let items = [];
                let activeIndex = -1;
                let open = element.getAttribute("open") === "true" ||
                    element.getAttribute("data-open") === "true" ||
                    content.getAttribute("data-open") === "true";
                let typeahead = "";
                let typeaheadTimer = 0;
                let openAtPointerDown = false;
                const cleanupItems = new Map();
                const cleanupScrollControls = new Map();
                const getDirection = () => element.closest("[dir]")?.getAttribute("dir") === "rtl"
                    ? "rtl"
                    : "ltr";
                const alignItemWithTrigger = () => {
                    const value = content.getAttribute("align-item-with-trigger") ??
                        content.getAttribute("data-align-trigger");
                    return value !== "false";
                };
                const syncChrome = () => {
                    const direction = getDirection();
                    const disabled = isDisabled(trigger);
                    setAttributeIfChanged$8(element, "data-direction", direction);
                    setAttributeIfChanged$8(content, "data-direction", direction);
                    setAttributeIfChanged$8(element, "data-disabled", String(disabled));
                    setAttributeIfChanged$8(trigger, "aria-disabled", String(disabled));
                    setAttributeIfChanged$8(content, "data-align-trigger", String(alignItemWithTrigger()));
                };
                const syncScrollState = () => {
                    const atStart = content.scrollTop <= 1;
                    const atEnd = content.scrollTop + content.clientHeight >= content.scrollHeight - 1;
                    ownedAll(scrollUpSelector).forEach((control) => {
                        setHiddenIfChanged(control, atStart);
                        setAttributeIfChanged$8(control, "aria-hidden", String(atStart));
                    });
                    ownedAll(scrollDownSelector).forEach((control) => {
                        setHiddenIfChanged(control, atEnd);
                        setAttributeIfChanged$8(control, "aria-hidden", String(atEnd));
                    });
                    setAttributeIfChanged$8(content, "data-scroll-start", String(atStart));
                    setAttributeIfChanged$8(content, "data-scroll-end", String(atEnd));
                };
                const positionContent = () => {
                    if (!open)
                        return;
                    const triggerBox = trigger.getBoundingClientRect();
                    const selected = items.find((item) => item.getAttribute("aria-selected") === "true");
                    const selectedBox = selected?.getBoundingClientRect();
                    let top = trigger.offsetTop + triggerBox.height + 4;
                    if (alignItemWithTrigger() && selected && selectedBox) {
                        top =
                            trigger.offsetTop +
                                triggerBox.height / 2 -
                                selected.offsetTop -
                                selectedBox.height / 2;
                    }
                    const rootBox = element.getBoundingClientRect();
                    const contentHeight = Math.min(content.scrollHeight, 288);
                    const viewportTop = rootBox.top + top;
                    top += Math.max(4 - viewportTop, 0);
                    top -= Math.max(viewportTop + contentHeight - (window.innerHeight - 4), 0);
                    content.style.setProperty("--select-content-top", `${String(Math.round(top))}px`);
                    syncScrollState();
                };
                const setOpen = (nextOpen, restoreFocus = false, notifyApplication = false) => {
                    if (nextOpen && isDisabled(trigger))
                        nextOpen = false;
                    open = nextOpen;
                    const state = open ? "open" : "closed";
                    setAttributeIfChanged$8(element, "data-open", String(open));
                    setAttributeIfChanged$8(element, "data-state", state);
                    setAttributeIfChanged$8(trigger, "data-state", state);
                    setAttributeIfChanged$8(trigger, "aria-expanded", String(open));
                    setAttributeIfChanged$8(content, "data-state", state);
                    setAttributeIfChanged$8(content, "aria-hidden", String(!open));
                    setOpenState(content, open);
                    if (open) {
                        requestAnimationFrame(positionContent);
                    }
                    else if (restoreFocus) {
                        trigger.focus({ preventScroll: true });
                    }
                    if (notifyApplication) {
                        element.dispatchEvent(new CustomEvent("angularcss:select-open-change", {
                            bubbles: true,
                            detail: { open },
                        }));
                    }
                };
                const highlightItem = (index) => {
                    if (!items.some((item) => !isDisabled(item)))
                        return;
                    let nextIndex = (index + items.length) % items.length;
                    while (isDisabled(items[nextIndex])) {
                        nextIndex = (nextIndex + 1) % items.length;
                    }
                    activeIndex = nextIndex;
                    items.forEach((item, itemIndex) => {
                        setAttributeIfChanged$8(item, "data-highlighted", String(itemIndex === activeIndex));
                    });
                    setAttributeIfChanged$8(trigger, "aria-activedescendant", items[activeIndex].id);
                    if (open) {
                        items[activeIndex].scrollIntoView({ block: "nearest" });
                        syncScrollState();
                    }
                };
                const selectedIndex = () => items.findIndex((item) => item.getAttribute("aria-selected") === "true");
                const selectItem = (item) => {
                    if (isDisabled(item))
                        return;
                    items.forEach((option) => {
                        setAttributeIfChanged$8(option, "aria-selected", String(option === item));
                    });
                    highlightItem(items.indexOf(item));
                    const itemText = item.textContent.trim() || "";
                    const value = item.getAttribute("data-value") ?? itemText;
                    const valueSlot = owned(valueSelector$1, HTMLElement);
                    const applicationOwnsValue = Boolean(valueSlot?.hasAttribute("ng-bind") ??
                        valueSlot?.hasAttribute("ng-model") ??
                        valueSlot?.hasAttribute("data-application-value"));
                    if (valueSlot && !applicationOwnsValue) {
                        valueSlot.textContent = itemText;
                    }
                    setAttributeIfChanged$8(element, "data-value", value);
                    element.dispatchEvent(new CustomEvent("angularcss:select", {
                        bubbles: true,
                        detail: { item, value },
                    }));
                    setOpen(false, true, true);
                };
                const moveHighlight = (direction) => {
                    if (!items.some((item) => !isDisabled(item)))
                        return;
                    let nextActiveIndex = activeIndex;
                    do {
                        nextActiveIndex =
                            (nextActiveIndex + direction + items.length) % items.length;
                    } while (isDisabled(items[nextActiveIndex]));
                    highlightItem(nextActiveIndex);
                };
                const highlightBoundary = (direction) => {
                    const boundaryIndex = direction === 1
                        ? items.findIndex((item) => !isDisabled(item))
                        : items.findLastIndex((item) => !isDisabled(item));
                    if (boundaryIndex >= 0)
                        highlightItem(boundaryIndex);
                };
                const bindItem = (item) => {
                    if (!item.id)
                        item.id = `select-item-${String(selectIdCounter++)}`;
                    setAttributeIfChanged$8(item, "role", item.getAttribute("role") ?? "option");
                    setAttributeIfChanged$8(item, "tabindex", "-1");
                    if (isDisabled(item)) {
                        setAttributeIfChanged$8(item, "aria-disabled", "true");
                    }
                    if (cleanupItems.has(item))
                        return;
                    const handleItemClick = () => {
                        selectItem(item);
                    };
                    item.addEventListener("click", handleItemClick);
                    cleanupItems.set(item, () => {
                        item.removeEventListener("click", handleItemClick);
                    });
                };
                const bindScrollControl = (control, direction) => {
                    if (cleanupScrollControls.has(control))
                        return;
                    if (control instanceof HTMLButtonElement &&
                        !control.hasAttribute("type")) {
                        control.type = "button";
                    }
                    if (!control.hasAttribute("aria-label")) {
                        control.setAttribute("aria-label", direction === 1 ? "Scroll options down" : "Scroll options up");
                    }
                    const scroll = () => {
                        content.scrollBy({
                            behavior: "smooth",
                            top: direction * Math.max(32, content.clientHeight * 0.6),
                        });
                    };
                    control.addEventListener("click", scroll);
                    cleanupScrollControls.set(control, () => {
                        control.removeEventListener("click", scroll);
                    });
                };
                const syncStructure = () => {
                    syncChrome();
                    const previousActiveItem = activeIndex < 0 ? undefined : items.at(activeIndex);
                    items = ownedAll(itemSelector$2);
                    items.forEach(bindItem);
                    ownedAll(groupSelector).forEach((group) => {
                        setAttributeIfChanged$8(group, "role", "group");
                        const label = queryAll(group, labelSelector$1).find((candidate) => candidate.closest(groupSelector) === group);
                        if (label) {
                            if (!label.id)
                                label.id = `select-label-${String(selectIdCounter++)}`;
                            setAttributeIfChanged$8(group, "aria-labelledby", label.id);
                        }
                    });
                    ownedAll(separatorSelector).forEach((separator) => {
                        setAttributeIfChanged$8(separator, "role", "separator");
                        setAttributeIfChanged$8(separator, "aria-orientation", "horizontal");
                    });
                    ownedAll(scrollUpSelector).forEach((control) => {
                        bindScrollControl(control, -1);
                    });
                    ownedAll(scrollDownSelector).forEach((control) => {
                        bindScrollControl(control, 1);
                    });
                    cleanupItems.forEach((cleanup, item) => {
                        if (!item.isConnected || !isOwned(item)) {
                            cleanup();
                            cleanupItems.delete(item);
                        }
                    });
                    cleanupScrollControls.forEach((cleanup, control) => {
                        if (!control.isConnected || !isOwned(control)) {
                            cleanup();
                            cleanupScrollControls.delete(control);
                        }
                    });
                    const selected = selectedIndex();
                    const previous = previousActiveItem
                        ? items.indexOf(previousActiveItem)
                        : -1;
                    const next = selected >= 0 ? selected : previous >= 0 ? previous : 0;
                    if (items.length)
                        highlightItem(next);
                    if (selected >= 0) {
                        setAttributeIfChanged$8(element, "data-value", items[selected].getAttribute("data-value") ??
                            items[selected].textContent.trim());
                    }
                    if (open)
                        requestAnimationFrame(positionContent);
                };
                const handleTriggerClick = (event) => {
                    event.preventDefault();
                    if (isDisabled(trigger))
                        return;
                    setOpen(!open, false, true);
                };
                const handleDocumentClick = (event) => {
                    if (open &&
                        openAtPointerDown &&
                        event.target instanceof Node &&
                        !element.contains(event.target)) {
                        setOpen(false, false, true);
                    }
                };
                const handleDocumentPointerDown = () => {
                    openAtPointerDown = open;
                };
                const handleFocusOutside = (event) => {
                    if (open &&
                        event.target instanceof Node &&
                        !element.contains(event.target)) {
                        setOpen(false, false, true);
                    }
                };
                const handleTypeahead = (key) => {
                    window.clearTimeout(typeaheadTimer);
                    typeahead += key.toLocaleLowerCase();
                    typeaheadTimer = window.setTimeout(() => {
                        typeahead = "";
                    }, 500);
                    const start = Math.max(activeIndex + 1, 0);
                    const ordered = [...items.slice(start), ...items.slice(0, start)];
                    const match = ordered.find((item) => !isDisabled(item) &&
                        item.textContent.trim().toLocaleLowerCase().startsWith(typeahead));
                    if (match)
                        highlightItem(items.indexOf(match));
                };
                const handleKeydown = (event) => {
                    if (event.key === "Tab") {
                        setOpen(false, false, true);
                        return;
                    }
                    if (event.key === "Escape" && open) {
                        event.preventDefault();
                        event.stopPropagation();
                        setOpen(false, true, true);
                        return;
                    }
                    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                        event.preventDefault();
                        if (!open)
                            setOpen(true, false, true);
                        moveHighlight(event.key === "ArrowDown" ? 1 : -1);
                        return;
                    }
                    if ((event.key === "Home" || event.key === "End") && open) {
                        event.preventDefault();
                        highlightBoundary(event.key === "Home" ? 1 : -1);
                        return;
                    }
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        if (!open) {
                            setOpen(true, false, true);
                            return;
                        }
                        const activeItem = activeIndex < 0 ? undefined : items.at(activeIndex);
                        if (activeItem)
                            selectItem(activeItem);
                        return;
                    }
                    if (event.key.length === 1 && /\S/.test(event.key)) {
                        handleTypeahead(event.key);
                    }
                };
                const observer = new MutationObserver((records) => {
                    syncStructure();
                    if (records.some((record) => record.target === element &&
                        (record.attributeName === "data-open" ||
                            record.attributeName === "open"))) {
                        const authoredOpen = element.hasAttribute("open")
                            ? element.getAttribute("open") === "true"
                            : element.getAttribute("data-open") === "true";
                        if (authoredOpen !== open)
                            setOpen(authoredOpen);
                    }
                });
                observer.observe(element, {
                    attributes: true,
                    attributeFilter: [
                        "align-item-with-trigger",
                        "aria-disabled",
                        "aria-selected",
                        "data-align-trigger",
                        "data-disabled",
                        "data-open",
                        "data-value",
                        "dir",
                        "disabled",
                        "hidden",
                        "open",
                    ],
                    childList: true,
                    subtree: true,
                });
                const directionObserver = directionOwner === element
                    ? null
                    : new MutationObserver(() => {
                        syncChrome();
                        requestAnimationFrame(positionContent);
                    });
                directionObserver?.observe(directionOwner, {
                    attributes: true,
                    attributeFilter: ["dir"],
                });
                trigger.addEventListener("click", handleTriggerClick);
                element.addEventListener("keydown", handleKeydown);
                content.addEventListener("scroll", syncScrollState, { passive: true });
                document.addEventListener("pointerdown", handleDocumentPointerDown, true);
                document.addEventListener("click", handleDocumentClick);
                document.addEventListener("focusin", handleFocusOutside);
                window.addEventListener("resize", positionContent);
                syncStructure();
                setOpen(open);
                onDestroy(scope, () => {
                    observer.disconnect();
                    directionObserver?.disconnect();
                    window.clearTimeout(typeaheadTimer);
                    trigger.removeEventListener("click", handleTriggerClick);
                    element.removeEventListener("keydown", handleKeydown);
                    content.removeEventListener("scroll", syncScrollState);
                    document.removeEventListener("pointerdown", handleDocumentPointerDown, true);
                    document.removeEventListener("click", handleDocumentClick);
                    document.removeEventListener("focusin", handleFocusOutside);
                    window.removeEventListener("resize", positionContent);
                    cleanupItems.forEach((cleanup) => {
                        cleanup();
                    });
                    cleanupItems.clear();
                    cleanupScrollControls.forEach((cleanup) => {
                        cleanup();
                    });
                    cleanupScrollControls.clear();
                });
            },
        };
    }

    const itemSelector$1 = '[data-slot="navigation-menu-item"], [ng-navigation-menu-item]';
    const triggerSelector$1 = '[data-slot="navigation-menu-trigger"], [ng-navigation-menu-trigger]';
    const contentSelector$2 = '[data-slot="navigation-menu-content"], [ng-navigation-menu-content]';
    const linkSelector$1 = '[data-slot="navigation-menu-link"], [ng-navigation-menu-link]';
    const listSelector$1 = '[data-slot="navigation-menu-list"], [ng-navigation-menu-list]';
    let navigationMenuId = 0;
    const setAttribute$3 = (element, name, value) => {
        if (element.getAttribute(name) !== value) {
            element.setAttribute(name, value);
        }
    };
    const directChild = (element, selector) => Array.from(element.children).find((child) => child instanceof HTMLElement && child.matches(selector)) ?? null;
    function navigationMenuDirective() {
        return {
            link(scope, element) {
                const list = query(element, listSelector$1, HTMLElement);
                const entries = [];
                const triggers = [];
                const topLevelControls = [];
                const boundEntries = new Map();
                const directionOwner = element.closest("[dir]") ?? element;
                let initialized = false;
                const getDirection = () => element.closest("[dir]")?.getAttribute("dir") === "rtl"
                    ? "rtl"
                    : "ltr";
                const getHorizontalDirection = (key) => (key === "ArrowRight") === (getDirection() === "ltr") ? 1 : -1;
                const syncDirection = () => {
                    const direction = getDirection();
                    setAttribute$3(element, "data-direction", direction);
                    entries.forEach(({ content }) => {
                        setAttribute$3(content, "data-direction", direction);
                    });
                };
                const syncRootState = () => {
                    const open = entries.some((entry) => entry.open);
                    setAttribute$3(element, "data-open", String(open));
                    setAttribute$3(element, "data-state", open ? "open" : "closed");
                };
                const getContentItems = (content) => Array.from(content.querySelectorAll(`${linkSelector$1}, button, [tabindex]`)).filter((item) => !isDisabled(item) &&
                    !item.hidden &&
                    item.getAttribute("aria-hidden") !== "true");
                const positionContent = (content) => {
                    content.style.removeProperty("--navigation-menu-content-offset");
                    const bounds = content.getBoundingClientRect();
                    const viewportPadding = 12;
                    const offset = bounds.left < viewportPadding
                        ? viewportPadding - bounds.left
                        : bounds.right > window.innerWidth - viewportPadding
                            ? window.innerWidth - viewportPadding - bounds.right
                            : 0;
                    content.style.setProperty("--navigation-menu-content-offset", `${String(offset)}px`);
                };
                const setMenuState = (index, open, focus = false) => {
                    const entry = entries.at(index);
                    if (!entry)
                        return;
                    entry.open = open;
                    const state = open ? "open" : "closed";
                    setAttribute$3(entry.item, "data-state", state);
                    setAttribute$3(entry.trigger, "data-state", state);
                    setAttribute$3(entry.trigger, "aria-expanded", String(open));
                    if (entry.controlledBy !== "data-state") {
                        setAttribute$3(entry.content, "data-state", state);
                    }
                    setAttribute$3(entry.content, "aria-hidden", String(!open));
                    if (entry.controlledBy === "data-open") {
                        entry.content.hidden = !open;
                    }
                    else {
                        setOpenState(entry.content, open);
                    }
                    syncRootState();
                    if (open)
                        positionContent(entry.content);
                    if (open && focus) {
                        getContentItems(entry.content)[0]?.focus({ preventScroll: true });
                    }
                };
                const closeAll = () => {
                    entries.forEach((entry, index) => {
                        if (!entry.controlledBy)
                            setMenuState(index, false);
                    });
                };
                const openMenu = (index, focus = false) => {
                    if (index < 0 || isDisabled(entries[index]?.trigger))
                        return;
                    closeAll();
                    setMenuState(index, true, focus);
                };
                const getEntryIndex = (entry) => entries.indexOf(entry);
                const getEntryForControl = (control) => entries.find((entry) => entry.trigger === control);
                const getEntryForContent = (content) => entries.find((entry) => entry.content === content);
                const getEnabledControlIndex = (index, direction) => {
                    if (!topLevelControls.length)
                        return -1;
                    let candidate = nextIndex(index, topLevelControls.length, direction);
                    let safety = 0;
                    while (isDisabled(topLevelControls[candidate]) &&
                        safety < topLevelControls.length) {
                        candidate = nextIndex(candidate, topLevelControls.length, direction);
                        safety += 1;
                    }
                    return isDisabled(topLevelControls[candidate]) ? -1 : candidate;
                };
                const getBoundaryControlIndex = (fromEnd) => {
                    const indexes = topLevelControls.map((_, index) => index);
                    if (fromEnd)
                        indexes.reverse();
                    return (indexes.find((index) => !isDisabled(topLevelControls[index])) ?? -1);
                };
                const activateTopLevelControl = (control, keepDisclosureOpen) => {
                    control.focus({ preventScroll: true });
                    if (!keepDisclosureOpen)
                        return;
                    const entry = getEntryForControl(control);
                    if (entry) {
                        openMenu(getEntryIndex(entry));
                    }
                    else {
                        closeAll();
                    }
                };
                const bindItem = (item) => {
                    if (boundEntries.has(item))
                        return;
                    const trigger = directChild(item, triggerSelector$1);
                    const content = directChild(item, contentSelector$2);
                    if (!trigger || !content)
                        return;
                    const triggerId = trigger.id || `navigation-menu-trigger-${String(navigationMenuId++)}`;
                    const contentId = content.id || `${triggerId}-content`;
                    trigger.id = triggerId;
                    content.id = contentId;
                    setAttribute$3(trigger, "aria-haspopup", "true");
                    setAttribute$3(trigger, "aria-controls", contentId);
                    setAttribute$3(content, "aria-labelledby", triggerId);
                    const controlledBy = content.hasAttribute("data-open")
                        ? "data-open"
                        : content.hasAttribute("data-state")
                            ? "data-state"
                            : null;
                    const entry = {
                        item,
                        trigger,
                        content,
                        controlledBy,
                        open: content.getAttribute("data-open") === "true" ||
                            content.getAttribute("data-state") === "open",
                        disconnect: () => void 0,
                    };
                    entries.push(entry);
                    triggers.push(trigger);
                    boundEntries.set(item, entry);
                    const syncFromAttribute = () => {
                        if (!entry.controlledBy)
                            return;
                        const nextOpen = entry.controlledBy === "data-open"
                            ? content.getAttribute("data-open") === "true"
                            : content.getAttribute("data-state") === "open";
                        if (nextOpen === entry.open)
                            return;
                        if (nextOpen) {
                            openMenu(getEntryIndex(entry));
                        }
                        else {
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
                            if (entry.open &&
                                !item.matches(":hover") &&
                                !item.contains(document.activeElement)) {
                                setMenuState(getEntryIndex(entry), false);
                            }
                        }, 100);
                    };
                    const handleTriggerClick = () => {
                        if (isDisabled(trigger) || entry.controlledBy)
                            return;
                        if (entry.open && !openedByPointer) {
                            closeAll();
                        }
                        else if (entry.open) {
                            openedByPointer = false;
                        }
                        else {
                            openMenu(getEntryIndex(entry));
                        }
                    };
                    const handleTriggerKeydown = (event) => {
                        if (isDisabled(trigger) ||
                            entry.controlledBy ||
                            event.key !== "ArrowDown") {
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
                    const handlePointerLeave = () => {
                        scheduleClose();
                    };
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
                        }
                        else {
                            setMenuState(getEntryIndex(entry), false);
                        }
                    }
                };
                const syncTopLevelControls = () => {
                    if (!list)
                        return;
                    const controls = Array.from(list.children).flatMap((child) => {
                        if (!(child instanceof HTMLElement) || !child.matches(itemSelector$1)) {
                            return [];
                        }
                        const control = directChild(child, triggerSelector$1) ??
                            directChild(child, linkSelector$1);
                        return control ? [control] : [];
                    });
                    topLevelControls.splice(0, topLevelControls.length, ...controls);
                };
                const syncStructure = () => {
                    boundEntries.forEach((entry, item) => {
                        const replaced = directChild(item, triggerSelector$1) !== entry.trigger ||
                            directChild(item, contentSelector$2) !== entry.content;
                        if (!item.isConnected || !element.contains(item) || replaced) {
                            entry.disconnect();
                            boundEntries.delete(item);
                            const index = entries.indexOf(entry);
                            if (index >= 0)
                                entries.splice(index, 1);
                        }
                    });
                    queryAll(element, itemSelector$1).forEach(bindItem);
                    entries.sort((left, right) => {
                        const position = left.item.compareDocumentPosition(right.item);
                        return position & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
                    });
                    triggers.splice(0, triggers.length, ...entries.map(({ trigger }) => trigger));
                    syncTopLevelControls();
                    syncDirection();
                    syncRootState();
                };
                const handleKeydown = (event) => {
                    const active = document.activeElement instanceof HTMLElement
                        ? document.activeElement
                        : null;
                    if (!active || !element.contains(active))
                        return;
                    const activeContent = active.closest(contentSelector$2);
                    if (event.key === "Escape") {
                        if (!entries.some((entry) => entry.open))
                            return;
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
                        if (event.key === "ArrowDown" ||
                            event.key === "ArrowUp" ||
                            event.key === "Home" ||
                            event.key === "End") {
                            if (!contentItems.length)
                                return;
                            event.preventDefault();
                            const targetIndex = event.key === "Home"
                                ? 0
                                : event.key === "End"
                                    ? contentItems.length - 1
                                    : nextIndex(activeIndex, contentItems.length, event.key === "ArrowDown" ? 1 : -1);
                            contentItems[targetIndex].focus({ preventScroll: true });
                            return;
                        }
                        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
                            const entry = getEntryForContent(activeContent);
                            if (!entry)
                                return;
                            const controlIndex = topLevelControls.indexOf(entry.trigger);
                            const targetIndex = getEnabledControlIndex(controlIndex, getHorizontalDirection(event.key));
                            if (targetIndex < 0)
                                return;
                            event.preventDefault();
                            activateTopLevelControl(topLevelControls[targetIndex], true);
                        }
                        return;
                    }
                    const currentIndex = topLevelControls.indexOf(active);
                    if (currentIndex < 0)
                        return;
                    if (event.key !== "ArrowRight" &&
                        event.key !== "ArrowLeft" &&
                        event.key !== "Home" &&
                        event.key !== "End") {
                        return;
                    }
                    event.preventDefault();
                    const targetIndex = event.key === "Home" || event.key === "End"
                        ? getBoundaryControlIndex(event.key === "End")
                        : getEnabledControlIndex(currentIndex, getHorizontalDirection(event.key));
                    if (targetIndex < 0)
                        return;
                    activateTopLevelControl(topLevelControls[targetIndex], entries.some((entry) => entry.open));
                };
                const handleClick = (event) => {
                    const target = event.target instanceof Element
                        ? event.target.closest(linkSelector$1)
                        : null;
                    if (target && element.contains(target))
                        closeAll();
                };
                const handleDocumentClick = (event) => {
                    if (event.target instanceof Node && !element.contains(event.target)) {
                        closeAll();
                    }
                };
                const handleDocumentFocus = (event) => {
                    if (event.target instanceof Node && !element.contains(event.target)) {
                        closeAll();
                    }
                };
                const handleResize = () => {
                    entries
                        .filter((entry) => entry.open)
                        .forEach((entry) => {
                        positionContent(entry.content);
                    });
                };
                if (element.tagName !== "NAV" && !element.hasAttribute("role")) {
                    setAttribute$3(element, "role", "navigation");
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
                const directionObserver = directionOwner === element ? null : new MutationObserver(syncDirection);
                directionObserver?.observe(directionOwner, {
                    attributes: true,
                    attributeFilter: ["dir"],
                });
                syncStructure();
                let foundInitialOpen = false;
                entries.forEach((entry, index) => {
                    const keepOpen = entry.open && !foundInitialOpen;
                    if (keepOpen)
                        foundInitialOpen = true;
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
                    entries.forEach((entry) => {
                        entry.disconnect();
                    });
                });
            },
        };
    }

    const contentSelector$1 = '[data-slot="pagination-content"], [ng-pagination-content]';
    const linkSelector = '[data-slot="pagination-link"], [ng-pagination-link]';
    const itemSelector = '[data-slot="pagination-item"], [ng-pagination-item]';
    const previousNextSelector = '[data-slot="pagination-previous"], [ng-pagination-previous], [data-slot="pagination-next"], [ng-pagination-next]';
    const ellipsisSelector = '[data-slot="pagination-ellipsis"], [ng-pagination-ellipsis]';
    const interactiveSelector = `${linkSelector}, ${previousNextSelector}`;
    const controlSelector = `${previousNextSelector}, ${ellipsisSelector}`;
    const setAttribute$2 = (element, name, value) => {
        if (element.getAttribute(name) !== value) {
            element.setAttribute(name, value);
        }
    };
    const removeAttribute$1 = (element, name) => {
        if (element.hasAttribute(name)) {
            element.removeAttribute(name);
        }
    };
    function paginationDirective() {
        return {
            link(scope, element) {
                const activeSources = new WeakMap();
                setAttribute$2(element, "aria-label", element.getAttribute("aria-label") ?? "pagination");
                if (element.tagName !== "NAV" && !element.hasAttribute("role")) {
                    setAttribute$2(element, "role", "navigation");
                }
                const sync = () => {
                    queryAll(element, contentSelector$1).forEach((paginationContent) => {
                        if (paginationContent.tagName !== "UL" &&
                            paginationContent.tagName !== "OL" &&
                            !paginationContent.hasAttribute("role")) {
                            setAttribute$2(paginationContent, "role", "list");
                        }
                    });
                    queryAll(element, itemSelector).forEach((item) => {
                        if (item.tagName !== "LI" && !item.hasAttribute("role")) {
                            setAttribute$2(item, "role", "listitem");
                        }
                    });
                    queryAll(element, interactiveSelector).forEach((link) => {
                        let source = activeSources.get(link);
                        if (!source ||
                            (source === "aria" && link.hasAttribute("data-active"))) {
                            source = link.hasAttribute("data-active") ? "data" : "aria";
                            activeSources.set(link, source);
                        }
                        const active = source === "data"
                            ? link.getAttribute("data-active") === "true"
                            : link.getAttribute("aria-current") === "page";
                        if (active)
                            setAttribute$2(link, "aria-current", "page");
                        else
                            removeAttribute$1(link, "aria-current");
                    });
                    queryAll(element, controlSelector).forEach((link) => {
                        setAttribute$2(link, "data-disabled", String(link.getAttribute("aria-disabled") === "true"));
                        if (link.matches(ellipsisSelector)) {
                            setAttribute$2(link, "aria-hidden", "true");
                        }
                    });
                };
                const observer = new MutationObserver(sync);
                observer.observe(element, {
                    attributes: true,
                    attributeFilter: [
                        "aria-current",
                        "aria-disabled",
                        "data-active",
                        "data-slot",
                    ],
                    childList: true,
                    subtree: true,
                });
                sync();
                onDestroy(scope, () => {
                    observer.disconnect();
                });
            },
        };
    }

    let popoverIdCounter = 0;
    const alignments = new Set(["center", "end", "start"]);
    const sides$1 = new Set(["bottom", "left", "right", "top"]);
    const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';
    const setAttributeIfChanged$7 = (element, name, value) => {
        if (element.getAttribute(name) !== value) {
            element.setAttribute(name, value);
        }
    };
    function popoverDirective() {
        return {
            link(scope, element) {
                const directionOwner = element.closest("[dir]") ?? element;
                const trigger = query(element, '[data-slot="popover-trigger"], [ng-popover-trigger]', HTMLElement);
                const content = query(element, '[data-slot="popover-content"], [ng-popover-content]', HTMLElement);
                if (!trigger || !content)
                    return;
                const getDirection = () => element.closest("[dir]")?.getAttribute("dir") === "rtl"
                    ? "rtl"
                    : "ltr";
                const syncDirection = () => {
                    const direction = getDirection();
                    setAttributeIfChanged$7(element, "data-direction", direction);
                    setAttributeIfChanged$7(content, "data-direction", direction);
                };
                const syncPlacement = () => {
                    const authoredSide = content.getAttribute("side") ?? content.getAttribute("data-side");
                    const side = authoredSide && sides$1.has(authoredSide) ? authoredSide : "bottom";
                    const authoredAlign = content.getAttribute("align") ?? content.getAttribute("data-align");
                    const align = authoredAlign && alignments.has(authoredAlign)
                        ? authoredAlign
                        : "center";
                    setAttributeIfChanged$7(content, "data-side", side);
                    setAttributeIfChanged$7(content, "data-align", align);
                };
                const contentId = content.id || `popover-content-${String(popoverIdCounter++)}`;
                content.id = contentId;
                trigger.setAttribute("aria-haspopup", "dialog");
                trigger.setAttribute("aria-controls", contentId);
                content.setAttribute("role", content.getAttribute("role") ?? "dialog");
                content.setAttribute("aria-modal", content.getAttribute("aria-modal") ?? "false");
                content.setAttribute("tabindex", content.getAttribute("tabindex") ?? "-1");
                let open = element.getAttribute("data-open") === "true" ||
                    content.getAttribute("data-open") === "true";
                let initialized = false;
                const focusContent = () => {
                    const firstFocusable = content.querySelector(focusableSelector);
                    (firstFocusable ?? content).focus({ preventScroll: true });
                };
                const setOpen = (nextOpen, restoreOnClose = true) => {
                    const wasOpen = open;
                    const shouldFocus = nextOpen && (!wasOpen || !initialized);
                    const state = nextOpen ? "open" : "closed";
                    open = nextOpen;
                    setAttributeIfChanged$7(element, "data-open", String(nextOpen));
                    setAttributeIfChanged$7(element, "data-state", state);
                    setAttributeIfChanged$7(trigger, "data-state", state);
                    setAttributeIfChanged$7(trigger, "aria-expanded", String(nextOpen));
                    setAttributeIfChanged$7(trigger, "aria-controls", contentId);
                    setAttributeIfChanged$7(content, "data-state", state);
                    setAttributeIfChanged$7(content, "aria-hidden", String(!nextOpen));
                    setOpenState(content, nextOpen);
                    if (!nextOpen && wasOpen && restoreOnClose) {
                        restoreFocus(trigger);
                    }
                    else if (shouldFocus) {
                        focusContent();
                    }
                    initialized = true;
                };
                const handleTriggerClick = (event) => {
                    event.preventDefault();
                    if (isDisabled(trigger))
                        return;
                    setOpen(!open);
                };
                const closeOnOutsideClick = (event) => {
                    if (open &&
                        event.target instanceof Node &&
                        !element.contains(event.target)) {
                        setOpen(false, false);
                    }
                };
                const closeOnFocusOutside = (event) => {
                    if (open &&
                        event.target instanceof Node &&
                        !element.contains(event.target)) {
                        setOpen(false, false);
                    }
                };
                const syncFromAttribute = (source) => {
                    const nextOpen = source.getAttribute("data-open") === "true";
                    if (nextOpen !== open) {
                        setOpen(nextOpen);
                    }
                };
                const openObserver = new MutationObserver((records) => {
                    syncPlacement();
                    if (records.some((record) => record.attributeName === "data-open")) {
                        syncFromAttribute(content);
                    }
                });
                openObserver.observe(content, {
                    attributes: true,
                    attributeFilter: [
                        "align",
                        "data-align",
                        "data-open",
                        "data-side",
                        "side",
                    ],
                });
                const rootOpenObserver = new MutationObserver(() => {
                    syncDirection();
                    syncFromAttribute(element);
                });
                rootOpenObserver.observe(element, {
                    attributes: true,
                    attributeFilter: ["data-open", "dir"],
                });
                const directionObserver = directionOwner === element ? null : new MutationObserver(syncDirection);
                directionObserver?.observe(directionOwner, {
                    attributes: true,
                    attributeFilter: ["dir"],
                });
                syncDirection();
                syncPlacement();
                setOpen(open);
                const cleanupEscapeClose = bindEscapeClose([trigger, content], () => open, () => {
                    setOpen(false);
                });
                trigger.addEventListener("click", handleTriggerClick);
                document.addEventListener("click", closeOnOutsideClick);
                document.addEventListener("focusin", closeOnFocusOutside);
                onDestroy(scope, () => {
                    openObserver.disconnect();
                    rootOpenObserver.disconnect();
                    directionObserver?.disconnect();
                    cleanupEscapeClose();
                    trigger.removeEventListener("click", handleTriggerClick);
                    document.removeEventListener("click", closeOnOutsideClick);
                    document.removeEventListener("focusin", closeOnFocusOutside);
                });
            },
        };
    }

    const indicatorSelector = '[data-slot="progress-indicator"], [ng-progress-indicator]';
    const labelSelector = '[data-slot="progress-label"], [ng-progress-label]';
    const valueSelector = '[data-slot="progress-value"], [ng-progress-value]';
    let progressId = 0;
    const setAttribute$1 = (element, name, value) => {
        if (element.getAttribute(name) !== value) {
            element.setAttribute(name, value);
        }
    };
    const removeAttribute = (element, name) => {
        if (element.hasAttribute(name))
            element.removeAttribute(name);
    };
    const numericAttribute = (element, name) => {
        const attribute = element.getAttribute(name);
        if (attribute === null)
            return null;
        const value = Number(attribute);
        return Number.isFinite(value) ? value : null;
    };
    function progressDirective() {
        return {
            link(scope, element) {
                let generatedLabelledBy = null;
                const sync = () => {
                    const authoredMax = numericAttribute(element, "max");
                    const max = authoredMax !== null && authoredMax > 0 ? authoredMax : 100;
                    const authoredValue = numericAttribute(element, "value");
                    const determinate = authoredValue !== null;
                    const value = determinate
                        ? Math.min(max, Math.max(0, authoredValue))
                        : 0;
                    const rawPercent = max === 0 ? 0 : (value / max) * 100;
                    const percent = Math.round(rawPercent * 1_000_000) / 1_000_000;
                    const formattedPercent = `${String(percent)}%`;
                    element.style.setProperty("--value", formattedPercent);
                    setAttribute$1(element, "role", element.getAttribute("role") ?? "progressbar");
                    setAttribute$1(element, "aria-valuemin", "0");
                    setAttribute$1(element, "aria-valuemax", String(max));
                    if (determinate) {
                        setAttribute$1(element, "aria-valuenow", String(value));
                        setAttribute$1(element, "data-value", String(value));
                    }
                    else {
                        removeAttribute(element, "aria-valuenow");
                        removeAttribute(element, "data-value");
                    }
                    query(element, indicatorSelector, HTMLElement)?.style.setProperty("--value", formattedPercent);
                    const label = query(element, labelSelector, HTMLElement);
                    if (label && !element.hasAttribute("aria-label")) {
                        label.id = label.id || `progress-label-${String(progressId++)}`;
                        if (!element.hasAttribute("aria-labelledby") ||
                            element.getAttribute("aria-labelledby") === generatedLabelledBy) {
                            generatedLabelledBy = label.id;
                            setAttribute$1(element, "aria-labelledby", label.id);
                        }
                    }
                    else if (generatedLabelledBy &&
                        element.getAttribute("aria-labelledby") === generatedLabelledBy) {
                        removeAttribute(element, "aria-labelledby");
                        generatedLabelledBy = null;
                    }
                    const valueElement = query(element, valueSelector, HTMLElement);
                    if (valueElement &&
                        !valueElement.hasAttribute("ng-bind") &&
                        valueElement.getAttribute("data-value-format") !== "custom") {
                        const text = determinate ? formattedPercent : "";
                        if (valueElement.textContent !== text)
                            valueElement.textContent = text;
                    }
                };
                const observer = new MutationObserver(sync);
                observer.observe(element, {
                    attributes: true,
                    attributeFilter: ["max", "value"],
                    childList: true,
                    subtree: true,
                });
                sync();
                queueMicrotask(sync);
                onDestroy(scope, () => {
                    observer.disconnect();
                });
            },
        };
    }

    const radioSelector = 'input[type="radio"]';
    function radioGroupDirective() {
        return {
            link(scope, element) {
                let radios = [];
                const boundRadios = new Set();
                let initialSyncFrame = null;
                const sync = () => {
                    radios = queryAll(element, radioSelector);
                    radios.forEach((radio) => {
                        bindRadio(radio);
                        const checked = radio.checked;
                        radio.setAttribute("role", radio.getAttribute("role") ?? "radio");
                        radio.setAttribute("data-state", checked ? "checked" : "unchecked");
                        radio.setAttribute("aria-checked", String(checked));
                    });
                };
                const bindRadio = (radio) => {
                    if (boundRadios.has(radio))
                        return;
                    boundRadios.add(radio);
                    radio.addEventListener("change", sync);
                };
                element.setAttribute("role", element.getAttribute("role") ?? "radiogroup");
                const handleKeydown = (event) => {
                    if (!event.key.startsWith("Arrow"))
                        return;
                    queueMicrotask(sync);
                };
                const observer = new MutationObserver(sync);
                observer.observe(element, {
                    attributes: true,
                    attributeFilter: ["checked", "class"],
                    childList: true,
                    subtree: true,
                });
                element.addEventListener("keydown", handleKeydown);
                sync();
                initialSyncFrame = requestAnimationFrame(() => {
                    initialSyncFrame = null;
                    sync();
                });
                onDestroy(scope, () => {
                    if (initialSyncFrame !== null)
                        cancelAnimationFrame(initialSyncFrame);
                    observer.disconnect();
                    boundRadios.forEach((radio) => {
                        radio.removeEventListener("change", sync);
                    });
                    boundRadios.clear();
                    element.removeEventListener("keydown", handleKeydown);
                });
            },
        };
    }

    const DEFAULT_MIN_SIZE = 0.25;
    const DEFAULT_MAX_SIZE = 4;
    const DEFAULT_STEP = 0.25;
    let resizableIdCounter = 0;
    const GROUP_SELECTOR = '[data-slot="resizable-panel-group"], [ng-resizable-panel-group]';
    const PANEL_SELECTOR = '[data-slot="resizable-panel"], [ng-resizable-panel]';
    const HANDLE_SELECTOR = '[data-slot="resizable-handle"], [ng-resizable-handle]';
    const numberAttribute = (element, attribute, fallback) => {
        const rawValue = element.getAttribute(attribute);
        if (rawValue === null || rawValue === "")
            return fallback;
        const value = Number(rawValue);
        return Number.isFinite(value) ? value : fallback;
    };
    const setAttributeIfChanged$6 = (element, name, value) => {
        if (element.getAttribute(name) !== value) {
            element.setAttribute(name, value);
        }
    };
    function resizablePanelGroupDirective() {
        return {
            link(scope, element) {
                const ownedDescendants = (selector) => queryAll(element, selector).filter((descendant) => descendant.closest(GROUP_SELECTOR) === element);
                let panels = ownedDescendants(PANEL_SELECTOR);
                let handles = ownedDescendants(HANDLE_SELECTOR);
                const ownedHandleOrientations = new WeakSet();
                const cleanupHandles = new WeakMap();
                const knownHandles = new Set();
                const directionOwner = element.closest("[dir]") ?? element;
                const panelSize = (panel) => Number(panel.style.getPropertyValue("--panel-size")) || 1;
                const getGroupOrientation = () => {
                    const orientation = element.getAttribute("orientation");
                    if (orientation === "vertical")
                        return "vertical";
                    if (orientation === "horizontal")
                        return "horizontal";
                    return element.getAttribute("data-orientation") === "vertical"
                        ? "vertical"
                        : "horizontal";
                };
                const getDefaultHandleOrientation = () => getGroupOrientation() === "vertical" ? "horizontal" : "vertical";
                const syncOrientation = () => {
                    const groupOrientation = getGroupOrientation();
                    setAttributeIfChanged$6(element, "data-orientation", groupOrientation);
                    setAttributeIfChanged$6(element, "data-direction", element.closest("[dir]")?.getAttribute("dir") === "rtl"
                        ? "rtl"
                        : "ltr");
                    handles.forEach((handle) => {
                        if (!handle.hasAttribute("aria-orientation") ||
                            ownedHandleOrientations.has(handle)) {
                            setAttributeIfChanged$6(handle, "aria-orientation", getDefaultHandleOrientation());
                            ownedHandleOrientations.add(handle);
                        }
                        setAttributeIfChanged$6(handle, "data-orientation", handle.getAttribute("aria-orientation") ?? "vertical");
                    });
                };
                const syncHandle = (handle, before) => {
                    const value = panelSize(before);
                    const min = numberAttribute(handle, "data-min-size", numberAttribute(before, "data-min-size", DEFAULT_MIN_SIZE));
                    const max = numberAttribute(handle, "data-max-size", numberAttribute(before, "data-max-size", DEFAULT_MAX_SIZE));
                    handle.setAttribute("aria-valuemin", String(min));
                    handle.setAttribute("aria-valuemax", String(max));
                    handle.setAttribute("aria-valuenow", String(value));
                };
                const bindHandle = (handle) => {
                    if (cleanupHandles.has(handle))
                        return;
                    handle.setAttribute("tabindex", handle.getAttribute("tabindex") ?? "0");
                    handle.setAttribute("role", handle.getAttribute("role") ?? "separator");
                    let stopPointerResize = null;
                    const handlePointerDown = (event) => {
                        if (event.button !== 0 ||
                            handle.getAttribute("aria-disabled") === "true") {
                            return;
                        }
                        const index = handles.indexOf(handle);
                        const before = panels.at(index);
                        const after = panels.at(index + 1);
                        if (!before || !after)
                            return;
                        event.preventDefault();
                        handle.focus({ preventScroll: true });
                        const vertical = getGroupOrientation() === "vertical";
                        const beforeSize = panelSize(before);
                        const afterSize = panelSize(after);
                        const totalSize = beforeSize + afterSize;
                        const beforeRect = before.getBoundingClientRect();
                        const afterRect = after.getBoundingClientRect();
                        const pairPixels = vertical
                            ? beforeRect.height + afterRect.height
                            : beforeRect.width + afterRect.width;
                        if (pairPixels <= 0)
                            return;
                        const startPosition = vertical ? event.clientY : event.clientX;
                        const min = numberAttribute(handle, "data-min-size", numberAttribute(before, "data-min-size", DEFAULT_MIN_SIZE));
                        const max = numberAttribute(handle, "data-max-size", numberAttribute(before, "data-max-size", DEFAULT_MAX_SIZE));
                        const afterMin = numberAttribute(after, "data-min-size", DEFAULT_MIN_SIZE);
                        const boundedMax = Math.min(max, totalSize - afterMin);
                        const rtl = !vertical && getComputedStyle(element).direction === "rtl";
                        const finish = () => {
                            window.removeEventListener("pointermove", move);
                            window.removeEventListener("pointerup", finish);
                            window.removeEventListener("pointercancel", finish);
                            handle.removeAttribute("data-resizing");
                            element.removeAttribute("data-resizing");
                            stopPointerResize = null;
                        };
                        const move = (moveEvent) => {
                            const position = vertical ? moveEvent.clientY : moveEvent.clientX;
                            const pixelDelta = (position - startPosition) * (rtl ? -1 : 1);
                            const sizeDelta = (pixelDelta / pairPixels) * totalSize;
                            const nextBeforeSize = Math.min(Math.max(beforeSize + sizeDelta, min), boundedMax);
                            before.style.setProperty("--panel-size", String(nextBeforeSize));
                            after.style.setProperty("--panel-size", String(totalSize - nextBeforeSize));
                            syncHandle(handle, before);
                        };
                        stopPointerResize?.();
                        stopPointerResize = finish;
                        handle.setAttribute("data-resizing", "true");
                        element.setAttribute("data-resizing", "true");
                        window.addEventListener("pointermove", move);
                        window.addEventListener("pointerup", finish);
                        window.addEventListener("pointercancel", finish);
                    };
                    const handleKeydown = (event) => {
                        const index = handles.indexOf(handle);
                        const orientation = handle.getAttribute("aria-orientation");
                        const horizontal = orientation === "horizontal";
                        const supportedKeys = horizontal
                            ? ["ArrowUp", "ArrowDown", "Home", "End"]
                            : ["ArrowLeft", "ArrowRight", "Home", "End"];
                        if (!supportedKeys.includes(event.key))
                            return;
                        const before = panels.at(index);
                        const after = panels.at(index + 1);
                        if (!before || !after)
                            return;
                        event.preventDefault();
                        const beforeSize = panelSize(before);
                        const afterSize = panelSize(after);
                        const totalSize = beforeSize + afterSize;
                        const min = numberAttribute(handle, "data-min-size", numberAttribute(before, "data-min-size", DEFAULT_MIN_SIZE));
                        const max = numberAttribute(handle, "data-max-size", numberAttribute(before, "data-max-size", DEFAULT_MAX_SIZE));
                        const afterMin = numberAttribute(after, "data-min-size", DEFAULT_MIN_SIZE);
                        const boundedMax = Math.min(max, totalSize - afterMin);
                        const step = numberAttribute(handle, "data-step", numberAttribute(element, "data-step", DEFAULT_STEP));
                        const rtl = getComputedStyle(element).direction === "rtl";
                        let nextBeforeSize = beforeSize;
                        if (event.key === "Home")
                            nextBeforeSize = min;
                        if (event.key === "End")
                            nextBeforeSize = boundedMax;
                        if (event.key === "ArrowRight") {
                            nextBeforeSize = beforeSize + (rtl ? -step : step);
                        }
                        if (event.key === "ArrowLeft") {
                            nextBeforeSize = beforeSize + (rtl ? step : -step);
                        }
                        if (event.key === "ArrowDown")
                            nextBeforeSize = beforeSize + step;
                        if (event.key === "ArrowUp")
                            nextBeforeSize = beforeSize - step;
                        nextBeforeSize = Math.min(Math.max(nextBeforeSize, min), boundedMax);
                        before.style.setProperty("--panel-size", String(nextBeforeSize));
                        after.style.setProperty("--panel-size", String(totalSize - nextBeforeSize));
                        syncHandle(handle, before);
                    };
                    handle.addEventListener("keydown", handleKeydown);
                    handle.addEventListener("pointerdown", handlePointerDown);
                    cleanupHandles.set(handle, () => {
                        stopPointerResize?.();
                        handle.removeEventListener("keydown", handleKeydown);
                        handle.removeEventListener("pointerdown", handlePointerDown);
                    });
                    knownHandles.add(handle);
                };
                const syncHandles = () => {
                    panels = ownedDescendants(PANEL_SELECTOR);
                    handles = ownedDescendants(HANDLE_SELECTOR);
                    syncOrientation();
                    handles.forEach((handle, index) => {
                        bindHandle(handle);
                        const before = panels.at(index);
                        const after = panels.at(index + 1);
                        if (before) {
                            if (!before.id)
                                before.id = `resizable-panel-${String(resizableIdCounter++)}`;
                            setAttributeIfChanged$6(before, "data-index", String(index));
                            setAttributeIfChanged$6(before, "data-size", String(panelSize(before)));
                            syncHandle(handle, before);
                        }
                        if (after) {
                            if (!after.id)
                                after.id = `resizable-panel-${String(resizableIdCounter++)}`;
                            setAttributeIfChanged$6(after, "data-index", String(index + 1));
                            setAttributeIfChanged$6(after, "data-size", String(panelSize(after)));
                        }
                        if (before && after) {
                            setAttributeIfChanged$6(handle, "aria-controls", `${before.id} ${after.id}`);
                        }
                    });
                };
                const panelObserver = new MutationObserver(syncHandles);
                panelObserver.observe(element, {
                    attributes: true,
                    attributeFilter: [
                        "aria-orientation",
                        "data-max-size",
                        "data-min-size",
                        "data-orientation",
                        "orientation",
                        "style",
                    ],
                    childList: true,
                    subtree: true,
                });
                const directionObserver = directionOwner === element ? null : new MutationObserver(syncHandles);
                directionObserver?.observe(directionOwner, {
                    attributes: true,
                    attributeFilter: ["dir"],
                });
                syncHandles();
                onDestroy(scope, () => {
                    panelObserver.disconnect();
                    directionObserver?.disconnect();
                    knownHandles.forEach((handle) => {
                        cleanupHandles.get(handle)?.();
                    });
                });
            },
        };
    }

    /**
     * Enhances a scrollable layout primitive by exposing scroll-state hooks and making
     * the viewport focusable with minimal semantic defaults.
     */
    function scrollAreaDirective() {
        return {
            link(scope, element) {
                const viewport = query(element, '[data-slot="scroll-area-viewport"], [ng-scroll-area-viewport]', HTMLElement);
                if (!viewport)
                    return;
                viewport.setAttribute("tabindex", viewport.getAttribute("tabindex") ?? "0");
                viewport.setAttribute("role", viewport.getAttribute("role") ?? "region");
                viewport.setAttribute("aria-label", viewport.getAttribute("aria-label") ??
                    element.getAttribute("aria-label") ??
                    "Scrollable content");
                const getDirection = () => viewport.closest("[dir]")?.getAttribute("dir") === "rtl"
                    ? "rtl"
                    : "ltr";
                const syncDirection = () => {
                    const direction = getDirection();
                    element.setAttribute("data-direction", direction);
                    viewport.setAttribute("data-direction", direction);
                };
                const scrollbarCleanups = new Map();
                const bindScrollbar = (scrollbar, orientation) => {
                    if (scrollbarCleanups.has(scrollbar))
                        return;
                    const handlePointerDown = (event) => {
                        if (event.button !== 0)
                            return;
                        event.preventDefault();
                        scrollbar.setPointerCapture(event.pointerId);
                        const updateScroll = (pointerEvent) => {
                            const bounds = scrollbar.getBoundingClientRect();
                            const horizontal = orientation === "horizontal";
                            const trackSize = horizontal ? bounds.width : bounds.height;
                            const viewportSize = horizontal
                                ? viewport.clientWidth
                                : viewport.clientHeight;
                            const scrollSize = horizontal
                                ? viewport.scrollWidth
                                : viewport.scrollHeight;
                            const maxScroll = Math.max(0, scrollSize - viewportSize);
                            if (trackSize <= 0 || maxScroll <= 0)
                                return;
                            const pointer = horizontal
                                ? pointerEvent.clientX - bounds.left
                                : pointerEvent.clientY - bounds.top;
                            const thumbSize = Math.max(18, trackSize * Math.min(1, viewportSize / scrollSize));
                            const fraction = Math.max(0, Math.min(1, (pointer - thumbSize / 2) / (trackSize - thumbSize)));
                            const nextScroll = fraction * maxScroll;
                            if (horizontal) {
                                viewport.scrollLeft =
                                    getDirection() === "rtl" ? -nextScroll : nextScroll;
                            }
                            else {
                                viewport.scrollTop = nextScroll;
                            }
                        };
                        const handlePointerMove = (pointerEvent) => {
                            if (pointerEvent.pointerId === event.pointerId) {
                                updateScroll(pointerEvent);
                            }
                        };
                        const handlePointerUp = (pointerEvent) => {
                            if (pointerEvent.pointerId !== event.pointerId)
                                return;
                            scrollbar.removeEventListener("pointermove", handlePointerMove);
                            scrollbar.removeEventListener("pointerup", handlePointerUp);
                            scrollbar.removeEventListener("pointercancel", handlePointerUp);
                        };
                        updateScroll(event);
                        scrollbar.addEventListener("pointermove", handlePointerMove);
                        scrollbar.addEventListener("pointerup", handlePointerUp);
                        scrollbar.addEventListener("pointercancel", handlePointerUp);
                    };
                    scrollbar.addEventListener("pointerdown", handlePointerDown);
                    scrollbarCleanups.set(scrollbar, () => {
                        scrollbar.removeEventListener("pointerdown", handlePointerDown);
                    });
                };
                const syncScrollbar = (scrollbar, orientation) => {
                    const horizontal = orientation === "horizontal";
                    const viewportSize = horizontal
                        ? viewport.clientWidth
                        : viewport.clientHeight;
                    const scrollSize = horizontal
                        ? viewport.scrollWidth
                        : viewport.scrollHeight;
                    const scrollPosition = horizontal
                        ? Math.abs(viewport.scrollLeft)
                        : viewport.scrollTop;
                    const trackSize = horizontal
                        ? scrollbar.clientWidth
                        : scrollbar.clientHeight;
                    const maxScroll = Math.max(0, scrollSize - viewportSize);
                    const thumb = query(scrollbar, '[data-slot="scroll-area-thumb"], [ng-scroll-area-thumb]', HTMLElement);
                    if (!thumb || trackSize <= 0 || scrollSize <= 0)
                        return;
                    const thumbSize = Math.max(18, trackSize * Math.min(1, viewportSize / scrollSize));
                    const offset = maxScroll > 0
                        ? (Math.min(maxScroll, scrollPosition) / maxScroll) *
                            (trackSize - thumbSize)
                        : 0;
                    thumb.style.setProperty(horizontal ? "width" : "height", `${String(thumbSize)}px`);
                    thumb.style.setProperty("transform", horizontal
                        ? `translateX(${String(offset)}px)`
                        : `translateY(${String(offset)}px)`);
                    thumb.setAttribute("data-size", String(Math.round(thumbSize)));
                    thumb.setAttribute("data-offset", String(Math.round(offset)));
                    bindScrollbar(scrollbar, orientation);
                };
                const syncState = () => {
                    syncDirection();
                    element.setAttribute("data-scrollable-y", String(viewport.scrollHeight > viewport.clientHeight));
                    element.setAttribute("data-scrollable-x", String(viewport.scrollWidth > viewport.clientWidth));
                    element.setAttribute("data-scroll-top", String(viewport.scrollTop));
                    element.setAttribute("data-scroll-left", String(viewport.scrollLeft));
                    element.setAttribute("data-scroll-at-top", String(viewport.scrollTop <= 0));
                    element.setAttribute("data-scroll-at-bottom", String(viewport.scrollTop + viewport.clientHeight >= viewport.scrollHeight));
                    queryAll(element, '[data-slot="scroll-area-scrollbar"], [ng-scroll-area-scrollbar]').forEach((scrollbar) => {
                        const orientation = scrollbar.getAttribute("data-orientation") === "horizontal"
                            ? "horizontal"
                            : "vertical";
                        scrollbar.setAttribute("data-orientation", orientation);
                        scrollbar.setAttribute("aria-hidden", "true");
                        scrollbar.setAttribute("data-visible", orientation === "horizontal"
                            ? (element.getAttribute("data-scrollable-x") ?? "false")
                            : (element.getAttribute("data-scrollable-y") ?? "false"));
                        syncScrollbar(scrollbar, orientation);
                    });
                    queryAll(element, '[data-slot="scroll-area-thumb"], [ng-scroll-area-thumb]').forEach((thumb) => {
                        thumb.setAttribute("aria-hidden", "true");
                    });
                };
                const observedElements = new Set();
                const resizeObserver = typeof ResizeObserver === "function"
                    ? new ResizeObserver(syncState)
                    : null;
                const observeElementSize = (target) => {
                    if (!resizeObserver || observedElements.has(target))
                        return;
                    observedElements.add(target);
                    resizeObserver.observe(target);
                };
                const observeContentSize = () => {
                    observeElementSize(viewport);
                    Array.from(viewport.children).forEach(observeElementSize);
                };
                const mutationObserver = new MutationObserver(() => {
                    observeContentSize();
                    syncState();
                });
                const directionObserver = new MutationObserver(() => {
                    syncDirection();
                });
                viewport.addEventListener("scroll", syncState);
                mutationObserver.observe(viewport, {
                    attributes: true,
                    attributeFilter: ["class", "dir", "hidden", "style"],
                    childList: true,
                    subtree: true,
                });
                directionObserver.observe(element, {
                    attributes: true,
                    attributeFilter: ["dir"],
                });
                observeContentSize();
                syncState();
                onDestroy(scope, () => {
                    viewport.removeEventListener("scroll", syncState);
                    mutationObserver.disconnect();
                    directionObserver.disconnect();
                    resizeObserver?.disconnect();
                    scrollbarCleanups.forEach((cleanup) => {
                        cleanup();
                    });
                    scrollbarCleanups.clear();
                });
            },
        };
    }

    function separatorDirective() {
        return {
            link(_scope, element) {
                const orientation = element.getAttribute("orientation") ?? "horizontal";
                element.setAttribute("role", element.getAttribute("role") ?? "separator");
                element.setAttribute("aria-orientation", orientation);
                element.setAttribute("data-orientation", orientation);
            },
        };
    }

    const sheetSides = new Set(["bottom", "left", "right", "top"]);
    const setAttributeIfChanged$5 = (element, name, value) => {
        if (element.getAttribute(name) !== value) {
            element.setAttribute(name, value);
        }
    };
    function sheetDirective() {
        return {
            link(scope, element) {
                const getContent = () => queryAll(element, '[data-slot="sheet-content"], [ng-sheet-content]').find((candidate) => candidate.closest('[data-slot="sheet"], [ng-sheet]') === element) ?? null;
                const syncSide = () => {
                    const content = getContent();
                    const authoredSide = element.getAttribute("side") ?? content?.getAttribute("side");
                    const side = authoredSide && sheetSides.has(authoredSide) ? authoredSide : "right";
                    setAttributeIfChanged$5(element, "data-side", side);
                    if (content)
                        setAttributeIfChanged$5(content, "data-side", side);
                };
                bindOverlay(scope, element, {
                    rootSelector: '[data-slot="sheet"], [ng-sheet]',
                    closeSelector: '[data-slot="sheet-close"], [ng-sheet-close], [data-sheet-close]',
                    contentSelector: '[data-slot="sheet-content"], [ng-sheet-content]',
                    descriptionSelector: '[data-slot="sheet-description"], [ng-sheet-description]',
                    overlaySelector: '[data-slot="sheet-overlay"], [ng-sheet-overlay]',
                    titleSelector: '[data-slot="sheet-title"], [ng-sheet-title]',
                    triggerSelector: '[data-slot="sheet-trigger"], [ng-sheet-trigger]',
                    closeOnOutsideClick: true,
                });
                const sideObserver = new MutationObserver(syncSide);
                sideObserver.observe(element, {
                    attributes: true,
                    attributeFilter: ["side"],
                    childList: true,
                    subtree: true,
                });
                syncSide();
                onDestroy(scope, () => {
                    sideObserver.disconnect();
                });
            },
        };
    }

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
    const getDataState = (collapsed) => collapsed ? "collapsed" : "expanded";
    const setAttributeIfChanged$4 = (element, name, value) => {
        if (element.getAttribute(name) !== value) {
            element.setAttribute(name, value);
        }
    };
    /**
     * Binds open/closed state to sidebar-related triggers and manages ARIA state.
     */
    function sidebarDirective() {
        return {
            link(scope, element) {
                const triggerSelector = element.id
                    ? `[aria-controls="${element.id}"], [data-sidebar-target="${element.id}"]`
                    : "[ng-sidebar-trigger], [data-slot='sidebar-trigger']";
                const cleanupTriggers = new Map();
                const directionOwner = element.closest("[dir]") ?? element;
                const mobileQuery = window.matchMedia("(max-width: 767px)");
                const ownedCurrent = new WeakSet();
                const getDirection = () => element.closest("[dir]")?.getAttribute("dir") === "rtl"
                    ? "rtl"
                    : "ltr";
                const syncDirection = () => {
                    setAttributeIfChanged$4(element, "data-direction", getDirection());
                };
                const syncResponsive = () => {
                    setAttributeIfChanged$4(element, "data-mobile", String(mobileQuery.matches));
                };
                const getCollapsed = () => element.getAttribute("data-state") === getDataState(true);
                const syncOptions = () => {
                    const reflect = (name, fallback) => {
                        const authored = element.getAttribute(name);
                        setAttributeIfChanged$4(element, `data-${name}`, authored && sidebarOptions[name].has(authored)
                            ? authored
                            : fallback);
                    };
                    reflect("collapsible", "offcanvas");
                    reflect("side", "left");
                    reflect("variant", "sidebar");
                };
                const setCollapsed = (collapsed) => {
                    if (element.getAttribute("data-collapsible") === "none") {
                        collapsed = false;
                    }
                    const hidden = collapsed && element.getAttribute("data-collapsible") === "offcanvas";
                    const nextState = getDataState(collapsed);
                    setAttributeIfChanged$4(element, "data-open", String(!collapsed));
                    setAttributeIfChanged$4(element, "data-state", nextState);
                    setAttributeIfChanged$4(element, "aria-hidden", String(hidden));
                    cleanupTriggers.forEach((_, trigger) => {
                        setAttributeIfChanged$4(trigger, "aria-expanded", String(!collapsed));
                        setAttributeIfChanged$4(trigger, "data-state", collapsed ? "closed" : "open");
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
                    queryAll(element, selectors.group).forEach((group) => {
                        const label = group.querySelector(selectors.groupLabel);
                        if (!label)
                            return;
                        if (!label.id)
                            label.id = `sidebar-group-label-${String(sidebarIdCounter++)}`;
                        setAttributeIfChanged$4(group, "aria-labelledby", label.id);
                    });
                    queryAll(element, selectors.menuButton).forEach((button) => {
                        if (button instanceof HTMLButtonElement &&
                            !button.hasAttribute("type")) {
                            button.type = "button";
                        }
                        const dataActive = button.getAttribute("data-active");
                        const active = dataActive === null
                            ? button.getAttribute("aria-current") === "page"
                            : dataActive === "true";
                        setAttributeIfChanged$4(button, "data-active", String(active));
                        if (active && !button.hasAttribute("aria-current")) {
                            button.setAttribute("aria-current", "page");
                            ownedCurrent.add(button);
                        }
                        else if (!active && ownedCurrent.has(button)) {
                            button.removeAttribute("aria-current");
                            ownedCurrent.delete(button);
                        }
                    });
                    queryAll(element, `${selectors.groupAction}, ${selectors.menuAction}`).forEach((action) => {
                        if (action instanceof HTMLButtonElement &&
                            !action.hasAttribute("type")) {
                            action.type = "button";
                        }
                    });
                };
                const bindTrigger = (trigger) => {
                    if (cleanupTriggers.has(trigger))
                        return;
                    if (element.id) {
                        setAttributeIfChanged$4(trigger, "aria-controls", element.id);
                    }
                    setAttributeIfChanged$4(trigger, "aria-expanded", String(!getCollapsed()));
                    setAttributeIfChanged$4(trigger, "data-state", getCollapsed() ? "closed" : "open");
                    if (trigger instanceof HTMLButtonElement &&
                        !trigger.hasAttribute("type")) {
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
                    cleanupTriggers.set(trigger, () => {
                        trigger.removeEventListener("click", handleClick);
                    });
                };
                const syncTriggers = () => {
                    queryAll(document, triggerSelector).forEach(bindTrigger);
                    cleanupTriggers.forEach((cleanup, trigger) => {
                        if (!trigger.isConnected || !trigger.matches(triggerSelector)) {
                            cleanup();
                            cleanupTriggers.delete(trigger);
                        }
                    });
                    setCollapsed(getCollapsed());
                };
                element.setAttribute("role", element.getAttribute("role") ?? "complementary");
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
                const directionObserver = directionOwner === element ? null : new MutationObserver(syncFromState);
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
                    cleanupTriggers.forEach((cleanup) => {
                        cleanup();
                    });
                    cleanupTriggers.clear();
                });
            },
        };
    }

    function skeletonDirective() {
        return {
            link(_scope, element) {
                if (!element.hasAttribute("aria-label")) {
                    element.setAttribute("aria-hidden", element.getAttribute("aria-hidden") ?? "true");
                }
                element.setAttribute("data-loading", "true");
            },
        };
    }

    const thumbSelector = 'input[type="range"][ng-slider-thumb], input[type="range"][data-slot="slider-thumb"]';
    const orientations = new Set(["horizontal", "vertical"]);
    const setAttributeIfChanged$3 = (element, name, value) => {
        if (element.getAttribute(name) !== value) {
            element.setAttribute(name, value);
        }
    };
    const orientationFor = (element) => {
        const authored = element.getAttribute("orientation") ??
            element.getAttribute("data-orientation");
        return authored && orientations.has(authored)
            ? authored
            : "horizontal";
    };
    const sliderValue = (element) => {
        const min = Number.isFinite(Number(element.min)) ? Number(element.min) : 0;
        const max = Number.isFinite(Number(element.max)) ? Number(element.max) : 100;
        const parsed = Number.parseFloat(element.value);
        const value = Number.isFinite(parsed)
            ? Math.max(min, Math.min(max, parsed))
            : min;
        const rawPercent = max === min ? 0 : ((value - min) / (max - min)) * 100;
        return {
            max,
            min,
            percent: Math.min(100, Math.max(0, rawPercent)),
            value,
        };
    };
    const syncInput = (element, orientation = orientationFor(element)) => {
        const state = sliderValue(element);
        syncNativeControlState(element);
        setAttributeIfChanged$3(element, "role", element.getAttribute("role") ?? "slider");
        setAttributeIfChanged$3(element, "aria-orientation", orientation);
        setAttributeIfChanged$3(element, "data-orientation", orientation);
        setAttributeIfChanged$3(element, "aria-valuemin", String(state.min));
        setAttributeIfChanged$3(element, "aria-valuemax", String(state.max));
        setAttributeIfChanged$3(element, "aria-valuenow", String(state.value));
        setAttributeIfChanged$3(element, "data-invalid", String(element.getAttribute("aria-invalid") === "true" ||
            element.matches(":invalid")));
        element.style.setProperty("--value", `${String(state.percent)}%`);
        setAttributeIfChanged$3(element, "data-value", String(state.value));
        return state;
    };
    const bindNativeSlider = (element) => {
        const sync = () => syncInput(element);
        const observer = new MutationObserver(sync);
        observer.observe(element, {
            attributes: true,
            attributeFilter: [
                "aria-invalid",
                "data-orientation",
                "disabled",
                "max",
                "min",
                "orientation",
                "required",
                "value",
            ],
        });
        element.addEventListener("input", sync);
        element.addEventListener("change", sync);
        sync();
        queueMicrotask(sync);
        return () => {
            observer.disconnect();
            element.removeEventListener("input", sync);
            element.removeEventListener("change", sync);
        };
    };
    const bindCompositeSlider = (element) => {
        const inputs = () => queryAll(element, thumbSelector);
        const sync = () => {
            const orientation = orientationFor(element);
            const thumbs = inputs();
            const direction = element.closest("[dir]")?.getAttribute("dir") === "rtl" ||
                getComputedStyle(element).direction === "rtl"
                ? "rtl"
                : "ltr";
            const states = thumbs.map((input, index) => {
                setAttributeIfChanged$3(input, "data-index", String(index));
                return syncInput(input, orientation);
            });
            const minAttribute = element.getAttribute("min");
            const maxAttribute = element.getAttribute("max");
            const authoredMin = minAttribute === null ? Number.NaN : Number(minAttribute);
            const authoredMax = maxAttribute === null ? Number.NaN : Number(maxAttribute);
            const min = Number.isFinite(authoredMin)
                ? authoredMin
                : states.length
                    ? Math.min(...states.map((state) => state.min))
                    : 0;
            const max = Number.isFinite(authoredMax)
                ? authoredMax
                : states.length
                    ? Math.max(...states.map((state) => state.max))
                    : 100;
            const physicalPercents = states.map(({ value }) => {
                const percent = max === min
                    ? 0
                    : Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
                return orientation === "horizontal" && direction === "rtl"
                    ? 100 - percent
                    : percent;
            });
            const start = physicalPercents.length ? Math.min(...physicalPercents) : 0;
            const end = physicalPercents.length ? Math.max(...physicalPercents) : 0;
            setAttributeIfChanged$3(element, "data-orientation", orientation);
            setAttributeIfChanged$3(element, "data-disabled", String(thumbs.length > 0 && thumbs.every((input) => input.disabled)));
            setAttributeIfChanged$3(element, "data-values", states.map(({ value }) => value).join(","));
            element.style.setProperty("--range-start", `${String(start)}%`);
            element.style.setProperty("--range-end", `${String(end)}%`);
        };
        const handleFocus = (event) => {
            inputs().forEach((input) => input.toggleAttribute("data-active", input === event.target));
        };
        const observer = new MutationObserver(sync);
        observer.observe(element, {
            attributes: true,
            attributeFilter: [
                "aria-invalid",
                "data-orientation",
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
        element.addEventListener("focusin", handleFocus);
        sync();
        queueMicrotask(sync);
        requestAnimationFrame(sync);
        return () => {
            observer.disconnect();
            element.removeEventListener("input", sync);
            element.removeEventListener("change", sync);
            element.removeEventListener("focusin", handleFocus);
        };
    };
    function sliderDirective() {
        return {
            link(_scope, element) {
                const cleanup = element instanceof HTMLInputElement
                    ? bindNativeSlider(element)
                    : bindCompositeSlider(element);
                onDestroy(_scope, cleanup);
            },
        };
    }

    const toastSelector = '[data-slot="toast"], [ng-toast]';
    const closeSelector = '[data-slot="toast-close"], [ng-toast-close]';
    const actionSelector = '[data-slot="toast-action"], [ng-toast-action]';
    const titleSelector = '[data-slot="toast-title"], [ng-toast-title]';
    const descriptionSelector = '[data-slot="toast-description"], [ng-toast-description]';
    const toasterPositions = new Set([
        "bottom-center",
        "bottom-left",
        "bottom-right",
        "top-center",
        "top-left",
        "top-right",
    ]);
    const toastTypes = new Set([
        "default",
        "error",
        "info",
        "loading",
        "success",
        "warning",
    ]);
    let toastIdCounter = 0;
    const setAttributeIfChanged$2 = (element, name, value) => {
        if (element.getAttribute(name) !== value) {
            element.setAttribute(name, value);
        }
    };
    const getToasterPosition = (element) => {
        const position = element.getAttribute("position");
        if (position !== null) {
            return toasterPositions.has(position) ? position : "bottom-right";
        }
        const dataPosition = element.getAttribute("data-position");
        return dataPosition && toasterPositions.has(dataPosition)
            ? dataPosition
            : "bottom-right";
    };
    function toasterDirective() {
        return {
            link(scope, element) {
                element.setAttribute("data-sonner-toaster", "");
                const cleanupButtons = new Map();
                const generatedRelationships = new WeakMap();
                const mirroredTypes = new WeakMap();
                const syncPosition = () => {
                    const position = getToasterPosition(element);
                    if (element.getAttribute("data-position") !== position) {
                        element.setAttribute("data-position", position);
                    }
                };
                const bindToast = (toast) => {
                    setAttributeIfChanged$2(toast, "role", toast.getAttribute("role") ?? "status");
                    setAttributeIfChanged$2(toast, "aria-live", toast.getAttribute("aria-live") ?? "polite");
                    setAttributeIfChanged$2(toast, "aria-atomic", toast.getAttribute("aria-atomic") ?? "true");
                    const relationships = generatedRelationships.get(toast) ?? {};
                    const title = toast.querySelector(titleSelector);
                    const description = toast.querySelector(descriptionSelector);
                    const labelledby = toast.getAttribute("aria-labelledby");
                    const describedby = toast.getAttribute("aria-describedby");
                    if (title) {
                        if (!title.id)
                            title.id = `toast-title-${String(toastIdCounter++)}`;
                        if (!labelledby || labelledby === relationships.labelledby) {
                            setAttributeIfChanged$2(toast, "aria-labelledby", title.id);
                            relationships.labelledby = title.id;
                        }
                    }
                    else if (relationships.labelledby &&
                        labelledby === relationships.labelledby) {
                        toast.removeAttribute("aria-labelledby");
                        delete relationships.labelledby;
                    }
                    if (description) {
                        if (!description.id) {
                            description.id = `toast-description-${String(toastIdCounter++)}`;
                        }
                        if (!describedby || describedby === relationships.describedby) {
                            setAttributeIfChanged$2(toast, "aria-describedby", description.id);
                            relationships.describedby = description.id;
                        }
                    }
                    else if (relationships.describedby &&
                        describedby === relationships.describedby) {
                        toast.removeAttribute("aria-describedby");
                        delete relationships.describedby;
                    }
                    generatedRelationships.set(toast, relationships);
                    const type = toast.getAttribute("type");
                    const variant = toast.getAttribute("data-variant");
                    const dataType = toast.getAttribute("data-type");
                    const previousType = mirroredTypes.get(toast);
                    let nextType = "default";
                    let typeSource = "default";
                    if (type && toastTypes.has(type)) {
                        nextType = type;
                        typeSource = "type";
                    }
                    else if (variant && toastTypes.has(variant)) {
                        nextType = variant;
                        typeSource = "variant";
                    }
                    else if (dataType &&
                        toastTypes.has(dataType) &&
                        (!previousType ||
                            previousType.source === "data-type" ||
                            dataType !== previousType.value)) {
                        nextType = dataType;
                        typeSource = "data-type";
                    }
                    setAttributeIfChanged$2(toast, "data-type", nextType);
                    mirroredTypes.set(toast, { source: typeSource, value: nextType });
                    const open = !toast.hidden;
                    setAttributeIfChanged$2(toast, "aria-hidden", String(!open));
                    setAttributeIfChanged$2(toast, "data-state", open ? "open" : "closed");
                    setAttributeIfChanged$2(toast, "data-visible", String(open));
                };
                const bindActionButton = (button) => {
                    if (button instanceof HTMLButtonElement &&
                        !button.hasAttribute("type")) {
                        button.type = "button";
                    }
                };
                const bindCloseButton = (button) => {
                    if (cleanupButtons.has(button))
                        return;
                    bindActionButton(button);
                    setAttributeIfChanged$2(button, "aria-label", button.getAttribute("aria-label") ?? "Close toast");
                    const handleClick = () => {
                        const toast = button.closest('[data-slot="toast"], [ng-toast]');
                        if (toast) {
                            toast.hidden = true;
                            toast.setAttribute("aria-hidden", "true");
                            toast.setAttribute("data-state", "closed");
                            toast.setAttribute("data-visible", "false");
                        }
                    };
                    button.addEventListener("click", handleClick);
                    cleanupButtons.set(button, () => {
                        button.removeEventListener("click", handleClick);
                    });
                };
                const bindToaster = () => {
                    syncPosition();
                    queryAll(element, toastSelector).forEach(bindToast);
                    queryAll(element, actionSelector).forEach(bindActionButton);
                    queryAll(element, closeSelector).forEach(bindCloseButton);
                    cleanupButtons.forEach((cleanup, button) => {
                        if (!button.isConnected || !element.contains(button)) {
                            cleanup();
                            cleanupButtons.delete(button);
                        }
                    });
                };
                const observer = new MutationObserver(bindToaster);
                observer.observe(element, {
                    attributes: true,
                    attributeFilter: [
                        "aria-describedby",
                        "aria-labelledby",
                        "data-position",
                        "data-type",
                        "data-variant",
                        "hidden",
                        "id",
                        "position",
                        "type",
                    ],
                    childList: true,
                    subtree: true,
                });
                bindToaster();
                onDestroy(scope, () => {
                    observer.disconnect();
                    cleanupButtons.forEach((cleanup) => {
                        cleanup();
                    });
                    cleanupButtons.clear();
                });
            },
        };
    }

    function spinnerDirective() {
        return {
            link(_scope, element) {
                element.setAttribute("role", element.getAttribute("role") ?? "status");
                element.setAttribute("aria-live", element.getAttribute("aria-live") ?? "polite");
                element.setAttribute("aria-label", element.getAttribute("aria-label") ?? "Loading");
                element.setAttribute("aria-busy", "true");
                element.setAttribute("data-loading", "true");
            },
        };
    }

    function switchDirective() {
        return {
            link(scope, element) {
                const setAttribute = (name, value) => {
                    if (element.getAttribute(name) !== value) {
                        element.setAttribute(name, value);
                    }
                };
                const removeAttribute = (name) => {
                    if (element.hasAttribute(name)) {
                        element.removeAttribute(name);
                    }
                };
                const getChecked = () => {
                    if (element instanceof HTMLInputElement) {
                        return element.checked;
                    }
                    if (element.getAttribute("data-state") === "checked") {
                        return true;
                    }
                    return element.getAttribute("aria-checked") === "true";
                };
                const getDisabled = () => element instanceof HTMLInputElement
                    ? element.disabled
                    : element.hasAttribute("disabled") ||
                        element.getAttribute("aria-disabled") === "true";
                const sync = () => {
                    const checked = getChecked();
                    const disabled = getDisabled();
                    if (element instanceof HTMLInputElement) {
                        syncNativeControlState(element);
                    }
                    else if (disabled) {
                        setAttribute("aria-disabled", "true");
                        setAttribute("data-disabled", "true");
                    }
                    else {
                        removeAttribute("aria-disabled");
                        setAttribute("data-disabled", "false");
                    }
                    setAttribute("role", "switch");
                    setAttribute("aria-checked", String(checked));
                    setAttribute("data-state", checked ? "checked" : "unchecked");
                    setAttribute("data-invalid", String(element.getAttribute("aria-invalid") === "true" ||
                        (element instanceof HTMLInputElement &&
                            element.matches(":invalid"))));
                };
                const setChecked = (checked) => {
                    if (element instanceof HTMLInputElement) {
                        sync();
                        return;
                    }
                    else {
                        setAttribute("aria-checked", String(checked));
                        setAttribute("data-state", checked ? "checked" : "unchecked");
                    }
                    sync();
                };
                const toggle = () => {
                    if (getDisabled())
                        return;
                    if (element instanceof HTMLInputElement)
                        return;
                    setChecked(!getChecked());
                };
                const handleKeydown = (event) => {
                    if (element instanceof HTMLInputElement)
                        return;
                    if (getDisabled())
                        return;
                    if (event.key !== "Enter" && event.key !== " ")
                        return;
                    event.preventDefault();
                    toggle();
                };
                const observer = new MutationObserver(sync);
                observer.observe(element, {
                    attributes: true,
                    attributeFilter: element instanceof HTMLInputElement
                        ? ["aria-invalid", "checked", "disabled", "required", "value"]
                        : [
                            "aria-checked",
                            "aria-disabled",
                            "aria-invalid",
                            "data-state",
                            "disabled",
                        ],
                });
                element.addEventListener("input", sync);
                element.addEventListener("change", sync);
                element.addEventListener("click", toggle);
                element.addEventListener("keydown", handleKeydown);
                sync();
                onDestroy(scope, () => {
                    observer.disconnect();
                    element.removeEventListener("input", sync);
                    element.removeEventListener("change", sync);
                    element.removeEventListener("click", toggle);
                    element.removeEventListener("keydown", handleKeydown);
                });
            },
        };
    }

    function tableDirective() {
        return {
            link(scope, element) {
                const sync = () => {
                    const rows = queryAll(element, "tbody tr");
                    const heads = queryAll(element, "thead th");
                    const rowHeads = queryAll(element, "tbody th");
                    const firstRowCells = queryAll(element, "thead tr:first-child > th, thead tr:first-child > td");
                    element.setAttribute("data-row-count", String(rows.length));
                    element.setAttribute("data-column-count", String(firstRowCells.length));
                    heads.forEach((head) => {
                        head.setAttribute("scope", head.getAttribute("scope") ?? "col");
                    });
                    rowHeads.forEach((head) => {
                        head.setAttribute("scope", head.getAttribute("scope") ?? "row");
                    });
                };
                const observer = new MutationObserver(sync);
                observer.observe(element, { childList: true, subtree: true });
                sync();
                onDestroy(scope, () => {
                    observer.disconnect();
                });
            },
        };
    }

    let tabsIdCounter = 0;
    const triggerSelector = '[data-slot="tabs-trigger"], [ng-tabs-trigger]';
    const contentSelector = '[data-slot="tabs-content"], [ng-tabs-content]';
    const listSelector = '[data-slot="tabs-list"], [ng-tabs-list], [role="tablist"]';
    const setAttribute = (element, name, value) => {
        if (element.getAttribute(name) !== value) {
            element.setAttribute(name, value);
        }
    };
    function tabsDirective() {
        return {
            link(scope, element) {
                const directionOwner = element.closest("[dir]") ?? element;
                let triggers = [];
                let contents = [];
                let orientation = "horizontal";
                let activeIndex = 0;
                const cleanupTriggers = new WeakMap();
                const isTriggerDisabled = (trigger) => trigger.hasAttribute("disabled") ||
                    trigger.getAttribute("aria-disabled") === "true";
                const getDirection = () => element.closest("[dir]")?.getAttribute("dir") === "rtl"
                    ? "rtl"
                    : "ltr";
                const firstEnabledIndex = () => Math.max(0, triggers.findIndex((trigger) => !isTriggerDisabled(trigger)));
                const lastEnabledIndex = () => {
                    for (let index = triggers.length - 1; index >= 0; index -= 1) {
                        if (!isTriggerDisabled(triggers[index]))
                            return index;
                    }
                    return 0;
                };
                const getNextEnabledIndex = (index, direction) => {
                    if (!triggers.length)
                        return -1;
                    let next = nextIndex(index, triggers.length, direction);
                    let safety = 0;
                    while (isTriggerDisabled(triggers[next]) && safety < triggers.length) {
                        next = nextIndex(next, triggers.length, direction);
                        safety += 1;
                    }
                    return next;
                };
                const activate = (index, focus = false) => {
                    if (!triggers.length || index < 0)
                        return;
                    const nextActiveIndex = Math.min(index, triggers.length - 1);
                    activeIndex = nextActiveIndex;
                    triggers.forEach((trigger, triggerIndex) => {
                        const selected = triggerIndex === nextActiveIndex;
                        const disabled = isTriggerDisabled(trigger);
                        setAttribute(trigger, "aria-selected", String(selected));
                        setAttribute(trigger, "data-active", String(selected));
                        setAttribute(trigger, "tabindex", selected && !disabled ? "0" : "-1");
                        setAttribute(trigger, "data-disabled", String(disabled));
                        if (selected && focus)
                            trigger.focus();
                    });
                    contents.forEach((content, contentIndex) => {
                        const selected = contentIndex === nextActiveIndex;
                        content.hidden = !selected;
                        setAttribute(content, "data-active", String(selected));
                        setAttribute(content, "role", content.getAttribute("role") ?? "tabpanel");
                        setAttribute(content, "aria-hidden", String(!selected));
                        setAttribute(content, "tabindex", selected ? "0" : "-1");
                    });
                };
                const bindTrigger = (trigger) => {
                    if (cleanupTriggers.has(trigger))
                        return;
                    const handleClick = () => {
                        const index = triggers.indexOf(trigger);
                        if (index >= 0 && !isTriggerDisabled(trigger))
                            activate(index);
                    };
                    const handleKeydown = (event) => {
                        const index = triggers.indexOf(trigger);
                        if (index < 0)
                            return;
                        if (event.key === "Enter" ||
                            event.key === " " ||
                            event.key === "Spacebar") {
                            event.preventDefault();
                            if (!isTriggerDisabled(trigger))
                                activate(index, true);
                            return;
                        }
                        if (isTriggerDisabled(trigger))
                            return;
                        const nextKey = orientation === "vertical" ? "ArrowDown" : "ArrowRight";
                        const previousKey = orientation === "vertical" ? "ArrowUp" : "ArrowLeft";
                        if (event.key === nextKey || event.key === previousKey) {
                            event.preventDefault();
                            let direction = event.key === nextKey ? 1 : -1;
                            if (orientation !== "vertical" && getDirection() === "rtl") {
                                direction = direction === 1 ? -1 : 1;
                            }
                            const next = getNextEnabledIndex(index, direction);
                            activate(next, true);
                            return;
                        }
                        if (event.key === "Home" || event.key === "End") {
                            event.preventDefault();
                            activate(event.key === "Home" ? firstEnabledIndex() : lastEnabledIndex(), true);
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
                    triggers = queryAll(element, triggerSelector);
                    contents = queryAll(element, contentSelector);
                    const list = element.querySelector(listSelector);
                    orientation =
                        element.getAttribute("orientation") ??
                            element.getAttribute("aria-orientation") ??
                            list?.getAttribute("aria-orientation") ??
                            "horizontal";
                    orientation = orientation === "vertical" ? "vertical" : "horizontal";
                    setAttribute(element, "data-direction", getDirection());
                    setAttribute(element, "data-orientation", orientation);
                    if (list) {
                        setAttribute(list, "role", list.getAttribute("role") ?? "tablist");
                        setAttribute(list, "aria-orientation", orientation);
                    }
                    triggers.forEach((trigger, index) => {
                        const content = contents.at(index);
                        const triggerId = trigger.id || `tabs-trigger-${String(tabsIdCounter++)}`;
                        trigger.id = triggerId;
                        setAttribute(trigger, "role", trigger.getAttribute("role") ?? "tab");
                        if (content) {
                            const contentId = content.id || `${triggerId}-content`;
                            content.id = contentId;
                            setAttribute(trigger, "aria-controls", contentId);
                            setAttribute(content, "role", content.getAttribute("role") ?? "tabpanel");
                            setAttribute(content, "aria-labelledby", triggerId);
                        }
                        bindTrigger(trigger);
                    });
                    if (!triggers.length)
                        return;
                    const selectedIndex = triggers.findIndex((trigger) => !isTriggerDisabled(trigger) &&
                        (trigger.getAttribute("aria-selected") === "true" ||
                            trigger.getAttribute("data-active") === "true"));
                    const nextActiveIndex = selectedIndex >= 0
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
                        "data-slot",
                        "disabled",
                        "orientation",
                        "dir",
                    ],
                    childList: true,
                    subtree: true,
                });
                sync();
                const directionObserver = directionOwner === element ? null : new MutationObserver(sync);
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

    function textareaDirective() {
        return {
            link(scope, element) {
                if (!(element instanceof HTMLTextAreaElement))
                    return;
                const sync = () => {
                    syncNativeControlState(element);
                    element.setAttribute("data-empty", String(!element.value));
                    element.setAttribute("data-invalid", String(element.getAttribute("aria-invalid") === "true" ||
                        element.matches(":invalid")));
                };
                const onChange = () => {
                    sync();
                };
                element.addEventListener("input", sync);
                element.addEventListener("change", onChange);
                const observer = new MutationObserver(sync);
                observer.observe(element, {
                    attributes: true,
                    attributeFilter: ["aria-invalid", "disabled", "required", "value"],
                });
                sync();
                onDestroy(scope, () => {
                    element.removeEventListener("input", sync);
                    element.removeEventListener("change", onChange);
                    observer.disconnect();
                });
            },
        };
    }

    function toggleDirective() {
        return {
            link(scope, element) {
                const pressedSource = element.hasAttribute("aria-pressed")
                    ? "aria-pressed"
                    : "data-state";
                const isElementDisabled = () => element.hasAttribute("disabled") ||
                    element.getAttribute("aria-disabled") === "true";
                const setPressed = (pressed) => {
                    const state = pressed ? "on" : "off";
                    if (element.getAttribute("aria-pressed") !== String(pressed)) {
                        element.setAttribute("aria-pressed", String(pressed));
                    }
                    if (element.getAttribute("data-state") !== state) {
                        element.setAttribute("data-state", state);
                    }
                };
                const syncDisabled = () => {
                    const disabled = isElementDisabled();
                    if (element.getAttribute("data-disabled") !== String(disabled)) {
                        element.setAttribute("data-disabled", String(disabled));
                    }
                };
                const syncPressed = () => {
                    const pressed = pressedSource === "aria-pressed"
                        ? element.getAttribute("aria-pressed") === "true"
                        : element.getAttribute("data-state") === "on";
                    setPressed(pressed);
                };
                syncPressed();
                syncDisabled();
                const handleClick = () => {
                    if (isElementDisabled())
                        return;
                    setPressed(element.getAttribute("aria-pressed") !== "true");
                };
                const observer = new MutationObserver(() => {
                    syncPressed();
                    syncDisabled();
                });
                observer.observe(element, {
                    attributes: true,
                    attributeFilter: [
                        "aria-disabled",
                        "aria-pressed",
                        "data-disabled",
                        "data-state",
                        "disabled",
                    ],
                });
                element.addEventListener("click", handleClick);
                onDestroy(scope, () => {
                    observer.disconnect();
                    element.removeEventListener("click", handleClick);
                });
            },
        };
    }

    const setAttributeIfChanged$1 = (element, name, value) => {
        if (element.getAttribute(name) !== value) {
            element.setAttribute(name, value);
        }
    };
    function toggleGroupDirective() {
        return {
            link(scope, element) {
                const directionOwner = element.closest("[dir]") ?? element;
                const itemSelector = '[data-slot="toggle-group-item"], [ng-toggle-group-item], button[aria-pressed]';
                let items = [];
                const allowsMultiple = element.hasAttribute("multiple") ||
                    element.getAttribute("type") === "multiple";
                const cleanupItems = new Map();
                element.setAttribute("role", element.getAttribute("role") ?? "group");
                const isGroupDisabled = () => element.hasAttribute("disabled") ||
                    element.getAttribute("aria-disabled") === "true";
                const isItemDisabled = (item) => isGroupDisabled() ||
                    item.hasAttribute("disabled") ||
                    item.getAttribute("aria-disabled") === "true";
                const getDirection = () => element.closest("[dir]")?.getAttribute("dir") === "rtl"
                    ? "rtl"
                    : "ltr";
                const getOrientation = () => element.getAttribute("orientation") === "vertical"
                    ? "vertical"
                    : "horizontal";
                const syncChrome = () => {
                    setAttributeIfChanged$1(element, "data-direction", getDirection());
                    setAttributeIfChanged$1(element, "data-orientation", getOrientation());
                    setAttributeIfChanged$1(element, "data-disabled", String(isGroupDisabled()));
                    const spacing = element.getAttribute("spacing");
                    if (spacing && /^\d+(?:\.\d+)?$/.test(spacing)) {
                        element.style.setProperty("--gap", spacing);
                    }
                    else {
                        element.style.removeProperty("--gap");
                    }
                    const enabled = items.filter((item) => !isItemDisabled(item));
                    const tabStop = enabled.find((item) => item.getAttribute("tabindex") === "0") ??
                        enabled.find((item) => item.getAttribute("aria-pressed") === "true") ??
                        enabled[0];
                    items.forEach((item) => {
                        setAttributeIfChanged$1(item, "data-disabled", String(isItemDisabled(item)));
                        item.setAttribute("tabindex", item === tabStop ? "0" : "-1");
                    });
                };
                const setPressed = (item, pressed) => {
                    item.setAttribute("aria-pressed", String(pressed));
                    item.setAttribute("data-state", pressed ? "on" : "off");
                };
                const enabledItems = () => items.filter((item) => !isItemDisabled(item));
                const bindItem = (item) => {
                    if (cleanupItems.has(item))
                        return;
                    setPressed(item, item.getAttribute("aria-pressed") === "true" ||
                        item.getAttribute("data-state") === "on");
                    const handleClick = () => {
                        if (isItemDisabled(item))
                            return;
                        const nextPressed = item.getAttribute("aria-pressed") !== "true";
                        if (!allowsMultiple) {
                            items.forEach((otherItem) => {
                                if (otherItem !== item)
                                    setPressed(otherItem, false);
                            });
                        }
                        setPressed(item, nextPressed);
                        items.forEach((otherItem) => {
                            otherItem.setAttribute("tabindex", otherItem === item ? "0" : "-1");
                        });
                    };
                    const handleKeydown = (event) => {
                        if (event.key !== "ArrowRight" &&
                            event.key !== "ArrowDown" &&
                            event.key !== "ArrowLeft" &&
                            event.key !== "ArrowUp") {
                            return;
                        }
                        const enabled = enabledItems();
                        const currentIndex = enabled.indexOf(item);
                        if (currentIndex < 0)
                            return;
                        event.preventDefault();
                        const forward = event.key === "ArrowRight" || event.key === "ArrowDown";
                        const rtlHorizontal = getOrientation() === "horizontal" && getDirection() === "rtl";
                        const direction = forward === !rtlHorizontal ? 1 : -1;
                        const nextItem = enabled[nextIndex(currentIndex, enabled.length, direction)];
                        items.forEach((otherItem) => {
                            otherItem.setAttribute("tabindex", otherItem === nextItem ? "0" : "-1");
                        });
                        nextItem.focus();
                        if (!allowsMultiple) {
                            items.forEach((otherItem) => {
                                setPressed(otherItem, false);
                            });
                            setPressed(nextItem, true);
                        }
                    };
                    item.addEventListener("click", handleClick);
                    item.addEventListener("keydown", handleKeydown);
                    cleanupItems.set(item, () => {
                        item.removeEventListener("click", handleClick);
                        item.removeEventListener("keydown", handleKeydown);
                    });
                };
                const sync = () => {
                    items = queryAll(element, itemSelector);
                    items.forEach(bindItem);
                    syncChrome();
                };
                const observer = new MutationObserver(sync);
                observer.observe(element, {
                    attributes: true,
                    attributeFilter: [
                        "aria-disabled",
                        "data-disabled",
                        "data-orientation",
                        "dir",
                        "disabled",
                        "orientation",
                        "spacing",
                    ],
                    childList: true,
                    subtree: true,
                });
                sync();
                const directionObserver = directionOwner === element ? null : new MutationObserver(sync);
                directionObserver?.observe(directionOwner, {
                    attributes: true,
                    attributeFilter: ["dir"],
                });
                onDestroy(scope, () => {
                    observer.disconnect();
                    directionObserver?.disconnect();
                    cleanupItems.forEach((cleanup) => {
                        cleanup();
                    });
                    cleanupItems.clear();
                });
            },
        };
    }

    let tooltipIdCounter = 0;
    const sides = new Set(["bottom", "left", "right", "top"]);
    const setAttributeIfChanged = (element, name, value) => {
        if (element.getAttribute(name) !== value) {
            element.setAttribute(name, value);
        }
    };
    function tooltipDirective() {
        return {
            link(scope, element) {
                const directionOwner = element.closest("[dir]") ?? element;
                const trigger = query(element, '[data-slot="tooltip-trigger"], [ng-tooltip-trigger]', HTMLElement);
                const content = query(element, '[data-slot="tooltip-content"], [ng-tooltip-content]', HTMLElement);
                if (!trigger || !content)
                    return;
                const getDirection = () => element.closest("[dir]")?.getAttribute("dir") === "rtl"
                    ? "rtl"
                    : "ltr";
                const syncDirection = () => {
                    const direction = getDirection();
                    setAttributeIfChanged(element, "data-direction", direction);
                    setAttributeIfChanged(content, "data-direction", direction);
                };
                const syncSide = () => {
                    const authored = content.getAttribute("side") ?? content.getAttribute("data-side");
                    const side = authored && sides.has(authored) ? authored : "top";
                    setAttributeIfChanged(content, "data-side", side);
                };
                const contentId = content.id || `tooltip-content-${String(tooltipIdCounter++)}`;
                content.id = contentId;
                trigger.setAttribute("aria-describedby", contentId);
                content.setAttribute("role", content.getAttribute("role") ?? "tooltip");
                let controlledOpen = element.getAttribute("data-open") === "true" ||
                    content.getAttribute("data-open") === "true";
                let keepOpen = false;
                const isOpen = () => keepOpen || controlledOpen;
                let appliedOpen = isOpen();
                let reflectingOpen = false;
                const setOpen = () => {
                    const nextOpen = isOpen();
                    const wasOpen = appliedOpen;
                    appliedOpen = nextOpen;
                    const state = nextOpen ? "open" : "closed";
                    setAttributeIfChanged(element, "data-state", state);
                    setAttributeIfChanged(trigger, "data-state", state);
                    setAttributeIfChanged(content, "data-state", state);
                    setAttributeIfChanged(content, "aria-hidden", String(!nextOpen));
                    reflectingOpen = true;
                    setAttributeIfChanged(element, "data-open", String(nextOpen));
                    setOpenState(content, nextOpen);
                    queueMicrotask(() => {
                        reflectingOpen = false;
                    });
                    if (nextOpen === wasOpen)
                        return;
                };
                const syncFromAttribute = (source) => {
                    if (reflectingOpen)
                        return;
                    const nextOpen = source.getAttribute("data-open") === "true";
                    if (nextOpen === controlledOpen)
                        return;
                    controlledOpen = nextOpen;
                    setOpen();
                };
                const openObserver = new MutationObserver((records) => {
                    syncSide();
                    if (records.some((record) => record.attributeName === "data-open")) {
                        syncFromAttribute(content);
                    }
                });
                openObserver.observe(content, {
                    attributes: true,
                    attributeFilter: ["data-open", "data-side", "side"],
                });
                const directionObserver = directionOwner === element ? null : new MutationObserver(syncDirection);
                directionObserver?.observe(directionOwner, {
                    attributes: true,
                    attributeFilter: ["dir"],
                });
                const elementObserver = new MutationObserver((records) => {
                    syncDirection();
                    if (records.some((record) => record.attributeName === "data-open")) {
                        syncFromAttribute(element);
                    }
                });
                elementObserver.observe(element, {
                    attributes: true,
                    attributeFilter: ["data-open", "dir"],
                });
                syncDirection();
                syncSide();
                setOpen();
                const handleOpen = () => {
                    if (isDisabled(trigger))
                        return;
                    keepOpen = true;
                    setOpen();
                };
                const handleClose = () => {
                    keepOpen = false;
                    setOpen();
                };
                const handleKeydown = (event) => {
                    if (event.key === "Escape")
                        handleClose();
                };
                trigger.addEventListener("mouseenter", handleOpen);
                trigger.addEventListener("mouseleave", handleClose);
                trigger.addEventListener("focusin", handleOpen);
                trigger.addEventListener("focus", handleOpen);
                trigger.addEventListener("blur", handleClose);
                trigger.addEventListener("keydown", handleKeydown);
                onDestroy(scope, () => {
                    openObserver.disconnect();
                    directionObserver?.disconnect();
                    elementObserver.disconnect();
                    trigger.removeEventListener("mouseenter", handleOpen);
                    trigger.removeEventListener("mouseleave", handleClose);
                    trigger.removeEventListener("focusin", handleOpen);
                    trigger.removeEventListener("focus", handleOpen);
                    trigger.removeEventListener("blur", handleClose);
                    trigger.removeEventListener("keydown", handleKeydown);
                });
            },
        };
    }

    const angularCssModuleName = "ui";
    const globalScope = globalThis;
    const angular = globalScope.angular;
    const angularCssDirectives = [
        ["ngAccordion", accordionDirective],
        ["ngDropdown", dropdownDirective],
        ["ngAlert", alertDirective],
        ["ngAlertDialog", alertDialogDirective],
        ["ngAspectRatio", aspectRatioDirective],
        ["ngAvatar", avatarDirective],
        ["ngBadge", badgeDirective],
        ["ngBreadcrumb", breadcrumbDirective],
        ["ngButton", buttonDirective],
        ["ngButtonGroup", buttonGroupDirective],
        ["ngCalendar", calendarDirective],
        ["ngCarousel", carouselDirective],
        ["ngCard", cardDirective],
        ["ngChart", chartDirective],
        ["ngCheckbox", checkboxDirective],
        ["ngCollapsible", collapsibleDirective],
        ["ngCombobox", comboboxDirective],
        ["ngCommand", commandDirective],
        ["ngContextMenu", contextMenuDirective],
        ["ngDialog", dialogDirective],
        ["ngDirection", directionDirective],
        ["ngDrawer", drawerDirective],
        ["ngEmpty", emptyDirective],
        ["ngField", fieldDirective],
        ["ngHoverCard", hoverCardDirective],
        ["ngInputGroup", inputGroupDirective],
        ["ngInputOtp", inputOtpDirective],
        ["ngItem", itemDirective],
        ["ngKbd", kbdDirective],
        ["ngLabel", labelDirective],
        ["ngMenubar", menubarDirective],
        ["ngNativeSelect", nativeSelectDirective],
        ["ngSelect", selectDirective],
        ["ngNavigationMenu", navigationMenuDirective],
        ["ngPagination", paginationDirective],
        ["ngPopover", popoverDirective],
        ["ngProgress", progressDirective],
        ["ngRadioGroup", radioGroupDirective],
        ["ngResizablePanelGroup", resizablePanelGroupDirective],
        ["ngScrollArea", scrollAreaDirective],
        ["ngSeparator", separatorDirective],
        ["ngSheet", sheetDirective],
        ["ngSidebar", sidebarDirective],
        ["ngSkeleton", skeletonDirective],
        ["ngSlider", sliderDirective],
        ["ngSpinner", spinnerDirective],
        ["ngSwitchControl", switchDirective],
        ["ngTable", tableDirective],
        ["ngToaster", toasterDirective],
        ["ngTabs", tabsDirective],
        ["ngTextarea", textareaDirective],
        ["ngToggle", toggleDirective],
        ["ngToggleGroup", toggleGroupDirective],
        ["ngTooltip", tooltipDirective],
    ];
    function registerAngularCss(ng = angular) {
        if (!ng?.module)
            return undefined;
        const module = ng.module(angularCssModuleName, []);
        angularCssDirectives.forEach(([name, factory]) => {
            module.directive(name, factory);
        });
        return module;
    }
    registerAngularCss();

    exports.angular = angular;
    exports.angularCssDirectives = angularCssDirectives;
    exports.angularCssModuleName = angularCssModuleName;
    exports.registerAngularCss = registerAngularCss;

}));
