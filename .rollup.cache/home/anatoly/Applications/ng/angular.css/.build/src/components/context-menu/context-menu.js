import { isDisabled, onDestroy, queryAll, setOpenState, } from "../../internal/dom";
import { bindSemanticSubmenus } from "../../internal/menu";
let contextMenuIdCounter = 0;
const rootSelector = '[data-slot="context-menu"], [ng-context-menu]';
const triggerSelector = '[data-slot="context-menu-trigger"], [ng-context-menu-trigger]';
const contentSelector = '[data-slot="context-menu-content"], [ng-context-menu-content]';
const subContentSelector = '[data-slot="context-menu-sub-content"], [ng-context-menu-sub-content]';
const menuSurfaceSelector = `${contentSelector}, ${subContentSelector}`;
const itemSelector = [
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
const radioSelector = '[data-slot="context-menu-radio-item"], [ng-context-menu-radio-item]';
const subTriggerSelector = '[data-slot="context-menu-sub-trigger"], [ng-context-menu-sub-trigger]';
const groupSelector = '[data-slot="context-menu-group"], [ng-context-menu-group], [data-slot="context-menu-radio-group"], [ng-context-menu-radio-group]';
const labelSelector = '[data-slot="context-menu-label"], [ng-context-menu-label]';
const separatorSelector = '[data-slot="context-menu-separator"], [ng-context-menu-separator]';
const sides = new Set([
    "bottom",
    "inline-end",
    "inline-start",
    "left",
    "right",
    "top",
]);
const alignments = new Set(["center", "end", "start"]);
const setAttributeIfChanged = (element, name, value) => {
    if (element.getAttribute(name) !== value)
        element.setAttribute(name, value);
};
export function contextMenuDirective() {
    return {
        link(scope, element) {
            const isOwned = (candidate) => candidate.closest(rootSelector) === element;
            const owned = (selector, constructor) => {
                const candidate = queryAll(element, selector).find(isOwned);
                return candidate instanceof constructor ? candidate : null;
            };
            const ownedAll = (selector) => queryAll(element, selector).filter(isOwned);
            const trigger = owned(triggerSelector, HTMLElement);
            const content = owned(contentSelector, HTMLElement);
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
                return value && sides.has(value)
                    ? value
                    : "right";
            };
            const getAlign = () => {
                const value = content.getAttribute("align") ?? content.dataset.align;
                return value && alignments.has(value)
                    ? value
                    : "start";
            };
            const contentId = content.id || `context-menu-content-${String(contextMenuIdCounter++)}`;
            content.id = contentId;
            trigger.setAttribute("aria-haspopup", "menu");
            trigger.setAttribute("aria-controls", contentId);
            if (!trigger.hasAttribute("tabindex"))
                trigger.tabIndex = 0;
            setAttributeIfChanged(content, "role", content.getAttribute("role") ?? "menu");
            setAttributeIfChanged(content, "tabindex", content.getAttribute("tabindex") ?? "-1");
            const menuItems = (surface) => queryAll(surface, itemSelector).filter((item) => {
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
                    setAttributeIfChanged(surface, "role", "menu");
                    if (!surface.hasAttribute("tabindex"))
                        surface.tabIndex = -1;
                });
                ownedAll(groupSelector).forEach((group) => {
                    setAttributeIfChanged(group, "role", "group");
                });
                ownedAll(labelSelector).forEach((label) => {
                    setAttributeIfChanged(label, "role", "presentation");
                });
                ownedAll(separatorSelector).forEach((separator) => {
                    setAttributeIfChanged(separator, "role", "separator");
                });
                ownedAll(itemSelector).forEach((item) => {
                    const role = item.matches(checkboxSelector)
                        ? "menuitemcheckbox"
                        : item.matches(radioSelector)
                            ? "menuitemradio"
                            : "menuitem";
                    setAttributeIfChanged(item, "role", role);
                    if (!item.hasAttribute("tabindex"))
                        item.tabIndex = -1;
                    if ((role === "menuitemcheckbox" || role === "menuitemradio") &&
                        !item.hasAttribute("aria-checked")) {
                        setAttributeIfChanged(item, "aria-checked", "false");
                    }
                    if (isDisabled(item)) {
                        setAttributeIfChanged(item, "aria-disabled", "true");
                        setAttributeIfChanged(item, "data-disabled", "true");
                    }
                });
            };
            const syncDirection = () => {
                const direction = getDirection();
                setAttributeIfChanged(element, "data-direction", direction);
                setAttributeIfChanged(content, "data-direction", direction);
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
                setAttributeIfChanged(content, "data-side", authoredSide);
                setAttributeIfChanged(content, "data-align", align);
            };
            const focusItem = (item, surface) => {
                menuItems(surface).forEach((candidate) => {
                    candidate.tabIndex = candidate === item ? 0 : -1;
                    setAttributeIfChanged(candidate, "data-highlighted", String(candidate === item));
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
                setAttributeIfChanged(element, "data-open", String(open));
                setAttributeIfChanged(element, "data-state", state);
                setAttributeIfChanged(trigger, "aria-expanded", String(open));
                setAttributeIfChanged(trigger, "data-state", state);
                setAttributeIfChanged(content, "data-open", String(open));
                setAttributeIfChanged(content, "data-state", state);
                setAttributeIfChanged(content, "aria-hidden", String(!open));
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
                        setAttributeIfChanged(item, "data-highlighted", "false");
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
                    target?.matches(itemSelector)) {
                    event.preventDefault();
                    target.click();
                }
            };
            const handleItemClick = (event) => {
                const target = event.target instanceof Element ? event.target : null;
                const item = target?.closest(itemSelector);
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
                const item = target?.closest(itemSelector);
                const surface = item?.closest(menuSurfaceSelector);
                if (!item || !surface || !isOwned(item) || isDisabled(item))
                    return;
                menuItems(surface).forEach((candidate) => {
                    setAttributeIfChanged(candidate, "data-highlighted", String(candidate === item));
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
