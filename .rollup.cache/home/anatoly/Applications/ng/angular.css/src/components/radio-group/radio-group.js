import { onDestroy, queryAll } from "../../internal/dom";
const radioSelector = 'input[type="radio"]';
export function radioGroupDirective() {
    return {
        link(scope, element) {
            let radios = [];
            const boundRadios = new Set();
            let initialSyncFrame = null;
            const sync = () => {
                radios = queryAll(element, radioSelector);
                radios.forEach((radio) => {
                    bindRadio(radio);
                    const checked = radio.checked;
                    radio.setAttribute("role", radio.getAttribute("role") ?? "radio");
                    radio.setAttribute("data-state", checked ? "checked" : "unchecked");
                    radio.setAttribute("aria-checked", String(checked));
                });
            };
            const bindRadio = (radio) => {
                if (boundRadios.has(radio))
                    return;
                boundRadios.add(radio);
                radio.addEventListener("change", sync);
            };
            element.setAttribute("role", element.getAttribute("role") ?? "radiogroup");
            const handleKeydown = (event) => {
                if (!event.key.startsWith("Arrow"))
                    return;
                queueMicrotask(sync);
            };
            const observer = new MutationObserver(sync);
            observer.observe(element, {
                attributes: true,
                attributeFilter: ["checked", "class"],
                childList: true,
                subtree: true,
            });
            element.addEventListener("keydown", handleKeydown);
            sync();
            initialSyncFrame = requestAnimationFrame(() => {
                initialSyncFrame = null;
                sync();
            });
            onDestroy(scope, () => {
                if (initialSyncFrame !== null)
                    cancelAnimationFrame(initialSyncFrame);
                observer.disconnect();
                boundRadios.forEach((radio) => {
                    radio.removeEventListener("change", sync);
                });
                boundRadios.clear();
                element.removeEventListener("keydown", handleKeydown);
            });
        },
    };
}
