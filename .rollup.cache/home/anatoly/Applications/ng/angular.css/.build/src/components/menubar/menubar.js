import { isDisabled, nextIndex, onDestroy, query, queryAll, setOpenState, } from "../../internal/dom";
import { bindSemanticSubmenus } from "../../internal/menu";
let menubarIdCounter = 0;
const menuSelector = '[data-slot="menubar-menu"], [ng-menubar-menu]';
const triggerSelector = '[data-slot="menubar-trigger"], [ng-menubar-trigger]';
const contentSelector = '[data-slot="menubar-content"], [ng-menubar-content]';
const itemSelector = '[data-slot="menubar-item"], [ng-menubar-item], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], a, button';
const setAttribute = (element, name, value) => {
    if (element.getAttribute(name) !== value) {
        element.setAttribute(name, value);
    }
};
export function menubarDirective() {
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
                setAttribute(element, "data-direction", direction);
                entries.forEach((entry) => {
                    setAttribute(entry.content, "data-direction", direction);
                });
            };
            const syncRootState = () => {
                const open = entries.some((entry) => entry.open);
                setAttribute(element, "data-open", String(open));
                setAttribute(element, "data-state", open ? "open" : "closed");
            };
            const cleanupSubmenus = bindSemanticSubmenus(element, "menubar", getDirection);
            const getAllContentItems = (content) => queryAll(content, itemSelector).filter((item) => {
                const hiddenAncestor = item.closest("[hidden]");
                return !hiddenAncestor || hiddenAncestor === content;
            });
            const getContentItems = (content) => getAllContentItems(content).filter((item) => !isDisabled(item));
            const syncContentItems = () => {
                queryAll(element, contentSelector).forEach((content) => {
                    getAllContentItems(content).forEach((item) => {
                        setAttribute(item, "role", item.getAttribute("role") ?? "menuitem");
                    });
                });
            };
            const setActiveTrigger = (index, focus = false) => {
                triggers.forEach((trigger, triggerIndex) => {
                    setAttribute(trigger, "tabindex", triggerIndex === index ? "0" : "-1");
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
                setAttribute(entry.menu, "data-state", open ? "open" : "closed");
                setAttribute(entry.trigger, "data-state", open ? "open" : "closed");
                setAttribute(entry.trigger, "aria-expanded", String(open));
                setAttribute(entry.content, "data-state", open ? "open" : "closed");
                setAttribute(entry.content, "aria-hidden", String(!open));
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
                const trigger = query(menu, triggerSelector, HTMLElement);
                const content = query(menu, contentSelector, HTMLElement);
                if (!trigger || !content)
                    return;
                boundMenus.add(menu);
                const triggerId = trigger.id || `menubar-trigger-${String(menubarIdCounter++)}`;
                const contentId = content.id || `${triggerId}-content`;
                trigger.id = triggerId;
                content.id = contentId;
                setAttribute(trigger, "role", trigger.getAttribute("role") ?? "menuitem");
                setAttribute(trigger, "aria-haspopup", "menu");
                setAttribute(trigger, "aria-controls", contentId);
                setAttribute(content, "role", content.getAttribute("role") ?? "menu");
                setAttribute(content, "aria-labelledby", triggerId);
                setAttribute(content, "aria-hidden", "true");
                if (!content.hasAttribute("tabindex")) {
                    setAttribute(content, "tabindex", "-1");
                }
                getContentItems(content).forEach((item) => {
                    setAttribute(item, "role", item.getAttribute("role") ?? "menuitem");
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
                setAttribute(trigger, "tabindex", "-1");
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
            setAttribute(element, "role", element.getAttribute("role") ?? "menubar");
            const handleDocumentClick = (event) => {
                if (event.target instanceof Node && !element.contains(event.target)) {
                    closeAll();
                }
            };
            const handleItemClick = (event) => {
                const target = event.target instanceof Element
                    ? event.target.closest(itemSelector)
                    : null;
                if (!target?.closest(contentSelector) ||
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
