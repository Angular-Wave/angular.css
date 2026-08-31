import { isDisabled } from "../../internal/dom";
const normalizeVariant = (element) => {
    return (element.getAttribute("variant") ??
        element.getAttribute("data-variant") ??
        "default");
};
const normalizeSize = (element) => {
    return (element.getAttribute("size") ??
        element.getAttribute("data-size") ??
        "default");
};
export function buttonDirective() {
    return {
        link(_scope, element) {
            const target = element;
            const variant = normalizeVariant(target);
            const size = normalizeSize(target);
            if (target.tagName === "BUTTON" && !target.hasAttribute("type")) {
                target.setAttribute("type", "button");
            }
            element.setAttribute("data-variant", variant);
            element.setAttribute("data-size", size);
            const disabled = isDisabled(element);
            element.setAttribute("data-disabled", String(disabled));
            if (disabled) {
                element.setAttribute("aria-disabled", "true");
                if (target.tagName !== "BUTTON" && target.tagName !== "INPUT") {
                    element.setAttribute("tabindex", "-1");
                }
            }
            else if (!element.hasAttribute("aria-disabled")) {
                element.removeAttribute("aria-disabled");
            }
        },
    };
}
