export function query(root, selector, constructor) {
    const result = root.querySelector(selector);
    return constructor && !(result instanceof constructor) ? null : result;
}
export function queryAll(root, selector) {
    return Array.from(root.querySelectorAll(selector));
}
export function setOpenState(element, open) {
    const nextOpen = String(open);
    if (element.getAttribute("data-open") !== nextOpen) {
        element.setAttribute("data-open", nextOpen);
    }
    if (element.hidden === open) {
        element.hidden = !open;
    }
}
export function isDisabled(element) {
    return (element.hasAttribute("disabled") ||
        element.getAttribute("aria-disabled") === "true" ||
        element.getAttribute("data-disabled") === "true");
}
export function nextIndex(currentIndex, length, direction) {
    if (length <= 0)
        return -1;
    if (currentIndex < 0)
        return direction === 1 ? 0 : length - 1;
    return (currentIndex + direction + length) % length;
}
export function onDestroy(scope, cleanup) {
    if (typeof scope?.$on === "function") {
        scope.$on("$destroy", cleanup);
    }
}
