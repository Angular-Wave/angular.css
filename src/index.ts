import type { angular as angularRuntime } from "@angular-wave/angular.ts";

import { accordionDirective } from "./components/accordion/accordion";
import { dropdownDirective } from "./components/dropdown/dropdown";
import { alertDirective } from "./components/alert/alert";
import { alertDialogDirective } from "./components/alert-dialog/alert-dialog";
import { aspectRatioDirective } from "./components/aspect-ratio/aspect-ratio";
import { avatarDirective } from "./components/avatar/avatar";
import { badgeDirective } from "./components/badge/badge";
import { breadcrumbDirective } from "./components/breadcrumb/breadcrumb";
import { buttonDirective } from "./components/button/button";
import { buttonGroupDirective } from "./components/button-group/button-group";
import { calendarDirective } from "./components/calendar/calendar";
import { carouselDirective } from "./components/carousel/carousel";
import { cardDirective } from "./components/card/card";
import { chartDirective } from "./components/chart/chart";
import { checkboxDirective } from "./components/checkbox/checkbox";
import { collapsibleDirective } from "./components/collapsible/collapsible";
import { comboboxDirective } from "./components/combobox/combobox";
import { commandDirective } from "./components/command/command";
import { contextMenuDirective } from "./components/context-menu/context-menu";
import { dialogDirective } from "./components/dialog/dialog";
import { directionDirective } from "./components/direction/direction";
import { drawerDirective } from "./components/drawer/drawer";
import { emptyDirective } from "./components/empty/empty";
import { fieldDirective } from "./components/field/field";
import { hoverCardDirective } from "./components/hover-card/hover-card";
import { inputGroupDirective } from "./components/input-group/input-group";
import { inputOtpDirective } from "./components/input-otp/input-otp";
import { itemDirective } from "./components/item/item";
import { kbdDirective } from "./components/kbd/kbd";
import { labelDirective } from "./components/label/label";
import { menubarDirective } from "./components/menubar/menubar";
import { nativeSelectDirective } from "./components/native-select/native-select";
import { selectDirective } from "./components/select/select";
import { navigationMenuDirective } from "./components/navigation-menu/navigation-menu";
import { paginationDirective } from "./components/pagination/pagination";
import { popoverDirective } from "./components/popover/popover";
import { progressDirective } from "./components/progress/progress";
import { radioGroupDirective } from "./components/radio-group/radio-group";
import { resizablePanelGroupDirective } from "./components/resizable/resizable";
import { scrollAreaDirective } from "./components/scroll-area/scroll-area";
import { separatorDirective } from "./components/separator/separator";
import { sheetDirective } from "./components/sheet/sheet";
import { sidebarDirective } from "./components/sidebar/sidebar";
import { skeletonDirective } from "./components/skeleton/skeleton";
import { sliderDirective } from "./components/slider/slider";
import { toasterDirective } from "./components/sonner/sonner";
import { spinnerDirective } from "./components/spinner/spinner";
import { switchDirective } from "./components/switch/switch";
import { tableDirective } from "./components/table/table";
import { tabsDirective } from "./components/tabs/tabs";
import { textareaDirective } from "./components/textarea/textarea";
import { toggleDirective } from "./components/toggle/toggle";
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
  ["ngAlert", alertDirective],
  ["ngAlertDialog", alertDialogDirective],
  ["ngAspectRatio", aspectRatioDirective],
  ["ngAvatar", avatarDirective],
  ["ngBadge", badgeDirective],
  ["ngBreadcrumb", breadcrumbDirective],
  ["ngButton", buttonDirective],
  ["ngButtonGroup", buttonGroupDirective],
  ["ngCalendar", calendarDirective],
  ["ngCarousel", carouselDirective],
  ["ngCard", cardDirective],
  ["ngChart", chartDirective],
  ["ngCheckbox", checkboxDirective],
  ["ngCollapsible", collapsibleDirective],
  ["ngCombobox", comboboxDirective],
  ["ngCommand", commandDirective],
  ["ngContextMenu", contextMenuDirective],
  ["ngDialog", dialogDirective],
  ["ngDirection", directionDirective],
  ["ngDrawer", drawerDirective],
  ["ngEmpty", emptyDirective],
  ["ngField", fieldDirective],
  ["ngHoverCard", hoverCardDirective],
  ["ngInputGroup", inputGroupDirective],
  ["ngInputOtp", inputOtpDirective],
  ["ngItem", itemDirective],
  ["ngKbd", kbdDirective],
  ["ngLabel", labelDirective],
  ["ngMenubar", menubarDirective],
  ["ngNativeSelect", nativeSelectDirective],
  ["ngSelect", selectDirective],
  ["ngNavigationMenu", navigationMenuDirective],
  ["ngPagination", paginationDirective],
  ["ngPopover", popoverDirective],
  ["ngProgress", progressDirective],
  ["ngRadioGroup", radioGroupDirective],
  ["ngResizablePanelGroup", resizablePanelGroupDirective],
  ["ngScrollArea", scrollAreaDirective],
  ["ngSeparator", separatorDirective],
  ["ngSheet", sheetDirective],
  ["ngSidebar", sidebarDirective],
  ["ngSkeleton", skeletonDirective],
  ["ngSlider", sliderDirective],
  ["ngSpinner", spinnerDirective],
  ["ngSwitchControl", switchDirective],
  ["ngTable", tableDirective],
  ["ngToaster", toasterDirective],
  ["ngTabs", tabsDirective],
  ["ngTextarea", textareaDirective],
  ["ngToggle", toggleDirective],
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
