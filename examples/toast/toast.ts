import type {} from "@angular-wave/angular.ts";

type ToastPosition =
  | "bottom-center"
  | "bottom-left"
  | "bottom-right"
  | "top-center"
  | "top-left"
  | "top-right";

type ToastType =
  | "default"
  | "error"
  | "info"
  | "loading"
  | "success"
  | "warning";

class ToastDemoController {
  descriptionVisible = false;
  descriptionStatus = "Ready";
  position: ToastPosition = "bottom-right";
  positionVisible = false;
  type: ToastType = "default";
  typeMessage = "Event has been created";
  typeVisible = false;

  private promiseVersion = 0;

  showDescription(): void {
    this.descriptionVisible = true;
    this.descriptionStatus = "Toast shown";
  }

  dismissDescription(): void {
    this.descriptionVisible = false;
    this.descriptionStatus = "Toast dismissed";
  }

  showPosition(position: ToastPosition): void {
    this.position = position;
    this.positionVisible = true;
  }

  dismissPosition(): void {
    this.positionVisible = false;
  }

  showType(type: Exclude<ToastType, "loading">): void {
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

  showPromise(): void {
    const version = ++this.promiseVersion;
    this.type = "loading";
    this.typeMessage = "Loading...";
    this.typeVisible = true;

    window.setTimeout(() => {
      if (version !== this.promiseVersion) return;
      this.type = "success";
      this.typeMessage = "Event has been created";
    }, 800);
  }

  dismissType(): void {
    this.promiseVersion += 1;
    this.typeVisible = false;
  }
}

window.angular
  .module("toastDemo", ["angular.css"])
  .controller("ToastDemoController", ToastDemoController);
