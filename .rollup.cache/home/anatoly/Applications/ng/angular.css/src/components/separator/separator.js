export function separatorDirective() {
    return {
        link(_scope, element) {
            const orientation = element.getAttribute("orientation") ?? "horizontal";
            element.setAttribute("role", element.getAttribute("role") ?? "separator");
            element.setAttribute("aria-orientation", orientation);
            element.setAttribute("data-orientation", orientation);
        },
    };
}
