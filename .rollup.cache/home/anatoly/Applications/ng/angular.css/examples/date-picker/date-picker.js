import { parseDate } from "chrono-node";
const demoReferenceDate = new Date(2026, 8, 10, 12);
const parseIsoDate = (value) => {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match)
        return undefined;
    const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    return Number.isNaN(date.getTime()) ? undefined : date;
};
const toIsoDate = (date) => {
    if (!date || Number.isNaN(date.getTime()))
        return "";
    const year = String(date.getFullYear()).padStart(4, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};
const formatDate = (value, locale = "en-US", day = "numeric", month = "long") => {
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
    format(value) {
        return formatDate(value);
    }
    formatInput(value) {
        return formatDate(value, "en-US", "2-digit");
    }
    formatShort(value) {
        return formatDate(value, "en-US", "2-digit", "short");
    }
    formatRtl(value) {
        return formatDate(value, "ar-SA");
    }
    month(value) {
        return value.slice(0, 7) || "2026-09";
    }
    openPopover(id, event) {
        if (event && event.key !== "ArrowDown")
            return;
        event?.preventDefault();
        document.getElementById(id)?.setAttribute("data-open", "true");
    }
    selectBasic(value) {
        this.basicDate = value;
    }
    selectDemo(value) {
        this.demoDate = value;
    }
    selectDob(value) {
        this.dobDate = value;
        this.closePopover("date-picker-dob-popover");
    }
    selectDropdown(value) {
        this.dropdownDate = value;
    }
    finishDropdown() {
        this.closePopover("date-picker-dropdown-popover");
    }
    updateInput() {
        const parsed = parseDate(this.inputValue, demoReferenceDate, {
            forwardDate: true,
        });
        if (parsed)
            this.inputDate = toIsoDate(parsed);
    }
    selectInput(value) {
        this.inputDate = value;
        this.inputValue = this.formatInput(value);
        this.closePopover("date-picker-input-popover");
    }
    updateNatural() {
        const parsed = parseDate(this.naturalValue, demoReferenceDate, {
            forwardDate: true,
        });
        if (parsed)
            this.naturalDate = toIsoDate(parsed);
    }
    selectNatural(value) {
        this.naturalDate = value;
        this.naturalValue = this.formatInput(value);
        this.closePopover("date-picker-natural-popover");
    }
    selectRange(range) {
        this.rangeStart = range.start;
        this.rangeEnd = range.end;
    }
    selectRtl(value) {
        this.rtlDate = value;
    }
    selectTimeDate(value) {
        this.timeDate = value;
        this.closePopover("date-picker-time-popover");
    }
    closePopover(id) {
        document.getElementById(id)?.setAttribute("data-open", "false");
    }
}
window.angular
    .module("datePickerDemo", ["ui"])
    .controller("DatePickerDemoController", DatePickerDemoController);
