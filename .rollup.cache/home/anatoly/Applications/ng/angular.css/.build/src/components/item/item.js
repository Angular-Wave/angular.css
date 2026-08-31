export function itemDirective() {
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
