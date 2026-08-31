import { isDisabled, onDestroy, query, setOpenState } from "../../internal/dom";
let tooltipIdCounter = 0;
const sides = new Set(["bottom", "left", "right", "top"]);
const setAttributeIfChanged = (element, name, value) => {
    if (element.getAttribute(name) !== value) {
        element.setAttribute(name, value);
    }
};
export function tooltipDirective() {
    return {
        link(scope, element) {
            const directionOwner = element.closest("[dir]") ?? element;
            const trigger = query(element, '[data-slot="tooltip-trigger"], [ng-tooltip-trigger]', HTMLElement);
            const content = query(element, '[data-slot="tooltip-content"], [ng-tooltip-content]', HTMLElement);
            if (!trigger || !content)
                return;
            const getDirection = () => element.closest("[dir]")?.getAttribute("dir") === "rtl"
                ? "rtl"
                : "ltr";
            const syncDirection = () => {
                const direction = getDirection();
                setAttributeIfChanged(element, "data-direction", direction);
                setAttributeIfChanged(content, "data-direction", direction);
            };
            const syncSide = () => {
                const authored = content.getAttribute("side") ?? content.getAttribute("data-side");
                const side = authored && sides.has(authored) ? authored : "top";
                setAttributeIfChanged(content, "data-side", side);
            };
            const contentId = content.id || `tooltip-content-${String(tooltipIdCounter++)}`;
            content.id = contentId;
            trigger.setAttribute("aria-describedby", contentId);
            content.setAttribute("role", content.getAttribute("role") ?? "tooltip");
            let controlledOpen = element.getAttribute("data-open") === "true" ||
                content.getAttribute("data-open") === "true";
            let keepOpen = false;
            const isOpen = () => keepOpen || controlledOpen;
            let appliedOpen = isOpen();
            let reflectingOpen = false;
            const setOpen = () => {
                const nextOpen = isOpen();
                const wasOpen = appliedOpen;
                appliedOpen = nextOpen;
                const state = nextOpen ? "open" : "closed";
                setAttributeIfChanged(element, "data-state", state);
                setAttributeIfChanged(trigger, "data-state", state);
                setAttributeIfChanged(content, "data-state", state);
                setAttributeIfChanged(content, "aria-hidden", String(!nextOpen));
                reflectingOpen = true;
                setAttributeIfChanged(element, "data-open", String(nextOpen));
                setOpenState(content, nextOpen);
                queueMicrotask(() => {
                    reflectingOpen = false;
                });
                if (nextOpen === wasOpen)
                    return;
            };
            const syncFromAttribute = (source) => {
                if (reflectingOpen)
                    return;
                const nextOpen = source.getAttribute("data-open") === "true";
                if (nextOpen === controlledOpen)
                    return;
                controlledOpen = nextOpen;
                setOpen();
            };
            const openObserver = new MutationObserver((records) => {
                syncSide();
                if (records.some((record) => record.attributeName === "data-open")) {
                    syncFromAttribute(content);
                }
            });
            openObserver.observe(content, {
                attributes: true,
                attributeFilter: ["data-open", "data-side", "side"],
            });
            const directionObserver = directionOwner === element ? null : new MutationObserver(syncDirection);
            directionObserver?.observe(directionOwner, {
                attributes: true,
                attributeFilter: ["dir"],
            });
            const elementObserver = new MutationObserver((records) => {
                syncDirection();
                if (records.some((record) => record.attributeName === "data-open")) {
                    syncFromAttribute(element);
                }
            });
            elementObserver.observe(element, {
                attributes: true,
                attributeFilter: ["data-open", "dir"],
            });
            syncDirection();
            syncSide();
            setOpen();
            const handleOpen = () => {
                if (isDisabled(trigger))
                    return;
                keepOpen = true;
                setOpen();
            };
            const handleClose = () => {
                keepOpen = false;
                setOpen();
            };
            const handleKeydown = (event) => {
                if (event.key === "Escape")
                    handleClose();
            };
            trigger.addEventListener("mouseenter", handleOpen);
            trigger.addEventListener("mouseleave", handleClose);
            trigger.addEventListener("focusin", handleOpen);
            trigger.addEventListener("focus", handleOpen);
            trigger.addEventListener("blur", handleClose);
            trigger.addEventListener("keydown", handleKeydown);
            onDestroy(scope, () => {
                openObserver.disconnect();
                directionObserver?.disconnect();
                elementObserver.disconnect();
                trigger.removeEventListener("mouseenter", handleOpen);
                trigger.removeEventListener("mouseleave", handleClose);
                trigger.removeEventListener("focusin", handleOpen);
                trigger.removeEventListener("focus", handleOpen);
                trigger.removeEventListener("blur", handleClose);
                trigger.removeEventListener("keydown", handleKeydown);
            });
        },
    };
}
