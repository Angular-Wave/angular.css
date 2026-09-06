import type { angular as angularRuntime } from "@angular-wave/angular.ts";
import type { CarouselChangeDetail } from "./components/carousel/carousel.js";
export type CalendarSelectionMode = "multiple" | "range" | "single";
export interface CalendarSelectDetail {
    day: HTMLElement;
    value: string;
    values: string[];
    range: {
        start: string;
        end: string;
    };
    selectionMode: CalendarSelectionMode;
}
export interface CalendarRangeInvalidDetail {
    minNights: number;
    start: string;
    value: string;
}
export interface CalendarMonthChangeDetail {
    month: string;
}
export interface ComboboxOpenChangeDetail {
    open: boolean;
}
export interface ComboboxSelectDetail {
    item: HTMLElement;
    multiple: boolean;
    value: string;
}
export interface ContextMenuSelectDetail {
    item: HTMLElement;
}
export interface TreeSelectDetail {
    id: string;
    selected: boolean;
    value: string;
}
export interface AngularCssEventDetailMap {
    "angularcss:calendar-month-change": CalendarMonthChangeDetail;
    "angularcss:calendar-range-invalid": CalendarRangeInvalidDetail;
    "angularcss:calendar-select": CalendarSelectDetail;
    "angularcss:carousel-change": CarouselChangeDetail;
    "angularcss:carousel-ready": CarouselChangeDetail;
    "angularcss:combobox-clear": null;
    "angularcss:combobox-open-change": ComboboxOpenChangeDetail;
    "angularcss:combobox-remove-last": null;
    "angularcss:combobox-select": ComboboxSelectDetail;
    "angularcss:context-menu-select": ContextMenuSelectDetail;
    "angularcss:tree-select": TreeSelectDetail;
}
export type AngularCssEventName = keyof AngularCssEventDetailMap;
export type AngularCssCustomEvent<Name extends AngularCssEventName> = CustomEvent<AngularCssEventDetailMap[Name]>;
export type { CarouselChangeDetail };
declare global {
    interface HTMLElementEventMap {
        "angularcss:calendar-month-change": AngularCssCustomEvent<"angularcss:calendar-month-change">;
        "angularcss:calendar-range-invalid": AngularCssCustomEvent<"angularcss:calendar-range-invalid">;
        "angularcss:calendar-select": AngularCssCustomEvent<"angularcss:calendar-select">;
        "angularcss:carousel-change": AngularCssCustomEvent<"angularcss:carousel-change">;
        "angularcss:carousel-ready": AngularCssCustomEvent<"angularcss:carousel-ready">;
        "angularcss:combobox-clear": AngularCssCustomEvent<"angularcss:combobox-clear">;
        "angularcss:combobox-open-change": AngularCssCustomEvent<"angularcss:combobox-open-change">;
        "angularcss:combobox-remove-last": AngularCssCustomEvent<"angularcss:combobox-remove-last">;
        "angularcss:combobox-select": AngularCssCustomEvent<"angularcss:combobox-select">;
        "angularcss:context-menu-select": AngularCssCustomEvent<"angularcss:context-menu-select">;
        "angularcss:tree-select": AngularCssCustomEvent<"angularcss:tree-select">;
    }
}
export declare const angularCssModuleName = "angular.css";
export declare const angular: typeof angularRuntime | undefined;
export type AngularCssDirective = readonly [string, () => ng.Directive];
export declare const angularCssDirectives: readonly AngularCssDirective[];
export declare function registerAngularCss(ng?: typeof angularRuntime | undefined): ng.NgModule | undefined;
