import type {} from "@angular-wave/angular.ts";
import { parseDate } from "chrono-node";

type CalendarRange = {
  end: string;
  start: string;
};

const demoReferenceDate = new Date(2026, 8, 10, 12);

const parseIsoDate = (value: string): Date | undefined => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return undefined;

  const date = new Date(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3]),
  );
  return Number.isNaN(date.getTime()) ? undefined : date;
};

const toIsoDate = (date: Date | null | undefined): string => {
  if (!date || Number.isNaN(date.getTime())) return "";
  const year = String(date.getFullYear()).padStart(4, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDate = (
  value: string,
  locale = "en-US",
  day: "2-digit" | "numeric" = "numeric",
  month: "long" | "short" = "long",
): string => {
  const date = parseIsoDate(value);
  return date
    ? new Intl.DateTimeFormat(locale, {
        day,
        month,
        year: "numeric",
      }).format(date)
    : "";
};

class DatePickerDemoController {
  basicDate = "";
  demoDate = "";
  dobDate = "";
  dropdownDate = "";
  inputDate = "2025-06-01";
  inputValue = formatDate(this.inputDate, "en-US", "2-digit");
  naturalDate = toIsoDate(parseDate("In 2 days", demoReferenceDate));
  naturalValue = "In 2 days";
  rangeEnd = "2026-09-15";
  rangeStart = "2026-09-10";
  rtlDate = "";
  time = "10:30:00";
  timeDate = "";

  format(value: string): string {
    return formatDate(value);
  }

  formatInput(value: string): string {
    return formatDate(value, "en-US", "2-digit");
  }

  formatShort(value: string): string {
    return formatDate(value, "en-US", "2-digit", "short");
  }

  formatRtl(value: string): string {
    return formatDate(value, "ar-SA");
  }

  month(value: string): string {
    return value.slice(0, 7) || "2026-09";
  }

  openPopover(id: string, event?: KeyboardEvent): void {
    if (event && event.key !== "ArrowDown") return;
    event?.preventDefault();
    this.popover(id)?.showPopover();
  }

  selectBasic(value: string): void {
    this.basicDate = value;
  }

  selectDemo(value: string): void {
    this.demoDate = value;
  }

  selectDob(value: string): void {
    this.dobDate = value;
    this.closePopover("date-picker-dob-popover");
  }

  selectDropdown(value: string): void {
    this.dropdownDate = value;
  }

  finishDropdown(): void {
    this.closePopover("date-picker-dropdown-popover");
  }

  updateInput(): void {
    const parsed = parseDate(this.inputValue, demoReferenceDate, {
      forwardDate: true,
    });
    if (parsed) this.inputDate = toIsoDate(parsed);
  }

  selectInput(value: string): void {
    this.inputDate = value;
    this.inputValue = this.formatInput(value);
    this.closePopover("date-picker-input-popover");
  }

  updateNatural(): void {
    const parsed = parseDate(this.naturalValue, demoReferenceDate, {
      forwardDate: true,
    });
    if (parsed) this.naturalDate = toIsoDate(parsed);
  }

  selectNatural(value: string): void {
    this.naturalDate = value;
    this.naturalValue = this.formatInput(value);
    this.closePopover("date-picker-natural-popover");
  }

  selectRange(range: CalendarRange): void {
    this.rangeStart = range.start;
    this.rangeEnd = range.end;
  }

  selectRtl(value: string): void {
    this.rtlDate = value;
  }

  selectTimeDate(value: string): void {
    this.timeDate = value;
    this.closePopover("date-picker-time-popover");
  }

  private closePopover(id: string): void {
    this.popover(id)?.hidePopover();
  }

  private popover(id: string): HTMLElement | null {
    return (
      document.getElementById(id)?.querySelector<HTMLElement>("[popover]") ??
      null
    );
  }
}

window.angular
  .module("datePickerDemo", ["angular.css"])
  .controller("DatePickerDemoController", DatePickerDemoController);
