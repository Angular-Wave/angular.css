import { onDestroy, query } from "../../internal/dom";
const resolveControl = (label) => {
    const htmlFor = label.getAttribute("for");
    const control = htmlFor
        ? document.getElementById(htmlFor)
        : query(label, "input, textarea, select", HTMLElement);
    return control instanceof HTMLElement ? control : null;
};
const syncState = (label, control) => {
    label.setAttribute("data-associated", String(Boolean(control)));
    label.setAttribute("data-required", String(control?.hasAttribute("required") ??
        control?.getAttribute("aria-required") === "true"));
    label.setAttribute("data-disabled", String(control?.hasAttribute("disabled") ??
        control?.getAttribute("aria-disabled") === "true"));
};
export function labelDirective() {
    return {
        link(_scope, element) {
            let control = null;
            let controlObserver = null;
            const sync = () => {
                const nextControl = resolveControl(element);
                if (nextControl !== control) {
                    controlObserver?.disconnect();
                    control = nextControl;
                    if (control) {
                        controlObserver = new MutationObserver(sync);
                        controlObserver.observe(control, {
                            attributes: true,
                            attributeFilter: [
                                "required",
                                "disabled",
                                "aria-required",
                                "aria-disabled",
                            ],
                        });
                    }
                    else {
                        controlObserver = null;
                    }
                }
                syncState(element, control);
            };
            const labelObserver = new MutationObserver(sync);
            labelObserver.observe(element, {
                attributes: true,
                childList: true,
                subtree: true,
                attributeFilter: ["for"],
            });
            const associationObserver = new MutationObserver(sync);
            associationObserver.observe(element.parentElement ?? element.ownerDocument, {
                childList: true,
                subtree: true,
            });
            sync();
            onDestroy(_scope, () => {
                controlObserver?.disconnect();
                labelObserver.disconnect();
                associationObserver.disconnect();
            });
        },
    };
}
