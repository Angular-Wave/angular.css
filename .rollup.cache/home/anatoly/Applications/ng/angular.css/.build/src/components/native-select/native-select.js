import { onDestroy } from "../../internal/dom";
import { syncNativeControlState } from "../../internal/form";
export function nativeSelectDirective() {
    return {
        link(scope, element) {
            if (!(element instanceof HTMLSelectElement))
                return;
            const sync = () => {
                syncNativeControlState(element);
                element.setAttribute("data-empty", String(!element.value));
                element.setAttribute("data-value", element.value);
                element.setAttribute("data-invalid", String(element.getAttribute("aria-invalid") === "true" ||
                    element.matches(":invalid")));
            };
            const observer = new MutationObserver(sync);
            observer.observe(element, {
                attributes: true,
                attributeFilter: [
                    "aria-invalid",
                    "disabled",
                    "required",
                    "selected",
                    "value",
                ],
                childList: true,
                subtree: true,
            });
            element.addEventListener("input", sync);
            element.addEventListener("change", sync);
            sync();
            onDestroy(scope, () => {
                element.removeEventListener("input", sync);
                element.removeEventListener("change", sync);
                observer.disconnect();
            });
        },
    };
}
