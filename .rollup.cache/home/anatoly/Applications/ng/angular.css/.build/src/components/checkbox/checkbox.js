import { onDestroy } from "../../internal/dom";
import { syncNativeControlState } from "../../internal/form";
export function checkboxDirective() {
    return {
        link(scope, element) {
            if (!(element instanceof HTMLInputElement))
                return;
            const sync = () => {
                const checked = element.checked;
                const state = element.indeterminate
                    ? "indeterminate"
                    : checked
                        ? "checked"
                        : "unchecked";
                syncNativeControlState(element);
                element.setAttribute("data-state", state);
                element.setAttribute("aria-checked", element.indeterminate ? "mixed" : String(checked));
                element.setAttribute("data-invalid", String(element.getAttribute("aria-invalid") === "true" ||
                    element.matches(":invalid")));
            };
            const observer = new MutationObserver(sync);
            observer.observe(element, {
                attributes: true,
                attributeFilter: [
                    "aria-invalid",
                    "checked",
                    "disabled",
                    "required",
                    "value",
                ],
            });
            element.addEventListener("input", sync);
            element.addEventListener("change", sync);
            sync();
            onDestroy(scope, () => {
                observer.disconnect();
                element.removeEventListener("input", sync);
                element.removeEventListener("change", sync);
            });
        },
    };
}
