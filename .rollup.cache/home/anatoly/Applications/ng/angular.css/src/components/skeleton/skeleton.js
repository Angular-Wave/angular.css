export function skeletonDirective() {
    return {
        link(_scope, element) {
            if (!element.hasAttribute("aria-label")) {
                element.setAttribute("aria-hidden", element.getAttribute("aria-hidden") ?? "true");
            }
            element.setAttribute("data-loading", "true");
        },
    };
}
