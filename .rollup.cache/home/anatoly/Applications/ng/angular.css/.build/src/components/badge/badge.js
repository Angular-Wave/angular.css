export function badgeDirective() {
    return {
        link(_scope, element) {
            const variant = element.getAttribute("variant") ??
                element.getAttribute("data-variant") ??
                "default";
            element.setAttribute("data-variant", variant);
        },
    };
}
