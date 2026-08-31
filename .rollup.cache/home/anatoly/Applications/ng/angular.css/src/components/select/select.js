import { isDisabled, onDestroy, queryAll, setOpenState, } from "../../internal/dom";
let selectIdCounter = 0;
const contentSelector = '[data-slot="select-content"], [ng-select-content]';
const groupSelector = '[data-slot="select-group"], [ng-select-group]';
const itemSelector = '[data-slot="select-item"], [ng-select-item]';
const labelSelector = '[data-slot="select-label"], [ng-select-label]';
const rootSelector = '[data-slot="select"], [ng-select]';
const scrollDownSelector = '[data-slot="select-scroll-down-button"], [ng-select-scroll-down-button]';
const scrollUpSelector = '[data-slot="select-scroll-up-button"], [ng-select-scroll-up-button]';
const separatorSelector = '[data-slot="select-separator"], [ng-select-separator]';
const triggerSelector = '[data-slot="select-trigger"], [ng-select-trigger]';
const valueSelector = '[data-slot="select-value"], [ng-select-value]';
const setAttributeIfChanged = (element, name, value) => {
    if (element.getAttribute(name) !== value) {
        element.setAttribute(name, value);
    }
};
const setHiddenIfChanged = (element, hidden) => {
    if (element.hidden !== hidden)
        element.hidden = hidden;
};
export function selectDirective() {
    return {
        link(scope, element) {
            const isOwned = (candidate) => candidate.closest(rootSelector) === element;
            const owned = (selector, constructor) => {
                const candidate = queryAll(element, selector).find(isOwned);
                return candidate instanceof constructor ? candidate : null;
            };
            const ownedAll = (selector) => queryAll(element, selector).filter(isOwned);
            const directionOwner = element.closest("[dir]") ?? element;
            const trigger = owned(triggerSelector, HTMLElement);
            const content = owned(contentSelector, HTMLElement);
            if (!trigger || !content)
                return;
            const contentId = content.id || `select-content-${String(selectIdCounter++)}`;
            const triggerId = trigger.id || `select-trigger-${String(selectIdCounter++)}`;
            content.id = contentId;
            trigger.id = triggerId;
            setAttributeIfChanged(trigger, "role", trigger.getAttribute("role") ?? "combobox");
            setAttributeIfChanged(trigger, "aria-haspopup", "listbox");
            setAttributeIfChanged(trigger, "aria-controls", contentId);
            setAttributeIfChanged(trigger, "aria-autocomplete", "none");
            setAttributeIfChanged(content, "role", content.getAttribute("role") ?? "listbox");
            setAttributeIfChanged(content, "aria-labelledby", triggerId);
            setAttributeIfChanged(content, "tabindex", "-1");
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
                setAttributeIfChanged(element, "data-direction", direction);
                setAttributeIfChanged(content, "data-direction", direction);
                setAttributeIfChanged(element, "data-disabled", String(disabled));
                setAttributeIfChanged(trigger, "aria-disabled", String(disabled));
                setAttributeIfChanged(content, "data-align-trigger", String(alignItemWithTrigger()));
            };
            const syncScrollState = () => {
                const atStart = content.scrollTop <= 1;
                const atEnd = content.scrollTop + content.clientHeight >= content.scrollHeight - 1;
                ownedAll(scrollUpSelector).forEach((control) => {
                    setHiddenIfChanged(control, atStart);
                    setAttributeIfChanged(control, "aria-hidden", String(atStart));
                });
                ownedAll(scrollDownSelector).forEach((control) => {
                    setHiddenIfChanged(control, atEnd);
                    setAttributeIfChanged(control, "aria-hidden", String(atEnd));
                });
                setAttributeIfChanged(content, "data-scroll-start", String(atStart));
                setAttributeIfChanged(content, "data-scroll-end", String(atEnd));
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
                setAttributeIfChanged(element, "data-open", String(open));
                setAttributeIfChanged(element, "data-state", state);
                setAttributeIfChanged(trigger, "data-state", state);
                setAttributeIfChanged(trigger, "aria-expanded", String(open));
                setAttributeIfChanged(content, "data-state", state);
                setAttributeIfChanged(content, "aria-hidden", String(!open));
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
                    setAttributeIfChanged(item, "data-highlighted", String(itemIndex === activeIndex));
                });
                setAttributeIfChanged(trigger, "aria-activedescendant", items[activeIndex].id);
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
                    setAttributeIfChanged(option, "aria-selected", String(option === item));
                });
                highlightItem(items.indexOf(item));
                const itemText = item.textContent.trim() || "";
                const value = item.getAttribute("data-value") ?? itemText;
                const valueSlot = owned(valueSelector, HTMLElement);
                const applicationOwnsValue = Boolean(valueSlot?.hasAttribute("ng-bind") ??
                    valueSlot?.hasAttribute("ng-model") ??
                    valueSlot?.hasAttribute("data-application-value"));
                if (valueSlot && !applicationOwnsValue) {
                    valueSlot.textContent = itemText;
                }
                setAttributeIfChanged(element, "data-value", value);
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
                setAttributeIfChanged(item, "role", item.getAttribute("role") ?? "option");
                setAttributeIfChanged(item, "tabindex", "-1");
                if (isDisabled(item)) {
                    setAttributeIfChanged(item, "aria-disabled", "true");
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
                items = ownedAll(itemSelector);
                items.forEach(bindItem);
                ownedAll(groupSelector).forEach((group) => {
                    setAttributeIfChanged(group, "role", "group");
                    const label = queryAll(group, labelSelector).find((candidate) => candidate.closest(groupSelector) === group);
                    if (label) {
                        if (!label.id)
                            label.id = `select-label-${String(selectIdCounter++)}`;
                        setAttributeIfChanged(group, "aria-labelledby", label.id);
                    }
                });
                ownedAll(separatorSelector).forEach((separator) => {
                    setAttributeIfChanged(separator, "role", "separator");
                    setAttributeIfChanged(separator, "aria-orientation", "horizontal");
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
                    setAttributeIfChanged(element, "data-value", items[selected].getAttribute("data-value") ??
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
