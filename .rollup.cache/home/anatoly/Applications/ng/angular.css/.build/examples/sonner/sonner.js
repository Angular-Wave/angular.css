import { CircleCheck, CircleX, createElement, Info, LoaderCircle, TriangleAlert, X, } from "lucide";
const toastIcons = {
    close: X,
    error: CircleX,
    info: Info,
    loading: LoaderCircle,
    success: CircleCheck,
    warning: TriangleAlert,
};
class SonnerDemoController {
    constructor() {
        this.descriptionVisible = false;
        this.descriptionStatus = "Ready";
        this.position = "bottom-right";
        this.positionVisible = false;
        this.type = "default";
        this.typeMessage = "Event has been created";
        this.typeVisible = false;
        this.promiseVersion = 0;
    }
    showDescription() {
        this.descriptionVisible = true;
        this.descriptionStatus = "Toast shown";
    }
    dismissDescription() {
        this.descriptionVisible = false;
        this.descriptionStatus = "Toast dismissed";
    }
    showPosition(position) {
        this.position = position;
        this.positionVisible = true;
    }
    dismissPosition() {
        this.positionVisible = false;
    }
    showType(type) {
        this.promiseVersion += 1;
        this.type = type;
        this.typeMessage =
            type === "info"
                ? "Be at the area 10 minutes before the event time"
                : type === "warning"
                    ? "Event start time cannot be earlier than 8am"
                    : type === "error"
                        ? "Event has not been created"
                        : "Event has been created";
        this.typeVisible = true;
    }
    showPromise() {
        const version = ++this.promiseVersion;
        this.type = "loading";
        this.typeMessage = "Loading...";
        this.typeVisible = true;
        window.setTimeout(() => {
            if (version !== this.promiseVersion)
                return;
            this.type = "success";
            this.typeMessage = "Event has been created";
        }, 800);
    }
    dismissType() {
        this.promiseVersion += 1;
        this.typeVisible = false;
    }
}
window.angular
    .module("sonnerDemo", ["ui"])
    .directive("ngSonnerIcon", () => ({
    link(_scope, element) {
        const type = element.getAttribute("ng-sonner-icon");
        const icon = type ? toastIcons[type] : undefined;
        if (!icon)
            return;
        element.replaceChildren(createElement(icon, {
            "aria-hidden": "true",
            focusable: "false",
            height: 16,
            width: 16,
        }));
    },
}))
    .controller("SonnerDemoController", SonnerDemoController);
