import type { angular as angularRuntime } from "@angular-wave/angular.ts";

import { dropdownDirective } from "./components/dropdown/dropdown";
import { calendarDirective } from "./components/calendar/calendar";
import { carouselDirective } from "./components/carousel/carousel";
import { comboboxDirective } from "./components/combobox/combobox";
import { commandDirective } from "./components/command/command";
import { contextMenuDirective } from "./components/context-menu/context-menu";
import { hoverCardDirective } from "./components/hover-card/hover-card";
import { menubarDirective } from "./components/menubar/menubar";
import { navigationMenuDirective } from "./components/navigation-menu/navigation-menu";
import { resizablePanelGroupDirective } from "./components/resizable/resizable";
import { sidebarDirective } from "./components/sidebar/sidebar";
import { sliderDirective } from "./components/slider/slider";
import { toasterDirective } from "./components/sonner/sonner";
import { tabsDirective } from "./components/tabs/tabs";
import { tooltipDirective } from "./components/tooltip/tooltip";

export const angularCssModuleName = "ui";
const globalScope = globalThis as typeof globalThis & {
  angular?: typeof angularRuntime;
};
export const angular: typeof angularRuntime | undefined = globalScope.angular;

type AngularCssDirective = readonly [string, () => ng.Directive];

export const angularCssDirectives: AngularCssDirective[] = [
  ["ngDropdown", dropdownDirective],
  ["ngCalendar", calendarDirective],
  ["ngCarousel", carouselDirective],
  ["ngCombobox", comboboxDirective],
  ["ngCommand", commandDirective],
  ["ngContextMenu", contextMenuDirective],
  ["ngHoverCard", hoverCardDirective],
  ["ngMenubar", menubarDirective],
  ["ngNavigationMenu", navigationMenuDirective],
  ["ngResizablePanelGroup", resizablePanelGroupDirective],
  ["ngSidebar", sidebarDirective],
  ["ngSlider", sliderDirective],
  ["ngToaster", toasterDirective],
  ["ngTabs", tabsDirective],
  ["ngTooltip", tooltipDirective],
];

export function registerAngularCss(
  ng: typeof angularRuntime | undefined = angular,
): ng.NgModule | undefined {
  if (!ng?.module) return undefined;

  const module = ng.module(angularCssModuleName, []);
  angularCssDirectives.forEach(([name, factory]) => {
    module.directive(name, factory);
  });

  return module;
}

registerAngularCss();
