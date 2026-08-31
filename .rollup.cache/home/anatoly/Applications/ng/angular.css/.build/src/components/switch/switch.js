import { onDestroy } from "../../internal/dom";
import { syncNativeControlState } from "../../internal/form";
export function switchDirective() {
    return {
        link(scope, element) {
            const setAttribute = (name, value) => {
                if (element.getAttribute(name) !== value) {
                    element.setAttribute(name, value);
                }
            };
            const removeAttribute = (name) => {
                if (element.hasAttribute(name)) {
                    element.removeAttribute(name);
                }
            };
            const getChecked = () => {
                if (element instanceof HTMLInputElement) {
                    return element.checked;
                }
                if (element.getAttribute("data-state") === "checked") {
                    return true;
                }
                return element.getAttribute("aria-checked") === "true";
            };
            const getDisabled = () => element instanceof HTMLInputElement
                ? element.disabled
                : element.hasAttribute("disabled") ||
                    element.getAttribute("aria-disabled") === "true";
            const sync = () => {
                const checked = getChecked();
                const disabled = getDisabled();
                if (element instanceof HTMLInputElement) {
                    syncNativeControlState(element);
                }
                else if (disabled) {
                    setAttribute("aria-disabled", "true");
                    setAttribute("data-disabled", "true");
                }
                else {
                    removeAttribute("aria-disabled");
                    setAttribute("data-disabled", "false");
                }
                setAttribute("role", "switch");
                setAttribute("aria-checked", String(checked));
                setAttribute("data-state", checked ? "checked" : "unchecked");
                setAttribute("data-invalid", String(element.getAttribute("aria-invalid") === "true" ||
                    (element instanceof HTMLInputElement &&
                        element.matches(":invalid"))));
            };
            const setChecked = (checked) => {
                if (element instanceof HTMLInputElement) {
                    sync();
                    return;
                }
                else {
                    setAttribute("aria-checked", String(checked));
                    setAttribute("data-state", checked ? "checked" : "unchecked");
                }
                sync();
            };
            const toggle = () => {
                if (getDisabled())
                    return;
                if (element instanceof HTMLInputElement)
                    return;
                setChecked(!getChecked());
            };
            const handleKeydown = (event) => {
                if (element instanceof HTMLInputElement)
                    return;
                if (getDisabled())
                    return;
                if (event.key !== "Enter" && event.key !== " ")
                    return;
                event.preventDefault();
                toggle();
            };
            const observer = new MutationObserver(sync);
            observer.observe(element, {
                attributes: true,
                attributeFilter: element instanceof HTMLInputElement
                    ? ["aria-invalid", "checked", "disabled", "required", "value"]
                    : [
                        "aria-checked",
                        "aria-disabled",
                        "aria-invalid",
                        "data-state",
                        "disabled",
                    ],
            });
            element.addEventListener("input", sync);
            element.addEventListener("change", sync);
            element.addEventListener("click", toggle);
            element.addEventListener("keydown", handleKeydown);
            sync();
            onDestroy(scope, () => {
                observer.disconnect();
                element.removeEventListener("input", sync);
                element.removeEventListener("change", sync);
                element.removeEventListener("click", toggle);
                element.removeEventListener("keydown", handleKeydown);
            });
        },
    };
}
