import { onDestroy, query, setOpenState } from "../../internal/dom";
let collapsibleIdCounter = 0;
export function collapsibleDirective() {
    return {
        link(scope, element) {
            const trigger = query(element, '[data-slot="collapsible-trigger"], [ng-collapsible-trigger], button', HTMLElement);
            const content = query(element, '[data-slot="collapsible-content"], [ng-collapsible-content]', HTMLElement);
            if (!trigger || !content)
                return;
            const contentId = content.id || `collapsible-content-${String(collapsibleIdCounter++)}`;
            const triggerId = trigger.id || `collapsible-trigger-${String(collapsibleIdCounter++)}`;
            content.id = contentId;
            trigger.id = triggerId;
            trigger.setAttribute("aria-controls", contentId);
            if (!content.hasAttribute("aria-labelledby")) {
                content.setAttribute("aria-labelledby", triggerId);
            }
            const setOpen = (open) => {
                element.setAttribute("data-state", open ? "open" : "closed");
                if (element instanceof HTMLDetailsElement && element.open !== open) {
                    element.open = open;
                }
                trigger.setAttribute("aria-expanded", String(open));
                trigger.setAttribute("data-state", open ? "open" : "closed");
                content.setAttribute("data-state", open ? "open" : "closed");
                setOpenState(content, open);
            };
            const readOpenState = () => {
                const controlledOpen = element.getAttribute("data-open");
                if (controlledOpen !== null)
                    return controlledOpen === "true";
                return (element.getAttribute("open") === "true" ||
                    element.hasAttribute("open"));
            };
            setOpen(readOpenState());
            const observer = new MutationObserver(() => {
                setOpen(readOpenState());
            });
            observer.observe(element, {
                attributes: true,
                attributeFilter: ["data-open", "open"],
            });
            const details = element instanceof HTMLDetailsElement ? element : null;
            const handleToggle = () => {
                if (details)
                    setOpen(details.open);
            };
            const handleClick = () => {
                if (!details)
                    setOpen(Boolean(content.hidden));
            };
            if (details) {
                details.addEventListener("toggle", handleToggle);
            }
            else {
                trigger.addEventListener("click", handleClick);
            }
            onDestroy(scope, () => {
                observer.disconnect();
                details?.removeEventListener("toggle", handleToggle);
                if (!details)
                    trigger.removeEventListener("click", handleClick);
            });
        },
    };
}
