import { addDays } from "date-fns/addDays";
import { addMonths } from "date-fns/addMonths";
import { differenceInCalendarDays } from "date-fns/differenceInCalendarDays";
import { getWeek } from "date-fns/getWeek";
import { isSameMonth } from "date-fns/isSameMonth";
import { startOfMonth } from "date-fns/startOfMonth";
import { startOfWeek } from "date-fns/startOfWeek";
import { isDisabled, onDestroy, queryAll } from "../../internal/dom";
let calendarIdCounter = 0;
const setAttributeIfChanged = (element, name, value) => {
    if (element.getAttribute(name) !== value) {
        element.setAttribute(name, value);
    }
};
const padDatePart = (value) => String(value).padStart(2, "0");
const formatDateValue = (date) => `${String(date.getFullYear())}-${padDatePart(date.getMonth() + 1)}-${padDatePart(date.getDate())}`;
const parseDateValue = (value) => {
    const match = value?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match)
        return null;
    const [, yearPart, monthPart, dayPart] = match;
    const year = Number(yearPart);
    const month = Number(monthPart) - 1;
    const day = Number(dayPart);
    const date = new Date(year, month, day);
    return date.getFullYear() === year &&
        date.getMonth() === month &&
        date.getDate() === day
        ? date
        : null;
};
const parseDateList = (value) => new Set((value ?? "")
    .split(",")
    .map((entry) => entry.trim())
    .filter((entry) => parseDateValue(entry)));
export function calendarDirective() {
    return {
        link(scope, element) {
            const directionOwner = element.closest("[dir]") ?? element;
            const getDirection = () => element.closest("[dir]")?.getAttribute("dir") === "rtl"
                ? "rtl"
                : "ltr";
            const syncDirection = () => {
                const direction = getDirection();
                if (element.getAttribute("data-direction") !== direction) {
                    element.setAttribute("data-direction", direction);
                }
            };
            let days = queryAll(element, '[data-slot="calendar-day"], [ng-calendar-day]');
            const columns = Number(element.getAttribute("data-columns") ?? 7);
            const cleanupDays = new WeakMap();
            const cleanupControls = new WeakMap();
            const generatedLabels = new WeakMap();
            const generatedCurrent = new WeakSet();
            let renderedMonth = "";
            element.setAttribute("role", element.getAttribute("role") ?? "grid");
            syncDirection();
            const getLocale = () => (element.closest("[lang]")?.getAttribute("lang") ??
                document.documentElement.lang) ||
                undefined;
            const createFormatter = (options) => {
                try {
                    return new Intl.DateTimeFormat(getLocale(), options);
                }
                catch {
                    return new Intl.DateTimeFormat(undefined, options);
                }
            };
            const createNumberFormatter = () => {
                try {
                    return new Intl.NumberFormat(getLocale(), { useGrouping: false });
                }
                catch {
                    return new Intl.NumberFormat(undefined, { useGrouping: false });
                }
            };
            const renderGeneratedMonth = () => {
                if (!element.hasAttribute("data-calendar-generated"))
                    return;
                const grid = element.querySelector('[data-slot="calendar-grid"], [ng-calendar-grid]');
                if (!grid)
                    return;
                const selectedDate = parseDateValue(element.getAttribute("data-value"));
                const requestedMonth = parseDateValue(`${element.getAttribute("data-month") ?? ""}-01`);
                const month = startOfMonth(requestedMonth ?? selectedDate ?? new Date());
                const monthValue = formatDateValue(month).slice(0, 7);
                const numberOfMonths = Math.max(1, Math.min(3, Number(element.getAttribute("data-number-of-months") ?? 1)));
                const showWeekNumbers = element.getAttribute("data-show-week-numbers") === "true";
                const renderKey = [
                    monthValue,
                    numberOfMonths,
                    showWeekNumbers,
                    element.getAttribute("data-caption-layout") ?? "label",
                    element.getAttribute("data-disabled-dates") ?? "",
                    element.getAttribute("data-booked-dates") ?? "",
                    element.getAttribute("data-disabled-before") ?? "",
                    element.getAttribute("data-disabled-after") ?? "",
                    element.getAttribute("data-show-outside-days") ?? "",
                    element.getAttribute("data-week-start") ?? "",
                ].join("|");
                if (renderKey === renderedMonth && grid.childElementCount > 0)
                    return;
                renderedMonth = renderKey;
                setAttributeIfChanged(element, "data-month", monthValue);
                const title = element.querySelector('[data-slot="calendar-title"], [ng-calendar-title]');
                if (title) {
                    const captionLayout = element.getAttribute("data-caption-layout") ?? "label";
                    if (captionLayout === "dropdown") {
                        const monthSelect = document.createElement("select");
                        const yearSelect = document.createElement("select");
                        monthSelect.setAttribute("data-slot", "calendar-month-select");
                        yearSelect.setAttribute("data-slot", "calendar-year-select");
                        monthSelect.setAttribute("aria-label", "Month");
                        yearSelect.setAttribute("aria-label", "Year");
                        const monthFormatter = createFormatter({ month: "short" });
                        for (let monthIndex = 0; monthIndex < 12; monthIndex += 1) {
                            const option = document.createElement("option");
                            option.setAttribute("value", String(monthIndex));
                            option.textContent = monthFormatter.format(new Date(month.getFullYear(), monthIndex, 1));
                            if (monthIndex === month.getMonth()) {
                                option.setAttribute("selected", "");
                            }
                            monthSelect.append(option);
                        }
                        const startYear = Number(element.getAttribute("data-start-year") ??
                            month.getFullYear() - 10);
                        const endYear = Number(element.getAttribute("data-end-year") ?? month.getFullYear() + 10);
                        for (let year = startYear; year <= endYear; year += 1) {
                            const option = document.createElement("option");
                            option.setAttribute("value", String(year));
                            option.textContent = String(year);
                            if (year === month.getFullYear()) {
                                option.setAttribute("selected", "");
                            }
                            yearSelect.append(option);
                        }
                        const changeCaption = () => {
                            showMonth(new Date(Number(yearSelect.value), Number(monthSelect.value), 1));
                        };
                        monthSelect.addEventListener("change", changeCaption);
                        yearSelect.addEventListener("change", changeCaption);
                        title.replaceChildren(monthSelect, yearSelect);
                    }
                    else {
                        const lastMonth = addMonths(month, numberOfMonths - 1);
                        const formatter = createFormatter({
                            month: "long",
                            year: "numeric",
                        });
                        if (numberOfMonths === 1) {
                            title.removeAttribute("aria-label");
                            title.textContent = formatter.format(month);
                        }
                        else {
                            title.textContent = "";
                            title.setAttribute("aria-label", `${formatter.format(month)} - ${formatter.format(lastMonth)}`);
                        }
                    }
                    title.setAttribute("aria-live", "polite");
                }
                const configuredWeekStart = Number(element.getAttribute("data-week-start") ?? "0");
                const weekStartsOn = (Number.isInteger(configuredWeekStart) &&
                    configuredWeekStart >= 0 &&
                    configuredWeekStart <= 6
                    ? configuredWeekStart
                    : 0);
                const weekdayFormatter = createFormatter({ weekday: "short" });
                const narrowWeekdayFormatter = createFormatter({ weekday: "narrow" });
                const dateFormatter = createFormatter({ dateStyle: "long" });
                const numberFormatter = createNumberFormatter();
                const language = getLocale()?.split("-")[0]?.toLowerCase();
                const useNarrowWeekdays = ["ar", "fa", "ur"].includes(language ?? "");
                const todayValue = formatDateValue(new Date());
                const selectedValue = element.getAttribute("data-value");
                const selectedValues = parseDateList(element.getAttribute("data-values"));
                const rangeStart = element.getAttribute("data-range-start-value") ?? "";
                const rangeEnd = element.getAttribute("data-range-end-value") ?? "";
                const disabledDates = parseDateList(element.getAttribute("data-disabled-dates"));
                const bookedDates = parseDateList(element.getAttribute("data-booked-dates"));
                const disabledBefore = element.getAttribute("data-disabled-before") ?? "";
                const disabledAfter = element.getAttribute("data-disabled-after") ?? "";
                const showOutsideDays = element.getAttribute("data-show-outside-days") !== "false";
                const buildMonthGrid = (visibleMonth) => {
                    const monthGrid = document.createElement("div");
                    monthGrid.setAttribute("data-slot", "calendar-month-grid");
                    monthGrid.setAttribute("data-show-week-numbers", String(showWeekNumbers));
                    const firstVisibleDate = startOfWeek(visibleMonth, { weekStartsOn });
                    if (showWeekNumbers) {
                        const header = document.createElement("span");
                        header.setAttribute("data-slot", "calendar-week-number-header");
                        header.setAttribute("aria-label", "Week number");
                        header.textContent = "Wk";
                        monthGrid.append(header);
                    }
                    for (let index = 0; index < 7; index += 1) {
                        const date = addDays(firstVisibleDate, index);
                        const weekday = document.createElement("span");
                        const weekdayLabel = weekdayFormatter.format(date);
                        weekday.setAttribute("data-slot", "calendar-weekday");
                        weekday.setAttribute("aria-label", weekdayLabel);
                        weekday.textContent = useNarrowWeekdays
                            ? narrowWeekdayFormatter.format(date)
                            : weekdayLabel.slice(0, 2);
                        monthGrid.append(weekday);
                    }
                    for (let index = 0; index < 42; index += 1) {
                        const date = addDays(firstVisibleDate, index);
                        const value = formatDateValue(date);
                        if (showWeekNumbers && index % 7 === 0) {
                            const weekNumber = document.createElement("span");
                            weekNumber.setAttribute("data-slot", "calendar-week-number");
                            weekNumber.textContent = numberFormatter.format(getWeek(date, { weekStartsOn }));
                            monthGrid.append(weekNumber);
                        }
                        const outside = !isSameMonth(date, visibleMonth);
                        const day = document.createElement("button");
                        day.type = "button";
                        day.setAttribute("data-slot", "calendar-day");
                        day.setAttribute("data-value", value);
                        day.setAttribute("data-label", dateFormatter.format(date));
                        day.setAttribute("data-outside", String(outside));
                        day.textContent = numberFormatter.format(date.getDate());
                        if (value === selectedValue ||
                            selectedValues.has(value) ||
                            value === rangeStart ||
                            value === rangeEnd) {
                            day.setAttribute("aria-selected", "true");
                        }
                        if (value === rangeStart)
                            day.setAttribute("data-range-start", "true");
                        if (value === rangeEnd)
                            day.setAttribute("data-range-end", "true");
                        if (rangeStart &&
                            rangeEnd &&
                            value > rangeStart &&
                            value < rangeEnd) {
                            day.setAttribute("data-range-middle", "true");
                            day.setAttribute("aria-selected", "true");
                        }
                        if (value === todayValue)
                            day.setAttribute("data-today", "true");
                        if (bookedDates.has(value))
                            day.setAttribute("data-booked", "true");
                        const constrained = disabledDates.has(value) ||
                            bookedDates.has(value) ||
                            (disabledBefore && value < disabledBefore) ||
                            (disabledAfter && value > disabledAfter);
                        if (constrained)
                            day.disabled = true;
                        if (outside && !showOutsideDays) {
                            day.hidden = true;
                            day.disabled = true;
                        }
                        monthGrid.append(day);
                    }
                    return monthGrid;
                };
                const fragment = document.createDocumentFragment();
                for (let offset = 0; offset < numberOfMonths; offset += 1) {
                    const visibleMonth = addMonths(month, offset);
                    if (numberOfMonths === 1) {
                        fragment.append(...buildMonthGrid(visibleMonth).childNodes);
                        continue;
                    }
                    const monthSection = document.createElement("section");
                    monthSection.setAttribute("data-slot", "calendar-month");
                    const monthTitle = document.createElement("h3");
                    monthTitle.setAttribute("data-slot", "calendar-month-title");
                    monthTitle.textContent = createFormatter({
                        month: "long",
                        year: "numeric",
                    }).format(visibleMonth);
                    monthSection.append(monthTitle, buildMonthGrid(visibleMonth));
                    fragment.append(monthSection);
                }
                grid.setAttribute("data-months", String(numberOfMonths));
                grid.setAttribute("data-show-week-numbers", String(showWeekNumbers));
                grid.replaceChildren(fragment);
            };
            const syncSelectionState = (selectionMode, values, rangeStart, rangeEnd, activeDay) => {
                const singleValue = activeDay?.getAttribute("data-value") ??
                    element.getAttribute("data-value") ??
                    "";
                const focusedDay = activeDay ??
                    days.find((day) => day === document.activeElement) ??
                    days.find((day) => day.getAttribute("tabindex") === "0");
                days.forEach((day) => {
                    const value = day.getAttribute("data-value") ?? "";
                    const selected = selectionMode === "multiple"
                        ? values.includes(value)
                        : selectionMode === "range"
                            ? value === rangeStart ||
                                value === rangeEnd ||
                                Boolean(rangeStart &&
                                    rangeEnd &&
                                    value > rangeStart &&
                                    value < rangeEnd)
                            : value === singleValue;
                    setAttributeIfChanged(day, "aria-selected", String(selected));
                    setAttributeIfChanged(day, "data-selected", String(selected));
                    setAttributeIfChanged(day, "data-state", selected ? "selected" : "idle");
                    if (selectionMode === "range") {
                        setAttributeIfChanged(day, "data-range-start", String(value === rangeStart));
                        setAttributeIfChanged(day, "data-range-end", String(value === rangeEnd));
                        setAttributeIfChanged(day, "data-range-middle", String(Boolean(rangeStart &&
                            rangeEnd &&
                            value > rangeStart &&
                            value < rangeEnd)));
                        setAttributeIfChanged(day, "data-range", value === rangeStart
                            ? "start"
                            : value === rangeEnd
                                ? "end"
                                : rangeStart &&
                                    rangeEnd &&
                                    value > rangeStart &&
                                    value < rangeEnd
                                    ? "middle"
                                    : "none");
                    }
                    setAttributeIfChanged(day, "tabindex", day === focusedDay ? "0" : "-1");
                });
            };
            const selectDay = (selectedDay, emit = true) => {
                const selectionMode = element.getAttribute("data-selection-mode") ?? "single";
                const selectedValue = (selectedDay.getAttribute("data-value") ??
                    selectedDay.textContent.trim()) ||
                    "";
                let values = [];
                let rangeStart = element.getAttribute("data-range-start-value") ?? "";
                let rangeEnd = element.getAttribute("data-range-end-value") ?? "";
                if (selectionMode === "multiple") {
                    const selectedValues = parseDateList(element.getAttribute("data-values"));
                    if (selectedValues.has(selectedValue)) {
                        selectedValues.delete(selectedValue);
                    }
                    else {
                        selectedValues.add(selectedValue);
                    }
                    values = [...selectedValues].sort();
                    setAttributeIfChanged(element, "data-values", values.join(","));
                }
                else if (selectionMode === "range") {
                    const selectedDate = parseDateValue(selectedValue);
                    const startDate = parseDateValue(rangeStart);
                    if (!startDate ||
                        rangeEnd ||
                        !selectedDate ||
                        selectedDate < startDate) {
                        rangeStart = selectedValue;
                        rangeEnd = "";
                    }
                    else {
                        const minNights = Math.max(0, Number(element.getAttribute("data-min-nights") ?? 0));
                        if (differenceInCalendarDays(selectedDate, startDate) < minNights) {
                            setAttributeIfChanged(element, "data-range-invalid", "true");
                            element.dispatchEvent(new CustomEvent("angularcss:calendar-range-invalid", {
                                bubbles: true,
                                detail: {
                                    minNights,
                                    start: rangeStart,
                                    value: selectedValue,
                                },
                            }));
                            selectedDay.focus({ preventScroll: true });
                            return;
                        }
                        rangeEnd = selectedValue;
                    }
                    setAttributeIfChanged(element, "data-range-invalid", "false");
                    setAttributeIfChanged(element, "data-range-start-value", rangeStart);
                    setAttributeIfChanged(element, "data-range-end-value", rangeEnd);
                    values = [rangeStart, rangeEnd].filter(Boolean);
                }
                syncSelectionState(selectionMode, values, rangeStart, rangeEnd, selectedDay);
                setAttributeIfChanged(element, "data-value", selectedValue);
                if (emit) {
                    element.dispatchEvent(new CustomEvent("angularcss:calendar-select", {
                        bubbles: true,
                        detail: {
                            day: selectedDay,
                            value: element.getAttribute("data-value") ?? "",
                            values,
                            range: { start: rangeStart, end: rangeEnd },
                            selectionMode,
                        },
                    }));
                }
            };
            const bindDay = (day) => {
                setAttributeIfChanged(day, "role", day.getAttribute("role") ?? "gridcell");
                setAttributeIfChanged(day, "tabindex", day.getAttribute("tabindex") ?? "-1");
                const disabled = isDisabled(day);
                setAttributeIfChanged(day, "data-disabled", String(disabled));
                setAttributeIfChanged(day, "aria-disabled", String(disabled));
                const outside = day.getAttribute("data-outside") === "true";
                setAttributeIfChanged(day, "data-outside", String(outside));
                const range = day.getAttribute("data-range-start") === "true"
                    ? "start"
                    : day.getAttribute("data-range-end") === "true"
                        ? "end"
                        : day.getAttribute("data-range-middle") === "true"
                            ? "middle"
                            : "none";
                setAttributeIfChanged(day, "data-range", range);
                setAttributeIfChanged(day, "data-state", day.getAttribute("aria-selected") === "true" ||
                    day.getAttribute("data-selected") === "true"
                    ? "selected"
                    : "idle");
                const label = day.getAttribute("data-label") ?? day.getAttribute("data-value");
                const currentLabel = day.getAttribute("aria-label");
                if (label &&
                    (!currentLabel || currentLabel === generatedLabels.get(day))) {
                    setAttributeIfChanged(day, "aria-label", label);
                    generatedLabels.set(day, label);
                }
                if (day.getAttribute("data-today") === "true") {
                    if (!day.hasAttribute("aria-current"))
                        generatedCurrent.add(day);
                    setAttributeIfChanged(day, "aria-current", day.getAttribute("aria-current") ?? "date");
                }
                else if (generatedCurrent.has(day)) {
                    day.removeAttribute("aria-current");
                    generatedCurrent.delete(day);
                }
                if (cleanupDays.has(day))
                    return;
                const handleClick = () => {
                    if (isDisabled(day))
                        return;
                    selectDay(day);
                    if (element.hasAttribute("data-calendar-generated") &&
                        day.getAttribute("data-outside") === "true") {
                        const value = day.getAttribute("data-value");
                        const date = parseDateValue(value);
                        if (date)
                            showMonth(date, value ?? undefined);
                    }
                };
                const handleKeydown = (event) => {
                    const index = days.indexOf(day);
                    if (event.key !== "ArrowRight" &&
                        event.key !== "ArrowLeft" &&
                        event.key !== "ArrowDown" &&
                        event.key !== "ArrowUp" &&
                        event.key !== "Home" &&
                        event.key !== "End" &&
                        event.key !== "PageUp" &&
                        event.key !== "PageDown") {
                        return;
                    }
                    event.preventDefault();
                    if ((event.key === "PageUp" || event.key === "PageDown") &&
                        element.hasAttribute("data-calendar-generated")) {
                        const date = parseDateValue(day.getAttribute("data-value"));
                        if (date) {
                            const target = addMonths(date, event.key === "PageUp" ? -1 : 1);
                            showMonth(target, formatDateValue(target), true);
                        }
                        return;
                    }
                    if (event.key === "Home" || event.key === "End") {
                        const rowStart = Math.floor(index / columns) * columns;
                        const rowEnd = Math.min(rowStart + columns - 1, days.length - 1);
                        const direction = event.key === "Home" ? 1 : -1;
                        const startIndex = event.key === "Home" ? rowStart : rowEnd;
                        for (let nextIndex = startIndex; nextIndex >= rowStart && nextIndex <= rowEnd; nextIndex += direction) {
                            const nextDay = days[nextIndex];
                            if (isDisabled(nextDay))
                                continue;
                            selectDay(nextDay);
                            nextDay.focus();
                            break;
                        }
                        return;
                    }
                    const direction = event.key === "ArrowRight"
                        ? getDirection() === "rtl"
                            ? -1
                            : 1
                        : event.key === "ArrowLeft"
                            ? getDirection() === "rtl"
                                ? 1
                                : -1
                            : event.key === "ArrowDown"
                                ? columns
                                : -columns;
                    for (let nextIndex = index + direction; nextIndex >= 0 && nextIndex < days.length; nextIndex += direction) {
                        const nextDay = days[nextIndex];
                        if (isDisabled(nextDay))
                            continue;
                        selectDay(nextDay);
                        nextDay.focus();
                        break;
                    }
                };
                day.addEventListener("click", handleClick);
                day.addEventListener("keydown", handleKeydown);
                cleanupDays.set(day, () => {
                    day.removeEventListener("click", handleClick);
                    day.removeEventListener("keydown", handleKeydown);
                });
            };
            const showMonth = (month, focusedValue, selectFocused = false) => {
                const monthValue = formatDateValue(startOfMonth(month)).slice(0, 7);
                setAttributeIfChanged(element, "data-month", monthValue);
                renderedMonth = "";
                renderGeneratedMonth();
                syncCalendar();
                element.dispatchEvent(new CustomEvent("angularcss:calendar-month-change", {
                    bubbles: true,
                    detail: { month: monthValue },
                }));
                if (!focusedValue)
                    return;
                const focusedDay = days.find((day) => day.getAttribute("data-value") === focusedValue);
                if (!focusedDay || isDisabled(focusedDay))
                    return;
                if (selectFocused)
                    selectDay(focusedDay);
                focusedDay.focus();
            };
            const bindMonthControl = (control, direction) => {
                if (cleanupControls.has(control))
                    return;
                const handleClick = () => {
                    if (isDisabled(control))
                        return;
                    const month = parseDateValue(`${element.getAttribute("data-month") ?? ""}-01`);
                    showMonth(addMonths(month ?? new Date(), direction));
                };
                control.addEventListener("click", handleClick);
                cleanupControls.set(control, () => {
                    control.removeEventListener("click", handleClick);
                });
            };
            const bindPresetControl = (control) => {
                if (cleanupControls.has(control))
                    return;
                const handleClick = () => {
                    if (isDisabled(control))
                        return;
                    const value = control.getAttribute("data-calendar-preset");
                    const date = parseDateValue(value);
                    if (!date || !value)
                        return;
                    showMonth(date, value, true);
                };
                control.addEventListener("click", handleClick);
                cleanupControls.set(control, () => {
                    control.removeEventListener("click", handleClick);
                });
            };
            function syncCalendar() {
                renderGeneratedMonth();
                const title = element.querySelector('[data-slot="calendar-title"], [ng-calendar-title]');
                if (title && !element.hasAttribute("aria-label")) {
                    if (!title.id)
                        title.id = `calendar-title-${String(calendarIdCounter++)}`;
                    setAttributeIfChanged(element, "aria-labelledby", title.id);
                }
                queryAll(element, '[data-slot="calendar-row"], [ng-calendar-row]').forEach((row) => {
                    row.setAttribute("role", row.getAttribute("role") ?? "row");
                });
                queryAll(element, '[data-slot="calendar-weekday"], [ng-calendar-weekday]').forEach((weekday) => {
                    weekday.setAttribute("role", weekday.getAttribute("role") ?? "columnheader");
                });
                queryAll(element, '[data-slot="calendar-week-number"], [ng-calendar-week-number]').forEach((weekNumber) => {
                    setAttributeIfChanged(weekNumber, "role", weekNumber.getAttribute("role") ?? "rowheader");
                });
                days = queryAll(element, '[data-slot="calendar-day"], [ng-calendar-day]');
                days.forEach(bindDay);
                const selectionMode = element.getAttribute("data-selection-mode") ?? "single";
                const hasRootSelection = selectionMode === "multiple"
                    ? element.hasAttribute("data-values")
                    : selectionMode === "range"
                        ? element.hasAttribute("data-range-start-value") ||
                            element.hasAttribute("data-range-end-value")
                        : element.hasAttribute("data-value");
                if (hasRootSelection) {
                    syncSelectionState(selectionMode, [...parseDateList(element.getAttribute("data-values"))], element.getAttribute("data-range-start-value") ?? "", element.getAttribute("data-range-end-value") ?? "");
                }
                queryAll(element, '[data-slot="calendar-previous"], [ng-calendar-previous]').forEach((control) => {
                    bindMonthControl(control, -1);
                });
                queryAll(element, '[data-slot="calendar-next"], [ng-calendar-next]').forEach((control) => {
                    bindMonthControl(control, 1);
                });
                queryAll(element, "[data-calendar-preset]").forEach(bindPresetControl);
                const requestedValue = element.getAttribute("data-value");
                const selected = days.find((day) => day.getAttribute("data-value") === requestedValue) ??
                    days.find((day) => day.getAttribute("aria-selected") === "true" ||
                        day.getAttribute("data-selected") === "true");
                if (selected && selectionMode === "single") {
                    selectDay(selected, false);
                }
                else if (!days.some((day) => day.getAttribute("tabindex") === "0")) {
                    (selected ??
                        days.find((day) => day.getAttribute("data-outside") !== "true" && !isDisabled(day)) ??
                        days.find((day) => !isDisabled(day)))?.setAttribute("tabindex", "0");
                }
            }
            syncCalendar();
            const directionObserver = directionOwner === element
                ? null
                : new MutationObserver(() => {
                    syncDirection();
                });
            directionObserver?.observe(directionOwner, {
                attributes: true,
                attributeFilter: ["dir"],
            });
            const elementObserver = new MutationObserver(() => {
                syncDirection();
                syncCalendar();
            });
            elementObserver.observe(element, {
                attributes: true,
                attributeFilter: [
                    "aria-disabled",
                    "aria-selected",
                    "data-disabled",
                    "data-disabled-after",
                    "data-disabled-before",
                    "data-disabled-dates",
                    "data-booked-dates",
                    "data-caption-layout",
                    "data-end-year",
                    "data-label",
                    "data-min-nights",
                    "data-month",
                    "data-number-of-months",
                    "data-outside",
                    "data-range-end",
                    "data-range-end-value",
                    "data-range-middle",
                    "data-range-start",
                    "data-range-start-value",
                    "data-selected",
                    "data-selection-mode",
                    "data-show-outside-days",
                    "data-show-week-numbers",
                    "data-start-year",
                    "data-today",
                    "data-value",
                    "data-values",
                    "data-week-start",
                    "dir",
                    "disabled",
                    "hidden",
                ],
                childList: true,
                subtree: true,
            });
            onDestroy(scope, () => {
                directionObserver?.disconnect();
                elementObserver.disconnect();
                days.forEach((day) => {
                    cleanupDays.get(day)?.();
                });
                queryAll(element, '[data-slot="calendar-previous"], [ng-calendar-previous], [data-slot="calendar-next"], [ng-calendar-next]').forEach((control) => cleanupControls.get(control)?.());
                queryAll(element, "[data-calendar-preset]").forEach((control) => cleanupControls.get(control)?.());
            });
        },
    };
}
