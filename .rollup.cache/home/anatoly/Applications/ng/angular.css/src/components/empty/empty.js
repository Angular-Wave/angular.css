export function emptyDirective() {
    return {
        link(_scope, element) {
            element.setAttribute("role", element.getAttribute("role") ?? "status");
            element.setAttribute("aria-live", element.getAttribute("aria-live") ?? "polite");
        },
    };
}
