import type { angular as angularRuntime } from "@angular-wave/angular.ts";

import { accordionDirective } from "./components/accordion/accordion";
import { dropdownDirective } from "./components/dropdown/dropdown";
import { alertDialogDirective } from "./components/alert-dialog/alert-dialog";
import { avatarDirective } from "./components/avatar/avatar";
import { calendarDirective } from "./components/calendar/calendar";
import { carouselDirective } from "./components/carousel/carousel";
import { collapsibleDirective } from "./components/collapsible/collapsible";
import { comboboxDirective } from "./components/combobox/combobox";
import { commandDirective } from "./components/command/command";
import { contextMenuDirective } from "./components/context-menu/context-menu";
import { dialogDirective } from "./components/dialog/dialog";
import { drawerDirective } from "./components/drawer/drawer";
import { fieldDirective } from "./components/field/field";
import { hoverCardDirective } from "./components/hover-card/hover-card";
import { inputGroupDirective } from "./components/input-group/input-group";
import { inputOtpDirective } from "./components/input-otp/input-otp";
import { menubarDirective } from "./components/menubar/menubar";
import { navigationMenuDirective } from "./components/navigation-menu/navigation-menu";
import { popoverDirective } from "./components/popover/popover";
import { resizablePanelGroupDirective } from "./components/resizable/resizable";
import { scrollAreaDirective } from "./components/scroll-area/scroll-area";
import { sheetDirective } from "./components/sheet/sheet";
import { sidebarDirective } from "./components/sidebar/sidebar";
import { sliderDirective } from "./components/slider/slider";
import { toasterDirective } from "./components/sonner/sonner";
import { tabsDirective } from "./components/tabs/tabs";
import { toggleGroupDirective } from "./components/toggle-group/toggle-group";
import { tooltipDirective } from "./components/tooltip/tooltip";

export const angularCssModuleName = "ui";
const globalScope = globalThis as typeof globalThis & {
  angular?: typeof angularRuntime;
};
export const angular: typeof angularRuntime | undefined = globalScope.angular;

type AngularCssDirective = readonly [string, () => ng.Directive];

export const angularCssDirectives: AngularCssDirective[] = [
  ["ngAccordion", accordionDirective],
  ["ngDropdown", dropdownDirective],
  ["ngAlertDialog", alertDialogDirective],
  ["ngAvatar", avatarDirective],
  ["ngCalendar", calendarDirective],
  ["ngCarousel", carouselDirective],
  ["ngCollapsible", collapsibleDirective],
  ["ngCombobox", comboboxDirective],
  ["ngCommand", commandDirective],
  ["ngContextMenu", contextMenuDirective],
  ["ngDialog", dialogDirective],
  ["ngDrawer", drawerDirective],
  ["ngField", fieldDirective],
  ["ngHoverCard", hoverCardDirective],
  ["ngInputGroup", inputGroupDirective],
  ["ngInputOtp", inputOtpDirective],
  ["ngMenubar", menubarDirective],
  ["ngNavigationMenu", navigationMenuDirective],
  ["ngPopover", popoverDirective],
  ["ngResizablePanelGroup", resizablePanelGroupDirective],
  ["ngScrollArea", scrollAreaDirective],
  ["ngSheet", sheetDirective],
  ["ngSidebar", sidebarDirective],
  ["ngSlider", sliderDirective],
  ["ngToaster", toasterDirective],
  ["ngTabs", tabsDirective],
  ["ngToggleGroup", toggleGroupDirective],
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
