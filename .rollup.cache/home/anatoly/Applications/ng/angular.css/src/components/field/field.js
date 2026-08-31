import { query, onDestroy } from "../../internal/dom";
let fieldIdCounter = 0;
const findControl = (element) => {
    return query(element, "input, textarea, select, button, [role='combobox'], [role='switch']", HTMLElement);
};
const findDescription = (element) => {
    return query(element, '[data-slot="field-description"], [ng-field-description]', HTMLElement);
};
const findError = (element) => {
    return query(element, '[data-slot="field-error"], [ng-field-error]', HTMLElement);
};
const isElementVisible = (node) => {
    return node instanceof HTMLElement && !node.hidden;
};
export function fieldDirective() {
    return {
        link(_scope, element) {
            if (!element.hasAttribute("role")) {
                element.setAttribute("role", "group");
            }
            const resolveControl = () => findControl(element);
            let currentControl = null;
            const handleFormStateChange = () => {
                sync();
            };
            const bindControl = (control) => {
                if (control === currentControl)
                    return;
                currentControl?.removeEventListener("input", handleFormStateChange);
                currentControl?.removeEventListener("change", handleFormStateChange);
                currentControl = control;
                currentControl?.addEventListener("input", handleFormStateChange);
                currentControl?.addEventListener("change", handleFormStateChange);
            };
            const sync = () => {
                const control = resolveControl();
                bindControl(control);
                const description = findDescription(element);
                const error = findError(element);
                const visibleError = isElementVisible(error);
                const nativeInvalid = control?.matches(":invalid") ?? false;
                const invalid = visibleError ||
                    nativeInvalid ||
                    control?.getAttribute("aria-invalid") === "true";
                element.setAttribute("data-invalid", String(invalid));
                if (!control)
                    return;
                const describedBy = [description, error]
                    .filter(isElementVisible)
                    .map((part) => {
                    part.id = part.id || `field-message-${String(fieldIdCounter++)}`;
                    return part.id;
                });
                const nextAriaDescribedBy = describedBy.join(" ");
                if (nextAriaDescribedBy.length > 0) {
                    if (control.getAttribute("aria-describedby") !== nextAriaDescribedBy) {
                        control.setAttribute("aria-describedby", nextAriaDescribedBy);
                    }
                }
                else {
                    control.removeAttribute("aria-describedby");
                }
            };
            const observer = new MutationObserver(() => {
                sync();
            });
            observer.observe(element, {
                childList: true,
                attributes: true,
                subtree: true,
                attributeFilter: [
                    "aria-invalid",
                    "class",
                    "disabled",
                    "hidden",
                    "required",
                ],
            });
            sync();
            onDestroy(_scope, () => {
                observer.disconnect();
                bindControl(null);
            });
        },
    };
}
