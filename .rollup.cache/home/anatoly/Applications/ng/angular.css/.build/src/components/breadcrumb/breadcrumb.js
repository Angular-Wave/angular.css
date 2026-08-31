import { onDestroy, queryAll } from "../../internal/dom";
const pageSelector = '[data-slot="breadcrumb-page"], [ng-breadcrumb-page]';
const listSelector = '[data-slot="breadcrumb-list"], [ng-breadcrumb-list]';
const itemSelector = '[data-slot="breadcrumb-item"], [ng-breadcrumb-item]';
const separatorSelector = '[data-slot="breadcrumb-separator"], [ng-breadcrumb-separator]';
const ellipsisSelector = '[data-slot="breadcrumb-ellipsis"], [ng-breadcrumb-ellipsis]';
const defaultSeparatorIcon = `
  <svg data-breadcrumb-generated="separator" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="m9 18 6-6-6-6"></path>
  </svg>
`;
const defaultEllipsisIcon = `
  <svg data-breadcrumb-generated="ellipsis" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="1"></circle>
    <circle cx="19" cy="12" r="1"></circle>
    <circle cx="5" cy="12" r="1"></circle>
  </svg>
`;
const setAttribute = (element, name, value) => {
    if (element.getAttribute(name) !== value) {
        element.setAttribute(name, value);
    }
};
const removeAttribute = (element, name) => {
    if (element.hasAttribute(name)) {
        element.removeAttribute(name);
    }
};
export function breadcrumbDirective() {
    return {
        link(scope, element) {
            const ownedCurrentPages = new WeakSet();
            setAttribute(element, "aria-label", element.getAttribute("aria-label") ?? "breadcrumb");
            const sync = () => {
                const pages = queryAll(element, pageSelector);
                const lists = queryAll(element, listSelector);
                const items = queryAll(element, itemSelector);
                const separators = queryAll(element, separatorSelector);
                const ellipses = queryAll(element, ellipsisSelector);
                const lastPage = pages.at(-1);
                const userCurrentPages = pages.filter((page) => page.hasAttribute("aria-current") && !ownedCurrentPages.has(page));
                lists.forEach((list) => {
                    setAttribute(list, "role", list.getAttribute("role") ?? "list");
                });
                items.forEach((item) => {
                    setAttribute(item, "role", item.getAttribute("role") ?? "listitem");
                });
                separators.forEach((separator) => {
                    setAttribute(separator, "role", separator.getAttribute("role") ?? "presentation");
                    setAttribute(separator, "aria-hidden", "true");
                    if (!separator.textContent.trim() &&
                        separator.childElementCount === 0) {
                        separator.insertAdjacentHTML("beforeend", defaultSeparatorIcon);
                    }
                });
                ellipses.forEach((ellipsis) => {
                    setAttribute(ellipsis, "role", ellipsis.getAttribute("role") ?? "presentation");
                    setAttribute(ellipsis, "aria-hidden", "true");
                    if (!ellipsis.querySelector("svg")) {
                        ellipsis.insertAdjacentHTML("afterbegin", defaultEllipsisIcon);
                    }
                });
                pages.forEach((page) => {
                    setAttribute(page, "role", page.getAttribute("role") ?? "link");
                    setAttribute(page, "aria-disabled", page.getAttribute("aria-disabled") ?? "true");
                    if (ownedCurrentPages.has(page) &&
                        (page !== lastPage || userCurrentPages.length > 0)) {
                        removeAttribute(page, "aria-current");
                        ownedCurrentPages.delete(page);
                    }
                });
                if (userCurrentPages.length > 0)
                    return;
                if (lastPage && !lastPage.hasAttribute("aria-current")) {
                    setAttribute(lastPage, "aria-current", "page");
                    ownedCurrentPages.add(lastPage);
                }
            };
            const observer = new MutationObserver(sync);
            observer.observe(element, {
                attributes: true,
                attributeFilter: ["aria-current", "data-slot"],
                childList: true,
                subtree: true,
            });
            sync();
            onDestroy(scope, () => {
                observer.disconnect();
            });
        },
    };
}
