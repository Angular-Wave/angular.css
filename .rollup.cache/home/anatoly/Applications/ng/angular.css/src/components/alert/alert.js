export function alertDirective() {
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
