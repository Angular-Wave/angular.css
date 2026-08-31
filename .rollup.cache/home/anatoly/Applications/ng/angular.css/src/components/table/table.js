import { onDestroy, queryAll } from "../../internal/dom";
export function tableDirective() {
    return {
        link(scope, element) {
            const sync = () => {
                const rows = queryAll(element, "tbody tr");
                const heads = queryAll(element, "thead th");
                const rowHeads = queryAll(element, "tbody th");
                const firstRowCells = queryAll(element, "thead tr:first-child > th, thead tr:first-child > td");
                element.setAttribute("data-row-count", String(rows.length));
                element.setAttribute("data-column-count", String(firstRowCells.length));
                heads.forEach((head) => {
                    head.setAttribute("scope", head.getAttribute("scope") ?? "col");
                });
                rowHeads.forEach((head) => {
                    head.setAttribute("scope", head.getAttribute("scope") ?? "row");
                });
            };
            const observer = new MutationObserver(sync);
            observer.observe(element, { childList: true, subtree: true });
            sync();
            onDestroy(scope, () => {
                observer.disconnect();
            });
        },
    };
}
