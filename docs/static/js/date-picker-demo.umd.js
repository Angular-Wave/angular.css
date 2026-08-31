(function () {
    'use strict';

    var Meridiem;
    (function (Meridiem) {
        Meridiem[Meridiem["AM"] = 0] = "AM";
        Meridiem[Meridiem["PM"] = 1] = "PM";
    })(Meridiem || (Meridiem = {}));
    var Weekday;
    (function (Weekday) {
        Weekday[Weekday["SUNDAY"] = 0] = "SUNDAY";
        Weekday[Weekday["MONDAY"] = 1] = "MONDAY";
        Weekday[Weekday["TUESDAY"] = 2] = "TUESDAY";
        Weekday[Weekday["WEDNESDAY"] = 3] = "WEDNESDAY";
        Weekday[Weekday["THURSDAY"] = 4] = "THURSDAY";
        Weekday[Weekday["FRIDAY"] = 5] = "FRIDAY";
        Weekday[Weekday["SATURDAY"] = 6] = "SATURDAY";
    })(Weekday || (Weekday = {}));
    var Month;
    (function (Month) {
        Month[Month["JANUARY"] = 1] = "JANUARY";
        Month[Month["FEBRUARY"] = 2] = "FEBRUARY";
        Month[Month["MARCH"] = 3] = "MARCH";
        Month[Month["APRIL"] = 4] = "APRIL";
        Month[Month["MAY"] = 5] = "MAY";
        Month[Month["JUNE"] = 6] = "JUNE";
        Month[Month["JULY"] = 7] = "JULY";
        Month[Month["AUGUST"] = 8] = "AUGUST";
        Month[Month["SEPTEMBER"] = 9] = "SEPTEMBER";
        Month[Month["OCTOBER"] = 10] = "OCTOBER";
        Month[Month["NOVEMBER"] = 11] = "NOVEMBER";
        Month[Month["DECEMBER"] = 12] = "DECEMBER";
    })(Month || (Month = {}));

    function assignSimilarDate(component, target) {
        component.assign("day", target.getDate());
        component.assign("month", target.getMonth() + 1);
        component.assign("year", target.getFullYear());
    }
    function assignSimilarTime(component, target) {
        component.assign("hour", target.getHours());
        component.assign("minute", target.getMinutes());
        component.assign("second", target.getSeconds());
        component.assign("millisecond", target.getMilliseconds());
        component.assign("meridiem", target.getHours() < 12 ? Meridiem.AM : Meridiem.PM);
    }
    function implySimilarDate(component, target) {
        component.imply("day", target.getDate());
        component.imply("month", target.getMonth() + 1);
        component.imply("year", target.getFullYear());
    }
    function implySimilarTime(component, target) {
        component.imply("hour", target.getHours());
        component.imply("minute", target.getMinutes());
        component.imply("second", target.getSeconds());
        component.imply("millisecond", target.getMilliseconds());
        component.imply("meridiem", target.getHours() < 12 ? Meridiem.AM : Meridiem.PM);
    }

    const TIMEZONE_ABBR_MAP = {
        ACDT: 630,
        ACST: 570,
        ADT: -180,
        AEDT: 660,
        AEST: 600,
        AFT: 270,
        AKDT: -480,
        AKST: -540,
        ALMT: 360,
        AMST: -180,
        AMT: -240,
        ANAST: 720,
        ANAT: 720,
        AQTT: 300,
        ART: -180,
        AST: -240,
        AWDT: 540,
        AWST: 480,
        AZOST: 0,
        AZOT: -60,
        AZST: 300,
        AZT: 240,
        BNT: 480,
        BOT: -240,
        BRST: -120,
        BRT: -180,
        BST: 60,
        BTT: 360,
        CAST: 480,
        CAT: 120,
        CCT: 390,
        CDT: -300,
        CEST: 120,
        CET: {
            timezoneOffsetDuringDst: 2 * 60,
            timezoneOffsetNonDst: 60,
            dstStart: (year) => getLastWeekdayOfMonth(year, Month.MARCH, Weekday.SUNDAY, 2),
            dstEnd: (year) => getLastWeekdayOfMonth(year, Month.OCTOBER, Weekday.SUNDAY, 3),
        },
        CHADT: 825,
        CHAST: 765,
        CKT: -600,
        CLST: -180,
        CLT: -240,
        COT: -300,
        CST: -360,
        CT: {
            timezoneOffsetDuringDst: -5 * 60,
            timezoneOffsetNonDst: -6 * 60,
            dstStart: (year) => getNthWeekdayOfMonth(year, Month.MARCH, Weekday.SUNDAY, 2, 2),
            dstEnd: (year) => getNthWeekdayOfMonth(year, Month.NOVEMBER, Weekday.SUNDAY, 1, 2),
        },
        CVT: -60,
        CXT: 420,
        ChST: 600,
        DAVT: 420,
        EASST: -300,
        EAST: -360,
        EAT: 180,
        ECT: -300,
        EDT: -240,
        EEST: 180,
        EET: 120,
        EGST: 0,
        EGT: -60,
        EST: -300,
        ET: {
            timezoneOffsetDuringDst: -4 * 60,
            timezoneOffsetNonDst: -5 * 60,
            dstStart: (year) => getNthWeekdayOfMonth(year, Month.MARCH, Weekday.SUNDAY, 2, 2),
            dstEnd: (year) => getNthWeekdayOfMonth(year, Month.NOVEMBER, Weekday.SUNDAY, 1, 2),
        },
        FJST: 780,
        FJT: 720,
        FKST: -180,
        FKT: -240,
        FNT: -120,
        GALT: -360,
        GAMT: -540,
        GET: 240,
        GFT: -180,
        GILT: 720,
        GMT: 0,
        GST: 240,
        GYT: -240,
        HAA: -180,
        HAC: -300,
        HADT: -540,
        HAE: -240,
        HAP: -420,
        HAR: -360,
        HAST: -600,
        HAT: -90,
        HAY: -480,
        HKT: 480,
        HLV: -210,
        HNA: -240,
        HNC: -360,
        HNE: -300,
        HNP: -480,
        HNR: -420,
        HNT: -150,
        HNY: -540,
        HOVT: 420,
        ICT: 420,
        IDT: 180,
        IOT: 360,
        IRDT: 270,
        IRKST: 540,
        IRKT: 540,
        IRST: 210,
        IST: 330,
        JST: 540,
        KGT: 360,
        KRAST: 480,
        KRAT: 480,
        KST: 540,
        KUYT: 240,
        LHDT: 660,
        LHST: 630,
        LINT: 840,
        MAGST: 720,
        MAGT: 720,
        MART: -510,
        MAWT: 300,
        MDT: -360,
        MESZ: 120,
        MEZ: 60,
        MHT: 720,
        MMT: 390,
        MSD: 240,
        MSK: 180,
        MST: -420,
        MT: {
            timezoneOffsetDuringDst: -6 * 60,
            timezoneOffsetNonDst: -7 * 60,
            dstStart: (year) => getNthWeekdayOfMonth(year, Month.MARCH, Weekday.SUNDAY, 2, 2),
            dstEnd: (year) => getNthWeekdayOfMonth(year, Month.NOVEMBER, Weekday.SUNDAY, 1, 2),
        },
        MUT: 240,
        MVT: 300,
        MYT: 480,
        NCT: 660,
        NDT: -90,
        NFT: 690,
        NOVST: 420,
        NOVT: 360,
        NPT: 345,
        NST: -150,
        NUT: -660,
        NZDT: 780,
        NZST: 720,
        OMSST: 420,
        OMST: 420,
        PDT: -420,
        PET: -300,
        PETST: 720,
        PETT: 720,
        PGT: 600,
        PHOT: 780,
        PHT: 480,
        PKT: 300,
        PMDT: -120,
        PMST: -180,
        PONT: 660,
        PST: -480,
        PT: {
            timezoneOffsetDuringDst: -7 * 60,
            timezoneOffsetNonDst: -8 * 60,
            dstStart: (year) => getNthWeekdayOfMonth(year, Month.MARCH, Weekday.SUNDAY, 2, 2),
            dstEnd: (year) => getNthWeekdayOfMonth(year, Month.NOVEMBER, Weekday.SUNDAY, 1, 2),
        },
        PWT: 540,
        PYST: -180,
        PYT: -240,
        RET: 240,
        SAMT: 240,
        SAST: 120,
        SBT: 660,
        SCT: 240,
        SGT: 480,
        SRT: -180,
        SST: -660,
        TAHT: -600,
        TFT: 300,
        TJT: 300,
        TKT: 780,
        TLT: 540,
        TMT: 300,
        TVT: 720,
        ULAT: 480,
        UTC: 0,
        UYST: -120,
        UYT: -180,
        UZT: 300,
        VET: -210,
        VLAST: 660,
        VLAT: 660,
        VUT: 660,
        WAST: 120,
        WAT: 60,
        WEST: 60,
        WESZ: 60,
        WET: 0,
        WEZ: 0,
        WFT: 720,
        WGST: -120,
        WGT: -180,
        WIB: 420,
        WIT: 540,
        WITA: 480,
        WST: 780,
        WT: 0,
        YAKST: 600,
        YAKT: 600,
        YAPT: 600,
        YEKST: 360,
        YEKT: 360,
    };
    function getNthWeekdayOfMonth(year, month, weekday, n, hour = 0) {
        let dayOfMonth = 0;
        let i = 0;
        while (i < n) {
            dayOfMonth++;
            const date = new Date(year, month - 1, dayOfMonth);
            if (date.getDay() === weekday)
                i++;
        }
        return new Date(year, month - 1, dayOfMonth, hour);
    }
    function getLastWeekdayOfMonth(year, month, weekday, hour = 0) {
        const oneIndexedWeekday = weekday === 0 ? 7 : weekday;
        const date = new Date(year, month - 1 + 1, 1, 12);
        const firstWeekdayNextMonth = date.getDay() === 0 ? 7 : date.getDay();
        let dayDiff;
        if (firstWeekdayNextMonth === oneIndexedWeekday)
            dayDiff = 7;
        else if (firstWeekdayNextMonth < oneIndexedWeekday)
            dayDiff = 7 + firstWeekdayNextMonth - oneIndexedWeekday;
        else
            dayDiff = firstWeekdayNextMonth - oneIndexedWeekday;
        date.setDate(date.getDate() - dayDiff);
        return new Date(year, month - 1, date.getDate(), hour);
    }
    function toTimezoneOffset(timezoneInput, date, timezoneOverrides = {}) {
        if (timezoneInput == null) {
            return null;
        }
        if (typeof timezoneInput === "number") {
            return timezoneInput;
        }
        const matchedTimezone = timezoneOverrides[timezoneInput] ?? TIMEZONE_ABBR_MAP[timezoneInput];
        if (matchedTimezone == null) {
            return null;
        }
        if (typeof matchedTimezone == "number") {
            return matchedTimezone;
        }
        if (date == null) {
            return null;
        }
        if (date > matchedTimezone.dstStart(date.getFullYear()) && !(date > matchedTimezone.dstEnd(date.getFullYear()))) {
            return matchedTimezone.timezoneOffsetDuringDst;
        }
        return matchedTimezone.timezoneOffsetNonDst;
    }

    const EmptyDuration = {
        day: 0,
        second: 0,
        millisecond: 0,
    };
    function addDuration(ref, duration) {
        let date = new Date(ref);
        if (duration["y"]) {
            duration["year"] = duration["y"];
            delete duration["y"];
        }
        if (duration["mo"]) {
            duration["month"] = duration["mo"];
            delete duration["mo"];
        }
        if (duration["M"]) {
            duration["month"] = duration["M"];
            delete duration["M"];
        }
        if (duration["w"]) {
            duration["week"] = duration["w"];
            delete duration["w"];
        }
        if (duration["d"]) {
            duration["day"] = duration["d"];
            delete duration["d"];
        }
        if (duration["h"]) {
            duration["hour"] = duration["h"];
            delete duration["h"];
        }
        if (duration["m"]) {
            duration["minute"] = duration["m"];
            delete duration["m"];
        }
        if (duration["s"]) {
            duration["second"] = duration["s"];
            delete duration["s"];
        }
        if (duration["ms"]) {
            duration["millisecond"] = duration["ms"];
            delete duration["ms"];
        }
        if ("year" in duration) {
            const floor = Math.floor(duration["year"]);
            date.setFullYear(date.getFullYear() + floor);
            const remainingFraction = duration["year"] - floor;
            if (remainingFraction > 0) {
                duration.month = duration?.month ?? 0;
                duration.month += remainingFraction * 12;
            }
        }
        if ("quarter" in duration) {
            const floor = Math.floor(duration["quarter"]);
            date.setMonth(date.getMonth() + floor * 3);
        }
        if ("month" in duration) {
            const floor = Math.floor(duration["month"]);
            date.setMonth(date.getMonth() + floor);
            const remainingFraction = duration["month"] - floor;
            if (remainingFraction > 0) {
                duration.week = duration?.week ?? 0;
                duration.week += remainingFraction * 4;
            }
        }
        if ("week" in duration) {
            const floor = Math.floor(duration["week"]);
            date.setDate(date.getDate() + floor * 7);
            const remainingFraction = duration["week"] - floor;
            if (remainingFraction > 0) {
                duration.day = duration?.day ?? 0;
                duration.day += Math.round(remainingFraction * 7);
            }
        }
        if ("day" in duration) {
            const floor = Math.floor(duration["day"]);
            date.setDate(date.getDate() + floor);
            const remainingFraction = duration["day"] - floor;
            if (remainingFraction > 0) {
                duration.hour = duration?.hour ?? 0;
                duration.hour += Math.round(remainingFraction * 24);
            }
        }
        if ("hour" in duration) {
            const floor = Math.floor(duration["hour"]);
            date.setHours(date.getHours() + floor);
            const remainingFraction = duration["hour"] - floor;
            if (remainingFraction > 0) {
                duration.minute = duration?.minute ?? 0;
                duration.minute += Math.round(remainingFraction * 60);
            }
        }
        if ("minute" in duration) {
            const floor = Math.floor(duration["minute"]);
            date.setMinutes(date.getMinutes() + floor);
            const remainingFraction = duration["minute"] - floor;
            if (remainingFraction > 0) {
                duration.second = duration?.second ?? 0;
                duration.second += Math.round(remainingFraction * 60);
            }
        }
        if ("second" in duration) {
            const floor = Math.floor(duration["second"]);
            date.setSeconds(date.getSeconds() + floor);
            const remainingFraction = duration["second"] - floor;
            if (remainingFraction > 0) {
                duration.millisecond = duration?.millisecond ?? 0;
                duration.millisecond += Math.round(remainingFraction * 1000);
            }
        }
        if ("millisecond" in duration) {
            const floor = Math.floor(duration["millisecond"]);
            date.setMilliseconds(date.getMilliseconds() + floor);
        }
        return date;
    }
    function reverseDuration(duration) {
        const reversed = {};
        for (const key in duration) {
            reversed[key] = -duration[key];
        }
        return reversed;
    }

    class ReferenceWithTimezone {
        instant;
        timezoneOffset;
        constructor(instant, timezoneOffset) {
            this.instant = instant ?? new Date();
            this.timezoneOffset = timezoneOffset ?? null;
        }
        static fromDate(date) {
            return new ReferenceWithTimezone(date);
        }
        static fromInput(input, timezoneOverrides) {
            if (input instanceof Date) {
                return ReferenceWithTimezone.fromDate(input);
            }
            const instant = input?.instant ?? new Date();
            const timezoneOffset = toTimezoneOffset(input?.timezone, instant, timezoneOverrides);
            return new ReferenceWithTimezone(instant, timezoneOffset);
        }
        getDateWithAdjustedTimezone() {
            const date = new Date(this.instant);
            if (this.timezoneOffset !== null) {
                date.setMinutes(date.getMinutes() - this.getSystemTimezoneAdjustmentMinute(this.instant));
            }
            return date;
        }
        getSystemTimezoneAdjustmentMinute(date, overrideTimezoneOffset) {
            if (!date) {
                date = new Date();
            }
            const currentTimezoneOffset = -date.getTimezoneOffset();
            const targetTimezoneOffset = overrideTimezoneOffset ?? this.timezoneOffset ?? currentTimezoneOffset;
            return currentTimezoneOffset - targetTimezoneOffset;
        }
        getTimezoneOffset() {
            return this.timezoneOffset ?? -this.instant.getTimezoneOffset();
        }
    }
    class ParsingComponents {
        knownValues;
        impliedValues;
        reference;
        _tags = new Set();
        constructor(reference, knownComponents) {
            this.reference = reference;
            this.knownValues = {};
            this.impliedValues = {};
            if (knownComponents) {
                for (const key in knownComponents) {
                    this.knownValues[key] = knownComponents[key];
                }
            }
            const date = reference.getDateWithAdjustedTimezone();
            this.imply("day", date.getDate());
            this.imply("month", date.getMonth() + 1);
            this.imply("year", date.getFullYear());
            this.imply("hour", 12);
            this.imply("minute", 0);
            this.imply("second", 0);
            this.imply("millisecond", 0);
        }
        static createRelativeFromReference(reference, duration = EmptyDuration) {
            let date = addDuration(reference.getDateWithAdjustedTimezone(), duration);
            const components = new ParsingComponents(reference);
            components.addTag("result/relativeDate");
            if ("hour" in duration || "minute" in duration || "second" in duration || "millisecond" in duration) {
                components.addTag("result/relativeDateAndTime");
                assignSimilarTime(components, date);
                assignSimilarDate(components, date);
                components.assign("timezoneOffset", reference.getTimezoneOffset());
            }
            else {
                implySimilarTime(components, date);
                components.imply("timezoneOffset", reference.getTimezoneOffset());
                if ("day" in duration) {
                    components.assign("day", date.getDate());
                    components.assign("month", date.getMonth() + 1);
                    components.assign("year", date.getFullYear());
                    components.assign("weekday", date.getDay());
                }
                else if ("week" in duration) {
                    components.assign("day", date.getDate());
                    components.assign("month", date.getMonth() + 1);
                    components.assign("year", date.getFullYear());
                    components.imply("weekday", date.getDay());
                }
                else {
                    components.imply("day", date.getDate());
                    if ("month" in duration) {
                        components.assign("month", date.getMonth() + 1);
                        components.assign("year", date.getFullYear());
                    }
                    else {
                        components.imply("month", date.getMonth() + 1);
                        if ("year" in duration) {
                            components.assign("year", date.getFullYear());
                        }
                        else {
                            components.imply("year", date.getFullYear());
                        }
                    }
                }
            }
            return components;
        }
        get(component) {
            if (component in this.knownValues) {
                return this.knownValues[component];
            }
            if (component in this.impliedValues) {
                return this.impliedValues[component];
            }
            return null;
        }
        isCertain(component) {
            return component in this.knownValues;
        }
        getCertainComponents() {
            return Object.keys(this.knownValues);
        }
        imply(component, value) {
            if (component in this.knownValues) {
                return this;
            }
            this.impliedValues[component] = value;
            return this;
        }
        assign(component, value) {
            this.knownValues[component] = value;
            delete this.impliedValues[component];
            return this;
        }
        addDurationAsImplied(duration) {
            const currentDate = this.dateWithoutTimezoneAdjustment();
            const date = addDuration(currentDate, duration);
            if ("day" in duration || "week" in duration || "month" in duration || "year" in duration) {
                this.delete(["day", "weekday", "month", "year"]);
                this.imply("day", date.getDate());
                this.imply("weekday", date.getDay());
                this.imply("month", date.getMonth() + 1);
                this.imply("year", date.getFullYear());
            }
            if ("second" in duration || "minute" in duration || "hour" in duration) {
                this.delete(["second", "minute", "hour"]);
                this.imply("second", date.getSeconds());
                this.imply("minute", date.getMinutes());
                this.imply("hour", date.getHours());
            }
            return this;
        }
        delete(components) {
            if (typeof components === "string") {
                components = [components];
            }
            for (const component of components) {
                delete this.knownValues[component];
                delete this.impliedValues[component];
            }
        }
        clone() {
            const component = new ParsingComponents(this.reference);
            component.knownValues = {};
            component.impliedValues = {};
            for (const key in this.knownValues) {
                component.knownValues[key] = this.knownValues[key];
            }
            for (const key in this.impliedValues) {
                component.impliedValues[key] = this.impliedValues[key];
            }
            return component;
        }
        isOnlyDate() {
            return !this.isCertain("hour") && !this.isCertain("minute") && !this.isCertain("second");
        }
        isOnlyTime() {
            return (!this.isCertain("weekday") && !this.isCertain("day") && !this.isCertain("month") && !this.isCertain("year"));
        }
        isOnlyWeekdayComponent() {
            return this.isCertain("weekday") && !this.isCertain("day") && !this.isCertain("month");
        }
        isDateWithUnknownYear() {
            return this.isCertain("month") && !this.isCertain("year");
        }
        isValidDate() {
            const date = new Date(Date.UTC(this.get("year"), this.get("month") - 1, this.get("day"), this.get("hour"), this.get("minute"), this.get("second"), this.get("millisecond")));
            date.setUTCFullYear(this.get("year"));
            if (date.getUTCFullYear() !== this.get("year"))
                return false;
            if (date.getUTCMonth() !== this.get("month") - 1)
                return false;
            if (date.getUTCDate() !== this.get("day"))
                return false;
            if (this.get("hour") != null && date.getUTCHours() != this.get("hour"))
                return false;
            if (this.get("minute") != null && date.getUTCMinutes() != this.get("minute"))
                return false;
            return true;
        }
        toString() {
            return `[ParsingComponents {
            tags: ${JSON.stringify(Array.from(this._tags).sort())}, 
            knownValues: ${JSON.stringify(this.knownValues)}, 
            impliedValues: ${JSON.stringify(this.impliedValues)}}, 
            reference: ${JSON.stringify(this.reference)}]`;
        }
        date() {
            const timezoneOffset = this.get("timezoneOffset") ?? this.reference.timezoneOffset;
            if (timezoneOffset === null || timezoneOffset === undefined) {
                return this.dateWithoutTimezoneAdjustment();
            }
            const date = new Date(Date.UTC(this.get("year"), this.get("month") - 1, this.get("day"), this.get("hour"), this.get("minute"), this.get("second"), this.get("millisecond")));
            date.setUTCFullYear(this.get("year"));
            return new Date(date.getTime() - timezoneOffset * 60000);
        }
        addTag(tag) {
            this._tags.add(tag);
            return this;
        }
        addTags(tags) {
            for (const tag of tags) {
                this._tags.add(tag);
            }
            return this;
        }
        tags() {
            return new Set(this._tags);
        }
        dateWithoutTimezoneAdjustment() {
            const date = new Date(this.get("year"), this.get("month") - 1, this.get("day"), this.get("hour"), this.get("minute"), this.get("second"), this.get("millisecond"));
            date.setFullYear(this.get("year"));
            return date;
        }
    }
    class ParsingResult {
        refDate;
        index;
        text;
        reference;
        start;
        end;
        constructor(reference, index, text, start, end) {
            this.reference = reference;
            this.refDate = reference.instant;
            this.index = index;
            this.text = text;
            this.start = start || new ParsingComponents(reference);
            this.end = end;
        }
        clone() {
            const result = new ParsingResult(this.reference, this.index, this.text);
            result.start = this.start ? this.start.clone() : null;
            result.end = this.end ? this.end.clone() : null;
            return result;
        }
        date() {
            return this.start.date();
        }
        addTag(tag) {
            this.start.addTag(tag);
            if (this.end) {
                this.end.addTag(tag);
            }
            return this;
        }
        addTags(tags) {
            this.start.addTags(tags);
            if (this.end) {
                this.end.addTags(tags);
            }
            return this;
        }
        tags() {
            const combinedTags = new Set(this.start.tags());
            if (this.end) {
                for (const tag of this.end.tags()) {
                    combinedTags.add(tag);
                }
            }
            return combinedTags;
        }
        toString() {
            const tags = Array.from(this.tags()).sort();
            return `[ParsingResult {index: ${this.index}, text: '${this.text}', tags: ${JSON.stringify(tags)} ...}]`;
        }
    }

    function repeatedTimeunitPattern(prefix, singleTimeunitPattern, connectorPattern = "\\s{0,5},?\\s{0,5}") {
        const singleTimeunitPatternNoCapture = singleTimeunitPattern.replace(/\((?!\?)/g, "(?:");
        return `${prefix}${singleTimeunitPatternNoCapture}(?:${connectorPattern}${singleTimeunitPatternNoCapture}){0,10}`;
    }
    function extractTerms(dictionary) {
        let keys;
        if (dictionary instanceof Array) {
            keys = [...dictionary];
        }
        else if (dictionary instanceof Map) {
            keys = Array.from(dictionary.keys());
        }
        else {
            keys = Object.keys(dictionary);
        }
        return keys;
    }
    function matchAnyPattern(dictionary) {
        const joinedTerms = extractTerms(dictionary)
            .sort((a, b) => b.length - a.length)
            .join("|")
            .replace(/\./g, "\\.");
        return `(?:${joinedTerms})`;
    }

    function findMostLikelyADYear(yearNumber) {
        if (yearNumber < 100) {
            if (yearNumber > 50) {
                yearNumber = yearNumber + 1900;
            }
            else {
                yearNumber = yearNumber + 2000;
            }
        }
        return yearNumber;
    }
    function findYearClosestToRef(refDate, day, month) {
        let date = new Date(refDate);
        date.setMonth(month - 1);
        date.setDate(day);
        const nextYear = addDuration(date, { "year": 1 });
        const lastYear = addDuration(date, { "year": -1 });
        if (Math.abs(nextYear.getTime() - refDate.getTime()) < Math.abs(date.getTime() - refDate.getTime())) {
            date = nextYear;
        }
        else if (Math.abs(lastYear.getTime() - refDate.getTime()) < Math.abs(date.getTime() - refDate.getTime())) {
            date = lastYear;
        }
        return date.getFullYear();
    }

    const WEEKDAY_DICTIONARY = {
        sunday: 0,
        sun: 0,
        "sun.": 0,
        monday: 1,
        mon: 1,
        "mon.": 1,
        tuesday: 2,
        tue: 2,
        "tue.": 2,
        wednesday: 3,
        wed: 3,
        "wed.": 3,
        thursday: 4,
        thurs: 4,
        "thurs.": 4,
        thur: 4,
        "thur.": 4,
        thu: 4,
        "thu.": 4,
        friday: 5,
        fri: 5,
        "fri.": 5,
        saturday: 6,
        sat: 6,
        "sat.": 6,
    };
    const FULL_MONTH_NAME_DICTIONARY = {
        january: 1,
        february: 2,
        march: 3,
        april: 4,
        may: 5,
        june: 6,
        july: 7,
        august: 8,
        september: 9,
        october: 10,
        november: 11,
        december: 12,
    };
    const MONTH_DICTIONARY = {
        ...FULL_MONTH_NAME_DICTIONARY,
        jan: 1,
        "jan.": 1,
        feb: 2,
        "feb.": 2,
        mar: 3,
        "mar.": 3,
        apr: 4,
        "apr.": 4,
        jun: 6,
        "jun.": 6,
        jul: 7,
        "jul.": 7,
        aug: 8,
        "aug.": 8,
        sep: 9,
        "sep.": 9,
        sept: 9,
        "sept.": 9,
        oct: 10,
        "oct.": 10,
        nov: 11,
        "nov.": 11,
        dec: 12,
        "dec.": 12,
    };
    const INTEGER_WORD_DICTIONARY = {
        one: 1,
        two: 2,
        three: 3,
        four: 4,
        five: 5,
        six: 6,
        seven: 7,
        eight: 8,
        nine: 9,
        ten: 10,
        eleven: 11,
        twelve: 12,
    };
    const ORDINAL_WORD_DICTIONARY = {
        first: 1,
        second: 2,
        third: 3,
        fourth: 4,
        fifth: 5,
        sixth: 6,
        seventh: 7,
        eighth: 8,
        ninth: 9,
        tenth: 10,
        eleventh: 11,
        twelfth: 12,
        thirteenth: 13,
        fourteenth: 14,
        fifteenth: 15,
        sixteenth: 16,
        seventeenth: 17,
        eighteenth: 18,
        nineteenth: 19,
        twentieth: 20,
        "twenty first": 21,
        "twenty-first": 21,
        "twenty second": 22,
        "twenty-second": 22,
        "twenty third": 23,
        "twenty-third": 23,
        "twenty fourth": 24,
        "twenty-fourth": 24,
        "twenty fifth": 25,
        "twenty-fifth": 25,
        "twenty sixth": 26,
        "twenty-sixth": 26,
        "twenty seventh": 27,
        "twenty-seventh": 27,
        "twenty eighth": 28,
        "twenty-eighth": 28,
        "twenty ninth": 29,
        "twenty-ninth": 29,
        "thirtieth": 30,
        "thirty first": 31,
        "thirty-first": 31,
    };
    const TIME_UNIT_DICTIONARY_NO_ABBR = {
        second: "second",
        seconds: "second",
        minute: "minute",
        minutes: "minute",
        hour: "hour",
        hours: "hour",
        day: "day",
        days: "day",
        week: "week",
        weeks: "week",
        month: "month",
        months: "month",
        quarter: "quarter",
        quarters: "quarter",
        year: "year",
        years: "year",
    };
    const TIME_UNIT_DICTIONARY = {
        s: "second",
        sec: "second",
        second: "second",
        seconds: "second",
        m: "minute",
        min: "minute",
        mins: "minute",
        minute: "minute",
        minutes: "minute",
        h: "hour",
        hr: "hour",
        hrs: "hour",
        hour: "hour",
        hours: "hour",
        d: "day",
        day: "day",
        days: "day",
        w: "week",
        week: "week",
        weeks: "week",
        mo: "month",
        mon: "month",
        mos: "month",
        month: "month",
        months: "month",
        qtr: "quarter",
        quarter: "quarter",
        quarters: "quarter",
        y: "year",
        yr: "year",
        year: "year",
        years: "year",
        ...TIME_UNIT_DICTIONARY_NO_ABBR,
    };
    const NUMBER_PATTERN = `(?:${matchAnyPattern(INTEGER_WORD_DICTIONARY)}|[0-9]+|[0-9]+\\.[0-9]+|half(?:\\s{0,2}an?)?|an?\\b(?:\\s{0,2}few)?|few|several|the|a?\\s{0,2}couple\\s{0,2}(?:of)?)`;
    function parseNumberPattern(match) {
        const num = match.toLowerCase();
        if (INTEGER_WORD_DICTIONARY[num] !== undefined) {
            return INTEGER_WORD_DICTIONARY[num];
        }
        else if (num === "a" || num === "an" || num == "the") {
            return 1;
        }
        else if (num.match(/few/)) {
            return 3;
        }
        else if (num.match(/half/)) {
            return 0.5;
        }
        else if (num.match(/couple/)) {
            return 2;
        }
        else if (num.match(/several/)) {
            return 7;
        }
        return parseFloat(num);
    }
    const ORDINAL_NUMBER_PATTERN = `(?:${matchAnyPattern(ORDINAL_WORD_DICTIONARY)}|[0-9]{1,2}(?:st|nd|rd|th)?)`;
    function parseOrdinalNumberPattern(match) {
        let num = match.toLowerCase();
        if (ORDINAL_WORD_DICTIONARY[num] !== undefined) {
            return ORDINAL_WORD_DICTIONARY[num];
        }
        num = num.replace(/(?:st|nd|rd|th)$/i, "");
        return parseInt(num);
    }
    const YEAR_PATTERN$1 = `(?:[1-9][0-9]{0,3}\\s{0,2}(?:BE|AD|BC|BCE|CE)|[1-9][0-9]{3}|[0-9]{2}(?!\\w|:\\d|\\s+(?:am|pm|o\\s*clock|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)))`;
    function parseYear(match) {
        if (/BE/i.test(match)) {
            match = match.replace(/BE/i, "");
            return parseInt(match) - 543;
        }
        if (/BCE?/i.test(match)) {
            match = match.replace(/BCE?/i, "");
            return -parseInt(match);
        }
        if (/(AD|CE)/i.test(match)) {
            match = match.replace(/(AD|CE)/i, "");
            return parseInt(match);
        }
        const rawYearNumber = parseInt(match);
        return findMostLikelyADYear(rawYearNumber);
    }
    const SINGLE_TIME_UNIT_PATTERN = `(${NUMBER_PATTERN})\\s{0,3}(${matchAnyPattern(TIME_UNIT_DICTIONARY)})`;
    const SINGLE_TIME_UNIT_REGEX = new RegExp(SINGLE_TIME_UNIT_PATTERN, "i");
    const SINGLE_TIME_UNIT_NO_ABBR_PATTERN = `(${NUMBER_PATTERN})\\s{0,3}(${matchAnyPattern(TIME_UNIT_DICTIONARY_NO_ABBR)})`;
    const TIME_UNIT_CONNECTOR_PATTERN = `\\s{0,5},?(?:\\s*and)?\\s{0,5}`;
    const TIME_UNITS_PATTERN = repeatedTimeunitPattern(`(?:(?:about|around)\\s{0,3})?`, SINGLE_TIME_UNIT_PATTERN, TIME_UNIT_CONNECTOR_PATTERN);
    const TIME_UNITS_NO_ABBR_PATTERN = repeatedTimeunitPattern(`(?:(?:about|around)\\s{0,3})?`, SINGLE_TIME_UNIT_NO_ABBR_PATTERN, TIME_UNIT_CONNECTOR_PATTERN);
    function parseDuration(timeunitText) {
        const fragments = {};
        let remainingText = timeunitText;
        let match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
        while (match) {
            collectDateTimeFragment(fragments, match);
            remainingText = remainingText.substring(match[0].length).trim();
            match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
        }
        if (Object.keys(fragments).length == 0) {
            return null;
        }
        return fragments;
    }
    function collectDateTimeFragment(fragments, match) {
        if (match[0].match(/^[a-zA-Z]+$/)) {
            return;
        }
        const num = parseNumberPattern(match[1]);
        const unit = TIME_UNIT_DICTIONARY[match[2].toLowerCase()];
        fragments[unit] = num;
    }

    class AbstractParserWithWordBoundaryChecking {
        innerPatternHasChange(context, currentInnerPattern) {
            return this.innerPattern(context) !== currentInnerPattern;
        }
        patternLeftBoundary() {
            return `(\\W|^)`;
        }
        cachedInnerPattern = null;
        cachedPattern = null;
        pattern(context) {
            if (this.cachedInnerPattern) {
                if (!this.innerPatternHasChange(context, this.cachedInnerPattern)) {
                    return this.cachedPattern;
                }
            }
            this.cachedInnerPattern = this.innerPattern(context);
            this.cachedPattern = new RegExp(`${this.patternLeftBoundary()}${this.cachedInnerPattern.source}`, this.cachedInnerPattern.flags);
            return this.cachedPattern;
        }
        extract(context, match) {
            const header = match[1] ?? "";
            match.index = match.index + header.length;
            match[0] = match[0].substring(header.length);
            for (let i = 2; i < match.length; i++) {
                match[i - 1] = match[i];
            }
            return this.innerExtract(context, match);
        }
    }

    const PATTERN_WITH_OPTIONAL_PREFIX = new RegExp(`(?:(?:within|in|for)\\s*)?` +
        `(?:(?:about|around|roughly|approximately|just)\\s*(?:~\\s*)?)?(${TIME_UNITS_PATTERN})(?=\\W|$)`, "i");
    const PATTERN_WITH_PREFIX = new RegExp(`(?:within|in|for)\\s*` +
        `(?:(?:about|around|roughly|approximately|just)\\s*(?:~\\s*)?)?(${TIME_UNITS_PATTERN})(?=\\W|$)`, "i");
    const PATTERN_WITH_PREFIX_STRICT = new RegExp(`(?:within|in|for)\\s*` +
        `(?:(?:about|around|roughly|approximately|just)\\s*(?:~\\s*)?)?(${TIME_UNITS_NO_ABBR_PATTERN})(?=\\W|$)`, "i");
    class ENTimeUnitWithinFormatParser extends AbstractParserWithWordBoundaryChecking {
        strictMode;
        constructor(strictMode) {
            super();
            this.strictMode = strictMode;
        }
        innerPattern(context) {
            if (this.strictMode) {
                return PATTERN_WITH_PREFIX_STRICT;
            }
            return context.option.forwardDate ? PATTERN_WITH_OPTIONAL_PREFIX : PATTERN_WITH_PREFIX;
        }
        innerExtract(context, match) {
            if (match[0].match(/^for\s*the\s*\w+/)) {
                return null;
            }
            const timeUnits = parseDuration(match[1]);
            if (!timeUnits) {
                return null;
            }
            return ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
        }
    }

    const PATTERN$e = new RegExp(`(?:on\\s{0,3})?` +
        `(${ORDINAL_NUMBER_PATTERN})` +
        `(?:` +
        `\\s{0,3}(?:to|\\-|\\–|until|through|till)\\s{0,3}` +
        `(${ORDINAL_NUMBER_PATTERN})` +
        ")?" +
        `(?:-|/|\\s{0,3}(?:of)?\\s{0,3})` +
        `(${matchAnyPattern(MONTH_DICTIONARY)})` +
        "(?:" +
        `(?:-|/|,?\\s{0,3})` +
        `(${YEAR_PATTERN$1}(?!\\w))` +
        ")?" +
        "(?=\\W|$)", "i");
    const DATE_GROUP$1 = 1;
    const DATE_TO_GROUP$1 = 2;
    const MONTH_NAME_GROUP$4 = 3;
    const YEAR_GROUP$6 = 4;
    class ENMonthNameLittleEndianParser extends AbstractParserWithWordBoundaryChecking {
        innerPattern() {
            return PATTERN$e;
        }
        innerExtract(context, match) {
            const result = context.createParsingResult(match.index, match[0]);
            const month = MONTH_DICTIONARY[match[MONTH_NAME_GROUP$4].toLowerCase()];
            const day = parseOrdinalNumberPattern(match[DATE_GROUP$1]);
            if (day > 31) {
                match.index = match.index + match[DATE_GROUP$1].length;
                return null;
            }
            result.start.assign("month", month);
            result.start.assign("day", day);
            if (match[YEAR_GROUP$6]) {
                const yearNumber = parseYear(match[YEAR_GROUP$6]);
                result.start.assign("year", yearNumber);
            }
            else {
                const year = findYearClosestToRef(context.refDate, day, month);
                result.start.imply("year", year);
            }
            if (match[DATE_TO_GROUP$1]) {
                const endDate = parseOrdinalNumberPattern(match[DATE_TO_GROUP$1]);
                result.end = result.start.clone();
                result.end.assign("day", endDate);
            }
            return result;
        }
    }

    const PATTERN$d = new RegExp(`(${matchAnyPattern(MONTH_DICTIONARY)})` +
        "(?:-|/|\\s*,?\\s*)" +
        `(${ORDINAL_NUMBER_PATTERN})(?!\\s*(?:am|pm))\\s*` +
        "(?:" +
        "(?:to|\\-)\\s*" +
        `(${ORDINAL_NUMBER_PATTERN})\\s*` +
        ")?" +
        "(?:" +
        `(?:-|/|\\s*,\\s*|\\s+)` +
        `(${YEAR_PATTERN$1})` +
        ")?" +
        "(?=\\W|$)(?!\\:\\d)", "i");
    const MONTH_NAME_GROUP$3 = 1;
    const DATE_GROUP = 2;
    const DATE_TO_GROUP = 3;
    const YEAR_GROUP$5 = 4;
    class ENMonthNameMiddleEndianParser extends AbstractParserWithWordBoundaryChecking {
        shouldSkipYearLikeDate;
        constructor(shouldSkipYearLikeDate) {
            super();
            this.shouldSkipYearLikeDate = shouldSkipYearLikeDate;
        }
        innerPattern() {
            return PATTERN$d;
        }
        innerExtract(context, match) {
            const month = MONTH_DICTIONARY[match[MONTH_NAME_GROUP$3].toLowerCase()];
            const day = parseOrdinalNumberPattern(match[DATE_GROUP]);
            if (day > 31) {
                return null;
            }
            if (this.shouldSkipYearLikeDate) {
                if (!match[DATE_TO_GROUP] && !match[YEAR_GROUP$5] && match[DATE_GROUP].match(/^\d{2}$/)) {
                    return null;
                }
            }
            const components = context
                .createParsingComponents({
                day: day,
                month: month,
            })
                .addTag("parser/ENMonthNameMiddleEndianParser");
            if (match[YEAR_GROUP$5]) {
                const year = parseYear(match[YEAR_GROUP$5]);
                components.assign("year", year);
            }
            else {
                const year = findYearClosestToRef(context.refDate, day, month);
                components.imply("year", year);
            }
            if (!match[DATE_TO_GROUP]) {
                return components;
            }
            const endDate = parseOrdinalNumberPattern(match[DATE_TO_GROUP]);
            const result = context.createParsingResult(match.index, match[0]);
            result.start = components;
            result.end = components.clone();
            result.end.assign("day", endDate);
            return result;
        }
    }

    const PATTERN$c = new RegExp(`((?:in)\\s*)?` +
        `(${matchAnyPattern(MONTH_DICTIONARY)})` +
        `\\s*` +
        `(?:` +
        `(?:,|-|of)?\\s*(${YEAR_PATTERN$1})?` +
        ")?" +
        "(?=[^\\s\\w]|\\s+[^0-9]|\\s+$|$)", "i");
    const PREFIX_GROUP$1 = 1;
    const MONTH_NAME_GROUP$2 = 2;
    const YEAR_GROUP$4 = 3;
    class ENMonthNameParser extends AbstractParserWithWordBoundaryChecking {
        innerPattern() {
            return PATTERN$c;
        }
        innerExtract(context, match) {
            const monthName = match[MONTH_NAME_GROUP$2].toLowerCase();
            if (match[0].length <= 3 && !FULL_MONTH_NAME_DICTIONARY[monthName]) {
                return null;
            }
            const result = context.createParsingResult(match.index + (match[PREFIX_GROUP$1] || "").length, match.index + match[0].length);
            result.start.imply("day", 1);
            result.start.addTag("parser/ENMonthNameParser");
            const month = MONTH_DICTIONARY[monthName];
            result.start.assign("month", month);
            if (match[YEAR_GROUP$4]) {
                const year = parseYear(match[YEAR_GROUP$4]);
                result.start.assign("year", year);
            }
            else {
                const year = findYearClosestToRef(context.refDate, 1, month);
                result.start.imply("year", year);
            }
            return result;
        }
    }

    const PATTERN$b = new RegExp(`([0-9]{4})[-\\.\\/\\s]` +
        `(?:(${matchAnyPattern(MONTH_DICTIONARY)})|([0-9]{1,2}))[-\\.\\/\\s]` +
        `([0-9]{1,2})` +
        "(?=\\W|$)", "i");
    const YEAR_NUMBER_GROUP$1 = 1;
    const MONTH_NAME_GROUP$1 = 2;
    const MONTH_NUMBER_GROUP$1 = 3;
    const DATE_NUMBER_GROUP$1 = 4;
    class ENYearMonthDayParser extends AbstractParserWithWordBoundaryChecking {
        strictMonthDateOrder;
        constructor(strictMonthDateOrder) {
            super();
            this.strictMonthDateOrder = strictMonthDateOrder;
        }
        innerPattern() {
            return PATTERN$b;
        }
        innerExtract(context, match) {
            const year = parseInt(match[YEAR_NUMBER_GROUP$1]);
            let day = parseInt(match[DATE_NUMBER_GROUP$1]);
            let month = match[MONTH_NUMBER_GROUP$1]
                ? parseInt(match[MONTH_NUMBER_GROUP$1])
                : MONTH_DICTIONARY[match[MONTH_NAME_GROUP$1].toLowerCase()];
            if (month < 1 || month > 12) {
                if (this.strictMonthDateOrder) {
                    return null;
                }
                if (day >= 1 && day <= 12) {
                    [month, day] = [day, month];
                }
            }
            if (day < 1 || day > 31) {
                return null;
            }
            return {
                day: day,
                month: month,
                year: year,
            };
        }
    }

    const YEAR_PATTERN = `(?:[1-9][0-9]{0,3}\\s{0,2}(?:BE|AD|BC|BCE|CE)|[1-9][0-9]{3})`;
    const PATTERN$a = new RegExp(`(${YEAR_PATTERN})` +
        `(?:\\s*[-.\\/,]?\\s*|\\s+of\\s+)` +
        `(${matchAnyPattern(MONTH_DICTIONARY)})` +
        `(?=[^\\s\\w]|\\s+[^0-9]|\\s+$|$)`, "i");
    const YEAR_GROUP$3 = 1;
    const MONTH_NAME_GROUP = 2;
    class ENYearMonthNameParser extends AbstractParserWithWordBoundaryChecking {
        innerPattern() {
            return PATTERN$a;
        }
        innerExtract(context, match) {
            const year = parseYear(match[YEAR_GROUP$3]);
            const monthName = match[MONTH_NAME_GROUP].toLowerCase();
            const month = MONTH_DICTIONARY[monthName];
            const result = context.createParsingResult(match.index, match[0]);
            result.start.imply("day", 1);
            result.start.assign("month", month);
            result.start.assign("year", year);
            result.start.addTag("parser/ENYearMonthNameParser");
            return result;
        }
    }

    const PATTERN$9 = new RegExp("([0-9]|0[1-9]|1[012])/([0-9]{4})" + "", "i");
    const MONTH_GROUP = 1;
    const YEAR_GROUP$2 = 2;
    class ENSlashMonthFormatParser extends AbstractParserWithWordBoundaryChecking {
        innerPattern() {
            return PATTERN$9;
        }
        innerExtract(context, match) {
            const year = parseInt(match[YEAR_GROUP$2]);
            const month = parseInt(match[MONTH_GROUP]);
            return context.createParsingComponents().imply("day", 1).assign("month", month).assign("year", year);
        }
    }

    function primaryTimePattern(leftBoundary, primaryPrefix, primarySuffix, flags) {
        return new RegExp(`${leftBoundary}` +
            `${primaryPrefix}` +
            `(\\d{1,4})` +
            `(?:` +
            `(?:\\.|:|：)` +
            `(\\d{1,2})` +
            `(?:` +
            `(?::|：)` +
            `(\\d{2})` +
            `(?:\\.(\\d{1,6}))?` +
            `)?` +
            `)?` +
            `(?:\\s*(a\\.m\\.|p\\.m\\.|am?|pm?))?` +
            `${primarySuffix}`, flags);
    }
    function followingTimePatten(followingPhase, followingSuffix) {
        return new RegExp(`^(${followingPhase})` +
            `(\\d{1,4})` +
            `(?:` +
            `(?:\\.|\\:|\\：)` +
            `(\\d{1,2})` +
            `(?:` +
            `(?:\\.|\\:|\\：)` +
            `(\\d{1,2})(?:\\.(\\d{1,6}))?` +
            `)?` +
            `)?` +
            `(?:\\s*(a\\.m\\.|p\\.m\\.|am?|pm?))?` +
            `${followingSuffix}`, "i");
    }
    const HOUR_GROUP = 2;
    const MINUTE_GROUP = 3;
    const SECOND_GROUP = 4;
    const MILLI_SECOND_GROUP = 5;
    const AM_PM_HOUR_GROUP = 6;
    class AbstractTimeExpressionParser {
        strictMode;
        constructor(strictMode = false) {
            this.strictMode = strictMode;
        }
        patternFlags() {
            return "i";
        }
        primaryPatternLeftBoundary() {
            return `(^|\\s|T|\\b)`;
        }
        primarySuffix() {
            return `(?!/)(?=\\W|$)`;
        }
        followingSuffix() {
            return `(?!/)(?=\\W|$)`;
        }
        pattern(context) {
            return this.getPrimaryTimePatternThroughCache();
        }
        extract(context, match) {
            const startComponents = this.extractPrimaryTimeComponents(context, match);
            if (!startComponents) {
                if (match[0].match(/^\d{4}/)) {
                    match.index += 4;
                    return null;
                }
                match.index += match[0].length;
                return null;
            }
            const index = match.index + match[1].length;
            const text = match[0].substring(match[1].length);
            const result = context.createParsingResult(index, text, startComponents);
            match.index += match[0].length;
            const remainingText = context.text.substring(match.index);
            const followingPattern = this.getFollowingTimePatternThroughCache();
            const followingMatch = followingPattern.exec(remainingText);
            if (text.match(/^\d{3,4}/) && followingMatch) {
                if (followingMatch[0].match(/^\s*([+-])\s*\d{2,4}$/)) {
                    return null;
                }
                if (followingMatch[0].match(/^\s*([+-])\s*\d{2}\W\d{2}/)) {
                    return null;
                }
            }
            if (!followingMatch ||
                followingMatch[0].match(/^\s*([+-])\s*\d{3,4}$/)) {
                return this.checkAndReturnWithoutFollowingPattern(result);
            }
            result.end = this.extractFollowingTimeComponents(context, followingMatch, result);
            if (result.end) {
                result.text += followingMatch[0];
            }
            return this.checkAndReturnWithFollowingPattern(result);
        }
        extractPrimaryTimeComponents(context, match, strict = false) {
            const components = context.createParsingComponents();
            let minute = 0;
            let meridiem = null;
            let hour = parseInt(match[HOUR_GROUP]);
            if (hour > 100) {
                if (match[HOUR_GROUP].length == 4 && match[MINUTE_GROUP] == null && !match[AM_PM_HOUR_GROUP]) {
                    return null;
                }
                if (this.strictMode || match[MINUTE_GROUP] != null) {
                    return null;
                }
                minute = hour % 100;
                hour = Math.floor(hour / 100);
            }
            if (hour > 24) {
                return null;
            }
            if (match[MINUTE_GROUP] != null) {
                if (match[MINUTE_GROUP].length == 1 && !match[AM_PM_HOUR_GROUP]) {
                    return null;
                }
                minute = parseInt(match[MINUTE_GROUP]);
            }
            if (minute >= 60) {
                return null;
            }
            if (hour > 12) {
                meridiem = Meridiem.PM;
            }
            if (match[AM_PM_HOUR_GROUP] != null) {
                if (hour > 12)
                    return null;
                const ampm = match[AM_PM_HOUR_GROUP][0].toLowerCase();
                if (ampm == "a") {
                    meridiem = Meridiem.AM;
                    if (hour == 12) {
                        hour = 0;
                    }
                }
                if (ampm == "p") {
                    meridiem = Meridiem.PM;
                    if (hour != 12) {
                        hour += 12;
                    }
                }
            }
            components.assign("hour", hour);
            components.assign("minute", minute);
            if (meridiem !== null) {
                components.assign("meridiem", meridiem);
            }
            else {
                if (hour < 12) {
                    components.imply("meridiem", Meridiem.AM);
                }
                else {
                    components.imply("meridiem", Meridiem.PM);
                }
            }
            if (match[MILLI_SECOND_GROUP] != null) {
                const millisecond = parseInt(match[MILLI_SECOND_GROUP].substring(0, 3));
                if (millisecond >= 1000)
                    return null;
                components.assign("millisecond", millisecond);
            }
            if (match[SECOND_GROUP] != null) {
                const second = parseInt(match[SECOND_GROUP]);
                if (second >= 60)
                    return null;
                components.assign("second", second);
            }
            return components;
        }
        extractFollowingTimeComponents(context, match, result) {
            const components = context.createParsingComponents();
            if (match[MILLI_SECOND_GROUP] != null) {
                const millisecond = parseInt(match[MILLI_SECOND_GROUP].substring(0, 3));
                if (millisecond >= 1000)
                    return null;
                components.assign("millisecond", millisecond);
            }
            if (match[SECOND_GROUP] != null) {
                const second = parseInt(match[SECOND_GROUP]);
                if (second >= 60)
                    return null;
                components.assign("second", second);
            }
            let hour = parseInt(match[HOUR_GROUP]);
            let minute = 0;
            let meridiem = -1;
            if (match[MINUTE_GROUP] != null) {
                minute = parseInt(match[MINUTE_GROUP]);
            }
            else if (hour > 100) {
                minute = hour % 100;
                hour = Math.floor(hour / 100);
            }
            if (minute >= 60 || hour > 24) {
                return null;
            }
            if (hour >= 12) {
                meridiem = Meridiem.PM;
            }
            if (match[AM_PM_HOUR_GROUP] != null) {
                if (hour > 12) {
                    return null;
                }
                const ampm = match[AM_PM_HOUR_GROUP][0].toLowerCase();
                if (ampm == "a") {
                    meridiem = Meridiem.AM;
                    if (hour == 12) {
                        hour = 0;
                        if (!components.isCertain("day")) {
                            components.imply("day", components.get("day") + 1);
                        }
                    }
                }
                if (ampm == "p") {
                    meridiem = Meridiem.PM;
                    if (hour != 12)
                        hour += 12;
                }
                if (!result.start.isCertain("meridiem")) {
                    if (meridiem == Meridiem.AM) {
                        result.start.imply("meridiem", Meridiem.AM);
                        if (result.start.get("hour") == 12) {
                            result.start.assign("hour", 0);
                        }
                    }
                    else {
                        result.start.imply("meridiem", Meridiem.PM);
                        if (result.start.get("hour") != 12) {
                            result.start.assign("hour", result.start.get("hour") + 12);
                        }
                    }
                }
            }
            components.assign("hour", hour);
            components.assign("minute", minute);
            if (meridiem >= 0) {
                components.assign("meridiem", meridiem);
            }
            else {
                const startAtPM = result.start.isCertain("meridiem") && result.start.get("hour") > 12;
                if (startAtPM) {
                    if (result.start.get("hour") - 12 > hour) {
                        components.imply("meridiem", Meridiem.AM);
                    }
                    else if (hour <= 12) {
                        components.assign("hour", hour + 12);
                        components.assign("meridiem", Meridiem.PM);
                    }
                }
                else if (hour > 12) {
                    components.imply("meridiem", Meridiem.PM);
                }
                else if (hour <= 12) {
                    components.imply("meridiem", Meridiem.AM);
                }
            }
            if (components.date().getTime() < result.start.date().getTime()) {
                components.imply("day", components.get("day") + 1);
            }
            return components;
        }
        checkAndReturnWithoutFollowingPattern(result) {
            if (result.text.match(/^\d$/)) {
                return null;
            }
            if (result.text.match(/^\d\d\d+$/)) {
                return null;
            }
            if (result.text.match(/\d[apAP]$/)) {
                return null;
            }
            const endingWithNumbers = result.text.match(/[^\d:.](\d[\d.]+)$/);
            if (endingWithNumbers) {
                const endingNumbers = endingWithNumbers[1];
                if (this.strictMode) {
                    return null;
                }
                if (endingNumbers.includes(".") && !endingNumbers.match(/\d(\.\d{2})+$/)) {
                    return null;
                }
                const endingNumberVal = parseInt(endingNumbers);
                if (endingNumberVal > 24) {
                    return null;
                }
            }
            return result;
        }
        checkAndReturnWithFollowingPattern(result) {
            if (result.text.match(/^\d+-\d+$/)) {
                return null;
            }
            const endingWithNumbers = result.text.match(/[^\d:.](\d[\d.]+)\s*-\s*(\d[\d.]+)$/);
            if (endingWithNumbers) {
                if (this.strictMode) {
                    return null;
                }
                const startingNumbers = endingWithNumbers[1];
                const endingNumbers = endingWithNumbers[2];
                if (endingNumbers.includes(".") && !endingNumbers.match(/\d(\.\d{2})+$/)) {
                    return null;
                }
                const endingNumberVal = parseInt(endingNumbers);
                const startingNumberVal = parseInt(startingNumbers);
                if (endingNumberVal > 24 || startingNumberVal > 24) {
                    return null;
                }
            }
            return result;
        }
        cachedPrimaryPrefix = null;
        cachedPrimarySuffix = null;
        cachedPrimaryTimePattern = null;
        getPrimaryTimePatternThroughCache() {
            const primaryPrefix = this.primaryPrefix();
            const primarySuffix = this.primarySuffix();
            if (this.cachedPrimaryPrefix === primaryPrefix && this.cachedPrimarySuffix === primarySuffix) {
                return this.cachedPrimaryTimePattern;
            }
            this.cachedPrimaryTimePattern = primaryTimePattern(this.primaryPatternLeftBoundary(), primaryPrefix, primarySuffix, this.patternFlags());
            this.cachedPrimaryPrefix = primaryPrefix;
            this.cachedPrimarySuffix = primarySuffix;
            return this.cachedPrimaryTimePattern;
        }
        cachedFollowingPhase = null;
        cachedFollowingSuffix = null;
        cachedFollowingTimePatten = null;
        getFollowingTimePatternThroughCache() {
            const followingPhase = this.followingPhase();
            const followingSuffix = this.followingSuffix();
            if (this.cachedFollowingPhase === followingPhase && this.cachedFollowingSuffix === followingSuffix) {
                return this.cachedFollowingTimePatten;
            }
            this.cachedFollowingTimePatten = followingTimePatten(followingPhase, followingSuffix);
            this.cachedFollowingPhase = followingPhase;
            this.cachedFollowingSuffix = followingSuffix;
            return this.cachedFollowingTimePatten;
        }
    }

    class ENTimeExpressionParser extends AbstractTimeExpressionParser {
        constructor(strictMode) {
            super(strictMode);
        }
        followingPhase() {
            return "\\s*(?:\\-|\\–|\\~|\\〜|to|until|through|till|\\?)\\s*";
        }
        primaryPrefix() {
            return "(?:(?:at|from)\\s*)??";
        }
        primarySuffix() {
            return "(?:\\s*(?:o\\W*clock|at\\s*night|in\\s*the\\s*(?:morning|afternoon)))?(?!/)(?=\\W|$)";
        }
        extractPrimaryTimeComponents(context, match) {
            const components = super.extractPrimaryTimeComponents(context, match);
            if (!components) {
                return components;
            }
            if (match[0].endsWith("night")) {
                const hour = components.get("hour");
                if (hour >= 6 && hour < 12) {
                    components.assign("hour", components.get("hour") + 12);
                    components.assign("meridiem", Meridiem.PM);
                }
                else if (hour < 6) {
                    components.assign("meridiem", Meridiem.AM);
                }
            }
            if (match[0].endsWith("afternoon")) {
                components.assign("meridiem", Meridiem.PM);
                const hour = components.get("hour");
                if (hour >= 0 && hour <= 6) {
                    components.assign("hour", components.get("hour") + 12);
                }
            }
            if (match[0].endsWith("morning")) {
                components.assign("meridiem", Meridiem.AM);
                const hour = components.get("hour");
                if (hour < 12) {
                    components.assign("hour", components.get("hour"));
                }
            }
            return components.addTag("parser/ENTimeExpressionParser");
        }
        extractFollowingTimeComponents(context, match, result) {
            const followingComponents = super.extractFollowingTimeComponents(context, match, result);
            if (followingComponents) {
                followingComponents.addTag("parser/ENTimeExpressionParser");
            }
            return followingComponents;
        }
    }

    const PATTERN$8 = new RegExp(`(${TIME_UNITS_PATTERN})\\s{0,5}(?:ago|before|earlier)(?=\\W|$)`, "i");
    const STRICT_PATTERN$1 = new RegExp(`(${TIME_UNITS_NO_ABBR_PATTERN})\\s{0,5}(?:ago|before|earlier)(?=\\W|$)`, "i");
    class ENTimeUnitAgoFormatParser extends AbstractParserWithWordBoundaryChecking {
        strictMode;
        constructor(strictMode) {
            super();
            this.strictMode = strictMode;
        }
        innerPattern() {
            return this.strictMode ? STRICT_PATTERN$1 : PATTERN$8;
        }
        innerExtract(context, match) {
            const duration = parseDuration(match[1]);
            if (!duration) {
                return null;
            }
            return ParsingComponents.createRelativeFromReference(context.reference, reverseDuration(duration));
        }
    }

    const PATTERN$7 = new RegExp(`(${TIME_UNITS_PATTERN})\\s{0,5}(?:later|after|from now|henceforth|forward|out)` + "(?=(?:\\W|$))", "i");
    const STRICT_PATTERN = new RegExp(`(${TIME_UNITS_NO_ABBR_PATTERN})\\s{0,5}(later|after|from now)(?=\\W|$)`, "i");
    const GROUP_NUM_TIMEUNITS = 1;
    class ENTimeUnitLaterFormatParser extends AbstractParserWithWordBoundaryChecking {
        strictMode;
        constructor(strictMode) {
            super();
            this.strictMode = strictMode;
        }
        innerPattern() {
            return this.strictMode ? STRICT_PATTERN : PATTERN$7;
        }
        innerExtract(context, match) {
            const timeUnits = parseDuration(match[GROUP_NUM_TIMEUNITS]);
            if (!timeUnits) {
                return null;
            }
            return ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
        }
    }

    class Filter {
        refine(context, results) {
            return results.filter((r) => this.isValid(context, r));
        }
    }
    class MergingRefiner {
        refine(context, results) {
            if (results.length < 2) {
                return results;
            }
            const mergedResults = [];
            let curResult = results[0];
            let nextResult = null;
            for (let i = 1; i < results.length; i++) {
                nextResult = results[i];
                const textBetween = context.text.substring(curResult.index + curResult.text.length, nextResult.index);
                if (!this.shouldMergeResults(textBetween, curResult, nextResult, context)) {
                    mergedResults.push(curResult);
                    curResult = nextResult;
                }
                else {
                    const left = curResult;
                    const right = nextResult;
                    const mergedResult = this.mergeResults(textBetween, left, right, context);
                    context.debug(() => {
                        console.log(`${this.constructor.name} merged ${left} and ${right} into ${mergedResult}`);
                    });
                    curResult = mergedResult;
                }
            }
            if (curResult != null) {
                mergedResults.push(curResult);
            }
            return mergedResults;
        }
    }

    class AbstractMergeDateRangeRefiner extends MergingRefiner {
        shouldMergeResults(textBetween, currentResult, nextResult) {
            return !currentResult.end && !nextResult.end && textBetween.match(this.patternBetween()) != null;
        }
        mergeResults(textBetween, fromResult, toResult) {
            if (!fromResult.start.isOnlyWeekdayComponent() && !toResult.start.isOnlyWeekdayComponent()) {
                toResult.start.getCertainComponents().forEach((key) => {
                    if (!fromResult.start.isCertain(key)) {
                        fromResult.start.imply(key, toResult.start.get(key));
                    }
                });
                fromResult.start.getCertainComponents().forEach((key) => {
                    if (!toResult.start.isCertain(key)) {
                        toResult.start.imply(key, fromResult.start.get(key));
                    }
                });
            }
            if (fromResult.start.date() > toResult.start.date()) {
                let fromDate = fromResult.start.date();
                let toDate = toResult.start.date();
                if (toResult.start.isOnlyWeekdayComponent() && addDuration(toDate, { day: 7 }) > fromDate) {
                    toDate = addDuration(toDate, { day: 7 });
                    toResult.start.imply("day", toDate.getDate());
                    toResult.start.imply("month", toDate.getMonth() + 1);
                    toResult.start.imply("year", toDate.getFullYear());
                }
                else if (fromResult.start.isOnlyWeekdayComponent() && addDuration(fromDate, { day: -7 }) < toDate) {
                    fromDate = addDuration(fromDate, { day: -7 });
                    fromResult.start.imply("day", fromDate.getDate());
                    fromResult.start.imply("month", fromDate.getMonth() + 1);
                    fromResult.start.imply("year", fromDate.getFullYear());
                }
                else if (toResult.start.isDateWithUnknownYear() && addDuration(toDate, { year: 1 }) > fromDate) {
                    toDate = addDuration(toDate, { year: 1 });
                    toResult.start.imply("year", toDate.getFullYear());
                }
                else if (fromResult.start.isDateWithUnknownYear() && addDuration(fromDate, { year: -1 }) < toDate) {
                    fromDate = addDuration(fromDate, { year: -1 });
                    fromResult.start.imply("year", fromDate.getFullYear());
                }
                else {
                    [toResult, fromResult] = [fromResult, toResult];
                }
            }
            const result = fromResult.clone();
            result.start = fromResult.start;
            result.end = toResult.start;
            result.index = Math.min(fromResult.index, toResult.index);
            if (fromResult.index < toResult.index) {
                result.text = fromResult.text + textBetween + toResult.text;
            }
            else {
                result.text = toResult.text + textBetween + fromResult.text;
            }
            return result;
        }
    }

    class ENMergeDateRangeRefiner extends AbstractMergeDateRangeRefiner {
        patternBetween() {
            return /^\s*(to|-|–|until|through|till)\s*$/i;
        }
    }

    function mergeDateTimeResult(dateResult, timeResult) {
        const result = dateResult.clone();
        const beginDate = dateResult.start;
        const beginTime = timeResult.start;
        result.start = mergeDateTimeComponent(beginDate, beginTime);
        if (dateResult.end != null || timeResult.end != null) {
            const endDate = dateResult.end == null ? dateResult.start : dateResult.end;
            const endTime = timeResult.end == null ? timeResult.start : timeResult.end;
            const endDateTime = mergeDateTimeComponent(endDate, endTime);
            if (dateResult.end == null && endDateTime.date().getTime() < result.start.date().getTime()) {
                const nextDay = new Date(endDateTime.date().getTime());
                nextDay.setDate(nextDay.getDate() + 1);
                if (endDateTime.isCertain("day")) {
                    assignSimilarDate(endDateTime, nextDay);
                }
                else {
                    implySimilarDate(endDateTime, nextDay);
                }
            }
            result.end = endDateTime;
        }
        return result;
    }
    function mergeDateTimeComponent(dateComponent, timeComponent) {
        const dateTimeComponent = dateComponent.clone();
        if (timeComponent.isCertain("hour")) {
            dateTimeComponent.assign("hour", timeComponent.get("hour"));
            dateTimeComponent.assign("minute", timeComponent.get("minute"));
            if (timeComponent.isCertain("second")) {
                dateTimeComponent.assign("second", timeComponent.get("second"));
                if (timeComponent.isCertain("millisecond")) {
                    dateTimeComponent.assign("millisecond", timeComponent.get("millisecond"));
                }
                else {
                    dateTimeComponent.imply("millisecond", timeComponent.get("millisecond"));
                }
            }
            else {
                dateTimeComponent.imply("second", timeComponent.get("second"));
                dateTimeComponent.imply("millisecond", timeComponent.get("millisecond"));
            }
        }
        else {
            dateTimeComponent.imply("hour", timeComponent.get("hour"));
            dateTimeComponent.imply("minute", timeComponent.get("minute"));
            dateTimeComponent.imply("second", timeComponent.get("second"));
            dateTimeComponent.imply("millisecond", timeComponent.get("millisecond"));
        }
        if (timeComponent.isCertain("timezoneOffset")) {
            dateTimeComponent.assign("timezoneOffset", timeComponent.get("timezoneOffset"));
        }
        const dateHasMeaningfulMeridiem = dateComponent.get("meridiem") != null &&
            (dateComponent.isCertain("meridiem") ||
                Array.from(dateComponent.tags()).some((t) => t.startsWith("casualReference/")));
        if (timeComponent.isCertain("meridiem")) {
            dateTimeComponent.assign("meridiem", timeComponent.get("meridiem"));
        }
        else if (timeComponent.get("meridiem") != null && !dateHasMeaningfulMeridiem) {
            dateTimeComponent.imply("meridiem", timeComponent.get("meridiem"));
        }
        if (dateTimeComponent.get("meridiem") == Meridiem.PM && dateTimeComponent.get("hour") < 12) {
            if (timeComponent.isCertain("hour")) {
                dateTimeComponent.assign("hour", dateTimeComponent.get("hour") + 12);
            }
            else {
                dateTimeComponent.imply("hour", dateTimeComponent.get("hour") + 12);
            }
        }
        dateTimeComponent.addTags(dateComponent.tags());
        dateTimeComponent.addTags(timeComponent.tags());
        return dateTimeComponent;
    }

    class AbstractMergeDateTimeRefiner extends MergingRefiner {
        shouldMergeResults(textBetween, currentResult, nextResult) {
            return (((currentResult.start.isOnlyDate() && nextResult.start.isOnlyTime()) ||
                (nextResult.start.isOnlyDate() && currentResult.start.isOnlyTime())) &&
                textBetween.match(this.patternBetween()) != null);
        }
        mergeResults(textBetween, currentResult, nextResult) {
            const result = currentResult.start.isOnlyDate()
                ? mergeDateTimeResult(currentResult, nextResult)
                : mergeDateTimeResult(nextResult, currentResult);
            result.index = currentResult.index;
            result.text = currentResult.text + textBetween + nextResult.text;
            return result;
        }
    }

    class ENMergeDateTimeRefiner extends AbstractMergeDateTimeRefiner {
        patternBetween() {
            return new RegExp("^\\s*(T|at|after|before|on|of|,|-|\\.|∙|:)?\\s*$");
        }
    }

    const TIMEZONE_NAME_PATTERN = new RegExp("^\\s*,?\\s*\\(?([A-Z]{2,4})\\)?(?=\\W|$)", "i");
    class ExtractTimezoneAbbrRefiner {
        timezoneOverrides;
        constructor(timezoneOverrides) {
            this.timezoneOverrides = timezoneOverrides;
        }
        refine(context, results) {
            const timezoneOverrides = context.option.timezones ?? {};
            results.forEach((result) => {
                const suffix = context.text.substring(result.index + result.text.length);
                const match = TIMEZONE_NAME_PATTERN.exec(suffix);
                if (!match) {
                    return;
                }
                const timezoneAbbr = match[1].toUpperCase();
                const refDate = result.start.date() ?? result.refDate ?? new Date();
                const tzOverrides = { ...this.timezoneOverrides, ...timezoneOverrides };
                const extractedTimezoneOffset = toTimezoneOffset(timezoneAbbr, refDate, tzOverrides);
                if (extractedTimezoneOffset == null) {
                    return;
                }
                context.debug(() => {
                    console.log(`Extracting timezone: '${timezoneAbbr}' into: ${extractedTimezoneOffset} for: ${result.start}`);
                });
                const currentTimezoneOffset = result.start.get("timezoneOffset");
                if (currentTimezoneOffset !== null && extractedTimezoneOffset != currentTimezoneOffset) {
                    if (result.start.isCertain("timezoneOffset")) {
                        return;
                    }
                    if (timezoneAbbr != match[1]) {
                        return;
                    }
                }
                if (result.start.isOnlyDate()) {
                    if (timezoneAbbr != match[1]) {
                        return;
                    }
                }
                result.text += match[0];
                if (!result.start.isCertain("timezoneOffset")) {
                    result.start.assign("timezoneOffset", extractedTimezoneOffset);
                }
                if (result.end != null && !result.end.isCertain("timezoneOffset")) {
                    result.end.assign("timezoneOffset", extractedTimezoneOffset);
                }
            });
            return results;
        }
    }

    const TIMEZONE_OFFSET_PATTERN = new RegExp("^\\s*(?:\\(?(?:GMT|UTC)\\s?)?([+-])(\\d{1,2})(?::?(\\d{2}))?\\)?", "i");
    const TIMEZONE_OFFSET_SIGN_GROUP = 1;
    const TIMEZONE_OFFSET_HOUR_OFFSET_GROUP = 2;
    const TIMEZONE_OFFSET_MINUTE_OFFSET_GROUP = 3;
    class ExtractTimezoneOffsetRefiner {
        refine(context, results) {
            results.forEach(function (result) {
                if (result.start.isCertain("timezoneOffset")) {
                    return;
                }
                const suffix = context.text.substring(result.index + result.text.length);
                const match = TIMEZONE_OFFSET_PATTERN.exec(suffix);
                if (!match) {
                    return;
                }
                context.debug(() => {
                    console.log(`Extracting timezone: '${match[0]}' into : ${result}`);
                });
                const hourOffset = parseInt(match[TIMEZONE_OFFSET_HOUR_OFFSET_GROUP]);
                const minuteOffset = parseInt(match[TIMEZONE_OFFSET_MINUTE_OFFSET_GROUP] || "0");
                let timezoneOffset = hourOffset * 60 + minuteOffset;
                if (timezoneOffset > 14 * 60) {
                    return;
                }
                if (match[TIMEZONE_OFFSET_SIGN_GROUP] === "-") {
                    timezoneOffset = -timezoneOffset;
                }
                if (result.end != null) {
                    result.end.assign("timezoneOffset", timezoneOffset);
                }
                result.start.assign("timezoneOffset", timezoneOffset);
                result.text += match[0];
            });
            return results;
        }
    }

    class OverlapRemovalRefiner {
        refine(context, results) {
            if (results.length < 2) {
                return results;
            }
            const filteredResults = [];
            let prevResult = results[0];
            for (let i = 1; i < results.length; i++) {
                const result = results[i];
                if (result.index >= prevResult.index + prevResult.text.length) {
                    filteredResults.push(prevResult);
                    prevResult = result;
                    continue;
                }
                let kept = null;
                let removed = null;
                if (result.text.length > prevResult.text.length) {
                    kept = result;
                    removed = prevResult;
                }
                else {
                    kept = prevResult;
                    removed = result;
                }
                context.debug(() => {
                    console.log(`${this.constructor.name} remove ${removed} by ${kept}`);
                });
                prevResult = kept;
            }
            if (prevResult != null) {
                filteredResults.push(prevResult);
            }
            return filteredResults;
        }
    }

    function createParsingComponentsAtWeekday(reference, weekday, modifier) {
        const refDate = reference.getDateWithAdjustedTimezone();
        const daysToWeekday = getDaysToWeekday(refDate, weekday, modifier);
        let components = new ParsingComponents(reference);
        components = components.addDurationAsImplied({ day: daysToWeekday });
        components.assign("weekday", weekday);
        return components;
    }
    function getDaysToWeekday(refDate, weekday, modifier) {
        const refWeekday = refDate.getDay();
        switch (modifier) {
            case "this":
                return getDaysForwardToWeekday(refDate, weekday);
            case "last":
                return getBackwardDaysToWeekday(refDate, weekday);
            case "next":
                if (refWeekday == Weekday.SUNDAY) {
                    return weekday == Weekday.SUNDAY ? 7 : weekday;
                }
                if (refWeekday == Weekday.SATURDAY) {
                    if (weekday == Weekday.SATURDAY)
                        return 7;
                    if (weekday == Weekday.SUNDAY)
                        return 8;
                    return 1 + weekday;
                }
                if (weekday < refWeekday && weekday != Weekday.SUNDAY) {
                    return getDaysForwardToWeekday(refDate, weekday);
                }
                else {
                    return getDaysForwardToWeekday(refDate, weekday) + 7;
                }
        }
        return getDaysToWeekdayClosest(refDate, weekday);
    }
    function getDaysToWeekdayClosest(refDate, weekday) {
        const backward = getBackwardDaysToWeekday(refDate, weekday);
        const forward = getDaysForwardToWeekday(refDate, weekday);
        return forward < -backward ? forward : backward;
    }
    function getDaysForwardToWeekday(refDate, weekday) {
        const refWeekday = refDate.getDay();
        let forwardCount = weekday - refWeekday;
        if (forwardCount < 0) {
            forwardCount += 7;
        }
        return forwardCount;
    }
    function getBackwardDaysToWeekday(refDate, weekday) {
        const refWeekday = refDate.getDay();
        let backwardCount = weekday - refWeekday;
        if (backwardCount >= 0) {
            backwardCount -= 7;
        }
        return backwardCount;
    }

    class ForwardDateRefiner {
        refine(context, results) {
            if (!context.option.forwardDate) {
                return results;
            }
            results.forEach((result) => {
                let refDate = context.reference.getDateWithAdjustedTimezone();
                if (result.start.isOnlyTime() && context.reference.instant > result.start.date()) {
                    const refDate = context.reference.getDateWithAdjustedTimezone();
                    const refFollowingDay = new Date(refDate);
                    refFollowingDay.setDate(refFollowingDay.getDate() + 1);
                    implySimilarDate(result.start, refFollowingDay);
                    context.debug(() => {
                        console.log(`${this.constructor.name} adjusted ${result} time from the ref date (${refDate}) to the following day (${refFollowingDay})`);
                    });
                    if (result.end && result.end.isOnlyTime()) {
                        implySimilarDate(result.end, refFollowingDay);
                        if (result.start.date() > result.end.date()) {
                            refFollowingDay.setDate(refFollowingDay.getDate() + 1);
                            implySimilarDate(result.end, refFollowingDay);
                        }
                    }
                }
                if (result.start.isOnlyWeekdayComponent() && refDate > result.start.date()) {
                    let daysToAdd = getDaysForwardToWeekday(refDate, result.start.get("weekday")) || 7;
                    const forwardedWeekday = addDuration(refDate, { day: daysToAdd });
                    implySimilarDate(result.start, forwardedWeekday);
                    context.debug(() => {
                        console.log(`${this.constructor.name} adjusted ${result} weekday (${result.start})`);
                    });
                    if (result.end && result.start.date() > result.end.date()) {
                        let daysToAdd = getDaysForwardToWeekday(refDate, result.start.get("weekday")) || 7;
                        const forwardedWeekday = addDuration(refDate, { day: daysToAdd });
                        implySimilarDate(result.end, forwardedWeekday);
                        context.debug(() => {
                            console.log(`${this.constructor.name} adjusted ${result} weekday (${result.end})`);
                        });
                    }
                }
                if (result.start.isDateWithUnknownYear() && refDate > result.start.date()) {
                    for (let i = 0; i < 3 && refDate > result.start.date(); i++) {
                        result.start.imply("year", result.start.get("year") + 1);
                        context.debug(() => {
                            console.log(`${this.constructor.name} adjusted ${result} year (${result.start})`);
                        });
                        if (result.end && !result.end.isCertain("year")) {
                            result.end.imply("year", result.end.get("year") + 1);
                            context.debug(() => {
                                console.log(`${this.constructor.name} adjusted ${result} month (${result.start})`);
                            });
                        }
                    }
                }
            });
            return results;
        }
    }

    class UnlikelyFormatFilter extends Filter {
        strictMode;
        constructor(strictMode) {
            super();
            this.strictMode = strictMode;
        }
        isValid(context, result) {
            if (result.text.replace(" ", "").match(/^\d*(\.\d*)?$/)) {
                context.debug(() => {
                    console.log(`Removing unlikely result '${result.text}'`);
                });
                return false;
            }
            if (!result.start.isValidDate()) {
                context.debug(() => {
                    console.log(`Removing invalid result: ${result} (${result.start})`);
                });
                return false;
            }
            if (result.end && !result.end.isValidDate()) {
                context.debug(() => {
                    console.log(`Removing invalid result: ${result} (${result.end})`);
                });
                return false;
            }
            if (this.strictMode) {
                return this.isStrictModeValid(context, result);
            }
            return true;
        }
        isStrictModeValid(context, result) {
            if (result.start.isOnlyWeekdayComponent()) {
                context.debug(() => {
                    console.log(`(Strict) Removing weekday only component: ${result} (${result.end})`);
                });
                return false;
            }
            return true;
        }
    }

    const PATTERN$6 = new RegExp("([0-9]{4})\\-([0-9]{1,2})\\-([0-9]{1,2})" +
        "(?:T" +
        "([0-9]{1,2}):([0-9]{1,2})" +
        "(?:" +
        ":([0-9]{1,2})(?:\\.(\\d{1,4}))?" +
        ")?" +
        "(" +
        "Z|([+-]\\d{2}):?(\\d{2})?" +
        ")?" +
        ")?" +
        "(?=\\W|$)", "i");
    const YEAR_NUMBER_GROUP = 1;
    const MONTH_NUMBER_GROUP = 2;
    const DATE_NUMBER_GROUP = 3;
    const HOUR_NUMBER_GROUP = 4;
    const MINUTE_NUMBER_GROUP = 5;
    const SECOND_NUMBER_GROUP = 6;
    const MILLISECOND_NUMBER_GROUP = 7;
    const TZD_GROUP = 8;
    const TZD_HOUR_OFFSET_GROUP = 9;
    const TZD_MINUTE_OFFSET_GROUP = 10;
    class ISOFormatParser extends AbstractParserWithWordBoundaryChecking {
        innerPattern() {
            return PATTERN$6;
        }
        innerExtract(context, match) {
            const components = context.createParsingComponents({
                "year": parseInt(match[YEAR_NUMBER_GROUP]),
                "month": parseInt(match[MONTH_NUMBER_GROUP]),
                "day": parseInt(match[DATE_NUMBER_GROUP]),
            });
            if (match[HOUR_NUMBER_GROUP] != null) {
                components.assign("hour", parseInt(match[HOUR_NUMBER_GROUP]));
                components.assign("minute", parseInt(match[MINUTE_NUMBER_GROUP]));
                if (match[SECOND_NUMBER_GROUP] != null) {
                    components.assign("second", parseInt(match[SECOND_NUMBER_GROUP]));
                }
                if (match[MILLISECOND_NUMBER_GROUP] != null) {
                    components.assign("millisecond", parseInt(match[MILLISECOND_NUMBER_GROUP]));
                }
                if (match[TZD_GROUP] != null) {
                    let offset = 0;
                    if (match[TZD_HOUR_OFFSET_GROUP]) {
                        const hourOffset = parseInt(match[TZD_HOUR_OFFSET_GROUP]);
                        let minuteOffset = 0;
                        if (match[TZD_MINUTE_OFFSET_GROUP] != null) {
                            minuteOffset = parseInt(match[TZD_MINUTE_OFFSET_GROUP]);
                        }
                        offset = hourOffset * 60;
                        if (offset < 0) {
                            offset -= minuteOffset;
                        }
                        else {
                            offset += minuteOffset;
                        }
                    }
                    components.assign("timezoneOffset", offset);
                }
            }
            return components.addTag("parser/ISOFormatParser");
        }
    }

    class MergeWeekdayComponentRefiner extends MergingRefiner {
        mergeResults(textBetween, currentResult, nextResult) {
            const newResult = nextResult.clone();
            newResult.index = currentResult.index;
            newResult.text = currentResult.text + textBetween + newResult.text;
            newResult.start.assign("weekday", currentResult.start.get("weekday"));
            if (newResult.end) {
                newResult.end.assign("weekday", currentResult.start.get("weekday"));
            }
            return newResult;
        }
        shouldMergeResults(textBetween, currentResult, nextResult) {
            const weekdayThenNormalDate = currentResult.start.isOnlyWeekdayComponent() &&
                !currentResult.start.isCertain("hour") &&
                nextResult.start.isCertain("day");
            return weekdayThenNormalDate && textBetween.match(/^,?\s*$/) != null;
        }
    }

    function includeCommonConfiguration(configuration, strictMode = false) {
        configuration.parsers.unshift(new ISOFormatParser());
        configuration.refiners.unshift(new MergeWeekdayComponentRefiner());
        configuration.refiners.unshift(new ExtractTimezoneOffsetRefiner());
        configuration.refiners.unshift(new OverlapRemovalRefiner());
        configuration.refiners.push(new ExtractTimezoneAbbrRefiner());
        configuration.refiners.push(new OverlapRemovalRefiner());
        configuration.refiners.push(new ForwardDateRefiner());
        configuration.refiners.push(new UnlikelyFormatFilter(strictMode));
        return configuration;
    }

    function now(reference) {
        const targetDate = reference.getDateWithAdjustedTimezone();
        const component = new ParsingComponents(reference, {});
        assignSimilarDate(component, targetDate);
        assignSimilarTime(component, targetDate);
        component.assign("timezoneOffset", reference.getTimezoneOffset());
        component.addTag("casualReference/now");
        return component;
    }
    function today(reference) {
        const targetDate = reference.getDateWithAdjustedTimezone();
        const component = new ParsingComponents(reference, {});
        assignSimilarDate(component, targetDate);
        implySimilarTime(component, targetDate);
        component.delete("meridiem");
        component.addTag("casualReference/today");
        return component;
    }
    function yesterday(reference) {
        return theDayBefore(reference).addTag("casualReference/yesterday");
    }
    function tomorrow(reference) {
        return theDayAfter(reference, 1).addTag("casualReference/tomorrow");
    }
    function theDayBefore(reference, numDay) {
        return theDayAfter(reference, -1);
    }
    function theDayAfter(reference, nDays) {
        const targetDate = reference.getDateWithAdjustedTimezone();
        const component = new ParsingComponents(reference, {});
        const newDate = new Date(targetDate.getTime());
        newDate.setDate(newDate.getDate() + nDays);
        assignSimilarDate(component, newDate);
        implySimilarTime(component, newDate);
        component.delete("meridiem");
        return component;
    }
    function tonight(reference, implyHour = 22) {
        const targetDate = reference.getDateWithAdjustedTimezone();
        const component = new ParsingComponents(reference, {});
        assignSimilarDate(component, targetDate);
        component.imply("hour", implyHour);
        component.imply("meridiem", Meridiem.PM);
        component.addTag("casualReference/tonight");
        return component;
    }
    function evening(reference, implyHour = 20) {
        const component = new ParsingComponents(reference, {});
        component.imply("meridiem", Meridiem.PM);
        component.imply("hour", implyHour);
        component.addTag("casualReference/evening");
        return component;
    }
    function midnight(reference) {
        const component = new ParsingComponents(reference, {});
        if (reference.getDateWithAdjustedTimezone().getHours() > 2) {
            component.addDurationAsImplied({ day: 1 });
        }
        component.assign("hour", 0);
        component.imply("minute", 0);
        component.imply("second", 0);
        component.imply("millisecond", 0);
        component.addTag("casualReference/midnight");
        return component;
    }
    function morning(reference, implyHour = 6) {
        const component = new ParsingComponents(reference, {});
        component.imply("meridiem", Meridiem.AM);
        component.imply("hour", implyHour);
        component.imply("minute", 0);
        component.imply("second", 0);
        component.imply("millisecond", 0);
        component.addTag("casualReference/morning");
        return component;
    }
    function afternoon(reference, implyHour = 15) {
        const component = new ParsingComponents(reference, {});
        component.imply("meridiem", Meridiem.PM);
        component.imply("hour", implyHour);
        component.imply("minute", 0);
        component.imply("second", 0);
        component.imply("millisecond", 0);
        component.addTag("casualReference/afternoon");
        return component;
    }
    function noon(reference) {
        const component = new ParsingComponents(reference, {});
        component.imply("meridiem", Meridiem.AM);
        component.assign("hour", 12);
        component.imply("minute", 0);
        component.imply("second", 0);
        component.imply("millisecond", 0);
        component.addTag("casualReference/noon");
        return component;
    }

    const PATTERN$5 = /(now|today|tonight|tomorrow|overmorrow|tmr|tmrw|yesterday|last\s*night)(?=\W|$)/i;
    class ENCasualDateParser extends AbstractParserWithWordBoundaryChecking {
        innerPattern(context) {
            return PATTERN$5;
        }
        innerExtract(context, match) {
            let targetDate = context.refDate;
            const lowerText = match[0].toLowerCase();
            let component = context.createParsingComponents();
            switch (lowerText) {
                case "now":
                    component = now(context.reference);
                    break;
                case "today":
                    component = today(context.reference);
                    break;
                case "yesterday":
                    component = yesterday(context.reference);
                    break;
                case "tomorrow":
                case "tmr":
                case "tmrw":
                    component = tomorrow(context.reference);
                    break;
                case "tonight":
                    component = tonight(context.reference);
                    break;
                case "overmorrow":
                    component = theDayAfter(context.reference, 2);
                    break;
                default:
                    if (lowerText.match(/last\s*night/)) {
                        if (targetDate.getHours() > 6) {
                            const previousDay = new Date(targetDate.getTime());
                            previousDay.setDate(previousDay.getDate() - 1);
                            targetDate = previousDay;
                        }
                        assignSimilarDate(component, targetDate);
                        component.imply("hour", 0);
                    }
                    break;
            }
            component.addTag("parser/ENCasualDateParser");
            return component;
        }
    }

    const PATTERN$4 = /(?:this)?\s{0,3}(morning|afternoon|evening|night|midnight|midday|noon)(?=\W|$)/i;
    class ENCasualTimeParser extends AbstractParserWithWordBoundaryChecking {
        innerPattern() {
            return PATTERN$4;
        }
        innerExtract(context, match) {
            let component = null;
            switch (match[1].toLowerCase()) {
                case "afternoon":
                    component = afternoon(context.reference);
                    break;
                case "evening":
                case "night":
                    component = evening(context.reference);
                    break;
                case "midnight":
                    component = midnight(context.reference);
                    break;
                case "morning":
                    component = morning(context.reference);
                    break;
                case "noon":
                case "midday":
                    component = noon(context.reference);
                    break;
            }
            if (component) {
                component.addTag("parser/ENCasualTimeParser");
            }
            return component;
        }
    }

    const PATTERN$3 = new RegExp("(?:(?:\\,|\\(|\\（)\\s*)?" +
        "(?:on\\s*?)?" +
        "(?:(this|last|past|next)\\s*)?" +
        `(${matchAnyPattern(WEEKDAY_DICTIONARY)}|weekend|weekday)` +
        "(?:\\s*(?:\\,|\\)|\\）))?" +
        "(?:\\s*(?:of\\s*)?(this|last|past|next)\\s*week)?" +
        "(?=\\W|$)", "i");
    const PREFIX_GROUP = 1;
    const WEEKDAY_GROUP = 2;
    const POSTFIX_GROUP = 3;
    class ENWeekdayParser extends AbstractParserWithWordBoundaryChecking {
        innerPattern() {
            return PATTERN$3;
        }
        innerExtract(context, match) {
            const prefix = match[PREFIX_GROUP];
            const postfix = match[POSTFIX_GROUP];
            let modifierWord = prefix || postfix;
            modifierWord = modifierWord || "";
            modifierWord = modifierWord.toLowerCase();
            let modifier = null;
            if (modifierWord == "last" || modifierWord == "past") {
                modifier = "last";
            }
            else if (modifierWord == "next") {
                modifier = "next";
            }
            else if (modifierWord == "this") {
                modifier = "this";
            }
            const weekday_word = match[WEEKDAY_GROUP].toLowerCase();
            let weekday;
            if (WEEKDAY_DICTIONARY[weekday_word] !== undefined) {
                weekday = WEEKDAY_DICTIONARY[weekday_word];
            }
            else if (weekday_word == "weekend") {
                weekday = modifier == "last" ? Weekday.SUNDAY : Weekday.SATURDAY;
            }
            else if (weekday_word == "weekday") {
                const refWeekday = context.reference.getDateWithAdjustedTimezone().getDay();
                if (refWeekday == Weekday.SUNDAY || refWeekday == Weekday.SATURDAY) {
                    weekday = modifier == "last" ? Weekday.FRIDAY : Weekday.MONDAY;
                }
                else {
                    weekday = refWeekday - 1;
                    weekday = modifier == "last" ? weekday - 1 : weekday + 1;
                    weekday = (weekday % 5) + 1;
                }
            }
            else {
                return null;
            }
            return createParsingComponentsAtWeekday(context.reference, weekday, modifier);
        }
    }

    const PATTERN$2 = new RegExp(`(this|last|past|next|after\\s*this)\\s*(${matchAnyPattern(TIME_UNIT_DICTIONARY)})(?=\\s*)` + "(?=\\W|$)", "i");
    const MODIFIER_WORD_GROUP = 1;
    const RELATIVE_WORD_GROUP = 2;
    class ENRelativeDateFormatParser extends AbstractParserWithWordBoundaryChecking {
        innerPattern() {
            return PATTERN$2;
        }
        innerExtract(context, match) {
            const modifier = match[MODIFIER_WORD_GROUP].toLowerCase();
            const unitWord = match[RELATIVE_WORD_GROUP].toLowerCase();
            const timeunit = TIME_UNIT_DICTIONARY[unitWord];
            if (modifier == "next" || modifier.startsWith("after")) {
                const timeUnits = {};
                timeUnits[timeunit] = 1;
                return ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
            }
            if (modifier == "last" || modifier == "past") {
                const timeUnits = {};
                timeUnits[timeunit] = -1;
                return ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
            }
            const components = context.createParsingComponents();
            let date = new Date(context.reference.instant.getTime());
            if (unitWord.match(/week/i)) {
                date.setDate(date.getDate() - date.getDay());
                components.imply("day", date.getDate());
                components.imply("month", date.getMonth() + 1);
                components.imply("year", date.getFullYear());
            }
            else if (unitWord.match(/month/i)) {
                date.setDate(1);
                components.imply("day", date.getDate());
                components.assign("year", date.getFullYear());
                components.assign("month", date.getMonth() + 1);
            }
            else if (unitWord.match(/year/i)) {
                date.setDate(1);
                date.setMonth(0);
                components.imply("day", date.getDate());
                components.imply("month", date.getMonth() + 1);
                components.assign("year", date.getFullYear());
            }
            return components;
        }
    }

    const PATTERN$1 = new RegExp("([^\\d]|^)" +
        "([0-3]{0,1}[0-9]{1})[\\/\\.\\-]([0-3]{0,1}[0-9]{1})" +
        "(?:[\\/\\.\\-]([0-9]{4}|[0-9]{2}))?" +
        "(\\W|$)", "i");
    const OPENING_GROUP = 1;
    const ENDING_GROUP = 5;
    const FIRST_NUMBERS_GROUP = 2;
    const SECOND_NUMBERS_GROUP = 3;
    const YEAR_GROUP$1 = 4;
    class SlashDateFormatParser {
        groupNumberMonth;
        groupNumberDay;
        constructor(littleEndian) {
            this.groupNumberMonth = littleEndian ? SECOND_NUMBERS_GROUP : FIRST_NUMBERS_GROUP;
            this.groupNumberDay = littleEndian ? FIRST_NUMBERS_GROUP : SECOND_NUMBERS_GROUP;
        }
        pattern() {
            return PATTERN$1;
        }
        extract(context, match) {
            const index = match.index + match[OPENING_GROUP].length;
            const indexEnd = match.index + match[0].length - match[ENDING_GROUP].length;
            if (index > 0) {
                const textBefore = context.text.substring(0, index);
                if (textBefore.match("\\d/?$")) {
                    return;
                }
            }
            if (indexEnd < context.text.length) {
                const textAfter = context.text.substring(indexEnd);
                if (textAfter.match("^/?\\d")) {
                    return;
                }
            }
            const text = context.text.substring(index, indexEnd);
            if (text.match(/^\d\.\d$/) || text.match(/^\d\.\d{1,2}\.\d{1,2}\s*$/)) {
                return;
            }
            if (!match[YEAR_GROUP$1] && text.indexOf("/") < 0) {
                return;
            }
            const result = context.createParsingResult(index, text);
            let month = parseInt(match[this.groupNumberMonth]);
            let day = parseInt(match[this.groupNumberDay]);
            if (month < 1 || month > 12) {
                if (month > 12) {
                    if (day >= 1 && day <= 12 && month <= 31) {
                        [day, month] = [month, day];
                    }
                    else {
                        return null;
                    }
                }
            }
            if (day < 1 || day > 31) {
                return null;
            }
            result.start.assign("day", day);
            result.start.assign("month", month);
            if (match[YEAR_GROUP$1]) {
                const rawYearNumber = parseInt(match[YEAR_GROUP$1]);
                const year = findMostLikelyADYear(rawYearNumber);
                result.start.assign("year", year);
            }
            else {
                const year = findYearClosestToRef(context.refDate, day, month);
                result.start.imply("year", year);
            }
            return result.addTag("parser/SlashDateFormatParser");
        }
    }

    const PATTERN = new RegExp(`(this|last|past|next|after|\\+|-)\\s*(${TIME_UNITS_PATTERN})(?=\\W|$)`, "i");
    const PATTERN_NO_ABBR = new RegExp(`(this|last|past|next|after|\\+|-)\\s*(${TIME_UNITS_NO_ABBR_PATTERN})(?=\\W|$)`, "i");
    class ENTimeUnitCasualRelativeFormatParser extends AbstractParserWithWordBoundaryChecking {
        allowAbbreviations;
        constructor(allowAbbreviations = true) {
            super();
            this.allowAbbreviations = allowAbbreviations;
        }
        innerPattern() {
            return this.allowAbbreviations ? PATTERN : PATTERN_NO_ABBR;
        }
        innerExtract(context, match) {
            const prefix = match[1].toLowerCase();
            let duration = parseDuration(match[2]);
            if (!duration) {
                return null;
            }
            switch (prefix) {
                case "last":
                case "past":
                case "-":
                    duration = reverseDuration(duration);
                    break;
            }
            return ParsingComponents.createRelativeFromReference(context.reference, duration);
        }
    }

    function IsPositiveFollowingReference(result) {
        return result.text.match(/^[+-]/i) != null;
    }
    function IsNegativeFollowingReference(result) {
        return result.text.match(/^-/i) != null;
    }
    class ENMergeRelativeAfterDateRefiner extends MergingRefiner {
        shouldMergeResults(textBetween, currentResult, nextResult) {
            if (!textBetween.match(/^\s*$/i)) {
                return false;
            }
            return IsPositiveFollowingReference(nextResult) || IsNegativeFollowingReference(nextResult);
        }
        mergeResults(textBetween, currentResult, nextResult, context) {
            let timeUnits = parseDuration(nextResult.text);
            if (IsNegativeFollowingReference(nextResult)) {
                timeUnits = reverseDuration(timeUnits);
            }
            const components = ParsingComponents.createRelativeFromReference(ReferenceWithTimezone.fromDate(currentResult.start.date()), timeUnits);
            return new ParsingResult(currentResult.reference, currentResult.index, `${currentResult.text}${textBetween}${nextResult.text}`, components);
        }
    }

    function hasImpliedEarlierReferenceDate(result) {
        return result.text.match(/\s+(before|from)$/i) != null;
    }
    function hasImpliedLaterReferenceDate(result) {
        return result.text.match(/\s+(after|since)$/i) != null;
    }
    class ENMergeRelativeFollowByDateRefiner extends MergingRefiner {
        patternBetween() {
            return /^\s*$/i;
        }
        shouldMergeResults(textBetween, currentResult, nextResult) {
            if (!textBetween.match(this.patternBetween())) {
                return false;
            }
            if (!hasImpliedEarlierReferenceDate(currentResult) && !hasImpliedLaterReferenceDate(currentResult)) {
                return false;
            }
            return !!nextResult.start.get("day") && !!nextResult.start.get("month") && !!nextResult.start.get("year");
        }
        mergeResults(textBetween, currentResult, nextResult) {
            let duration = parseDuration(currentResult.text);
            if (hasImpliedEarlierReferenceDate(currentResult)) {
                duration = reverseDuration(duration);
            }
            const components = ParsingComponents.createRelativeFromReference(ReferenceWithTimezone.fromDate(nextResult.start.date()), duration);
            return new ParsingResult(nextResult.reference, currentResult.index, `${currentResult.text}${textBetween}${nextResult.text}`, components);
        }
    }

    const YEAR_SUFFIX_PATTERN = new RegExp(`^\\s*(${YEAR_PATTERN$1})`, "i");
    const YEAR_GROUP = 1;
    class ENExtractYearSuffixRefiner {
        refine(context, results) {
            results.forEach(function (result) {
                if (!result.start.isDateWithUnknownYear()) {
                    return;
                }
                const suffix = context.text.substring(result.index + result.text.length);
                const match = YEAR_SUFFIX_PATTERN.exec(suffix);
                if (!match) {
                    return;
                }
                if (match[0].trim().length <= 3) {
                    return;
                }
                context.debug(() => {
                    console.log(`Extracting year: '${match[0]}' into : ${result}`);
                });
                const year = parseYear(match[YEAR_GROUP]);
                if (result.end != null) {
                    result.end.assign("year", year);
                }
                result.start.assign("year", year);
                result.text += match[0];
            });
            return results;
        }
    }

    class ENUnlikelyFormatFilter extends Filter {
        constructor() {
            super();
        }
        isValid(context, result) {
            const text = result.text.trim();
            if (text === context.text.trim()) {
                return true;
            }
            if (text.toLowerCase() === "may") {
                const textBefore = context.text.substring(0, result.index).trim();
                if (!textBefore.match(/\b(in)$/i)) {
                    context.debug(() => {
                        console.log(`Removing unlikely result: ${result}`);
                    });
                    return false;
                }
            }
            if (text.toLowerCase().endsWith("the second")) {
                const textAfter = context.text.substring(result.index + result.text.length).trim();
                if (textAfter.length > 0) {
                    context.debug(() => {
                        console.log(`Removing unlikely result: ${result}`);
                    });
                }
                return false;
            }
            return true;
        }
    }

    class ENDefaultConfiguration {
        createCasualConfiguration(littleEndian = false) {
            const option = this.createConfiguration(false, littleEndian);
            option.parsers.push(new ENCasualDateParser());
            option.parsers.push(new ENCasualTimeParser());
            option.parsers.push(new ENMonthNameParser());
            option.parsers.push(new ENRelativeDateFormatParser());
            option.parsers.push(new ENTimeUnitCasualRelativeFormatParser());
            option.refiners.push(new ENUnlikelyFormatFilter());
            return option;
        }
        createConfiguration(strictMode = true, littleEndian = false) {
            const options = includeCommonConfiguration({
                parsers: [
                    new SlashDateFormatParser(littleEndian),
                    new ENTimeUnitWithinFormatParser(strictMode),
                    new ENMonthNameLittleEndianParser(),
                    new ENMonthNameMiddleEndianParser(littleEndian),
                    new ENWeekdayParser(),
                    new ENSlashMonthFormatParser(),
                    new ENTimeExpressionParser(strictMode),
                    new ENTimeUnitAgoFormatParser(strictMode),
                    new ENTimeUnitLaterFormatParser(strictMode),
                    new ENYearMonthNameParser(),
                ],
                refiners: [new ENMergeDateTimeRefiner()],
            }, strictMode);
            options.parsers.unshift(new ENYearMonthDayParser(strictMode));
            options.refiners.unshift(new ENMergeRelativeFollowByDateRefiner());
            options.refiners.unshift(new ENMergeRelativeAfterDateRefiner());
            options.refiners.unshift(new OverlapRemovalRefiner());
            options.refiners.push(new ENMergeDateTimeRefiner());
            options.refiners.push(new ENExtractYearSuffixRefiner());
            options.refiners.push(new ENMergeDateRangeRefiner());
            return options;
        }
    }

    class Chrono {
        parsers;
        refiners;
        defaultConfig = new ENDefaultConfiguration();
        constructor(configuration) {
            configuration = configuration || this.defaultConfig.createCasualConfiguration();
            this.parsers = [...configuration.parsers];
            this.refiners = [...configuration.refiners];
        }
        clone() {
            return new Chrono({
                parsers: [...this.parsers],
                refiners: [...this.refiners],
            });
        }
        parseDate(text, referenceDate, option) {
            const results = this.parse(text, referenceDate, option);
            return results.length > 0 ? results[0].start.date() : null;
        }
        parse(text, referenceDate, option) {
            const context = new ParsingContext(text, referenceDate, option);
            let results = [];
            this.parsers.forEach((parser) => {
                const parsedResults = Chrono.executeParser(context, parser);
                results = results.concat(parsedResults);
            });
            results.sort((a, b) => {
                return a.index - b.index;
            });
            this.refiners.forEach(function (refiner) {
                results = refiner.refine(context, results);
            });
            return results;
        }
        static executeParser(context, parser) {
            const results = [];
            const pattern = parser.pattern(context);
            const originalText = context.text;
            let remainingText = context.text;
            let match = pattern.exec(remainingText);
            while (match) {
                const index = match.index + originalText.length - remainingText.length;
                match.index = index;
                const result = parser.extract(context, match);
                if (!result) {
                    remainingText = originalText.substring(match.index + 1);
                    match = pattern.exec(remainingText);
                    continue;
                }
                let parsedResult = null;
                if (result instanceof ParsingResult) {
                    parsedResult = result;
                }
                else if (result instanceof ParsingComponents) {
                    parsedResult = context.createParsingResult(match.index, match[0]);
                    parsedResult.start = result;
                }
                else {
                    parsedResult = context.createParsingResult(match.index, match[0], result);
                }
                const parsedIndex = parsedResult.index;
                const parsedText = parsedResult.text;
                context.debug(() => console.log(`${parser.constructor.name} extracted (at index=${parsedIndex}) '${parsedText}'`));
                results.push(parsedResult);
                remainingText = originalText.substring(parsedIndex + parsedText.length);
                match = pattern.exec(remainingText);
            }
            return results;
        }
    }
    class ParsingContext {
        text;
        option;
        reference;
        refDate;
        constructor(text, refDate, option) {
            this.text = text;
            this.option = option ?? {};
            this.reference = ReferenceWithTimezone.fromInput(refDate, this.option.timezones);
            this.refDate = this.reference.instant;
        }
        createParsingComponents(components) {
            if (components instanceof ParsingComponents) {
                return components;
            }
            return new ParsingComponents(this.reference, components);
        }
        createParsingResult(index, textOrEndIndex, startComponents, endComponents) {
            const text = typeof textOrEndIndex === "string" ? textOrEndIndex : this.text.substring(index, textOrEndIndex);
            const start = startComponents ? this.createParsingComponents(startComponents) : null;
            const end = endComponents ? this.createParsingComponents(endComponents) : null;
            return new ParsingResult(this.reference, index, text, start, end);
        }
        debug(block) {
            if (this.option.debug) {
                if (this.option.debug instanceof Function) {
                    this.option.debug(block);
                }
                else {
                    const handler = this.option.debug;
                    handler.debug(block);
                }
            }
        }
    }

    const configuration = new ENDefaultConfiguration();
    const casual$1 = new Chrono(configuration.createCasualConfiguration(false));
    new Chrono(configuration.createConfiguration(true, false));
    new Chrono(configuration.createCasualConfiguration(true));

    const casual = casual$1;
    function parseDate(text, ref, option) {
        return casual.parseDate(text, ref, option);
    }

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
        constructor() {
            this.basicDate = "";
            this.demoDate = "";
            this.dobDate = "";
            this.dropdownDate = "";
            this.inputDate = "2025-06-01";
            this.inputValue = formatDate(this.inputDate, "en-US", "2-digit");
            this.naturalDate = toIsoDate(parseDate("In 2 days", demoReferenceDate));
            this.naturalValue = "In 2 days";
            this.rangeEnd = "2026-09-15";
            this.rangeStart = "2026-09-10";
            this.rtlDate = "";
            this.time = "10:30:00";
            this.timeDate = "";
        }
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
            var _a;
            if (event && event.key !== "ArrowDown")
                return;
            event === null || event === void 0 ? void 0 : event.preventDefault();
            (_a = document.getElementById(id)) === null || _a === void 0 ? void 0 : _a.setAttribute("data-open", "true");
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
            var _a;
            (_a = document.getElementById(id)) === null || _a === void 0 ? void 0 : _a.setAttribute("data-open", "false");
        }
    }
    window.angular
        .module("datePickerDemo", ["ui"])
        .controller("DatePickerDemoController", DatePickerDemoController);

})();
