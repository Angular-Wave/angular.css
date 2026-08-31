import { onDestroy, queryAll } from "../../internal/dom";
const valueSelector = '[data-slot="chart-bar"], [ng-chart-bar]';
const colorSelector = '[data-slot="chart-bar"], [ng-chart-bar], [data-slot="chart-swatch"], [ng-chart-swatch], [data-slot="chart-tooltip-indicator"], [ng-chart-tooltip-indicator]';
const semanticSlots = {
    axis: '[data-slot="chart-axis"], [ng-chart-axis]',
    axisItem: '[data-slot="chart-axis-item"], [ng-chart-axis-item]',
    grid: '[data-slot="chart-grid"], [ng-chart-grid]',
    legend: '[data-slot="chart-legend"], [ng-chart-legend]',
    legendItem: '[data-slot="chart-legend-item"], [ng-chart-legend-item]',
    tooltip: '[data-slot="chart-tooltip"], [ng-chart-tooltip]',
    tooltipIndicator: '[data-slot="chart-tooltip-indicator"], [ng-chart-tooltip-indicator]',
    tooltipItem: '[data-slot="chart-tooltip-item"], [ng-chart-tooltip-item]',
    tooltipItems: '[data-slot="chart-tooltip-items"], [ng-chart-tooltip-items]',
};
const syncValue = (element) => {
    const value = element.getAttribute("data-value");
    if (value)
        element.style.setProperty("--value", value);
    else
        element.style.removeProperty("--value");
};
const syncColor = (element) => {
    const color = element.getAttribute("data-color");
    if (color)
        element.style.setProperty("--chart-color", color);
    else
        element.style.removeProperty("--chart-color");
};
const syncDirection = (element) => {
    const direction = element.closest("[dir]")?.getAttribute("dir") === "rtl"
        ? "rtl"
        : "ltr";
    if (element.getAttribute("data-direction") !== direction) {
        element.setAttribute("data-direction", direction);
    }
};
const syncChartSemantics = (element) => {
    if (!element.getAttribute("role"))
        element.setAttribute("role", "img");
    if (!element.getAttribute("aria-label")) {
        element.setAttribute("aria-label", "Chart");
    }
};
const barLabel = (element) => {
    const label = element.getAttribute("data-label");
    const value = element.getAttribute("data-value");
    if (label && value)
        return `${label}: ${value}`;
    return label ?? value;
};
const syncBarSemantics = (element, generatedLabels) => {
    if (!element.getAttribute("role"))
        element.setAttribute("role", "img");
    const current = element.getAttribute("aria-label");
    const previousGenerated = generatedLabels.get(element);
    if (current && current !== previousGenerated) {
        generatedLabels.delete(element);
        return;
    }
    const next = barLabel(element);
    if (next) {
        if (current !== next)
            element.setAttribute("aria-label", next);
        generatedLabels.set(element, next);
    }
    else if (previousGenerated && current === previousGenerated) {
        element.removeAttribute("aria-label");
        generatedLabels.delete(element);
    }
};
export function chartDirective() {
    return {
        link(scope, element) {
            const directionOwner = element.closest("[dir]") ?? element;
            const generatedLabels = new WeakMap();
            const sync = () => {
                syncChartSemantics(element);
                syncDirection(element);
                queryAll(element, valueSelector).forEach(syncValue);
                queryAll(element, colorSelector).forEach(syncColor);
                queryAll(element, valueSelector).forEach((bar) => {
                    syncBarSemantics(bar, generatedLabels);
                });
                queryAll(element, semanticSlots.axis).forEach((axis) => {
                    if (!axis.hasAttribute("role"))
                        axis.setAttribute("role", "list");
                });
                queryAll(element, semanticSlots.axisItem).forEach((item) => {
                    if (!item.hasAttribute("role"))
                        item.setAttribute("role", "listitem");
                });
                queryAll(element, semanticSlots.grid).forEach((grid) => {
                    if (!grid.hasAttribute("aria-hidden")) {
                        grid.setAttribute("aria-hidden", "true");
                    }
                });
                queryAll(element, semanticSlots.legend).forEach((legend) => {
                    if (!legend.hasAttribute("role"))
                        legend.setAttribute("role", "list");
                });
                queryAll(element, semanticSlots.legendItem).forEach((item) => {
                    if (!item.hasAttribute("role"))
                        item.setAttribute("role", "listitem");
                });
                queryAll(element, semanticSlots.tooltip).forEach((tooltip) => {
                    if (!tooltip.hasAttribute("role"))
                        tooltip.setAttribute("role", "status");
                    const visible = !tooltip.hidden;
                    tooltip.setAttribute("aria-hidden", String(!visible));
                    tooltip.setAttribute("data-visible", String(visible));
                });
                queryAll(element, semanticSlots.tooltipItems).forEach((items) => {
                    if (!items.hasAttribute("role"))
                        items.setAttribute("role", "list");
                });
                queryAll(element, semanticSlots.tooltipItem).forEach((item) => {
                    if (!item.hasAttribute("role"))
                        item.setAttribute("role", "listitem");
                });
                queryAll(element, semanticSlots.tooltipIndicator).forEach((indicator) => {
                    if (!indicator.hasAttribute("aria-hidden")) {
                        indicator.setAttribute("aria-hidden", "true");
                    }
                });
            };
            const observer = new MutationObserver(sync);
            observer.observe(element, {
                attributes: true,
                attributeFilter: [
                    "aria-label",
                    "data-color",
                    "data-label",
                    "data-value",
                    "dir",
                    "hidden",
                    "role",
                ],
                childList: true,
                subtree: true,
            });
            const directionObserver = directionOwner === element ? null : new MutationObserver(sync);
            directionObserver?.observe(directionOwner, {
                attributes: true,
                attributeFilter: ["dir"],
            });
            sync();
            onDestroy(scope, () => {
                observer.disconnect();
                directionObserver?.disconnect();
            });
        },
    };
}
