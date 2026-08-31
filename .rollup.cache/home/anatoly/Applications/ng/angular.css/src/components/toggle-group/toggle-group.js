import { nextIndex, onDestroy, queryAll } from "../../internal/dom";
const setAttributeIfChanged = (element, name, value) => {
    if (element.getAttribute(name) !== value) {
        element.setAttribute(name, value);
    }
};
export function toggleGroupDirective() {
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
                setAttributeIfChanged(element, "data-direction", getDirection());
                setAttributeIfChanged(element, "data-orientation", getOrientation());
                setAttributeIfChanged(element, "data-disabled", String(isGroupDisabled()));
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
                    setAttributeIfChanged(item, "data-disabled", String(isItemDisabled(item)));
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
