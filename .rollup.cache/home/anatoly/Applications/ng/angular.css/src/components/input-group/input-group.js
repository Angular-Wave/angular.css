import { onDestroy, query, queryAll } from "../../internal/dom";
let inputGroupIdCounter = 0;
const addonSelector = '[data-slot="input-group-addon"], [ng-input-group-addon]';
const buttonSelector = '[data-slot="input-group-button"], [ng-input-group-button]';
const controlSelector = 'input, textarea, select, [role="combobox"], [role="spinbutton"]';
export function inputGroupDirective() {
    return {
        link(scope, element) {
            let describedControl = null;
            let managedDescriptionIds = new Set();
            if (!element.hasAttribute("role")) {
                element.setAttribute("role", "group");
            }
            const removeManagedDescriptions = (control) => {
                if (!control || managedDescriptionIds.size === 0)
                    return;
                const remaining = (control.getAttribute("aria-describedby") ?? "")
                    .split(/\s+/)
                    .filter((id) => id && !managedDescriptionIds.has(id));
                if (remaining.length) {
                    control.setAttribute("aria-describedby", remaining.join(" "));
                }
                else {
                    control.removeAttribute("aria-describedby");
                }
            };
            const sync = () => {
                const addons = queryAll(element, addonSelector);
                const control = query(element, controlSelector, HTMLElement);
                const visibleAddonIds = addons
                    .filter((addon) => addon.getAttribute("aria-hidden") !== "true")
                    .map((addon) => {
                    addon.id =
                        addon.id || `input-group-addon-${String(inputGroupIdCounter++)}`;
                    return addon.id;
                });
                element.setAttribute("data-has-addon", String(addons.length > 0));
                element.setAttribute("data-has-button", String(Boolean(query(element, buttonSelector))));
                element.setAttribute("data-addon-count", String(addons.length));
                if (control !== describedControl) {
                    removeManagedDescriptions(describedControl);
                    describedControl = control;
                    managedDescriptionIds = new Set();
                }
                if (!control)
                    return;
                const current = control.getAttribute("aria-describedby");
                const tokens = new Set((current ?? "").split(/\s+/).filter(Boolean));
                managedDescriptionIds.forEach((id) => tokens.delete(id));
                visibleAddonIds.forEach((id) => tokens.add(id));
                managedDescriptionIds = new Set(visibleAddonIds);
                if (tokens.size) {
                    control.setAttribute("aria-describedby", Array.from(tokens).join(" "));
                }
                else {
                    control.removeAttribute("aria-describedby");
                }
            };
            const observer = new MutationObserver(sync);
            observer.observe(element, {
                attributes: true,
                attributeFilter: ["aria-hidden"],
                childList: true,
                subtree: true,
            });
            sync();
            const focusControlFromAddon = (event) => {
                const target = event.target;
                if (!(target instanceof Element))
                    return;
                const addon = target.closest(addonSelector);
                if (!addon || !element.contains(addon) || target.closest("button")) {
                    return;
                }
                query(element, controlSelector, HTMLElement)?.focus();
            };
            element.addEventListener("click", focusControlFromAddon);
            onDestroy(scope, () => {
                observer.disconnect();
                element.removeEventListener("click", focusControlFromAddon);
                removeManagedDescriptions(describedControl);
            });
        },
    };
}
