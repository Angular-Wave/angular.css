import { bindOverlay } from "../../internal/disclosure";
import { onDestroy, queryAll } from "../../internal/dom";
const drawerSides = new Set(["bottom", "left", "right", "top"]);
const setAttributeIfChanged = (element, name, value) => {
    if (element.getAttribute(name) !== value) {
        element.setAttribute(name, value);
    }
};
export function drawerDirective() {
    return {
        link(scope, element) {
            const getContent = () => queryAll(element, '[data-slot="drawer-content"], [ng-drawer-content]').find((candidate) => candidate.closest('[data-slot="drawer"], [ng-drawer]') === element) ?? null;
            const syncSide = () => {
                const content = getContent();
                const authoredSide = element.getAttribute("side") ??
                    element.getAttribute("direction") ??
                    content?.getAttribute("side") ??
                    content?.getAttribute("direction");
                const side = authoredSide && drawerSides.has(authoredSide)
                    ? authoredSide
                    : "bottom";
                setAttributeIfChanged(element, "data-side", side);
                if (content)
                    setAttributeIfChanged(content, "data-side", side);
            };
            bindOverlay(scope, element, {
                rootSelector: '[data-slot="drawer"], [ng-drawer]',
                closeSelector: '[data-slot="drawer-close"], [ng-drawer-close], [data-drawer-close]',
                contentSelector: '[data-slot="drawer-content"], [ng-drawer-content]',
                descriptionSelector: '[data-slot="drawer-description"], [ng-drawer-description]',
                overlaySelector: '[data-slot="drawer-overlay"], [ng-drawer-overlay]',
                titleSelector: '[data-slot="drawer-title"], [ng-drawer-title]',
                triggerSelector: '[data-slot="drawer-trigger"], [ng-drawer-trigger]',
                closeOnOutsideClick: true,
            });
            const sideObserver = new MutationObserver(syncSide);
            sideObserver.observe(element, {
                attributes: true,
                attributeFilter: ["direction", "side"],
                childList: true,
                subtree: true,
            });
            syncSide();
            onDestroy(scope, () => {
                sideObserver.disconnect();
            });
        },
    };
}
