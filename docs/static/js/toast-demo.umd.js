(function () {
    'use strict';

    class ToastDemoController {
        descriptionVisible = false;
        descriptionStatus = "Ready";
        position = "bottom-right";
        positionVisible = false;
        type = "default";
        typeMessage = "Event has been created";
        typeVisible = false;
        promiseVersion = 0;
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
        .createModule("toastDemo", ["angular.css"])
        .controller("ToastDemoController", ToastDemoController);

})();
