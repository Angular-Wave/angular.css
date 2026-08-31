import type { angular as angularRuntime } from "@angular-wave/angular.ts";
export declare const angularCssModuleName = "ui";
export declare const angular: typeof angularRuntime | undefined;
type AngularCssDirective = readonly [string, () => ng.Directive];
export declare const angularCssDirectives: AngularCssDirective[];
export declare function registerAngularCss(ng?: typeof angularRuntime | undefined): ng.NgModule | undefined;
export {};
