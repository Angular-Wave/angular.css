import type {} from "@angular-wave/angular.ts";

import { onDestroy, queryAll } from "../../internal/dom";

export function tableDirective(): ng.Directive {
  return {
    link(scope: ng.Scope, element: HTMLElement) {
      const sync = () => {
        const rows = queryAll<HTMLTableRowElement>(element, "tbody tr");
        const heads = queryAll<HTMLTableCellElement>(element, "thead th");
        const rowHeads = queryAll<HTMLTableCellElement>(element, "tbody th");
        const firstRowCells = queryAll<HTMLTableCellElement>(
          element,
          "thead tr:first-child > th, thead tr:first-child > td",
        );

        element.setAttribute("data-row-count", String(rows.length));
        element.setAttribute("data-column-count", String(firstRowCells.length));
        heads.forEach((head) => {
          head.setAttribute("scope", head.getAttribute("scope") || "col");
        });
        rowHeads.forEach((head) => {
          head.setAttribute("scope", head.getAttribute("scope") || "row");
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
